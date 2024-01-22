import * as PIXI from "pixi.js";
import {
    DISPLAY_FONT_FAMILY,
    COLOR_ON_PRIMARY,
    COLOR_PRIMARY,
    MENU_FONT_SIZE,
} from "../shared/constants";
import { SceneManager } from "../shared/scene-manager";

export class MenuButton extends PIXI.Container {
    constructor(label: string) {
        super();
        let width = Math.min(200, SceneManager.width * 0.8);
        const rect = new PIXI.Graphics()
            .beginFill(COLOR_PRIMARY)
            .drawRoundedRect(0, 0, width, 80, 24)
            .endFill();

        rect.pivot.set(width / 2, 80 / 2);

        const text = new PIXI.Text(
            label,
            new PIXI.TextStyle({
                fontFamily: DISPLAY_FONT_FAMILY,
                fontSize: MENU_FONT_SIZE,
                fill: COLOR_ON_PRIMARY,
            })
        );
        text.anchor.set(0.5, 0.5);

        this.addChild(rect);
        this.addChild(text);

        this.eventMode = "static";
        this.on("mouseover", () => {
            text.style.fill = "lightblue";
        });
        this.on("mouseout", () => {
            text.style.fill = COLOR_ON_PRIMARY;
        });
        this.cursor = "pointer";
    }
}
