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
    }

    start() {
        this._gm = new GameManager();
        this._gm.setOnInit(() => { this._init(); });
        this._gm.setOnTick((deltaTime, totalTimeElapsed) => { this._tick(deltaTime, totalTimeElapsed); });
        this._gm.start();
    }

    _init() {
        const sky = new Component();
        {
            const s = new Cube([0, 0, 1, 1], "./res/images/sky.png", 1.0);
            sky.addShape(s);
        }
        sky.matrix.scale(100, 100, 100);
        this._gm.listOfComponents().push(sky);

        const n = 30;
        const radius = 10;
        for (let i = 0; i < n; i++) {
            const xPos = radius * Math.cos((i / n) * 2 * Math.PI);
            const zPos = radius * Math.sin((i / n) * 2 * Math.PI);

            const thing = new Component();
            {
                const s = new Cube([1.0, 0.0, 0.0, 1.0], "./res/images/debugtex.png", 0.75);
                thing.addShape(s);
            }
            thing.matrix.translate(xPos, -1, zPos);
            this._gm.listOfComponents().push(thing);
        }

        const terrain = new Component();
        {
            const s = new TerrainChunk([0, 0.5, 0, 1], 16, this._elevationGenerator);
            terrain.addShape(s);
        }
        terrain.matrix.translate(0, -5, 0);
        this._gm.listOfComponents().push(terrain);
    }

    _tick(deltaTime, totalTimeElapsed) {
        // console.log("tickin away: ", deltaTime);
    }
}
