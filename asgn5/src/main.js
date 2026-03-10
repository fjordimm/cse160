import * as THREE from "three";
import Game from "./Game.js";
import { PermLambdaDefaultDict } from "./util.js";

export async function main() {
    const game = new Game(document.querySelector("#c"));
    game.start();
}

window.main = main;