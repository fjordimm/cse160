export default class ElevationGenerator {
    constructor() {}

    at(x, z) {
        x /= 2;
        z /= 2;

        let y = 0;

        y += Math.sin(x) + Math.cos(z);

        return 0.8 * y;
    }
}