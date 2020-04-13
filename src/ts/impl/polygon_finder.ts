import * as log from 'loglevel';
import * as PolyK from 'polyk';
import Vector from '../vector';
import {Node} from './graph';

export default class PolygonFinder {
    public polygons: Vector[][] = [];

    constructor(private nodes: Node[], private maxLength=20, private minArea=80, private shrinkAmount=0.75) {
        this.polygons = this.findPolygons(this.nodes);
    }

    shrink(): Vector[][] {
        this.polygons = this.polygons.map(p => this.shrinkPolygon(p, this.shrinkAmount));
        return this.polygons;
    }

    divide(): Vector[][] {
        let divided: Vector[][] = [];
        this.polygons.forEach(p => {
            divided = divided.concat(this.subdividePolygon(p));
        });
        this.polygons = divided;
        return divided;
    }

    private findPolygons(nodes: Node[]): Vector[][] {
        // Node
        // x, y, value (Vector2), adj (list of node refs)
        // Gonna edit adj for now

        // Walk a clockwise path until polygon found or limit reached
        // When we find a polygon, mark all edges as traversed (in particular direction)
        // Each edge separates two polygons
        // If edge already traversed in this direction, this polygon has already been found
        const polygons = [];

        for (let node of nodes) {
            if (node.adj.length === 0) continue;
            for (let nextNode of node.adj) {
                const polygon = this.recursiveWalk([node, nextNode]);
                if (polygon !== null) {
                    this.removePolygonAdjacencies(polygon);
                    polygons.push(polygon.map(n => n.value.clone()));
                }
            }
        }

        return polygons;
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
        if (count >= this.maxLength) return null;
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

        for (let nextNode of nodeTo.adj) {
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

    private shrinkPolygon(polygon: Vector[], amount: number) {
        // Returns clone
        if (polygon.length < 3) {
            return;
        }

        const averagePoint = polygon[0].clone();
        for (let i = 1; i < polygon.length; i++) {
            averagePoint.add(polygon[i]);
        }

        averagePoint.multiplyScalar(1 / polygon.length);

        return polygon.map(v => v.clone().sub(averagePoint).multiplyScalar(amount).add(averagePoint));
    }

    private subdividePolygon(p: Vector[]): Vector[][] {
        if (this.calcPolygonArea(p) < this.minArea) {
            return [p];
        }

        let divided: Vector[][] = [];  // Array of polygons

        let longestSideLength = 0;
        let longestSide = [p[0], p[1]];

        for (let i = 0; i < p.length; i++) {
            const sideLength = p[i].clone().sub(p[(i+1) % p.length]).length();
            if (sideLength > longestSideLength) {
                longestSideLength = sideLength;
                longestSide = [p[i], p[(i+1) % p.length]];
            }
        }

        // Between 0.4 and 0.6
        const deviation = (Math.random() * 0.2) + 0.4;

        const averagePoint = longestSide[0].clone().add(longestSide[1]).multiplyScalar(deviation);
        const differenceVector = longestSide[0].clone().sub(longestSide[1]);
        const perpVector = (new Vector(differenceVector.y, -1 * differenceVector.x))
            .normalize()
            .multiplyScalar(100);

        const bisect = [averagePoint.clone().add(perpVector), averagePoint.clone().sub(perpVector)];

        // Array of polygons
        const sliced = PolyK.Slice(this.polygonToPolygonArray(p), bisect[0].x, bisect[0].y, bisect[1].x, bisect[1].y);

        // TODO recursive call
        sliced.forEach(s => {
            divided = divided.concat(this.subdividePolygon(this.polygonArrayToPolygon(s)));
        });

        return divided;
    }

    private polygonToPolygonArray(p: Vector[]): number[] {
        const outP: number[] = [];
        p.forEach(v => {
            outP.push(v.x);
            outP.push(v.y);
        });
        return outP;
    }

    private polygonArrayToPolygon(p: number[]): Vector[] {
        const outP = [];
        for (let i = 0; i < p.length / 2; i++) {
            outP.push(new Vector(p[2*i], p[2*i + 1]));
        }
        return outP;
    }

    private isValidPolygon(p: Vector[]): boolean {
        if (p.length > this.maxLength) return false;
        const area = this.calcPolygonArea(p);
        if (area < this.minArea || area > 10000) return false;
        return true;
    }

    private calcPolygonArea(vertices: Vector[]): number {
        let total = 0;

        for (let i = 0; i < vertices.length; i++) {
          let addX = vertices[i].x;
          let addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
          let subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
          let subY = vertices[i].y;

          total += (addX * addY * 0.5);
          total -= (subX * subY * 0.5);
        }

        return Math.abs(total);
    }
}
