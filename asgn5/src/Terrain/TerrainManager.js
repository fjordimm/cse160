import * as THREE from "three";
import { PermLambdaDefaultDict } from "../util.js";
import ElevationGenerator from "./ElevationGenerator.js";
import makeTerrainGeometry from "./makeTerrainGeometry.js";

export default class TerrainManager {
    constructor(elevationGenerator, loader) {
        this.chunkSize = 8;
        this.chunkScale = 5;
        this.chunkScaleSize = this.chunkSize * this.chunkScale;
        this.uvScale = 0.025;
        this.renderDist = 0;

        this.chunkLookup = new PermLambdaDefaultDict(() => new PermLambdaDefaultDict(() => undefined));
        this.elevationGenerator = elevationGenerator;

        this.grassTex = loader.load("../res/images/grass.png");
        this.grassTex.colorSpace = THREE.SRGBColorSpace;
        this.grassTex.magFilter = THREE.LinearFilter;
        this.grassTex.wrapS = THREE.RepeatWrapping;
        this.grassTex.wrapT = THREE.RepeatWrapping;
    }

    update(x, z, scene) {
        const xi = Math.round(x / (this.chunkScaleSize));
        const zi = Math.round(z / (this.chunkScaleSize));

        for (let c = xi - this.renderDist; c <= xi + this.renderDist; c++) {
            for (let r = zi - this.renderDist; r <= zi + this.renderDist; r++) {
                if (this.chunkLookup[c][r] === undefined) {
                    this.chunkLookup[c][r] = this.makeChunk(c * this.chunkScaleSize, r * this.chunkScaleSize, scene);
                }
            }
        }
    }

    makeChunk(x, z, scene) {
        const chunk = new THREE.Mesh(
            makeTerrainGeometry(this.chunkSize, this.chunkScale, x, z, this.uvScale, this.elevationGenerator),
            new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: this.grassTex })
        );
        chunk.position.set(x, 0, z);
        scene.add(chunk);
    }
}