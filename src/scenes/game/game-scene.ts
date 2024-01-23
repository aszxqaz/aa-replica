import * as PIXI from "pixi.js";
import { Updatable, SceneManager } from "../../shared/scene-manager";
import { Target, Score, Spear } from "../../containers";
import { MenuButton } from "../../components/menu-button";
import {
    GAME_SCENE_BACKGROUND,
    GAME_SCENE_GAME_OVER_TINT,
} from "../../shared/constants";
import { EasingAnimation, easings } from "../../shared/animation";
import { GameHint } from "./game-hint";

enum GameState {
    PLAYING,
    PAUSE,
    GAME_OVER,
}

export class GameScene extends PIXI.Container implements Updatable {
    private target: Target = new Target();
    private background: PIXI.Graphics;
    private spear?: Spear;
    private state: GameState = GameState.PLAYING;
    private score: Score;
    private scaleGameOverAnimation?: EasingAnimation;
    private gameHint?: GameHint;

    constructor(ignoreGameHint?: boolean) {
        super();

        this.background = this.createBackground();
        this.background.cursor = "pointer";
        this.background.on("pointerdown", this.shot.bind(this));

        this.target = this.createTarget();
        this.score = new Score(this.target);

        this.addChild(this.background, this.target, this.score);

        if (!ignoreGameHint) {
            this.gameHint = this.createGameHint();
            this.addChild(this.gameHint);
            this.gameHint.start();
        }
    }

    private createTarget(): Target {
        const target = new Target();
        target.position.x = SceneManager.width / 2;
        target.position.y = 200;
        return target;
    }

    private createGameHint(): GameHint {
        const gameHint = new GameHint("Tap to play");
        gameHint.position = {
            x: SceneManager.width - gameHint.width,
            y: SceneManager.height - gameHint.height,
        };
        return gameHint;
    }

    private createBackground(): PIXI.Graphics {
        const background = new PIXI.Graphics()
            .beginFill(GAME_SCENE_BACKGROUND)
            .drawRect(0, 0, SceneManager.width, SceneManager.height);
        background.eventMode = "static";
        return background;
    }

    private shot() {
        if (this.state != GameState.PLAYING) return;
        if (this.spear?.active) return;
        this.gameHint?.hide().then(() => {
            this.gameHint?.destroy();
        });

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

    private async handleGameOver() {
        this.state = GameState.GAME_OVER;
        this.background.tint = GAME_SCENE_GAME_OVER_TINT;

        this.scaleGameOverAnimation = this.createGameOverScaleAnimation();
        await this.scaleGameOverAnimation.start(1, 1.3);

        const playButton = new MenuButton("Restart");
        playButton.position.x = SceneManager.center.x;
        playButton.position.y = SceneManager.height - 90;

        playButton.on("pointerdown", () => {
            SceneManager.changeScene(new GameScene(true));
        });

        this.addChild(playButton);
    }

    private createGameOverScaleAnimation(): EasingAnimation {
        return new EasingAnimation(
            (scale) => {
                this.target.scale.set(scale, scale);
                this.score.scale.set(scale, scale);
                this.spear?.scale.set(scale, scale);
            },
            300,
            easings.easeOutBack
        );
    }

    update(dt: number): void {
        switch (this.state) {
            case GameState.PLAYING:
                this.target.update(dt);
                this.spear?.update(dt);
                this.gameHint?.update();
                break;
            case GameState.GAME_OVER:
                this.scaleGameOverAnimation?.update();
                break;
        }
    }
}
