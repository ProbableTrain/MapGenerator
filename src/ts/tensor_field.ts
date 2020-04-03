import * as log from 'loglevel';
import Tensor from './tensor';
import Vector from './vector';
import {Grid, Radial, BasisField} from './basis_field';
import DragController from './drag_controller';

export default class TensorField {
    private basisFields: BasisField[] = [];
    private gridNameIndex = 0;
    private radialNameIndex = 0;
    private dragController: DragController;
    
    constructor(private guiFolder: dat.GUI) {
        this.dragController = new DragController(guiFolder);
    }

    addGrid(centre: Vector, size: number, decay: number, theta: number): void {
        const grid = new Grid(centre, size, decay, theta);
        this.addField(grid);
    }

    addRadial(centre: Vector, size: number, decay: number): void {
        const radial = new Radial(centre, size, decay);
        this.addField(radial);
    }

    private addField(field: BasisField): void {
        const folder = this.guiFolder.addFolder(`${field.FOLDER_NAME}`);
        field.setGui(folder);
        this.dragController.register(() => field.centre, field.dragMoveListener.bind(field));
        this.basisFields.push(field);
    }

    getCentrePoints(): Vector[] {
        return this.basisFields.map(field => field.centre);
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
