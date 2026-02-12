precision mediump float;

uniform vec4 u_FragColor;
uniform sampler2D u_Texture;

varying vec2 v_UV;

void main() {
    gl_FragColor = u_FragColor;

    vec4 image = texture2D(u_Texture, v_UV);
    gl_FragColor = image;

    // gl_FragColor = u_FragColor;
}
