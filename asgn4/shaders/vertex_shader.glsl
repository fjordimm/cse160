precision mediump float;

uniform mat4 u_ModelMatrix;
uniform mat4 u_TransformMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
uniform vec3 u_PointLightPos;

attribute vec4 a_Position;
attribute vec2 a_UV;
attribute vec3 a_Normal;

varying vec2 v_UV;
varying vec3 v_Normal;
varying float v_LightLevel;

void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_TransformMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_LightLevel = dot(normalize(u_PointLightPos), normalize(a_Normal));
}
