import Component from "./Component.js";
import Cube from "./shapes/Cube.js";
import CylinderVert from "./shapes/CylinderVert.js";
import CylinderHoriz from "./shapes/CylinderHoriz.js";

const COLOR_FUR1 = [0.416, 0.227, 0.161, 1];
const COLOR_FUR2 = [0.478, 0.29, 0.22, 1];
const COLOR_NOSE = [0.529, 0.294, 0.212, 1];
const COLOR_EYE = [0.1, 0.1, 0.1, 1];
const COLOR_HORN = [0.224, 0.196, 0.176, 1];
const COLOR_FOOT = [0.149, 0.133, 0.129, 1];

export function makeOx() {
    let oxBody = new Component();
    let oxBackLeftLeg = new Component();
    let oxBackLeftLegLower = new Component();
    let oxBackLeftLegLowerFoot = new Component();
    let oxBackRightLeg = new Component();
    let oxBackRightLegLower = new Component();
    let oxBackRightLegLowerFoot = new Component();
    let oxFrontLeftLeg = new Component();
    let oxFrontLeftLegLower = new Component();
    let oxFrontLeftLegLowerFoot = new Component();
    let oxFrontRightLeg = new Component();
    let oxFrontRightLegLower = new Component();
    let oxFrontRightLegLowerFoot = new Component();
    let oxHead = new Component();

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
                                s.matrix.scale(0.09, 0.04, 0.1);
                                oxBackLeftLegLowerFoot.addShape(s);
                            }
                            {
                                const s = new Cube(COLOR_FOOT);
                                s.matrix.translate(0.015, 0, 0);
                                s.matrix.rotate(-15, 0, 1, 0);
                                s.matrix.translate(0, 0, -0.06);
                                s.matrix.scale(0.045, 0.04, 0.045);
                                oxBackLeftLegLowerFoot.addShape(s);
                            }
                            {
                                const s = new Cube(COLOR_FOOT);
                                s.matrix.translate(-0.015, 0, 0);
                                s.matrix.rotate(15, 0, 1, 0);
                                s.matrix.translate(0, 0, -0.06);
                                s.matrix.scale(0.045, 0.04, 0.045);
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
                                s.matrix.scale(0.09, 0.04, 0.1);
                                oxBackRightLegLowerFoot.addShape(s);
                            }
                            {
                                const s = new Cube(COLOR_FOOT);
                                s.matrix.translate(0.015, 0, 0);
                                s.matrix.rotate(-15, 0, 1, 0);
                                s.matrix.translate(0, 0, -0.06);
                                s.matrix.scale(0.045, 0.04, 0.045);
                                oxBackRightLegLowerFoot.addShape(s);
                            }
                            {
                                const s = new Cube(COLOR_FOOT);
                                s.matrix.translate(-0.015, 0, 0);
                                s.matrix.rotate(15, 0, 1, 0);
                                s.matrix.translate(0, 0, -0.06);
                                s.matrix.scale(0.045, 0.04, 0.045);
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
                            s.matrix.scale(0.09, 0.04, 0.1);
                            oxFrontLeftLegLowerFoot.addShape(s);
                        }
                        {
                            const s = new Cube(COLOR_FOOT);
                            s.matrix.translate(0.015, 0, 0);
                            s.matrix.rotate(-15, 0, 1, 0);
                            s.matrix.translate(0, 0, -0.06);
                            s.matrix.scale(0.045, 0.04, 0.045);
                            oxFrontLeftLegLowerFoot.addShape(s);
                        }
                        {
                            const s = new Cube(COLOR_FOOT);
                            s.matrix.translate(-0.015, 0, 0);
                            s.matrix.rotate(15, 0, 1, 0);
                            s.matrix.translate(0, 0, -0.06);
                            s.matrix.scale(0.045, 0.04, 0.045);
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
                            s.matrix.scale(0.09, 0.04, 0.1);
                            oxFrontRightLegLowerFoot.addShape(s);
                        }
                        {
                            const s = new Cube(COLOR_FOOT);
                            s.matrix.translate(0.015, 0, 0);
                            s.matrix.rotate(-15, 0, 1, 0);
                            s.matrix.translate(0, 0, -0.06);
                            s.matrix.scale(0.045, 0.04, 0.045);
                            oxFrontRightLegLowerFoot.addShape(s);
                        }
                        {
                            const s = new Cube(COLOR_FOOT);
                            s.matrix.translate(-0.015, 0, 0);
                            s.matrix.rotate(15, 0, 1, 0);
                            s.matrix.translate(0, 0, -0.06);
                            s.matrix.scale(0.045, 0.04, 0.045);
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
                s.matrix.scale(0.2, 0.32, 0.12);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_FUR1);
                s.matrix.translate(0, -0.02, -0.09);
                s.matrix.scale(0.16, 0.24, 0.12);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_FUR1);
                s.matrix.translate(0, -0.04, -0.15);
                s.matrix.scale(0.12, 0.16, 0.12);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_NOSE, "./res/images/nose.png", 0.5);
                s.matrix.translate(0, -0.06, -0.21);
                s.matrix.scale(0.08, 0.08, 0.04);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_EYE);
                s.matrix.translate(0.07, 0.05, -0.1);
                s.matrix.scale(0.04, 0.04, 0.04);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_EYE);
                s.matrix.translate(-0.07, 0.05, -0.1);
                s.matrix.scale(0.04, 0.04, 0.04);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_HORN);
                s.matrix.translate(0, 0.15, -0.035);
                s.matrix.scale(0.18, 0.06, 0.06);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_HORN);
                s.matrix.translate(0.08, 0.15, -0.035);
                s.matrix.scale(0.1, 0.1, 0.1);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_HORN);
                s.matrix.translate(0.1, 0.15, -0.035);
                s.matrix.rotate(15, 0, 1, 0);
                s.matrix.rotate(-10, 0, 0, 1);
                s.matrix.translate(0.09, 0, 0);
                s.matrix.scale(0.18, 0.05, 0.07);
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
                s.matrix.scale(0.18, 0.05, 0.07);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_HORN);
                s.matrix.translate(-0.08, 0.15, -0.035);
                s.matrix.scale(0.1, 0.1, 0.1);
                oxHead.addShape(s);
            }
            {
                const s = new Cube(COLOR_HORN);
                s.matrix.translate(-0.1, 0.15, -0.035);
                s.matrix.rotate(-15, 0, 1, 0);
                s.matrix.rotate(10, 0, 0, 1);
                s.matrix.translate(-0.09, 0, 0);
                s.matrix.scale(0.18, 0.05, 0.07);
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
                s.matrix.scale(0.18, 0.05, 0.07);
                oxHead.addShape(s);
            }
        }
    }

    return oxBody;
}