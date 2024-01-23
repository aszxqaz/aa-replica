import * as PIXI from "pixi.js";
import { Updatable, SceneManager } from "../../shared/scene-manager";
import { Target, Spear } from "../../containers";
import { MenuButton } from "../../components/menu-button";
import {
    GAME_SCENE_BACKGROUND,
    GAME_SCENE_GAME_OVER_TINT,
} from "../../shared/constants";
import { EasingAnimation, easings } from "../../shared/animation";
import { GameHint } from "./game-hint";
import { Highscore } from "./game-highscore";

enum GameState {
    PLAYING,
    PAUSE,
    GAME_OVER,
}

class ScoreCounter {
    private current = 0;
    private listeners: ((cur: number, high: number) => void)[] = [];

    constructor(private highscore: number = 0) {}

    increment() {
        if (++this.current > this.highscore) {
            this.highscore = this.current;
        }
        for (const listener of this.listeners) {
            listener(this.current, this.highscore);
        }
    }

    addListener(listener: (cur: number, high: number) => void) {
        this.listeners.push(listener);
        return this;
    }

    get score() {
        return this.current;
    }
}

export class GameScene extends PIXI.Container implements Updatable {
    private target: Target = new Target();
    private background: PIXI.Graphics;
    private spear?: Spear;
    private state: GameState = GameState.PLAYING;
    private scaleGameOverAnimation?: EasingAnimation;
    private gameHint?: GameHint;
    private highscore: Highscore;
    private counter: ScoreCounter;

    constructor(ignoreGameHint?: boolean, highscore?: number) {
        super();

        this.background = this.createBackground();
        this.background.cursor = "pointer";
        this.background.on("pointerdown", this.shot.bind(this));

        this.target = this.createTarget();
        this.highscore = this.createHighscore(highscore);

        this.counter = new ScoreCounter(highscore).addListener((cur, high) => {
            this.highscore.setScore(high);
            this.target.setScore(cur);
        });

        this.addChild(this.background, this.target, this.highscore);

        if (!ignoreGameHint) {
            this.gameHint = this.createGameHint();
            this.addChild(this.gameHint);
            this.gameHint.start();
        }
    }

    private createHighscore(initial?: number): Highscore {
        const highscore = new Highscore(initial);
        highscore.position.set(SceneManager.width / 2 - 160, 0);
        return highscore;
    }

    private createTarget(): Target {
        const target = new Target();
        target.position.x = SceneManager.width / 2;
        target.position.y = 250;
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
        this.counter.increment();
    }

    private async handleGameOver() {
        this.state = GameState.GAME_OVER;
        this.background.tint = GAME_SCENE_GAME_OVER_TINT;
        this.background.eventMode = "none";
        this.background.cursor = "none";

        this.scaleGameOverAnimation = this.createGameOverScaleAnimation();
        await this.scaleGameOverAnimation.start(1, 1.3);

        const playButton = new MenuButton("Restart");
        playButton.position.x = SceneManager.center.x;
        playButton.position.y = SceneManager.height - 90;

        playButton.on("pointerdown", () => {
            SceneManager.changeScene(new GameScene(true, this.counter.score));
        });

        this.addChild(playButton);
    }

    private createGameOverScaleAnimation(): EasingAnimation {
        return new EasingAnimation(
            (scale) => {
                this.target.scale.set(scale, scale);
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
