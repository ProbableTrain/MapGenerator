export interface RandomRange {
    min?: number,
    max: number,
}

export default class Util {
    // Must match style.css
    static readonly CANVAS_ID = 'map-canvas';
    static readonly IMG_CANVAS_ID = 'img-canvas';

    static updateGui(gui: dat.GUI): void {
        if (gui.__controllers) {
            gui.__controllers.forEach(c => c.updateDisplay());    
        }
        if (gui.__folders) {
            for (let folderName in gui.__folders) {
                this.updateGui(gui.__folders[folderName]);
            }
        }
    }

    static removeAllFolders(gui: dat.GUI) {
        if (gui.__folders) {
            for (let folderName in gui.__folders) {
                gui.removeFolder(gui.__folders[folderName]);
            }
        }
    }

    static randomRange(max: number, min=0) {
        return (Math.random() * (max - min)) + min;
    }
}
