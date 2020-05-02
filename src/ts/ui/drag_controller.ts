import * as log from 'loglevel';
import interact from 'interactjs';
import Util from '../util';
import Vector from '../Vector';
import DomainController from './domain_controller';

interface Draggable {
    getCentre: (() => Vector);
    startListener: (() => void);
    moveListener: ((v: Vector) => void);
}

/**
* Register multiple centre points
* Closest one to mouse click will be selected to drag
* Up to caller to actually move their centre point via callback
*/
export default class DragController {
    // How close to drag handle pointer needs to be
    private readonly MIN_DRAG_DISTANCE = 50;

    private draggables: Draggable[] = [];
    private currentlyDragging: Draggable = null;  // Tensor field
    private _isDragging = false;
    private disabled: boolean = false;
    private domainController = DomainController.getInstance();

    constructor(private gui: dat.GUI) {
        interact(`#${Util.CANVAS_ID}`).draggable({
            onstart: this.dragStart.bind(this),
            onmove: this.dragMove.bind(this),
            onend: this.dragEnd.bind(this),
            cursorChecker: this.getCursor.bind(this),
        });
    }

    setDragDisabled(disable: boolean): void {
        this.disabled = disable;
    }

    /**
     * Change cursor style
     */
    getCursor(action: any, interactable: any, element: any, interacting: boolean): string {
        if (interacting) return 'grabbing';
        return 'grab';
    }

    dragStart(event: any): void {
        this._isDragging = true;
        // Transform screen space to world space
        const origin = this.domainController.screenToWorld(new Vector(event.x0, event.y0));
        
        let closestDistance = Infinity;
        this.draggables.forEach(draggable => {
            const d = draggable.getCentre().distanceTo(origin);
            if (d < closestDistance) {
                closestDistance = d;
                this.currentlyDragging = draggable;
            }
        });

        // Zoom screen size to world size for consistent drag distance while zoomed in
        const scaledDragDistance = this.MIN_DRAG_DISTANCE / this.domainController.zoom;

        if (closestDistance > scaledDragDistance) {
            this.currentlyDragging = null;
        } else {
            this.currentlyDragging.startListener();
        }


    }

    dragMove(event: any): void {
        const delta = new Vector(event.delta.x, event.delta.y);
        this.domainController.zoomToWorld(delta);

        if (!this.disabled && this.currentlyDragging !== null) {
            // Drag field
            this.currentlyDragging.moveListener(delta);
        } else {
            // Move map
            this.domainController.pan(delta);
        }
    }

    dragEnd(): void {
        this._isDragging = false;
        this.domainController.pan(Vector.zeroVector());  // Triggers canvas update
        this.currentlyDragging = null;
        Util.updateGui(this.gui);
    }

    get isDragging(): boolean {
        return this._isDragging;
    }

    /**
     * @param {(() => Vector)} Gets centre point
     * @param {((v: Vector) => void)} Called on move with delta vector
     * @param {(() => void)} Called on start
     * @returns {(() => void)} Function to deregister callback
     */
    register(getCentre: (() => Vector),
             onMove: ((v: Vector) => void),
             onStart: (() => void),
             ): (() => void) {
        const draggable: Draggable = {
            getCentre: getCentre,
            moveListener: onMove,
            startListener: onStart,
        };

        this.draggables.push(draggable);
        return ((): void => {
            const index = this.draggables.indexOf(draggable);
            if (index >= 0) {
                this.draggables.splice(index, 1);
            }
        }).bind(this);
    }
}
