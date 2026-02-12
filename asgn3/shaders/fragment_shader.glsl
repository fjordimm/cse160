precision mediump float;

uniform vec4 u_FragColor;
uniform sampler2D u_Texture;
uniform float u_TextureWeight;

varying vec2 v_UV;

void main() {
    vec4 textureColor = texture2D(u_Texture, v_UV);
    gl_FragColor = (1.0 - u_TextureWeight) * u_FragColor + u_TextureWeight * textureColor;
    // gl_FragColor = 0.5 * u_FragColor + 0.5 * textureColor;
}
