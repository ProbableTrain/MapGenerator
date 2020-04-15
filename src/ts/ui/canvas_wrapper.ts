import * as log from 'loglevel';
import Vector from '../vector';

export default class CanvasWrapper {
    private ctx: CanvasRenderingContext2D;
    protected _width: number;
    protected _height: number;
    
    constructor(canvas: HTMLCanvasElement, private _scale=1, resizeToWindow=true) {
        this.ctx = canvas.getContext("2d");
        this.setDimensions();
        this.resizeCanvas();

        if (resizeToWindow) {
            window.addEventListener('resize', (): void => {
                this.setDimensions();
                this.resizeCanvas();
            });
        }

        this.setFillStyle('black');
        this.clearCanvas();
    }

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

    setFillStyle(colour: string): void {
        this.ctx.fillStyle = colour;
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
        this.ctx.fillRect(x, y, width, height);
    }

    drawPolygon(polygon: Vector[]) {
        if (polygon.length === 0) {
            return;
        }

        if (this._scale !== 1) {
            polygon = polygon.map(v => v.clone().multiplyScalar(this._scale));
        }

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

        if (this._scale !== 1) {
            line = line.map(v => v.clone().multiplyScalar(this._scale));
        }

        this.ctx.beginPath();
        this.ctx.moveTo(line[0].x, line[0].y);

        for (let i = 1; i < line.length; i++) {
            this.ctx.lineTo(line[i].x, line[i].y);
        }

        this.ctx.stroke();
    }

    protected resizeCanvas(): void {
        this.ctx.canvas.width = this._width;
        this.ctx.canvas.height = this._height;
    }
}
