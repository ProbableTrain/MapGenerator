import * as log from 'loglevel';
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
import {PolygonParams} from '../impl/polygon_finder';
import StreamlineGenerator from '../impl/streamlines';
import Style from './style';
import CanvasWrapper from './canvas_wrapper';

export default class RoadsGUI {
    private domainController = DomainController.getInstance();
    private intersections: Vector[] = [];
    public numParks: number = 2;
    private parks: Vector[][] = [];
    private animate: boolean = true;
    private animationSpeed: number = 30;

    private coastline: CoastlineGUI;
    private mainRoads: RoadGUI;
    private majorRoads: RoadGUI;
    private minorRoads: RoadGUI;
    private buildings: PolygonFinder;

    // Params
    private coastlineParams: StreamlineParams;
    private mainParams: StreamlineParams;
    private majorParams: StreamlineParams;
    private minorParams: StreamlineParams = {
        dsep: 20,
        dtest: 15,
        dstep: 1,
        dlookahead: 40,
        dcirclejoin: 5,
        joinangle: 0.1,  // approx 30deg
        pathIterations: 1000,
        seedTries: 300,
        simplifyTolerance: 0.5,
        collideEarly: 0.7,
    };

    private buildingParams: PolygonParams = {
        maxLength: 20,
        minArea: 80,
        shrinkSpacing: 4,
        maxAspectRatio: 5,
    };

    private redraw: boolean = true;

    constructor(private guiFolder: dat.GUI, tensorField: TensorField, private closeTensorFolder: () => void) {
        guiFolder.add(this, 'generateEverything');
        const animateController = guiFolder.add(this, 'animate');
        guiFolder.add(this, 'animationSpeed');

        const roadsParams = guiFolder.addFolder('Params');
        roadsParams.add(this, 'numParks');

        this.coastlineParams = Object.assign({}, this.minorParams);
        this.coastlineParams.pathIterations = 10000;
        this.coastlineParams.simplifyTolerance = 10;

        this.majorParams = Object.assign({}, this.minorParams);
        this.majorParams.dsep = 100;
        this.majorParams.dtest = 30;
        this.majorParams.dlookahead = 200;
        this.majorParams.collideEarly = 0;

        this.mainParams = Object.assign({}, this.minorParams);
        this.mainParams.dsep = 400;
        this.mainParams.dtest = 200;
        this.mainParams.dlookahead = 500;
        this.mainParams.collideEarly = 0;

        const integrator = new RK4Integrator(tensorField, this.minorParams);
        const redraw = () => this.redraw = true;
        this.coastline = new CoastlineGUI(this.coastlineParams, integrator,
            this.guiFolder, closeTensorFolder, 'Coastline', redraw, tensorField.noiseParams).initFolder();
        this.mainRoads = new RoadGUI(this.mainParams, integrator, this.guiFolder, closeTensorFolder, 'Main', redraw).initFolder();
        this.majorRoads = new RoadGUI(this.majorParams, integrator, this.guiFolder, closeTensorFolder, 'Major', redraw, this.animate).initFolder();
        this.minorRoads = new RoadGUI(this.minorParams, integrator, this.guiFolder, closeTensorFolder, 'Minor', redraw, this.animate).initFolder();
        this.buildings = new PolygonFinder([], this.buildingParams);

        animateController.onChange((b: boolean) => {
            this.majorRoads.animate = b;
            this.minorRoads.animate = b;
        });

        this.minorRoads.setExistingStreamlines([this.coastline, this.mainRoads, this.majorRoads]);
        this.majorRoads.setExistingStreamlines([this.coastline, this.mainRoads]);
        this.mainRoads.setExistingStreamlines([this.coastline]);

        this.coastline.setPreGenerateCallback(() => {
            this.mainRoads.clearStreamlines();
            this.majorRoads.clearStreamlines();
            this.minorRoads.clearStreamlines();
            this.parks = [];
            this.buildings.reset();
            tensorField.setParks([]);
            tensorField.setSea([]);
        });

        this.coastline.setPostGenerateCallback(() => {
            // seaPolygon is in screen space for rendering
            tensorField.setSea(this.coastline.seaPolygon.map(v => this.domainController.screenToWorld(v.clone())));
        });

        this.mainRoads.setPreGenerateCallback(() => {
            this.majorRoads.clearStreamlines();
            this.minorRoads.clearStreamlines();
            this.parks = [];
            this.buildings.reset();
            tensorField.setParks([]);
        });

        this.majorRoads.setPreGenerateCallback(() => {
            this.minorRoads.clearStreamlines();
            this.parks = [];
            this.buildings.reset();
            tensorField.setParks(this.parks);
        });

        this.majorRoads.setPostGenerateCallback(() => {
            const g = new Graph(this.majorRoads.allStreamlines.concat(this.mainRoads.allStreamlines), this.minorParams.dstep);
            this.intersections = g.intersections;

            const p = new PolygonFinder(g.nodes, this.buildingParams);
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

            this.redraw = true;
        });

        this.minorRoads.setPreGenerateCallback(() => {
            this.buildings.reset();
        });

        const buildingsFolder = guiFolder.addFolder('Buildings');
        buildingsFolder.add(this, 'addBuildings');
        buildingsFolder.add(this.buildingParams, 'minArea');
        buildingsFolder.add(this.buildingParams, 'maxAspectRatio');
        buildingsFolder.add(this.buildingParams, 'shrinkSpacing');
    }

