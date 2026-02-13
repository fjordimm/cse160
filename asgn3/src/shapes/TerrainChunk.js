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
    }

    render(grm) {
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

                // Calculate normal vector and use its y component for shading
                {
                    const rightX = 1;
                    const rightY = yBR - yBL;
                    const rightZ = 0;
                    const forwardsX = 0;
                    const forwardsY = yTL - yBL;
                    const forwardsZ = 1;

                    let crossX = rightY * forwardsZ - rightZ * forwardsY;
                    let crossY = rightX * forwardsZ - rightZ * forwardsX;
                    let crossZ = rightX * forwardsY - rightY * forwardsX;
                    const crossMagnitude = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);
                    crossX /= crossMagnitude;
                    crossY /= crossMagnitude;
                    crossZ /= crossMagnitude;

                    const newColor = [...this._color];
                    newColor[1] *= 0.5 * (crossY + 1);

                    grm.gl.uniform4f(grm.u_FragColor, ...newColor);
                }

                drawTriangle(grm, [
                    x, yBL, z,
                    x + 1, yBR, z,
                    x, yTL, z + 1
                ], trashUvCoords);
                drawTriangle(grm, [
                    x + 1, yTR, z + 1,
                    x, yTL, z + 1,
                    x + 1, yBR, z
                ], trashUvCoords);
            }
        }
    }
}
