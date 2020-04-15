import * as log from 'loglevel';
import CanvasWrapper from './canvas_wrapper';
import DomainController from './domain_controller';
import Util from '../util';
import FieldIntegrator from '../impl/integrator';
import {StreamlineParams} from '../impl/streamlines';
import StreamlineGenerator from '../impl/streamlines';
import Vector from '../vector';
import PolygonFinder from '../impl/polygon_finder';
import RoadGUI from './road_gui';
import {NoiseParams} from '../impl/tensor_field';

export default class CoastlineGUI extends RoadGUI {
    private _seaPolygon: Vector[] = [];
    private _noisyRoad: Vector[] = [];
    public noise: boolean = true;

    constructor(params: StreamlineParams,
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

    get seaPolygon(): Vector[] {
        return this._seaPolygon;
    }

    generateRoads(): void {
        this.preGenerateCallback();

        this.domainController.zoom = this.domainController.zoom / 1.1;
        this.streamlines = new StreamlineGenerator(
            this.integrator, this.domainController.origin,
            this.domainController.worldDimensions, Object.assign({},this.params));
        this.domainController.zoom = this.domainController.zoom * 1.1;

        if (this.noise) {
            this.noiseParams.globalNoise = true;
        }
        this._noisyRoad = this.streamlines.createCoastStreamline();
        this._seaPolygon = this.getSeaPolygon(this.allStreamlines[0]);
        this.noiseParams.globalNoise = false;

        this.closeTensorFolder();
        this.redraw();
        this.postGenerateCallback();
    }

    drawCoastline(canvas: CanvasWrapper): void {
        canvas.drawPolyline(this._noisyRoad.map(v => this.domainController.worldToScreen(v.clone())));
    }

    drawSea(canvas: CanvasWrapper): void {
        canvas.drawPolygon(this._seaPolygon.map(v => this.domainController.worldToScreen(v.clone())));
    }

    /**
     * Might reverse input array
     */
    private getSeaPolygon(polyline: Vector[]): Vector[] {
        this.domainController.zoom = this.domainController.zoom / 1.1;
        const seaPolygon = PolygonFinder.sliceRectangle(this.domainController.origin, this.domainController.worldDimensions,
            polyline[0], polyline[polyline.length - 1]);
        this.domainController.zoom = this.domainController.zoom * 1.1;

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

        seaPolygon.splice(longestIndex, 0, ...polyline);
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
