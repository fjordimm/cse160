import { sigmoid } from "../util.js";
import alea from "alea";
import { createNoise2D } from "simplex-noise";

const SEED = "nvmcdjabjksksjdk";
const LAYERS = 15;
const FREQ_FACTOR = 1.8;
const AMP_FACTOR = 0.4;
const HORIZ_SCALE = 0.0005;
const EXP_FACTOR = 1.9;
const VERT_SCALE = 30.0;

const GRASS_COLOR = [0, 0.5, 0, 1];
const SNOW_COLOR = [0.91, 0.92, 0.93, 1];

export default class ElevationGenerator {
    constructor() {
        const al = alea(SEED);

        this.layers = [];
        for (let i = 0; i < LAYERS; i++) {
            this.layers.push(createNoise2D(alea(al())));
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

    colorAt(y) {
        const snowWeight = sigmoid(y - 25);
        const grassWeight = 1 - snowWeight;

        const shadingWeight = (y + 30) / 75;

        return [
            shadingWeight * (GRASS_COLOR[0] * grassWeight + SNOW_COLOR[0] * snowWeight),
            shadingWeight * (GRASS_COLOR[1] * grassWeight + SNOW_COLOR[1] * snowWeight),
            shadingWeight * (GRASS_COLOR[2] * grassWeight + SNOW_COLOR[2] * snowWeight),
            1
        ];
    }
}