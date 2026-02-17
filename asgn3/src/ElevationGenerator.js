import { sigmoid } from "./util.js";

const FREQ_FACTOR = 2;
const AMP_FACTOR = 0.5;

const GRASS_COLOR = [0, 0.5, 0, 1];
const SNOW_COLOR = [0.91, 0.92, 0.93, 1];

export default class ElevationGenerator {
    constructor() {}

    at(x, z) {
        x -= 98549;
        z -= 232983;

        x /= 30;
        z /= 30;

        let y = 0;

        let freqFactor = 1;
        let ampFactor = 1;
        let randXOffset = 0.7;
        let randZOffset = 1.3;
        for (let i = 0; i < 5; i++) {
            y += ampFactor * (Math.sin(x * freqFactor + randXOffset) + Math.cos(z * freqFactor + randZOffset));

            freqFactor *= FREQ_FACTOR;
            ampFactor *= AMP_FACTOR;
            randXOffset *= 1.5;
            randZOffset *= 1.5;
        }

        y = Math.exp(0.6 * y);

        return 7.0 * y;
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