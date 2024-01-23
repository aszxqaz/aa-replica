import * as PIXI from "pixi.js";
import {
    COLOR_ON_PRIMARY,
    COLOR_PRIMARY,
    DISPLAY_FONT_FAMILY,
    HINT_FONT_SIZE,
} from "../../shared/constants";
import { EasingAnimation, easings } from "../../shared/animation";

enum GameHintState {
    INITIAL,
    SHOW_ANIMATION,
    HIDE_ANIMATION,
    IDLE,
    HIDDEN,
}

export class GameHint extends PIXI.Container {
    private circles: GameHintCircle[] = [];
    private hintText: GameHintText;
    private state: GameHintState = GameHintState.INITIAL;
    private hidingQueued = false;
    hintCircleRadius = 30;
    hintCirclesCount = 8;

    constructor(hint: string) {
        super();

        this.circles = this.createGameHintCircles();
        this.addChild(...this.circles);

        this.hintText = new GameHintText(hint);
        this.addChild(this.hintText);

        this.angle = -30;
    }

    private createGameHintCircles(): GameHintCircle[] {
        const circles: GameHintCircle[] = [];

        for (let i = 0; i < this.hintCirclesCount; i++) {
            const row = this.hintCirclesCount / 2 + 1;
            const isSide = i == 0 || i == this.hintCirclesCount / 2;
            const x =
                this.hintCircleRadius * 1.1 * (i >= row ? i % (row - 1) : i);

            const y = isSide
                ? this.hintCircleRadius / 1.5
                : i >= row
                ? this.hintCircleRadius * 1.5
                : 0;

            console.log(x, ",", y);

            const circle = new GameHintCircle(x, y, this.hintCircleRadius);
            circles.push(circle);
        }

        return circles;
    }

    async start(): Promise<void> {
        this.state = GameHintState.SHOW_ANIMATION;

        return Promise.all(
            this.circles.map(
                (circle, i) =>
                    new Promise((res) => {
                        setTimeout(() => {
                            res(circle.start());
                        }, i * 50);
                    })
            )
        )
            .then(() => {
                this.hintText.start();
            })
            .then(() => {
                this.state = GameHintState.IDLE;
                if (this.hidingQueued) {
                    return this.hide();
                }
            });
    }

    async hide(): Promise<void> {
        if (this.state == GameHintState.IDLE) {
            return Promise.all([
                ...this.circles.map((circle) => circle.hide()),
                this.hintText.hide(),
            ]).then(() => {});
        } else {
            this.hidingQueued = true;
        }
    }

    update() {
        for (const circle of this.circles) {
            circle.update();
        }
        this.hintText.update();
    }
}

class GameHintCircle extends PIXI.Graphics {
    private animation: EasingAnimation;

    constructor(x: number, y: number, radius: number) {
        super();
        this.beginFill(COLOR_PRIMARY).drawCircle(x, y, radius).endFill();

        this.filters = [new PIXI.AlphaFilter(0)];
        this.animation = new EasingAnimation(
            (alpha) => {
                this.filters = [new PIXI.AlphaFilter(alpha)];
            },
            50,
            easings.easeInCubic
        );
    }

    hide(): Promise<void> {
        this.animation = new EasingAnimation(
            (alpha) => {
                this.filters = [new PIXI.AlphaFilter(alpha)];
            },
            200,
            easings.easeOutCubic
        );
        return this.animation.start(1, 0);
    }

    start(): Promise<void> {
        return this.animation.start(0, 1).then(() => {});
    }

    update() {
        this.animation.update();
    }
}

class GameHintText extends PIXI.Text {
    private animation: EasingAnimation;

    constructor(hint: string) {
        super(
            hint,
            new PIXI.TextStyle({
                fontFamily: DISPLAY_FONT_FAMILY,
                fontSize: HINT_FONT_SIZE,
                fill: COLOR_ON_PRIMARY,
            })
        );

        this.filters = [new PIXI.AlphaFilter(0)];
        this.animation = new EasingAnimation(
            (alpha) => {
                this.filters = [new PIXI.AlphaFilter(alpha)];
            },
            200,
            easings.easeInOut
        );
    }

    hide(): Promise<void> {
        this.animation = new EasingAnimation(
            (alpha) => {
                this.filters = [new PIXI.AlphaFilter(alpha)];
            },
            200,
            easings.easeOutCubic
        );
        return this.animation.start(1, 0);
    }

    start(): Promise<void> {
        return this.animation.start(0, 1);
    }

    update() {
        this.animation.update();
    }
}
