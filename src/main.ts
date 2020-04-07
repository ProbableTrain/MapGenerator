import * as log from 'loglevel';
import * as dat from 'dat.gui';

import TensorFieldInterface from './ts/interface/tensor_field_interface';
import {Grid, Radial} from './ts/impl/basis_field';
import Vector from './ts/vector';
import CanvasWrapper from './ts/interface/canvas_wrapper';
import Util from './ts/util';
import DragController from './ts/interface/drag_controller';
import DomainController from './ts/interface/domain_controller';
import {EulerIntegrator, RK4Integrator} from './ts/impl/integrator';
import {StreamlineParams} from './ts/impl/streamlines';
import StreamlineGenerator from './ts/impl/streamlines';

const size = 800;
// const dc = DomainController.getInstance(Vector.fromScalar(size));
const dc = DomainController.getInstance();
const c = document.getElementById(Util.CANVAS_ID) as HTMLCanvasElement;
// const canvas = new CanvasWrapper(c, size, size);
const canvas = new CanvasWrapper(c);
const gui: dat.GUI = new dat.GUI();
const tensorFolder = gui.addFolder('Tensor Field');

const field = new TensorFieldInterface(tensorFolder, new DragController(gui));
field.addGrid(new Vector(0, 0), size, 20, Math.PI / 4);
field.addGrid(new Vector(size, size), size, 20, 0);
field.addRadial(new Vector(size/2, size/2), 300, 20);

const minorParams: StreamlineParams = {
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

const majorParams: StreamlineParams = {
    dsep: 100,
    dtest: 30,
    dstep: 1,
    dlookahead: 200,
    dcirclejoin: 5,
    joinangle: 0.1,  // approx 10deg
    pathIterations: 1000,
    seedTries: 300,
    simplifyTolerance: 0.5,
};

gui.add(minorParams, 'dstep');
gui.add(minorParams, 'dsep');
gui.add(minorParams, 'dtest');
gui.add(majorParams, 'dstep');
gui.add(majorParams, 'dsep');
gui.add(majorParams, 'dtest');
gui.add(dc, 'zoom', 0, 5);

const integrator = new RK4Integrator(field, minorParams);
let major = new StreamlineGenerator(integrator, dc.origin, dc.worldDimensions, majorParams);
let minor = new StreamlineGenerator(integrator, dc.origin, dc.worldDimensions, minorParams);

function setStreamlineMajor() {
    minor = new StreamlineGenerator(integrator, dc.origin, dc.worldDimensions, minorParams);
    major = new StreamlineGenerator(integrator, dc.origin, dc.worldDimensions, majorParams);
    major.createAllStreamlines();
}

function setStreamlineMinor() {
    minor = new StreamlineGenerator(integrator, dc.origin, dc.worldDimensions, minorParams);
    minor.addExistingStreamlines(major);
    minor.createAllStreamlines();
}

function joinMajor() {
    major.joinDanglingStreamlines();
}

function joinMinor() {
    minor.joinDanglingStreamlines();
}

function getMajorStreamlines(): Vector[][] {
    return major.allStreamlinesSimple;
}

function getMinorStreamlines(): Vector[][] {
    return minor.allStreamlinesSimple;
}

const tmpObj = {
    setStreamlineMajor: setStreamlineMajor,
    setStreamlineMinor: setStreamlineMinor,
    joinMajor: joinMajor,
    joinMinor: joinMinor,
};

gui.add(tmpObj, 'setStreamlineMajor');
gui.add(tmpObj, 'setStreamlineMinor');
gui.add(tmpObj, 'joinMajor');
gui.add(tmpObj, 'joinMinor');

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

    if (getMinorStreamlines().length > 0) {
        canvas.setFillStyle('#ECE5DB');
        canvas.clearCanvas();

        canvas.setStrokeStyle('#020202');
        canvas.setLineWidth(3);
        getMinorStreamlines().forEach(s => {
            canvas.drawPolyline(s.map(v => dc.worldToScreen(v.clone())));
        });

        canvas.setStrokeStyle('#F8F8F8');
        canvas.setLineWidth(2);
        getMinorStreamlines().forEach(s => {
            canvas.drawPolyline(s.map(v => dc.worldToScreen(v.clone())));
        });
    }

    if (getMajorStreamlines().length > 0) {
        // this.COL_MAJ_IN = "#FAFA7A";
        // this.COL_MAJ_OUT = "#282828";
        canvas.setStrokeStyle('#282828');
        canvas.setLineWidth(5);
        getMajorStreamlines().forEach(s => {
            canvas.drawPolyline(s.map(v => dc.worldToScreen(v.clone())));
        });

        canvas.setStrokeStyle('#FAFA7A');
        canvas.setLineWidth(4);
        getMajorStreamlines().forEach(s => {
            canvas.drawPolyline(s.map(v => dc.worldToScreen(v.clone())));
        });
    }

    // Updates at 30fps
    while (performance.now() - startTime < 1000/30) {
        major.update();
        minor.update();
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

