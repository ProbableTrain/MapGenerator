import * as log from 'loglevel';
import Vector from '../vector';

export interface RoughOptions {
    roughness?: number;
    bowing?: number;
    seed?: number;
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
    fillStyle?: string;
    fillWeight?: number;
    hachureAngle?: number;
    hachureGap?: number;
    dashOffset?: number;
    dashGap?: number;
    zigzagOffset?: number;
}

export default abstract class CanvasWrapper {
    protected _width: number;
    protected _height: number;
    public needsUpdate: boolean = false;

    constructor(private canvas: HTMLCanvasElement, protected _scale=1, resizeToWindow=true) {
        this.setDimensions();
        this.resizeCanvas();
        if (resizeToWindow) {
            window.addEventListener('resize', (): void => {
                this.setDimensions();
                this.resizeCanvas();
            });
        }
    }

    abstract drawFrame(left: number, right: number, up: number, down: number): void;

    setDimensions(): void {
        this._width = window.innerWidth * this._scale;
        this._height = window.innerHeight * this._scale;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get canvasScale(): number {
        return this._scale;
    }

    set canvasScale(s: number) {
        this._scale = s;
        this.setDimensions();
        this.resizeCanvas();
    }

    protected zoomVectors(vs: Vector[]): void {
        if (this._scale !== 1) {
            for (let i = 0, len = vs.length; i < len; i++) {
                vs[i] = vs[i].clone().multiplyScalar(this._scale);
            }
        }
    }

    protected resizeCanvas(): void {
        this.canvas.width = this._width;
        this.canvas.height = this._height;
        this.needsUpdate = true;
    }
}

export class DefaultCanvasWrapper extends CanvasWrapper {
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, scale=1, resizeToWindow=true) {
        super(canvas, scale, resizeToWindow);
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    setFillStyle(colour: string): void {
        this.ctx.fillStyle = colour;
    }

    clearCanvas(): void {
        this.drawRectangle(0, 0, window.innerWidth, window.innerHeight);
    }

    drawFrame(left: number, right: number, up: number, down: number): void {
        this.drawRectangle(0, 0, this._width/this._scale, up);
        this.drawRectangle(0, 0, left, this._height/this._scale);
        this.drawRectangle(this._width/this._scale - right, 0, right, this._height/this._scale);
        this.drawRectangle(0, this._height/this._scale - down, this._width/this._scale, down);
    }

    drawCityName() {
        const fontSize = 50 * this._scale;
        this.ctx.font = `small-caps ${fontSize}px Verdana`;
        this.ctx.textAlign = "center";
        this.ctx.fillText("san francisco", this._width/2, this._height - (80 * this._scale - fontSize));
    }

    drawRectangle(x: number, y: number, width: number, height: number): void {
        if (this._scale !== 1) {
            x *= this._scale;
            y *= this._scale;
            width *= this._scale;
            height *= this._scale;
        }
        this.ctx.fillRect(x, y, width, height);
    }

    drawPolygon(polygon: Vector[]) {
        if (polygon.length === 0) {
            return;
        }
        this.zoomVectors(polygon);

        this.ctx.beginPath();
        this.ctx.moveTo(polygon[0].x, polygon[0].y);

        for (let i = 1; i < polygon.length; i++) {
            this.ctx.lineTo(polygon[i].x, polygon[i].y);
        }
        this.ctx.lineTo(polygon[0].x, polygon[0].y);

        this.ctx.fill();
        this.ctx.stroke();
    }

    drawSquare(centre: Vector, radius: number) {
        this.drawRectangle(centre.x - radius, centre.y - radius, 2 * radius, 2 * radius);
    }

    setLineWidth(width: number): void {
        if (this._scale !== 1) {
            width *= this._scale;
        }
        this.ctx.lineWidth = width;
    }

    setStrokeStyle(colour: string): void {
        this.ctx.strokeStyle = colour;
    }

    drawPolyline(line: Vector[]): void {
        if (line.length < 2) {
            return;
        }

        this.zoomVectors(line);

        this.ctx.beginPath();
        this.ctx.moveTo(line[0].x, line[0].y);

        for (let i = 1; i < line.length; i++) {
            this.ctx.lineTo(line[i].x, line[i].y);
        }

        this.ctx.stroke();
    }
}

export class RoughCanvasWrapper extends CanvasWrapper {
    private rc: any;
    private options: RoughOptions = {
        roughness: 1,
        bowing: 1,
        stroke: '#000000',
        strokeWidth: 1,
        fill: '#000000',
        fillStyle: 'solid',
    };

    constructor(canvas: HTMLCanvasElement, scale=1, resizeToWindow=true) {
        super(canvas, scale, resizeToWindow);
        let r = require('roughjs/bundled/rough.cjs');
        this.rc = r.canvas(canvas);
    }

    drawFrame(left: number, right: number, up: number, down: number): void {

    }

    setOptions(options: RoughOptions): void {
        if (options.strokeWidth) {
            options.strokeWidth *= this._scale;
        }
        Object.assign(this.options, options);
    }

    clearCanvas(): void {
        this.drawRectangle(0, 0, window.innerWidth, window.innerHeight);
    }

    drawRectangle(x: number, y: number, width: number, height: number): void {
        if (this._scale !== 1) {
            x *= this._scale;
            y *= this._scale;
            width *= this._scale;
            height *= this._scale;
        }
        this.rc.rectangle(x, y, width, height, this.options);
    }

    drawPolygon(polygon: Vector[]) {
        if (polygon.length === 0) {
            return;
        }

        if (this._scale !== 1) {
            polygon = polygon.map(v => v.clone().multiplyScalar(this._scale));
        }

        this.rc.polygon(polygon.map(v => [v.x, v.y]), this.options);
    }

    drawSquare(centre: Vector, radius: number) {
        const prevStroke = this.options.stroke;
        this.options.stroke = 'none';
        this.drawRectangle(centre.x - radius, centre.y - radius, 2 * radius, 2 * radius);
        this.options.stroke = prevStroke;
    }

    drawPolyline(line: Vector[]): void {
        if (line.length < 2) {
            return;
        }

        if (this._scale !== 1) {
            line = line.map(v => v.clone().multiplyScalar(this._scale));
        }

        this.rc.linearPath(line.map(v => [v.x, v.y]), this.options);
    }
}
