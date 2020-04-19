import * as log from 'loglevel';
import * as dat from 'dat.gui';
import TensorFieldGUI from './tensor_field_gui';
import {NoiseParams} from '../impl/tensor_field';
import CanvasWrapper from './canvas_wrapper';
import {DefaultCanvasWrapper, RoughCanvasWrapper} from './canvas_wrapper';
import Util from '../util';
import PolygonUtil from '../impl/polygon_util';
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
    minorWidth?: number;
    majorWidth?: number;
    mainWidth?: number;
    zoomBuildings?: boolean;
    frameColour?: string;
    frameTextColour?: string;
}

export default abstract class Style {
    protected canvas: CanvasWrapper;
    protected domainController: DomainController = DomainController.getInstance();
    public abstract createCanvasWrapper(c: HTMLCanvasElement, scale: number, resizeToWindow: boolean): CanvasWrapper;
    public abstract draw(canvas?: CanvasWrapper): void;

    // Polygons
    public seaPolygon: Vector[] = [];
    public buildings: Vector[][] = [];
    public parks: Vector[][] = [];

    // Polylines
    public coastline: Vector[] = [];
    public river: Vector[] = [];
    public secondaryRiver: Vector[] = [];
    public minorRoads: Vector[][] = [];
    public majorRoads: Vector[][] = [];
    public mainRoads: Vector[][] = [];
    public coastlineRoads: Vector[][] = [];
    public showFrame: boolean;

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
        if (!colourScheme.minorWidth) colourScheme.minorWidth = 2;
        if (!colourScheme.majorWidth) colourScheme.majorWidth = 4;
        if (!colourScheme.mainWidth) colourScheme.mainWidth = 5;
        if (!colourScheme.mainWidth) colourScheme.mainWidth = 5;
        if (!colourScheme.frameColour) colourScheme.frameColour = colourScheme.bgColour;
        if (!colourScheme.frameTextColour) colourScheme.frameTextColour = colourScheme.minorRoadOutline;

