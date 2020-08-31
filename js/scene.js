import * as BABYLON from "babylonjs";
import * as _ from "lodash";

import { hexTextureAsUri } from "./hex.js";

export const createScene = function (engine, canvas) {
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.5, 0.5, 0.5);

  // camera
  var camera = new BABYLON.ArcRotateCamera(
    "camera1",
    0,
    0,
    0,
    new BABYLON.Vector3(0, 0, -0),
    scene
  );
  camera.setPosition(new BABYLON.Vector3(0, 0, -3));
  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;

  var pl = new BABYLON.PointLight("pl", BABYLON.Vector3.Zero(), scene);
  pl.intensity = 0.5;

  var mat = new BABYLON.StandardMaterial("mat", scene);

  let { data, dataURL } = hexTextureAsUri(600);
  console.log(data);

  mat.diffuseTexture = new BABYLON.Texture(dataURL, scene);

  var faceUV = new Array(20);

  let uBottomLeft = 0.048;
  let uTopRight = 0.152;
  let vBottomLeft = 0.437;
  let vTopRight = 0.6544627746345163;
  let full = new BABYLON.Vector4(0, 0, 1, 1);
  let cropped = new BABYLON.Vector4(
    uBottomLeft,
    vBottomLeft,
    uTopRight,
    vTopRight
  );
  let croppedFlipped = new BABYLON.Vector4(
    uBottomLeft,
    vTopRight,
    uTopRight,
    vBottomLeft
  );

  for (var i = 0; i < 20; i++) {
    faceUV[i] = croppedFlipped;
  }

  let icosahedron = BABYLON.MeshBuilder.CreatePolyhedron(
    "ico",
    { type: 3, size: 1, faceUV },
    scene
  );
  icosahedron.material = mat;

  scene.registerBeforeRender(function () {
    pl.position = camera.position;
  });

  return scene;
};
