import * as log from 'loglevel';
import * as dat from 'dat.gui';
import TensorFieldGUI from './ts/ui/tensor_field_gui';
import {NoiseParams} from './ts/impl/tensor_field';
import MainGUI from './ts/ui/main_gui';
import CanvasWrapper from './ts/ui/canvas_wrapper';
import {DefaultCanvasWrapper, RoughCanvasWrapper} from './ts/ui/canvas_wrapper';
import Util from './ts/util';
import DragController from './ts/ui/drag_controller';
import DomainController from './ts/ui/domain_controller';
import Style from './ts/ui/style';
import {ColourScheme, DefaultStyle, RoughStyle} from './ts/ui/style';
import * as ColourSchemes from './colour_schemes.json';
import Vector from './ts/vector';
import { SVG } from '@svgdotjs/svg.js';
import ModelGenerator from './ts/model_generator';

class Main {
    private domainController = DomainController.getInstance();
    private gui: dat.GUI = new dat.GUI({width: 300});
    private tensorField: TensorFieldGUI;
    private mainGui: MainGUI;
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
    private styleFolder: dat.GUI;
    private colourScheme: string = "Default";
    private zoomBuildings: boolean = false;
    private buildingModels: boolean = false;
    private showFrame: boolean = false;
    public highDPI = false;

    // 3D settings
    private cameraX = 0;
    private cameraY = 0;

    private readonly STARTING_WIDTH = 1440;
    private firstGenerate = true;

    constructor() {
        // Canvas setup
        this.canvas = document.getElementById(Util.CANVAS_ID) as HTMLCanvasElement;
        this.tensorCanvas = new DefaultCanvasWrapper(this.canvas);
        const zoomController = this.gui.add(this.domainController, 'zoom');
        this.domainController.setZoomUpdate(() => zoomController.updateDisplay());

        // Make sure we're not too zoomed out for large resolutions
        const screenWidth = this.domainController.screenDimensions.x;
        if (screenWidth > this.STARTING_WIDTH) {
            this.domainController.zoom = screenWidth / this.STARTING_WIDTH;
        }

        // GUI Setup
        this.gui.add(this, 'generate');
        this.styleFolder = this.gui.addFolder('Style');
        this.styleFolder.add(this, 'colourScheme', Object.keys(ColourSchemes)).onChange((val: string) => this.changeColourScheme(val));

        this.styleFolder.add(this, 'zoomBuildings').onChange((val: boolean) => {
            // Force redraw
            this.previousFrameDrawTensor = true;
            this._style.zoomBuildings = val;
        });

        this.styleFolder.add(this, 'buildingModels').onChange((val: boolean) => {
            // Force redraw
            this.previousFrameDrawTensor = true;
            this._style.showBuildingModels = val;
        });
        
        this.styleFolder.add(this, 'showFrame').onChange((val: boolean) => {
            this.previousFrameDrawTensor = true;
            this._style.showFrame = val;
        });

        this.styleFolder.add(this.domainController, 'orthographic');
        this.styleFolder.add(this, 'cameraX', -15, 15).step(1).onChange(() => this.setCameraDirection());
        this.styleFolder.add(this, 'cameraY', -15, 15).step(1).onChange(() => this.setCameraDirection());

        const noiseParams: NoiseParams = {
            globalNoise: false,
            noiseSizePark: 20,
            noiseAnglePark: 90,
            noiseSizeGlobal: 30,
            noiseAngleGlobal: 20
        };

        this.tensorFolder = this.gui.addFolder('Tensor Field');
        this.tensorField = new TensorFieldGUI(this.tensorFolder, this.dragController, true, noiseParams);
        this.roadsFolder = this.gui.addFolder('Map');
        this.mainGui = new MainGUI(this.roadsFolder, this.tensorField, () => this.tensorFolder.close());

        const optionsFolder = this.gui.addFolder('Options');
        optionsFolder.add(this.tensorField, 'drawCentre');
        const canvasScaleController = optionsFolder.add(this, 'highDPI');
        canvasScaleController.onChange((high: boolean) => this.changeCanvasScale(high));
        optionsFolder.add(this, 'imageScale', 1, 5).step(1);
        optionsFolder.add(this, 'download');
        optionsFolder.add(this, 'downloadSVG');
        optionsFolder.add(this, 'downloadObj');

        this.changeColourScheme(this.colourScheme);
        this.tensorField.setRecommended();
        requestAnimationFrame(this.update.bind(this));

        const modelGenerator = new ModelGenerator();
    }

