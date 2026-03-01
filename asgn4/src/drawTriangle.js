export default function drawTriangle(grm, vertices, uvs, normals) {
    grm.gl.bindBuffer(grm.gl.ARRAY_BUFFER, grm.vertexBuffer);
    grm.gl.bufferData(grm.gl.ARRAY_BUFFER, vertices, grm.gl.DYNAMIC_DRAW);
    grm.gl.vertexAttribPointer(grm.a_Position, 3, grm.gl.FLOAT, false, 0, 0);
    grm.gl.enableVertexAttribArray(grm.a_Position);

    grm.gl.bindBuffer(grm.gl.ARRAY_BUFFER, grm.uvBuffer);
    grm.gl.bufferData(grm.gl.ARRAY_BUFFER, uvs, grm.gl.DYNAMIC_DRAW);
    grm.gl.vertexAttribPointer(grm.a_UV, 2, grm.gl.FLOAT, false, 0, 0);
    grm.gl.enableVertexAttribArray(grm.a_UV);

    grm.gl.bindBuffer(grm.gl.ARRAY_BUFFER, grm.normalBuffer);
    grm.gl.bufferData(grm.gl.ARRAY_BUFFER, normals, grm.gl.DYNAMIC_DRAW);
    grm.gl.vertexAttribPointer(grm.a_Normal, 3, grm.gl.FLOAT, false, 0, 0);
    grm.gl.enableVertexAttribArray(grm.a_Normal);

    grm.gl.drawArrays(grm.gl.TRIANGLES, 0, 3);
}
