import drawTriangle from "../drawTriangle.js";

const TRASH_UV_COORDS = new Float32Array([0, 0]);
const _reusableTriArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);

export default class CylinderHoriz {
    constructor(color, segments) {
        this._color = color;
        this._segments = segments;
        this.matrix = new Matrix4();

        // Fake shading
        this._color_front = [this._color[0] * 0.80, this._color[1] * 0.80, this._color[2] * 0.80, this._color[3]];
        this._color_sides = [];
        {
            const segAngle = 2 * Math.PI / segments;
            for (let seg = 0; seg < segments; seg++) {
                let shade = Math.sin(seg * segAngle);
                shade = (shade + 1) / 2; // Changes range from [-1, 1] to [0, 1]
                shade = (shade + 1) / 2; // Changes range from [0, 1] to [0.5, 1]
                this._color_sides[seg] = [this._color[0] * shade, this._color[1] * shade, this._color[2] * shade, this._color[3]];
            }
        }
        this._color_back = [this._color[0] * 0.82, this._color[1] * 0.82, this._color[2] * 0.82, this._color[3]];
    }

    render(grm) {
        grm.gl.uniformMatrix4fv(grm.u_ModelMatrix, false, this.matrix.elements);

        grm.gl.uniform1f(grm.u_TextureWeight, 0.0);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color);

        const segAngle = 2 * Math.PI / this._segments;
        for (let seg = 0; seg < this._segments; seg++) {
            const angle1 = seg * segAngle;
            const angle2 = (seg + 1) * segAngle;

            const x1 = Math.cos(angle1);
            const y1 = Math.sin(angle1);

            const x2 = Math.cos(angle2);
            const y2 = Math.sin(angle2);

            grm.gl.uniform4f(grm.u_FragColor, ...this._color_front);
            _reusableTriArray[0] = 0;
            _reusableTriArray[1] = 0;
            _reusableTriArray[2] = -1;
            _reusableTriArray[3] = x1;
            _reusableTriArray[4] = y1;
            _reusableTriArray[5] = -1;
            _reusableTriArray[6] = x2;
            _reusableTriArray[7] = y2;
            _reusableTriArray[8] = -1;
            drawTriangle(grm, _reusableTriArray, TRASH_UV_COORDS);

            grm.gl.uniform4f(grm.u_FragColor, ...this._color_sides[seg]);
            _reusableTriArray[0] = x1;
            _reusableTriArray[1] = y1;
            _reusableTriArray[2] = 1;
            _reusableTriArray[3] = x2;
            _reusableTriArray[4] = y2;
            _reusableTriArray[5] = 1;
            _reusableTriArray[6] = x1;
            _reusableTriArray[7] = y1;
            _reusableTriArray[8] = -1;
            drawTriangle(grm, _reusableTriArray, TRASH_UV_COORDS);
            _reusableTriArray[0] = x2;
            _reusableTriArray[1] = y2;
            _reusableTriArray[2] = -1;
            _reusableTriArray[3] = x1;
            _reusableTriArray[4] = y1;
            _reusableTriArray[5] = -1;
            _reusableTriArray[6] = x2;
            _reusableTriArray[7] = y2;
            _reusableTriArray[8] = 1;
            drawTriangle(grm, _reusableTriArray, TRASH_UV_COORDS);

            grm.gl.uniform4f(grm.u_FragColor, ...this._color_back);
            _reusableTriArray[0] = 0;
            _reusableTriArray[1] = 0;
            _reusableTriArray[2] = 1;
            _reusableTriArray[3] = x2;
            _reusableTriArray[4] = y2;
            _reusableTriArray[5] = 1;
            _reusableTriArray[6] = x1;
            _reusableTriArray[7] = y1;
            _reusableTriArray[8] = 1;
            drawTriangle(grm, _reusableTriArray, TRASH_UV_COORDS);
        }
    }
}