    async generateEverything() {
        this.coastline.generateRoads();
        await this.mainRoads.generateRoads();
        await this.majorRoads.generateRoads(this.animate);
        await this.minorRoads.generateRoads(this.animate);
        this.redraw = true;
        await this.addBuildings(this.animate);
    }

    async addBuildings(animate=true): Promise<void> {
        const g = new Graph(
            this.majorRoads.allStreamlines
            .concat(this.mainRoads.allStreamlines)
            .concat(this.minorRoads.allStreamlines)
            .concat(this.coastline.allStreamlines), this.minorParams.dstep, true);
        this.buildings = new PolygonFinder(g.nodes, this.buildingParams);
       
        await this.buildings.shrink(animate);
        await this.buildings.divide(animate);
        this.redraw = true;
    }

    update() {
        let continueUpdate = true;
        const start = performance.now();
        while (continueUpdate && performance.now() - start < this.animationSpeed) {
            const minorChanged = this.minorRoads.update();
            const majorChanged = this.majorRoads.update();
            const mainChanged = this.mainRoads.update();
            const buildingsChanged = this.buildings.update();
            continueUpdate = minorChanged || majorChanged || mainChanged || buildingsChanged;
        }
        
        this.redraw = this.redraw || continueUpdate;
    }

    draw(style: Style, forceDraw=false, customCanvas?: CanvasWrapper): void {
        if (!style.needsUpdate && !forceDraw && !this.redraw && !this.domainController.moved) {
            return;
        }

        style.needsUpdate = false;
        this.domainController.moved = false;
        this.redraw = false;

        style.seaPolygon = this.coastline.seaPolygon;
        style.coastline = this.coastline.coastline;
        style.buildings = this.buildings.polygons.map(l => l.map(v => this.domainController.worldToScreen(v.clone())));
        style.parks = this.parks.map(p => p.map(v => this.domainController.worldToScreen(v.clone())));
        style.minorRoads = this.minorRoads.roads;
        style.majorRoads = this.majorRoads.roads;
        style.mainRoads = this.mainRoads.roads;
        style.coastlineRoads = this.coastline.roads;
        style.draw(customCanvas);
    }

    roadsEmpty(): boolean {
        return this.majorRoads.roadsEmpty()
            && this.minorRoads.roadsEmpty()
            && this.mainRoads.roadsEmpty()
            && this.coastline.roadsEmpty();
    }
}
