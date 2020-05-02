import TensorField from './tensor_field';
import Vector from '../vector';
import {StreamlineParams} from './streamlines';

export default abstract class FieldIntegrator {
    constructor(protected field: TensorField) {}

    abstract integrate(point: Vector, major: boolean): Vector;

    protected sampleFieldVector(point: Vector, major: boolean): Vector {
        const tensor = this.field.samplePoint(point);
        if (major) return tensor.getMajor();
        return tensor.getMinor();
    }

    onLand(point: Vector): boolean {
        return this.field.onLand(point);
    }
}

export class EulerIntegrator extends FieldIntegrator {
    constructor(field: TensorField, private params: StreamlineParams) {
        super(field);
    }

    integrate(point: Vector, major: boolean): Vector {
        return this.sampleFieldVector(point, major).multiplyScalar(this.params.dstep);
    }
}

export class RK4Integrator extends FieldIntegrator {
    constructor(field: TensorField, private params: StreamlineParams) {
        super(field);
    }

    integrate(point: Vector, major: boolean): Vector {
        const k1 = this.sampleFieldVector(point, major);
        const k23 = this.sampleFieldVector(point.clone().add(Vector.fromScalar(this.params.dstep / 2)), major);
        const k4 = this.sampleFieldVector(point.clone().add(Vector.fromScalar(this.params.dstep)), major);

        return k1.add(k23.multiplyScalar(4)).add(k4).multiplyScalar(this.params.dstep / 6);
    }
}
