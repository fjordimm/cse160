import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

const STARTING_LENGTH = 5;

export default class TreeManager {
    constructor(loader) {
        this.currentLength = 0;
        this.positions = [];

        this.geometryLeaf = new THREE.ConeGeometry(3.1, 8.5, 12);
        this.materialLeaf = new THREE.MeshPhongMaterial({ color: 0x107030 });
        this.geometryTrunk = new THREE.CylinderGeometry(0.9, 0.9, 15.0, 12);
        this.materialTrunk = new THREE.MeshPhongMaterial({ color: 0x604030 });

        this.instancedMeshLeaf1 = null;
        this.instancedMeshLeaf2 = null;
        this.instancedMeshTrunk = null;

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

            this.instancedMeshLeaf1 = new THREE.InstancedMesh(this.geometryLeaf, this.materialLeaf, this.currentLength);
            scene.add(this.instancedMeshLeaf1);
            this.instancedMeshLeaf2 = new THREE.InstancedMesh(this.geometryLeaf, this.materialLeaf, this.currentLength);
            scene.add(this.instancedMeshLeaf2);
            this.instancedMeshTrunk = new THREE.InstancedMesh(this.geometryTrunk, this.materialTrunk, this.currentLength);
            scene.add(this.instancedMeshTrunk);
        }

        const dummy = new THREE.Object3D();
        for (let i = 0; i < this.currentLength; i++) {
            if (i >= this.positions.length) {
                dummy.scale.setScalar(0);
                dummy.updateMatrix();
                this.instancedMeshLeaf1.setMatrixAt(i, dummy.matrix);
                this.instancedMeshLeaf2.setMatrixAt(i, dummy.matrix);
                this.instancedMeshTrunk.setMatrixAt(i, dummy.matrix);
            } else {
                const pos = this.positions[i];

                dummy.position.set(pos.x, pos.y + 14.0, pos.z);
                dummy.scale.setScalar(1);
                dummy.updateMatrix();
                this.instancedMeshLeaf1.setMatrixAt(i, dummy.matrix);

                dummy.position.set(pos.x, pos.y + 10.0, pos.z);
                dummy.scale.setScalar(1);
                dummy.updateMatrix();
                this.instancedMeshLeaf2.setMatrixAt(i, dummy.matrix);

                dummy.position.set(pos.x, pos.y + 7.5, pos.z);
                dummy.scale.setScalar(1);
                dummy.updateMatrix();
                this.instancedMeshTrunk.setMatrixAt(i, dummy.matrix);
            }
        }
    }
}

// TODO: optimize updateStuff
