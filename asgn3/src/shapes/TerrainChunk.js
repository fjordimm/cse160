import drawTriangle from "../drawTriangle.js";

export default class TerrainChunk {
    constructor(color) {
        this.matrix = new Matrix4();
        this._color = color;
    }

    render(grm) {
        grm.gl.uniformMatrix4fv(grm.u_ModelMatrix, false, this.matrix.elements);

        grm.gl.uniform1f(grm.u_TextureWeight, 0.0);

        const trashUvCoords = [0, 0];

        grm.gl.uniform4f(grm.u_FragColor, ...this._color_top);
        drawTriangle(grm, [-0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5], trashUvCoords);
        drawTriangle(grm, [0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5], trashUvCoords);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_front);
        drawTriangle(grm, [-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5], trashUvCoords);
        drawTriangle(grm, [0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5], trashUvCoords);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_right);
        drawTriangle(grm, [0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5], trashUvCoords);
        drawTriangle(grm, [0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5], trashUvCoords);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_back);
        drawTriangle(grm, [0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5], trashUvCoords);
        drawTriangle(grm, [-0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5], trashUvCoords);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_left);
        drawTriangle(grm, [-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5], trashUvCoords);
        drawTriangle(grm, [-0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5], trashUvCoords);
        grm.gl.uniform4f(grm.u_FragColor, ...this._color_bottom);
        drawTriangle(grm, [-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5], trashUvCoords);
        drawTriangle(grm, [0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5], trashUvCoords);
    }
}
