import drawTriangle from "../drawTriangle.js";

export default class TerrainChunk {
    constructor(color, size, elevationGenerator) {
        this.matrix = new Matrix4();
        this._color = color;

        const elevations = [];
        for (let x = 0; x < size + 1; x++) {
            elevations.push([]);
            for (let z = 0; z < size + 1; z++) {
                elevations[x].push(elevationGenerator.at(x, z));
            }
        }
        this._elevations = elevations;

        console.log(elevations);
    }

    render(grm) {
        grm.gl.uniformMatrix4fv(grm.u_ModelMatrix, false, this.matrix.elements);

        grm.gl.uniform1f(grm.u_TextureWeight, 0.0);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color);

        const trashUvCoords = [0, 0];

        for (let x = 0; x < this._elevations.length; x++) {
            for (let z = 0; z < this._elevations[0].length; z++) {
                const y = this._elevations[x][z];

                drawTriangle(grm, [
                    x,     y, z,
                    x + 1, y, z,
                    x,     y, z + 1
                ], trashUvCoords);
                drawTriangle(grm, [
                    x + 1, y, z + 1,
                    x,     y, z + 1,
                    x + 1, y, z
                ], trashUvCoords);
            }
        }
        // drawTriangle(grm, [-0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5], trashUvCoords);
        // drawTriangle(grm, [0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5], trashUvCoords);
        // drawTriangle(grm, [-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5], trashUvCoords);
        // drawTriangle(grm, [0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5], trashUvCoords);
        // drawTriangle(grm, [0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5], trashUvCoords);
        // drawTriangle(grm, [0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5], trashUvCoords);
        // drawTriangle(grm, [0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5], trashUvCoords);
        // drawTriangle(grm, [-0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5], trashUvCoords);
        // drawTriangle(grm, [-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5], trashUvCoords);
        // drawTriangle(grm, [-0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5], trashUvCoords);
        // drawTriangle(grm, [-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5], trashUvCoords);
        // drawTriangle(grm, [0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5], trashUvCoords);
    }
}
