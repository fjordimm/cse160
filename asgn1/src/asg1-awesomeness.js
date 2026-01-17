var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform float u_Size;
void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
}
`;

// Fragment shader program
var FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor;
void main() {
    gl_FragColor = u_FragColor;
}
`;

// WebGL Globals
let canvas;
let gl;
let vertexBuffer;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
    canvas = document.getElementById('webgl');

    gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create buffer object');
        return;
    }
}

function setupGLSLVariables() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

// Other Globals
let gridSize = 10;
let grid;

function main() {
    setupWebGL();
    setupGLSLVariables();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    grid = [];
    for (let i = 0; i < gridSize + 1; i++) {
        grid.push([]);
        for (let j = 0; j < gridSize + 1; j++) {
            grid[i].push(0);
        }
    }

    grid[5][5] = -1;

    // canvas.onmousedown = function (ev) { handleMouseClick(ev) };

    drawGrid();
}

function handleMouseClick(ev) {
    let [x, y] = convertCoordsEventToGL(ev);
    drawShape(x, y);
}

function drawTriangle(vertices, color) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function drawGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let zBL = grid[i][j];
            let zBR = grid[i+1][j];
            let zTL = grid[i][j+1];
            let zTR = grid[i+1][j+1];

            let x = (i / gridSize) * 2 - 1;
            let y = (j / gridSize) * 2 - 1;
            d = 2 / gridSize;
            
            let triangle1 = [[x, y, zBL], [x+d, y, zBR], [x, y+d, zTL]];
            let normalAngle = calculateNormalAngle(triangle1[0], triangle1[1], triangle1[2]);
            let color = [normalAngle, normalAngle, normalAngle, 1];
            console.log(color);
            drawTriangle([triangle1[0][0], triangle1[0][1], triangle1[1][0], triangle1[1][1], triangle1[2][0], triangle1[2][1]], color);
        }
    }
}

// Not really an angle, just a value between -1 and 1
function calculateNormalAngle(p1, p2, p3) {
    let v1 = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];
    let v2 = [p1[0] - p3[0], p1[1] - p3[1], p1[2] - p3[2]];

    let crossProd = [0, 0, 0];
    crossProd[0] = v1[1] * v2[2] - v1[2] * v2[1];
    crossProd[1] = v1[2] * v2[0] - v1[0] * v2[2];
    crossProd[2] = v1[0] * v2[1] - v1[1] * v2[0];

    let upVec = [0, 0, 1];
    let dotProd = crossProd[0] * upVec[0] + crossProd[1] * upVec[1] + crossProd[2] * upVec[2];

    return dotProd / (calculateMagnitude(v1) * calculateMagnitude(v2));
}

function calculateMagnitude(p) {
    return Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
}

function convertCoordsEventToGL(ev) {
    let x = ev.clientX; // x coordinate of a mouse pointer
    let y = ev.clientY; // y coordinate of a mouse pointer
    let rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return [x, y];
}
