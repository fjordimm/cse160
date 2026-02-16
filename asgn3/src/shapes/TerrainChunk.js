import drawTriangle from "../drawTriangle.js";

const TRASH_UV_COORDS = new Float32Array([0, 0]);
const _reusableTriArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);

export default class TerrainChunk {
    constructor(color, size, scale, offX, offZ, elevationGenerator) {
        this.matrix = new Matrix4();
        this.isVisible = true;
        this._color = color;
        this._scale = scale;

        const elevations = [];
        const colors = [];
        for (let x = 0; x < size + 1; x++) {
            elevations.push([]);
            colors.push([]);
            for (let z = 0; z < size + 1; z++) {
                const y = elevationGenerator.at(x * this._scale + offX, z * this._scale + offZ);
                elevations[x].push(y);
                colors[x].push(elevationGenerator.colorAt(y));
            }
        }
        this._elevations = elevations;
        this._colors = colors;
    }

    render(grm) {
        if (this.isVisible) {
            grm.gl.uniformMatrix4fv(grm.u_ModelMatrix, false, this.matrix.elements);

            grm.gl.uniform1f(grm.u_TextureWeight, 0.0);
            grm.gl.uniform4f(grm.u_FragColor, ...this._color);

            for (let x = 0; x < this._elevations.length - 1; x++) {
                for (let z = 0; z < this._elevations[0].length - 1; z++) {
                    const yBL = this._elevations[x][z];
                    const yBR = this._elevations[x + 1][z];
                    const yTL = this._elevations[x][z + 1];
                    const yTR = this._elevations[x + 1][z + 1];
                    
                    grm.gl.uniform4f(grm.u_FragColor, ...this._colors[x][z]);

                    _reusableTriArray[0] = (x) * this._scale;
                    _reusableTriArray[1] = yBL;
                    _reusableTriArray[2] = (z) * this._scale;
                    _reusableTriArray[3] = (x + 1) * this._scale;
                    _reusableTriArray[4] = yBR;
                    _reusableTriArray[5] = (z) * this._scale;
                    _reusableTriArray[6] = (x) * this._scale;
                    _reusableTriArray[7] = yTL;
                    _reusableTriArray[8] = (z + 1) * this._scale;
                    drawTriangle(grm, _reusableTriArray, TRASH_UV_COORDS);
                    _reusableTriArray[0] = (x + 1) * this._scale;
                    _reusableTriArray[1] = yTR;
                    _reusableTriArray[2] = (z + 1) * this._scale;
                    _reusableTriArray[3] = (x) * this._scale;
                    _reusableTriArray[4] = yTL;
                    _reusableTriArray[5] = (z + 1) * this._scale;
                    _reusableTriArray[6] = (x + 1) * this._scale;
                    _reusableTriArray[7] = yBR;
                    _reusableTriArray[8] = (z) * this._scale;
                    drawTriangle(grm, _reusableTriArray, TRASH_UV_COORDS);
                }
            }
        }
    }
}
