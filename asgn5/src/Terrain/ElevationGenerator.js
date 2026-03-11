import { bellCurve, clamp, sigmoid } from "../util.js";
import alea from "alea";
import { createNoise2D } from "simplex-noise";
import * as THREE from "three";

const SEED = "nvmcdjabjksksjdk";
const LAYERS = 15;
const FREQ_FACTOR = 1.8;
const AMP_FACTOR = 0.4;
const HORIZ_SCALE = 0.0005;
const EXP_FACTOR = 1.9;
const VERT_SCALE = 30.0;

const TREE_SEED = "aavdheu";
const TREE_LAYERS = 5;
const TREE_FREQ_FACTOR = 2;
const TREE_AMP_FACTOR = 0.5;
const TREE_HORIZ_SCALE = 0.0007;
const TREE_VERT_SCALE = 1.0;

const SNOW_SEED = "ndvkasjd";
const SNOW_LAYERS = 3;
const SNOW_FREQ_FACTOR = 2;
const SNOW_AMP_FACTOR = 0.5;
const SNOW_HORIZ_SCALE = 0.003;
const SNOW_VERT_SCALE = 1.0;

const SNOW_RAND_FACTOR = 0.6;

const STEEPNESS_CHECKING_SCALE = 0.5;
const STEEPNESS_FACTOR = 2.1;

const GRASS_COLOR = new THREE.Color(0.1, 0.7, 0.05);
const TREE_GROUND_COVER = new THREE.Color(0.22, 0.11, 0.01);
const SNOW_COLOR = new THREE.Color(1, 1, 1);
const ROCK_COLOR = new THREE.Color(0.3, 0.3, 0.3);

export default class ElevationGenerator {
    constructor() {
        {
            const al = alea(SEED);
            this.layers = [];
            for (let i = 0; i < LAYERS; i++) {
                this.layers.push(createNoise2D(alea(al())));
            }
        }

        {
            const al = alea(TREE_SEED);
            this.treeLayers = [];
            for (let i = 0; i < TREE_LAYERS; i++) {
                this.treeLayers.push(createNoise2D(alea(al())));
            }
        }

        {
            const al = alea(SNOW_SEED);
            this.snowLayers = [];
            for (let i = 0; i < SNOW_LAYERS; i++) {
                this.snowLayers.push(createNoise2D(alea(al())));
            }
        }
    }

    at(x, z) {
        x *= HORIZ_SCALE;
        z *= HORIZ_SCALE;

        let y = 0;

        let freq = 1;
        let amp = 1;
        for (let i = 0; i < LAYERS; i++) {
            y += amp * this.layers[i](freq * x, freq * z);

            freq *= FREQ_FACTOR;
            amp *= AMP_FACTOR;
        }

        y = Math.exp(EXP_FACTOR * y);

        return VERT_SCALE * y;
    }

    treeDensityAt(x, z, elevation) {
        x *= TREE_HORIZ_SCALE;
        z *= TREE_HORIZ_SCALE;

        let density = 0;

        let freq = 1;
        let amp = 1;
        for (let i = 0; i < TREE_LAYERS; i++) {
            density += amp * this.treeLayers[i](freq * x, freq * z);

            freq *= TREE_FREQ_FACTOR;
            amp *= TREE_AMP_FACTOR;
        }

        // Get rid of trees on hills/mountains
        density -= 0.015 * elevation;
        density += 0.3;

        return clamp(0, 1, TREE_VERT_SCALE * density);
    }

    colorAt(x, z, elevation) {
        let col = GRASS_COLOR.clone();

        const treeDensity = this.treeDensityAt(x, z, elevation);
        col.lerp(TREE_GROUND_COVER, clamp(0, 1, treeDensity));

        let snowAmount = -2.1 + 0.015 * elevation;
        {
            let freq = SNOW_HORIZ_SCALE;
            let amp = SNOW_VERT_SCALE * SNOW_RAND_FACTOR;
            for (let i = 0; i < SNOW_LAYERS; i++) {
                snowAmount += amp * this.snowLayers[i](freq * x, freq * z);

                freq *= SNOW_FREQ_FACTOR;
                amp *= SNOW_AMP_FACTOR;
            }
        }
        col.lerp(SNOW_COLOR, clamp(0, 1, snowAmount));

        let steepness;
        {
            const elevL = this.at(x - STEEPNESS_CHECKING_SCALE, z);
            const elevR = this.at(x + STEEPNESS_CHECKING_SCALE, z);
            const elevD = this.at(x, z - STEEPNESS_CHECKING_SCALE);
            const elevU = this.at(x, z + STEEPNESS_CHECKING_SCALE);

            const steepnessRL = 1 - bellCurve(STEEPNESS_FACTOR * (elevR - elevL));
            const steepnessUD = 1 - bellCurve(STEEPNESS_FACTOR * (elevU - elevD));

            steepness = 0.5 * (steepnessRL + steepnessUD);
        }
        col.lerp(ROCK_COLOR, clamp(0, 1, -1 + Math.exp(steepness)));

        return col.toArray();
    }
}