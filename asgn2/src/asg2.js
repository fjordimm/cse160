var VSHADER_SOURCE = `
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotationMatrix;
attribute vec4 a_Position;
void main() {
    gl_Position = u_GlobalRotationMatrix * u_ModelMatrix * a_Position;
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
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotationMatrix;
let a_Position;

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
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotationMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotationMatrix');
    if (!u_GlobalRotationMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotationMatrix');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
}

// Main Globals
let listOfShapes;
let globalRotationMatrixJustY;
let globalRotationMatrixJustX;
let globalRotationMatrix;
const GLOBAL_ROTATION_SPEED = 90.0;

function main() {
    setupWebGL();
    setupGLSLVariables();

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    listOfShapes = [];
    globalRotationMatrixJustY = new Matrix4();
    globalRotationMatrixJustX = new Matrix4();
    globalRotationMatrix = new Matrix4();

    setupShapes();
    renderAllShapes();

    canvas.onmousemove = function (ev) { handleMouseMove(ev); }
}

// HTML Interface Globals
let lastMouseX = 0;
let lastMouseY = 0;

function convertCoordsEventToGL(ev) {
    let x = ev.clientX; // x coordinate of a mouse pointer
    let y = ev.clientY; // y coordinate of a mouse pointer
    let rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return [x, y];
}

function handleMouseMove(ev) {
    let [x, y] = convertCoordsEventToGL(ev);
    if (ev.buttons === 1) {
        let dx = x - lastMouseX;
        let dy = y - lastMouseY;

        globalRotationMatrixJustY.rotate(-GLOBAL_ROTATION_SPEED * dx, 0, 1, 0);
        globalRotationMatrixJustX.rotate(GLOBAL_ROTATION_SPEED * dy, 1, 0, 0);
        globalRotationMatrix = new Matrix4();
        globalRotationMatrix = globalRotationMatrix.multiply(globalRotationMatrixJustX);
        globalRotationMatrix = globalRotationMatrix.multiply(globalRotationMatrixJustY);
        renderAllShapes();

        // console.log(globalRotationMatrix.multiplyVector3(new Vector3([1, 0, 0])));
    }

    lastMouseX = x;
    lastMouseY = y;
}

function renderAllShapes() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (let shape of listOfShapes) {
        shape.render();
    }
}

function setupShapes() {
    const cube = new Cube([0, 1, 1, 1]);
    // cube.matrix.rotate(-30, 1, 0, 0);
    // cube.matrix.rotate(30, 0, 1, 0);
    cube.matrix.scale(0.1, 0.1, 0.1);
    listOfShapes.push(cube);
}

class Cube {
    constructor(color) {
        this._color = color;
        // Fake shading
        this._color_top = [this._color[0], this._color[1], this._color[2], this._color[3]];
        this._color_front = [this._color[0] * 0.80, this._color[1] * 0.80, this._color[2] * 0.80, this._color[3]];
        this._color_right = [this._color[0] * 0.84, this._color[1] * 0.84, this._color[2] * 0.84, this._color[3]];
        this._color_back = [this._color[0] * 0.82, this._color[1] * 0.82, this._color[2] * 0.82, this._color[3]];
        this._color_left = [this._color[0] * 0.86, this._color[1] * 0.86, this._color[2] * 0.92, this._color[3]];
        this._color_bottom = [this._color[0] * 0.5, this._color[1] * 0.5, this._color[2] * 0.5, this._color[3]];
    
        this.matrix = new Matrix4();
    }

    render() {
        gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, globalRotationMatrix.elements);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.uniform4f(u_FragColor, ...this._color_top);
        drawTriangle([-1, 1, -1, 1, 1, -1, -1, 1, 1]);
        drawTriangle([1, 1, 1, -1, 1, 1, 1, 1, -1]);
        gl.uniform4f(u_FragColor, ...this._color_front);
        drawTriangle([-1, -1, -1, 1, -1, -1, -1, 1, -1]);
        drawTriangle([1, 1, -1, -1, 1, -1, 1, -1, -1]);
        gl.uniform4f(u_FragColor, ...this._color_right);
        drawTriangle([1, -1, -1, 1, -1, 1, 1, 1, -1]);
        drawTriangle([1, 1, 1, 1, 1, -1, 1, -1, 1]);
        gl.uniform4f(u_FragColor, ...this._color_back);
        drawTriangle([1, -1, 1, -1, -1, 1, 1, 1, 1]);
        drawTriangle([-1, 1, 1, 1, 1, 1, -1, -1, 1]);
        gl.uniform4f(u_FragColor, ...this._color_left);
        drawTriangle([-1, -1, 1, -1, -1, -1, -1, 1, 1]);
        drawTriangle([-1, 1, -1, -1, 1, 1, -1, -1, -1]);
        gl.uniform4f(u_FragColor, ...this._color_bottom);
        drawTriangle([-1, -1, 1, 1, -1, 1, -1, -1, -1]);
        drawTriangle([1, -1, -1, -1, -1, -1, 1, -1, 1]);
    }
}

function drawTriangle(vertices) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
