import * as log from 'loglevel';
import CanvasWrapper from './canvas_wrapper';
import DomainController from './domain_controller';
import TensorField from '../impl/tensor_field';
import {RK4Integrator} from '../impl/integrator';
import FieldIntegrator from '../impl/integrator';
import {StreamlineParams} from '../impl/streamlines';
import Graph from '../impl/graph';
import RoadGUI from './road_gui';
import CoastlineGUI from './coastline_gui';
import Vector from '../vector';
import PolygonFinder from '../impl/polygon_finder';
import StreamlineGenerator from '../impl/streamlines';

export default class RoadsGUI {
    private domainController = DomainController.getInstance();
    private intersections: Vector[] = [];
    public numParks: number = 2;
    private parks: Vector[][] = [];
    private lots: Vector[][] = [];

    private buildingSize = 80;
    private buildingMargin = 4;

    private coastline: CoastlineGUI;
    private mainRoads: RoadGUI;
    private majorRoads: RoadGUI;
    private minorRoads: RoadGUI;

    // Params
    private coastlineParams: StreamlineParams;
    private mainParams: StreamlineParams;
    private majorParams: StreamlineParams;
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

    private redraw: boolean = true;

    constructor(private guiFolder: dat.GUI, tensorField: TensorField, private closeTensorFolder: () => void) {
        const roadsParams = guiFolder.addFolder('Params');
        roadsParams.add(this, 'numParks');

        this.coastlineParams = Object.assign({}, this.minorParams);
        this.coastlineParams.pathIterations = 10000;
        this.coastlineParams.simplifyTolerance = 10;

        this.majorParams = Object.assign({}, this.minorParams);
        this.majorParams.dsep = 100;
        this.majorParams.dtest = 30;
        this.majorParams.dlookahead = 200;

        this.mainParams = Object.assign({}, this.minorParams);
        this.mainParams.dsep = 400;
        this.mainParams.dtest = 200;
        this.mainParams.dlookahead = 300;

        const integrator = new RK4Integrator(tensorField, this.minorParams);
        const redraw = () => this.redraw = true;
        this.coastline = new CoastlineGUI(this.coastlineParams, integrator,
            this.guiFolder, closeTensorFolder, 'Coastline', redraw, tensorField.noiseParams).initFolder();
        this.mainRoads = new RoadGUI(this.mainParams, integrator, this.guiFolder, closeTensorFolder, 'Main', redraw).initFolder();
        this.majorRoads = new RoadGUI(this.majorParams, integrator, this.guiFolder, closeTensorFolder, 'Major', redraw).initFolder();
        this.minorRoads = new RoadGUI(this.minorParams, integrator, this.guiFolder, closeTensorFolder, 'Minor', redraw).initFolder();

        this.minorRoads.setExistingStreamlines([this.coastline, this.mainRoads, this.majorRoads]);
        this.majorRoads.setExistingStreamlines([this.coastline, this.mainRoads]);
        this.mainRoads.setExistingStreamlines([this.coastline]);

        this.coastline.setPreGenerateCallback(() => {
            this.mainRoads.clearStreamlines();
            this.majorRoads.clearStreamlines();
            this.minorRoads.clearStreamlines();
            this.parks = [];
            this.lots = [];
            tensorField.setParks([]);
            tensorField.setSea([]);
        });

        this.coastline.setPostGenerateCallback(() => {
            tensorField.setSea(this.coastline.seaPolygon);
        });

        this.mainRoads.setPreGenerateCallback(() => {
            this.majorRoads.clearStreamlines();
            this.minorRoads.clearStreamlines();
            this.parks = [];
            this.lots = [];
            tensorField.setParks([]);
        });

        this.majorRoads.setPreGenerateCallback(() => {
            this.minorRoads.clearStreamlines();
            this.parks = [];
            this.lots = [];
            tensorField.setParks(this.parks);
        });

        this.majorRoads.setPostGenerateCallback(() => {
            const g = new Graph(this.majorRoads.allStreamlines.concat(this.mainRoads.allStreamlines), this.minorParams.dstep);
            this.intersections = g.intersections; 
            const p = new PolygonFinder(g.nodes);
            p.findPolygons();
            const polygons = p.polygons;

            if (polygons.length > this.numParks) {
                const parkIndex = Math.floor(Math.random() * (polygons.length - this.numParks));
                for (let i = parkIndex; i < parkIndex + this.numParks; i++) {
                    this.parks.push(polygons[i]);    
                }
            } else {
                for (let p of polygons) {
                    this.parks.push(p);
                }
            }
        });

        this.minorRoads.setPreGenerateCallback(() => {
            this.lots = [];
        });

        const buildingsFolder = guiFolder.addFolder('Buildings');
        buildingsFolder.add(this, 'addBuildings');
        buildingsFolder.add(this, 'buildingSize');
        buildingsFolder.add(this, 'buildingMargin');
    }

