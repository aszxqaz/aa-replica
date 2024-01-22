import * as PIXI from "pixi.js";
import { IScene, SceneManager } from "../shared/scene-manager";
import { Target } from "../containers/target";
import { Score } from "../containers/score";
import { Spear } from "../containers/spear";
import { MenuButton } from "../components/menu-button";
import {
    GAME_SCENE_BACKGROUND,
    GAME_SCENE_GAME_OVER_TINT,
} from "../shared/constants";

enum GameState {
    PLAYING,
    PAUSE,
    GAME_OVER,
}

export class GameScene extends PIXI.Container implements IScene {
    private target: Target = new Target();
    private background: PIXI.Graphics;
    private spear?: Spear;
    private state: GameState = GameState.PLAYING;
    private score: Score;

    constructor() {
        super();

        this.background = new PIXI.Graphics()
            .beginFill(GAME_SCENE_BACKGROUND)
            .drawRect(0, 0, SceneManager.width, SceneManager.height);

        this.target.position.x = SceneManager.width / 2;
        this.target.position.y = 200;

        this.score = new Score(this.target);

        this.addChild(this.background, this.target, this.score);

        this.background.eventMode = "static";
        this.background.cursor = "pointer";
        this.background.on("pointerdown", this.shot.bind(this));
    }

    private shot() {
        if (this.state != GameState.PLAYING) return;
        if (this.spear?.active) return;

        this.spear = Spear.Shottable(this.target);
        this.addChild(this.spear);

        this.spear.shot((spear, other) => {
            if (other instanceof Target) {
                this.handleSpearAttached(spear);
            } else if (other instanceof Spear) {
                this.handleGameOver();
            }
        });
    }

    private handleSpearAttached(spear: Spear) {
        this.target.attach(spear);
        this.score.increment();
    }

    private handleGameOver() {
        this.state = GameState.GAME_OVER;
        this.target.scale.set(1.5, 1.5);
        this.score.scale.set(1.5, 1.5);
        this.spear?.scale.set(1.5, 1.5);
        this.background.tint = GAME_SCENE_GAME_OVER_TINT;

        const playButton = new MenuButton("Restart");
        playButton.position.x = SceneManager.width / 2;
        playButton.position.y = SceneManager.height - 90;

        playButton.on("pointerdown", () => {
            SceneManager.changeScene(new GameScene());
        });

        this.addChild(playButton);
    }

    update(dt: number): void {
        switch (this.state) {
            case GameState.PLAYING:
                this.target.rotate(dt);
                this.spear?.update(dt);
                break;
        }
    }

    resize(): void {
        //
    }
}
