import GraphicsManager from "./GraphicsManager.js";
import Cube from "./shapes/Cube.js";

const MIN_FRAME_LENGTH = 16; // 16 for 60fps.
const GLOBAL_ROTATION_SPEED = 150.0;
const GLOBAL_SCROLL_SPEED = 15.0;

export default class GameManager {
    constructor() {
        this._graphicsManager = null;
        this._listOfShapes = null;
        this._frameCounter = 0;
        this._globalCameraMatrixRotY;
        this._globalCameraMatrixRotX;
        this._globalCameraMatrixZoom;
        this._globalCameraMatrix;
        this._lastMouseX = 0;
        this._lastMouseY = 0;
    }

    async start() {
        this._graphicsManager = new GraphicsManager();
        await this._graphicsManager.setup();

        this._graphicsManager.gl.enable(this._graphicsManager.gl.DEPTH_TEST);
        this._graphicsManager.gl.enable(this._graphicsManager.gl.CULL_FACE);
        this._graphicsManager.gl.cullFace(this._graphicsManager.gl.BACK);
        this._graphicsManager.gl.frontFace(this._graphicsManager.gl.CCW);

        this._graphicsManager.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this._graphicsManager.gl.clear(this._graphicsManager.gl.COLOR_BUFFER_BIT | this._graphicsManager.gl.DEPTH_BUFFER_BIT);

        this._listOfShapes = [];
        this._frameCounter = 0;
        this._globalCameraMatrixRotY = new Matrix4();
        this._globalCameraMatrixRotX = new Matrix4();
        this._globalCameraMatrixZoom = new Matrix4();
        this._globalCameraMatrix = new Matrix4();
        this._lastMouseX = 0;
        this._lastMouseY = 0;

        // TODO: setup components
        const cub = new Cube([1.0, 0.0, 0.0, 1.0]);
        this._listOfShapes.push(cub);

        this._graphicsManager.canvas.onmousemove = (ev) => { this._handleMouseMove(ev); };

        this._countFramesAndUpdateDisplay();

        let startTime = Date.now();
        let previousTime = Date.now();
        let previousDeltaTime = 0;
        while (true) {
            await this._tick(previousDeltaTime, Date.now() - startTime);

            // Waste remaining time if it was faster than MIN_FRAME_LENGTH to enforce a maximum fps.
            let remainingTime = MIN_FRAME_LENGTH - (Date.now() - previousTime);
            if (remainingTime > 0) {
                await new Promise(r => setTimeout(r, remainingTime));
            }

            previousDeltaTime = Date.now() - previousTime;
            previousTime = Date.now();

            this._frameCounter++;
        }
    }

    async _tick(deltaTime, totalTimeElapsed) {
        // TODO: render all components
        await this._renderAllShapes();
    }

    async _renderAllShapes() {
        const gl = this._graphicsManager.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (let shape of this._listOfShapes) {
            shape.render(this._graphicsManager, this._globalCameraMatrix);
        }
    }

    async _countFramesAndUpdateDisplay() {
        while (true) {
            this._frameCounter = 0;
            await new Promise(r => setTimeout(r, 1000));
            document.getElementById("fpsdisplay").innerHTML = `${this._frameCounter}`;
        }
    }

    _handleMouseMove(ev) {
        let [x, y] = this._convertCoordsEventToGL(ev);
        if (ev.buttons === 1) {
            let dx = x - this._lastMouseX;
            let dy = y - this._lastMouseY;

            this._globalCameraMatrixRotX.rotate(GLOBAL_ROTATION_SPEED * dy, 1, 0, 0);
            this._globalCameraMatrixRotY.rotate(-GLOBAL_ROTATION_SPEED * dx, 0, 1, 0);
            this._updateGlobalCameraMatrix();
        }

        this._lastMouseX = x;
        this._lastMouseY = y;
    }

    _updateGlobalCameraMatrix() {
        this._globalCameraMatrix.setIdentity();
        this._globalCameraMatrix.multiply(this._globalCameraMatrixZoom);
        this._globalCameraMatrix.multiply(this._globalCameraMatrixRotX);
        this._globalCameraMatrix.multiply(this._globalCameraMatrixRotY);
    }

    _convertCoordsEventToGL(ev) {
        let x = ev.clientX;
        let y = ev.clientY;
        let rect = ev.target.getBoundingClientRect();

        x = ((x - rect.left) - this._graphicsManager.canvas.width / 2) / (this._graphicsManager.canvas.width / 2);
        y = (this._graphicsManager.canvas.height / 2 - (y - rect.top)) / (this._graphicsManager.canvas.height / 2);

        return [x, y];
    }
}
