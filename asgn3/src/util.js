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

export function drawTriangle(graphicsManager, vertices) {
    const gl = graphicsManager.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, graphicsManager.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(graphicsManager.a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(graphicsManager.a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
