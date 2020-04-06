import * as log from 'loglevel';
import Vector from '../vector';

/**
 * Singleton
 * Controls panning and zooming
 */
export default class DomainController {
    private static instance: DomainController;

    // Location of screen origin in world space
    private _origin: Vector = Vector.zeroVector();
    
    // Screen-space width and height
    private _screenDimensions: Vector;

    // Ratio of screen pixels to world pixels
    private _zoom: number = 1;

    private constructor(screenDimensions?: Vector) {
        if (screenDimensions) {
            this._screenDimensions = screenDimensions.clone();
        }
    }

    public static getInstance(screenDimensions?: Vector): DomainController {
        if (!DomainController.instance) {
            DomainController.instance = new DomainController(screenDimensions);
        }
        return DomainController.instance;
    }

    /**
     * @param {Vector} delta in world space
     */
    pan(delta: Vector) {
        this._origin.sub(delta);
    }

    get origin(): Vector {
        return this._origin.clone();
    }

    get zoom(): number {
        return this._zoom;
    }

    get screenDimensions(): Vector {
        return this._screenDimensions.clone();
    }

    /**
     * @return {Vector} world-space w/h visible on screen
     */
    get worldDimensions(): Vector {
        return this.screenDimensions.divideScalar(this._zoom);
    }

    set screenDimensions(v: Vector) {
        this._screenDimensions.copy(v);
    }

    set zoom(z: number) {
        if (z > 0) {
            const oldWorldSpaceMidpoint = this.origin.add(this.worldDimensions.divideScalar(2));
            this._zoom = z;
            const newWorldSpaceMidpoint = this.origin.add(this.worldDimensions.divideScalar(2));
            this.pan(newWorldSpaceMidpoint.sub(oldWorldSpaceMidpoint));
        }
    }

    /**
     * Edits vector
     */
    zoomToWorld(v: Vector): Vector {
        return v.divideScalar(this._zoom);
    }

    /**
     * Edits vector
     */
    zoomToScreen(v: Vector): Vector {
        return v.multiplyScalar(this._zoom);
    }

    /**
     * Edits vector
     */
    screenToWorld(v: Vector): Vector {
        return this.zoomToWorld(v).add(this._origin);
    }

    /**
     * Edits vector
     */
    worldToScreen(v: Vector): Vector {
        return this.zoomToScreen(v.sub(this._origin));
    }
}
