import * as log from 'loglevel';
import CanvasWrapper from './canvas_wrapper';
import DomainController from './domain_controller';
import Util from '../util';
import FieldIntegrator from '../impl/integrator';
import {StreamlineParams} from '../impl/streamlines';
import StreamlineGenerator from '../impl/streamlines';
import Vector from '../vector';
import PolygonFinder from '../impl/polygon_finder';
import PolygonUtil from '../impl/polygon_util';
import RoadGUI from './road_gui';
import {NoiseParams} from '../impl/tensor_field';
import TensorField from '../impl/tensor_field';

export default class CoastlineGUI extends RoadGUI {
    private _seaPolygon: Vector[] = [];
    private _riverPolygon: Vector[] = [];
    private _riverRoads: Vector[][] = [];
    private _noisyRoad: Vector[] = [];
    public noise: boolean = true;

    constructor(private tensorField: TensorField,
                params: StreamlineParams,
                integrator: FieldIntegrator,
                guiFolder: dat.GUI,
                closeTensorFolder: () => void,
                folderName: string,
                redraw: () => void,
                private noiseParams: NoiseParams) {
        super(params, integrator, guiFolder, closeTensorFolder, folderName, redraw);

    }

    initFolder(): CoastlineGUI {
        const roadGUI = {
            Generate: this.generateRoads.bind(this),
        };

        const folder = this.guiFolder.addFolder(this.folderName);
        folder.open();
        folder.add(roadGUI, 'Generate');
        
        const paramsFolder = folder.addFolder('Params');
        paramsFolder.add(this, 'noise');
        paramsFolder.add(this.noiseParams, 'noiseSizeGlobal');
        paramsFolder.add(this.noiseParams, 'noiseAngleGlobal');
        paramsFolder.add(this.params, 'simplifyTolerance');

        const devParamsFolder = paramsFolder.addFolder('Dev');
        this.addDevParamsToFolder(this.params, devParamsFolder);
        return this;
    }

    generateRoads(): Promise<unknown> {
        this.preGenerateCallback();

        this.domainController.zoom = this.domainController.zoom / 1.2;
        this.streamlines = new StreamlineGenerator(
            this.integrator, this.domainController.origin,
            this.domainController.worldDimensions, Object.assign({},this.params));
        this.domainController.zoom = this.domainController.zoom * 1.2;

        if (this.noise) {
            this.noiseParams.globalNoise = true;
        }

        const lines = this.streamlines.createCoastStreamlines()  // Unsimplified
        this._noisyRoad = lines[0];
        
        // Expand to create unsimplified
        this._riverPolygon = PolygonUtil.resizeGeometry(lines[1], 20, false);
        const roadPolygon = PolygonUtil.resizeGeometry(lines[1], 20, false);
        // Make sure riverPolygon[0] is off screen
        const firstOffScreen = roadPolygon.findIndex(v => !this.domainController.onScreen(v));
        for (let i = 0; i < firstOffScreen; i++) {
            roadPolygon.push(roadPolygon.shift());
        }

        // Simplified streamline used as road and sea polygon
        this._seaPolygon = this.getSeaPolygon(this.allStreamlines[0]);
        this.tensorField.addWater(this._seaPolygon);

        // Create river roads
        const riverSplitPoly = this.getSeaPolygon(lines[1]);
        this.streamlines.manuallyAddStreamline(roadPolygon.filter(v =>
            !PolygonUtil.insidePolygon(v, this._seaPolygon)
            && this.domainController.onScreen(v)
            && PolygonUtil.insidePolygon(v, riverSplitPoly)));
        this.streamlines.manuallyAddStreamline(roadPolygon.filter(v =>
            !PolygonUtil.insidePolygon(v, this._seaPolygon)
            && this.domainController.onScreen(v)
            && !PolygonUtil.insidePolygon(v, riverSplitPoly)));

        this.noiseParams.globalNoise = false;

        this.closeTensorFolder();
        this.redraw();
        this.postGenerateCallback();
        return null;
    }

    get river(): Vector[] {
        return this._riverPolygon.map(v => this.domainController.worldToScreen(v.clone()));
    }

    get riverRoads(): Vector[][] {
        return this._riverRoads.map(
            r => r.map(v => this.domainController.worldToScreen(v.clone())));
    }

    get coastline(): Vector[] {
        // Use unsimplified noisy streamline as coastline
        // Visual only, no road logic performed using this
        return this._noisyRoad.map(v => this.domainController.worldToScreen(v.clone()));
    }

    get seaPolygon(): Vector[] {
        return this._seaPolygon.map(v => this.domainController.worldToScreen(v.clone()));
    }

    /**
     * Might reverse input array
     */
    private getSeaPolygon(polyline: Vector[]): Vector[] {
        this.domainController.zoom = this.domainController.zoom / 1.2;
        const seaPolygon = PolygonUtil.sliceRectangle(this.domainController.origin, this.domainController.worldDimensions,
            polyline[0], polyline[polyline.length - 1]);
        this.domainController.zoom = this.domainController.zoom * 1.2;

        // Replace the longest side with coastline
        let longestIndex = 0;
        let longestLength = 0;
        for (let i = 0; i < seaPolygon.length; i++) {
            const next = (i + 1) % seaPolygon.length;
            const d = seaPolygon[i].distanceToSquared(seaPolygon[next]);
            if (d > longestLength) {
                longestLength = d;
                longestIndex = i;
            }
        }

        const insertBackwards = seaPolygon[longestIndex].distanceToSquared(polyline[0]) > seaPolygon[longestIndex].distanceToSquared(polyline[polyline.length - 1]);
        if (insertBackwards) {
            polyline.reverse();
        }

        seaPolygon.splice((longestIndex + 1) % seaPolygon.length, 0, ...polyline);
        return seaPolygon;
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
