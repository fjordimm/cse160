
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

    let v1 = new Vector3([1, 1, 0]);
    drawVector(v1, "red");
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

    xInput = document.getElementById("x-input").value;
    yInput = document.getElementById("y-input").value;

    let v1 = new Vector3([xInput, yInput, 0]);
    drawVector(v1, "red");
}
