
var VSHADER_SOURCE = `
uniform mat4 u_ModelMatrix;
uniform mat4 u_TransformMatrix;
uniform mat4 u_GlobalCameraMatrix;
attribute vec4 a_Position;
void main() {
    gl_Position = u_GlobalCameraMatrix * u_TransformMatrix * u_ModelMatrix * a_Position;
}
`;

var FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor;
void main() {
    gl_FragColor = u_FragColor;
}
`;

export default class GraphicsManager {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.vertexBuffer = null;
        this.u_FragColor = null;
        this.u_ModelMatrix = null;
        this.u_TransformMatrix = null;
        this.u_GlobalCameraMatrix = null;
        this.a_Position = null;
    }

    setup() {
        // Setup WebGL

        this.canvas = document.getElementById('webgl');

        this.gl = this.canvas.getContext("webgl", { preserveDrawingBuffer: true });
        if (!this.gl) {
            console.log('Failed to get the rendering context for WebGL');
            return;
        }

        this.vertexBuffer = this.gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create buffer object');
            return;
        }

        // Setup GLSL Variables

        if (!initShaders(this.gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log('Failed to intialize shaders.');
            return;
        }

        this.u_FragColor = this.gl.getUniformLocation(this.gl.program, 'u_FragColor');
        if (!this.u_FragColor) {
            console.log('Failed to get the storage location of u_FragColor');
            return;
        }

        this.u_ModelMatrix = this.gl.getUniformLocation(this.gl.program, 'u_ModelMatrix');
        if (!this.u_ModelMatrix) {
            console.log('Failed to get the storage location of u_ModelMatrix');
            return;
        }

        this.u_TransformMatrix = this.gl.getUniformLocation(this.gl.program, 'u_TransformMatrix');
        if (!this.u_TransformMatrix) {
            console.log('Failed to get the storage location of u_TransformMatrix');
            return;
        }

        this.u_GlobalCameraMatrix = this.gl.getUniformLocation(this.gl.program, 'u_GlobalCameraMatrix');
        if (!this.u_GlobalCameraMatrix) {
            console.log('Failed to get the storage location of u_GlobalCameraMatrix');
            return;
        }

        this.a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
        if (this.a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return;
        }
    }
}
