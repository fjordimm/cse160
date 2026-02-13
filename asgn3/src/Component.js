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
        const finalMatrix = new Matrix4();
        finalMatrix.multiply(this.animationMatrix);
        finalMatrix.multiply(this.matrix);
        finalMatrix.multiply(parentMatrix);
        grm.gl.uniformMatrix4fv(grm.u_TransformMatrix, false, finalMatrix.elements);
        
        for (let shape of this._shapes) {
            shape.render(grm);
        }

        for (let child of this._children) {
            child.render(grm, finalMatrix);
        }
    }
}