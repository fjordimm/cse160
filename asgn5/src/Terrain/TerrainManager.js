import * as THREE from "three";
import { PermLambdaDefaultDict, randBernoulli } from "../util.js";
import ElevationGenerator from "./ElevationGenerator.js";
import makeTerrainGeometry from "./makeTerrainGeometry.js";
import TreeManager from "../Trees/TreeManager.js";

const TREE_SINK_LEVEL = -0.9;
const TREE_RANDOM_SHIFT = 0.75;

export default class TerrainManager {
    constructor(elevationGenerator, loader, scene, renderDist, treeSpacing) {
        this.chunkSize = 16;
        this.chunkScale = 10;
        this.chunkScaleSize = this.chunkSize * this.chunkScale;
        this.uvScale = 0.025;
        this.renderDist = renderDist;

        this.chunkLookup = new PermLambdaDefaultDict(() => new PermLambdaDefaultDict(() => undefined));
        this.chunkList = [];
        this.elevationGenerator = elevationGenerator;
        this.scene = scene;

        this.grassTex = loader.load("./res/images/grass.png");
        this.grassTex.colorSpace = THREE.SRGBColorSpace;
        this.grassTex.magFilter = THREE.LinearFilter;
        this.grassTex.wrapS = THREE.RepeatWrapping;
        this.grassTex.wrapT = THREE.RepeatWrapping;

        this.treeSpacing = treeSpacing;
    }

    update(x, z) {
        const xi = Math.round(x / (this.chunkScaleSize));
        const zi = Math.round(z / (this.chunkScaleSize));

        for (let c = xi - this.renderDist; c <= xi + this.renderDist; c++) {
            for (let r = zi - this.renderDist; r <= zi + this.renderDist; r++) {
                const cR = c * this.chunkScaleSize - 0.5 * this.chunkScaleSize;
                const rR = r * this.chunkScaleSize - 0.5 * this.chunkScaleSize;

                if (this.chunkLookup[c][r] === undefined) {
                    const chunk = this.makeChunk(cR, rR);
                    this.chunkLookup[c][r] = chunk;
                    this.chunkList.push(chunk);
                }
            }
        }

        for (const chunk of this.chunkList) {
            const xA = chunk.position.x + 0.5 * this.chunkScaleSize;
            const zA = chunk.position.z + 0.5 * this.chunkScaleSize;
            const distToCam = Math.sqrt((x - xA) ** 2 + (z - zA) ** 2);

            if (distToCam <= (1 + this.renderDist) * this.chunkScaleSize) {
                chunk.visible = true;
                chunk.userData.treeManager.parent.visible = true;
            } else {
                chunk.visible = false;
                chunk.userData.treeManager.parent.visible = false;
            }
        }
    }

    makeChunk(x, z) {
        const chunk = new THREE.Mesh(
            makeTerrainGeometry(this.chunkSize, this.chunkScale, x, z, this.uvScale, this.elevationGenerator),
            new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: this.grassTex })
        );
        chunk.position.set(x, 0, z);
        chunk.static = true;

        this.scene.add(chunk);

        chunk.userData.treeManager = new TreeManager(this.scene);
        const treeSpace = this.chunkScaleSize / this.treeSpacing;
        for (let c = 0; c < this.treeSpacing; c++) {
            for (let r = 0; r < this.treeSpacing; r++) {
                const treeX = x + (c + Math.random() * TREE_RANDOM_SHIFT - 0.5 * TREE_RANDOM_SHIFT) * treeSpace;
                const treeZ = z + (r + Math.random() * TREE_RANDOM_SHIFT - 0.5 * TREE_RANDOM_SHIFT) * treeSpace;
                const elev = this.elevationGenerator.at(treeX, treeZ);

                if (randBernoulli(this.elevationGenerator.treeDensityAt(treeX, treeZ, elev))) {
                    const treeY = TREE_SINK_LEVEL + elev;
                    chunk.userData.treeManager.addTree(new THREE.Vector3(treeX, treeY, treeZ), this.scene);
                }
            }
        }

        return chunk;
    }
}