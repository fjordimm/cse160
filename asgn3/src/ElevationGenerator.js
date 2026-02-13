export default class ElevationGenerator {
    constructor() {}

    at(x, z) {
        return 3 * Math.sin(x * 0.1);
    }
}