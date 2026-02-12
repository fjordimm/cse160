import GraphicsManager from "./GraphicsManager.js";
import Camera from "./Camera.js";
import Component from "./Component.js";
import Cube from "./shapes/Cube.js";
import { DefaultDict } from "./util.js";

const MIN_FRAME_LENGTH = 16; // 16 for 60fps.
const CAM_MOVEMENT_SPEED = 0.01;
const CAM_ROTATION_SPEED = 0.1;

const _IDENTITY_MATRIX = new Matrix4();

export default class GameManager {
    constructor() {
        this._grm = null; // GraphicsManager
        this._camera = null;
        this._pressedKeys = null;
        this._listOfComponents = null;
        this._frameCounter = 0;
        this._lastMouseX = 0;
        this._lastMouseY = 0;
    }

    async start() {
        this._grm = new GraphicsManager();
        await this._grm.setup();

        this._camera = new Camera(60, this._grm.canvas.width, this._grm.canvas.height, 0.1, 1000);
        this._pressedKeys = new DefaultDict(false);
        this._listOfComponents = [];
        this._frameCounter = 0;
        this._lastMouseX = 0;
        this._lastMouseY = 0;

        /////////////////////////////////////////////////////////
        const bob = new Component();
        {
            const s = new Cube([1.0, 0.0, 0.0, 1.0], "./res/images/debugtex.png", 0.75);
            bob.addShape(s);
        }
        bob.matrix.translate(0, -1, -5);
        this._listOfComponents.push(bob);
        /////////////////////////////////////////////////////////

        window.onkeydown = (ev) => { this._pressedKeys[ev.code] = true; };
        window.onkeyup = (ev) => { this._pressedKeys[ev.code] = false; };

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
        // this._listOfComponents[0].animationMatrix.rotate(deltaTime * 0.05, 0, 1, 0);

        // Camera rotation

        let camHorizRotation = 0;

        if (this._pressedKeys["KeyQ"]) {
            camHorizRotation += 1;
        }
        if (this._pressedKeys["KeyE"]) {
            camHorizRotation -= 1;
        }

        this._camera.rotate(camHorizRotation * deltaTime * CAM_ROTATION_SPEED);

        // Camera movement

        const camMoveVec = new Vector3();

        if (this._pressedKeys["KeyW"]) {
            camMoveVec.elements[2] -= 1;
        }
        if (this._pressedKeys["KeyS"]) {
            camMoveVec.elements[2] += 1;
        }
        if (this._pressedKeys["KeyA"]) {
            camMoveVec.elements[0] -= 1;
        }
        if (this._pressedKeys["KeyD"]) {
            camMoveVec.elements[0] += 1;
        }

        camMoveVec.normalize();

        camMoveVec.elements[0] *= deltaTime * CAM_MOVEMENT_SPEED;
        camMoveVec.elements[1] *= deltaTime * CAM_MOVEMENT_SPEED;
        camMoveVec.elements[2] *= deltaTime * CAM_MOVEMENT_SPEED;

        this._camera.moveForwards(camMoveVec);

        // Rendering

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

    async _countFramesAndUpdateDisplay() {
        while (true) {
            this._frameCounter = 0;
            await new Promise(r => setTimeout(r, 1000));
            document.getElementById("fpsdisplay").innerHTML = `${this._frameCounter}`;
        }
    }
}
