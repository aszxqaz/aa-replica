import * as PIXI from "pixi.js";
import {
    COLOR_PRIMARY,
    DISPLAY_FONT_FAMILY,
    HIGHSCORE_FONT_SIZE,
} from "../../shared/constants";

export class Highscore extends PIXI.Text {
    constructor(initial: number = 0) {
        super(
            `Highscore: ${initial}`,
            new PIXI.TextStyle({
                fontFamily: DISPLAY_FONT_FAMILY,
                fontSize: HIGHSCORE_FONT_SIZE,
                fill: COLOR_PRIMARY,
            })
        );
    }

    setScore(score: number) {
        this.text = `Highscore: ${score}`;
    }
}
