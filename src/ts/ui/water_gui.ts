import * as log from 'loglevel';
import CanvasWrapper from './canvas_wrapper';
import DomainController from './domain_controller';
import Util from '../util';
import FieldIntegrator from '../impl/integrator';
import {StreamlineParams} from '../impl/streamlines';
import {WaterParams} from '../impl/water_generator';
import WaterGenerator from '../impl/water_generator';
import Vector from '../vector';
import PolygonFinder from '../impl/polygon_finder';
import PolygonUtil from '../impl/polygon_util';
import RoadGUI from './road_gui';
import {NoiseParams} from '../impl/tensor_field';
import TensorField from '../impl/tensor_field';

/**
 * Handles generation of river and coastline
 */
export default class WaterGUI extends RoadGUI {
    protected streamlines: WaterGenerator;

    constructor(private tensorField: TensorField,
                protected params: WaterParams,
                integrator: FieldIntegrator,
                guiFolder: dat.GUI,
                closeTensorFolder: () => void,
                folderName: string,
                redraw: () => void) {
        super(params, integrator, guiFolder, closeTensorFolder, folderName, redraw);
        this.streamlines = new WaterGenerator(
            this.integrator, this.domainController.origin,
            this.domainController.worldDimensions,
            Object.assign({},this.params), this.tensorField);
    }

    initFolder(): WaterGUI {
        const folder = this.guiFolder.addFolder(this.folderName);
        folder.add({Generate: () => this.generateRoads()}, 'Generate');
        
        const coastParamsFolder = folder.addFolder('CoastParams');
        coastParamsFolder.add(this.params.coastNoise, 'noiseEnabled');
        coastParamsFolder.add(this.params.coastNoise, 'noiseSize');
        coastParamsFolder.add(this.params.coastNoise, 'noiseAngle');
        const riverParamsFolder = folder.addFolder('RiverParams');
        riverParamsFolder.add(this.params.riverNoise, 'noiseEnabled');
        riverParamsFolder.add(this.params.riverNoise, 'noiseSize');
        riverParamsFolder.add(this.params.riverNoise, 'noiseAngle');
        
        folder.add(this.params, 'simplifyTolerance');
        const devParamsFolder = folder.addFolder('Dev');
        this.addDevParamsToFolder(this.params, devParamsFolder);
        return this;
    }

    generateRoads(): Promise<void> {
        this.preGenerateCallback();

        this.domainController.zoom = this.domainController.zoom / Util.DRAW_INFLATE_AMOUNT;
        this.streamlines = new WaterGenerator(
            this.integrator, this.domainController.origin,
            this.domainController.worldDimensions,
            Object.assign({},this.params), this.tensorField);
        this.domainController.zoom = this.domainController.zoom * Util.DRAW_INFLATE_AMOUNT;

        this.streamlines.createCoast();
        this.streamlines.createRiver();
       
        this.closeTensorFolder();
        this.redraw();
        this.postGenerateCallback();
        return new Promise<void>(resolve => resolve());
    }

    /**
     * Secondary road runs along other side of river
     */
    get streamlinesWithSecondaryRoad(): Vector[][] {
        const withSecondary = this.streamlines.allStreamlinesSimple.slice();
        withSecondary.push(this.streamlines.riverSecondaryRoad);
        return withSecondary;
    }

    get river(): Vector[] {
        return this.streamlines.riverPolygon.map(v => this.domainController.worldToScreen(v.clone()));
    }

    get secondaryRiver(): Vector[] {
        return this.streamlines.riverSecondaryRoad.map(v => this.domainController.worldToScreen(v.clone()));
    }

    get coastline(): Vector[] {
        // Use unsimplified noisy streamline as coastline
        // Visual only, no road logic performed using this
        return this.streamlines.coastline.map(v => this.domainController.worldToScreen(v.clone()));
    }

    get seaPolygon(): Vector[] {
        return this.streamlines.seaPolygon.map(v => this.domainController.worldToScreen(v.clone()));
    }

    protected addDevParamsToFolder(params: StreamlineParams, folder: dat.GUI): void {
        folder.add(params, 'dsep');
        folder.add(params, 'dtest');
        folder.add(params, 'pathIterations');
        folder.add(params, 'seedTries');
        folder.add(params, 'dstep');
        folder.add(params, 'dlookahead');
        folder.add(params, 'dcirclejoin');
        folder.add(params, 'joinangle');
    }
    
}
