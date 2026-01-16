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

// Globals
let canvas;
let gl;
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

function main() {
    setupWebGL();
    setupGLSLVariables();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function (ev) { handleClick(ev) };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

let g_points = [];  // The array for the position of a mouse press
let g_colors = [];  // The array to store the color of a point
let g_sizes = [];
function handleClick(ev) {
    let [x, y] = convertCoordsEventToGL(ev);

    // Store the coordinates to g_points array
    g_points.push([x, y]);

    let [colRed, colGreen, colBlue] = getSliderColors();
    colRed /= 255;
    colGreen /= 255;
    colBlue /= 255;
    g_colors.push([colRed, colGreen, colBlue, 1.0]);

    g_sizes.push(getSliderSize());

    renderAllShapes();
}

function renderAllShapes() {
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    let len = g_points.length;
    for (let i = 0; i < len; i++) {
        let xy = g_points[i];
        let rgba = g_colors[i];
        let size = g_sizes[i];

        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, size);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

function convertCoordsEventToGL(ev) {
    let x = ev.clientX; // x coordinate of a mouse pointer
    let y = ev.clientY; // y coordinate of a mouse pointer
    let rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return [x, y];
}

// 3-array of ints in range [0-255]
function getSliderColors() {
    let red = document.getElementById("slider-red").value;
    let green = document.getElementById("slider-green").value;
    let blue = document.getElementById("slider-blue").value;

    return [red, green, blue];
}

function getSliderSize() {
    let size = document.getElementById("slider-size").value;

    return size;
}
