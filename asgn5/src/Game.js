import * as THREE from "three";

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        this.camera = new THREE.PerspectiveCamera(60, 2, 0.1, 5);
        this.scene = new THREE.Scene();
    }

    start() {
        this.onInit();

        let didFirstFrame = false;
        let prevElapsedTime = undefined;

        const render = (elapsedTime) => {
            elapsedTime *= 0.001;

            if (didFirstFrame) {
                this.onTick(elapsedTime - prevElapsedTime, elapsedTime);
                this.renderer.render(this.scene, this.camera);
            } else {
                didFirstFrame = true;
            }

            prevElapsedTime = elapsedTime;

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }

    onInit() {
        this.camera.position.z = 2;

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    onTick(deltaTime, elapsedTime) {
        // console.log(deltaTime, elapsedTime);
        this.cube.rotation.x = elapsedTime;
        this.cube.rotation.y = elapsedTime;
    }
}