import GraphicsManager from "./GraphicsManager.js";

///// Main /////

// Main Globals
let graphicsManager;
let listOfComponents;
let globalCameraMatrixRotY;
let globalCameraMatrixRotX;
let globalCameraMatrixZoom;
let globalCameraMatrix;
let frameCounter;
let animalMovement; // One of "sliders", "animation", or "poke".
let animationTimeElapsed;
let pokeTimeElapsed;
const MIN_FRAME_LENGTH = 16; // 16 for 60fps.
const GLOBAL_ROTATION_SPEED = 150.0;
const GLOBAL_SCROLL_SPEED = 15.0;
const _IDENTITY_MATRIX = new Matrix4();

export async function main() {
    graphicsManager = new GraphicsManager();
    graphicsManager.setup();

    graphicsManager.gl.enable(graphicsManager.gl.DEPTH_TEST);
    graphicsManager.gl.enable(graphicsManager.gl.CULL_FACE);
    graphicsManager.gl.cullFace(graphicsManager.gl.BACK);
    graphicsManager.gl.frontFace(graphicsManager.gl.CCW);

    graphicsManager.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    graphicsManager.gl.clear(graphicsManager.gl.COLOR_BUFFER_BIT | graphicsManager.gl.DEPTH_BUFFER_BIT);

    listOfComponents = [];
    globalCameraMatrixRotY = new Matrix4();
    globalCameraMatrixRotX = new Matrix4();
    globalCameraMatrixZoom = new Matrix4();
    globalCameraMatrix = new Matrix4();
    frameCounter = 0;
    animalMovement = "animation";
    animationTimeElapsed = 0;
    pokeTimeElapsed = 0;

    setupComponents();
    // renderAllComponents();

    graphicsManager.canvas.onmousemove = function (ev) { handleMouseMove(ev); };
    graphicsManager.canvas.onmousedown = function (ev) { handleMouseClick(ev); };
    window.addEventListener("wheel", function (ev) { handleScroll(ev); });

    countFramesAndUpdateDisplay();

    let startTime = Date.now();
    let previousTime = Date.now();
    let previousDeltaTime = 0;
    while (true) {
        await tick(previousDeltaTime, Date.now() - startTime);

        // Waste remaining time if it was faster than MIN_FRAME_LENGTH to enforce a maximum fps.
        let remainingTime = MIN_FRAME_LENGTH - (Date.now() - previousTime);
        if (remainingTime > 0) {
            await new Promise(r => setTimeout(r, remainingTime));
        }

        previousDeltaTime = Date.now() - previousTime;
        previousTime = Date.now();

        frameCounter++;
    }
}

window.main = main;

function updateGlobalCameraMatrix() {
    globalCameraMatrix.setIdentity();
    globalCameraMatrix.multiply(globalCameraMatrixZoom);
    globalCameraMatrix.multiply(globalCameraMatrixRotX);
    globalCameraMatrix.multiply(globalCameraMatrixRotY);
}

///// Animal-Specific /////

const COLOR_FUR1 = [0.416, 0.227, 0.161, 1];
const COLOR_FUR2 = [0.478, 0.29, 0.22, 1];
const COLOR_NOSE = [0.529, 0.294, 0.212, 1];
const COLOR_EYE = [0.1, 0.1, 0.1, 1];
const COLOR_HORN = [0.224, 0.196, 0.176, 1];
const COLOR_FOOT = [0.149, 0.133, 0.129, 1];

let oxBody;
let oxBackLeftLeg;
let oxBackLeftLegLower;
let oxBackLeftLegLowerFoot;
let oxBackRightLeg;
let oxBackRightLegLower;
let oxBackRightLegLowerFoot;
let oxFrontLeftLeg;
let oxFrontLeftLegLower;
let oxFrontLeftLegLowerFoot;
let oxFrontRightLeg;
let oxFrontRightLegLower;
let oxFrontRightLegLowerFoot;
let oxHead;

