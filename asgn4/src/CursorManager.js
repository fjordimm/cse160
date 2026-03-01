export default class CursorManager {
    constructor() {
        this._pointerLocked = false;
        this._onMove = null;
    }

    setupPointerLock(canvas, document) {
        canvas.addEventListener("click", () => {
            canvas.requestPointerLock();
        });

        document.addEventListener("pointerlockchange", () => {
            if (document.pointerLockElement === canvas) {
                this._pointerLocked = true;
            } else {
                this._pointerLocked = false;
            }
        });

        document.addEventListener("mousemove", (ev) => {
            if (document.pointerLockElement === canvas) {
                if (this._onMove) {
                    this._onMove(ev.movementX, ev.movementY);
                }
            }
        });
    }

    setOnMove(f) {
        this._onMove = f;
    }

    setOnLeftClick(canvas, f) {
        canvas.addEventListener("click", (ev) => {
            if (this._pointerLocked) {
                if (ev.which === 1) {
                    f();
                }
            }
        });
    }

    setOnRightClick(canvas, f) {
        canvas.addEventListener("click", (ev) => {
            if (this._pointerLocked) {
                if (ev.which === 3) {
                    f();
                }
            }
        });
    }
}