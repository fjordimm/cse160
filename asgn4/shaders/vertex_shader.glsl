precision mediump float;

uniform mat4 u_ModelMatrix;
uniform mat4 u_TransformMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;

attribute vec4 a_Position;
attribute vec2 a_UV;
attribute vec3 a_Normal;

varying vec2 v_UV;
varying vec3 v_Normal;
varying vec3 v_WorldPos;

mat4 transpose(mat4 mat) {
    mat4 result = mat4(
        mat[0][0], mat[1][0], mat[2][0], mat[3][0],
        mat[0][1], mat[1][1], mat[2][1], mat[3][1],
        mat[0][2], mat[1][2], mat[2][2], mat[3][2],
        mat[0][3], mat[1][3], mat[2][3], mat[3][3]
    );
    return result;
}

float determinant(mat4 mat) {
    float det = mat[0][0] * (mat[1][1] * (mat[2][2] * mat[3][3] - mat[2][3] * mat[3][2]) - mat[1][2] * (mat[2][1] * mat[3][3] - mat[2][3] * mat[3][1]) + mat[1][3] * (mat[2][1] * mat[3][2] - mat[2][2] * mat[3][1]));
    det -= mat[0][1] * (mat[1][0] * (mat[2][2] * mat[3][3] - mat[2][3] * mat[3][2]) - mat[1][2] * (mat[2][0] * mat[3][3] - mat[2][3] * mat[3][0]) + mat[1][3] * (mat[2][0] * mat[3][2] - mat[2][2] * mat[3][0]));
    det += mat[0][2] * (mat[1][0] * (mat[2][1] * mat[3][3] - mat[2][3] * mat[3][1]) - mat[1][1] * (mat[2][0] * mat[3][3] - mat[2][3] * mat[3][0]) + mat[1][3] * (mat[2][0] * mat[3][1] - mat[2][1] * mat[3][0]));
    det -= mat[0][3] * (mat[1][0] * (mat[2][1] * mat[3][2] - mat[2][2] * mat[3][1]) - mat[1][1] * (mat[2][0] * mat[3][2] - mat[2][2] * mat[3][0]) + mat[1][2] * (mat[2][0] * mat[3][1] - mat[2][1] * mat[3][0]));
    return det;
}

