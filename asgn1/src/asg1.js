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
let listOfShapes = [];
let shapeType = "point";

function main() {
    setupWebGL();
    setupGLSLVariables();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    listOfShapes = [];

    canvas.onmousedown = function (ev) { handleMouseClick(ev) };
    canvas.onmousemove = function (ev) { handleMouseMove(ev) };
}

class Point {
    constructor(position, color, size) {
        this.position = position;
        this.color = color;
        this.size = size;
    }

    render() {
        let xy = this.position;
        let rgba = this.color;
        let size = this.size;

        gl.disableVertexAttribArray(a_Position);

        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, size);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

class Triangle {
    constructor(position, color, size) {
        this.position = position;
        this.color = color;
        this.size = size;
    }

    render() {
        let triangleWidth = this.size / 200;
        let d = triangleWidth/2;

        let vertices = [
            this.position[0] - d, this.position[1] - d,
            this.position[0] + d, this.position[1] - d,
            this.position[0],     this.position[1] + d
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

class Circle {
    constructor(position, color, size, segments) {
        this.position = position;
        this.color = color;
        this.size = size;
        this.segments = segments;
    }

    render() {
        let radius = this.size / 2;
        let x = this.position[0];
        let y = this.position[1];
        let segAngle = 2 * Math.PI / this.segments;

        let vertices = [];
        for (let seg = 0; seg < this.segments; seg++) {
            let angle1 = seg * segAngle;
            let angle2 = (seg + 1) * segAngle;

            let dx1 = (Math.cos(angle1) * radius) / 200;
            let dy1 = (Math.sin(angle1) * radius) / 200;

            let dx2 = (Math.cos(angle2) * radius) / 200;
            let dy2 = (Math.sin(angle2) * radius) / 200;

            vertices.push(
                x,       y,
                x + dx1, y + dy1,
                x + dx2, y + dy2
            );
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

        gl.drawArrays(gl.TRIANGLES, 0, this.segments * 3);
    }
}

class ManualTriangle {
    constructor(vertices, color) {
        this.vertices = vertices;
        this.color = color;

        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] /= 200;
        }
    }

    render() {
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

function handleClearButton() {
    listOfShapes = [];
    renderAllShapes();
}

function handleSetShapeType(type) {
    shapeType = type;
}

function handleMouseClick(ev) {
    let [x, y] = convertCoordsEventToGL(ev);
    drawShape(x, y);
}

function handleMouseMove(ev) {
    let [x, y] = convertCoordsEventToGL(ev);
    if (ev.buttons === 1) {
        drawShape(x, y);
    }
}

function drawShape(x, y) {
    let xy = [x, y];
    let [colRed, colGreen, colBlue] = getSliderColors();
    colRed /= 255;
    colGreen /= 255;
    colBlue /= 255;
    let rgba = [colRed, colGreen, colBlue, 1.0];
    let size = getSliderSize();
    let circleSegments = getSliderCircleSegments();

    if (shapeType === "point") {
        listOfShapes.push(new Point(xy, rgba, size));
    } else if (shapeType === "triangle") {
        listOfShapes.push(new Triangle(xy, rgba, size));
    } else if (shapeType === "circle") {
        listOfShapes.push(new Circle(xy, rgba, size, circleSegments));
    } else {
        throw new Error("Invalid shape type");
    }

    renderAllShapes();
}

function renderAllShapes() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let shape of listOfShapes) {
        shape.render();
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

function getSliderCircleSegments() {
    let circleSegments = document.getElementById("slider-circle-segments").value;

    return circleSegments;
}

const COL_BACKGROUND = [0.11, 0.06, 0.17, 1];
const COL_TRUNK = [0.11, 0.24, 0.25, 1];
const COL_INITIALS = [0.08, 0.19, 0.21, 1];
const COL_LEAVES = [0.78, 0.49, 0.37, 1];
function handleMakePictureButton() {
    // Background
    listOfShapes.push(new ManualTriangle([
        -200, -200,
        200, -200,
        -200, 200
    ], COL_BACKGROUND));
    listOfShapes.push(new ManualTriangle([
        200, 200,
        -200, 200,
        200, -200
    ], COL_BACKGROUND));

    // Trunk
    listOfShapes.push(new ManualTriangle([
        -100, -180,
        -60, -180,
        -60, -120
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        80, -180,
        40, -180,
        40, -120
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        -60, -180,
        40, -180,
        -60, -60
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        40, -60,
        -60, -60,
        40, -180
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        -20, -60,
        40, -60,
        -20, -40
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        40, -40,
        -20, -40,
        40, -60
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        -60, -60,
        -20, -60,
        -60, 60
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        -20, 60,
        -60, 60,
        -20, -60
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        -60, -60,
        -60, 0,
        -100, 0
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        -100, 0,
        -60, 0,
        -100, 40
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        -100, 0,
        -100, 40,
        -140, 40
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        -20, -40,
        0, -40,
        -20, 0
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        0, -40,
        40, -40,
        40, 0
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        40, -60,
        80, 0,
        40, 0
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        40, 0,
        80, 0,
        40, 80
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        80, 80,
        40, 80,
        80, 0
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        80, 0,
        120, 40,
        80, 40
    ], COL_TRUNK));
    listOfShapes.push(new ManualTriangle([
        80, 40,
        120, 40,
        100, 60
    ], COL_TRUNK));

    // Leaves
    listOfShapes.push(new ManualTriangle([
        -180, 0,
        0, 60,
        -120, 140
    ], COL_LEAVES));
    listOfShapes.push(new ManualTriangle([
        0, 80,
        140, 20,
        120, 160
    ], COL_LEAVES));
    listOfShapes.push(new ManualTriangle([
        -20, 100,
        60, 200,
        -80, 180
    ], COL_LEAVES));

    // Initials
    listOfShapes.push(new ManualTriangle([
        -40, -180,
        -20, -170,
        -40, -160
    ], COL_INITIALS));
    listOfShapes.push(new ManualTriangle([
        -40, -160,
        -20, -150,
        -40, -140
    ], COL_INITIALS));
    listOfShapes.push(new ManualTriangle([
        0, -180,
        40, -180,
        0, -160
    ], COL_INITIALS));
    listOfShapes.push(new ManualTriangle([
        40, -160,
        0, -160,
        40, -180
    ], COL_INITIALS));
    listOfShapes.push(new ManualTriangle([
        0, -160,
        20, -160,
        0, -140
    ], COL_INITIALS));
    listOfShapes.push(new ManualTriangle([
        20, -160,
        40, -160,
        40, -140
    ], COL_INITIALS));

    renderAllShapes();
}
