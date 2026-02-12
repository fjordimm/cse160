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

    render(graphicsManager, cameraMatrix, parentMatrix) {
        const gl = graphicsManager.gl;

        const finalMatrix = new Matrix4();
        finalMatrix.multiply(parentMatrix);
        finalMatrix.multiply(this.matrix);
        finalMatrix.multiply(this.animationMatrix);
        gl.uniformMatrix4fv(graphicsManager.u_TransformMatrix, false, finalMatrix.elements);
        
        for (let shape of this._shapes) {
            shape.render(graphicsManager, cameraMatrix);
        }

        for (let child of this._children) {
            child.render(graphicsManager, cameraMatrix, finalMatrix);
        }
    }
}