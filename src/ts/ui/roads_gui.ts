import * as log from 'loglevel';
import CanvasWrapper from './canvas_wrapper';
import DomainController from './domain_controller';
import TensorField from '../impl/tensor_field';
import {RK4Integrator} from '../impl/integrator';
import {StreamlineParams} from '../impl/streamlines';
import Graph from '../impl/graph';
import RoadGUI from './road_gui';
import Vector from '../vector';
import PolygonFinder from '../impl/polygon_finder';

export default class RoadsGUI {
    private domainController = DomainController.getInstance();
    private intersections: Vector[] = [];
    private polygons: Vector[][] = [];
    private parks: Vector[][] = [];

    private mainRoads: RoadGUI;
    private majorRoads: RoadGUI;
    private minorRoads: RoadGUI;

    // Params
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

    constructor(private guiFolder: dat.GUI, tensorField: TensorField, closeTensorFolder: () => void) {
        this.majorParams = Object.assign({}, this.minorParams);
        this.majorParams.dsep = 100;
        this.majorParams.dtest = 30;
        this.majorParams.dlookahead = 200;

        this.mainParams = Object.assign({}, this.minorParams);
        this.mainParams.dsep = 400;
        this.mainParams.dtest = 200;
        this.mainParams.dlookahead = 300;

        const integrator = new RK4Integrator(tensorField, this.minorParams);
        this.mainRoads = new RoadGUI(this.mainParams, integrator, this.guiFolder, closeTensorFolder, 'Main');
        this.majorRoads = new RoadGUI(this.majorParams, integrator, this.guiFolder, closeTensorFolder, 'Major');
        this.minorRoads = new RoadGUI(this.minorParams, integrator, this.guiFolder, closeTensorFolder, 'Minor');

        this.minorRoads.setExistingStreamlines([this.mainRoads, this.majorRoads]);
        this.majorRoads.setExistingStreamlines([this.mainRoads]);

        this.mainRoads.setGenerateCallback(() => {
            this.majorRoads.clearStreamlines();
            this.minorRoads.clearStreamlines();
        });

        this.majorRoads.setGenerateCallback(() => {
            this.minorRoads.clearStreamlines();
            const g = new Graph(this.majorRoads.allStreamlines.concat(this.mainRoads.allStreamlines), this.minorParams.dstep);
            this.intersections = g.intersections; 
            this.polygons = new PolygonFinder(g.nodes).polygons;

            // Two parks
            this.parks = [];
            const i = Math.floor(Math.random() * this.polygons.length - 3);
            this.parks.push(this.polygons[i]);
            this.parks.push(this.polygons[i + 1]);
            this.parks.push(this.polygons[i + 2]);

            tensorField.setPolygons(this.parks);
        });
    }

    draw(canvas: CanvasWrapper): void {
        canvas.setFillStyle('#ECE5DB');
        canvas.clearCanvas();

        // Parks
        canvas.setFillStyle('#c5e8c5');
        this.parks.forEach(p => {
            canvas.drawPolygon(p.map(v => this.domainController.worldToScreen(v.clone())));
        });

        // Draw Roads
        // Minor
        canvas.setStrokeStyle('#020202');
        canvas.setLineWidth(3);
        this.minorRoads.draw(canvas);


        canvas.setStrokeStyle('#020202');
        canvas.setLineWidth(5);
        this.majorRoads.draw(canvas);

        canvas.setStrokeStyle('#282828');
        canvas.setLineWidth(6);
        this.mainRoads.draw(canvas);

        canvas.setStrokeStyle('#F8F8F8');
        canvas.setLineWidth(2);
        this.minorRoads.draw(canvas);

        // Major
        canvas.setStrokeStyle('#F8F8F8');
        canvas.setLineWidth(4);
        this.majorRoads.draw(canvas);

        // Main
        canvas.setStrokeStyle('#FAFA7A');
        canvas.setLineWidth(5);
        this.mainRoads.draw(canvas);

        // canvas.setFillStyle('red');
        // this.intersections.forEach(v =>
        //     canvas.drawSquare(this.domainController.worldToScreen(v.clone()), 2));
    }

    roadsEmpty(): boolean {
        return this.majorRoads.roadsEmpty()
            && this.minorRoads.roadsEmpty()
            && this.mainRoads.roadsEmpty();
    }
}
