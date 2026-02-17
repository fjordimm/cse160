const FORWARD_VEC = new Vector3([0, 0, -1]);
const UP_VEC = new Vector3([0, 1, 0]);

const _reusableRotationMatrix = new Matrix4();

export default class Camera {
    constructor(fov, canvasWidth, canvasHeight, nearPlane, farPlane) {
        this._projectionMatrix = new Matrix4();
        this._projectionMatrix.setPerspective(fov, canvasWidth / canvasHeight, nearPlane, farPlane);

        this._pos = new Vector3([0, 0, 0]);
        this._rotationVert = 0;
        this._rotationHoriz = 0;

        this._viewMatrix = new Matrix4();
        this._updateViewMatrix();
    }

    _updateViewMatrix() {
        _reusableRotationMatrix.setIdentity();
        _reusableRotationMatrix.rotate(this._rotationHoriz, 0, 1, 0);
        _reusableRotationMatrix.rotate(this._rotationVert, 1, 0, 0);
        const atVec = _reusableRotationMatrix.multiplyVector3(FORWARD_VEC);
        
        atVec.elements[0] += this._pos.elements[0];
        atVec.elements[1] += this._pos.elements[1];
        atVec.elements[2] += this._pos.elements[2];

        this._viewMatrix.setLookAt(...this._pos.elements, ...atVec.elements, ...UP_VEC.elements);
    }

    getViewMatrix() {
        return this._viewMatrix;
    }

    getProjectionMatrix() {
        return this._projectionMatrix;
    }

    getPosition() {
        return [...this._pos.elements];
    }

    getForwards() {
        _reusableRotationMatrix.setIdentity();
        _reusableRotationMatrix.rotate(this._rotationHoriz, 0, 1, 0);
        _reusableRotationMatrix.rotate(this._rotationVert, 1, 0, 0);
        const forwardsVec = _reusableRotationMatrix.multiplyVector3(FORWARD_VEC);

        return [...forwardsVec.elements];
    }

    rotateVert(degrees) {
        this._rotationVert += degrees;
        if (this._rotationVert < -89) { this._rotationVert = -89; }
        if (this._rotationVert > 89) { this._rotationVert = 89; }
        this._updateViewMatrix();
    }

    rotateHoriz(degrees) {
        this._rotationHoriz += degrees;
        this._updateViewMatrix();
    }

    move(vector) {
        this._pos.elements[0] += vector.elements[0];
        this._pos.elements[1] += vector.elements[1];
        this._pos.elements[2] += vector.elements[2];
        this._updateViewMatrix();
    }

    setX(val) {
        this._pos.elements[0] = val;
        this._updateViewMatrix();
    }

    setY(val) {
        this._pos.elements[1] = val;
        this._updateViewMatrix();
    }

    setZ(val) {
        this._pos.elements[2] = val;
        this._updateViewMatrix();
    }

    moveForwards(movementVec, useVertRotation) {
        if (movementVec[0] === 0 && movementVec[1] === 0 && movementVec[2] === 0) {
            return;
        } else {
            _reusableRotationMatrix.setIdentity();
            _reusableRotationMatrix.rotate(this._rotationHoriz, 0, 1, 0);
            if (useVertRotation) { _reusableRotationMatrix.rotate(this._rotationVert, 1, 0, 0); }
            const rotatedMovementVec = _reusableRotationMatrix.multiplyVector3(movementVec);

            this._pos.elements[0] += rotatedMovementVec.elements[0];
            this._pos.elements[1] += rotatedMovementVec.elements[1];
            this._pos.elements[2] += rotatedMovementVec.elements[2];
            this._updateViewMatrix();
        }
    }
}