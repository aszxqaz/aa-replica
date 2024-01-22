import { LoaderScene } from "./scenes/loader-scene";
import { FILL_COLOR } from "./shared/constants";
import { SceneManager } from "./shared/scene-manager";
import "./style.css";
// import viteLogo from '/vite.svg'

SceneManager.init(FILL_COLOR);

const loader = new LoaderScene();
SceneManager.changeScene(loader);
