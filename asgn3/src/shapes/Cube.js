import drawTriangle from "../drawTriangle.js";

const UV_BL = new Float32Array([0, 0, 1, 0, 0, 1]);
const UV_TR = new Float32Array([1, 1, 0, 1, 1, 0]);
const TRI_ARRAY_01 = new Float32Array([-0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5]);
const TRI_ARRAY_02 = new Float32Array([0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5]);
const TRI_ARRAY_03 = new Float32Array([-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5]);
const TRI_ARRAY_04 = new Float32Array([0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5]);
const TRI_ARRAY_05 = new Float32Array([0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]);
const TRI_ARRAY_06 = new Float32Array([0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5]);
const TRI_ARRAY_07 = new Float32Array([0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5]);
const TRI_ARRAY_08 = new Float32Array([-0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5]);
const TRI_ARRAY_09 = new Float32Array([-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5]);
const TRI_ARRAY_10 = new Float32Array([-0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5]);
const TRI_ARRAY_11 = new Float32Array([-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5]);
const TRI_ARRAY_12 = new Float32Array([0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5]);

export default class Cube {
    constructor(color, texturePath, textureWeight) {
        this.matrix = new Matrix4();
        this._color = color;
        this._gltexture = null;
        this._textureImg = null;
        this._textureImgReady = false;
        this._textureWeight = textureWeight;

        if (texturePath) {
            this._textureImg = new Image();
            this._textureImg.src = texturePath;
            this._textureImg.crossOrigin = "anonymous";
            
            this._textureImg.onload = () => {
                this._textureImgReady = true;
            };
        }

        // Fake shading
        this._color_top = [this._color[0], this._color[1], this._color[2], this._color[3]];
        this._color_front = [this._color[0] * 0.80, this._color[1] * 0.80, this._color[2] * 0.80, this._color[3]];
        this._color_right = [this._color[0] * 0.84, this._color[1] * 0.84, this._color[2] * 0.84, this._color[3]];
        this._color_back = [this._color[0] * 0.82, this._color[1] * 0.82, this._color[2] * 0.82, this._color[3]];
        this._color_left = [this._color[0] * 0.86, this._color[1] * 0.86, this._color[2] * 0.92, this._color[3]];
        this._color_bottom = [this._color[0] * 0.5, this._color[1] * 0.5, this._color[2] * 0.5, this._color[3]];
    }

    render(grm) {
        grm.gl.uniformMatrix4fv(grm.u_ModelMatrix, false, this.matrix.elements);

        if (this._textureImgReady) {
            if (this._gltexture === null) {
                this._gltexture = grm.gl.createTexture();
            }

            grm.gl.activeTexture(grm.gl.TEXTURE0);
            grm.gl.bindTexture(grm.gl.TEXTURE_2D, this._gltexture);
            grm.gl.texParameteri(grm.gl.TEXTURE_2D, grm.gl.TEXTURE_MIN_FILTER, grm.gl.LINEAR);
            grm.gl.texImage2D(
                grm.gl.TEXTURE_2D,
                0,
                grm.gl.RGBA,
                grm.gl.RGBA,
                grm.gl.UNSIGNED_BYTE,
                this._textureImg
            );
            grm.gl.uniform1i(grm.u_Texture, 0);

            grm.gl.uniform1f(grm.u_TextureWeight, this._textureWeight);
        } else {
            grm.gl.uniform1f(grm.u_TextureWeight, 0.0);
        }

        grm.gl.uniform4f(grm.u_FragColor, ...this._color_top);
        drawTriangle(grm, TRI_ARRAY_01, UV_BL);
        drawTriangle(grm, TRI_ARRAY_02, UV_TR);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_front);
        drawTriangle(grm, TRI_ARRAY_03, UV_BL);
        drawTriangle(grm, TRI_ARRAY_04, UV_TR);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_right);
        drawTriangle(grm, TRI_ARRAY_05, UV_BL);
        drawTriangle(grm, TRI_ARRAY_06, UV_TR);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_back);
        drawTriangle(grm, TRI_ARRAY_07, UV_BL);
        drawTriangle(grm, TRI_ARRAY_08, UV_TR);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_left);
        drawTriangle(grm, TRI_ARRAY_09, UV_BL);
        drawTriangle(grm, TRI_ARRAY_10, UV_TR);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_bottom);
        drawTriangle(grm, TRI_ARRAY_11, UV_BL);
        drawTriangle(grm, TRI_ARRAY_12, UV_TR);
    }
}
