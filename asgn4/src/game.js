import GameManager from "./GameManager.js";
import Component from "./Component.js";
import Cube from "./shapes/Cube.js";
import Sphere from "./shapes/Sphere.js";

export function startGame() {
    const game = new Game();
    game.start();
}

export class Game {
    constructor() {
        this._gm = null;

        this._skyComp = null;
    }

    start() {
        this._gm = new GameManager();
        this._gm.setOnInit(() => { this._init(); });
        this._gm.setOnTick((...args) => { this._tick(...args); });
        this._gm.start();
    }

    _init() {
        this._gm.camera.setY(2);
        this._gm.camera.setZ(-5);
        this._gm.camera.rotateHoriz(180);

        this._gm.pointLight.setPosition([3, 6, 5]);

        this._skyComp = new Component();
        {
            const s = new Cube([0, 0, 1, 1], "./res/images/sky.png", 1.0);
            s.matrix.scale(999, 999, 999);
            this._skyComp.addShape(s);
        }
        this._gm.listOfComponents.push(this._skyComp);

        const thingy = new Component();
        {
            const s = new Sphere([0.7, 0.2, 0.1, 1], 10);
            thingy.addShape(s);
        }
        {
            const s = new Cube([0.7, 0.2, 0.1, 1], null, 0.0);
            s.matrix.translate(5, 0, 0);
            thingy.addShape(s);
        }
        this._gm.listOfComponents.push(thingy);
    }

    _tick(deltaTime, totalTimeElapsed) {
        const camPos = this._gm.camera.getPosition();

        // Move sky so it's always centered at the camera so it looks like it doesn't move
        this._skyComp.matrix.setTranslate(...camPos);
    }
}
