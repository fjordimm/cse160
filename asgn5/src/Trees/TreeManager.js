import * as THREE from "three";

const STARTING_LENGTH = 5;

export default class TreeManager {
    constructor(loader) {
        this.currentLength = 0;
        this.positions = [];

        this.geometryLeaf = new THREE.ConeGeometry(0.3, 1, 8);
        this.materialLeaf = new THREE.MeshPhongMaterial({ color: 0x00FF00 });

        // this.instancedMesh = new THREE.InstancedMesh(
        //     new THREE.ConeGeometry(),
        //     new THREE.MeshPhongMaterial({ color: 0x0000FF }),
        //     0
        // );

        // const dummy = new THREE.Object3D();
        // for (let i = 0; i < this.instancedMesh.count; i++) {
        //     dummy.position.set(Math.random() * 10 - 5, 0, Math.random() * 10 - 5);

        //     if (i < 3) {
        //         dummy.scale.setScalar(0.1);
        //     } else {
        //         dummy.scale.setScalar(1);
        //     }

        //     dummy.updateMatrix();
        //     this.instancedMesh.setMatrixAt(i, dummy.matrix);
        // }

        // dummy.position.set(0, 15, 0);
        // dummy.scale.setScalar(1);
        // dummy.updateMatrix();
        // this.instancedMesh.setMatrixAt(5, dummy.matrix);

        // scene.add(this.instancedMesh);
    }

    addTree(position, scene) {
        this.positions.push(position);
        this.updateStuff(scene);
    }

    updateStuff(scene) {
        if (this.positions.length > this.currentLength) {
            if (this.currentLength <= 0) {
                this.currentLength = Math.max(STARTING_LENGTH, this.positions.length);
            } else {
                this.currentLength *= 2;
            }

            this.instancedMeshLeaf = new THREE.InstancedMesh(this.geometryLeaf, this.materialLeaf, this.currentLength);
            scene.add(this.instancedMeshLeaf);
        }

        const dummy = new THREE.Object3D();
        for (let i = 0; i < this.currentLength; i++) {
            if (i >= this.positions.length) {
                dummy.scale.setScalar(0);
            } else {
                const pos = this.positions[i];

                dummy.position.set(pos.x, pos.y, pos.z);
                dummy.scale.setScalar(1);
            }

            dummy.updateMatrix();
            this.instancedMeshLeaf.setMatrixAt(i, dummy.matrix);
        }
    }
}

// TODO: optimize updateStuff
