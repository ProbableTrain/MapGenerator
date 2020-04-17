import * as log from 'loglevel';
import * as isect from 'isect';
import * as d3 from 'd3-quadtree';
import Vector from '../vector';

declare module 'isect' {
    export function bush(lines: Segment[]): DetectIntersections;
}

interface DetectIntersections {
    run: () => Intersection[];
}

interface Segment {
    from: Vector;
    to: Vector;
}

interface Intersection {
    point: Vector;
    segments: Segment[];
}

export class Node {
    public segments = new Set<Segment>();
    public adj: Node[];

    constructor(public value: Vector, public neighbors=new Set<Node>()) {}

    addSegment(segment: Segment): void {
        this.segments.add(segment);
    }

    addNeighbor(node: Node): void {
        if (node !== this) {
            this.neighbors.add(node);
            node.neighbors.add(this);
        }
    }
}

export default class Graph {
    public nodes: Node[];
    public intersections: Vector[];

    constructor(streamlines: Vector[][], dstep: number, deleteDangling=false) {
        const intersections = isect.bush(this.streamlinesToSegment(streamlines)).run();
        const quadtree = (d3.quadtree() as d3.Quadtree<Node>).x(n => n.value.x).y(n => n.value.y);
        const nodeAddRadius = 0.001;

        // Add all segment start and endpoints
        streamlines.forEach(streamline => {
            for (let i = 0; i < streamline.length; i++) {
                const node = new Node(streamline[i]);
                if (i > 0) {
                    node.addSegment(this.vectorsToSegment(streamline[i - 1], streamline[i]));
                }

                if (i < streamline.length - 1) {
                    node.addSegment(this.vectorsToSegment(streamline[i], streamline[i + 1]));
                }

                this.fuzzyAddToQuadtree(quadtree, node, nodeAddRadius);
            }
        });

        // Add all intersections
        intersections.forEach(intersection => {
            const node = new Node(new Vector(intersection.point.x, intersection.point.y));
            intersection.segments.forEach(s => node.addSegment(s));
            this.fuzzyAddToQuadtree(quadtree, node, nodeAddRadius);
        });

        // For each simplified streamline, build list of nodes in order along streamline
        streamlines.forEach(streamline => {
            for (let i = 0; i < streamline.length - 1; i++) {
                const nodesAlongSegment =
                    this.getNodesAlongSegment(this.vectorsToSegment(streamline[i], streamline[i + 1]), quadtree, nodeAddRadius, dstep);
                
                if (nodesAlongSegment.length > 1) {
                    for (let j = 0; j < nodesAlongSegment.length - 1; j++) {
                        nodesAlongSegment[j].addNeighbor(nodesAlongSegment[j+1]);
                    }
                } else {
                    log.error("Error Graph.js: segment with less than 2 nodes");
                }
            }
        });

        if (deleteDangling) {
            quadtree.data().forEach(n => this.deleteDanglingNodes(n, quadtree));    
        }

        this.nodes = quadtree.data();
        this.nodes.forEach(n => n.adj = Array.from(n.neighbors));
        this.intersections = intersections.map(i => new Vector(i.point.x, i.point.y));
    }

    private deleteDanglingNodes(n: Node, quadtree: d3.Quadtree<Node>) {
        if (n.neighbors.size === 1) {
            quadtree.remove(n);
            for (let neighbor of n.neighbors) {
                neighbor.neighbors.delete(n);
                this.deleteDanglingNodes(neighbor, quadtree);
            }
        }
    }

    private getNodesAlongSegment(segment: Segment, quadtree: d3.Quadtree<Node>, radius: number, step: number): Node[] {
        // Walk dstep along each streamline, adding nodes within dstep/2
        // and connected to this streamline (fuzzy - nodeAddRadius) to list, removing from
        // quadtree and adding them all back at the end

        const foundNodes = [];
        const nodesAlongSegment: Node[] = [];

        const start = new Vector(segment.from.x, segment.from.y);
        const end = new Vector(segment.to.x, segment.to.y);
        
        const differenceVector = end.clone().sub(start);
        step = Math.min(step, differenceVector.length() / 2);  // Min of 2 step along vector
        const steps = Math.ceil(differenceVector.length() / step);
        const differenceVectorLength = differenceVector.length();

        for (let i = 0; i <= steps; i++) {
            let currentPoint = start.clone().add(differenceVector.clone().multiplyScalar(i / steps));

            // Order nodes, not by 'closeness', but by dot product
            let nodesToAdd = [];
            let closestNode = quadtree.find(currentPoint.x, currentPoint.y, radius + step/2);

            while (closestNode !== undefined) {
                quadtree.remove(closestNode);
                foundNodes.push(closestNode);
                
                let nodeOnSegment = false;
                for (let s of closestNode.segments) {
                    if (this.fuzzySegmentsEqual(s, segment)) {
                        nodeOnSegment = true;
                        break;
                    }
                }

                if (nodeOnSegment) {
                    nodesToAdd.push(closestNode);
                }

                closestNode = quadtree.find(currentPoint.x, currentPoint.y, radius + step/2);
            }

            nodesToAdd.sort((first: Node, second: Node) =>
                this.dotProductToSegment(first, start, differenceVector) - this.dotProductToSegment(second, start, differenceVector));
            nodesToAdd.forEach(n => nodesAlongSegment.push(n));
        }

        quadtree.addAll(foundNodes);
        return nodesAlongSegment;
    }

    private fuzzySegmentsEqual(s1: Segment, s2: Segment, tolerance=0.0001): boolean {
        // From
        if (s1.from.x - s2.from.x > tolerance) {
            return false;
        }

        if (s1.from.y - s2.from.y > tolerance) {
            return false;
        }

        // To

        if (s1.to.x - s2.to.x > tolerance) {
            return false;
        }

        if (s1.to.y - s2.to.y > tolerance) {
            return false;
        }

        return true;
    }

    private dotProductToSegment(node: Node, start: Vector, differenceVector: Vector): number {
        const dotVector = node.value.clone().sub(start);
        return differenceVector.dot(dotVector);
    }

    private fuzzyAddToQuadtree(quadtree: d3.Quadtree<Node>, node: Node, radius: number): void {
        // Only add if there isn't a node within radius
        // Remember to check for double radius when querying tree, or point might be missed
        const existingNode = quadtree.find(node.value.x, node.value.y, radius);
        if (existingNode === undefined) {
            quadtree.add(node);
        } else {
            node.neighbors.forEach(neighbor => existingNode.addNeighbor(neighbor));
            node.segments.forEach(segment => existingNode.addSegment(segment));
        }
    }

    private streamlinesToSegment(streamlines: Vector[][]): Segment[] {
        const out: Segment[] = [];
        for (const s of streamlines) {
            for (let i = 0; i < s.length - 1; i++) {
                out.push(this.vectorsToSegment(s[i], s[i + 1]));
            }
        }

        return out;
    }

    private vectorsToSegment(v1: Vector, v2: Vector): Segment {
        return {
            from: v1,
            to:   v2
        };
    }
}
