export default function drawTriangle(grm, vertices, uvs) {
    grm.gl.bindBuffer(grm.gl.ARRAY_BUFFER, grm.vertexBuffer);
    grm.gl.bufferData(grm.gl.ARRAY_BUFFER, toFloat32Array(vertices), grm.gl.DYNAMIC_DRAW);
    grm.gl.vertexAttribPointer(grm.a_Position, 3, grm.gl.FLOAT, false, 0, 0);
    grm.gl.enableVertexAttribArray(grm.a_Position);

    grm.gl.bindBuffer(grm.gl.ARRAY_BUFFER, grm.uvBuffer);
    grm.gl.bufferData(grm.gl.ARRAY_BUFFER, toFloat32Array(uvs), grm.gl.DYNAMIC_DRAW);
    grm.gl.vertexAttribPointer(grm.a_UV, 2, grm.gl.FLOAT, false, 0, 0);
    grm.gl.enableVertexAttribArray(grm.a_UV);

    grm.gl.drawArrays(grm.gl.TRIANGLES, 0, 3);
}

let _reusableFloat32Array = new Float32Array();
function toFloat32Array(elements) {
    if (elements.length > _reusableFloat32Array.length) {
        _reusableFloat32Array = new Float32Array(elements.length);
    }

    _reusableFloat32Array.set(elements);
    return _reusableFloat32Array.subarray(0, elements.length);
}
