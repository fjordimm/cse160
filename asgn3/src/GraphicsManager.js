
import { loadFileText } from "./util.js";

const VERTEX_SHADER_PATH = "./shaders/vertex_shader.glsl";
const FRAGMENT_SHADER_PATH = "./shaders/fragment_shader.glsl";

export default class GraphicsManager {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.vertexBuffer = null;
        this.uvBuffer = null;
        this.u_FragColor = null;
        this.u_Texture = null;
        this.u_TextureWeight = null;
        this.u_ModelMatrix = null;
        this.u_TransformMatrix = null;
        this.u_GlobalCameraMatrix = null;
        this.a_Position = null;
        this.a_UV = null;
    }

    async setup() {
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

        this.uvBuffer = this.gl.createBuffer();
        if (!this.uvBuffer) {
            console.log('Failed to create buffer object');
            return;
        }

        // GLSL Variables

        const vertexShaderSource = await loadFileText(VERTEX_SHADER_PATH);
        const fragmentShaderSource = await loadFileText(FRAGMENT_SHADER_PATH);

        if (!initShaders(this.gl, vertexShaderSource, fragmentShaderSource)) {
            console.log('Failed to intialize shaders.');
            return;
        }

        this.u_FragColor = this.gl.getUniformLocation(this.gl.program, 'u_FragColor');
        if (!this.u_FragColor) {
            console.log('Failed to get the storage location of u_FragColor');
            return;
        }

        this.u_Texture = this.gl.getUniformLocation(this.gl.program, 'u_Texture');
        if (!this.u_Texture) {
            console.log('Failed to get the storage location of u_Texture');
            return;
        }

        this.u_TextureWeight = this.gl.getUniformLocation(this.gl.program, 'u_TextureWeight');
        if (!this.u_TextureWeight) {
            console.log('Failed to get the storage location of u_TextureWeight');
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

        this.a_UV = this.gl.getAttribLocation(this.gl.program, 'a_UV');
        if (this.a_UV < 0) {
            console.log('Failed to get the storage location of a_UV');
            return;
        }

        // GL Settings

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.frontFace(this.gl.CCW);

        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}
