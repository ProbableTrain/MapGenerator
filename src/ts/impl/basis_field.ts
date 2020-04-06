import Tensor from './tensor';
import Vector from '../vector';

export abstract class BasisField {
    abstract readonly FOLDER_NAME: string;
    protected static folderNameIndex: number = 0;
    protected _centre: Vector;

    constructor(centre: Vector, protected _size: number, protected _decay: number) {
        this._centre = centre.clone();
    }

    set centre(centre: Vector) {
        this._centre.copy(centre);
    }

    get centre(): Vector {
        return this._centre.clone();
    }

    set decay(decay: number) {
        this._decay = decay;
    }

    set size(size: number) {
        this._size = size;
    }

    dragMoveListener(delta: Vector): void {
        // Delta assumed to be in world space (only relevant when zoomed)
        this._centre.add(delta);
    }

    abstract getTensor(point: Vector): Tensor;

    getWeightedTensor(point: Vector): Tensor {
        return this.getTensor(point).scale(this.getTensorWeight(point));
    }

    /**
     * Creates a folder and adds it to the GUI to control params
     */
    setGui(gui: dat.GUI): void {
        gui.add(this._centre, 'x');
        gui.add(this._centre, 'y');
        gui.add(this, '_size');
        gui.add(this, '_decay', 0, 50);
    }

    /**
     * Interpolates between (0 and 1)^decay
     */
    protected getTensorWeight(point: Vector): number {        
        const normDistanceToCentre = point.clone().sub(this._centre).length() / this._size;
        
        // Stop (** 0) turning weight into 1, filling screen even when outside 'size'
        if (this._decay === 0 && normDistanceToCentre >= 1) {
            return 0;
        }
        return Math.max(0, (1 - normDistanceToCentre)) ** this._decay;
    }
}

export class Grid extends BasisField {
    readonly FOLDER_NAME = `Grid ${Grid.folderNameIndex++}`;

    constructor(centre: Vector, size: number, decay: number, private _theta: number) {
        super(centre, size, decay);
    }

    set theta(theta: number) {
        this._theta = theta;
    }

    setGui(gui: dat.GUI): void {
        super.setGui(gui);

        // GUI in degrees, convert to rads
        const thetaProp = {theta: this._theta * 180 / Math.PI};
        const thetaController = gui.add(thetaProp, 'theta', -90, 90);
        thetaController.onChange(theta => this._theta = theta * (Math.PI / 180));
    }

    getTensor(point: Vector): Tensor {
        const cos = Math.cos(2 * this._theta);
        const sin = Math.sin(2 * this._theta);
        return new Tensor(1, [cos, sin]);
    }
}

export class Radial extends BasisField {
    readonly FOLDER_NAME = `Radial ${Radial.folderNameIndex++}`;
    constructor(centre: Vector, size: number, decay: number) {
        super(centre, size, decay);
    }

    getTensor(point: Vector): Tensor {
        const t = point.clone().sub(this._centre);
        const t1 = t.y**2 - t.x**2;
        const t2 = -2 * t.x * t.y;
        return new Tensor(1, [t1, t2]);
    }
}