    generate() {
        if (!this.firstGenerate) {
            this.tensorField.setRecommended();
        } else {
            this.firstGenerate = false;
        }
        
        this.mainGui.generateEverything();
    }

    changeColourScheme(scheme: string) {
        const colourScheme: ColourScheme = (ColourSchemes as any)[scheme];
        this.zoomBuildings = colourScheme.zoomBuildings;
        this.buildingModels = colourScheme.buildingModels;
        Util.updateGui(this.styleFolder);
        if (scheme.startsWith("Drawn")) {
            this._style = new RoughStyle(this.canvas, this.dragController, Object.assign({}, colourScheme));
        } else {
            this._style = new DefaultStyle(this.canvas, this.dragController, Object.assign({}, colourScheme), scheme.startsWith("Heightmap"));
        }
        this._style.showFrame = this.showFrame;
        this.changeCanvasScale(this.highDPI);
    }

    changeCanvasScale(high: boolean): void {
        const value = high ? 2 : 1;
        this._style.canvasScale = value;
        this.tensorCanvas.canvasScale = value;
    }

    setCameraDirection(): void {
        this.domainController.cameraDirection = new Vector(this.cameraX / 10, this.cameraY / 10);
    }

    downloadObj(): void {
        // All in screen space

        const extendScreenX = this.domainController.screenDimensions.x * ((Util.DRAW_INFLATE_AMOUNT - 1) / 2);
        const extendScreenY = this.domainController.screenDimensions.y * ((Util.DRAW_INFLATE_AMOUNT - 1) / 2);
        const ground: Vector[] = [
            new Vector(-extendScreenX, -extendScreenY),
            new Vector(-extendScreenX, this.domainController.screenDimensions.y + extendScreenY),
            new Vector(this.domainController.screenDimensions.x + extendScreenX, this.domainController.screenDimensions.y + extendScreenY),
            new Vector(this.domainController.screenDimensions.x + extendScreenX, -extendScreenY),
        ];

        const file: any = ModelGenerator.getOBJ(
            ground,
            this.mainGui.seaPolygon,
            this.mainGui.coastlinePolygon,
            this.mainGui.riverPolygon,
            this.mainGui.mainRoadPolygons,
            this.mainGui.majorRoadPolygons,
            this.mainGui.minorRoadPolygons,
            this.mainGui.buildingModels);

        const filename = 'model.obj';
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(file));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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
            this.mainGui.draw(this._style, true, imgCanvas);
        }

        const link = document.createElement('a');
        link.download = 'map.png';
        link.href = (document.getElementById(Util.IMG_CANVAS_ID) as any).toDataURL();
        link.click();
    }

    /**
     * Downloads svg of map
     * Draws onto hidden svg at requested resolution
     */
    downloadSVG(): void {
        const c = document.getElementById(Util.IMG_CANVAS_ID) as HTMLCanvasElement;
        const svgElement = document.getElementById(Util.SVG_ID);

        if (this.showTensorField()) {
            const imgCanvas = new DefaultCanvasWrapper(c, 1, false);
            imgCanvas.createSVG(svgElement);
            this.tensorField.draw(imgCanvas);
        } else {
            const imgCanvas = this._style.createCanvasWrapper(c, 1, false);
            imgCanvas.createSVG(svgElement);
            this.mainGui.draw(this._style, true, imgCanvas);
        }

        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);
        //add name spaces.
        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        //convert svg source to URI data scheme.
        const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

        const link = document.createElement('a');
        link.download = 'map.svg';
        link.href = url;
        link.click();

        // Clear SVG
        const element = SVG(svgElement);
        element.clear();
    }

    private showTensorField(): boolean {
        return !this.tensorFolder.closed || this.mainGui.roadsEmpty();
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
                this.mainGui.draw(this._style, true);
            } else {
                this.mainGui.draw(this._style);
            }
        }
    }

    update(): void {
        this._style.update();
        this.mainGui.update();
        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }
}

(window as any).log = log;
window.addEventListener('load', (): void => {
    new Main();
});
