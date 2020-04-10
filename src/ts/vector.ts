import * as log from 'loglevel';

export default class Vector {
    constructor(public x: number, public y: number) {}

    static zeroVector(): Vector {
        return new Vector(0, 0);
    }

    static fromScalar(s: number): Vector {
        return new Vector(s, s);
    }

    /**
     * -pi to pi
     */
    static angleBetween(v1: Vector, v2: Vector): number {
        // -2pi to 2pi
        let angleBetween = v1.angle() - v2.angle();
        if (angleBetween > Math.PI) {
            angleBetween -= 2 * Math.PI;
        } else if (angleBetween <= -Math.PI) {
            angleBetween += 2 * Math.PI;
        }
        return angleBetween;
    }

    /**
     * Tests whether a point lies to the left of a line
     * @param  {Vector} linePoint     Point on the line
     * @param  {Vector} lineDirection 
     * @param  {Vector} point
     * @return {Vector}               true if left, false otherwise
     */
    static isLeft(linePoint: Vector, lineDirection: Vector, point: Vector): boolean {
        const perpendicularVector = new Vector(lineDirection.y, -lineDirection.x);
        return point.clone().sub(linePoint).dot(perpendicularVector) < 0;
    }

    add(v: Vector): Vector {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /**
     * Angle in radians to positive x-axis between -pi and pi
     */
    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    clone(): Vector {
        return new Vector(this.x, this.y);
    }

    copy(v: Vector): Vector {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    cross(v: Vector): number {
        return this.x * v.y - this.y * v.x;
    }

    distanceTo(v: Vector): number {
        return Math.sqrt(this.distanceToSquared(v));
    }

    distanceToSquared (v: Vector): number {
        const dx = this.x - v.x
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    divide(v: Vector): Vector {
        if (v.x === 0 || v.y === 0) {
            log.warn("Division by zero");
            return this;
        }

        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    divideScalar(s: number): Vector {
        if (s === 0) {
            log.warn("Division by zero");
            return this;
        }
        return this.multiplyScalar(1 / s);
    }

    dot(v: Vector): number {
        return this.x * v.x + this.y * v.y;
    }

    equals(v: Vector): boolean {
        return ((v.x === this.x) && (v.y === this.y));
    }

    length(): number {
        return Math.sqrt(this.lengthSq());
    }

    lengthSq(): number {
        return this.x * this.x + this.y * this.y;
    }

    multiply(v: Vector): Vector {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    multiplyScalar(s: number): Vector {
        this.x *= s;
        this.y *= s;
        return this;
    }

    negate(): Vector {
        return this.multiplyScalar(-1);
    }

    normalize(): Vector {
        const l = this.length();
        if (l === 0) {
            log.warn("Zero Vector");
            return this;
        }
        
        return this.divideScalar(this.length());
    }

    /**
     * Angle in radians
     */
    rotateAround(center: Vector, angle: number): Vector {
        const cos = Math.cos(angle)
        const sin = Math.sin(angle);

        const x = this.x - center.x;
        const y = this.y - center.y;

        this.x = x * cos - y * sin + center.x;
        this.y = x * sin + y * cos + center.y;
        return this;
    }

    set(v: Vector): Vector {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    setX(x: number): Vector {
        this.x = x;
        return this;
    }

    setY(y: number): Vector {
        this.y = y;
        return this;
    }

    setLength (length: number): Vector {
        return this.normalize().multiplyScalar(length);
    }

    sub(v: Vector): Vector {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
}
