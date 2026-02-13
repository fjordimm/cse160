import GameManager from "./GameManager.js";
import Component from "./Component.js";
import Cube from "./shapes/Cube.js";
import TerrainChunk from "./shapes/TerrainChunk.js";
import ElevationGenerator from "./ElevationGenerator.js";
import { LambdaDefaultDict, DefaultDict } from "./util.js";

const TERRAIN_SIZE = 16;
const TERRAIN_SCALE = 1.0;
const RENDER_DIST = 2; // in chunks

export function startGame() {
    const game = new Game();
    game.start();
}

export class Game {
    constructor() {
        this._gm = null;
        this._elevationGenerator = new ElevationGenerator();
        this._terrainChunks = {};

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
        this._gm.camera.move(new Vector3([0, 5, 0]));

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
        // {
        //     const s = makeTerrainChunk(0, 0, this._elevationGenerator);
        //     this._terrainComp.addShape(s);
        // }
        // {
        //     const s = makeTerrainChunk(1, 0, this._elevationGenerator);
        //     this._terrainComp.addShape(s);
        // }
        this._gm.listOfComponents.push(this._terrainComp);
    }

    _tick(deltaTime, totalTimeElapsed) {
        const camPos = this._gm.camera.getPosition();

        // Move sky so it's always centered at the camera so it looks like it doesn't move
        this._skyComp.animationMatrix.setTranslate(...camPos);

        this._updateTerrainChunks(camPos[0], camPos[2]);
    }

    _updateTerrainChunks(camX, camZ) {
        const [keyX, keyZ] = coordsToTerrainDictKey(camX, camZ);

        // for (const [chunkKey, chunk] of Object.entries(this._terrainChunks)) {
        //     // console.log(chunkKey);
        //     const [chunkKeyX, chunkKeyZ] = chunkKey.split(",").map(Number);
        //     console.log([chunkKeyX, chunkKeyZ]);
        // }

        for (const [chunkKey, chunk] of Object.entries(this._terrainChunks)) {
            const [chunkKeyX, chunkKeyZ] = chunkKey.split(",").map(Number);
            const dKeyX = Math.abs(chunkKeyX - keyX);
            const dKeyZ = Math.abs(chunkKeyZ - keyZ);

            console.log(`(${chunkKeyX}, ${chunkKeyZ}) has distance (${dKeyX}, ${dKeyZ}).`);

            if (Math.max(dKeyX, dKeyZ) <= RENDER_DIST) {
                chunk.isVisible = true;
            } else {
                chunk.isVisible = false;
            }
        }

        if (!this._terrainChunks[[keyX, keyZ]]) {
            const s = makeTerrainChunk(keyX, keyZ, this._elevationGenerator);
            this._terrainComp.addShape(s);
            this._terrainChunks[[keyX, keyZ]] = s;
        }
    }
}

function coordsToTerrainDictKey(x, z) {
    return [Math.floor(x / (TERRAIN_SIZE * TERRAIN_SCALE)), Math.floor(z / (TERRAIN_SIZE * TERRAIN_SCALE))];
}

const TERRAIN_COLOR = [0, 0.5, 0, 1];

function makeTerrainChunk(keyX, keyZ, elevationGenerator) {
    const realX = keyX * TERRAIN_SIZE * TERRAIN_SCALE;
    const realZ = keyZ * TERRAIN_SIZE * TERRAIN_SCALE;

    const s = new TerrainChunk(TERRAIN_COLOR, TERRAIN_SIZE, TERRAIN_SCALE, realX, realZ, elevationGenerator);
    s.matrix.translate(realX, 0, realZ);
    return s;
}
