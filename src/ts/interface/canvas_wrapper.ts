import * as log from 'loglevel';
import Vector from '../vector';

export default class CanvasWrapper {
    private ctx: CanvasRenderingContext2D;
    
    constructor(canvas: HTMLCanvasElement, private _width: number, private _height: number) {
        this.ctx = canvas.getContext("2d");
        this.resizeCanvas();
        this.setFillStyle('black');
        this.clearCanvas();
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    setFillStyle(colour: string): void {
        this.ctx.fillStyle = colour;
    }

    clearCanvas(): void {
        this.drawRectangle(0, 0, this._width, this._height);
    }

    drawRectangle(x: number, y: number, width: number, height: number): void {
        this.ctx.fillRect(x, y, width, height);
    }

    drawSquare(centre: Vector, radius: number) {
        this.drawRectangle(centre.x - radius, centre.y - radius, 2 * radius, 2 * radius);
    }

    setLineWidth(width: number): void {
        this.ctx.lineWidth = width;
    }

    setStrokeStyle(colour: string): void {
        this.ctx.strokeStyle = colour;
    }

    drawPolyline(line: Vector[]): void {
        if (line.length < 2) {
            log.warn("Tried to draw path of length < 2");
            return;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(line[0].x, line[0].y);

        for (let i = 1; i < line.length; i++) {
            this.ctx.lineTo(line[i].x, line[i].y);
        }

        this.ctx.stroke();
    }

    private resizeCanvas(): void {
        this.ctx.canvas.width = this._width;
        this.ctx.canvas.height = this._height;
    }
}
