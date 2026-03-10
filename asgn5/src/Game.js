import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import GUI from "lil-gui";
import makeTerrainGeometry from "./Terrain/makeTerrainGeometry.js";
import ElevationGenerator from "./Terrain/ElevationGenerator.js";
import TreeManager from "./Trees/TreeManager.js";
import Stats from "stats";
import TerrainManager from "./Terrain/TerrainManager.js";

const CAMERA_LOOK_SPEED = 2.1;
const CAMERA_MOVE_SPEED = 10;

const VEC_UP = new THREE.Vector3(0, 1, 0);

const _rvForwards = new THREE.Vector3();
const _rvRight = new THREE.Vector3();
const _rvMovement = new THREE.Vector3();

export default class Game {
    constructor(canvas) {
        this.stats = null;
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        this.loader = new THREE.TextureLoader();
        this.camera = new THREE.PerspectiveCamera(60, 1, 0.5, 5000);
        this.cameraMovementSpeed = CAMERA_MOVE_SPEED;
        this.scene = new THREE.Scene();
        this.gui = new GUI();
        this.objects = {};
        this.controls = null;
        this.keysDown = {};

        this.elevationGenerator = null;
        this.terrainManager = null;
    }

    start() {
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        document.addEventListener("keydown", (e) => {
            this.keysDown[e.code] = true;
        });
        document.addEventListener("keyup", (e) => {
            this.keysDown[e.code] = false;
        });

        this.onInit();

        let didFirstFrame = false;
        let prevElapsedTime = undefined;
        let frameCount = 0;

        const render = (elapsedTime) => {
            this.stats.begin();

            elapsedTime *= 0.001;

            if (didFirstFrame) {
                this.updateCanvasSizeIfNecessary();
                this.onTick(elapsedTime - prevElapsedTime, elapsedTime, frameCount);
                this.renderer.render(this.scene, this.camera);
            } else {
                didFirstFrame = true;
            }

            frameCount++;
            prevElapsedTime = elapsedTime;

            this.stats.end();

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }

    onInit() {
        const guiInstructions = this.gui.addFolder("Instructions");
        guiInstructions.add({ "Camera Control": "Click anywhere" }, "Camera Control");
        guiInstructions.add({ "Movement": "WASD/Space/Shift" }, "Movement");
        guiInstructions.add({ "Change Speed": "Scroll" }, "Change Speed");

        this.controls = new PointerLockControls(this.camera, document.body);
        this.controls.pointerSpeed = CAMERA_LOOK_SPEED;
        document.addEventListener("click", () => {
            this.controls.lock();
        });

        document.addEventListener("wheel", (e) => {
            this.cameraMovementSpeed += -e.deltaY * 0.025;

            if (this.cameraMovementSpeed <= 2.5) {
                this.cameraMovementSpeed = 2.5;
            }
        });

        this.objects.mainLight = new THREE.DirectionalLight(0xFFFFFF, 3);
        this.objects.mainLight.position.set(0.9, 1, -1.6);
        this.scene.add(this.objects.mainLight);

        this.objects.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
        this.scene.add(this.objects.ambientLight);

        this.camera.position.z = 5;

        this.objects.cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshPhongMaterial({ color: 0x0000FF })
        );
        this.scene.add(this.objects.cube);

        this.objects.ball = new THREE.Mesh(
            new THREE.SphereGeometry(0.5),
            new THREE.MeshPhongMaterial({ color: 0xFF0000 })
        );
        this.objects.ball.position.set(4, 0, 0);
        this.scene.add(this.objects.ball);

        const texture = new THREE.CubeTextureLoader().load([
            "../res/images/sky.jpg",
            "../res/images/sky.jpg",
            "../res/images/sky.jpg",
            "../res/images/sky.jpg",
            "../res/images/sky.jpg",
            "../res/images/sky.jpg"
        ]);
        this.scene.background = texture;

        // const um = new TreeManager(this.loader);
        // const range = 100;
        // const halfRange = range * 0.5;
        // for (let i = 0; i < 50; i++) {
        //     um.addTree(new THREE.Vector3(Math.random() * range - halfRange, 0, Math.random() * range - halfRange), this.scene);
        // }

        this.elevationGenerator = new ElevationGenerator();
        this.terrainManager = new TerrainManager(this.elevationGenerator, this.loader);
    }

    onTick(deltaTime, elapsedTime, frameCount) {
        this.controls.update(deltaTime);
        this.doCameraMovement(deltaTime, elapsedTime);

        if (frameCount % 15 === 0) {
            this.terrainManager.update(this.camera.position.x, this.camera.position.z, this.scene);
        }
    }

    updateCanvasSizeIfNecessary() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        const needResize = this.canvas.width !== width || this.canvas.height !== height;
        if (needResize) {
            this.renderer.setSize(width, height, false);
            this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 0.25));
        }
    }

    doCameraMovement(deltaTime, elapsedTime) {
        this.controls.getDirection(_rvForwards);
        _rvForwards.setY(0);
        _rvForwards.normalize();

        _rvRight.crossVectors(_rvForwards, VEC_UP);

        _rvMovement.set(0, 0, 0);
        if (this.keysDown.KeyW) {
            _rvMovement.addScaledVector(_rvForwards, 1);
        }
        if (this.keysDown.KeyS) {
            _rvMovement.addScaledVector(_rvForwards, -1);
        }
        if (this.keysDown.KeyD) {
            _rvMovement.addScaledVector(_rvRight, 1);
        }
        if (this.keysDown.KeyA) {
            _rvMovement.addScaledVector(_rvRight, -1);
        }

        _rvMovement.normalize();

        if (this.keysDown.Space) {
            _rvMovement.addScaledVector(VEC_UP, 1);
        }
        if (this.keysDown.ShiftLeft) {
            _rvMovement.addScaledVector(VEC_UP, -1);
        }

        _rvMovement.multiplyScalar(deltaTime * this.cameraMovementSpeed);

        this.camera.position.add(_rvMovement);
    }
}
