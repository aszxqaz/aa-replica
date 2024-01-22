import type { AssetsManifest } from "pixi.js";

export const manifest: AssetsManifest = {
  bundles: [
    {
      name: "fonts",
      assets: {
        Digital7: "fonts/Digital-7.ttf",
        ChaChicle: "fonts/ChaChicle.ttf",
        TitilliumWeb: "fonts/TitilliumWeb.ttf",
      },
    },
  ],
};

// const manifest = {
//   bundles: [
//     {
//       name: "load-screen",
//       assets: [
//         {
//           alias: "background",
//           src: "sunset.png",
//         },
//         {
//           alias: "bar",
//           src: "load-bar.{png,webp}",
//         },
//       ],
//     },
//     {
//       name: "game-screen",
//       assets: [
//         {
//           alias: "character",
//           src: "robot.png",
//         },
//         {
//           alias: "enemy",
//           src: "bad-guy.png",
//         },
//       ],
//     },
//   ],
// };
