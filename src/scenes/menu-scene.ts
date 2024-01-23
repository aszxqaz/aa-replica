import * as PIXI from "pixi.js";
import { Updatable, SceneManager } from "../shared/scene-manager";
import { MenuButton } from "../components/menu-button";
import { GameScene } from "./game/game-scene";

export class MenuScene extends PIXI.Container implements Updatable {
    constructor() {
        super();
        const playButton = new MenuButton("Play");
        playButton.on("pointerdown", () => {
            SceneManager.changeScene(new GameScene());
        });

        playButton.position.set(
            SceneManager.width / 2,
            SceneManager.height / 2
        );

        this.addChild(playButton);
    }

    update(): void {}
}
