import * as log from 'loglevel';
// import * as noise from 'noisejs';
import * as SimplexNoise from 'simplex-noise';
import Tensor from './tensor';
import Vector from '../vector';
import {Grid, Radial, BasisField} from './basis_field';

export interface NoiseParams {
    globalNoise: boolean;
    noiseSizePark: number;
    noiseAnglePark: number;  // Degrees
    noiseSizeGlobal: number;
    noiseAngleGlobal: number;
}

export default class TensorField {
    private basisFields: BasisField[] = [];
    private parks: Vector[][] = [];
    private sea: Vector[] = [];
    private noise: SimplexNoise;

    constructor(public noiseParams: NoiseParams) {
        this.noise = new SimplexNoise();
    }

    addGrid(centre: Vector, size: number, decay: number, theta: number): void {
        const grid = new Grid(centre, size, decay, theta);
        this.addField(grid);        
    }

    addRadial(centre: Vector, size: number, decay: number): void {
        const radial = new Radial(centre, size, decay);
        this.addField(radial);
    }

    protected addField(field: BasisField): void {
        this.basisFields.push(field);
    }

    protected removeField(field: BasisField): void {
        const index = this.basisFields.indexOf(field);
        if (index > -1) {
            this.basisFields.splice(index, 1);
        }
    }

    reset(): void {
        this.basisFields = [];
        this.parks = [];
        this.sea = [];
    }

    getCentrePoints(): Vector[] {
        return this.basisFields.map(field => field.centre);
    }

    setParks(p: Vector[][]): void {
        this.parks = p;
    }

    setSea(p: Vector[]): void {
        this.sea = p;
    }

    samplePoint(point: Vector): Tensor {
        if (!this.onLand(point)) {
            // Degenerate point
            return new Tensor(0, [0,0]);
        }

        // Default field is a grid
        if (this.basisFields.length === 0) {
            return new Tensor(1, [0, 0]);
        }

        const tensorAcc = new Tensor(0, [0, 0]);
        this.basisFields.forEach(field => tensorAcc.add(field.getWeightedTensor(point)));

        // Add rotational noise for parks - range -pi/2 to pi/2
        if (this.parks.some(p => this.insidePolygon(point, p))) {
            // TODO optimise insidePolygon e.g. distance
            tensorAcc.rotate(this.getRotationalNoise(point, this.noiseParams.noiseSizePark, this.noiseParams.noiseAnglePark));
        }

        if (this.noiseParams.globalNoise) {
            tensorAcc.rotate(this.getRotationalNoise(point, this.noiseParams.noiseSizeGlobal, this.noiseParams.noiseAngleGlobal));
        }

        return tensorAcc;
    }

    /**
     * Noise Angle is in degrees
     */
    getRotationalNoise(point: Vector, noiseSize: number, noiseAngle: number): number {
        return this.noise.noise2D(point.x / noiseSize, point.y / noiseSize) * noiseAngle * Math.PI / 180;
    }

    onLand(point: Vector): boolean {
        return !this.insidePolygon(point, this.sea);
    }

    insidePolygon(point: Vector, polygon: Vector[]) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        if (polygon.length === 0) {
            return false;
        }

        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            var xi = polygon[i].x, yi = polygon[i].y;
            var xj = polygon[j].x, yj = polygon[j].y;

            var intersect = ((yi > point.y) != (yj > point.y))
                && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };
}
