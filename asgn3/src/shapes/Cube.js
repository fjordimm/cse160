import drawTriangle from "../drawTriangle.js";

export default class Cube {
    constructor(color) {
        this.matrix = new Matrix4();
        this._color = color;
        this._texture = null;

        // Fake shading
        this._color_top = [this._color[0], this._color[1], this._color[2], this._color[3]];
        this._color_front = [this._color[0] * 0.80, this._color[1] * 0.80, this._color[2] * 0.80, this._color[3]];
        this._color_right = [this._color[0] * 0.84, this._color[1] * 0.84, this._color[2] * 0.84, this._color[3]];
        this._color_back = [this._color[0] * 0.82, this._color[1] * 0.82, this._color[2] * 0.82, this._color[3]];
        this._color_left = [this._color[0] * 0.86, this._color[1] * 0.86, this._color[2] * 0.92, this._color[3]];
        this._color_bottom = [this._color[0] * 0.5, this._color[1] * 0.5, this._color[2] * 0.5, this._color[3]];
    }

    render(grm, cameraMatrix) {
        grm.gl.uniformMatrix4fv(grm.u_GlobalCameraMatrix, false, cameraMatrix.elements);
        grm.gl.uniformMatrix4fv(grm.u_ModelMatrix, false, this.matrix.elements);

        const uvBL = [0, 0, 1, 0, 0, 1];
        const uvTR = [1, 1, 0, 1, 1, 0];

        grm.gl.uniform4f(grm.u_FragColor, ...this._color_top);
        drawTriangle(grm, [-1, 1, -1, 1, 1, -1, -1, 1, 1], uvBL);
        drawTriangle(grm, [1, 1, 1, -1, 1, 1, 1, 1, -1], uvTR);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_front);
        drawTriangle(grm, [-1, -1, -1, 1, -1, -1, -1, 1, -1], uvBL);
        drawTriangle(grm, [1, 1, -1, -1, 1, -1, 1, -1, -1], uvTR);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_right);
        drawTriangle(grm, [1, -1, -1, 1, -1, 1, 1, 1, -1], uvBL);
        drawTriangle(grm, [1, 1, 1, 1, 1, -1, 1, -1, 1], uvTR);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_back);
        drawTriangle(grm, [1, -1, 1, -1, -1, 1, 1, 1, 1], uvBL);
        drawTriangle(grm, [-1, 1, 1, 1, 1, 1, -1, -1, 1], uvTR);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_left);
        drawTriangle(grm, [-1, -1, 1, -1, -1, -1, -1, 1, 1], uvBL);
        drawTriangle(grm, [-1, 1, -1, -1, 1, 1, -1, -1, -1], uvTR);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_bottom);
        drawTriangle(grm, [-1, -1, 1, 1, -1, 1, -1, -1, -1], uvBL);
        drawTriangle(grm, [1, -1, -1, -1, -1, -1, 1, -1, 1], uvTR);
    }

    setTexture(grm, imagePath) {
        if (this._texture === null) {
            this._texture = grm.gl.createTexture();
        }

        grm.gl.pixelStorei(grm.gl.UNPACK_FLIP_Y_WEBGL, true);

        const img = new Image();

        img.onload = () => {
            grm.gl.activeTexture(grm.gl.TEXTURE0);
            grm.gl.bindTexture(grm.gl.TEXTURE_2D, this._texture);
            grm.gl.texParameteri(grm.gl.TEXTURE_2D, grm.gl.TEXTURE_MIN_FILTER, grm.gl.LINEAR);
            grm.gl.texImage2D(
                grm.gl.TEXTURE_2D,
                0,
                grm.gl.RGBA,
                grm.gl.RGBA,
                grm.gl.UNSIGNED_BYTE,
                img
            );
            grm.gl.uniform1i(grm.u_Texture, 0);
        };

        img.crossOrigin = "anonymous";
        img.src = imagePath;
    }
}
