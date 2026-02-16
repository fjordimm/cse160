const _reusableFinalMatrix = new Matrix4();

export default class Component {
    constructor() {
        this.matrix = new Matrix4();
        this.animationMatrix = new Matrix4();
        this._shapes = [];
        this._children = [];
    }

    addShape(shape) {
        this._shapes.push(shape);
    }

    addChild(child) {
        this._children.push(child);
    }

    render(grm, parentMatrix) {
        _reusableFinalMatrix.setIdentity();
        // _reusableFinalMatrix.multiply(this.animationMatrix);
        _reusableFinalMatrix.multiply(this.matrix);
        // _reusableFinalMatrix.multiply(parentMatrix);
        grm.gl.uniformMatrix4fv(grm.u_TransformMatrix, false, _reusableFinalMatrix.elements);
        
        for (let shape of this._shapes) {
            shape.render(grm);
        }

        for (let child of this._children) {
            child.render(grm, _reusableFinalMatrix);
        }
    }
}