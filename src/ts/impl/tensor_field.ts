import * as log from 'loglevel';
import Tensor from './tensor';
import Vector from '../vector';
import {Grid, Radial, BasisField} from './basis_field';
import {WorkerObject, BasisFieldParams} from './worker/worker_params';

export default class TensorField implements WorkerObject {
    private basisFields: BasisField[] = [];
    private gridNameIndex = 0;
    private radialNameIndex = 0;

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

    getCentrePoints(): Vector[] {
        return this.basisFields.map(field => field.centre);
    }

    samplePoint(point: Vector): Tensor {
        // Default field is a grid
        if (this.basisFields.length === 0) {
            return new Tensor(1, [0, 0]);
        }

        const tensorAcc = new Tensor(0, [0, 0]);
        this.basisFields.forEach(field => tensorAcc.add(field.getWeightedTensor(point)));
        return tensorAcc;
    }

    getWorkerParams(): BasisFieldParams[] {
        return this.basisFields.map(f => f.getWorkerParams());
    }
}
