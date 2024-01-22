import * as PIXI from "pixi.js";
import {
    COLOR_PRIMARY,
    SHOTTABLE_SPEAR_Y_OFFSET,
    SPEAR_CIRCLE_RADIUS,
    SPEAR_LINE_LENGTH,
    SPEAR_LINE_WIDTH,
    SPEAR_SHOT_SPEED,
    TARGET_CIRCLE_RADIUS,
} from "../shared/constants";
import { Target } from "./target";
import {
    checkLineCircleCollision,
    checkPointCircleCollision,
} from "../shared/helpers";

type OnSpearCollisionCallback = (spear: Spear, other: Target | Spear) => void;

export class Spear extends PIXI.Container {
    private _circle: PIXI.Graphics;
    private line: PIXI.Graphics;
    private target: Target;

    private _active = false;
    private _onCollision?: OnSpearCollisionCallback;

    static Shottable(target: Target): Spear {
        const spear = new Spear(target);
        spear.target = target;
        spear.position.set(
            target.x,
            target.y + SHOTTABLE_SPEAR_Y_OFFSET + TARGET_CIRCLE_RADIUS
        );
        return spear;
    }

    private constructor(target: Target) {
        super();

        this.target = target;

        this._circle = new PIXI.Graphics()
            .beginFill(COLOR_PRIMARY)
            .drawCircle(0, 0, SPEAR_CIRCLE_RADIUS)
            .endFill();

        const fromCenterToPeak = SPEAR_LINE_LENGTH + SPEAR_CIRCLE_RADIUS;

        this.line = new PIXI.Graphics()
            .moveTo(0, -SPEAR_CIRCLE_RADIUS)
            .lineStyle({ color: COLOR_PRIMARY, width: SPEAR_LINE_WIDTH })
            .lineTo(0, -fromCenterToPeak);

        this.addChild(this._circle, this.line);

        // this.filters = [
        //     new DropShadowFilter({
        //         alpha: 0.2,
        //         offset: {
        //             x: 10,
        //             y: 10,
        //         },
        //     }),
        // ];

        this.pivot = {
            x: 0,
            y: -fromCenterToPeak,
        };
    }

    shot(onCollision?: OnSpearCollisionCallback) {
        this._active = true;
        this._onCollision = onCollision;
    }

    update(dt: number) {
        if (this._active) {
            const dY = (SPEAR_SHOT_SPEED * dt) / 5;
            console.log(dY);
            this.position.set(this.x, this.y - dY);

            for (const spear of this.target.spears) {
                if (this.hasSpearCollision(spear)) {
                    this._active = false;
                    this._onCollision?.(this, spear);
                    return;
                }
            }

            if (this.hasTargetCollision()) {
                this._active = false;
                this._onCollision?.(this, this.target);
                return;
            }
        }
    }

    hasTargetCollision(): boolean {
        return checkPointCircleCollision(
            this.position,
            this.target.position,
            this.target.radius
        );
    }

    hasSpearCollision(other: Spear): boolean {
        return checkLineCircleCollision(
            this.position,
            new PIXI.Point(
                this.position.x,
                this.position.y - SPEAR_LINE_LENGTH
            ),
            other.circlePosition,
            SPEAR_CIRCLE_RADIUS
        );
    }

    public get circlePosition(): PIXI.IPointData {
        const point = this._circle.getGlobalPosition();

        return {
            x: point.x,
            y: point.y,
        };
    }

    public get active(): boolean {
        return this._active;
    }
}
