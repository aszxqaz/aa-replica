import * as PIXI from "pixi.js";
import { IScene, SceneManager } from "../shared/scene-manager";
import { MenuButton } from "../components/menu-button";
import { GameScene } from "./game-scene";

export class MenuScene extends PIXI.Container implements IScene {
    constructor(parentWidth: number, parentHeight: number) {
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

    update(dt: number): void {}

    resize(parentWidth: number, parentHeight: number): void {
        //
    }
}
