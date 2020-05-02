import * as log from 'loglevel';
import * as dat from 'dat.gui';
import TensorFieldGUI from './ts/ui/tensor_field_gui';
import {NoiseParams} from './ts/impl/tensor_field';
import MainGUI from './ts/ui/main_gui';
import {DefaultCanvasWrapper} from './ts/ui/canvas_wrapper';
import Util from './ts/util';
import DragController from './ts/ui/drag_controller';
import DomainController from './ts/ui/domain_controller';
import Style from './ts/ui/style';
import {ColourScheme, DefaultStyle, RoughStyle} from './ts/ui/style';
import * as ColourSchemes from './colour_schemes.json';
import Vector from './ts/vector';
import { SVG } from '@svgdotjs/svg.js';
import ModelGenerator from './ts/model_generator';
import { saveAs } from 'file-saver';

class Main {
    private readonly STARTING_WIDTH = 1440;  // Initially zooms in if width > STARTING_WIDTH

    // UI
    private gui: dat.GUI = new dat.GUI({width: 300});
    private tensorFolder: dat.GUI;
    private roadsFolder: dat.GUI;
    private styleFolder: dat.GUI;
    private optionsFolder: dat.GUI;
    private downloadsFolder: dat.GUI;

    private domainController = DomainController.getInstance();
    private dragController = new DragController(this.gui);
    private tensorField: TensorFieldGUI;
    private mainGui: MainGUI;  // In charge of glueing everything together

    // Options
    private imageScale = 3;  // Multiplier for res of downloaded image
    public highDPI = false;  // Increases resolution for hiDPI displays

    // Style options
    private canvas: HTMLCanvasElement;
    private tensorCanvas: DefaultCanvasWrapper;
    private _style: Style;
    private colourScheme: string = "Default";  // See colour_schemes.json
    private zoomBuildings: boolean = false;  // Show buildings only when zoomed in?
    private buildingModels: boolean = false;  // Draw pseudo-3D buildings?
    private showFrame: boolean = false;

    // Force redraw of roads when switching from tensor vis to map vis
    private previousFrameDrawTensor = true;

    // 3D camera position
    private cameraX = 0;
    private cameraY = 0;

    private firstGenerate = true;  // Don't randomise tensor field on first generate
    private modelGenerator: ModelGenerator;

    constructor() {
        // GUI Setup
        const zoomController = this.gui.add(this.domainController, 'zoom');
        this.domainController.setZoomUpdate(() => zoomController.updateDisplay());
        this.gui.add(this, 'generate');

        this.tensorFolder = this.gui.addFolder('Tensor Field');
        this.roadsFolder = this.gui.addFolder('Map');
        this.styleFolder = this.gui.addFolder('Style');
        this.optionsFolder = this.gui.addFolder('Options');
        this.downloadsFolder = this.gui.addFolder('Download');

        // Canvas setup
        this.canvas = document.getElementById(Util.CANVAS_ID) as HTMLCanvasElement;
        this.tensorCanvas = new DefaultCanvasWrapper(this.canvas);
        
        // Make sure we're not too zoomed out for large resolutions
        const screenWidth = this.domainController.screenDimensions.x;
        if (screenWidth > this.STARTING_WIDTH) {
            this.domainController.zoom = screenWidth / this.STARTING_WIDTH;
        }

        // Style setup
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


        const noiseParamsPlaceholder: NoiseParams = {  // Placeholder values for park + water noise
            globalNoise: false,
            noiseSizePark: 20,
            noiseAnglePark: 90,
            noiseSizeGlobal: 30,
            noiseAngleGlobal: 20
        };

        this.tensorField = new TensorFieldGUI(this.tensorFolder, this.dragController, true, noiseParamsPlaceholder);
        this.mainGui = new MainGUI(this.roadsFolder, this.tensorField, () => this.tensorFolder.close());

        this.optionsFolder.add(this.tensorField, 'drawCentre');
        this.optionsFolder.add(this, 'highDPI').onChange((high: boolean) => this.changeCanvasScale(high));
        
        this.downloadsFolder.add(this, 'imageScale', 1, 5).step(1);
        this.downloadsFolder.add({"PNG": () => this.downloadPng()}, 'PNG');  // This allows custom naming of button
        this.downloadsFolder.add({"SVG": () => this.downloadSVG()}, 'SVG');
        this.downloadsFolder.add({"STL": () => this.downloadSTL()}, 'STL');
        this.downloadsFolder.add({"Heightmap": () => this.downloadHeightmap()}, 'Heightmap');

        this.changeColourScheme(this.colourScheme);
        this.tensorField.setRecommended();
        requestAnimationFrame(() => this.update());
    }

    /**
     * Generate an entire map with no control over the process
     */
    generate(): void {
        if (!this.firstGenerate) {
            this.tensorField.setRecommended();
        } else {
            this.firstGenerate = false;
        }
        
        this.mainGui.generateEverything();
    }

    /**
     * @param {string} scheme Matches a scheme name in colour_schemes.json
     */
    changeColourScheme(scheme: string): void {
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

    /**
     * Scale up canvas resolution for hiDPI displays
     */
    changeCanvasScale(high: boolean): void {
        const value = high ? 2 : 1;
        this._style.canvasScale = value;
        this.tensorCanvas.canvasScale = value;
    }

    /**
     * Change camera position for pseudo3D buildings
     */
    setCameraDirection(): void {
        this.domainController.cameraDirection = new Vector(this.cameraX / 10, this.cameraY / 10);
    }

    downloadSTL(): void {
        // All in screen space
        const extendScreenX = this.domainController.screenDimensions.x * ((Util.DRAW_INFLATE_AMOUNT - 1) / 2);
        const extendScreenY = this.domainController.screenDimensions.y * ((Util.DRAW_INFLATE_AMOUNT - 1) / 2);
        const ground: Vector[] = [
            new Vector(-extendScreenX, -extendScreenY),
            new Vector(-extendScreenX, this.domainController.screenDimensions.y + extendScreenY),
            new Vector(this.domainController.screenDimensions.x + extendScreenX, this.domainController.screenDimensions.y + extendScreenY),
            new Vector(this.domainController.screenDimensions.x + extendScreenX, -extendScreenY),
        ];

        this.mainGui.getBlocks().then((blocks) => {
            this.modelGenerator = new ModelGenerator(ground,
                this.mainGui.seaPolygon,
                this.mainGui.coastlinePolygon,
                this.mainGui.riverPolygon,
                this.mainGui.mainRoadPolygons,
                this.mainGui.majorRoadPolygons,
                this.mainGui.minorRoadPolygons,
                this.mainGui.buildingModels,
                blocks,
            );

            this.modelGenerator.getSTL().then(blob => this.downloadFile('model.zip', blob));
        });
    }

    private downloadFile(filename: string, file: any): void {
        saveAs(file, filename);
    }

    /**
     * Downloads image of map
     * Draws onto hidden canvas at requested resolution
     */
    downloadPng(): void {
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
     * Same as downloadPng but uses Heightmap style
     */
    downloadHeightmap(): void {
        const oldColourScheme = this.colourScheme;
        this.changeColourScheme("Heightmap");
        this.downloadPng();
        this.changeColourScheme(oldColourScheme);
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
        if (this.modelGenerator) {
            let continueUpdate = true;
            const start = performance.now();
            while (continueUpdate && performance.now() - start < 100) {
                continueUpdate = this.modelGenerator.update();
            }
        }

        this._style.update();
        this.mainGui.update();
        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }
}

// Add log to window so we can use log.setlevel from the console
(window as any).log = log;
window.addEventListener('load', (): void => {
    new Main();
});
