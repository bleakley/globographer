import * as BABYLON from "babylonjs";
import { createScene } from "./scene.js";
import { hexResolution, drawHexTexture, rootThreeOverTwo } from "./hex.js";
import { fileToData, parseWxxData } from "./load.js";

// 24 : 133 x 55
// 12 : 67 x 28

let mapData = null;
let projection = null;
let features = {};

var canvas, input, projections, featureChecks;

let getProjection = () => {
  for (var i = 0, length = projections.length; i < length; i++) {
    if (projections[i].checked) {
      console.log(projections[i].value);
      return projections[i].value;
    }
  }
};

let resetCanvas = () => {
  var newCanvas = canvas.cloneNode(false);
  canvas.parentNode.replaceChild(newCanvas, canvas);
  canvas = newCanvas;
};

let renderIcosahedron = (mapData) => {
  resetCanvas();
  var engine = new BABYLON.Engine(canvas, true);
  var scene = createScene(engine, canvas, mapData, features);

  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });
};

let renderFlat = (mapData) => {
  resetCanvas();
  let ctx = canvas.getContext("2d");
  canvas.width = hexResolution * 2 * mapData.tilesWide;
  canvas.height =
    rootThreeOverTwo * hexResolution * (2 * mapData.tilesHigh + 1);
  drawHexTexture(ctx, canvas.width, canvas.height, mapData, features);
  return;
};

let render = (mapData) => {
  if (!mapData) return;
  switch (projection) {
    case "flat":
      renderFlat(mapData);
      break;
    case "icosahedron":
      renderIcosahedron(mapData);
      break;
    default:
      renderFlat(mapData);
      break;
  }
};

window.addEventListener("DOMContentLoaded", function () {
  canvas = document.getElementById("renderCanvas");
  input = document.getElementById("fileInput");
  projections = document.getElementsByName("projection");
  featureChecks = document.getElementsByName("feature");

  projection = getProjection();

  input.onchange = async (e) => {
    let file = e.target.files[0];
    let data = await fileToData(file);
    mapData = parseWxxData(data);
    console.log(mapData);
    render(mapData);
  };

  projections.forEach(
    (item) =>
      (item.onchange = async (e) => {
        projection = getProjection();
        render(mapData);
      })
  );

  featureChecks.forEach(
    (item) =>
      (item.onchange = async (e) => {
        features[item.id] = item.checked;
        console.log(features);
        render(mapData);
      })
  );
});
