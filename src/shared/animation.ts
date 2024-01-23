import BezierEasing from "bezier-easing";
import { EasingFunction } from "bezier-easing";

type AnimationUpdateCallback = (value: number) => void;

export const easings = {
    easeOutBack: BezierEasing(0.175, 0.885, 0.32, 1.275),
    easeInOut: BezierEasing(0.42, 0, 0.58, 1),
    easeInCubic: BezierEasing(0.32, 0, 0.67, 0),
    easeOutCubic: BezierEasing(0.33, 1, 0.68, 1),
};

export class EasingAnimation {
    private callback: AnimationUpdateCallback;
    private duration: number;
    private easing?: EasingFunction;
    private isDone = false;
    private resolve?: Function;
    private startTimestamp?: number;
    private from?: number;
    private to?: number;

    constructor(
        cb: AnimationUpdateCallback,
        duration: number,
        easing?: EasingFunction
    ) {
        this.callback = cb;
        this.duration = duration;
        this.easing = easing;
    }

    async start(from: number, to: number): Promise<void> {
        this.from = from;
        this.to = to;
        this.startTimestamp = Date.now();
        return new Promise((res) => {
            this.resolve = res;
        });
    }

    update() {
        if (this.isDone || !this.startTimestamp) return;

        const clampedCurTimestamp = Math.min(
            Date.now(),
            this.startTimestamp! + this.duration
        );

        const input =
            (clampedCurTimestamp - this.startTimestamp!) / this.duration;

        const value =
            this.from! +
            (this.to! - this.from!) *
                (this.easing ? this.easing(input) : input);

        this.callback(value);

        if (input >= 1) {
            this.isDone = true;
            this.resolve!();
        }
    }
}
