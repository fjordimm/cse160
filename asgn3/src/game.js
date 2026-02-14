import GameManager from "./GameManager.js";
import Component from "./Component.js";
import Cube from "./shapes/Cube.js";
import TerrainChunk from "./shapes/TerrainChunk.js";
import ElevationGenerator from "./ElevationGenerator.js";
import { PermLambdaDefaultDict, DefaultDict } from "./util.js";

const TERRAIN_SIZE = 16;
const TERRAIN_SCALE = 5.0;
const RENDER_DIST = 1; // in chunks

export function startGame() {
    const game = new Game();
    game.start();
}

export class Game {
    constructor() {
        this._gm = null;
        this._elevationGenerator = new ElevationGenerator();
        this._terrainChunks = new PermLambdaDefaultDict(() => new DefaultDict(null));;

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

        // Generate chunks (if not already generated) in a RENDER_DIST x RENDER_DIST square around the camera

        for (let x = keyX - RENDER_DIST; x <= keyX + RENDER_DIST; x++) {
            for (let z = keyZ - RENDER_DIST; z <= keyZ + RENDER_DIST; z++) {
                if (this._terrainChunks[x][z] === null) {
                    const s = makeTerrainChunk(x, z, this._elevationGenerator);
                    this._terrainComp.addShape(s);
                    this._terrainChunks[x][z] = s;
                }
            }
        }

        // Update which chunks should be visible

        for (const [chunkKeyX, __chunk] of Object.entries(this._terrainChunks)) {
            for (const [chunkKeyZ, chunk] of Object.entries(__chunk)) {
                const dKeyX = Math.abs(chunkKeyX - keyX);
                const dKeyZ = Math.abs(chunkKeyZ - keyZ);

                if (Math.max(dKeyX, dKeyZ) <= RENDER_DIST) {
                    chunk.isVisible = true;
                } else {
                    chunk.isVisible = false;
                }
            }
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
