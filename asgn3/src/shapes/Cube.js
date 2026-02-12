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

    render(graphicsManager, cameraMatrix) {
        const gl = graphicsManager.gl;

        gl.uniformMatrix4fv(graphicsManager.u_GlobalCameraMatrix, false, cameraMatrix.elements);
        gl.uniformMatrix4fv(graphicsManager.u_ModelMatrix, false, this.matrix.elements);

        gl.uniform4f(graphicsManager.u_FragColor, ...this._color_top);
        drawTriangle(graphicsManager, [-1, 1, -1, 1, 1, -1, -1, 1, 1]);
        drawTriangle(graphicsManager, [1, 1, 1, -1, 1, 1, 1, 1, -1]);
        gl.uniform4f(graphicsManager.u_FragColor, ...this._color_front);
        drawTriangle(graphicsManager, [-1, -1, -1, 1, -1, -1, -1, 1, -1]);
        drawTriangle(graphicsManager, [1, 1, -1, -1, 1, -1, 1, -1, -1]);
        gl.uniform4f(graphicsManager.u_FragColor, ...this._color_right);
        drawTriangle(graphicsManager, [1, -1, -1, 1, -1, 1, 1, 1, -1]);
        drawTriangle(graphicsManager, [1, 1, 1, 1, 1, -1, 1, -1, 1]);
        gl.uniform4f(graphicsManager.u_FragColor, ...this._color_back);
        drawTriangle(graphicsManager, [1, -1, 1, -1, -1, 1, 1, 1, 1]);
        drawTriangle(graphicsManager, [-1, 1, 1, 1, 1, 1, -1, -1, 1]);
        gl.uniform4f(graphicsManager.u_FragColor, ...this._color_left);
        drawTriangle(graphicsManager, [-1, -1, 1, -1, -1, -1, -1, 1, 1]);
        drawTriangle(graphicsManager, [-1, 1, -1, -1, 1, 1, -1, -1, -1]);
        gl.uniform4f(graphicsManager.u_FragColor, ...this._color_bottom);
        drawTriangle(graphicsManager, [-1, -1, 1, 1, -1, 1, -1, -1, -1]);
        drawTriangle(graphicsManager, [1, -1, -1, -1, -1, -1, 1, -1, 1]);
    }
}
