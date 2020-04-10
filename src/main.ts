import * as log from 'loglevel';
import * as dat from 'dat.gui';

import TensorFieldGUI from './ts/ui/tensor_field_gui';
import TensorField from './ts/impl/tensor_field';
import {Grid, Radial} from './ts/impl/basis_field';
import Vector from './ts/vector';
import CanvasWrapper from './ts/ui/canvas_wrapper';
import Util from './ts/util';
import {RandomRange} from './ts/util';
import DragController from './ts/ui/drag_controller';
import DomainController from './ts/ui/domain_controller';
import {RK4Integrator} from './ts/impl/integrator';
import FieldIntegrator from './ts/impl/integrator';
import {StreamlineParams} from './ts/impl/streamlines';
import StreamlineGenerator from './ts/impl/streamlines';

class Main {
    private domainController = DomainController.getInstance();
    private canvas: CanvasWrapper;
    private gui: dat.GUI = new dat.GUI({width: 300});
    private tensorField: TensorField;
    private integrator: FieldIntegrator;
    private majorRoads: StreamlineGenerator;
    private minorRoads: StreamlineGenerator;
    private dragController = new DragController(this.gui);

    // Folders
    private tensorFolder: dat.GUI;
    private roadsFolder: dat.GUI;

    // Draw
    private TENSOR_LINE_DIAMETER = 20;

    // Tensor spawn
    private TENSOR_SPAWN_SCALE = 0.7;  // How much to shrink worldDimensions to find spawn point
 
    // Params
    private minorParams: StreamlineParams = {
        dsep: 20,
        dtest: 10,
        dstep: 1,
        dlookahead: 100,
        dcirclejoin: 5,
        joinangle: 0.1,  // approx 30deg
        pathIterations: 1000,
        seedTries: 300,
        simplifyTolerance: 0.5,
    };

    private majorParams: StreamlineParams = {
        dsep: 100,
        dtest: 30,
        dstep: 1,
        dlookahead: 200,
        dcirclejoin: 5,
        joinangle: 0.1,  // approx 10deg
        pathIterations: 1000,
        seedTries: 300,
        simplifyTolerance: 0.5,
    };

    constructor() {
        const c = document.getElementById(Util.CANVAS_ID) as HTMLCanvasElement;
        this.canvas = new CanvasWrapper(c);
        const zoomController = this.gui.add(this.domainController, 'zoom');
        this.domainController.setZoomUpdate(() => zoomController.updateDisplay());
        this.tensorFolder = this.gui.addFolder('Tensor Field');
        this.tensorField = new TensorFieldGUI(this.tensorFolder, this.dragController);

        const tensorFieldResetObj = {reset: (): void => this.tensorField.reset()};
        this.tensorFolder.add(tensorFieldResetObj, 'reset');
        this.tensorFolder.add(this, 'setRecommended');
        this.tensorFolder.add(this, 'addRadial');
        this.tensorFolder.add(this, 'addGrid');
        this.tensorFolder.open();

        this.integrator = new RK4Integrator(this.tensorField, this.minorParams);
        this.minorRoads = new StreamlineGenerator(
            this.integrator, this.domainController.origin,
            this.domainController.worldDimensions, this.minorParams);
        this.majorRoads = new StreamlineGenerator(
            this.integrator, this.domainController.origin,
            this.domainController.worldDimensions, this.majorParams);
        
        this.roadsFolder = this.gui.addFolder('Roads');
        this.roadsFolder.open();
        const majorGUI = {
            Generate: this.generateMajorRoads.bind(this),
            JoinDangling: () => this.majorRoads.joinDanglingStreamlines(),
        };
        const majorRoadsFolder = this.roadsFolder.addFolder('Major');
        majorRoadsFolder.open();
        majorRoadsFolder.add(majorGUI, 'Generate');
        majorRoadsFolder.add(majorGUI, 'JoinDangling');
        const majorRoadsParams = majorRoadsFolder.addFolder('Params');
        this.addParamsToFolder(this.majorParams, majorRoadsParams);
        const majorDevParams = majorRoadsParams.addFolder('Dev');
        this.addDevParamsToFolder(this.majorParams, majorDevParams);

        const minorGUI = {
            Generate: this.generateMinorRoads.bind(this),
            JoinDangling: () => this.minorRoads.joinDanglingStreamlines(),
        };
        const minorRoadsFolder = this.roadsFolder.addFolder('Minor');
        minorRoadsFolder.open();
        minorRoadsFolder.add(minorGUI, 'Generate');
        minorRoadsFolder.add(minorGUI, 'JoinDangling');
        const minorRoadsParams = minorRoadsFolder.addFolder('Params');
        this.addParamsToFolder(this.minorParams, minorRoadsParams);
        const minorDevParams = minorRoadsParams.addFolder('Dev');
        this.addDevParamsToFolder(this.minorParams, minorDevParams);

        // Update path iterations based on window size
        this.setPathIterations();
        window.addEventListener('resize', (): void => this.setPathIterations());

        this.setRecommended();

        requestAnimationFrame(this.draw.bind(this));
    }