function setupComponents() {
    oxBody = new Component();
    oxBackLeftLeg = new Component();
    oxBackLeftLegLower = new Component();
    oxBackLeftLegLowerFoot = new Component();
    oxBackRightLeg = new Component();
    oxBackRightLegLower = new Component();
    oxBackRightLegLowerFoot = new Component();
    oxFrontLeftLeg = new Component();
    oxFrontLeftLegLower = new Component();
    oxFrontLeftLegLowerFoot = new Component();
    oxFrontRightLeg = new Component();
    oxFrontRightLegLower = new Component();
    oxFrontRightLegLowerFoot = new Component();
    oxHead = new Component();

    // body
    {
        const s = new CylinderHoriz(COLOR_FUR1, 30);
        s.matrix.scale(0.2, 0.2, 0.25);
        oxBody.addShape(s);
    }
    {
        const s = new CylinderHoriz(COLOR_FUR1, 30);
        s.matrix.translate(0, 0.015, 0.1);
        s.matrix.scale(0.18, 0.18, 0.5);
        oxBody.addShape(s);
    }
    {
        const s = new CylinderHoriz(COLOR_FUR1, 30);
        s.matrix.translate(0, 0.03, -0.4);
        s.matrix.scale(0.15, 0.15, 0.08);
        oxBody.addShape(s);
    }
    {
        // back left leg
        {
            oxBody.addChild(oxBackLeftLeg);
            oxBackLeftLeg.matrix.translate(0.1, 0, 0.5);
            {
                const s = new CylinderVert(COLOR_FUR1, 10);
                s.matrix.translate(0, -0.12, 0);
                s.matrix.scale(0.075, 0.12, 0.075);
                oxBackLeftLeg.addShape(s);
            }
            {
                const s = new CylinderVert(COLOR_FUR1, 10);
                s.matrix.translate(0, -0.15, 0);
                s.matrix.scale(0.06, 0.15, 0.06);
                oxBackLeftLeg.addShape(s);
            }
            {
                // back left leg lower
                {
                    oxBackLeftLeg.addChild(oxBackLeftLegLower);
                    oxBackLeftLegLower.matrix.translate(0, -0.3, 0);
                    {
                        const s = new CylinderVert(COLOR_FUR2, 8);
                        s.matrix.translate(0, -0.07, 0);
                        s.matrix.scale(0.04, 0.1, 0.04);
                        oxBackLeftLegLower.addShape(s);
                    }
                    {
                        // back left leg lower foot
                        {
                            oxBackLeftLegLower.addChild(oxBackLeftLegLowerFoot);
                            oxBackLeftLegLowerFoot.matrix.translate(0, -0.17, 0);
                            {
                                const s = new Cube(COLOR_FOOT);
                                s.matrix.scale(0.045, 0.02, 0.05);
                                oxBackLeftLegLowerFoot.addShape(s);
                            }
                            {
                                const s = new Cube(COLOR_FOOT);
                                s.matrix.translate(0.015, 0, 0);
                                s.matrix.rotate(-15, 0, 1, 0);
                                s.matrix.translate(0, 0, -0.06);
                                s.matrix.scale(0.0225, 0.02, 0.0225);
                                oxBackLeftLegLowerFoot.addShape(s);
                            }
                            {
                                const s = new Cube(COLOR_FOOT);
                                s.matrix.translate(-0.015, 0, 0);
                                s.matrix.rotate(15, 0, 1, 0);
                                s.matrix.translate(0, 0, -0.06);
                                s.matrix.scale(0.0225, 0.02, 0.0225);
                                oxBackLeftLegLowerFoot.addShape(s);
                            }
                        }
                    }
                }
            }
        }
        // back right leg
        {
            oxBody.addChild(oxBackRightLeg);
            oxBackRightLeg.matrix.translate(-0.1, 0, 0.5);
            {
                const s = new CylinderVert(COLOR_FUR1, 10);
                s.matrix.translate(0, -0.12, 0);
                s.matrix.scale(0.075, 0.12, 0.075);
                oxBackRightLeg.addShape(s);
            }
            {
                const s = new CylinderVert(COLOR_FUR1, 10);
                s.matrix.translate(0, -0.15, 0);
                s.matrix.scale(0.06, 0.15, 0.06);
                oxBackRightLeg.addShape(s);
            }
            {
                // back right leg lower
                {
                    oxBackRightLeg.addChild(oxBackRightLegLower);
                    oxBackRightLegLower.matrix.translate(0, -0.3, 0);
                    {
                        const s = new CylinderVert(COLOR_FUR2, 8);
                        s.matrix.translate(0, -0.07, 0);
                        s.matrix.scale(0.04, 0.1, 0.04);
                        oxBackRightLegLower.addShape(s);
                    }
                    {
                        // back right leg lower foot
                        {
                            oxBackRightLegLower.addChild(oxBackRightLegLowerFoot);
                            oxBackRightLegLowerFoot.matrix.translate(0, -0.17, 0);
                            {
                                const s = new Cube(COLOR_FOOT);
                                s.matrix.scale(0.045, 0.02, 0.05);
                                oxBackRightLegLowerFoot.addShape(s);
                            }
                            {
                                const s = new Cube(COLOR_FOOT);
                                s.matrix.translate(0.015, 0, 0);
                                s.matrix.rotate(-15, 0, 1, 0);
                                s.matrix.translate(0, 0, -0.06);
                                s.matrix.scale(0.0225, 0.02, 0.0225);
                                oxBackRightLegLowerFoot.addShape(s);
                            }
                            {
                                const s = new Cube(COLOR_FOOT);
                                s.matrix.translate(-0.015, 0, 0);
                                s.matrix.rotate(15, 0, 1, 0);
                                s.matrix.translate(0, 0, -0.06);
                                s.matrix.scale(0.0225, 0.02, 0.0225);
                                oxBackRightLegLowerFoot.addShape(s);
                            }
                        }
                    }
                }
            }
        }
        // front left leg
        {
            oxBody.addChild(oxFrontLeftLeg);
            oxFrontLeftLeg.matrix.translate(0.1, -0.1, -0.15);
            {
                const s = new CylinderVert(COLOR_FUR1, 10);
                s.matrix.translate(0, -0.1, 0);
                s.matrix.scale(0.06, 0.1, 0.06);
                oxFrontLeftLeg.addShape(s);
            }
            {
                // front left leg lower
                oxFrontLeftLeg.addChild(oxFrontLeftLegLower);
                oxFrontLeftLegLower.matrix.translate(0, -0.2, 0);
                {
                    const s = new CylinderVert(COLOR_FUR2, 8);
                    s.matrix.translate(0, -0.07, 0);
                    s.matrix.scale(0.045, 0.1, 0.045);
                    oxFrontLeftLegLower.addShape(s);
                }
                {
                    // front left leg lower foot
                    {
                        oxFrontLeftLegLower.addChild(oxFrontLeftLegLowerFoot);
                        oxFrontLeftLegLowerFoot.matrix.translate(0, -0.17, 0);
                        {
                            const s = new Cube(COLOR_FOOT);
                            s.matrix.scale(0.045, 0.02, 0.05);
                            oxFrontLeftLegLowerFoot.addShape(s);
                        }
                        {
                            const s = new Cube(COLOR_FOOT);
                            s.matrix.translate(0.015, 0, 0);
                            s.matrix.rotate(-15, 0, 1, 0);
                            s.matrix.translate(0, 0, -0.06);
                            s.matrix.scale(0.0225, 0.02, 0.0225);
                            oxFrontLeftLegLowerFoot.addShape(s);
                        }
                        {
                            const s = new Cube(COLOR_FOOT);
                            s.matrix.translate(-0.015, 0, 0);
                            s.matrix.rotate(15, 0, 1, 0);
                            s.matrix.translate(0, 0, -0.06);
                            s.matrix.scale(0.0225, 0.02, 0.0225);
                            oxFrontLeftLegLowerFoot.addShape(s);
                        }
                    }
                }
            }
        }
        // front right leg
        {
            oxBody.addChild(oxFrontRightLeg);
            oxFrontRightLeg.matrix.translate(-0.1, -0.1, -0.15);
            {
                const s = new CylinderVert(COLOR_FUR1, 10);
                s.matrix.translate(0, -0.1, 0);
                s.matrix.scale(0.06, 0.1, 0.06);
                oxFrontRightLeg.addShape(s);
            }
            {
                // front right leg lower
                oxFrontRightLeg.addChild(oxFrontRightLegLower);
                oxFrontRightLegLower.matrix.translate(0, -0.2, 0);
                {
                    const s = new CylinderVert(COLOR_FUR2, 8);
                    s.matrix.translate(0, -0.07, 0);
                    s.matrix.scale(0.045, 0.1, 0.045);
                    oxFrontRightLegLower.addShape(s);
                }
                {
                    // front right leg lower foot
                    {
                        oxFrontRightLegLower.addChild(oxFrontRightLegLowerFoot);
                        oxFrontRightLegLowerFoot.matrix.translate(0, -0.17, 0);
                        {
                            const s = new Cube(COLOR_FOOT);
                            s.matrix.scale(0.045, 0.02, 0.05);
                            oxFrontRightLegLowerFoot.addShape(s);
                        }
                        {
                            const s = new Cube(COLOR_FOOT);
                            s.matrix.translate(0.015, 0, 0);
                            s.matrix.rotate(-15, 0, 1, 0);
                            s.matrix.translate(0, 0, -0.06);
                            s.matrix.scale(0.0225, 0.02, 0.0225);
                            oxFrontRightLegLowerFoot.addShape(s);
                        }
                        {
                            const s = new Cube(COLOR_FOOT);
                            s.matrix.translate(-0.015, 0, 0);
                            s.matrix.rotate(15, 0, 1, 0);
                            s.matrix.translate(0, 0, -0.06);
                            s.matrix.scale(0.0225, 0.02, 0.0225);
                            oxFrontRightLegLowerFoot.addShape(s);
                        }
                    }
                }
            }
        }
        // head
        {
            oxBody.addChild(oxHead);
            oxHead.matrix.translate(0, 0.09, -0.48);
            {
                const s = new Cube(COLOR_FUR1);
                s.matrix.translate(0, 0, 0);
                s.matrix.scale(0.1, 0.16, 0.06);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_FUR1);
                s.matrix.translate(0, -0.02, -0.09);
                s.matrix.scale(0.08, 0.12, 0.06);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_FUR1);
                s.matrix.translate(0, -0.04, -0.15);
                s.matrix.scale(0.06, 0.08, 0.06);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_NOSE);
                s.matrix.translate(0, -0.06, -0.21);
                s.matrix.scale(0.04, 0.04, 0.02);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_EYE);
                s.matrix.translate(0.07, 0.05, -0.1);
                s.matrix.scale(0.02, 0.02, 0.02);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_EYE);
                s.matrix.translate(-0.07, 0.05, -0.1);
                s.matrix.scale(0.02, 0.02, 0.02);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_HORN);
                s.matrix.translate(0, 0.15, -0.035);
                s.matrix.scale(0.09, 0.03, 0.03);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_HORN);
                s.matrix.translate(0.08, 0.15, -0.035);
                s.matrix.scale(0.05, 0.05, 0.05);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_HORN);
                s.matrix.translate(0.1, 0.15, -0.035);
                s.matrix.rotate(15, 0, 1, 0);
                s.matrix.rotate(-10, 0, 0, 1);
                s.matrix.translate(0.09, 0, 0);
                s.matrix.scale(0.09, 0.025, 0.035);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_HORN);
                s.matrix.translate(0.12, 0.13, -0.04);
                s.matrix.rotate(15, 0, 1, 0);
                s.matrix.translate(0.15, 0, 0);
                s.matrix.rotate(-10, 0, 0, 1);
                s.matrix.rotate(45, 0, 0, 1);
                s.matrix.translate(0.07, 0, 0);
                s.matrix.scale(0.09, 0.025, 0.035);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_HORN);
                s.matrix.translate(-0.08, 0.15, -0.035);
                s.matrix.scale(0.05, 0.05, 0.05);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_HORN);
                s.matrix.translate(-0.1, 0.15, -0.035);
                s.matrix.rotate(-15, 0, 1, 0);
                s.matrix.rotate(10, 0, 0, 1);
                s.matrix.translate(-0.09, 0, 0);
                s.matrix.scale(0.09, 0.025, 0.035);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_HORN);
                s.matrix.translate(-0.12, 0.13, -0.04);
                s.matrix.rotate(-15, 0, 1, 0);
                s.matrix.translate(-0.15, 0, 0);
                s.matrix.rotate(10, 0, 0, 1);
                s.matrix.rotate(-45, 0, 0, 1);
                s.matrix.translate(-0.07, 0, 0);
                s.matrix.scale(0.09, 0.025, 0.035);
                oxHead.addShape(s);
            }
        }
    }

    listOfComponents.push(oxBody);
}