    addBuildings() {
        const g = new Graph(
            this.majorRoads.allStreamlines
            .concat(this.mainRoads.allStreamlines)
            .concat(this.minorRoads.allStreamlines)
            .concat(this.coastline.allStreamlines), this.minorParams.dstep);
        const p = new PolygonFinder(g.nodes);
        p.shrink(this.buildingMargin);
        p.divide(this.buildingSize);
        this.lots = p.polygons;
        this.redraw = true;
    }

    draw(canvas: CanvasWrapper, forceDraw=false): void {
        if (!forceDraw && !this.redraw && !this.domainController.moved) {
            return;
        }

        this.domainController.moved = false;
        this.redraw = false;

        canvas.setFillStyle('#ECE5DB');
        canvas.clearCanvas();

        // Sea
        canvas.setFillStyle('#a9d9fe');
        canvas.setStrokeStyle('#a9d9fe');
        canvas.setLineWidth(0.1);
        canvas.drawPolygon(this.coastline.seaPolygon.map(v => this.domainController.worldToScreen(v.clone())));

        canvas.setStrokeStyle('#ECE5DB');
        canvas.setLineWidth(30 * this.domainController.zoom);
        this.coastline.drawCoastline(canvas);

        // Buildings
        canvas.setFillStyle('#ECE5DB');
        // canvas.setFillStyle('#ebae34');
        canvas.setStrokeStyle('#282828');
        canvas.setLineWidth(0.5);
        this.lots.forEach(p => {
            canvas.drawPolygon(p.map(v => this.domainController.worldToScreen(v.clone())));
        });

        // Parks
        canvas.setFillStyle('#c5e8c5');
        this.parks.forEach(p => {
            canvas.drawPolygon(p.map(v => this.domainController.worldToScreen(v.clone())));
        });

        // Road outline
        canvas.setStrokeStyle('#020202');
        canvas.setLineWidth(3 * this.domainController.zoom);
        this.minorRoads.draw(canvas);

        canvas.setStrokeStyle('#020202');
        canvas.setLineWidth(5 * this.domainController.zoom);
        this.majorRoads.draw(canvas);

        canvas.setStrokeStyle('#282828');
        canvas.setLineWidth(6 * this.domainController.zoom);
        this.mainRoads.draw(canvas);
        this.coastline.draw(canvas);

        // Road inline
        canvas.setStrokeStyle('#F8F8F8');
        canvas.setLineWidth(2 * this.domainController.zoom);
        this.minorRoads.draw(canvas);

        canvas.setStrokeStyle('#F8F8F8');
        canvas.setLineWidth(4 * this.domainController.zoom);
        this.majorRoads.draw(canvas);

        canvas.setStrokeStyle('#FAFA7A');
        canvas.setLineWidth(5 * this.domainController.zoom);
        this.mainRoads.draw(canvas);
        this.coastline.draw(canvas);

        // Coast
        // canvas.setStrokeStyle('#020202');
        // canvas.setLineWidth(1);
        // canvas.drawPolyline(this.coast.map(v => this.domainController.worldToScreen(v.clone())));

        // canvas.setFillStyle('red');
        // this.intersections.forEach(v =>
        //     canvas.drawSquare(this.domainController.worldToScreen(v.clone()), 2));
    }

    roadsEmpty(): boolean {
        return this.majorRoads.roadsEmpty()
            && this.minorRoads.roadsEmpty()
            && this.mainRoads.roadsEmpty()
            && this.coastline.roadsEmpty();
    }
}
