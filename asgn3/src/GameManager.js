import GraphicsManager from "./GraphicsManager.js";
import Camera from "./Camera.js";
import Component from "./Component.js";
import Cube from "./shapes/Cube.js";

const MIN_FRAME_LENGTH = 16; // 16 for 60fps.

const _IDENTITY_MATRIX = new Matrix4();

export default class GameManager {
    constructor() {
        this._grm = null; // GraphicsManager
        this._camera = null;
        this._listOfComponents = null;
        this._frameCounter = 0;
        this._lastMouseX = 0;
        this._lastMouseY = 0;
    }

    async start() {
        this._grm = new GraphicsManager();
        await this._grm.setup();

        this._camera = new Camera(60, 400, 400, 0.1, 1000);
        // TODO: no magic number for 400 400
        this._listOfComponents = [];
        this._frameCounter = 0;
        this._lastMouseX = 0;
        this._lastMouseY = 0;

        /////////////////////////////////////////////////////////
        const bob = new Component();
        {
            const s = new Cube([1.0, 0.0, 0.0, 1.0], "./res/images/debugtex.png", 0.75);
            s.matrix.translate(0, 0, -3);
            s.matrix.scale(0.2, 0.2, 0.2);
            bob.addShape(s);
        }
        {
            const s = new Cube([1.0, 0.0, 0.0, 1.0], "./res/images/grass.png", 0.75);
            s.matrix.translate(0.5, 0, -3);
            s.matrix.scale(0.2, 0.2, 0.2);
            bob.addShape(s);
        }
        this._listOfComponents.push(bob);
        /////////////////////////////////////////////////////////

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
        this._camera._eye.elements[0] += 0.01;
        this._camera._at.elements[0] += 0.01;
        this._camera._updateViewMatrix();

        await this._renderAllComponents();
    }

    async _renderAllComponents() {
        this._grm.gl.clear(this._grm.gl.COLOR_BUFFER_BIT | this._grm.gl.DEPTH_BUFFER_BIT);

        this._grm.gl.uniformMatrix4fv(this._grm.u_ViewMatrix, false, this._camera.getViewMatrix().elements);
        this._grm.gl.uniformMatrix4fv(this._grm.u_ProjectionMatrix, false, this._camera.getProjectionMatrix().elements);

        for (let component of this._listOfComponents) {
            component.render(this._grm, _IDENTITY_MATRIX);
        }
    }

    _handleMouseMove(ev) {
        // let [x, y] = this._convertCoordsEventToGL(ev);
        // if (ev.buttons === 1) {
        //     let dx = x - this._lastMouseX;
        //     let dy = y - this._lastMouseY;

        //     this._globalCameraMatrixRotX.rotate(GLOBAL_ROTATION_SPEED * dy, 1, 0, 0);
        //     this._globalCameraMatrixRotY.rotate(-GLOBAL_ROTATION_SPEED * dx, 0, 1, 0);
        //     this._updateGlobalCameraMatrix();
        // }

        // this._lastMouseX = x;
        // this._lastMouseY = y;
    }

    async _countFramesAndUpdateDisplay() {
        while (true) {
            this._frameCounter = 0;
            await new Promise(r => setTimeout(r, 1000));
            document.getElementById("fpsdisplay").innerHTML = `${this._frameCounter}`;
        }
    }
}
