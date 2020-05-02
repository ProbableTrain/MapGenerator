import * as log from 'loglevel';
import Vector from '../vector';
import {Node} from './graph';
import PolygonUtil from './polygon_util';
import TensorField from './tensor_field';

export interface PolygonParams {
    maxLength: number;
    minArea: number;
    shrinkSpacing: number;
    chanceNoDivide: number;
}

/**
 * Finds polygons in a graph, used for finding lots and parks
 */
export default class PolygonFinder {
    private _polygons: Vector[][] = [];
    private _shrunkPolygons: Vector[][] = [];
    private _dividedPolygons: Vector[][] = [];
    private toShrink: Vector[][] = [];
    private resolveShrink: () => void;
    private toDivide: Vector[][] = [];
    private resolveDivide: () => void;

    constructor(private nodes: Node[], private params: PolygonParams, private tensorField: TensorField) {}

    get polygons(): Vector[][] {
        if (this._dividedPolygons.length > 0) {
            return this._dividedPolygons;
        }

        if (this._shrunkPolygons.length > 0) {
            return this._shrunkPolygons;
        }

        return this._polygons;
    }

    reset(): void {
        this.toShrink = [];
        this.toDivide = [];
        this._polygons = [];
        this._shrunkPolygons = []
        this._dividedPolygons = [];
    }

    update(): boolean {
        let change = false;
        if (this.toShrink.length > 0) {
            const resolve = this.toShrink.length === 1;
            if (this.stepShrink(this.toShrink.pop())) {
                change = true;
            }
            
            if (resolve) this.resolveShrink();
        }

        if (this.toDivide.length > 0) {
            const resolve = this.toDivide.length === 1;
            if (this.stepDivide(this.toDivide.pop())) {
                change = true;
            }

            if (resolve) this.resolveDivide();
        }
        return change;
    }

    /**
     * Properly shrink polygon so the edges are all the same distance from the road
     */
    async shrink(animate=false): Promise<void> {
        return new Promise<void>(resolve => {
            if (this._polygons.length === 0) {
                this.findPolygons();
            }
            
            if (animate) {
                if (this._polygons.length === 0) {
                    resolve();
                    return;
                }

                this.toShrink = this._polygons.slice();
                this.resolveShrink = resolve;
            } else {
                this._shrunkPolygons = [];
                for (const p of this._polygons) {
                    this.stepShrink(p);
                }
                resolve();
            }
        });
    }

    private stepShrink(polygon: Vector[]): boolean {
        const shrunk = PolygonUtil.resizeGeometry(polygon, -this.params.shrinkSpacing);
        if (shrunk.length > 0) {
            this._shrunkPolygons.push(shrunk)
            return true;
        }
        return false;
    }

    async divide(animate=false): Promise<void> {
        return new Promise<void>(resolve => {
            if (this._polygons.length === 0) {
                this.findPolygons();
            }

            let polygons = this._polygons;
            if (this._shrunkPolygons.length > 0) {
                polygons = this._shrunkPolygons;
            }

            if (animate) {
                if (polygons.length === 0) {
                    resolve();
                    return;
                }

                this.toDivide = polygons.slice();
                this.resolveDivide = resolve;
            } else {
                this._dividedPolygons = [];
                for (const p of polygons) {
                    this.stepDivide(p);
                }
                resolve();
            }
        });
    }

    private stepDivide(polygon: Vector[]): boolean {
        // TODO need to filter shrunk polygons using aspect ratio, area 
        // this skips the filter in PolygonUtil.subdividePolygon
        if (this.params.chanceNoDivide > 0 && Math.random() < this.params.chanceNoDivide) {
            this._dividedPolygons.push(polygon);
            return true;
        }
        const divided = PolygonUtil.subdividePolygon(polygon, this.params.minArea);
        if (divided.length > 0) {
            this._dividedPolygons.push(...divided);
            return true;
        }
        return false;
    }

    findPolygons(): void {
        // Node
        // x, y, value (Vector2), adj (list of node refs)
        // Gonna edit adj for now

        // Walk a clockwise path until polygon found or limit reached
        // When we find a polygon, mark all edges as traversed (in particular direction)
        // Each edge separates two polygons
        // If edge already traversed in this direction, this polygon has already been found
        this._shrunkPolygons = [];
        this._dividedPolygons = [];
        const polygons = [];

        for (const node of this.nodes) {
            if (node.adj.length < 2) continue;
            for (const nextNode of node.adj) {
                const polygon = this.recursiveWalk([node, nextNode]);
                if (polygon !== null && polygon.length < this.params.maxLength) {
                    this.removePolygonAdjacencies(polygon);
                    polygons.push(polygon.map(n => n.value.clone()));
                }
            }
        }

        this._polygons = this.filterPolygonsByWater(polygons);
    }

    private filterPolygonsByWater(polygons: Vector[][]): Vector[][] {
        const out: Vector[][] = [];
        for (const p of polygons) {
            const averagePoint = PolygonUtil.averagePoint(p);
            if (this.tensorField.onLand(averagePoint) && !this.tensorField.inParks(averagePoint)) out.push(p);
        }
        return out;
    }

    private removePolygonAdjacencies(polygon: Node[]): void {
        for (let i = 0; i < polygon.length; i++) {
            const current = polygon[i];
            const next = polygon[(i + 1) % polygon.length];

            const index = current.adj.indexOf(next);
            if (index >= 0) {
                current.adj.splice(index, 1);
            } else {
                log.error("PolygonFinder - node not in adj");
            }
        }
    }

    private recursiveWalk(visited: Node[], count=0): Node[] {
        if (count >= this.params.maxLength) return null;
        // TODO backtracking to find polygons with dead end roads inside them
        const nextNode = this.getRightmostNode(visited[visited.length - 2], visited[visited.length - 1]);
        if (nextNode === null) {
            return null;  // Currently ignores polygons with dead end inside
        }

        const visitedIndex = visited.indexOf(nextNode);
        if (visitedIndex >= 0) {
            return visited.slice(visitedIndex);
        } else {
            visited.push(nextNode);
            return this.recursiveWalk(visited, count++);
        }
    }

    private getRightmostNode(nodeFrom: Node, nodeTo: Node): Node {
        // We want to turn right at every junction
        if (nodeTo.adj.length === 0) return null;

        const backwardsDifferenceVector = nodeFrom.value.clone().sub(nodeTo.value);
        const transformAngle = Math.atan2(backwardsDifferenceVector.y, backwardsDifferenceVector.x);

        let rightmostNode = null;
        let smallestTheta = Math.PI * 2;

        for (const nextNode of nodeTo.adj) {
            if (nextNode !== nodeFrom) {
                const nextVector = nextNode.value.clone().sub(nodeTo.value);
                let nextAngle = Math.atan2(nextVector.y, nextVector.x) - transformAngle;
                if (nextAngle < 0) {
                    nextAngle += Math.PI * 2;
                }

                if (nextAngle < smallestTheta) {
                    smallestTheta = nextAngle;
                    rightmostNode = nextNode;
                }
            }
        }

        return rightmostNode;
    }
}
