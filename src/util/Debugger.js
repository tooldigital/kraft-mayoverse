import dat from 'dat.gui'
import Global from './Global'

class Debugger {
    constructor() {
        this.gui = new dat.GUI({
            hideable: Global.gui
        });
        this.params = {};

        if (!Global.gui) {
            this.gui.hide()
        }
    }
}

export default new Debugger()