import * as BABYLON from "babylonjs";
import { createScene } from "./scene.js";
import { drawHexTexture } from "./hex.js";
import { fileToData, parseWxxData } from "./load.js";

window.addEventListener("DOMContentLoaded", function () {
  // get the canvas DOM element
  var canvas = document.getElementById("renderCanvas");
  var input = document.getElementById("fileInput");

  input.onchange = async (e) => {
    // getting a hold of the file reference
    var file = e.target.files[0];

    let data = await fileToData(file);
    let mapData = parseWxxData(data);
    console.log(mapData);

    /*let ctx = canvas.getContext("2d");
    canvas.width = 50 * 100;
    canvas.height = 0.866025 * 50 * 55;
    drawHexTexture(ctx, canvas.width, canvas.height, mapData);
    return;*/

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);
    // call the createScene function
    var scene = createScene(engine, canvas, mapData);

    // run the render loop
    engine.runRenderLoop(function () {
      scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener("resize", function () {
      engine.resize();
    });

    // setting up the reader
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    // here we tell the reader what to do when it's done reading...
    reader.onload = (readerEvent) => {
      var content = readerEvent.target.result; // this is the content!
      console.log(content);
    };
  };
});
