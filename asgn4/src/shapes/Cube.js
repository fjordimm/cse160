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
const NORMAL_ARRAY_TOP = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0]);
const NORMAL_ARRAY_BOTTOM = new Float32Array([0, -1, 0, 0, -1, 0, 0, -1, 0]);
const NORMAL_ARRAY_FRONT = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]);
const NORMAL_ARRAY_BACK = new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1]);
const NORMAL_ARRAY_RIGHT = new Float32Array([1, 0, 0, 1, 0, 0, 1, 0, 0]);
const NORMAL_ARRAY_LEFT = new Float32Array([-1, 0, 0, -1, 0, 0, -1, 0, 0]);

export default class Cube {
    constructor(color, texturePath, textureWeight) {
        this.matrix = new Matrix4();
        this.isVisible = true;
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
    }

    render(grm) {
        if (this.isVisible) {
            grm.gl.uniformMatrix4fv(grm.u_ModelMatrix, false, this.matrix.elements);

            if (this._textureImgReady) {
                if (this._gltexture === null) {
                    this._gltexture = grm.gl.createTexture();
                }

                grm.gl.activeTexture(grm.gl.TEXTURE0);
                grm.gl.bindTexture(grm.gl.TEXTURE_2D, this._gltexture);
                grm.gl.texParameteri(grm.gl.TEXTURE_2D, grm.gl.TEXTURE_MAG_FILTER, grm.gl.NEAREST);
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

            // Top
            drawTriangle(grm, TRI_ARRAY_01, UV_BL, NORMAL_ARRAY_TOP);
            drawTriangle(grm, TRI_ARRAY_02, UV_TR, NORMAL_ARRAY_TOP);
            // Front
            drawTriangle(grm, TRI_ARRAY_03, UV_BL, NORMAL_ARRAY_FRONT);
            drawTriangle(grm, TRI_ARRAY_04, UV_TR, NORMAL_ARRAY_FRONT);
            // Right
            drawTriangle(grm, TRI_ARRAY_05, UV_BL, NORMAL_ARRAY_RIGHT);
            drawTriangle(grm, TRI_ARRAY_06, UV_TR, NORMAL_ARRAY_RIGHT);
            // Back
            drawTriangle(grm, TRI_ARRAY_07, UV_BL, NORMAL_ARRAY_BACK);
            drawTriangle(grm, TRI_ARRAY_08, UV_TR, NORMAL_ARRAY_BACK);
            // Left
            drawTriangle(grm, TRI_ARRAY_09, UV_BL, NORMAL_ARRAY_LEFT);
            drawTriangle(grm, TRI_ARRAY_10, UV_TR, NORMAL_ARRAY_LEFT);
            // Bottom
            drawTriangle(grm, TRI_ARRAY_11, UV_BL, NORMAL_ARRAY_BOTTOM);
            drawTriangle(grm, TRI_ARRAY_12, UV_TR, NORMAL_ARRAY_BOTTOM);
        }
    }
}
