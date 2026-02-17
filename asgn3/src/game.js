import GameManager from "./GameManager.js";
import Component from "./Component.js";
import Cube from "./shapes/Cube.js";
import TerrainChunk from "./shapes/TerrainChunk.js";
import ElevationGenerator from "./ElevationGenerator.js";
import { PermLambdaDefaultDict, DefaultDict } from "./util.js";
import CylinderVert from "./shapes/CylinderVert.js";
import CylinderHoriz from "./shapes/CylinderHoriz.js";

const TERRAIN_SIZE = 8;
const TERRAIN_SCALE = 5.0;
const RENDER_DIST = 1; // in chunks

const BLOCK_REACH_RANGE = 2;

const INITIAL_WALL_LAYOUT = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2],
    [2, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 2],
    [2, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2],
    [2, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 2],
    [2, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];
const WALL_COLOR = [0.5, 0.5, 0.5, 1];

export function startGame() {
    const game = new Game();
    game.start();
}

const COLOR_FUR1 = [0.416, 0.227, 0.161, 1];
const COLOR_FUR2 = [0.478, 0.29, 0.22, 1];
const COLOR_NOSE = [0.529, 0.294, 0.212, 1];
const COLOR_EYE = [0.1, 0.1, 0.1, 1];
const COLOR_HORN = [0.224, 0.196, 0.176, 1];
const COLOR_FOOT = [0.149, 0.133, 0.129, 1];
let oxBody;
let oxBackLeftLeg;
let oxBackLeftLegLower;
let oxBackLeftLegLowerFoot;
let oxBackRightLeg;
let oxBackRightLegLower;
let oxBackRightLegLowerFoot;
let oxFrontLeftLeg;
let oxFrontLeftLegLower;
let oxFrontLeftLegLowerFoot;
let oxFrontRightLeg;
let oxFrontRightLegLower;
let oxFrontRightLegLowerFoot;
let oxHead;

export class Game {
    constructor() {
        this._gm = null;
        this._elevationGenerator = new ElevationGenerator();
        this._terrainChunks = new PermLambdaDefaultDict(() => new DefaultDict(null));

        this._skyComp = null;
        this._terrainComp = null;
        this._walls = null;
    }

    start() {
        this._gm = new GameManager();
        this._gm.setOnInit(() => { this._init(); });
        this._gm.setOnTick((...args) => { this._tick(...args); });
        this._gm.start();
    }

