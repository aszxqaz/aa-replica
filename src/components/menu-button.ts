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

function createGradTexture() {
    // adjust it if somehow you need better quality for very very big images
    const quality = 256;
    const canvas = document.createElement("canvas");

    canvas.width = quality;
    canvas.height = 1;

    const ctx = canvas.getContext("2d")!;

    // use canvas2d API to create gradient
    const grd = ctx.createLinearGradient(0, 0, quality, 1);

    grd.addColorStop(0, "black");
    grd.addColorStop(1, "grey");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, quality, 1);

    return PIXI.Texture.from(canvas);
}
