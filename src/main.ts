import * as log from 'loglevel';
import * as dat from 'dat.gui';

import TensorField from './ts/tensor_field';
import {Grid, Radial} from './ts/basis_field';
import Vector from './ts/vector';
import CanvasWrapper from './ts/canvas_wrapper';
import Constants from './ts/constants';
import DragController from './ts/drag_controller';
import DomainController from './ts/domain_controller';
import {EulerIntegrator, RK4Integrator} from './ts/integrator';
import {StreamlineParams} from './ts/streamlines';
import Streamlines from './ts/streamlines';

const size = 800;
const dc = DomainController.getInstance(Vector.fromScalar(size));
const c = document.getElementById(Constants.CANVAS_ID) as HTMLCanvasElement;
const canvas = new CanvasWrapper(c, size, size);
const gui: dat.GUI = new dat.GUI();
const tensorFolder = gui.addFolder('Tensor Field');

const field = new TensorField(tensorFolder, new DragController(gui));
field.addGrid(new Vector(0, 0), size, 20, Math.PI / 4);
field.addGrid(new Vector(size, size), size, 20, 0);
field.addRadial(new Vector(size/2, size/2), 300, 20);

const params: StreamlineParams = {
    dsep: 30,
    dtest: 15,
    dstep: 1,
    dlookahead: 5,
    pathIterations: 1000,
    seedTries: 300,
    simplifyTolerance: 0.5,
};

gui.add(params, 'dstep');
gui.add(params, 'dsep');
gui.add(params, 'dtest');
gui.add(params, 'dlookahead');
gui.add(params, 'pathIterations');
gui.add(params, 'simplifyTolerance');
gui.add(dc, 'zoom', 0, 5);

const integrator = new RK4Integrator(field, params);
let s = new Streamlines(integrator, params);
let streamlines: Vector[][] = [];

function setStreamline() {
    s = new Streamlines(integrator, params);
    s.createAllStreamlinesDynamic();
}

const tmpObj = {
    setStreamline: setStreamline
};

gui.add(tmpObj, 'setStreamline');

function getTensorLine(point: Vector, v: Vector, length: number): Vector[] {
    const transformed = dc.worldToScreen(point.clone());
    const diff = v.multiplyScalar(length / 2);
    const start = transformed.clone().sub(diff);
    const end = transformed.clone().add(diff);
    return [start, end];
}

function draw(): void {
    const startTime = performance.now();

    const samples = 60;
    const length = 12;
    canvas.setStrokeStyle('white');
    canvas.setFillStyle('black');
    canvas.setLineWidth(1);
    canvas.clearCanvas();

    const step = size/samples;
    const xStart = step - (dc.origin.x % step);
    const yStart = step - (dc.origin.y % step);

    for (let x = xStart - step; x <= size + step; x += size/samples) {
        for (let y = yStart - step; y <= size + step; y += size/samples) {
            const point = dc.screenToWorld(new Vector(x, y));
            const t = field.samplePoint(point);
            canvas.drawPolyline(getTensorLine(point, t.getMajor(), length));
            canvas.drawPolyline(getTensorLine(point, t.getMinor(), length));
        }
    }

    canvas.setFillStyle('red');
    field.getCentrePoints().forEach(v => canvas.drawSquare(dc.worldToScreen(v), 7));

    if (s.allStreamlinesSimple.length > 0) {
        canvas.setFillStyle('#ECE5DB');
        canvas.clearCanvas();

        canvas.setStrokeStyle('#020202');
        canvas.setLineWidth(3);
        s.allStreamlinesSimple.forEach(s => {
            canvas.drawPolyline(s.map(v => dc.worldToScreen(v.clone())));
        });

        canvas.setStrokeStyle('#F8F8F8');
        canvas.setLineWidth(2);
        s.allStreamlinesSimple.forEach(s => {
            canvas.drawPolyline(s.map(v => dc.worldToScreen(v.clone())));
        });
    }

    // Updates at 60fps
    while (performance.now() - startTime < 5000/60) {
        s.update();
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

