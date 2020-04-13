import * as log from 'loglevel';
import Vector from '../vector';
import {Node} from './graph';

export default class PolygonFinder {
    public polygons: Vector[][] = [];

    constructor(private nodes: Node[], private maxLength=20, private minArea=1) {
        this.polygons = this.findPolygons(this.nodes);
    }

    findPolygons(nodes: Node[]): Vector[][] {
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

    removePolygonAdjacencies(polygon: Node[]): void {
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
