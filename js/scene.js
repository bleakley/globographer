import * as BABYLON from "babylonjs";
import * as _ from "lodash";

import { hexTextureAsUri, getIcosahedronUVs } from "./hex.js";

//https://www.babylonjs-playground.com/#VKBJN#14

export const createScene = function (engine, canvas, mapData, features) {
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

  let dataURL = hexTextureAsUri(mapData, features);

  mat.diffuseTexture = new BABYLON.Texture(dataURL, scene);

  let icosahedron = BABYLON.MeshBuilder.CreatePolyhedron(
    "ico",
    { type: 3, size: 1, updatable: true },
    scene
  );
  icosahedron.material = mat;

  var uvs = getIcosahedronUVs(
    mapData.triangleSize,
    mapData.tilesWide,
    mapData.tilesHigh
  );

  icosahedron.updateVerticesData(BABYLON.VertexBuffer.UVKind, uvs);

  //new BABYLON.AxesViewer(scene);

  scene.registerBeforeRender(function () {
    pl.position = camera.position;
  });

  return scene;
};
