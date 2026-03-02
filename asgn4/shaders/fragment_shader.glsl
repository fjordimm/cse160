precision mediump float;

uniform vec4 u_FragColor;
uniform sampler2D u_Texture;
uniform float u_TextureWeight;
uniform int u_DebugColoring;
uniform int u_SkipLighting;
uniform int u_DoPointLight;
uniform int u_DoSpotLight;
uniform vec3 u_CameraPos;
uniform vec3 u_PointLightPos;
uniform vec3 u_PointLightColor;
uniform vec3 u_SpotLightPos;
uniform vec3 u_SpotLightDir;

varying vec2 v_UV;
varying vec3 v_Normal;
varying vec3 v_WorldPos;

void main() {
        if (u_DebugColoring == 0) { // Regular
            if (u_SkipLighting == 1) {
                vec4 textureColor = texture2D(u_Texture, v_UV);
                gl_FragColor = (1.0 - u_TextureWeight) * u_FragColor + u_TextureWeight * textureColor;
            } else {
                vec4 textureColor = texture2D(u_Texture, v_UV);
                vec3 prelitColor = vec3((1.0 - u_TextureWeight) * u_FragColor + u_TextureWeight * textureColor);

                vec3 litColor = vec3(0.0);

                if (u_DoPointLight == 1) {
                    vec3 L = normalize(u_PointLightPos - v_WorldPos);
                    vec3 N = normalize(v_Normal);
                    float LdotN = max(0.0, dot(L, N));
                    vec3 R = reflect(-L, N);
                    vec3 V = normalize(u_CameraPos - v_WorldPos);
                    float RdotV = max(0.0, dot(R, V));
                    vec3 ambient = 0.3 * prelitColor * u_PointLightColor;
                    vec3 diffuse = 0.8 * LdotN * prelitColor * u_PointLightColor;
                    vec3 specular = 0.3 * pow(RdotV, 15.0) * u_PointLightColor;

                    litColor += ambient + diffuse + specular;
                }

                if (u_DoSpotLight == 1) {
                    vec3 L = normalize(u_SpotLightPos - v_WorldPos);
                    vec3 N = normalize(v_Normal);
                    float LdotN = max(0.0, dot(L, N));
                    vec3 R = reflect(-L, N);
                    vec3 V = normalize(u_CameraPos - v_WorldPos);
                    float RdotV = max(0.0, dot(R, V));
                    vec3 diffuse = 0.5 * LdotN * vec3(1.0);
                    vec3 specular = 0.2 * pow(RdotV, 10.0) * vec3(1.0);

                    vec3 D = -normalize(u_SpotLightDir);
                    float LdotD = max(0.0, dot(L, D));
                    float spotlightFactor = pow(LdotD, 20.0);

                    litColor += spotlightFactor * (diffuse + specular);
                }

                gl_FragColor = vec4(litColor, 1.0);
            }
        } else if (u_DebugColoring == 1) { // Normal Visualization
            gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
        } else { // Error
            gl_FragColor = vec4(1, 0, 1, 1);
        }
}
