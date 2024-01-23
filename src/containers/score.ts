import * as PIXI from "pixi.js";
import { Target } from "./target";
import {
    COLOR_ON_PRIMARY,
    DISPLAY_FONT_FAMILY,
    SCORE_FONT_SIZE,
} from "../shared/constants";

export class ScoreCircleLabel extends PIXI.Text {
    constructor(target: Target) {
        super(
            "0",
            new PIXI.TextStyle({
                fontFamily: DISPLAY_FONT_FAMILY,
                fontSize: SCORE_FONT_SIZE,
                fill: COLOR_ON_PRIMARY,
            })
        );
        this.anchor.set(0.5, 0.5);
        this.position = target.position;
    }

    setScore(score: number): void {
        this.text = score.toString();
    }
}