async function tick(deltaTime, totalTimeElapsed) {
    if (animalMovement === "sliders") {
        doAnimalMovementSliders(deltaTime, totalTimeElapsed);
    } else if (animalMovement === "animation") {
        doAnimalMovementAnimation(deltaTime, totalTimeElapsed);
    } else if (animalMovement === "poke") {
        doAnimalMovementPoke(deltaTime, totalTimeElapsed);
    } else {
        throw new Error("Invalid value for animalMovement.");
    }

    renderAllComponents();
}

function doAnimalMovementSliders(deltaTime, totalTimeElapsed) {
    oxBody.animationMatrix.setIdentity();
    oxBackLeftLeg.animationMatrix.setRotate(-getSliderValue("slider-back-left-leg"), 1, 0, 0);
    oxBackLeftLegLower.animationMatrix.setRotate(-getSliderValue("slider-back-left-leg-lower"), 1, 0, 0);
    oxBackLeftLegLowerFoot.animationMatrix.setRotate(getSliderValue("slider-back-left-leg-lower-foot-y"), 0, 1, 0);
    oxBackLeftLegLowerFoot.animationMatrix.rotate(-getSliderValue("slider-back-left-leg-lower-foot-x"), 1, 0, 0);
    oxBackRightLeg.animationMatrix.setRotate(-getSliderValue("slider-back-right-leg"), 1, 0, 0);
    oxBackRightLegLower.animationMatrix.setRotate(-getSliderValue("slider-back-right-leg-lower"), 1, 0, 0);
    oxBackRightLegLowerFoot.animationMatrix.setRotate(getSliderValue("slider-back-right-leg-lower-foot-y"), 0, 1, 0);
    oxBackRightLegLowerFoot.animationMatrix.rotate(-getSliderValue("slider-back-right-leg-lower-foot-x"), 1, 0, 0);
    oxFrontLeftLeg.animationMatrix.setRotate(-getSliderValue("slider-front-left-leg"), 1, 0, 0);
    oxFrontLeftLegLower.animationMatrix.setRotate(-getSliderValue("slider-front-left-leg-lower"), 1, 0, 0);
    oxFrontLeftLegLowerFoot.animationMatrix.setRotate(getSliderValue("slider-front-left-leg-lower-foot-y"), 0, 1, 0);
    oxFrontLeftLegLowerFoot.animationMatrix.rotate(-getSliderValue("slider-front-left-leg-lower-foot-x"), 1, 0, 0);
    oxFrontRightLeg.animationMatrix.setRotate(-getSliderValue("slider-front-right-leg"), 1, 0, 0);
    oxFrontRightLegLower.animationMatrix.setRotate(-getSliderValue("slider-front-right-leg-lower"), 1, 0, 0);
    oxFrontRightLegLowerFoot.animationMatrix.setRotate(getSliderValue("slider-front-right-leg-lower-foot-y"), 0, 1, 0);
    oxFrontRightLegLowerFoot.animationMatrix.rotate(-getSliderValue("slider-front-right-leg-lower-foot-x"), 1, 0, 0);
    oxHead.animationMatrix.setRotate(getSliderValue("slider-head-y"), 0, 1, 0);
    oxHead.animationMatrix.rotate(getSliderValue("slider-head-x"), 1, 0, 0);
    oxHead.animationMatrix.rotate(getSliderValue("slider-head-z"), 0, 0, 1);
}

