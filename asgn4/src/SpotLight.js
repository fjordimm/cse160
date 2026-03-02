import Component from "./Component.js";
import Sphere from "./shapes/Sphere.js";

const IDENTITY_MATRIX = new Matrix4();
const FORWARD_VEC = new Vector3([0, 0, -1]);
const UP_VEC = new Vector3([0, 1, 0]);

const _reusableRotationMatrix = new Matrix4();

export default class SpotLight {
    constructor() {
        this._comp = new Component();
        {
            const s = new Sphere([0.5, 0.5, 0.5, 1], 6);
            s.matrix.scale(0.1, 0.1, 0.1);
            this._comp.addShape(s);
        }
        {
            const s = new Sphere([1, 1, 1, 1], 6);
            s.matrix.translate(0, 0, -0.04);
            s.matrix.scale(0.08, 0.08, 0.08);
            this._comp.addShape(s);
        }

        this._pos = new Vector3([0, 0, 0]);
        this._rotationVert = 0;
        this._rotationHoriz = 0;
        
        this._forwardVec = new Vector3(FORWARD_VEC);
    }

    render(grm) {
        grm.gl.uniform3f(grm.u_SpotLightPos, ...this._pos.elements);
        grm.gl.uniform3f(grm.u_SpotLightDir, ...this._forwardVec.elements);

        grm.gl.uniform1i(grm.u_SkipLighting, 1);
        this._comp.render(grm, IDENTITY_MATRIX);
        grm.gl.uniform1i(grm.u_SkipLighting, 0);
    }

    getPosition() {
        return [...this._pos.elements];
    }

    setPosition(pos) {
        this._pos.elements[0] = pos[0];
        this._pos.elements[1] = pos[1];
        this._pos.elements[2] = pos[2];

        this._comp.animationMatrix.setTranslate(...this._pos.elements);
    }

    setRotation(vert, horiz) {
        this._rotationVert = vert;
        this._rotationHoriz = horiz;

        _reusableRotationMatrix.setIdentity();
        _reusableRotationMatrix.rotate(this._rotationHoriz, 0, 1, 0);
        _reusableRotationMatrix.rotate(this._rotationVert, 1, 0, 0);
        this._forwardVec = _reusableRotationMatrix.multiplyVector3(FORWARD_VEC);

        this._comp.matrix.set(_reusableRotationMatrix);
    }
}