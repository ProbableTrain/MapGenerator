import * as log from 'loglevel';
// import * as noise from 'noisejs';
import * as SimplexNoise from 'simplex-noise';
import Tensor from './tensor';
import Vector from '../vector';
import {Grid, Radial, BasisField} from './basis_field';
import PolygonUtil from './polygon_util';

export interface NoiseParams {
    globalNoise: boolean;
    noiseSizePark: number;
    noiseAnglePark: number;  // Degrees
    noiseSizeGlobal: number;
    noiseAngleGlobal: number;
}

/**
 * Combines basis fields
 * Noise added when sampling a point in a park
 */
export default class TensorField {
    private basisFields: BasisField[] = [];
    private noise: SimplexNoise;

    public parks: Vector[][] = [];
    public sea: Vector[] = [];
    public river: Vector[] = [];
    public ignoreRiver = false;

    public smooth = false;

    constructor(public noiseParams: NoiseParams) {
        this.noise = new SimplexNoise();
    }

    /**
     * Used when integrating coastline and river
     */
    enableGlobalNoise(angle: number, size: number): void {
        this.noiseParams.globalNoise = true;
        this.noiseParams.noiseAngleGlobal = angle;
        this.noiseParams.noiseSizeGlobal = size;
    }

    disableGlobalNoise(): void {
        this.noiseParams.globalNoise = false;
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
        this.river = [];
    }

    getCentrePoints(): Vector[] {
        return this.basisFields.map(field => field.centre);
    }

    samplePoint(point: Vector): Tensor {
        if (!this.onLand(point)) {
            // Degenerate point
            return Tensor.zero;
        }

        // Default field is a grid
        if (this.basisFields.length === 0) {
            return new Tensor(1, [0, 0]);
        }

        const tensorAcc = Tensor.zero;
        this.basisFields.forEach(field => tensorAcc.add(field.getWeightedTensor(point, this.smooth), this.smooth));

        // Add rotational noise for parks - range -pi/2 to pi/2
        if (this.parks.some(p => PolygonUtil.insidePolygon(point, p))) {
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
        const inSea = PolygonUtil.insidePolygon(point, this.sea);
        if (this.ignoreRiver) {
            return !inSea;
        }

        return !inSea && !PolygonUtil.insidePolygon(point, this.river);
    }

    inParks(point: Vector): boolean {
        for (const p of this.parks) {
            if (PolygonUtil.insidePolygon(point, p)) return true;
        }
        return false;
    }
}