const ANIMATION_PERIOD = 750; // In milliseconds

function doAnimalMovementAnimation(deltaTime, totalTimeElapsed) {
    animationTimeElapsed += deltaTime;

    let animationSin = Math.sin(Math.PI * animationTimeElapsed / ANIMATION_PERIOD);

    oxBody.animationMatrix.setIdentity();
    oxBackLeftLeg.animationMatrix.setRotate(30 * animationSin, 1, 0, 0);
    oxBackLeftLegLower.animationMatrix.setRotate(-15 - 15 * animationSin, 1, 0, 0);
    oxBackLeftLegLowerFoot.animationMatrix.setIdentity();
    oxBackRightLeg.animationMatrix.setRotate(-30 * animationSin, 1, 0, 0);
    oxBackRightLegLower.animationMatrix.setRotate(-15 + 15 * animationSin, 1, 0, 0);
    oxBackRightLegLowerFoot.animationMatrix.setIdentity();
    oxFrontLeftLeg.animationMatrix.setRotate(-30 * animationSin, 1, 0, 0);
    oxFrontLeftLegLower.animationMatrix.setRotate(-15 + 15 * animationSin, 1, 0, 0);
    oxFrontLeftLegLowerFoot.animationMatrix.setIdentity();
    oxFrontRightLeg.animationMatrix.setRotate(30 * animationSin, 1, 0, 0);
    oxFrontRightLegLower.animationMatrix.setRotate(-15 - 15 * animationSin, 1, 0, 0);
    oxFrontRightLegLowerFoot.animationMatrix.setIdentity();
    oxHead.animationMatrix.setRotate(-5 * animationSin, 0, 0, 1);
}

