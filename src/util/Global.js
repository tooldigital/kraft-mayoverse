import Detect from "./Detect"

class Global {
    constructor() {
        this.pageIndex = 0
        this.start = false
        this.progress = 0
        this.gui = true
        this.isMobile = Detect.isMobile;
        this.ARActive = this.isMobile;
        this.arRunning = false;

        this.isQA = new URLSearchParams(window.location.search).get('qa');
        this.debugOnDesktop = true; // Use TRUE to disable world tracking and enable chrome emulator debuging
        this.isSmallWindow = false;
        // navigator.mediaDevices.enumerateDevices().then(md => { console.log(md) })

        //computer vision globals
        this.debugComputerVision = new URLSearchParams(window.location.search).get('ai')?true:false;
        this.enableComputerVision = false;
        this.imageTargetEnabled = false;
        this.handDebug = false;
    }
}

export default new Global()

