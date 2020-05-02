import * as log from 'loglevel';
import Vector from '../vector';

/**
 * Cartesian grid accelerated data structure
 * Grid of cells, each containing a list of vectors
 */
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

    /**
     * Add all samples from another grid to this one
     */
    addAll(gridStorage: GridStorage): void {
        for (const row of gridStorage.grid) {
            for (const cell of row) {
                for (const sample of cell) {
                    this.addSample(sample);        
                }
            }
        }
    }

    addPolyline(line: Vector[]): void {
        for (const v of line) {
            this.addSample(v)
        }
    }

    /**
     * Does not enforce separation
     * Does not clone
     */
    addSample(v: Vector, coords?: Vector): void {
        if (!coords) {
            coords = this.getSampleCoords(v);
        }
        this.grid[coords.x][coords.y].push(v);
    }

    /**
     * Tests whether v is at least d away from samples
     * Performance very important - this is called at every integration step
     * @param dSq=this.dsepSq squared test distance
     * Could be dtest if we are integrating a streamline
     */
    isValidSample(v: Vector, dSq=this.dsepSq): boolean {
        // Code duplication with this.getNearbyPoints but much slower when calling
        // this.getNearbyPoints due to array creation in that method

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
     * Performance very important - this is called at every integration step
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

    /**
     * Returns points in cells surrounding v
     * Results include v, if it exists in the grid
     * @param {number} returns samples (kind of) closer than distance - returns all samples in 
     * cells so approximation (square to approximate circle)
     */
    getNearbyPoints(v: Vector, distance: number): Vector[] {
        const radius = Math.ceil((distance/this.dsep) - 0.5);
        const coords = this.getSampleCoords(v);
        const out: Vector[] = [];
        for (let x = -1 * radius; x <= 1 * radius; x++) {
            for (let y = -1 * radius; y <= 1 * radius; y++) {
                const cell = coords.clone().add(new Vector(x, y));
                if (!this.vectorOutOfBounds(cell, this.gridDimensions)) {
                    for (const v2 of this.grid[cell.x][cell.y]) {
                        out.push(v2);
                    }
                }
            }
        }

        return out;
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
     * Performance important - called at every integration step
     */
    private getSampleCoords(worldV: Vector): Vector {
        const v = this.worldToGrid(worldV);
        if (this.vectorOutOfBounds(v, this.worldDimensions)) {
            // log.error("Tried to access out-of-bounds sample in grid");
            return Vector.zeroVector();
        }

        return new Vector(
            Math.floor(v.x / this.dsep),
            Math.floor(v.y / this.dsep)
        );
    }
}
