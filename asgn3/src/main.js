import GameManager from "./GameManager.js";

export async function main() {
    const gm = new GameManager();
    gm.start();
}

window.main = main;