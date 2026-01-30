
///// WebGL Stuff /////

var VSHADER_SOURCE = `
uniform mat4 u_ModelMatrix;
uniform mat4 u_TransformMatrix;
uniform mat4 u_GlobalCameraMatrix;
attribute vec4 a_Position;
void main() {
    gl_Position = u_GlobalCameraMatrix * u_TransformMatrix * u_ModelMatrix * a_Position;
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
let u_TransformMatrix;
let u_GlobalCameraMatrix;
let a_Position;

function setupWebGL() {
    canvas = document.getElementById('webgl');

    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
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

    u_TransformMatrix = gl.getUniformLocation(gl.program, 'u_TransformMatrix');
    if (!u_TransformMatrix) {
        console.log('Failed to get the storage location of u_TransformMatrix');
        return;
    }

    u_GlobalCameraMatrix = gl.getUniformLocation(gl.program, 'u_GlobalCameraMatrix');
    if (!u_GlobalCameraMatrix) {
        console.log('Failed to get the storage location of u_GlobalCameraMatrix');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
}

///// Main /////

// Main Globals
let listOfComponents;
let globalCameraMatrixRotY;
let globalCameraMatrixRotX;
let globalCameraMatrixZoom;
let globalCameraMatrix;
let animalMovement; // One of "sliders", "animation", or "poke".
let animationTimeElapsed;
let pokeTimeElapsed;
const MIN_FRAME_LENGTH = 16; // 16 for 60fps.
const GLOBAL_ROTATION_SPEED = 150.0;
const GLOBAL_SCROLL_SPEED = 15.0;
const _renderingHelperMatrix = new Matrix4(); // So a new object doesn't need to be created each time.
const _IDENTITY_MATRIX = new Matrix4();

async function main() {
    setupWebGL();
    setupGLSLVariables();

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    listOfComponents = [];
    globalCameraMatrixRotY = new Matrix4();
    globalCameraMatrixRotX = new Matrix4();
    globalCameraMatrixZoom = new Matrix4();
    globalCameraMatrix = new Matrix4();
    animalMovement = "animation";
    animationTimeElapsed = 0;
    pokeTimeElapsed = 0;

    setupComponents();
    // renderAllComponents();

    canvas.onmousemove = function (ev) { handleMouseMove(ev); };
    canvas.onmousedown = function (ev) { handleMouseClick(ev); };
    window.addEventListener("wheel", function (ev) { handleScroll(ev); });

    let startTime = Date.now();
    let previousTime = Date.now();
    let previousDeltaTime = 0;
    let fpsUpdateCounter = 0;
    while (true) {
        await tick(previousDeltaTime, Date.now() - startTime);

        // Waste remaining time if it was faster than MIN_FRAME_LENGTH to enforce a maximum fps.
        let remainingTime = MIN_FRAME_LENGTH - (Date.now() - previousTime);
        if (remainingTime > 0) {
            await new Promise(r => setTimeout(r, remainingTime));
        }

        // Update FPS display, but only do it every 100ms.
        fpsUpdateCounter += Date.now() - previousTime;
        if (fpsUpdateCounter > 100) {
            updateFpsDisplay(Date.now() - previousTime);
            fpsUpdateCounter = 0;
        }

        previousDeltaTime = Date.now() - previousTime;
        previousTime = Date.now();
    }
}

function updateGlobalCameraMatrix() {
    globalCameraMatrix.setIdentity();
    globalCameraMatrix.multiply(globalCameraMatrixZoom);
    globalCameraMatrix.multiply(globalCameraMatrixRotX);
    globalCameraMatrix.multiply(globalCameraMatrixRotY);
}

///// Animal-Specific /////

// const COLOR_FUR1 = [0.267, 0.192, 0.118, 1];
const COLOR_FUR1 = [1, 0, 1, 1];

let oxBody;
let oxHead;

function setupComponents() {
    oxBody = new Component();
    oxHead = new Component();

    // body
    {
        // {
        //     const s = new Cube(COLOR_FUR1);
        //     s.matrix.scale(0.2, 0.2, 0.25);
        //     oxBody.addShape(s);
        // }
        // {
        //     const s = new Cube(COLOR_FUR1);
        //     s.matrix.translate(0, 0.04, 0.1);
        //     s.matrix.scale(0.15, 0.15, 0.4);
        //     oxBody.addShape(s);
        // }
        {
            const s = new Cylinder(COLOR_FUR1, 8);
            // s.matrix.translate(0, 0.3, 0);
            s.matrix.scale(0.4, 0.4, 0.4);
            oxBody.addShape(s);
        }
        {
            // head
            // oxHead.matrix.translate(0, 0.5, 0);
            // {
            //     {
            //         const s = new Cube(COLOR_DEBUG1);
            //         s.matrix.scale(0.15, 0.15, 0.15);
            //         oxHead.addShape(s);
            //     }
            //     {
            //         const s = new Cube(COLOR_DEBUG1);
            //         s.matrix.translate(0, 0, -0.2);
            //         s.matrix.scale(0.05, 0.05, 0.05);
            //         oxHead.addShape(s);
            //     }
            // }
            // oxBody.addChild(oxHead);
        }
    }
    listOfComponents.push(oxBody);
}

async function tick(deltaTime, totalTimeElapsed) {
    if (animalMovement === "sliders") {
        doAnimalMovementSliders(deltaTime, totalTimeElapsed);
    } else if (animalMovement === "animation") {
        doAnimalMovementAnimation(deltaTime, totalTimeElapsed);
    } else if (animalMovement === "poke") {
        doAnimalMovementPoke(deltaTime, totalTimeElapsed);
    } else {
        throw new Error("Invalid value for animalMovement.");
    }

    renderAllComponents();
}

function doAnimalMovementSliders(deltaTime, totalTimeElapsed) {
    oxHead.animationMatrix.setRotate(-getSliderValue("slider-head"), 0, 1, 0);
}

function doAnimalMovementAnimation(deltaTime, totalTimeElapsed) {
    animationTimeElapsed += deltaTime;

    // oxHead.animationMatrix.setRotate(-0.1 * animationTimeElapsed, 0, 1, 0);
}

function doAnimalMovementPoke(deltaTime, totalTimeElapsed) {
    pokeTimeElapsed += deltaTime;

    // oxHead.animationMatrix.setScale(1 + 0.001 * pokeTimeElapsed, 1 + 0.001 * pokeTimeElapsed, 1 + 0.001 * pokeTimeElapsed);
}

///// HTML Interface Stuff /////

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

        globalCameraMatrixRotX.rotate(GLOBAL_ROTATION_SPEED * dy, 1, 0, 0);
        globalCameraMatrixRotY.rotate(-GLOBAL_ROTATION_SPEED * dx, 0, 1, 0);
        updateGlobalCameraMatrix();
    }

    lastMouseX = x;
    lastMouseY = y;
}

function handleMouseClick(ev) {
    if (ev.shiftKey) {
        animalMovement = "poke";
        pokeTimeElapsed = 0;
    }
}

function handleScroll(ev) {
    let scale = 1 - GLOBAL_SCROLL_SPEED * ev.deltaY / 10000;

    globalCameraMatrixZoom.scale(scale, scale, scale);
    updateGlobalCameraMatrix();
}

function handleRotationSlider(angle) {
    globalCameraMatrixRotY.setRotate(-angle, 0, 1, 0);
    updateGlobalCameraMatrix();
}

function updateFpsDisplay(frameLengthMs) {
    let fps = 1000 / frameLengthMs;

    let fpsdisplay = document.getElementById("fpsdisplay");
    fpsdisplay.innerHTML = `${fps.toFixed(1)}`;
}

function getSliderValue(name) {
    return document.getElementById(name).value;
}

function handleStartAnimation() {
    animalMovement = "animation";
    animationTimeElapsed = 0;
}

function handleStopAnimation() {
    animalMovement = "sliders";
}

///// Rendering /////

function renderAllComponents() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (let component of listOfComponents) {
        component.render(_IDENTITY_MATRIX);
    }
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
        gl.uniformMatrix4fv(u_GlobalCameraMatrix, false, globalCameraMatrix.elements);
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

class Cylinder {
    constructor(color, segments) {
        this._color = color;
        // Fake shading
        this._color_top = [this._color[0], this._color[1], this._color[2], this._color[3]];
        this._color_side = [this._color[0] * 0.8, this._color[1] * 0.8, this._color[2] * 0.8, this._color[3]];
        this._color_bottom = [this._color[0] * 0.5, this._color[1] * 0.5, this._color[2] * 0.5, this._color[3]];
    
        this._segments = segments;

        this.matrix = new Matrix4();
    }

    render() {
        gl.uniformMatrix4fv(u_GlobalCameraMatrix, false, globalCameraMatrix.elements);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        const segAngle = 2 * Math.PI / this._segments;
        for (let seg = 0; seg < this._segments; seg++) {
            const angle1 = seg * segAngle;
            const angle2 = (seg + 1) * segAngle;

            const x1 = Math.cos(angle1);
            const z1 = Math.sin(angle1);

            const x2 = Math.cos(angle2);
            const z2 = Math.sin(angle2);

            gl.uniform4f(u_FragColor, ...this._color_top);
            drawTriangle([
                0,  1, 0,
                x1, 1, z1,
                x2, 1, z2
            ]);

            gl.uniform4f(u_FragColor, ...this._color_side);
            drawTriangle([
                x1, -1, z1,
                x2, -1, z2,
                x1, 1, z1
            ]);
            drawTriangle([
                x2, 1, z2,
                x1, 1, z1,
                x2, -1, z2
            ]);

            gl.uniform4f(u_FragColor, ...this._color_bottom);
            drawTriangle([
                0,  -1, 0,
                x2, -1, z2,
                x1, -1, z1
            ]);
        }
    }
}

function drawTriangle(vertices) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

class Component {
    constructor() {
        this.matrix = new Matrix4();
        this.animationMatrix = new Matrix4();
        this._shapes = [];
        this._children = [];
    }

    addShape(shape) {
        this._shapes.push(shape);
    }

    addChild(child) {
        this._children.push(child);
    }

    render(parentMatrix) {
        _renderingHelperMatrix.setIdentity();
        _renderingHelperMatrix.multiply(parentMatrix);
        _renderingHelperMatrix.multiply(this.matrix);
        _renderingHelperMatrix.multiply(this.animationMatrix);
        gl.uniformMatrix4fv(u_TransformMatrix, false, _renderingHelperMatrix.elements);
        
        for (let shape of this._shapes) {
            shape.render();
        }

        for (let child of this._children) {
            child.render(parentMatrix);
        }
    }
}
