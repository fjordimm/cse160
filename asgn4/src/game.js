import GameManager from "./GameManager.js";
import Component from "./Component.js";
import Cube from "./shapes/Cube.js";
import Sphere from "./shapes/Sphere.js";
import Model from "./shapes/Model.js";
import { makeOx } from "./ox.js";

export function startGame() {
    const game = new Game();
    game.start();
}

export class Game {
    constructor() {
        this._gm = null;
    }

    start() {
        this._gm = new GameManager();
        this._gm.setOnInit(() => { this._init(); });
        this._gm.setOnTick((...args) => { this._tick(...args); });
        this._gm.start();
    }

    _init() {
        this._gm.camera.setY(1);
        this._gm.camera.setZ(-9);
        this._gm.camera.rotateHoriz(180);

        makeCube(5, 1, 3, COLOR_BLUE, this._gm.listOfComponents);
        makeCube(-4, 0, -1, COLOR_GREEN, this._gm.listOfComponents);
        makeCube(1, -1, -3, COLOR_RED, this._gm.listOfComponents);
        makeSphere(-1, 2, 4, COLOR_RED, this._gm.listOfComponents);
        makeSphere(4, -3, -1, COLOR_GREEN, this._gm.listOfComponents);

        const plane = new Component();
        {
            const s = new Cube(COLOR_BLUE, null, 0);
            s.matrix.scale(10, 1, 10);
            plane.addShape(s);
        }
        plane.animationMatrix.translate(0, -5, 0);
        this._gm.listOfComponents.push(plane);

        const bunny = new Component();
        {
            const s = new Model(COLOR_GREEN, "./res/objs/bunny.obj");
            bunny.addShape(s);
        }
        bunny.animationMatrix.translate(0, -4.5, 3);
        bunny.animationMatrix.rotate(180, 0, 1, 0);
        bunny.animationMatrix.scale(0.3, 0.3, 0.3);
        this._gm.listOfComponents.push(bunny);

        const ox = makeOx();
        ox.animationMatrix.translate(-3, -4, 3);
        this._gm.listOfComponents.push(ox);
    }

    _tick(deltaTime, totalTimeElapsed) {
        const camPos = this._gm.camera.getPosition();

        // Move the point light based on the sliders
        {
            const x = document.getElementById("slider-point-light-x").value;
            const y = document.getElementById("slider-point-light-y").value;
            const z = document.getElementById("slider-point-light-z").value;

            this._gm.pointLight.setPosition([-x, y, z]);
        }

        // Move the spot light based on the sliders
        {
            const x = document.getElementById("slider-spot-light-x").value;
            const y = document.getElementById("slider-spot-light-y").value;
            const z = document.getElementById("slider-spot-light-z").value;
            const horiz = document.getElementById("slider-spot-light-horiz").value;
            const vert = document.getElementById("slider-spot-light-vert").value;

            this._gm.spotLight.setPosition([-x, y, z]);
            this._gm.spotLight.setRotation(vert, horiz);
        }
    }
}

const COLOR_RED = [1, 0, 0, 1];
const COLOR_GREEN = [0, 0.6, 0, 1];
const COLOR_BLUE = [0.2, 0.3, 1, 1];

function makeCube(x, y, z, color, listOfComponents) {
    const cube = new Component();
    {
        const s = new Cube(color, null, 0);
        cube.addShape(s);
    }
    cube.animationMatrix.translate(x, y, z);
    listOfComponents.push(cube);
}

function makeSphere(x, y, z, color, listOfComponents) {
    const sphere = new Component();
    {
        const s = new Sphere(color, 8);
        sphere.addShape(s);
    }
    sphere.animationMatrix.translate(x, y, z);
    listOfComponents.push(sphere);
}
