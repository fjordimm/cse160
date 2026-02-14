import drawTriangle from "../drawTriangle.js";

export default class TerrainChunk {
    constructor(color, size, scale, offX, offZ, elevationGenerator) {
        this.matrix = new Matrix4();
        this.isVisible = true;
        this._color = color;
        this._scale = scale;

        const elevations = [];
        for (let x = 0; x < size + 1; x++) {
            elevations.push([]);
            for (let z = 0; z < size + 1; z++) {
                elevations[x].push(elevationGenerator.at(x * this._scale + offX, z * this._scale + offZ));
            }
        }
        this._elevations = elevations;
    }

    render(grm) {
        if (this.isVisible) {
            grm.gl.uniformMatrix4fv(grm.u_ModelMatrix, false, this.matrix.elements);

            grm.gl.uniform1f(grm.u_TextureWeight, 0.0);
            grm.gl.uniform4f(grm.u_FragColor, ...this._color);

            const trashUvCoords = [0, 0];

            for (let x = 0; x < this._elevations.length - 1; x++) {
                for (let z = 0; z < this._elevations[0].length - 1; z++) {
                    const yBL = this._elevations[x][z];
                    const yBR = this._elevations[x + 1][z];
                    const yTL = this._elevations[x][z + 1];
                    const yTR = this._elevations[x + 1][z + 1];

                    const colorMult = (yBL + 30) / 30;
                    grm.gl.uniform4f(grm.u_FragColor, colorMult * this._color[0], colorMult * this._color[1], colorMult * this._color[2], this._color[3]);

                    drawTriangle(grm, [
                        (x) * this._scale,     yBL, (z) * this._scale,
                        (x + 1) * this._scale, yBR, (z) * this._scale,
                        (x) * this._scale,     yTL, (z + 1) * this._scale
                    ], trashUvCoords);
                    drawTriangle(grm, [
                        (x + 1) * this._scale, yTR, (z + 1) * this._scale,
                        (x) * this._scale,     yTL, (z + 1) * this._scale,
                        (x + 1) * this._scale, yBR, (z) * this._scale
                    ], trashUvCoords);
                }
            }
        }
    }
}
