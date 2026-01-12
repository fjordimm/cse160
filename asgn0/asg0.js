
var canvas = null;
var ctx = null;

// DrawTriangle.js (c) 2012 matsuda
function main() {
    // Retrieve <canvas> element
    canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return false;
    }

    // Get the rendering context for 2DCG
    ctx = canvas.getContext('2d');

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);

    handleDrawEvent();
}

function drawVector(v, color) {
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(200 + 20 * v.elements[0], 200 - 20 * v.elements[1]);
    ctx.stroke();
}

function handleDrawEvent() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);

    v1x = document.getElementById("v1-x-input").value;
    v1y = document.getElementById("v1-y-input").value;
    v2x = document.getElementById("v2-x-input").value;
    v2y = document.getElementById("v2-y-input").value;

    let v1 = new Vector3([v1x, v1y, 0]);
    drawVector(v1, "red");

    let v2 = new Vector3([v2x, v2y, 0]);
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);

    v1x = document.getElementById("v1-x-input").value;
    v1y = document.getElementById("v1-y-input").value;
    v2x = document.getElementById("v2-x-input").value;
    v2y = document.getElementById("v2-y-input").value;
    operation = document.getElementById("operation-selector").value;
    scalar = document.getElementById("scalar-input").value;

    let v1 = new Vector3([v1x, v1y, 0]);
    drawVector(v1, "red");

    let v2 = new Vector3([v2x, v2y, 0]);
    drawVector(v2, "blue");

    if (operation === "add") {
        let v3 = new Vector3();
        v3.set(v1);
        v3.add(v2);
        drawVector(v3, "green");
    } else if (operation === "sub") {
        let v3 = new Vector3();
        v3.set(v1);
        v3.sub(v2);
        drawVector(v3, "green");
    } else if (operation === "mul") {
        let v3 = new Vector3();
        v3.set(v1);
        v3.mul(scalar);
        drawVector(v3, "green");

        let v4 = new Vector3();
        v4.set(v2);
        v4.mul(scalar);
        drawVector(v4, "green");
    } else if (operation === "div") {
        let v3 = new Vector3();
        v3.set(v1);
        v3.div(scalar);
        drawVector(v3, "green");

        let v4 = new Vector3();
        v4.set(v2);
        v4.div(scalar);
        drawVector(v4, "green");
    } else {
        throw Error("Not a valid operation.");
    }
}
