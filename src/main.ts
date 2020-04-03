import * as log from 'loglevel';
import * as dat from 'dat.gui';
import TensorField from './ts/tensor_field';
import {Grid, Radial} from './ts/basis_field';
import Vector from './ts/vector';
import Canvas from './ts/canvas';

const size = 800;
const canvas = new Canvas(<HTMLCanvasElement>document.getElementById('map-canvas'), size, size);
const gui: dat.GUI = new dat.GUI();

const field = new TensorField();
field.addGrid(new Vector(0, 0), size, 20, Math.PI / 4, gui);
field.addGrid(new Vector(size, size), size, 20, 0, gui);
field.addRadial(new Vector(size/2, size/2), 300, 20, gui);


function getTensorLine(point: Vector, v: Vector, length: number): Vector[] {
    const diff = v.multiplyScalar(length / 2);
    const start = point.clone().sub(diff);
    const end = point.clone().add(diff);
    return [start, end];
}

function draw() {
    const samples = 60;
    const length = 12;
    canvas.setStrokeStyle('white');
    canvas.setFillStyle('black');
    canvas.setLineWidth(1);
    canvas.clearCanvas();
    for (let x = length/2; x <= size; x += size/samples) {
        for (let y = length/2; y <= size; y += size/samples) {
            const point = new Vector(x, y);
            const t = field.samplePoint(point);
            canvas.drawPolyline(getTensorLine(point, t.getMajor(), length));
            canvas.drawPolyline(getTensorLine(point, t.getMinor(), length));
        }
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

