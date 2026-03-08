import * as THREE from "three";

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        this.camera = new THREE.PerspectiveCamera(60, 2, 0.1, 5);
        this.scene = new THREE.Scene();

        this.objects = {};
    }

    start() {
        this.onInit();

        let didFirstFrame = false;
        let prevElapsedTime = undefined;

        const render = (elapsedTime) => {
            elapsedTime *= 0.001;

            if (didFirstFrame) {
                this.updateCanvasSizeIfNecessary();
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

        this.objects.cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshPhongMaterial({ color: 0x44aa88 })
        );
        this.scene.add(this.objects.cube);

        this.objects.mainLight = new THREE.DirectionalLight(0xFFFFFF, 3);
        this.objects.mainLight.position.set(-1, 2, 4);
        this.scene.add(this.objects.mainLight);
    }

    onTick(deltaTime, elapsedTime) {
        // console.log(deltaTime, elapsedTime);
        this.objects.cube.rotation.x = elapsedTime;
        this.objects.cube.rotation.y = elapsedTime;
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
}