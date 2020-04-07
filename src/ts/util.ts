export default class Util {
    // Must match style.css
    static readonly CANVAS_ID: string = 'map-canvas';

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
}
