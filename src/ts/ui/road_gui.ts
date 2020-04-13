import * as log from 'loglevel';
import CanvasWrapper from './canvas_wrapper';
import DomainController from './domain_controller';
import Util from '../util';
import FieldIntegrator from '../impl/integrator';
import {StreamlineParams} from '../impl/streamlines';
import StreamlineGenerator from '../impl/streamlines';
import Vector from '../vector';

export default class RoadGUI {
    private streamlines: StreamlineGenerator;
    private existingStreamlines: RoadGUI[] = [];
    private domainController = DomainController.getInstance();
    private generateCallback: () => any = () => {};

    constructor(private params: StreamlineParams,
                private integrator: FieldIntegrator,
                private guiFolder: dat.GUI,
                private closeTensorFolder: () => void,
                private folderName: string) {
        this.streamlines = new StreamlineGenerator(
            this.integrator, this.domainController.origin,
            this.domainController.worldDimensions, this.params);

        const roadGUI = {
            Generate: this.generateRoads.bind(this),
            JoinDangling: (): void => this.streamlines.joinDanglingStreamlines(),
        };

        const folder = this.guiFolder.addFolder(this.folderName);
        folder.open();
        folder.add(roadGUI, 'Generate');
        folder.add(roadGUI, 'JoinDangling');
        
        const paramsFolder = folder.addFolder('Params');
        paramsFolder.add(this.params, 'dsep');
        paramsFolder.add(this.params, 'dtest');

        const devParamsFolder = paramsFolder.addFolder('Dev');
        this.addDevParamsToFolder(this.params, devParamsFolder);

        // Update path iterations based on window size
        this.setPathIterations();
        window.addEventListener('resize', (): void => this.setPathIterations());
    }

    get allStreamlines(): Vector[][] {
        return this.streamlines.allStreamlinesSimple;
    }

    draw(canvas: CanvasWrapper): void {
        this.streamlines.allStreamlinesSimple.forEach(s => {
            canvas.drawPolyline(s.map(v => this.domainController.worldToScreen(v.clone())));
        });
    }

    roadsEmpty(): boolean {
        return this.streamlines.allStreamlinesSimple.length === 0;
    }

    setExistingStreamlines(existingStreamlines: RoadGUI[]): void {
        this.existingStreamlines = existingStreamlines;
    }

    setGenerateCallback(callback: () => any) {
        this.generateCallback = callback;
    }

    clearStreamlines(): void {
        this.streamlines.clearStreamlines();
    }

    generateRoads(): void {
        this.streamlines = new StreamlineGenerator(
            this.integrator, this.domainController.origin,
            this.domainController.worldDimensions, Object.assign({},this.params));
        this.existingStreamlines.forEach(s => this.streamlines.addExistingStreamlines(s.streamlines));        
        this.streamlines.createAllStreamlines();
        this.closeTensorFolder();
        this.generateCallback();
    }

    private addDevParamsToFolder(params: StreamlineParams, folder: dat.GUI): void {
        folder.add(params, 'pathIterations');
        folder.add(params, 'seedTries');
        folder.add(params, 'dstep');
        folder.add(params, 'dlookahead');
        folder.add(params, 'dcirclejoin');
        folder.add(params, 'joinangle');
        folder.add(params, 'simplifyTolerance');
    }

    /**
     * Sets path iterations so that a road can cover the screen
     */
    private setPathIterations(): void {
        const max = 1.5 * Math.max(window.innerWidth, window.innerHeight);
        this.params.pathIterations = max/this.params.dstep;
        Util.updateGui(this.guiFolder);
    }
}
