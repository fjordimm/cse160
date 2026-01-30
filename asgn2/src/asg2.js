var VSHADER_SOURCE = `
uniform mat4 u_ModelMatrix;
attribute vec4 a_Position;
void main() {
    gl_Position = u_ModelMatrix * a_Position;
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

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
}

// Other Globals
// let listOfShapes = [];

function main() {
    setupWebGL();
    setupGLSLVariables();

    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const M = new Matrix4();
    M.rotate(-45, 1, 0, 0);
    M.rotate(45, 0, 1, 0);
    M.scale(0.3, 0.3, 0.3);
    const cube = new Cube([1, 0, 0, 1], M);
    cube.render();
}

class Cube {
    constructor(color, matrix) {
        this._color = color;
        this._color_top = [this._color[0] * 1.0, this._color[1] * 1.0, this._color[2] * 1.0, this._color[3]];
        this._color_front = [this._color[0] * 0.80, this._color[1] * 0.80, this._color[2] * 0.80, this._color[3]];
        this._color_right = [this._color[0] * 0.84, this._color[1] * 0.84, this._color[2] * 0.84, this._color[3]];
        this._color_back = [this._color[0] * 0.88, this._color[1] * 0.88, this._color[2] * 0.88, this._color[3]];
        this._color_left = [this._color[0] * 0.92, this._color[1] * 0.92, this._color[2] * 0.92, this._color[3]];
        this._color_bottom = [this._color[0] * 0.7, this._color[1] * 0.7, this._color[2] * 0.7, this._color[3]];
    
        this.matrix = matrix;
    }

    render() {
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.uniform4f(u_FragColor, ...this._color_front);
        drawTriangle([-1, -1, -1, 1, -1, -1, -1, 1, -1]);
        drawTriangle([1, 1, -1, -1, 1, -1, 1, -1, -1]);
        gl.uniform4f(u_FragColor, ...this._color_right);
        drawTriangle([1, -1, -1, 1, -1, 1, 1, 1, -1]);
        drawTriangle([1, 1, 1, 1, 1, -1, 1, -1, 1]);
    }
}

function drawTriangle(vertices) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// function drawCube() {
//     let vertices = [
//         -0.1, -0.1, 0,
//         0.1, -0.1, 0,
//         0, 0.1, 0
//     ];

//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
//     gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(a_Position);

//     gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

//     gl.drawArrays(gl.TRIANGLES, 0, 3);
// }

// function renderAllShapes() {
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     for (let shape of listOfShapes) {
//         shape.render();
//     }
// }
