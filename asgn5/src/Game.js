import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import GUI from "lil-gui";
import ElevationGenerator from "./Terrain/ElevationGenerator.js";
import TreeManager from "./Trees/TreeManager.js";
import Stats from "stats";
import TerrainManager from "./Terrain/TerrainManager.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

const CAMERA_LOOK_SPEED = 2.1;
const CAMERA_MOVE_SPEED = 100;
const CAMERA_MOVE_SPEED_DELTA = 25;

const RESOLUTION = 0.5;
const FOG_DISTANCE_FACTOR = 80;
const RENDER_DIST = 15;
const TREES_PER_CHUNK = 10; // Or rather, the square root of trees per chunk

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

        this.fogFactor = FOG_DISTANCE_FACTOR;
        this.guiInfo = null;
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
        this.controls = new PointerLockControls(this.camera, document.body);
        this.controls.pointerSpeed = CAMERA_LOOK_SPEED;
        document.addEventListener("click", () => {
            this.controls.lock();
        });

        document.addEventListener("wheel", (e) => {
            this.cameraMovementSpeed += -e.deltaY * 0.01 * CAMERA_MOVE_SPEED_DELTA;

            if (this.cameraMovementSpeed <= CAMERA_MOVE_SPEED_DELTA) {
                this.cameraMovementSpeed = CAMERA_MOVE_SPEED_DELTA;
            }
        });

        this.objects.mainLight = new THREE.DirectionalLight(0xFFFFFF, 3);
        this.objects.mainLight.position.set(0.9, 1, 1.6);
        this.scene.add(this.objects.mainLight);

        this.objects.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
        this.scene.add(this.objects.ambientLight);

        const texture = new THREE.CubeTextureLoader().load([
            "./res/images/px.png",
            "./res/images/nx.png",
            "./res/images/py.png",
            "./res/images/ny.png",
            "./res/images/pz.png",
            "./res/images/nz.png"
        ]);
        this.scene.background = texture;

        this.elevationGenerator = new ElevationGenerator();
        this.terrainManager = new TerrainManager(this.elevationGenerator, this.loader, this.scene, RENDER_DIST, TREES_PER_CHUNK);

        this.scene.fog = new THREE.FogExp2(0x70D8FF, 0);
        this.updateFogDensity();

        this.camera.position.y = this.elevationGenerator.at(0, 0) + 1.5;

        // Streetlamp
        {
            this.objects.streetlamp = new THREE.Object3D();
            this.scene.add(this.objects.streetlamp);

            this.objects.streetlamp.position.x = 15;
            this.objects.streetlamp.position.z = -80;
            this.objects.streetlamp.position.y = -0.9 + this.elevationGenerator.at(this.objects.streetlamp.position.x, this.objects.streetlamp.position.z);

            // Pole
            {
                const s = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.5, 0.5, 20, 12),
                    new THREE.MeshPhongMaterial({ color: 0x707070, specular: 0x909090, shininess: 45.0 })
                );
                s.position.y = 10;
                this.objects.streetlamp.add(s);
            }
            // Curved top part
            {
                const s = new THREE.Mesh(
                    new THREE.TorusGeometry(2, 0.5, 12, 12, Math.PI),
                    new THREE.MeshPhongMaterial({ color: 0x707070, specular: 0x909090, shininess: 45.0 })
                );
                s.position.y = 20;
                s.position.x = 2;
                this.objects.streetlamp.add(s);
            }
            // Lamp part
            {
                const s = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.5, 1.5, 1, 12),
                    new THREE.MeshPhongMaterial({ color: 0x707070, specular: 0x909090, shininess: 45.0 })
                );
                s.position.y = 19.5;
                s.position.x = 4;
                this.objects.streetlamp.add(s);
            }
            // Lit up part
            {
                const s = new THREE.Mesh(
                    new THREE.CylinderGeometry(1.3, 1.3, 0.2, 12),
                    new THREE.MeshBasicMaterial({ color: 0xFF2020 })
                );
                s.position.y = 18.9;
                s.position.x = 4;
                this.objects.streetlamp.add(s);
            }
            // Actual light
            {
                const s = new THREE.SpotLight(0xFF0000, 15, 30, 1.3, 0.5, 0);
                s.position.y = 18.9;
                s.position.x = 4;
                const target = new THREE.Object3D();
                target.position.y = 17.9;
                target.position.x = 4;
                this.objects.streetlamp.add(target);
                s.target = target;
                this.objects.streetlamp.add(s);
            }
        }

        // Skull
        {
            const objLoader = new OBJLoader();
            const mtlLoader = new MTLLoader();
            mtlLoader.load("./res/skull/12140_Skull_v3_L2.mtl", (mtl) => {
                mtl.preload();
                objLoader.setMaterials(mtl);
                objLoader.load("./res/skull/12140_Skull_v3_L2.obj", (obj) => {
                    this.scene.add(obj);

                    obj.rotateX(-0.5 * Math.PI);
                    obj.scale.setScalar(0.2);
                    obj.position.x = 24;
                    obj.position.z = -70;
                    obj.position.y = 0.1 + this.elevationGenerator.at(obj.position.x, obj.position.z);
                });
            });
        }

        const _this_ = this;
        const guiInstructions = this.gui.addFolder("Instructions");
        guiInstructions.add({ "Camera Control": "Click anywhere" }, "Camera Control");
        guiInstructions.add({ "Movement": "WASD/Space/Shift" }, "Movement");
        guiInstructions.add({ "Change Speed": "Scroll" }, "Change Speed");
        const guiInfo = this.gui.addFolder("Info");
        guiInfo.add({
            set pos(val) { },
            get pos() {
                const p = _this_.camera.position;
                return `${p.x.toFixed(1)}, ${p.y.toFixed(1)}, ${p.z.toFixed(1)}`;
            }
        }, "pos").name("Camera Position");
        this.guiInfo = guiInfo;
        const guiPerformance = this.gui.addFolder("Performance");
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, RESOLUTION));
        guiPerformance.add({
            set resolution(val) {
                _this_.renderer.setPixelRatio(Math.min(window.devicePixelRatio, val));
            },
            get resolution() {
                return _this_.renderer.getPixelRatio();
            }
        }, "resolution", 0.1, 1, 0.05).name("Resolution");
        guiPerformance.add({
            set renderDist(val) {
                _this_.terrainManager.renderDist = val;
                _this_.updateFogDensity();
            },
            get renderDist() {
                return _this_.terrainManager.renderDist;
            }
        }, "renderDist", 0, 25, 1).name("Render Distance");
        const guiOther = this.gui.addFolder("Other");
        guiOther.add({
            set fogFactor(val) {
                _this_.fogFactor = val;
                _this_.updateFogDensity();
            },
            get fogFactor() {
                return _this_.fogFactor;
            }
        }, "fogFactor", 1, 300, 1).name("Fog Factor");
    }

    onTick(deltaTime, elapsedTime, frameCount) {
        this.controls.update(deltaTime);
        this.doCameraMovement(deltaTime, elapsedTime);

        this.guiInfo.controllers[0].setValue(null);

        if (frameCount % 15 === 0) {
            this.terrainManager.update(this.camera.position.x, this.camera.position.z);
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

    updateFogDensity() {
        this.scene.fog.density = 1 / (this.fogFactor + this.fogFactor * this.terrainManager.renderDist);
    }
}
