export async function loadFileText(path) {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Couldn't load file. Response status: ${response.status}`);
        }

        return await response.text();
    } catch (err) {
        console.log(`Couldn't load file: Error: ${err}`);
    }
}

export function drawTriangle(grm, vertices) {
    grm.gl.bindBuffer(grm.gl.ARRAY_BUFFER, grm.vertexBuffer);
    grm.gl.bufferData(grm.gl.ARRAY_BUFFER, new Float32Array(vertices), grm.gl.DYNAMIC_DRAW);
    grm.gl.vertexAttribPointer(grm.a_Position, 3, grm.gl.FLOAT, false, 0, 0);
    grm.gl.enableVertexAttribArray(grm.a_Position);

    grm.gl.drawArrays(grm.gl.TRIANGLES, 0, 3);
}
