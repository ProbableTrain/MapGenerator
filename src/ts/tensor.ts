import Vector from './vector';

export default class Tensor {
    private oldTheta: boolean;
    private _theta: number;

    constructor(private r: number, private matrix: number[]) {
        // Matrix is 2 element list
        // [ 0, 1
        //   1, -0 ]
        this.oldTheta = false;
        this._theta = this.calculateTheta();
    }

    get theta(): number {
        if (this.oldTheta) {
            this._theta = this.calculateTheta();
            this.oldTheta = false;
        }

        return this._theta;
    }

    add(tensor: Tensor): Tensor {
        this.matrix = this.matrix.map((v, i) => v * this.r + tensor.matrix[i] * tensor.r);
        this.r = 2;
        this.oldTheta = true;
        return this;
    }

    scale(s: number): Tensor {
        this.r *= s;
        this.oldTheta = true;
        return this;
    }

    getMajor(): Vector {
        return new Vector(Math.cos(this.theta), Math.sin(this.theta));
    }

    getMinor(): Vector {
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
