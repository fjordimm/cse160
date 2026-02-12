import GraphicsManager from "./GraphicsManager.js";
import Component from "./Component.js";
import Cube from "./shapes/Cube.js";

const MIN_FRAME_LENGTH = 16; // 16 for 60fps.
const GLOBAL_ROTATION_SPEED = 150.0;
const GLOBAL_SCROLL_SPEED = 15.0;

const _IDENTITY_MATRIX = new Matrix4();

export default class GameManager {
    constructor() {
        this._grm = null; // GraphicsManager
        this._listOfComponents = null;
        this._frameCounter = 0;
        this._globalCameraMatrixRotY;
        this._globalCameraMatrixRotX;
        this._globalCameraMatrixZoom;
        this._globalCameraMatrix;
        this._lastMouseX = 0;
        this._lastMouseY = 0;
    }

    async start() {
        this._grm = new GraphicsManager();
        await this._grm.setup();
        
        this._grm.gl.enable(this._grm.gl.DEPTH_TEST);
        this._grm.gl.enable(this._grm.gl.CULL_FACE);
        this._grm.gl.cullFace(this._grm.gl.BACK);
        this._grm.gl.frontFace(this._grm.gl.CCW);

        this._grm.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this._grm.gl.clear(this._grm.gl.COLOR_BUFFER_BIT | this._grm.gl.DEPTH_BUFFER_BIT);

        this._listOfComponents = [];
        this._frameCounter = 0;
        this._globalCameraMatrixRotY = new Matrix4();
        this._globalCameraMatrixRotX = new Matrix4();
        this._globalCameraMatrixZoom = new Matrix4();
        this._globalCameraMatrix = new Matrix4();
        this._lastMouseX = 0;
        this._lastMouseY = 0;

        const bob = new Component();
        {
            const s = new Cube([1.0, 0.0, 0.0, 1.0]);
            s.matrix.scale(0.2, 0.2, 0.2);
            bob.addShape(s);
        }
        this._listOfComponents.push(bob);

        this._grm.canvas.onmousemove = (ev) => { this._handleMouseMove(ev); };

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
        await this._renderAllComponents();
    }

    async _renderAllComponents() {
        this._grm.gl.clear(this._grm.gl.COLOR_BUFFER_BIT | this._grm.gl.DEPTH_BUFFER_BIT);

        for (let component of this._listOfComponents) {
            component.render(this._grm, this._globalCameraMatrix, _IDENTITY_MATRIX);
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

        x = ((x - rect.left) - this._grm.canvas.width / 2) / (this._grm.canvas.width / 2);
        y = (this._grm.canvas.height / 2 - (y - rect.top)) / (this._grm.canvas.height / 2);

        return [x, y];
    }

    async _countFramesAndUpdateDisplay() {
        while (true) {
            this._frameCounter = 0;
            await new Promise(r => setTimeout(r, 1000));
            document.getElementById("fpsdisplay").innerHTML = `${this._frameCounter}`;
        }
    }
}