mat4 inverse(mat4 mat) {
    mat4 result;
    float det = determinant(mat);

    if (abs(det) < 0.0001) {
        return mat4(1.0);
    }

    result[0][0] = mat[1][1] * mat[2][2] * mat[3][3] - mat[1][1] * mat[2][3] * mat[3][2] - mat[2][1] * mat[1][2] * mat[3][3] + mat[2][1] * mat[1][3] * mat[3][2] + mat[3][1] * mat[1][2] * mat[2][3] - mat[3][1] * mat[1][3] * mat[2][2];
    result[1][0] = -mat[1][0] * mat[2][2] * mat[3][3] + mat[1][0] * mat[2][3] * mat[3][2] + mat[2][0] * mat[1][2] * mat[3][3] - mat[2][0] * mat[1][3] * mat[3][2] - mat[3][0] * mat[1][2] * mat[2][3] + mat[3][0] * mat[1][3] * mat[2][2];
    result[2][0] = mat[1][0] * mat[2][1] * mat[3][3] - mat[1][0] * mat[2][3] * mat[3][1] - mat[2][0] * mat[1][1] * mat[3][3] + mat[2][0] * mat[1][3] * mat[3][1] + mat[3][0] * mat[1][1] * mat[2][3] - mat[3][0] * mat[1][3] * mat[2][1];
    result[3][0] = -mat[1][0] * mat[2][1] * mat[3][2] + mat[1][0] * mat[2][2] * mat[3][1] + mat[2][0] * mat[1][1] * mat[3][2] - mat[2][0] * mat[1][2] * mat[3][1] - mat[3][0] * mat[1][1] * mat[2][2] + mat[3][0] * mat[1][2] * mat[2][1];

    result[0][1] = -mat[0][1] * mat[2][2] * mat[3][3] + mat[0][1] * mat[2][3] * mat[3][2] + mat[2][1] * mat[0][2] * mat[3][3] - mat[2][1] * mat[0][3] * mat[3][2] - mat[3][1] * mat[0][2] * mat[2][3] + mat[3][1] * mat[0][3] * mat[2][2];
    result[1][1] = mat[0][0] * mat[2][2] * mat[3][3] - mat[0][0] * mat[2][3] * mat[3][2] - mat[2][0] * mat[0][2] * mat[3][3] + mat[2][0] * mat[0][3] * mat[3][2] + mat[3][0] * mat[0][2] * mat[2][3] - mat[3][0] * mat[0][3] * mat[2][2];
    result[2][1] = -mat[0][0] * mat[2][1] * mat[3][3] + mat[0][0] * mat[2][3] * mat[3][1] + mat[2][0] * mat[0][1] * mat[3][3] - mat[2][0] * mat[0][3] * mat[3][1] - mat[3][0] * mat[0][1] * mat[2][3] + mat[3][0] * mat[0][3] * mat[2][1];
    result[3][1] = mat[0][0] * mat[2][1] * mat[3][2] - mat[0][0] * mat[2][2] * mat[3][1] - mat[2][0] * mat[0][1] * mat[3][2] + mat[2][0] * mat[0][2] * mat[3][1] + mat[3][0] * mat[0][1] * mat[2][2] - mat[3][0] * mat[0][2] * mat[2][1];

    result[0][2] = mat[0][1] * mat[1][2] * mat[3][3] - mat[0][1] * mat[1][3] * mat[3][2] - mat[1][1] * mat[0][2] * mat[3][3] + mat[1][1] * mat[0][3] * mat[3][2] + mat[3][1] * mat[0][2] * mat[1][3] - mat[3][1] * mat[0][3] * mat[1][2];
    result[1][2] = -mat[0][0] * mat[1][2] * mat[3][3] + mat[0][0] * mat[1][3] * mat[3][2] + mat[1][0] * mat[0][2] * mat[3][3] - mat[1][0] * mat[0][3] * mat[3][2] - mat[3][0] * mat[0][2] * mat[1][3] + mat[3][0] * mat[0][3] * mat[1][2];
    result[2][2] = mat[0][0] * mat[1][1] * mat[3][3] - mat[0][0] * mat[1][3] * mat[3][1] - mat[1][0] * mat[0][1] * mat[3][3] + mat[1][0] * mat[0][3] * mat[3][1] + mat[3][0] * mat[0][1] * mat[1][3] - mat[3][0] * mat[0][3] * mat[1][1];
    result[3][2] = -mat[0][0] * mat[1][1] * mat[3][2] + mat[0][0] * mat[1][2] * mat[3][1] + mat[1][0] * mat[0][1] * mat[3][2] - mat[1][0] * mat[0][2] * mat[3][1] - mat[3][0] * mat[0][1] * mat[1][2] + mat[3][0] * mat[0][2] * mat[1][1];

    result[0][3] = -mat[0][1] * mat[1][2] * mat[2][3] + mat[0][1] * mat[1][3] * mat[2][2] + mat[1][1] * mat[0][2] * mat[2][3] - mat[1][1] * mat[0][3] * mat[2][2] - mat[2][1] * mat[0][2] * mat[1][3] + mat[2][1] * mat[0][3] * mat[1][2];
    result[1][3] = mat[0][0] * mat[1][2] * mat[2][3] - mat[0][0] * mat[1][3] * mat[2][2] - mat[1][0] * mat[0][2] * mat[2][3] + mat[1][0] * mat[0][3] * mat[2][2] + mat[2][0] * mat[0][2] * mat[1][3] - mat[2][0] * mat[0][3] * mat[1][2];
    result[2][3] = -mat[0][0] * mat[1][1] * mat[2][3] + mat[0][0] * mat[1][3] * mat[2][1] + mat[1][0] * mat[0][1] * mat[2][3] - mat[1][0] * mat[0][3] * mat[2][1] - mat[2][0] * mat[0][1] * mat[1][3] + mat[2][0] * mat[0][3] * mat[1][1];
    result[3][3] = mat[0][0] * mat[1][1] * mat[2][2] - mat[0][0] * mat[1][2] * mat[2][1] - mat[1][0] * mat[0][1] * mat[2][2] + mat[1][0] * mat[0][2] * mat[2][1] + mat[2][0] * mat[0][1] * mat[1][2] - mat[2][0] * mat[0][2] * mat[1][1];

    return transpose(result) / det;
}

mat4 translate(vec3 vec) {
    return mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        vec.x, vec.y, vec.z, 1.0
    );
}

mat4 removeTranslation(mat4 mat) {
    return mat4(
        mat[0][0], mat[0][1], mat[0][2], 0,
        mat[1][0], mat[1][1], mat[1][2], 0,
        mat[2][0], mat[2][1], mat[2][2], 0,
        0,         0,         0,         1
    );
}

void main() {
    vec4 worldPosition = u_TransformMatrix * u_ModelMatrix * a_Position;
    mat4 normalMatrix = transpose(inverse(removeTranslation(u_TransformMatrix * u_ModelMatrix)));

    gl_Position = u_ProjectionMatrix * u_ViewMatrix * worldPosition;
    v_UV = a_UV;
    v_Normal = normalize(vec3(normalMatrix * vec4(a_Normal, 1)));
    v_WorldPos = vec3(worldPosition);
}
