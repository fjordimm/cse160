import { startGame } from "./game.js";

export async function main() {
    startGame();
}

window.main = main;

// TODO: optimize by not creating multiple textures if it's shared
// TODO: maybe implement fog
// TODO: game idea: catch all the oxes in the big square in the middle.