const POKE_ANIMATION_PERIOD = 600; // In milliseconds

function doAnimalMovementPoke(deltaTime, totalTimeElapsed) {
    pokeTimeElapsed += deltaTime;

    let animationSin = Math.sin(Math.PI * pokeTimeElapsed / POKE_ANIMATION_PERIOD);

    if (pokeTimeElapsed <= POKE_ANIMATION_PERIOD) {
        oxBody.animationMatrix.setTranslate(0, -0.06 * animationSin, 0);
        oxBackLeftLeg.animationMatrix.setRotate(45 * animationSin, 1, 0, 0);
        oxBackLeftLegLower.animationMatrix.setRotate(-45 * animationSin, 1, 0, 0);
        oxBackLeftLegLowerFoot.animationMatrix.setIdentity();
        oxBackRightLeg.animationMatrix.setRotate(45 * animationSin, 1, 0, 0);
        oxBackRightLegLower.animationMatrix.setRotate(-45 * animationSin, 1, 0, 0);
        oxBackRightLegLowerFoot.animationMatrix.setIdentity();
        oxFrontLeftLeg.animationMatrix.setRotate(45 * animationSin, 1, 0, 0);
        oxFrontLeftLegLower.animationMatrix.setRotate(-45 * animationSin, 1, 0, 0);
        oxFrontLeftLegLowerFoot.animationMatrix.setIdentity();
        oxFrontRightLeg.animationMatrix.setRotate(45 * animationSin, 1, 0, 0);
        oxFrontRightLegLower.animationMatrix.setRotate(-45 * animationSin, 1, 0, 0);
        oxFrontRightLegLowerFoot.animationMatrix.setIdentity();
        oxHead.animationMatrix.setIdentity();
    } else {
        oxBody.animationMatrix.setTranslate(0, 0.001 * (pokeTimeElapsed - POKE_ANIMATION_PERIOD), 0);
        oxBackLeftLeg.animationMatrix.setIdentity();
        oxBackLeftLegLower.animationMatrix.setIdentity();
        oxBackLeftLegLowerFoot.animationMatrix.setIdentity();
        oxBackRightLeg.animationMatrix.setIdentity();
        oxBackRightLegLower.animationMatrix.setIdentity();
        oxBackRightLegLowerFoot.animationMatrix.setIdentity();
        oxFrontLeftLeg.animationMatrix.setIdentity();
        oxFrontLeftLegLower.animationMatrix.setIdentity();
        oxFrontLeftLegLowerFoot.animationMatrix.setIdentity();
        oxFrontRightLeg.animationMatrix.setIdentity();
        oxFrontRightLegLower.animationMatrix.setIdentity();
        oxFrontRightLegLowerFoot.animationMatrix.setIdentity();
        oxHead.animationMatrix.setIdentity();
    }
}

