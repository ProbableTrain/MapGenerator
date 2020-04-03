import * as log from 'loglevel';
import interact from 'interactjs';
import Constants from './constants';
import Vector from './Vector';

interface Draggable {
    getCentre: (() => Vector);
    callbackFn: ((v: Vector) => void);
}

export default class DragController {
    /**
     * Register multiple centre points
     * Closest one to mouse click will be selected to drag
     * Up to caller to actually move their centre point via callback
     */
    
    private draggables: Draggable[] = [];
    private currentlyDragging: Draggable = null;

    constructor(private gui: dat.GUI) {
        interact(`#${Constants.CANVAS_ID}`).draggable({
            onstart: this.dragStart.bind(this),
            onmove: this.dragMove.bind(this),
            onend: this.dragEnd.bind(this),
            cursorChecker: this.getCursor.bind(this),
        });
    }

    getCursor(action: any, interactable: any, element: any, interacting: boolean) {
        if (interacting) return 'grabbing';
        return 'grab';
    }

    dragStart(event: any): void {
        const origin = new Vector(event.x0, event.y0);
        let closestDistance = Infinity;
        this.draggables.forEach(draggable => {
            const d = draggable.getCentre().distanceToSquared(origin);  // No need to sqrt
            if (d < closestDistance) {
                closestDistance = d;
                this.currentlyDragging = draggable;
            }
        });
    }

    dragMove(event: any): void {
        if (this.currentlyDragging !== null) {
            this.currentlyDragging.callbackFn(new Vector(event.delta.x, event.delta.y));
        }
    }

    dragEnd(): void {
        this.currentlyDragging = null;
        this.updateGui(this.gui);
    }

    updateGui(gui: dat.GUI): void {
        if (gui.__controllers) {
            gui.__controllers.forEach(c => c.updateDisplay());    
        }
        if (gui.__folders) {
            for (let folderName in gui.__folders) {
                this.updateGui(gui.__folders[folderName]);
            }
        }
    }

    /**
     * @param {(() => Vector)} Gets centre point
     * @param {((v: Vector) => void)} Called on move with delta vector
     * @returns {(() => void)} Function to deregister callback
     */
    register(getCentre: (() => Vector),
             onMove: ((v: Vector) => void)): (() => void) {
        const draggable: Draggable = {
            getCentre: getCentre,
            callbackFn: onMove,
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
