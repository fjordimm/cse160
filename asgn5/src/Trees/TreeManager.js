import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

const STARTING_LENGTH = 10;
// TODO: optimize by adding this as a constructor argument

const _dummy = new THREE.Object3D();

export default class TreeManager {
    constructor(scene) {
        this.scene = scene;

        this.currentLength = 0;
        this.positions = [];

        this.geometryLeaf = new THREE.ConeGeometry(3.1, 8.5, 12);
        this.materialLeaf = new THREE.MeshPhongMaterial({ color: 0x107030 });
        this.geometryTrunk = new THREE.CylinderGeometry(0.9, 0.9, 15.0, 12);
        this.materialTrunk = new THREE.MeshPhongMaterial({ color: 0x604030 });

        this.parent = new THREE.Object3D();
        this.scene.add(this.parent);
        this.instancedMeshLeaf1 = null;
        this.instancedMeshLeaf2 = null;
        this.instancedMeshTrunk = null;
    }

    addTree(position, scene) {
        this.positions.push(position);
        this.updateStuff(scene);
    }

    updateStuff() {
        if (this.positions.length > this.currentLength) {
            if (this.currentLength <= 0) {
                this.currentLength = Math.max(STARTING_LENGTH, this.positions.length);
            } else {
                this.currentLength *= 2;
            }

            if (this.instancedMeshLeaf1) { this.parent.remove(this.instancedMeshLeaf1); }
            if (this.instancedMeshLeaf2) { this.parent.remove(this.instancedMeshLeaf2); }
            if (this.instancedMeshTrunk) { this.parent.remove(this.instancedMeshTrunk); }

            this.instancedMeshLeaf1 = new THREE.InstancedMesh(this.geometryLeaf, this.materialLeaf, this.currentLength);
            this.parent.add(this.instancedMeshLeaf1);
            this.instancedMeshLeaf2 = new THREE.InstancedMesh(this.geometryLeaf, this.materialLeaf, this.currentLength);
            this.parent.add(this.instancedMeshLeaf2);
            this.instancedMeshTrunk = new THREE.InstancedMesh(this.geometryTrunk, this.materialTrunk, this.currentLength);
            this.parent.add(this.instancedMeshTrunk);
        }

        for (let i = 0; i < this.currentLength; i++) {
            if (i >= this.positions.length) {
                _dummy.scale.setScalar(0);
                _dummy.updateMatrix();
                this.instancedMeshLeaf1.setMatrixAt(i, _dummy.matrix);
                this.instancedMeshLeaf1.instanceMatrix.needsUpdate = true;
                this.instancedMeshLeaf2.setMatrixAt(i, _dummy.matrix);
                this.instancedMeshLeaf2.instanceMatrix.needsUpdate = true;
                this.instancedMeshTrunk.setMatrixAt(i, _dummy.matrix);
                this.instancedMeshTrunk.instanceMatrix.needsUpdate = true;
            } else {
                const pos = this.positions[i];

                _dummy.position.set(pos.x, pos.y + 14.0, pos.z);
                _dummy.scale.setScalar(1);
                _dummy.updateMatrix();
                this.instancedMeshLeaf1.setMatrixAt(i, _dummy.matrix);
                this.instancedMeshLeaf1.instanceMatrix.needsUpdate = true;

                _dummy.position.set(pos.x, pos.y + 10.0, pos.z);
                _dummy.scale.setScalar(1);
                _dummy.updateMatrix();
                this.instancedMeshLeaf2.setMatrixAt(i, _dummy.matrix);
                this.instancedMeshLeaf2.instanceMatrix.needsUpdate = true;

                _dummy.position.set(pos.x, pos.y + 7.5, pos.z);
                _dummy.scale.setScalar(1);
                _dummy.updateMatrix();
                this.instancedMeshTrunk.setMatrixAt(i, _dummy.matrix);
                this.instancedMeshTrunk.instanceMatrix.needsUpdate = true;
            }
        }
    }
}
