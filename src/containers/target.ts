import * as PIXI from "pixi.js";
import {
    COLOR_PRIMARY,
    TARGET_CIRCLE_RADIUS,
    TARGET_ROTATION_SPEED,
} from "../shared/constants";
import { Spear } from "./spear";
import { EasingAnimation, easings } from "../shared/animation";
import { ScoreCircleLabel } from "./score";

const TURN_RAD = Math.PI * 2;

export class Target extends PIXI.Container {
    public spears: Spear[] = [];
    private score: ScoreCircleLabel;
    private circle: PIXI.Graphics;
    private rotator: PIXI.Container;
    private _radius: number;
    private upAnimation?: EasingAnimation;
    private downAnimation?: EasingAnimation;

    constructor() {
        super();
        this.circle = new PIXI.Graphics()
            .beginFill(COLOR_PRIMARY)
            .drawCircle(0, 0, TARGET_CIRCLE_RADIUS)
            .endFill();

        this.score = new ScoreCircleLabel(this);
        this.rotator = new PIXI.Container();

        this._radius = TARGET_CIRCLE_RADIUS;
        this.addChild(this.circle, this.rotator, this.score);
    }

    public get radius(): number {
        return this._radius;
    }

    private setCircleScale(scale: number) {
        this.circle.scale.set(scale, scale);
        this.score.scale.set(scale, scale);
    }

    update(dt: number) {
        this.rotator.rotation +=
            (TURN_RAD * TARGET_ROTATION_SPEED * dt) / 15000;
        this.rotator.rotation %= TURN_RAD;
        this.upAnimation?.update();
        this.downAnimation?.update();
    }

    setScore(score: number) {
        this.score.setScore(score);
    }

    attach(spear: Spear) {
        this.rotator.addChild(spear);
        this.spears.push(spear);
        spear.rotation = -this.rotator.rotation;
        spear.x = Math.sin(this.rotator.rotation) * TARGET_CIRCLE_RADIUS;
        spear.y = Math.cos(spear.rotation) * TARGET_CIRCLE_RADIUS;

        this.upAnimation = this.createScaleAnimation();
        this.downAnimation = this.createScaleAnimation();

        this.upAnimation?.start(1, 1.05).then(() => {
            this.downAnimation?.start(1.05, 1);
        });
    }

    reset() {}

    private createScaleAnimation(): EasingAnimation {
        return new EasingAnimation(
            this.setCircleScale.bind(this),
            100,
            easings.easeOutCubic
        );
    }
}