        this.canvas = this.createCanvasWrapper(c, 1, true);
    }

    set zoomBuildings(b: boolean) {
        this.colourScheme.zoomBuildings = b;
    }

    public createCanvasWrapper(c: HTMLCanvasElement, scale=1, resizeToWindow=true): CanvasWrapper {
        return new DefaultCanvasWrapper(c, scale, resizeToWindow);
    }

    private heightVectorToScreen(v: Vector, h: number) {
        const d = 1000 / this.domainController.zoom;
        const scale = d / (d - h);
        const centre = this.domainController.screenDimensions.divideScalar(2);
        // const perspective = this.domainController.screenDimensions.x * 0.8;
        
        // const scaleProjected = perspective / (perspective - d);
        return v.clone().sub(centre).multiplyScalar(scale).add(centre);
    }

    private getScaledPolygon(p: Vector[], zoom: number, buildingHeight: number, fov: number, k: number): Vector[] {
        // const scale = 1/(zoom * Math.tan(fov/2) * (zoom * Math.tan(fov/2) - buildingHeight));
        // const scale = (zoom * (zoom - buildingHeight));
        const d = k/zoom;
        const scale = d / (d - buildingHeight);
        const averagePoint = PolygonUtil.averagePoint(p);
        return p.map(v => v.clone().sub(averagePoint).multiplyScalar(scale).add(averagePoint));
    }

    private getBuildingSides(building: Vector[], translatedBuilding: Vector[]): Vector[][] {
        const polygons: Vector[][] = [];
        for (let i = 0; i < building.length; i++) {
            const next = (i + 1) % building.length;
            polygons.push([building[i], building[next], translatedBuilding[next], translatedBuilding[i]]);
        }
        return polygons;
    }

    public draw(canvas=this.canvas as DefaultCanvasWrapper): void {
        let bgColour;
        if (this.colourScheme.zoomBuildings) {
            bgColour = this.domainController.zoom >= 2 ? this.colourScheme.bgColourIn : this.colourScheme.bgColour;
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

        // Coastline
        canvas.setStrokeStyle(bgColour);
        canvas.setLineWidth(30 * this.domainController.zoom);
        canvas.drawPolyline(this.coastline);

        // Parks
        canvas.setLineWidth(1);
        canvas.setFillStyle(this.colourScheme.grassColour);
        for (const p of this.parks) canvas.drawPolygon(p);

        // River
        canvas.setFillStyle(this.colourScheme.seaColour);
        canvas.setStrokeStyle(this.colourScheme.seaColour);
        canvas.setLineWidth(0.1);
        canvas.drawPolygon(this.river);

        // Road outline
        canvas.setStrokeStyle(this.colourScheme.minorRoadOutline);
        canvas.setLineWidth(this.colourScheme.outlineSize + this.colourScheme.minorWidth * this.domainController.zoom);
        for (const s of this.minorRoads) canvas.drawPolyline(s);

        canvas.setStrokeStyle(this.colourScheme.majorRoadOutline);
        canvas.setLineWidth(this.colourScheme.outlineSize + this.colourScheme.majorWidth * this.domainController.zoom);
        for (const s of this.majorRoads) canvas.drawPolyline(s);
        canvas.drawPolyline(this.secondaryRiver);

        canvas.setStrokeStyle(this.colourScheme.mainRoadOutline);
        canvas.setLineWidth(this.colourScheme.outlineSize + this.colourScheme.mainWidth * this.domainController.zoom);
        for (const s of this.mainRoads) canvas.drawPolyline(s);
        for (const s of this.coastlineRoads) canvas.drawPolyline(s);

        // Road inline
        canvas.setStrokeStyle(this.colourScheme.minorRoadColour);
        canvas.setLineWidth(this.colourScheme.minorWidth * this.domainController.zoom);
        for (const s of this.minorRoads) canvas.drawPolyline(s);

        canvas.setStrokeStyle(this.colourScheme.majorRoadColour);
        canvas.setLineWidth(this.colourScheme.majorWidth * this.domainController.zoom);
        for (const s of this.majorRoads) canvas.drawPolyline(s);
        canvas.drawPolyline(this.secondaryRiver);

        canvas.setStrokeStyle(this.colourScheme.mainRoadColour);
        canvas.setLineWidth(this.colourScheme.mainWidth * this.domainController.zoom);
        for (const s of this.mainRoads) canvas.drawPolyline(s);
        for (const s of this.coastlineRoads) canvas.drawPolyline(s);

        canvas.setLineWidth(1);
        // Buildings
        if (!this.colourScheme.zoomBuildings || this.domainController.zoom >= 2) {
            canvas.setFillStyle(this.colourScheme.buildingColour);
            canvas.setStrokeStyle(this.colourScheme.buildingStroke);
            for (const b of this.buildings) canvas.drawPolygon(b);

            // Pseudo-3D
            if (this.domainController.zoom >= 2) {
                const allSides: Vector[][] = [];
                const allTops: Vector[][] = [];
                for (const b of this.buildings) {
                    // Translate more if far from centre or zoomed in
                    // const centre = this.domainController.screenDimensions.divideScalar(2);
                    const height = Math.random() * 10 + 10;
                    // const l = this.domainController.zoom * height / centre.length();
                    // const translateVector = buildingAverage.sub(centre).multiplyScalar(l);
                    // const translated = this.getTranslatedPolygon(b, translateVector);
                    // const translated = b.map(v => v.clone().add(v.clone().sub(centre).multiplyScalar(l)));
                    // const roof = this.getScaledPolygon(translated, this.domainController.zoom, height, Math.PI/2, centre.length());
                    const roof = b.map(v => this.heightVectorToScreen(v, height));
                    const sides = this.getBuildingSides(b, roof);
                    allSides.push(...sides);
                    allTops.push(roof);
                }
                canvas.setFillStyle("rgb(200, 200, 200)");
                canvas.setStrokeStyle("rgb(200, 200, 200)");
                for (const p of allSides) canvas.drawPolygon(p);
                canvas.setFillStyle(this.colourScheme.buildingColour);
                canvas.setStrokeStyle(this.colourScheme.buildingStroke);
                // Sort by z
                for (const p of allTops) canvas.drawPolygon(p);
            }
        }

        if (this.showFrame) {
            canvas.setFillStyle(this.colourScheme.frameColour);
            canvas.setStrokeStyle(this.colourScheme.frameColour);
            canvas.drawFrame(30, 30, 30, 80);

            canvas.setFillStyle(this.colourScheme.frameTextColour);
            canvas.drawCityName();
        }
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
