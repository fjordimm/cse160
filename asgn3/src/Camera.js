const UP_VEC = new Vector3([0, 1, 0]);

export default class Camera {
    constructor(fov, canvasWidth, canvasHeight, nearPlane, farPlane) {
        this._eye = new Vector3([0, 0, 0]);
        this._at = new Vector3([0, 0, -1]);

        this._projectionMatrix = new Matrix4();
        this._projectionMatrix.setPerspective(fov, canvasWidth / canvasHeight, nearPlane, farPlane);
        
        this._viewMatrix = new Matrix4();
        this._updateViewMatrix();
    }

    _updateViewMatrix() {
        this._viewMatrix.setLookAt(...this._eye.elements, ...this._at.elements, ...UP_VEC.elements);
    }

    getViewMatrix() {
        return this._viewMatrix;
    }

    getProjectionMatrix() {
        return this._projectionMatrix;
    }
}