///// HTML Interface Stuff /////

// HTML Interface Globals
let lastMouseX = 0;
let lastMouseY = 0;

function convertCoordsEventToGL(ev) {
    let x = ev.clientX; // x coordinate of a mouse pointer
    let y = ev.clientY; // y coordinate of a mouse pointer
    let rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - graphicsManager.canvas.width / 2) / (graphicsManager.canvas.width / 2);
    y = (graphicsManager.canvas.height / 2 - (y - rect.top)) / (graphicsManager.canvas.height / 2);

    return [x, y];
}

function handleMouseMove(ev) {
    let [x, y] = convertCoordsEventToGL(ev);
    if (ev.buttons === 1) {
        let dx = x - lastMouseX;
        let dy = y - lastMouseY;

        globalCameraMatrixRotX.rotate(GLOBAL_ROTATION_SPEED * dy, 1, 0, 0);
        globalCameraMatrixRotY.rotate(-GLOBAL_ROTATION_SPEED * dx, 0, 1, 0);
        updateGlobalCameraMatrix();
    }

    lastMouseX = x;
    lastMouseY = y;
}

function handleMouseClick(ev) {
    if (ev.shiftKey) {
        animalMovement = "poke";
        pokeTimeElapsed = 0;
    }
}

function handleScroll(ev) {
    let scale = 1 - GLOBAL_SCROLL_SPEED * ev.deltaY / 10000;

    globalCameraMatrixZoom.scale(scale, scale, scale);
    updateGlobalCameraMatrix();
}

function handleRotationSlider(angle) {
    globalCameraMatrixRotY.setRotate(-angle, 0, 1, 0);
    updateGlobalCameraMatrix();
}

async function countFramesAndUpdateDisplay() {
    while (true) {
        frameCounter = 0;
        await new Promise(r => setTimeout(r, 1000));
        fpsdisplay.innerHTML = `${frameCounter}`;
    }
}

function getSliderValue(name) {
    return document.getElementById(name).value;
}

function handleStartAnimation() {
    animalMovement = "animation";
    animationTimeElapsed = 0;
}

function handleStopAnimation() {
    animalMovement = "sliders";
}

///// Rendering /////

function renderAllComponents() {
    graphicsManager.gl.clear(graphicsManager.gl.COLOR_BUFFER_BIT | graphicsManager.gl.DEPTH_BUFFER_BIT);

    for (let component of listOfComponents) {
        component.render(_IDENTITY_MATRIX);
    }
}