    private setPathIterations() {
        const max = 1.5 * Math.max(window.innerWidth, window.innerHeight);
        this.majorParams.pathIterations = max/this.majorParams.dstep;
        this.minorParams.pathIterations = max/this.minorParams.dstep;
        Util.updateGui(this.gui);
    }

    generateMajorRoads(): void {
        this.majorRoads = new StreamlineGenerator(
            this.integrator, this.domainController.origin,
            this.domainController.worldDimensions, Object.assign({},this.majorParams));
        this.minorRoads.clearStreamlines();
        this.majorRoads.createAllStreamlines();
        this.tensorFolder.close();
    }

    generateMinorRoads(): void {
        this.minorRoads = new StreamlineGenerator(
            this.integrator, this.domainController.origin,
            this.domainController.worldDimensions, Object.assign({},this.minorParams));
        this.minorRoads.addExistingStreamlines(this.majorRoads);
        this.minorRoads.createAllStreamlines();
        this.tensorFolder.close();
    }

    private addParamsToFolder(params: StreamlineParams, folder: dat.GUI) {
        // Density
        folder.add(params, 'dsep');
        folder.add(params, 'dtest');
    }

    private addDevParamsToFolder(params: StreamlineParams, folder: dat.GUI) {
        folder.add(params, 'pathIterations');
        folder.add(params, 'seedTries');
        folder.add(params, 'dstep');
        folder.add(params, 'dlookahead');
        folder.add(params, 'dcirclejoin');
        folder.add(params, 'joinangle');
        folder.add(params, 'simplifyTolerance');
    }

    /**
     * World-space random location for tensor field spawn
     * Sampled from middle of screen (shrunk rectangle)
     */
    private randomLocation() {
        const size = this.domainController.worldDimensions.multiplyScalar(this.TENSOR_SPAWN_SCALE);
        const location = new Vector(Math.random(), Math.random()).multiply(size);
        const newOrigin = this.domainController.worldDimensions.multiplyScalar((1 - this.TENSOR_SPAWN_SCALE) / 2);
        return location.add(this.domainController.origin).add(newOrigin);
    }

    addRadial(): void {
        const width = this.domainController.worldDimensions.x;
        this.tensorField.addRadial(this.randomLocation(),
            Util.randomRange(width/10, width/5),  // Size
            Util.randomRange(50));  // Decay
    }

    addGrid(): void {
        this.addGridAtLocation(this.randomLocation());
    }

    private addGridAtLocation(location: Vector) {
        const width = this.domainController.worldDimensions.x;
        this.tensorField.addGrid(location,
            Util.randomRange(width/4, width),  // Size
            Util.randomRange(50),  // Decay
            Util.randomRange(Math.PI/2));
    }

    /**
     * 4 Grids, one radial
     */
    setRecommended(): void {
        this.tensorField.reset();
        const size = this.domainController.worldDimensions.multiplyScalar(this.TENSOR_SPAWN_SCALE);
        const newOrigin = this.domainController.worldDimensions
            .multiplyScalar((1 - this.TENSOR_SPAWN_SCALE) / 2)
            .add(this.domainController.origin);
        this.addGridAtLocation(newOrigin);
        this.addGridAtLocation(newOrigin.clone().add(size));
        this.addGridAtLocation(newOrigin.clone().add(new Vector(size.x, 0)));
        this.addGridAtLocation(newOrigin.clone().add(new Vector(0, size.y)));
        this.addRadial();
    }


