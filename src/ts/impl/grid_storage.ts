import * as log from 'loglevel';
import Vector from '../vector';

export default class GridStorage {

    private gridDimensions: Vector;
    private grid: Vector[][][];
    private dsepSq: number;

    /**
     * worldDimensions assumes origin of 0,0
     * @param {number} dsep Separation distance between samples
     */
    constructor (private worldDimensions: Vector, private origin: Vector, private dsep: number) {
        this.dsepSq = this.dsep * this.dsep;
        this.gridDimensions = worldDimensions.clone().divideScalar(this.dsep);
        this.grid = [];
        for (let x = 0; x < this.gridDimensions.x; x++) {
            this.grid.push([]);
            for (let y = 0; y < this.gridDimensions.y; y++) {
                this.grid[x].push([]);
            }
        }
    }

    addPolyline(line: Vector[]): void {
        line.forEach(v => this.addSample(v));
    }

    /**
     * Does not enforce separation
     */
    addSample(v: Vector, coords?: Vector): void {
        if (!coords) {
            coords = this.getSampleCoords(v);
        }
        this.grid[coords.x][coords.y].push(v);
    }

    /**
     * Tests whether v is at least d away from samples
     * @param dSq=this.dsepSq squared test distance
     * Could be dtest if we are integrating a streamline
     */
    isValidSample(v: Vector, dSq=this.dsepSq): boolean {
        const coords = this.getSampleCoords(v);

        // Check samples in 9 cells in 3x3 grid
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const cell = coords.clone().add(new Vector(x, y));
                if (!this.vectorOutOfBounds(cell, this.gridDimensions)) {
                    if (!this.vectorFarFromVectors(v, this.grid[cell.x][cell.y], dSq)) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
    
    /**
     * Test whether v is at least d away from vectors
     * @param {number}   dSq     squared test distance
     */
    vectorFarFromVectors(v: Vector, vectors: Vector[], dSq: number): boolean {
        for (const sample of vectors) {
            if (sample !== v) {
                const distanceSq = sample.distanceToSquared(v);
                if (distanceSq < dSq) {
                    return false;
                }
            }
        }

        return true;
    }

    private worldToGrid(v: Vector): Vector {
        return v.clone().sub(this.origin);
    }

    private gridToWorld(v: Vector): Vector {
        return v.clone().add(this.origin);
    }

    private vectorOutOfBounds(gridV: Vector, bounds: Vector): boolean {
        return (gridV.x < 0 || gridV.y < 0 ||
            gridV.x >= bounds.x || gridV.y >= bounds.y);
    }

    /**
     * @return {Vector}   Cell coords corresponding to vector
     */
    private getSampleCoords(worldV: Vector): Vector {
        const v = this.worldToGrid(worldV);
        if (this.vectorOutOfBounds(v, this.worldDimensions)) {
            console.log(v);
            console.log(worldV);
            console.log(this.origin);
            log.error("Tried to access out-of-bounds sample in grid");
            return Vector.zeroVector();
        }

        return new Vector(
            Math.floor(v.x / this.dsep),
            Math.floor(v.y / this.dsep)
        );
    }
}
