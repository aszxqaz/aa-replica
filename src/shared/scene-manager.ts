import { Application, DisplayObject, IPointData } from "pixi.js";
import { Stage } from "@pixi/layers";

export class SceneManager {
    private constructor() {}
    private static _app: Application;
    private static _currentScene: Updatable;

    public static get center(): IPointData {
        return {
            x: this._app.screen.width / 2,
            y: this._app.screen.height / 2,
        };
    }

    public static get width() {
        return this._app.screen.width;
    }

    public static get height() {
        return this._app.screen.height;
    }

    public static init(background: number): void {
        SceneManager._app = new Application({
            view: document.getElementById("pixi-screen") as HTMLCanvasElement,
            resizeTo: window,
            antialias: true,
            // ! When uncommented: got issues with resolution on mobile
            // resolution: window.devicePixelRatio || 1,
            // autoDensity: true,
            backgroundColor: background,
        });

        SceneManager._app.stage = new Stage();
        SceneManager._app.ticker.add(SceneManager.update);
    }

    public static changeScene(newScene: Updatable): void {
        if (SceneManager._currentScene) {
            SceneManager._app.stage.removeChild(SceneManager._currentScene);
            SceneManager._currentScene.destroy();
        }

        SceneManager._currentScene = newScene;
        SceneManager._app.stage.addChild(SceneManager._currentScene);
    }

    private static update(framesPassed: number): void {
        if (SceneManager._currentScene) {
            SceneManager._currentScene.update(framesPassed);
        }
    }
}

export interface Updatable extends DisplayObject {
    update(dt: number): void;
}