    _init() {
        this._gm.cursorManager.setOnLeftClick(this._gm.grm.canvas, () => { this._deleteBlock(); });
        this._gm.cursorManager.setOnRightClick(this._gm.grm.canvas, () => { this._addBlock(); });

        this._skyComp = new Component();
        {
            const s = new Cube([0, 0, 1, 1], "./res/images/sky.png", 1.0);
            s.matrix.scale(999, 999, 999);
            this._skyComp.addShape(s);
        }
        this._gm.listOfComponents.push(this._skyComp);

        this._terrainComp = new Component();
        this._gm.listOfComponents.push(this._terrainComp);

        const erm = new Component();
        this._gm.listOfComponents.push(erm);

        this._walls = [];
        for (let c = 0; c < 32; c++) {
            this._walls.push([]);
            for (let r = 0; r < 32; r++) {
                this._walls[c].push([]);
                for (let i = 1; i <= 4; i++) {
                    const wall = new Component();
                    {
                        const s = new Cube(WALL_COLOR, "./res/images/wall.png", 1);
                        wall.addShape(s);
                    }
                    wall.matrix.translate(c, this._elevationGenerator.at(c, r) + i - 0.5, r);
                    this._gm.listOfComponents.push(wall);

                    if (i > INITIAL_WALL_LAYOUT[c][r]) {
                        wall.isVisible = false;
                    }

                    this._walls[c][r].push(wall);
                }
            }
        }

        this._gm.camera.setX(16);
        this._gm.camera.setZ(16);

        {
            oxBody = new Component();
            oxBackLeftLeg = new Component();
            oxBackLeftLegLower = new Component();
            oxBackLeftLegLowerFoot = new Component();
            oxBackRightLeg = new Component();
            oxBackRightLegLower = new Component();
            oxBackRightLegLowerFoot = new Component();
            oxFrontLeftLeg = new Component();
            oxFrontLeftLegLower = new Component();
            oxFrontLeftLegLowerFoot = new Component();
            oxFrontRightLeg = new Component();
            oxFrontRightLegLower = new Component();
            oxFrontRightLegLowerFoot = new Component();
            oxHead = new Component();

            // body
            {
                const s = new CylinderHoriz(COLOR_FUR1, 30);
                s.matrix.scale(0.2, 0.2, 0.25);
                oxBody.addShape(s);
            }
            {
                const s = new CylinderHoriz(COLOR_FUR1, 30);
                s.matrix.translate(0, 0.015, 0.1);
                s.matrix.scale(0.18, 0.18, 0.5);
                oxBody.addShape(s);
            }
            {
                const s = new CylinderHoriz(COLOR_FUR1, 30);
                s.matrix.translate(0, 0.03, -0.4);
                s.matrix.scale(0.15, 0.15, 0.08);
                oxBody.addShape(s);
            }
            {
                // back left leg
                {
                    oxBody.addChild(oxBackLeftLeg);
                    oxBackLeftLeg.matrix.translate(0.1, 0, 0.5);
                    {
                        const s = new CylinderVert(COLOR_FUR1, 10);
                        s.matrix.translate(0, -0.12, 0);
                        s.matrix.scale(0.075, 0.12, 0.075);
                        oxBackLeftLeg.addShape(s);
                    }
                    {
                        const s = new CylinderVert(COLOR_FUR1, 10);
                        s.matrix.translate(0, -0.15, 0);
                        s.matrix.scale(0.06, 0.15, 0.06);
                        oxBackLeftLeg.addShape(s);
                    }
                    {
                        // back left leg lower
                        {
                            oxBackLeftLeg.addChild(oxBackLeftLegLower);
                            oxBackLeftLegLower.matrix.translate(0, -0.3, 0);
                            {
                                const s = new CylinderVert(COLOR_FUR2, 8);
                                s.matrix.translate(0, -0.07, 0);
                                s.matrix.scale(0.04, 0.1, 0.04);
                                oxBackLeftLegLower.addShape(s);
                            }
                            {
                                // back left leg lower foot
                                {
                                    oxBackLeftLegLower.addChild(oxBackLeftLegLowerFoot);
                                    oxBackLeftLegLowerFoot.matrix.translate(0, -0.17, 0);
                                    {
                                        const s = new Cube(COLOR_FOOT);
                                        s.matrix.scale(0.09, 0.04, 0.1);
                                        oxBackLeftLegLowerFoot.addShape(s);
                                    }
                                    {
                                        const s = new Cube(COLOR_FOOT);
                                        s.matrix.translate(0.015, 0, 0);
                                        s.matrix.rotate(-15, 0, 1, 0);
                                        s.matrix.translate(0, 0, -0.06);
                                        s.matrix.scale(0.045, 0.04, 0.045);
                                        oxBackLeftLegLowerFoot.addShape(s);
                                    }
                                    {
                                        const s = new Cube(COLOR_FOOT);
                                        s.matrix.translate(-0.015, 0, 0);
                                        s.matrix.rotate(15, 0, 1, 0);
                                        s.matrix.translate(0, 0, -0.06);
                                        s.matrix.scale(0.045, 0.04, 0.045);
                                        oxBackLeftLegLowerFoot.addShape(s);
                                    }
                                }
                            }
                        }
                    }
                }
                // back right leg
                {
                    oxBody.addChild(oxBackRightLeg);
                    oxBackRightLeg.matrix.translate(-0.1, 0, 0.5);
                    {
                        const s = new CylinderVert(COLOR_FUR1, 10);
                        s.matrix.translate(0, -0.12, 0);
                        s.matrix.scale(0.075, 0.12, 0.075);
                        oxBackRightLeg.addShape(s);
                    }
                    {
                        const s = new CylinderVert(COLOR_FUR1, 10);
                        s.matrix.translate(0, -0.15, 0);
                        s.matrix.scale(0.06, 0.15, 0.06);
                        oxBackRightLeg.addShape(s);
                    }
                    {
                        // back right leg lower
                        {
                            oxBackRightLeg.addChild(oxBackRightLegLower);
                            oxBackRightLegLower.matrix.translate(0, -0.3, 0);
                            {
                                const s = new CylinderVert(COLOR_FUR2, 8);
                                s.matrix.translate(0, -0.07, 0);
                                s.matrix.scale(0.04, 0.1, 0.04);
                                oxBackRightLegLower.addShape(s);
                            }
                            {
                                // back right leg lower foot
                                {
                                    oxBackRightLegLower.addChild(oxBackRightLegLowerFoot);
                                    oxBackRightLegLowerFoot.matrix.translate(0, -0.17, 0);
                                    {
                                        const s = new Cube(COLOR_FOOT);
                                        s.matrix.scale(0.09, 0.04, 0.1);
                                        oxBackRightLegLowerFoot.addShape(s);
                                    }
                                    {
                                        const s = new Cube(COLOR_FOOT);
                                        s.matrix.translate(0.015, 0, 0);
                                        s.matrix.rotate(-15, 0, 1, 0);
                                        s.matrix.translate(0, 0, -0.06);
                                        s.matrix.scale(0.045, 0.04, 0.045);
                                        oxBackRightLegLowerFoot.addShape(s);
                                    }
                                    {
                                        const s = new Cube(COLOR_FOOT);
                                        s.matrix.translate(-0.015, 0, 0);
                                        s.matrix.rotate(15, 0, 1, 0);
                                        s.matrix.translate(0, 0, -0.06);
                                        s.matrix.scale(0.045, 0.04, 0.045);
                                        oxBackRightLegLowerFoot.addShape(s);
                                    }
                                }
                            }
                        }
                    }
                }
                // front left leg
                {
                    oxBody.addChild(oxFrontLeftLeg);
                    oxFrontLeftLeg.matrix.translate(0.1, -0.1, -0.15);
                    {
                        const s = new CylinderVert(COLOR_FUR1, 10);
                        s.matrix.translate(0, -0.1, 0);
                        s.matrix.scale(0.06, 0.1, 0.06);
                        oxFrontLeftLeg.addShape(s);
                    }
                    {
                        // front left leg lower
                        oxFrontLeftLeg.addChild(oxFrontLeftLegLower);
                        oxFrontLeftLegLower.matrix.translate(0, -0.2, 0);
                        {
                            const s = new CylinderVert(COLOR_FUR2, 8);
                            s.matrix.translate(0, -0.07, 0);
                            s.matrix.scale(0.045, 0.1, 0.045);
                            oxFrontLeftLegLower.addShape(s);
                        }
                        {
                            // front left leg lower foot
                            {
                                oxFrontLeftLegLower.addChild(oxFrontLeftLegLowerFoot);
                                oxFrontLeftLegLowerFoot.matrix.translate(0, -0.17, 0);
                                {
                                    const s = new Cube(COLOR_FOOT);
                                    s.matrix.scale(0.09, 0.04, 0.1);
                                    oxFrontLeftLegLowerFoot.addShape(s);
                                }
                                {
                                    const s = new Cube(COLOR_FOOT);
                                    s.matrix.translate(0.015, 0, 0);
                                    s.matrix.rotate(-15, 0, 1, 0);
                                    s.matrix.translate(0, 0, -0.06);
                                    s.matrix.scale(0.045, 0.04, 0.045);
                                    oxFrontLeftLegLowerFoot.addShape(s);
                                }
                                {
                                    const s = new Cube(COLOR_FOOT);
                                    s.matrix.translate(-0.015, 0, 0);
                                    s.matrix.rotate(15, 0, 1, 0);
                                    s.matrix.translate(0, 0, -0.06);
                                    s.matrix.scale(0.045, 0.04, 0.045);
                                    oxFrontLeftLegLowerFoot.addShape(s);
                                }
                            }
                        }
                    }
                }
                // front right leg
                {
                    oxBody.addChild(oxFrontRightLeg);
                    oxFrontRightLeg.matrix.translate(-0.1, -0.1, -0.15);
                    {
                        const s = new CylinderVert(COLOR_FUR1, 10);
                        s.matrix.translate(0, -0.1, 0);
                        s.matrix.scale(0.06, 0.1, 0.06);
                        oxFrontRightLeg.addShape(s);
                    }
                    {
                        // front right leg lower
                        oxFrontRightLeg.addChild(oxFrontRightLegLower);
                        oxFrontRightLegLower.matrix.translate(0, -0.2, 0);
                        {
                            const s = new CylinderVert(COLOR_FUR2, 8);
                            s.matrix.translate(0, -0.07, 0);
                            s.matrix.scale(0.045, 0.1, 0.045);
                            oxFrontRightLegLower.addShape(s);
                        }
                        {
                            // front right leg lower foot
                            {
                                oxFrontRightLegLower.addChild(oxFrontRightLegLowerFoot);
                                oxFrontRightLegLowerFoot.matrix.translate(0, -0.17, 0);
                                {
                                    const s = new Cube(COLOR_FOOT);
                                    s.matrix.scale(0.09, 0.04, 0.1);
                                    oxFrontRightLegLowerFoot.addShape(s);
                                }
                                {
                                    const s = new Cube(COLOR_FOOT);
                                    s.matrix.translate(0.015, 0, 0);
                                    s.matrix.rotate(-15, 0, 1, 0);
                                    s.matrix.translate(0, 0, -0.06);
                                    s.matrix.scale(0.045, 0.04, 0.045);
                                    oxFrontRightLegLowerFoot.addShape(s);
                                }
                                {
                                    const s = new Cube(COLOR_FOOT);
                                    s.matrix.translate(-0.015, 0, 0);
                                    s.matrix.rotate(15, 0, 1, 0);
                                    s.matrix.translate(0, 0, -0.06);
                                    s.matrix.scale(0.045, 0.04, 0.045);
                                    oxFrontRightLegLowerFoot.addShape(s);
                                }
                            }
                        }
                    }
                }
                // head
                {
                    oxBody.addChild(oxHead);
                    oxHead.matrix.translate(0, 0.09, -0.48);
                    {
                        const s = new Cube(COLOR_FUR1);
                        s.matrix.translate(0, 0, 0);
                        s.matrix.scale(0.2, 0.32, 0.12);
                        oxHead.addShape(s);
                    }
                    {
                        const s = new Cube(COLOR_FUR1);
                        s.matrix.translate(0, -0.02, -0.09);
                        s.matrix.scale(0.16, 0.24, 0.12);
                        oxHead.addShape(s);
                    }
                    {
                        const s = new Cube(COLOR_FUR1);
                        s.matrix.translate(0, -0.04, -0.15);
                        s.matrix.scale(0.12, 0.16, 0.12);
                        oxHead.addShape(s);
                    }
                    {
                        const s = new Cube(COLOR_NOSE);
                        s.matrix.translate(0, -0.06, -0.21);
                        s.matrix.scale(0.08, 0.08, 0.04);
                        oxHead.addShape(s);
                    }
                    {
                        const s = new Cube(COLOR_EYE);
                        s.matrix.translate(0.07, 0.05, -0.1);
                        s.matrix.scale(0.04, 0.04, 0.04);
                        oxHead.addShape(s);
                    }
                    {
                        const s = new Cube(COLOR_EYE);
                        s.matrix.translate(-0.07, 0.05, -0.1);
                        s.matrix.scale(0.04, 0.04, 0.04);
                        oxHead.addShape(s);
                    }
                    {
                        const s = new Cube(COLOR_HORN);
                        s.matrix.translate(0, 0.15, -0.035);
                        s.matrix.scale(0.18, 0.06, 0.06);
                        oxHead.addShape(s);
                    }
                    {
                        const s = new Cube(COLOR_HORN);
                        s.matrix.translate(0.08, 0.15, -0.035);
                        s.matrix.scale(0.1, 0.1, 0.1);
                        oxHead.addShape(s);
                    }
                    {
                        const s = new Cube(COLOR_HORN);
                        s.matrix.translate(0.1, 0.15, -0.035);
                        s.matrix.rotate(15, 0, 1, 0);
                        s.matrix.rotate(-10, 0, 0, 1);
                        s.matrix.translate(0.09, 0, 0);
                        s.matrix.scale(0.18, 0.05, 0.07);
                        oxHead.addShape(s);
                    }
                    {
                        const s = new Cube(COLOR_HORN);
                        s.matrix.translate(0.12, 0.13, -0.04);
                        s.matrix.rotate(15, 0, 1, 0);
                        s.matrix.translate(0.15, 0, 0);
                        s.matrix.rotate(-10, 0, 0, 1);
                        s.matrix.rotate(45, 0, 0, 1);
                        s.matrix.translate(0.07, 0, 0);
                        s.matrix.scale(0.18, 0.05, 0.07);
                        oxHead.addShape(s);
                    }
                    {
                        const s = new Cube(COLOR_HORN);
                        s.matrix.translate(-0.08, 0.15, -0.035);
                        s.matrix.scale(0.1, 0.1, 0.1);
                        oxHead.addShape(s);
                    }
                    {
                        const s = new Cube(COLOR_HORN);
                        s.matrix.translate(-0.1, 0.15, -0.035);
                        s.matrix.rotate(-15, 0, 1, 0);
                        s.matrix.rotate(10, 0, 0, 1);
                        s.matrix.translate(-0.09, 0, 0);
                        s.matrix.scale(0.18, 0.05, 0.07);
                        oxHead.addShape(s);
                    }
                    {
                        const s = new Cube(COLOR_HORN);
                        s.matrix.translate(-0.12, 0.13, -0.04);
                        s.matrix.rotate(-15, 0, 1, 0);
                        s.matrix.translate(-0.15, 0, 0);
                        s.matrix.rotate(10, 0, 0, 1);
                        s.matrix.rotate(-45, 0, 0, 1);
                        s.matrix.translate(-0.07, 0, 0);
                        s.matrix.scale(0.18, 0.05, 0.07);
                        oxHead.addShape(s);
                    }
                }
            }

            this._gm.listOfComponents.push(oxBody);

            oxBody.animationMatrix.setTranslate(16, 11, 16);
        }
    }

