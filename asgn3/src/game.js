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

        this._skyComp = null;
        this._terrainComp = null;
    }

    start() {
        this._gm = new GameManager();
        this._gm.setOnInit(() => { this._init(); });
        this._gm.setOnTick((...args) => { this._tick(...args); });
        this._gm.start();
    }

    _init() {
        this._skyComp = new Component();
        {
            const s = new Cube([0, 0, 1, 1], "./res/images/sky.png", 1.0);
            this._skyComp.matrix.scale(999, 999, 999);
            this._skyComp.addShape(s);
        }
        this._gm.listOfComponents.push(this._skyComp);

        const origin = new Component();
        {
            const s = new Cube([1.0, 0.0, 0.0, 1.0], "./res/images/debugtex.png", 1);
            origin.addShape(s);
        }
        this._gm.listOfComponents.push(origin);

        this._terrainComp = new Component();
        {
            const s = new TerrainChunk([0, 0.5, 0, 1], 32, this._elevationGenerator);
            this._terrainComp.addShape(s);
        }
        this._terrainComp.matrix.translate(0, -5, 0);
        this._gm.listOfComponents.push(this._terrainComp);
    }

    _tick(deltaTime, totalTimeElapsed) {
        const camPos = this._gm.camera.getPosition();

        this._skyComp.animationMatrix.setTranslate(...camPos);
    }
}
