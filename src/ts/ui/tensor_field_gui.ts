import * as log from 'loglevel';
import DragController from './drag_controller';
import TensorField from '../impl/tensor_field';
import {Grid, Radial, BasisField} from '../impl/basis_field';

export default class TensorFieldGUI extends TensorField {
    constructor(private guiFolder: dat.GUI, private dragController: DragController) {
        super();
    }

    protected addField(field: BasisField): void {
        super.addField(field);
        const folder = this.guiFolder.addFolder(`${field.FOLDER_NAME}`);
        
        // Function to deregister from drag controller
        const deregisterDrag = this.dragController.register(
            () => field.centre, field.dragMoveListener.bind(field));
        const removeFieldObj = {remove: (): void => this.removeFieldGUI.bind(this)(field, folder, deregisterDrag)};
        
        // Give dat gui removeField button
        folder.add(removeFieldObj, 'remove');
        field.setGui(folder);
    }

    private removeFieldGUI(field: BasisField, folder: dat.GUI, deregisterDrag: (() => void)): void {
        super.removeField(field);
        this.guiFolder.removeFolder(folder);
        // Deregister from drag controller
        deregisterDrag();
    }
}