    _tick(deltaTime, totalTimeElapsed) {
        const camPos = this._gm.camera.getPosition();

        // Move sky so it's always centered at the camera so it looks like it doesn't move
        this._skyComp.matrix.setTranslate(...camPos);

        this._updateTerrainChunks(camPos[0], camPos[2]);

        // Move camera to be along the terrain
        // this._gm.camera.setY(2 + this._elevationGenerator.at(camPos[0], camPos[2]));
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

    _deleteBlock() {
        const camForwards = this._gm.camera.getForwards();
        const camAt = this._gm.camera.getPosition();
        camAt[0] += BLOCK_REACH_RANGE * camForwards[0];
        camAt[1] += BLOCK_REACH_RANGE * camForwards[1];
        camAt[2] += BLOCK_REACH_RANGE * camForwards[2];

        const camAtX = Math.round(camAt[0]);
        const camAtZ = Math.round(camAt[2]);

        if (camAtX >= 0 && camAtX < 32 && camAtZ >= 0 && camAtZ < 32) {
            if (this._walls[camAtX][camAtZ][3].isVisible) {
                this._walls[camAtX][camAtZ][3].isVisible = false;
            } else {
                if (this._walls[camAtX][camAtZ][2].isVisible) {
                    this._walls[camAtX][camAtZ][2].isVisible = false;
                } else {
                    if (this._walls[camAtX][camAtZ][1].isVisible) {
                        this._walls[camAtX][camAtZ][1].isVisible = false;
                    } else {
                        if (this._walls[camAtX][camAtZ][0].isVisible) {
                            this._walls[camAtX][camAtZ][0].isVisible = false;
                        } else {
                            // nothing more to do
                        }
                    }
                }
            }
        }
    }

    _addBlock() {
        const camForwards = this._gm.camera.getForwards();
        const camAt = this._gm.camera.getPosition();
        camAt[0] += BLOCK_REACH_RANGE * camForwards[0];
        camAt[1] += BLOCK_REACH_RANGE * camForwards[1];
        camAt[2] += BLOCK_REACH_RANGE * camForwards[2];

        const camAtX = Math.round(camAt[0]);
        const camAtZ = Math.round(camAt[2]);

        if (camAtX >= 0 && camAtX < 32 && camAtZ >= 0 && camAtZ < 32) {
            if (this._walls[camAtX][camAtZ][0].isVisible) {
                if (this._walls[camAtX][camAtZ][1].isVisible) {
                    if (this._walls[camAtX][camAtZ][2].isVisible) {
                        if (this._walls[camAtX][camAtZ][3].isVisible) {
                            // nothing more to do
                        } else {
                            this._walls[camAtX][camAtZ][3].isVisible = true;
                        }
                    } else {
                        this._walls[camAtX][camAtZ][2].isVisible = true;
                    }
                } else {
                    this._walls[camAtX][camAtZ][1].isVisible = true;
                }
            } else {
                this._walls[camAtX][camAtZ][0].isVisible = true;
            }
        }
    }
}

function coordsToTerrainDictKey(x, z) {
    return [Math.floor(x / (TERRAIN_SIZE * TERRAIN_SCALE)), Math.floor(z / (TERRAIN_SIZE * TERRAIN_SCALE))];
}

const TERRAIN_FALLBACK_COLOR = [0, 0.5, 0, 1];

function makeTerrainChunk(keyX, keyZ, elevationGenerator) {
    const realX = keyX * TERRAIN_SIZE * TERRAIN_SCALE;
    const realZ = keyZ * TERRAIN_SIZE * TERRAIN_SCALE;

    const s = new TerrainChunk(TERRAIN_FALLBACK_COLOR, TERRAIN_SIZE, TERRAIN_SCALE, realX, realZ, elevationGenerator);
    s.matrix.translate(realX, 0, realZ);
    return s;
}
