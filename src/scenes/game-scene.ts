import * as PIXI from "pixi.js";
import { IScene, SceneManager } from "../shared/scene-manager";
import { Target } from "../containers/target";
import { Score } from "../containers/score";
import { Spear } from "../containers/spear";
import { MenuButton } from "../components/menu-button";

enum GameState {
    PLAYING,
    PAUSE,
    GAME_OVER,
}

export class GameScene extends PIXI.Container implements IScene {
    private target: Target = new Target();
    private background: PIXI.Container = new PIXI.Container();
    private spear?: Spear;
    private state: GameState = GameState.PLAYING;
    private score: Score;

    constructor() {
        super();
        SceneManager.setBackground(0xffffff);

        this.background.width = SceneManager.width;
        this.background.height = SceneManager.height;

        this.target.position.x = SceneManager.width / 2;
        this.target.position.y = 200;

        this.score = new Score(this.target);

        this.addChild(this.target, this.score);

        this.eventMode = "static";
        this.on("pointerdown", () => {
            this.shot();
        });
    }

    shot() {
        if (this.state != GameState.PLAYING) return;
        if (this.spear?.active) return;

        this.spear = Spear.Shottable(this.target);
        this.addChild(this.spear);

        this.spear.shot((spear, other) => {
            if (other instanceof Target) {
                other.attach(spear);
                this.score.increment();
            } else if (other instanceof Spear) {
                this.state = GameState.GAME_OVER;
                this.target.scale.set(1.5, 1.5);
                this.score.scale.set(1.5, 1.5);
                this.spear?.scale.set(1.5, 1.5);
                SceneManager.setBackground(0xff0000);

                const playButton = new MenuButton("Restart");
                playButton.position.x = SceneManager.width / 2;
                playButton.position.y = SceneManager.height - 90;

                playButton.on("pointerdown", () => {
                    SceneManager.changeScene(new GameScene());
                });

                this.addChild(playButton);
            }
        });
    }

    update(dt: number): void {
        switch (this.state) {
            case GameState.PLAYING:
                this.target.rotate(dt);
                this.spear?.update(dt);
                break;
        }
    }

    resize(parentWidth: number, parentHeight: number): void {
        //
    }
}
