import * as log from 'loglevel';
import {DefaultCanvasWrapper} from './canvas_wrapper';
import DomainController from './domain_controller';
import DragController from './drag_controller';
import TensorField from '../impl/tensor_field';
import {NoiseParams} from '../impl/tensor_field';
import {BasisField} from '../impl/basis_field';
import Util from '../util';
import Vector from '../vector';

/**
 * Extension of TensorField that handles interaction with dat.GUI
 */
export default class TensorFieldGUI extends TensorField {
    private TENSOR_LINE_DIAMETER = 20;
    private TENSOR_SPAWN_SCALE = 0.7;  // How much to shrink worldDimensions to find spawn point
    private domainController = DomainController.getInstance();

    constructor(private guiFolder: dat.GUI, private dragController: DragController,
        public drawCentre: boolean, noiseParams: NoiseParams) {
        super(noiseParams);
        // For custom naming of gui buttons
        const tensorFieldGuiObj = {
            reset: (): void => this.reset(),
            setRecommended: (): void => this.setRecommended(),
            addRadial: (): void => this.addRadialRandom(),
            addGrid: (): void => this.addGridRandom(),
        };

        this.guiFolder.add(tensorFieldGuiObj, 'reset');
        this.guiFolder.add(this, 'smooth');
        this.guiFolder.add(tensorFieldGuiObj, 'setRecommended');
        this.guiFolder.add(tensorFieldGuiObj, 'addRadial');
        this.guiFolder.add(tensorFieldGuiObj, 'addGrid');
    }

    /**
     * 4 Grids, one radial
     */
    setRecommended(): void {
        this.reset();
        const size = this.domainController.worldDimensions.multiplyScalar(this.TENSOR_SPAWN_SCALE);
        const newOrigin = this.domainController.worldDimensions
            .multiplyScalar((1 - this.TENSOR_SPAWN_SCALE) / 2)
            .add(this.domainController.origin);
        this.addGridAtLocation(newOrigin);
        this.addGridAtLocation(newOrigin.clone().add(size));
        this.addGridAtLocation(newOrigin.clone().add(new Vector(size.x, 0)));
        this.addGridAtLocation(newOrigin.clone().add(new Vector(0, size.y)));
        this.addRadialRandom();
    }

    addRadialRandom(): void {
        const width = this.domainController.worldDimensions.x;
        this.addRadial(this.randomLocation(),
            Util.randomRange(width / 10, width / 5),  // Size
            Util.randomRange(50));  // Decay
    }

    addGridRandom(): void {
        this.addGridAtLocation(this.randomLocation());
    }

    private addGridAtLocation(location: Vector): void {
        const width = this.domainController.worldDimensions.x;
        this.addGrid(location,
            Util.randomRange(width / 4, width),  // Size
            Util.randomRange(50),  // Decay
            Util.randomRange(Math.PI / 2));
    }

    /**
     * World-space random location for tensor field spawn
     * Sampled from middle of screen (shrunk rectangle)
     */
    private randomLocation(): Vector {
        const size = this.domainController.worldDimensions.multiplyScalar(this.TENSOR_SPAWN_SCALE);
        const location = new Vector(Math.random(), Math.random()).multiply(size);
        const newOrigin = this.domainController.worldDimensions.multiplyScalar((1 - this.TENSOR_SPAWN_SCALE) / 2);
        return location.add(this.domainController.origin).add(newOrigin);
    }

    private getCrossLocations(): Vector[] {
        // Gets grid of points for vector field vis in world space
        const diameter = this.TENSOR_LINE_DIAMETER / this.domainController.zoom;
        const worldDimensions = this.domainController.worldDimensions;
        const nHor = Math.ceil(worldDimensions.x / diameter) + 1; // Prevent pop-in
        const nVer = Math.ceil(worldDimensions.y / diameter) + 1;
        const originX = diameter * Math.floor(this.domainController.origin.x / diameter);
        const originY = diameter * Math.floor(this.domainController.origin.y / diameter);

        const out = [];
        for (let x = 0; x <= nHor; x++) {
            for (let y = 0; y <= nVer; y++) {
                out.push(new Vector(originX + (x * diameter), originY + (y * diameter)));
            }
        }

        return out;
    }

    private getTensorLine(point: Vector, tensorV: Vector): Vector[] {
        const transformedPoint = this.domainController.worldToScreen(point.clone());

        const diff = tensorV.multiplyScalar(this.TENSOR_LINE_DIAMETER / 2);  // Assumes normalised
        const start = transformedPoint.clone().sub(diff);
        const end = transformedPoint.clone().add(diff);
        return [start, end];
    }

    draw(canvas: DefaultCanvasWrapper): void {
        // Draw tensor field
        canvas.setFillStyle('black');
        canvas.clearCanvas();

        canvas.setStrokeStyle('white');
        canvas.setLineWidth(1);
        const tensorPoints = this.getCrossLocations();
        tensorPoints.forEach(p => {
            const t = this.samplePoint(p);
            canvas.drawPolyline(this.getTensorLine(p, t.getMajor()));
            canvas.drawPolyline(this.getTensorLine(p, t.getMinor()));
        });

        // Draw centre points of fields
        if (this.drawCentre) {
            canvas.setFillStyle('red');
            this.getCentrePoints().forEach(v =>
                canvas.drawSquare(this.domainController.worldToScreen(v), 7));
        }
    }

    protected addField(field: BasisField): void {
        super.addField(field);
        const folder = this.guiFolder.addFolder(`${field.FOLDER_NAME}`);
        
        // Function to deregister from drag controller
        const deregisterDrag = this.dragController.register(
            () => field.centre,
            field.dragMoveListener.bind(field),
            field.dragStartListener.bind(field)
        );
        const removeFieldObj = {remove: () => this.removeFieldGUI(field, deregisterDrag)};
        
        // Give dat gui removeField button
        folder.add(removeFieldObj, 'remove');
        field.setGui(this.guiFolder, folder);
    }

    private removeFieldGUI(field: BasisField, deregisterDrag: (() => void)): void {
        super.removeField(field);
        field.removeFolderFromParent();
        // Deregister from drag controller
        deregisterDrag();
    }

    reset(): void {
        // TODO kind of hacky - calling remove callbacks from gui object, should store callbacks
        // in addfield and call them (requires making sure they're idempotent)
        for (const fieldFolderName in this.guiFolder.__folders) {
            const fieldFolder = this.guiFolder.__folders[fieldFolderName];
            (fieldFolder.__controllers[0] as any).initialValue();
        }

        super.reset();
    }
}
