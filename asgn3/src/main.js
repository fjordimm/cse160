import GameManager from "./GameManager.js";

export async function main() {
    const gm = new GameManager();
    gm.start();
}

window.main = main;

// TODO: optimize drawTriangle.js by not creating a new Float32Array every time.
// TODO: optimize by not creating multiple textures if it's shared
// TODO: optimize Camera.js