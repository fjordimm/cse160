uniform mat4 u_ModelMatrix;
uniform mat4 u_TransformMatrix;
uniform mat4 u_GlobalCameraMatrix;
attribute vec4 a_Position;

void main() {
    gl_Position = u_GlobalCameraMatrix * u_TransformMatrix * u_ModelMatrix * a_Position;
}
