import Component from "./Component.js";
import Cube from "./shapes/Cube.js";

const IDENTITY_MATRIX = new Matrix4();

export default class PointLight {
    constructor() {
        this._comp = new Component();
        {
            const s = new Cube([1, 1, 1, 1], null, 0);
            s.matrix.scale(0.25, 0.25, 0.25);
            this._comp.addShape(s);
        }

        this._pos = [0, 0, 0];
    }

    render(grm) {
        grm.gl.uniform3f(grm.u_PointLightPos, ...this._pos);

        this._comp.render(grm, IDENTITY_MATRIX);
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