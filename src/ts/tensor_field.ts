import * as log from 'loglevel';
import Tensor from './tensor';
import Vector from './vector';
import {Grid, Radial, BasisField} from './basis_field';

export default class TensorField {
    private basisFields: BasisField[];
    private gridNameIndex: number = 0;
    private radialNameIndex: number = 0;
    
    constructor() {
        this.basisFields = [];
    }

    addGrid(centre: Vector, size: number, decay: number, theta: number, gui?: dat.GUI): void {
        const grid = new Grid(centre, size, decay, theta);
        this.addField(grid, gui);
    }

    addRadial(centre: Vector, size: number, decay: number, gui?: dat.GUI): void {
        const radial = new Radial(centre, size, decay);
        this.addField(radial, gui);
    }

    private addField(field: BasisField, gui?: dat.GUI) {
        if (gui) {
            const folder = gui.addFolder(`${field.FOLDER_NAME}`);
            field.setGui(folder);
        }
        this.basisFields.push(field);
    }

    samplePoint(point: Vector): Tensor {
        // Default field is a grid
        const tensorAcc = new Tensor(0, [0, 0]);
        if (this.basisFields.length === 0) {
            log.error("No basis fields");
            return new Tensor(1, [0, 0]);
        }
        this.basisFields.forEach(field => tensorAcc.add(field.getWeightedTensor(point)));
        return tensorAcc;
    }
}
