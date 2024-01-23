import * as PIXI from "pixi.js";
import {
    COLOR_PRIMARY,
    TARGET_CIRCLE_RADIUS,
    TARGET_ROTATION_SPEED,
} from "../shared/constants";
import { Spear } from "./spear";
import { EasingAnimation, easings } from "../shared/animation";

const TURN_RAD = Math.PI * 2;

export class Target extends PIXI.Container {
    public spears: Spear[] = [];

    private circle: PIXI.Graphics;
    private _radius: number;
    private upAnimation?: EasingAnimation;
    private downAnimation?: EasingAnimation;

    constructor() {
        super();
        this.circle = new PIXI.Graphics()
            .beginFill(COLOR_PRIMARY)
            .drawCircle(0, 0, TARGET_CIRCLE_RADIUS)
            .endFill();

        // this.circle.filters = [new DropShadowFilter({})];

        this._radius = TARGET_CIRCLE_RADIUS;
        this.addChild(this.circle);
    }

    public get radius(): number {
        return this._radius;
    }

    private setCircleScale(scale: number) {
        this.circle.scale.set(scale, scale);
    }

    update(dt: number) {
        this.rotation += (TURN_RAD * TARGET_ROTATION_SPEED * dt) / 15000;
        this.rotation %= TURN_RAD;
        this.upAnimation?.update();
        this.downAnimation?.update();
    }

    attach(spear: Spear) {
        this.addChild(spear);
        this.spears.push(spear);
        spear.rotation = -this.rotation;
        spear.x = Math.sin(this.rotation) * TARGET_CIRCLE_RADIUS;
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
