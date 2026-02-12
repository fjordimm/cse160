import { drawTriangle } from "../util.js";

export default class Cube {
    constructor(color) {
        this._color = color;

        // Fake shading
        this._color_top = [this._color[0], this._color[1], this._color[2], this._color[3]];
        this._color_front = [this._color[0] * 0.80, this._color[1] * 0.80, this._color[2] * 0.80, this._color[3]];
        this._color_right = [this._color[0] * 0.84, this._color[1] * 0.84, this._color[2] * 0.84, this._color[3]];
        this._color_back = [this._color[0] * 0.82, this._color[1] * 0.82, this._color[2] * 0.82, this._color[3]];
        this._color_left = [this._color[0] * 0.86, this._color[1] * 0.86, this._color[2] * 0.92, this._color[3]];
        this._color_bottom = [this._color[0] * 0.5, this._color[1] * 0.5, this._color[2] * 0.5, this._color[3]];
    
        this.matrix = new Matrix4();
    }

    render(grm, cameraMatrix) {
        grm.gl.uniformMatrix4fv(grm.u_GlobalCameraMatrix, false, cameraMatrix.elements);
        grm.gl.uniformMatrix4fv(grm.u_ModelMatrix, false, this.matrix.elements);

        grm.gl.uniform4f(grm.u_FragColor, ...this._color_top);
        drawTriangle(grm, [-1, 1, -1, 1, 1, -1, -1, 1, 1]);
        drawTriangle(grm, [1, 1, 1, -1, 1, 1, 1, 1, -1]);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_front);
        drawTriangle(grm, [-1, -1, -1, 1, -1, -1, -1, 1, -1]);
        drawTriangle(grm, [1, 1, -1, -1, 1, -1, 1, -1, -1]);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_right);
        drawTriangle(grm, [1, -1, -1, 1, -1, 1, 1, 1, -1]);
        drawTriangle(grm, [1, 1, 1, 1, 1, -1, 1, -1, 1]);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_back);
        drawTriangle(grm, [1, -1, 1, -1, -1, 1, 1, 1, 1]);
        drawTriangle(grm, [-1, 1, 1, 1, 1, 1, -1, -1, 1]);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_left);
        drawTriangle(grm, [-1, -1, 1, -1, -1, -1, -1, 1, 1]);
        drawTriangle(grm, [-1, 1, -1, -1, 1, 1, -1, -1, -1]);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_bottom);
        drawTriangle(grm, [-1, -1, 1, 1, -1, 1, -1, -1, -1]);
        drawTriangle(grm, [1, -1, -1, -1, -1, -1, 1, -1, 1]);
    }
}
