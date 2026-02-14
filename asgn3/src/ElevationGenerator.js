const FREQ_FACTOR = 2;
const AMP_FACTOR = 0.5;

export default class ElevationGenerator {
    constructor() {}

    at(x, z) {
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
}