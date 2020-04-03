import * as log from 'loglevel';
import * as dat from 'dat.gui';

import TensorField from './ts/tensor_field';
import {Grid, Radial} from './ts/basis_field';
import Vector from './ts/vector';
import CanvasWrapper from './ts/canvas_wrapper';
import Constants from './ts/constants';

const size = 800;
const c = document.getElementById(Constants.CANVAS_ID) as HTMLCanvasElement;
const canvas = new CanvasWrapper(c, size, size);
const gui: dat.GUI = new dat.GUI();
const tensorFolder = gui.addFolder('Tensor Field');

const field = new TensorField(tensorFolder);
field.addGrid(new Vector(0, 0), size, 20, Math.PI / 4);
field.addGrid(new Vector(size, size), size, 20, 0);
field.addRadial(new Vector(size/2, size/2), 300, 20);


function getTensorLine(point: Vector, v: Vector, length: number): Vector[] {
    const diff = v.multiplyScalar(length / 2);
    const start = point.clone().sub(diff);
    const end = point.clone().add(diff);
    return [start, end];
}

function draw(): void {
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

    canvas.setFillStyle('red');
    field.getCentrePoints().forEach(v => canvas.drawSquare(v, 7));

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

