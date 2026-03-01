precision mediump float;

uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix;
uniform mat4 u_TransformMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;

attribute vec4 a_Position;
attribute vec2 a_UV;
attribute vec3 a_Normal;

varying vec2 v_UV;
varying vec3 v_Normal;
varying vec3 v_WorldPos;

void main() {
    vec4 worldPosition = u_ModelMatrix * a_Position;

    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_TransformMatrix * worldPosition;
    v_UV = a_UV;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_WorldPos = vec3(worldPosition);
}
