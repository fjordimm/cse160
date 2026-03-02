import drawTriangle from "../drawTriangle.js";

const TRASH_UV_COORDS = new Float32Array([0, 0, 0, 0, 0, 0]);
const _reusableTriArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);

export default class CylinderHoriz {
    constructor(color, segments) {
        this._color = color;
        this._segments = segments;
        this.matrix = new Matrix4();

        this._triangles = [];
        const segAngle = 2 * Math.PI / this._segments;
        for (let seg = 0; seg < this._segments; seg++) {
            const angle1 = seg * segAngle;
            const angle2 = (seg + 1) * segAngle;

            const x1 = Math.cos(angle1);
            const y1 = Math.sin(angle1);

            const x2 = Math.cos(angle2);
            const y2 = Math.sin(angle2);

            // Top
            this._triangles.push([
                0, 0, 1,
                x1, y1, 1,
                x2, y2, 1
            ]);

            // Side
            this._triangles.push([
                x1, y1, -1,
                x2, y2, -1,
                x1, y1, 1
            ]);
            this._triangles.push([
                x2, y2, 1,
                x1, y1, 1,
                x2, y2, -1
            ]);

            // Bottom
            this._triangles.push([
                0, 0, -1,
                x2, y2, -1,
                x1, y1, -1
            ]);
        }
    }

    render(grm) {
        grm.gl.uniformMatrix4fv(grm.u_ModelMatrix, false, this.matrix.elements);

        grm.gl.uniform1f(grm.u_TextureWeight, 0.0);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color);

        for (let i = 0; i < this._triangles.length; i++) {
            _reusableTriArray[0] = this._triangles[i][0];
            _reusableTriArray[1] = this._triangles[i][1];
            _reusableTriArray[2] = this._triangles[i][2];
            _reusableTriArray[3] = this._triangles[i][3];
            _reusableTriArray[4] = this._triangles[i][4];
            _reusableTriArray[5] = this._triangles[i][5];
            _reusableTriArray[6] = this._triangles[i][6];
            _reusableTriArray[7] = this._triangles[i][7];
            _reusableTriArray[8] = this._triangles[i][8];

            drawTriangle(grm, _reusableTriArray, TRASH_UV_COORDS, _reusableTriArray);
        }
    }
}
