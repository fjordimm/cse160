import * as THREE from "three";

export default class TreeManager {
    constructor(scene, loader) {
        this.instancedMesh = new THREE.InstancedMesh(
            new THREE.ConeGeometry(),
            new THREE.MeshPhongMaterial({ color: 0x0000FF }),
            5
        );

        const dummy = new THREE.Object3D();
        for (let i = 0; i < this.instancedMesh.count; i++) {
            dummy.position.set(Math.random() * 10 - 5, 0, Math.random() * 10 - 5);

            dummy.updateMatrix();
            this.instancedMesh.setMatrixAt(i, dummy.matrix);
        }

        scene.add(this.instancedMesh);
    }
}