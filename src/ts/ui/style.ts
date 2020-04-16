import * as log from 'loglevel';
import * as dat from 'dat.gui';
import TensorFieldGUI from './tensor_field_gui';
import {NoiseParams} from '../impl/tensor_field';
import RoadsGUI from './roads_gui';
import CanvasWrapper from './canvas_wrapper';
import {DefaultCanvasWrapper, RoughCanvasWrapper} from './canvas_wrapper';
import Util from '../util';
import DragController from './drag_controller';
import DomainController from './domain_controller';
import Vector from '../vector';

export interface ColourScheme {
    bgColour: string;
    bgColourIn?: string;
    buildingColour?: string;
    buildingStroke?: string;
    seaColour: string;
    grassColour?: string;
    minorRoadColour: string;
    minorRoadOutline?: string;
    majorRoadColour?: string;
    majorRoadOutline?: string;
    mainRoadColour?: string;
    mainRoadOutline?: string;
    outlineSize?: number;
    zoomBuildings?: boolean;
}

export default abstract class Style {
    protected canvas: CanvasWrapper;
    protected domainController: DomainController = DomainController.getInstance();
    public abstract createCanvasWrapper(c: HTMLCanvasElement, scale: number, resizeToWindow: boolean): CanvasWrapper;
    public abstract draw(canvas?: CanvasWrapper): void;

    // Polygons
    public seaPolygon: Vector[];
    public buildings: Vector[][];
    public parks: Vector[][];

    // Polylines
    public coastline: Vector[];
    public minorRoads: Vector[][];
    public majorRoads: Vector[][];
    public mainRoads: Vector[][];
    public coastlineRoads: Vector[][];

    public set canvasScale(scale: number) {
        this.canvas.canvasScale = scale;
    }

    public get needsUpdate(): boolean {
        return this.canvas.needsUpdate;
    }

    public set needsUpdate(n: boolean) {
        this.canvas.needsUpdate = n;
    }
}

export class DefaultStyle extends Style {
    constructor(c: HTMLCanvasElement, private colourScheme: ColourScheme) {
        super();

        // Default cascade
        if (!colourScheme.bgColourIn) colourScheme.bgColourIn = colourScheme.bgColour;
        if (!colourScheme.buildingColour) colourScheme.buildingColour = colourScheme.bgColour;
        if (!colourScheme.buildingStroke) colourScheme.buildingStroke = colourScheme.bgColour;
        if (!colourScheme.grassColour) colourScheme.grassColour = colourScheme.bgColour;
        if (!colourScheme.minorRoadOutline) colourScheme.minorRoadOutline = colourScheme.minorRoadColour;
        if (!colourScheme.majorRoadColour) colourScheme.majorRoadColour = colourScheme.minorRoadColour;
        if (!colourScheme.majorRoadOutline) colourScheme.majorRoadOutline = colourScheme.minorRoadOutline;
        if (!colourScheme.mainRoadColour) colourScheme.mainRoadColour = colourScheme.majorRoadColour;
        if (!colourScheme.mainRoadOutline) colourScheme.mainRoadOutline = colourScheme.majorRoadOutline;
        if (!colourScheme.outlineSize) colourScheme.outlineSize = 1;
        if (!colourScheme.zoomBuildings) colourScheme.zoomBuildings = false;

        this.canvas = this.createCanvasWrapper(c, 1, true);
    }

    public createCanvasWrapper(c: HTMLCanvasElement, scale=1, resizeToWindow=true): CanvasWrapper {
        return new DefaultCanvasWrapper(c, scale, resizeToWindow);
    }

