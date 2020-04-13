import * as log from 'loglevel';
// import * as noise from 'noisejs';
import * as SimplexNoise from 'simplex-noise';
import Tensor from './tensor';
import Vector from '../vector';
import {Grid, Radial, BasisField} from './basis_field';

export default class TensorField {
    private basisFields: BasisField[] = [];
    private polygons: Vector[][] = [];
    private noise: SimplexNoise;

    constructor() {
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
    }

    getCentrePoints(): Vector[] {
        return this.basisFields.map(field => field.centre);
    }

    setPolygons(p: Vector[][]): void {
        this.polygons = p;
    }

    samplePoint(point: Vector): Tensor {
        // Inside polygons
        let noise = 0;
        if (this.polygons.some(p => this.insidePolygon(point, p))) {
            // Rotation noise - range -pi/2 to pi/2
            noise = this.noise.noise2D(point.x / 20, point.y / 20) * Math.PI/2;
            // For degenerate point
            // return new Tensor(0, [0,0]);
        }

        // Default field is a grid
        if (this.basisFields.length === 0) {
            return new Tensor(1, [0, 0]);
        }

        const tensorAcc = new Tensor(0, [0, 0]);
        this.basisFields.forEach(field => tensorAcc.add(field.getWeightedTensor(point)));

        return tensorAcc.rotate(noise);
    }

    insidePolygon(point: Vector, polygon: Vector[]) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
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
