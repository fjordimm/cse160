export default class ElevationGenerator {
    constructor() {}

    at(x, z) {
        x /= 4;
        z /= 4;

        let y = 0;

        y += (Math.sin(x + 3.12) + Math.sin(z + 0.93));
        y += 0.5 * (Math.sin(x * 2 + 2.94) + Math.sin(z * 2 + 1.83));
        y += 0.25 * (Math.sin(x * 4 + 0.15) + Math.sin(z * 4 + 3.11));

        return 2.3 * y;
    }
}