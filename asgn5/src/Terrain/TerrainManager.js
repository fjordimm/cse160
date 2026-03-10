import * as THREE from "three";
import { PermLambdaDefaultDict } from "../util.js";
import ElevationGenerator from "./ElevationGenerator.js";
import makeTerrainGeometry from "./makeTerrainGeometry.js";

export default class TerrainManager {
    constructor(elevationGenerator, loader) {
        this.chunkSize = 16;
        this.chunkScale = 10;
        this.chunkScaleSize = this.chunkSize * this.chunkScale;
        this.uvScale = 0.025;
        this.renderDist = 15;

        this.chunkLookup = new PermLambdaDefaultDict(() => new PermLambdaDefaultDict(() => undefined));
        this.chunkList = [];
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
                const cR = c * this.chunkScaleSize - 0.5 * this.chunkScaleSize;
                const rR = r * this.chunkScaleSize - 0.5 * this.chunkScaleSize;

                if (this.chunkLookup[c][r] === undefined) {
                    const chunk = this.makeChunk(cR, rR, scene);
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
            } else {
                chunk.visible = false;
            }
        }
    }

    makeChunk(x, z, scene) {
        const chunk = new THREE.Mesh(
            makeTerrainGeometry(this.chunkSize, this.chunkScale, x, z, this.uvScale, this.elevationGenerator),
            new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: this.grassTex })
        );
        chunk.position.set(x, 0, z);
        chunk.static = true;

        scene.add(chunk);

        return chunk;
    }
}