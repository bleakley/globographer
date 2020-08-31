import * as BABYLON from "babylonjs";
import { createScene } from "./scene.js";
import { drawHexTexture } from "./hex.js";

window.addEventListener("DOMContentLoaded", function () {
  // get the canvas DOM element
  var canvas = document.getElementById("renderCanvas");

  /*let ctx = canvas.getContext("2d");
  canvas.width = 50 * 100;
  canvas.height = 0.866025 * 50 * 55;
  drawHexTexture(ctx, canvas.width, canvas.height);
  return;*/

  // load the 3D engine
  var engine = new BABYLON.Engine(canvas, true);
  // call the createScene function
  var scene = createScene(engine, canvas);

  // run the render loop
  engine.runRenderLoop(function () {
    scene.render();
  });

  // the canvas/window resize event handler
  window.addEventListener("resize", function () {
    engine.resize();
  });
});