    public draw(canvas=this.canvas as DefaultCanvasWrapper): void {
        let bgColour;
        if (this.colourScheme.zoomBuildings) {
            bgColour = this.domainController.zoom >= 2 ? this.colourScheme.bgColour : this.colourScheme.bgColourIn;
        } else {
            bgColour = this.colourScheme.bgColour;
        }
        

        canvas.setFillStyle(bgColour);
        canvas.clearCanvas();

        // Sea
        canvas.setFillStyle(this.colourScheme.seaColour);
        canvas.setStrokeStyle(this.colourScheme.seaColour);
        canvas.setLineWidth(0.1);
        canvas.drawPolygon(this.seaPolygon);

        canvas.setStrokeStyle(bgColour);
        canvas.setLineWidth(30 * this.domainController.zoom);
        canvas.drawPolyline(this.coastline);

        canvas.setLineWidth(1);
        // Buildings
        if (!this.colourScheme.zoomBuildings || this.domainController.zoom >= 2) {
            canvas.setFillStyle(this.colourScheme.buildingColour);
            canvas.setStrokeStyle(this.colourScheme.buildingStroke);
            this.buildings.forEach(b => canvas.drawPolygon(b));
        }

        // Parks
        canvas.setFillStyle(this.colourScheme.grassColour);
        this.parks.forEach(p => canvas.drawPolygon(p));

        // Road outline
        canvas.setStrokeStyle(this.colourScheme.minorRoadOutline);
        canvas.setLineWidth(this.colourScheme.outlineSize + 2 * this.domainController.zoom);
        this.minorRoads.forEach(s => canvas.drawPolyline(s));

        canvas.setStrokeStyle(this.colourScheme.majorRoadOutline);
        canvas.setLineWidth(this.colourScheme.outlineSize + 4 * this.domainController.zoom);
        this.majorRoads.forEach(s => canvas.drawPolyline(s));

        canvas.setStrokeStyle(this.colourScheme.mainRoadOutline);
        canvas.setLineWidth(this.colourScheme.outlineSize + 5 * this.domainController.zoom);
        this.mainRoads.forEach(s => canvas.drawPolyline(s));
        this.coastlineRoads.forEach(s => canvas.drawPolyline(s));

        // Road inline
        canvas.setStrokeStyle(this.colourScheme.minorRoadColour);
        canvas.setLineWidth(2 * this.domainController.zoom);
        this.minorRoads.forEach(s => canvas.drawPolyline(s));

        canvas.setStrokeStyle(this.colourScheme.majorRoadColour);
        canvas.setLineWidth(4 * this.domainController.zoom);
        this.majorRoads.forEach(s => canvas.drawPolyline(s));

        canvas.setStrokeStyle(this.colourScheme.mainRoadColour);
        canvas.setLineWidth(5 * this.domainController.zoom);
        this.mainRoads.forEach(s => canvas.drawPolyline(s));
        this.coastlineRoads.forEach(s => canvas.drawPolyline(s));
    }
}

export class RoughStyle extends Style {
    constructor(c: HTMLCanvasElement) {
        super();
        this.canvas = this.createCanvasWrapper(c, 1, true);
    }

    public createCanvasWrapper(c: HTMLCanvasElement, scale=1, resizeToWindow=true): CanvasWrapper {
        return new RoughCanvasWrapper(c, scale, resizeToWindow);
    }

    public draw(canvas=this.canvas as RoughCanvasWrapper): void {
        canvas.setOptions({
            roughness: 1,
            bowing: 1,
            stroke: '#000000',
            strokeWidth: 1,
            fill: '#000000',
            fillStyle: 'solid',
        });

        canvas.setOptions({
            fill: "rgb(242,236,222)",
            roughness: 1,
            bowing: 1,
            fillStyle: 'solid',
            stroke: "none",
        });

        canvas.clearCanvas();

        // Sea
        canvas.setOptions({
            roughness: 0,
            fillWeight: 1,
            fill: "#dbd2bd",
            fillStyle: 'solid',
            stroke: "none",
            strokeWidth: 1,
        });

        canvas.drawPolygon(this.seaPolygon);

        canvas.setOptions({
            stroke: "rgb(242,236,222)",
            strokeWidth: 30,
        });
        canvas.drawPolyline(this.coastline);

        // Buildings
        canvas.setOptions({
            roughness: 1.2,
            stroke: '#333333',
            strokeWidth: 1,
            fill: '',
        });

        this.buildings.forEach(b => canvas.drawPolygon(b));

        // Parks
        canvas.setOptions({
            fill: "rgb(242,236,222)",
        });
        this.parks.forEach(p => canvas.drawPolygon(p));

        // Road inline
        
        canvas.setOptions({
            stroke: '#666666',
            strokeWidth: 1,
            fill: 'none',
        });

        this.minorRoads.forEach(s => canvas.drawPolyline(s));

        canvas.setOptions({
            strokeWidth: 2,
            stroke: '#444444',
        });

        this.majorRoads.forEach(s => canvas.drawPolyline(s));

        canvas.setOptions({
            strokeWidth: 3,
            stroke: '#222222',
        });

        this.mainRoads.forEach(s => canvas.drawPolyline(s));
        this.coastlineRoads.forEach(s => canvas.drawPolyline(s));
    }
}
