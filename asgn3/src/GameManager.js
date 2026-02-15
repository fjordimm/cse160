import GraphicsManager from "./GraphicsManager.js";
import Camera from "./Camera.js";
import Component from "./Component.js";
import Cube from "./shapes/Cube.js";
import { DefaultDict } from "./util.js";
import CursorManager from "./CursorManager.js";

const MIN_FRAME_LENGTH = 16; // 16 for 60fps.
const CAM_MOVEMENT_SPEED = 0.1;
const CAM_ROTATION_SPEED = 0.1;
const CAM_CURSOR_SENSITIVITY = 0.5;

const IDENTITY_MATRIX = new Matrix4();

export default class GameManager {
    constructor() {
        this.grm = null; // GraphicsManager
        this.camera = null;
        this.pressedKeys = null;
        this.cursorManager = null;
        this.listOfComponents = null;
        this._onInit = null;
        this._onTick = null;
    }

    setOnInit(f) {
        this._onInit = f;
    }

    setOnTick(f) {
        this._onTick = f;
    }

    async start() {
        this.grm = new GraphicsManager();
        await this.grm.setup();

        this.camera = new Camera(60, this.grm.canvas.width, this.grm.canvas.height, 0.1, 1000);
        this.pressedKeys = new DefaultDict(false);
        this.cursorManager = new CursorManager();
        this.listOfComponents = [];

        window.onkeydown = (ev) => { this.pressedKeys[ev.code] = true; };
        window.onkeyup = (ev) => { this.pressedKeys[ev.code] = false; };
        this.cursorManager.setupPointerLock(this.grm.canvas, document);
        this.cursorManager.setOnMove((x, y) => { this._onCursorMove(x, y); });

        if (this._onInit) {
            this._onInit();
        }

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

            document.getElementById("fpsdisplay").innerHTML = (1000 / previousDeltaTime).toFixed(1);
        }
    }

    async _tick(deltaTime, totalTimeElapsed) {
        if (this._onTick) {
            this._onTick(deltaTime, totalTimeElapsed);
        }

        // Camera rotation

        let camHorizRotation = 0;

        if (this.pressedKeys["KeyQ"]) {
            camHorizRotation += 1;
        }
        if (this.pressedKeys["KeyE"]) {
            camHorizRotation -= 1;
        }

        this.camera.rotateHoriz(camHorizRotation * deltaTime * CAM_ROTATION_SPEED);

        // Camera x/z movement

        const camMoveVec = new Vector3();

        if (this.pressedKeys["KeyA"]) {
            camMoveVec.elements[0] -= 1;
        }
        if (this.pressedKeys["KeyD"]) {
            camMoveVec.elements[0] += 1;
        }
        if (this.pressedKeys["KeyW"]) {
            camMoveVec.elements[2] -= 1;
        }
        if (this.pressedKeys["KeyS"]) {
            camMoveVec.elements[2] += 1;
        }

        camMoveVec.normalize();
        camMoveVec.elements[0] *= deltaTime * CAM_MOVEMENT_SPEED;
        camMoveVec.elements[1] *= deltaTime * CAM_MOVEMENT_SPEED;
        camMoveVec.elements[2] *= deltaTime * CAM_MOVEMENT_SPEED;

        this.camera.moveForwards(camMoveVec, false);

        // Camera y movement

        let camMoveY = 0;

        if (this.pressedKeys["Space"]) {
            camMoveY += 1;
        }
        if (this.pressedKeys["ShiftLeft"] || this.pressedKeys["ShiftRight"]) {
            camMoveY -= 1;
        }

        this.camera.move(new Vector3([0, camMoveY * deltaTime * CAM_MOVEMENT_SPEED, 0]));

        // Rendering

        await this._renderAllComponents();
    }

    async _renderAllComponents() {
        this.grm.gl.clear(this.grm.gl.COLOR_BUFFER_BIT | this.grm.gl.DEPTH_BUFFER_BIT);

        this.grm.gl.uniformMatrix4fv(this.grm.u_ViewMatrix, false, this.camera.getViewMatrix().elements);
        this.grm.gl.uniformMatrix4fv(this.grm.u_ProjectionMatrix, false, this.camera.getProjectionMatrix().elements);

        for (let component of this.listOfComponents) {
            component.render(this.grm, IDENTITY_MATRIX);
        }
    }

    _onCursorMove(x, y) {
        this.camera.rotateVert(-y * CAM_CURSOR_SENSITIVITY);
        this.camera.rotateHoriz(-x * CAM_CURSOR_SENSITIVITY);
    }
}
