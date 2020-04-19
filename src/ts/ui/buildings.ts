import * as log from 'loglevel';
import DomainController from './domain_controller';
import TensorField from '../impl/tensor_field';
import {RK4Integrator} from '../impl/integrator';
import FieldIntegrator from '../impl/integrator';
import {StreamlineParams} from '../impl/streamlines';
import {WaterParams} from '../impl/water_generator';
import Graph from '../impl/graph';
import RoadGUI from './road_gui';
import WaterGUI from './water_gui';
import Vector from '../vector';
import PolygonFinder from '../impl/polygon_finder';
import {PolygonParams} from '../impl/polygon_finder';
import StreamlineGenerator from '../impl/streamlines';
import WaterGenerator from '../impl/water_generator';
import Style from './style';
import CanvasWrapper from './canvas_wrapper';

export default class Buildings {
    private polygonFinder: PolygonFinder;
    private _animate: boolean;
    private allStreamlines: Vector[][] = [];
    private domainController = DomainController.getInstance();
    private preGenerateCallback: () => any = () => {};
    private postGenerateCallback: () => any = () => {};

    private buildingParams: PolygonParams = {
        maxLength: 20,
        minArea: 80,
        shrinkSpacing: 4,
        maxAspectRatio: 5,
    };

    constructor(private tensorField: TensorField,
                folder: dat.GUI,
                private redraw: () => void,
                private dstep: number) {
        folder.add({'AddBuildings': () => this.generate(this._animate)}, 'AddBuildings');
        folder.add(this.buildingParams, 'minArea');
        folder.add(this.buildingParams, 'maxAspectRatio');
        folder.add(this.buildingParams, 'shrinkSpacing');
        this.polygonFinder = new PolygonFinder([], this.buildingParams, this.tensorField);
    }

    set animate(v: boolean) {
        this._animate = v;
    }

    get polygons(): Vector[][] {
        return this.polygonFinder.polygons.map(l => l.map(v => this.domainController.worldToScreen(v.clone())));
    }

    setAllStreamlines(s: Vector[][]) {
        this.allStreamlines = s;
    }

    reset(): void {
        this.polygonFinder.reset();
    }

    update(): boolean {
        return this.polygonFinder.update();
    }

    async generate(animate=false): Promise<void> {
        this.preGenerateCallback();
        const g = new Graph(this.allStreamlines, this.dstep, true);

        this.polygonFinder = new PolygonFinder(g.nodes, this.buildingParams, this.tensorField);
        this.polygonFinder.findPolygons();
        await this.polygonFinder.shrink(animate);
        await this.polygonFinder.divide(animate);
        this.redraw();
        this.postGenerateCallback();
    }

    setPreGenerateCallback(callback: () => any) {
        this.preGenerateCallback = callback;
    }

    setPostGenerateCallback(callback: () => any) {
        this.postGenerateCallback = callback;
    }
}