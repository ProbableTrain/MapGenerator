import Vector from '../vector';

export default class Tensor {
    private oldTheta: boolean;
    private _theta: number;

    constructor(private r: number, private matrix: number[]) {
        // Represent the matrix as a 2 element list
        // [ 0, 1
        //   1, -0 ]
        this.oldTheta = false;
        this._theta = this.calculateTheta();
    }

    static fromAngle(angle: number): Tensor {
        return new Tensor(1, [Math.cos(angle * 4), Math.sin(angle * 4)]);
    }

    static fromVector(vector: Vector): Tensor {
        const t1 = vector.x ** 2 - vector.y ** 2;
        const t2 = 2 * vector.x * vector.y;
        const t3 = t1 ** 2 - t2 ** 2;
        const t4 = 2 * t1 * t2;
        return new Tensor(1, [t3, t4]);
    }

    static get zero(): Tensor {
        return new Tensor(0, [0, 0]);
    }

    get theta(): number {
        if (this.oldTheta) {
            this._theta = this.calculateTheta();
            this.oldTheta = false;
        }

        return this._theta;
    }

    add(tensor: Tensor, smooth: boolean): Tensor {
        this.matrix = this.matrix.map((v, i) => v * this.r + tensor.matrix[i] * tensor.r);

        if (smooth) {
            this.r = Math.hypot(...this.matrix);
            this.matrix = this.matrix.map(v => v / this.r);
        } else {
            this.r = 2;
        }

        this.oldTheta = true;
        return this;
    }

    scale(s: number): Tensor {
        this.r *= s;
        this.oldTheta = true;
        return this;
    }

    // Radians
    rotate(theta: number): Tensor {
        if (theta === 0) {
            return this;
        }
        let newTheta = this.theta + theta;
        if (newTheta < Math.PI) {
            newTheta += Math.PI;
        }

        if (newTheta >= Math.PI) {
            newTheta -= Math.PI;
        }

        this.matrix[0] = Math.cos(2 * newTheta) * this.r;
        this.matrix[1] = Math.sin(2 * newTheta) * this.r;
        this._theta = newTheta;
        return this;
    }

    getMajor(): Vector {
        // Degenerate case
        if (this.r === 0) {
            return Vector.zeroVector();
        }
        return new Vector(Math.cos(this.theta), Math.sin(this.theta));
    }

    getMinor(): Vector {
        // Degenerate case
        if (this.r === 0) {
            return Vector.zeroVector();
        }
        const angle = this.theta + Math.PI / 2;
        return new Vector(Math.cos(angle), Math.sin(angle));
    }

    private calculateTheta(): number {
        if (this.r === 0) {
            return 0;
        }
        return Math.atan2(this.matrix[1] / this.r, this.matrix[0] / this.r) / 2;
    }
}
