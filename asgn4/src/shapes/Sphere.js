import drawTriangle from "../drawTriangle.js";

const TRASH_UV_COORDS = new Float32Array([0, 0, 0, 0, 0, 0]);
const _reusableTriArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
const _reusableNormalArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);

export default class Sphere {
    constructor(color, segments) {
        this._color = color;
        this._segments = segments;
        this.matrix = new Matrix4();

        this._triangles = [];
        this._normals = [];
        const halfCircle = Math.PI / this._segments;
        for (let segH = 0; segH < this._segments * 2; segH++) {
            const angleH1 = segH * halfCircle;
            const angleH2 = (segH + 1) * halfCircle;
            for (let segV = 0; segV < this._segments; segV++) {
                const angleV1 = segV * halfCircle - Math.PI / 2;
                const angleV2 = (segV + 1) * halfCircle - Math.PI / 2;

                const xBL = Math.cos(angleV1) * Math.cos(angleH1);
                const yBL = Math.sin(angleV1);
                const zBL = Math.cos(angleV1) * Math.sin(angleH1);

                const xBR = Math.cos(angleV1) * Math.cos(angleH2);
                const yBR = Math.sin(angleV1);
                const zBR = Math.cos(angleV1) * Math.sin(angleH2);

                const xTL = Math.cos(angleV2) * Math.cos(angleH1);
                const yTL = Math.sin(angleV2);
                const zTL = Math.cos(angleV2) * Math.sin(angleH1);

                const xTR = Math.cos(angleV2) * Math.cos(angleH2);
                const yTR = Math.sin(angleV2);
                const zTR = Math.cos(angleV2) * Math.sin(angleH2);

                this._triangles.push([
                    xBL, yBL, zBL,
                    xBR, yBR, zBR,
                    xTL, yTL, zTL
                ]);
                this._triangles.push([
                    xTR, yTR, zTR,
                    xTL, yTL, zTL,
                    xBR, yBR, zBR
                ]);

                const v1 = [xBR - xBL, yBR - yBL, zBR - zBL];
                const v2 = [xTL - xBL, yTL - yBL, zTL - zBL];
                const normal = [
                    v1[1] * v2[2] - v1[2] * v2[1],
                    v1[2] * v2[0] - v1[0] * v2[2],
                    v1[0] * v2[1] - v1[1] * v2[0]
                ];
                const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
                normal[0] /= length;
                normal[1] /= length;
                normal[2] /= length;
                this._normals.push([...normal, ...normal, ...normal]);
                this._normals.push([...normal, ...normal, ...normal]);
            }
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

            // _reusableNormalArray[0] = this._normals[i][0];
            // _reusableNormalArray[1] = this._normals[i][1];
            // _reusableNormalArray[2] = this._normals[i][2];
            // _reusableNormalArray[3] = this._normals[i][3];
            // _reusableNormalArray[4] = this._normals[i][4];
            // _reusableNormalArray[5] = this._normals[i][5];
            // _reusableNormalArray[6] = this._normals[i][6];
            // _reusableNormalArray[7] = this._normals[i][7];
            // _reusableNormalArray[8] = this._normals[i][8];
            // _reusableNormalArray[0] = this._normals[i][0];
            _reusableNormalArray[1] = this._triangles[i][1];
            _reusableNormalArray[2] = this._triangles[i][2];
            _reusableNormalArray[3] = this._triangles[i][3];
            _reusableNormalArray[4] = this._triangles[i][4];
            _reusableNormalArray[5] = this._triangles[i][5];
            _reusableNormalArray[6] = this._triangles[i][6];
            _reusableNormalArray[7] = this._triangles[i][7];
            _reusableNormalArray[8] = this._triangles[i][8];

            drawTriangle(grm, _reusableTriArray, TRASH_UV_COORDS, _reusableNormalArray);
        }
    }
}