import Component from "./Component.js";
import Sphere from "./shapes/Sphere.js";

const IDENTITY_MATRIX = new Matrix4();

export default class PointLight {
    constructor() {
        this._comp = new Component();
        {
            const s = new Sphere([1, 1, 1, 1], 6);
            s.matrix.scale(0.1, 0.1, 0.1);
            this._comp.addShape(s);
        }

        this._pos = [0, 0, 0];
    }

    render(grm) {
        grm.gl.uniform3f(grm.u_PointLightPos, ...this._pos);

        grm.gl.uniform1i(grm.u_SkipLighting, 1);
        this._comp.render(grm, IDENTITY_MATRIX);
        grm.gl.uniform1i(grm.u_SkipLighting, 0);
    }

    getPosition() {
        return this._pos;
    }

    setPosition(pos) {
        this._pos = [...pos];
        this._updatePos();
    }

    _updatePos() {
        this._comp.animationMatrix.setTranslate(...this._pos);
    }
}