    ////////////////////////////////
    // TENSOR FIELD VISUALISATION //
    ////////////////////////////////

    private getCrossLocations(): Vector[] {
        // Gets grid of points for vector field vis in world space
        const diameter = this.TENSOR_LINE_DIAMETER / this.domainController.zoom;
        const worldDimensions = this.domainController.worldDimensions;
        const nHor = Math.ceil(worldDimensions.x / diameter) + 1; // Prevent pop-in
        const nVer = Math.ceil(worldDimensions.y / diameter) + 1;
        const originX = diameter * Math.floor(this.domainController.origin.x / diameter);
        const originY = diameter * Math.floor(this.domainController.origin.y / diameter);

        const out = [];
        for (let x = 0; x <= nHor; x++) {
            for (let y = 0; y <= nVer; y++) {
                out.push(new Vector(originX + (x * diameter), originY + (y * diameter)));
            }
        }

        return out;
    }

    private getTensorLine(point: Vector, tensorV: Vector): Vector[] {
        const transformedPoint = this.domainController.worldToScreen(point.clone());

        const diff = tensorV.multiplyScalar(this.TENSOR_LINE_DIAMETER / 2);  // Assumes normalised
        const start = transformedPoint.clone().sub(diff);
        const end = transformedPoint.clone().add(diff);
        return [start, end];
    }

    private drawTensorField() {
        return !this.tensorFolder.closed
            || (this.majorRoads.allStreamlinesSimple.length === 0
            && this.minorRoads.allStreamlinesSimple.length === 0);
    }

    draw(): void {
        this.canvas.setFillStyle('black');
        this.canvas.clearCanvas();
        if (this.drawTensorField()) {
            // Draw tensor field
            this.canvas.setStrokeStyle('white');
            this.canvas.setLineWidth(1);
            const tensorPoints = this.getCrossLocations();
            tensorPoints.forEach(p => {
                const t = this.tensorField.samplePoint(p);
                this.canvas.drawPolyline(this.getTensorLine(p, t.getMajor()));
                this.canvas.drawPolyline(this.getTensorLine(p, t.getMinor()));
            });

            // Draw centre points of fields
            this.dragController.setDragDisabled(false);
            this.canvas.setFillStyle('red');
            this.tensorField.getCentrePoints().forEach(v =>
                this.canvas.drawSquare(this.domainController.worldToScreen(v), 7));
        } else {
            // Draw Roads
            this.canvas.setFillStyle('#ECE5DB');
            this.canvas.clearCanvas();
            
            // Minor
            if (this.minorRoads.allStreamlinesSimple.length > 0) {
                this.canvas.setStrokeStyle('#020202');
                this.canvas.setLineWidth(3);
                this.minorRoads.allStreamlinesSimple.forEach(s => {
                    this.canvas.drawPolyline(s.map(v => this.domainController.worldToScreen(v.clone())));
                });

                this.canvas.setStrokeStyle('#F8F8F8');
                this.canvas.setLineWidth(2);
                this.minorRoads.allStreamlinesSimple.forEach(s => {
                    this.canvas.drawPolyline(s.map(v => this.domainController.worldToScreen(v.clone())));
                });
            }

            // Major
            if (this.majorRoads.allStreamlinesSimple.length > 0) {
                this.canvas.setStrokeStyle('#282828');
                this.canvas.setLineWidth(5);
                this.majorRoads.allStreamlinesSimple.forEach(s => {
                    this.canvas.drawPolyline(s.map(v => this.domainController.worldToScreen(v.clone())));
                });

                this.canvas.setStrokeStyle('#FAFA7A');
                this.canvas.setLineWidth(4);
                this.majorRoads.allStreamlinesSimple.forEach(s => {
                    this.canvas.drawPolyline(s.map(v => this.domainController.worldToScreen(v.clone())));
                });
            }
        }
        
        requestAnimationFrame(this.draw.bind(this));
    }
}

window.addEventListener('load', (): void => {
    const m = new Main();
});