class Cube {
    constructor(color) {
        this._color = color;
        // Fake shading
        this._color_top = [this._color[0], this._color[1], this._color[2], this._color[3]];
        this._color_front = [this._color[0] * 0.80, this._color[1] * 0.80, this._color[2] * 0.80, this._color[3]];
        this._color_right = [this._color[0] * 0.84, this._color[1] * 0.84, this._color[2] * 0.84, this._color[3]];
        this._color_back = [this._color[0] * 0.82, this._color[1] * 0.82, this._color[2] * 0.82, this._color[3]];
        this._color_left = [this._color[0] * 0.86, this._color[1] * 0.86, this._color[2] * 0.92, this._color[3]];
        this._color_bottom = [this._color[0] * 0.5, this._color[1] * 0.5, this._color[2] * 0.5, this._color[3]];
    
        this.matrix = new Matrix4();
    }

    render() {
        graphicsManager.gl.uniformMatrix4fv(graphicsManager.u_GlobalCameraMatrix, false, globalCameraMatrix.elements);
        graphicsManager.gl.uniformMatrix4fv(graphicsManager.u_ModelMatrix, false, this.matrix.elements);

        graphicsManager.gl.uniform4f(graphicsManager.u_FragColor, ...this._color_top);
        drawTriangle([-1, 1, -1, 1, 1, -1, -1, 1, 1]);
        drawTriangle([1, 1, 1, -1, 1, 1, 1, 1, -1]);
        graphicsManager.gl.uniform4f(graphicsManager.u_FragColor, ...this._color_front);
        drawTriangle([-1, -1, -1, 1, -1, -1, -1, 1, -1]);
        drawTriangle([1, 1, -1, -1, 1, -1, 1, -1, -1]);
        graphicsManager.gl.uniform4f(graphicsManager.u_FragColor, ...this._color_right);
        drawTriangle([1, -1, -1, 1, -1, 1, 1, 1, -1]);
        drawTriangle([1, 1, 1, 1, 1, -1, 1, -1, 1]);
        graphicsManager.gl.uniform4f(graphicsManager.u_FragColor, ...this._color_back);
        drawTriangle([1, -1, 1, -1, -1, 1, 1, 1, 1]);
        drawTriangle([-1, 1, 1, 1, 1, 1, -1, -1, 1]);
        graphicsManager.gl.uniform4f(graphicsManager.u_FragColor, ...this._color_left);
        drawTriangle([-1, -1, 1, -1, -1, -1, -1, 1, 1]);
        drawTriangle([-1, 1, -1, -1, 1, 1, -1, -1, -1]);
        graphicsManager.gl.uniform4f(graphicsManager.u_FragColor, ...this._color_bottom);
        drawTriangle([-1, -1, 1, 1, -1, 1, -1, -1, -1]);
        drawTriangle([1, -1, -1, -1, -1, -1, 1, -1, 1]);
    }
}

class CylinderVert {
    constructor(color, segments) {
        this._color = color;
        // Fake shading
        this._color_top = [this._color[0], this._color[1], this._color[2], this._color[3]];
        this._color_sides = [];
        {
            const segAngle = 2 * Math.PI / segments;
            for (let seg = 0; seg < segments; seg++) {
                let shade = Math.cos(seg * segAngle);
                shade = (shade + 1) / 2; // Changes range from [-1, 1] to [0, 1]
                shade = 0.7 + shade * 0.16; // Changes range from [0, 1] to [0.7, 0.86]
                this._color_sides[seg] = [this._color[0] * shade, this._color[1] * shade, this._color[2] * shade, this._color[3]];
            }
        }
        this._color_bottom = [this._color[0] * 0.5, this._color[1] * 0.5, this._color[2] * 0.5, this._color[3]];
    
        this._segments = segments;

        this.matrix = new Matrix4();
    }

