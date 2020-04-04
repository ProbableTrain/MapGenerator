import * as log from 'loglevel';
import Tensor from './tensor';
import Vector from './vector';
import {Grid, Radial, BasisField} from './basis_field';
import DragController from './drag_controller';

export default class TensorField {
    private basisFields: BasisField[] = [];
    private gridNameIndex = 0;
    private radialNameIndex = 0;
    
    constructor(private guiFolder: dat.GUI, private dragController: DragController) {}
 
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
        
        // Function to deregister from drag controller
        const deregisterDrag = this.dragController.register(
            () => field.centre, field.dragMoveListener.bind(field));
        const removeFieldObj = {remove: (): void => this.removeField.bind(this)(field, folder, deregisterDrag)};
        
        // Give dat gui removeField button
        folder.add(removeFieldObj, 'remove');
        field.setGui(folder);

        this.basisFields.push(field);
    }

    removeField(field: BasisField, folder: dat.GUI, deregisterDrag: (() => void)): void {
        const index = this.basisFields.indexOf(field);
        if (index > -1) {
            this.guiFolder.removeFolder(folder);
            // Deregister from drag controller
            deregisterDrag();
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
}
