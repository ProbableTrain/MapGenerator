import * as log from 'loglevel';
import * as dat from 'dat.gui';
import TensorFieldGUI from './ts/ui/tensor_field_gui';
import RoadsGUI from './ts/ui/roads_gui';
import CanvasWrapper from './ts/ui/canvas_wrapper';
import Util from './ts/util';
import DragController from './ts/ui/drag_controller';
import DomainController from './ts/ui/domain_controller';

export interface Drawable {
    draw(): void;
}

class Main {
    private domainController = DomainController.getInstance();
    private canvas: CanvasWrapper;
    private gui: dat.GUI = new dat.GUI({width: 300});
    private tensorField: TensorFieldGUI;
    private roadsGUI: RoadsGUI;
    private dragController = new DragController(this.gui);

    // Options
    private imageScale = 3;

    // Folders
    private tensorFolder: dat.GUI;
    private roadsFolder: dat.GUI;

    constructor() {
        const c = document.getElementById(Util.CANVAS_ID) as HTMLCanvasElement;
        this.canvas = new CanvasWrapper(c);
        const zoomController = this.gui.add(this.domainController, 'zoom');
        this.domainController.setZoomUpdate(() => zoomController.updateDisplay());
        
        this.tensorFolder = this.gui.addFolder('Tensor Field');
        this.tensorField = new TensorFieldGUI(this.tensorFolder, this.dragController, true);
        this.tensorFolder.open();

        this.roadsFolder = this.gui.addFolder('Roads');
        this.roadsFolder.open();

        this.roadsGUI = new RoadsGUI(this.roadsFolder, this.tensorField, () => this.tensorFolder.close());

        const optionsFolder = this.gui.addFolder('Options');
        optionsFolder.add(this.tensorField, 'drawCentre');
        optionsFolder.add(this.canvas, 'canvasScale');
        optionsFolder.add(this, 'imageScale', 1, 5);
        optionsFolder.add(this, 'download');

        this.tensorField.setRecommended();

        requestAnimationFrame(this.update.bind(this));
    }

    /**
     * Downloads image of map
     * Draws onto hidden canvas at requested resolution
     */
    download(): void {
        const c = document.getElementById(Util.IMG_CANVAS_ID) as HTMLCanvasElement;
        const imgCanvas = new CanvasWrapper(c, this.imageScale, false);
        this.draw(imgCanvas);
        const link = document.createElement('a');
        link.download = 'map.png';
        link.href = (document.getElementById(Util.IMG_CANVAS_ID) as any).toDataURL();
        link.click();
    }

    private drawTensorField(): boolean {
        return !this.tensorFolder.closed || this.roadsGUI.roadsEmpty();
    }

    draw(canvas: CanvasWrapper): void {
        canvas.setFillStyle('black');
        canvas.clearCanvas();
        if (this.drawTensorField()) {
            this.dragController.setDragDisabled(false);
            this.tensorField.draw(canvas);
        } else {
            this.dragController.setDragDisabled(true);
            this.roadsGUI.draw(canvas);
        }
    }

    update(): void {
        this.draw(this.canvas);
        requestAnimationFrame(this.update.bind(this));
    }
}

window.addEventListener('load', (): void => {
    new Main();
});