    render() {
        graphicsManager.gl.uniformMatrix4fv(graphicsManager.u_GlobalCameraMatrix, false, globalCameraMatrix.elements);
        graphicsManager.gl.uniformMatrix4fv(graphicsManager.u_ModelMatrix, false, this.matrix.elements);

        const segAngle = 2 * Math.PI / this._segments;
        for (let seg = 0; seg < this._segments; seg++) {
            const angle1 = seg * segAngle;
            const angle2 = (seg + 1) * segAngle;

            const x1 = Math.cos(angle1);
            const z1 = Math.sin(angle1);

            const x2 = Math.cos(angle2);
            const z2 = Math.sin(angle2);

            graphicsManager.gl.uniform4f(graphicsManager.u_FragColor, ...this._color_top);
            drawTriangle([
                0,  1, 0,
                x1, 1, z1,
                x2, 1, z2
            ]);

            graphicsManager.gl.uniform4f(graphicsManager.u_FragColor, ...this._color_sides[seg]);
            drawTriangle([
                x1, -1, z1,
                x2, -1, z2,
                x1,  1, z1
            ]);
            drawTriangle([
                x2,  1, z2,
                x1,  1, z1,
                x2, -1, z2
            ]);

            graphicsManager.gl.uniform4f(graphicsManager.u_FragColor, ...this._color_bottom);
            drawTriangle([
                0,  -1, 0,
                x2, -1, z2,
                x1, -1, z1
            ]);
        }
    }
}

class CylinderHoriz {
    constructor(color, segments) {
        this._color = color;
        // Fake shading
        this._color_front = [this._color[0] * 0.80, this._color[1] * 0.80, this._color[2] * 0.80, this._color[3]];
        this._color_sides = [];
        {
            const segAngle = 2 * Math.PI / segments;
            for (let seg = 0; seg < segments; seg++) {
                let shade = Math.sin(seg * segAngle);
                shade = (shade + 1) / 2; // Changes range from [-1, 1] to [0, 1]
                shade = (shade + 1) / 2; // Changes range from [0, 1] to [0.5, 1]
                this._color_sides[seg] = [this._color[0] * shade, this._color[1] * shade, this._color[2] * shade, this._color[3]];
            }
        }
        this._color_back = [this._color[0] * 0.82, this._color[1] * 0.82, this._color[2] * 0.82, this._color[3]];
    
        this._segments = segments;

        this.matrix = new Matrix4();
    }

    render() {
        graphicsManager.gl.uniformMatrix4fv(graphicsManager.u_GlobalCameraMatrix, false, globalCameraMatrix.elements);
        graphicsManager.gl.uniformMatrix4fv(graphicsManager.u_ModelMatrix, false, this.matrix.elements);

        const segAngle = 2 * Math.PI / this._segments;
        for (let seg = 0; seg < this._segments; seg++) {
            const angle1 = seg * segAngle;
            const angle2 = (seg + 1) * segAngle;

            const x1 = Math.cos(angle1);
            const y1 = Math.sin(angle1);

            const x2 = Math.cos(angle2);
            const y2 = Math.sin(angle2);

            graphicsManager.gl.uniform4f(graphicsManager.u_FragColor, ...this._color_front);
            drawTriangle([
                0,  0,  -1,
                x1, y1, -1,
                x2, y2, -1
            ]);

            graphicsManager.gl.uniform4f(graphicsManager.u_FragColor, ...this._color_sides[seg]);
            drawTriangle([
                x1, y1,  1,
                x2, y2,  1,
                x1, y1, -1
            ]);
            drawTriangle([
                x2, y2, -1,
                x1, y1, -1,
                x2, y2,  1
            ]);

            graphicsManager.gl.uniform4f(graphicsManager.u_FragColor, ...this._color_back);
            drawTriangle([
                0,  0,  1,
                x2, y2, 1,
                x1, y1, 1
            ]);
        }
    }
}

function drawTriangle(vertices) {
    graphicsManager.gl.bindBuffer(graphicsManager.gl.ARRAY_BUFFER, graphicsManager.vertexBuffer);
    graphicsManager.gl.bufferData(graphicsManager.gl.ARRAY_BUFFER, new Float32Array(vertices), graphicsManager.gl.DYNAMIC_DRAW);
    graphicsManager.gl.vertexAttribPointer(graphicsManager.a_Position, 3, graphicsManager.gl.FLOAT, false, 0, 0);
    graphicsManager.gl.enableVertexAttribArray(graphicsManager.a_Position);

    graphicsManager.gl.drawArrays(graphicsManager.gl.TRIANGLES, 0, 3);
}

class Component {
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

    render(parentMatrix) {
        const finalMatrix = new Matrix4();
        finalMatrix.multiply(parentMatrix);
        finalMatrix.multiply(this.matrix);
        finalMatrix.multiply(this.animationMatrix);
        graphicsManager.gl.uniformMatrix4fv(graphicsManager.u_TransformMatrix, false, finalMatrix.elements);
        
        for (let shape of this._shapes) {
            shape.render();
        }

        for (let child of this._children) {
            child.render(finalMatrix);
        }
    }
}
