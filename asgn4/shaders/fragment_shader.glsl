precision mediump float;

uniform vec4 u_FragColor;
uniform sampler2D u_Texture;
uniform float u_TextureWeight;
uniform int u_DebugColoring;

varying vec2 v_UV;
varying vec3 v_Normal;
varying float v_LightLevel;

void main() {
    if (u_DebugColoring == 0) { // Regular
        vec4 textureColor = texture2D(u_Texture, v_UV);
        gl_FragColor = (1.0 - u_TextureWeight) * u_FragColor + u_TextureWeight * textureColor;
        gl_FragColor *= v_LightLevel;
    } else if (u_DebugColoring == 1) { // Normal Visualization
        gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
    } else { // Error
        gl_FragColor = vec4(1, 0, 1, 1);
    }
}
