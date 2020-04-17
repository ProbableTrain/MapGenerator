import * as log from 'loglevel';
import * as dat from 'dat.gui';
import TensorFieldGUI from './ts/ui/tensor_field_gui';
import {NoiseParams} from './ts/impl/tensor_field';
import RoadsGUI from './ts/ui/roads_gui';
import CanvasWrapper from './ts/ui/canvas_wrapper';
import {DefaultCanvasWrapper, RoughCanvasWrapper} from './ts/ui/canvas_wrapper';
import Util from './ts/util';
import DragController from './ts/ui/drag_controller';
import DomainController from './ts/ui/domain_controller';
import Style from './ts/ui/style';
import {ColourScheme, DefaultStyle, RoughStyle} from './ts/ui/style';
import * as ColourSchemes from './colour_schemes.json';

// enum StyleChoice {
//     DEFAULT = "Default",
//     APPLE = "Apple",
//     APPLE_NIGHT = "AppleNight",
//     ASSASSIN = "Assassin",
//     DRAWN = "Drawn",
//     GOOGLE = "Google",
//     PAPER = "Paper",
//     SUBTLEGRAYSCALE = "SubtleGrayscale",
//     ULTRALIGHT = "UltraLight",
//     WY = "Wy",
// }

class Main {
    private domainController = DomainController.getInstance();
    private gui: dat.GUI = new dat.GUI({width: 300});
    private tensorField: TensorFieldGUI;
    private roadsGUI: RoadsGUI;
    private dragController = new DragController(this.gui);

    // Options
    private imageScale = 3;

    // Folders
    private tensorFolder: dat.GUI;
    private roadsFolder: dat.GUI;

    // To force draw if needed
    private previousFrameDrawTensor = true;

    private canvas: HTMLCanvasElement;
    private tensorCanvas: DefaultCanvasWrapper;
    private _style: Style;
    private colourScheme: string = "Default";
    public highDPI = false;

    constructor() {
        this.canvas = document.getElementById(Util.CANVAS_ID) as HTMLCanvasElement;
        this.tensorCanvas = new DefaultCanvasWrapper(this.canvas);

        const zoomController = this.gui.add(this.domainController, 'zoom');
        this.domainController.setZoomUpdate(() => zoomController.updateDisplay());
        
        const noiseParams: NoiseParams = {
            globalNoise: false,
            noiseSizePark: 20,
            noiseAnglePark: 90,
            noiseSizeGlobal: 30,
            noiseAngleGlobal: 20
        };

        this.tensorFolder = this.gui.addFolder('Tensor Field');
        this.tensorField = new TensorFieldGUI(this.tensorFolder, this.dragController, true, noiseParams);
        this.tensorFolder.open();
        this.roadsFolder = this.gui.addFolder('Map');
        this.roadsFolder.open();
        this.roadsGUI = new RoadsGUI(this.roadsFolder, this.tensorField, () => this.tensorFolder.close());

        const optionsFolder = this.gui.addFolder('Options');
        optionsFolder.add(this.tensorField, 'drawCentre');
        const canvasScaleController = optionsFolder.add(this, 'highDPI');
        canvasScaleController.onChange((high: boolean) => this.changeCanvasScale(high));
        optionsFolder.add(this, 'imageScale', 1, 5).step(1);
        optionsFolder.add(this, 'download');
        
        // Style
        const styleFolder = this.gui.addFolder('Style');
        const styleController = styleFolder.add(this, 'colourScheme', Object.keys(ColourSchemes));
        styleController.onChange((val: string) => this.changeColourScheme(val));
        this.changeColourScheme(this.colourScheme);

        this.tensorField.setRecommended();

        requestAnimationFrame(this.update.bind(this));
    }

    changeColourScheme(scheme: string) {
        if (scheme === "Drawn") {
            this._style = new RoughStyle(this.canvas);
        } else {
            this._style = new DefaultStyle(this.canvas, (ColourSchemes as any)[scheme]);    
        }
        this.changeCanvasScale(this.highDPI);
    }

    changeCanvasScale(high: boolean): void {
        const value = high ? 2 : 1;
        this._style.canvasScale = value;
        this.tensorCanvas.canvasScale = value;
    }

    /**
     * Downloads image of map
     * Draws onto hidden canvas at requested resolution
     */
    download(): void {
        const c = document.getElementById(Util.IMG_CANVAS_ID) as HTMLCanvasElement;

        // Draw
        if (this.showTensorField()) {
            this.tensorField.draw(new DefaultCanvasWrapper(c, this.imageScale, false));
        } else {            
            const imgCanvas = this._style.createCanvasWrapper(c, this.imageScale, false);
            this.roadsGUI.draw(this._style, true, imgCanvas);
        }

        const link = document.createElement('a');
        link.download = 'map.png';
        link.href = (document.getElementById(Util.IMG_CANVAS_ID) as any).toDataURL();
        link.click();
    }

    private showTensorField(): boolean {
        return !this.tensorFolder.closed || this.roadsGUI.roadsEmpty();
    }

    draw(): void {
        if (this.showTensorField()) {
            this.previousFrameDrawTensor = true;
            this.dragController.setDragDisabled(false);
            this.tensorField.draw(this.tensorCanvas);
        } else {
            // Disable field drag and drop
            this.dragController.setDragDisabled(true);
            
            if (this.previousFrameDrawTensor === true) {
                this.previousFrameDrawTensor = false;

                // Force redraw if switching from tensor field
                this.roadsGUI.draw(this._style, true);
            } else {
                this.roadsGUI.draw(this._style);
            }
        }
    }

    update(): void {
        this.roadsGUI.update();
        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }
}

window.addEventListener('load', (): void => {
    new Main();
});
