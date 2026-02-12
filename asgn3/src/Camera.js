const UP_VEC = new Vector3([0, 1, 0]);

export default class Camera {
    constructor(fov, canvasWidth, canvasHeight, nearPlane, farPlane) {
        this._eye = new Vector3([0, 0, 0]);
        this._at = new Vector3([0, 0, -1]);

        this._projectionMatrix = new Matrix4();
        this._projectionMatrix.setPerspective(60, canvasWidth / canvasHeight, nearPlane, farPlane);

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

    rotate(degrees) {
        const forwardVec = new Vector3();
        forwardVec.elements[0] = this._at.elements[0] - this._eye.elements[0];
        forwardVec.elements[1] = this._at.elements[1] - this._eye.elements[1];
        forwardVec.elements[2] = this._at.elements[2] - this._eye.elements[2];

        const rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(degrees, ...UP_VEC.elements);

        const rotatedForwardVec = rotationMatrix.multiplyVector3(forwardVec);

        this._at.elements[0] = this._eye.elements[0] + rotatedForwardVec.elements[0];
        this._at.elements[1] = this._eye.elements[1] + rotatedForwardVec.elements[1];
        this._at.elements[2] = this._eye.elements[2] + rotatedForwardVec.elements[2];

        this._updateViewMatrix();
    }

    move(vector) {
        this._eye.elements[0] += vector.elements[0];
        this._eye.elements[1] += vector.elements[1];
        this._eye.elements[2] += vector.elements[2];

        this._at.elements[0] += vector.elements[0];
        this._at.elements[1] += vector.elements[1];
        this._at.elements[2] += vector.elements[2];

        this._updateViewMatrix();
    }

    moveForwards(movementX, movementZ, distance) {
        if (movementX === 0 && movementZ === 0) {
            return;
        } else {
            const forwardVec = new Vector3();
            forwardVec.elements[0] = this._at.elements[0] - this._eye.elements[0];
            forwardVec.elements[1] = this._at.elements[1] - this._eye.elements[1];
            forwardVec.elements[2] = this._at.elements[2] - this._eye.elements[2];

            const rotateTowardsMovement = new Matrix4();
            rotateTowardsMovement.setLookAt(0, 0, 0, -movementX, 0, movementZ, ...UP_VEC.elements);

            const rotatedForwardVec = rotateTowardsMovement.multiplyVector3(forwardVec);

            this._eye.elements[0] += rotatedForwardVec.elements[0] * distance;
            this._eye.elements[1] += rotatedForwardVec.elements[1] * distance;
            this._eye.elements[2] += rotatedForwardVec.elements[2] * distance;

            this._at.elements[0] += rotatedForwardVec.elements[0] * distance;
            this._at.elements[1] += rotatedForwardVec.elements[1] * distance;
            this._at.elements[2] += rotatedForwardVec.elements[2] * distance;

            this._updateViewMatrix();
        }
    }
}