import drawTriangle from "../drawTriangle.js";

const TRASH_UV_COORDS = new Float32Array([0, 0, 0, 0, 0, 0]);
const _reusableVertexArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
const _reusableNormalArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);

export default class Model {
    constructor(color, modelPath) {
        this.matrix = new Matrix4();
        this._color = color;
        this._modelPath = modelPath;
        this._modelData = null;
        this._modelDataReady = false;

        if (modelPath) {
            this.getFileContent();
        }
    }

    render(grm) {
        if (!this._isFullyLoaded) return;

        grm.gl.uniformMatrix4fv(grm.u_ModelMatrix, false, this.matrix.elements);

        grm.gl.uniform1f(grm.u_TextureWeight, 0.0);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color);

        for (let i = 0; i < this._modelData.vertices.length / 9; i++) {
            _reusableVertexArray[0] = this._modelData.vertices[9 * i + 0];
            _reusableVertexArray[1] = this._modelData.vertices[9 * i + 1];
            _reusableVertexArray[2] = this._modelData.vertices[9 * i + 2];
            _reusableVertexArray[3] = this._modelData.vertices[9 * i + 3];
            _reusableVertexArray[4] = this._modelData.vertices[9 * i + 4];
            _reusableVertexArray[5] = this._modelData.vertices[9 * i + 5];
            _reusableVertexArray[6] = this._modelData.vertices[9 * i + 6];
            _reusableVertexArray[7] = this._modelData.vertices[9 * i + 7];
            _reusableVertexArray[8] = this._modelData.vertices[9 * i + 8];

            _reusableNormalArray[0] = this._modelData.normals[9 * i + 0];
            _reusableNormalArray[1] = this._modelData.normals[9 * i + 1];
            _reusableNormalArray[2] = this._modelData.normals[9 * i + 2];
            _reusableNormalArray[3] = this._modelData.normals[9 * i + 3];
            _reusableNormalArray[4] = this._modelData.normals[9 * i + 4];
            _reusableNormalArray[5] = this._modelData.normals[9 * i + 5];
            _reusableNormalArray[6] = this._modelData.normals[9 * i + 6];
            _reusableNormalArray[7] = this._modelData.normals[9 * i + 7];
            _reusableNormalArray[8] = this._modelData.normals[9 * i + 8];

            drawTriangle(grm, _reusableVertexArray, TRASH_UV_COORDS, _reusableNormalArray);
        }

        // // vertices
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, this.modelData.vertices, gl.DYNAMIC_DRAW);
        // gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(program.a_Position);

        // // normals
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, this.modelData.normals, gl.DYNAMIC_DRAW);
        // gl.vertexAttribPointer(program.a_Normal, 3, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(program.a_Normal);

        // // uniforms
        // gl.uniformMatrix4fv(program.u_ModelMatrix, false, this.matrix.elements);
        // gl.uniform4fv(program.u_FragColor, this.color);

        // // normal matrix
        // let normalMatrix = new Matrix4().setInverseOf(this.matrix);
        // normalMatrix.transpose();
        // gl.uniformMatrix4fv(program.u_NormalMatrix, false, normalMatrix.elements);

        // gl.drawArrays(gl.TRIANGLES, 0, this.modelData.vertices.length / 3);
    }

    async getFileContent() {
        try {
            const response = await fetch(this._modelPath);
            if (!response.ok) throw new Error(`Could not load file "${this._modelPath}". Are you sure the file name/path are correct?`);

            const fileContent = await response.text();
            this.parseModel(fileContent);
        } catch (e) {
            throw new Error(`Something went wrong when loading ${this.filePath}. Error: ${e}`);
        }
    }

    parseModel(fileContent) {
        const lines = fileContent.split("\n");

        const allVertices = [];
        const allNormals = [];
        const unpackedVertices = [];
        const unpackedNormals = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const tokens = line.split(" ");

            if (tokens[0] === "v") {
                allVertices.push(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
            } else if (tokens[0] === "vn") {
                allNormals.push(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
            } else if (tokens[0] === "f") {
                for (const face of [tokens[1], tokens[2], tokens[3]]) {
                    const indices = face.split("//");
                    const vertexIndex = (parseInt(indices[0]) - 1) * 3;
                    const normalIndex = (parseInt(indices[1]) - 1) * 3;

                    unpackedVertices.push(
                        allVertices[vertexIndex],
                        allVertices[vertexIndex + 1],
                        allVertices[vertexIndex + 2]
                    );

                    unpackedNormals.push(
                        allNormals[normalIndex],
                        allNormals[normalIndex + 1],
                        allNormals[normalIndex + 2]
                    );
                }
            }
        }

        this._modelData = {
            vertices: new Float32Array(unpackedVertices),
            normals: new Float32Array(unpackedNormals)
        };

        this._isFullyLoaded = true;
    }
}
