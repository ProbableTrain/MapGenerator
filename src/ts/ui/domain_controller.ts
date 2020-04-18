import * as log from 'loglevel';
import Vector from '../vector';
import Util from '../util.js';

/**
 * Singleton
 * Controls panning and zooming
 */
export default class DomainController {
    private static instance: DomainController;

    private readonly ZOOM_SPEED = 0.96;

    // Location of screen origin in world space
    private _origin: Vector = Vector.zeroVector();
    
    // Screen-space width and height
    private _screenDimensions = Vector.zeroVector();

    // Ratio of screen pixels to world pixels
    private _zoom: number = 1;
    private zoomCallback: () => any = () => {};

    // Set after pan or zoom
    public moved = false;

    private constructor() {
        this.setScreenDimensions();

        window.addEventListener('resize', (): void => this.setScreenDimensions());

        window.addEventListener('wheel', (e: any): void => {
            const delta: number = e.deltaY;
            // TODO scale by value of delta
            if (delta > 0) {
                this.zoom = this._zoom * this.ZOOM_SPEED;
            } else {
                this.zoom = this._zoom / this.ZOOM_SPEED;
            }
        });

    }

    private setScreenDimensions(): void {
        this.moved = true;
        this._screenDimensions.setX(window.innerWidth);
        this._screenDimensions.setY(window.innerHeight);
    }

    public static getInstance(): DomainController {
        if (!DomainController.instance) {
            DomainController.instance = new DomainController();
        }
        return DomainController.instance;
    }

    /**
     * @param {Vector} delta in world space
     */
    pan(delta: Vector) {
        this.moved = true;
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
        this.moved = true;
        this._screenDimensions.copy(v);
    }

    set zoom(z: number) {
        if (z > 0) {
            this.moved = true;
            const oldWorldSpaceMidpoint = this.origin.add(this.worldDimensions.divideScalar(2));
            this._zoom = z;
            const newWorldSpaceMidpoint = this.origin.add(this.worldDimensions.divideScalar(2));
            this.pan(newWorldSpaceMidpoint.sub(oldWorldSpaceMidpoint));
            this.zoomCallback();
        }
    }

    onScreen(v: Vector): boolean {
        const screenSpace = this.worldToScreen(v.clone());
        return screenSpace.x >= 0 && screenSpace.y >= 0
            && screenSpace.x <= this.screenDimensions.x && screenSpace.y <= this.screenDimensions.y;
    }

    setZoomUpdate(callback: () => any): void {
        this.zoomCallback = callback;
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
