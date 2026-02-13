import GameManager from "./GameManager.js";
import Component from "./Component.js";
import Cube from "./shapes/Cube.js";
import TerrainChunk from "./shapes/TerrainChunk.js";
import ElevationGenerator from "./ElevationGenerator.js";

export function startGame() {
    const game = new Game();
    game.start();
}

export class Game {
    constructor() {
        this._gm = null;
        this._elevationGenerator = new ElevationGenerator();

        this._sky = null;
        this._terrain = null;
    }

    start() {
        this._gm = new GameManager();
        this._gm.setOnInit(() => { this._init(); });
        this._gm.setOnTick((...args) => { this._tick(...args); });
        this._gm.start();
    }

    _init() {
        this._sky = new Component();
        {
            const s = new Cube([0, 0, 1, 1], "./res/images/sky.png", 1.0);
            this._sky.matrix.scale(999, 999, 999);
            this._sky.addShape(s);
        }
        this._gm.listOfComponents().push(this._sky);

        // const n = 30;
        // const radius = 10;
        // for (let i = 0; i < n; i++) {
        //     const xPos = radius * Math.cos((i / n) * 2 * Math.PI);
        //     const zPos = radius * Math.sin((i / n) * 2 * Math.PI);

        //     const thing = new Component();
        //     {
        //         const s = new Cube([1.0, 0.0, 0.0, 1.0], "./res/images/debugtex.png", 0.75);
        //         thing.addShape(s);
        //     }
        //     thing.matrix.translate(xPos, -1, zPos);
        //     this._gm.listOfComponents().push(thing);
        // }
        const origin = new Component();
        {
            const s = new Cube([1.0, 0.0, 0.0, 1.0], "./res/images/debugtex.png", 1);
            origin.addShape(s);
        }
        this._gm.listOfComponents().push(origin);

        this._terrain = new Component();
        {
            const s = new TerrainChunk([0, 0.5, 0, 1], 32, this._elevationGenerator);
            this._terrain.addShape(s);
        }
        this._terrain.matrix.translate(0, -5, 0);
        this._gm.listOfComponents().push(this._terrain);
    }

    _tick(deltaTime, totalTimeElapsed, camera) {
        const camPos = camera.getPosition();

        this._sky.animationMatrix.setTranslate(...camPos);
    }
}
