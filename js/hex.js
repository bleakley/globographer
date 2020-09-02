import * as Honeycomb from "honeycomb-grid";

const triangleSize = 12;
const hexWidth = 5.5 * triangleSize;
const hexHeight = 3 * (triangleSize * 0.75 + 1);

// https://hexagoncalculator.apphb.com/

const getGlobeTriangles = () => {
  let arcticTriangles = [];
  for (let i = 0; i < 5; i++) {
    let a = [6 + 12 * i, 0];
    let b = [12 + 12 * i, 9];
    let c = [0 + 12 * i, 9];
    arcticTriangles.push([a, b, c]);
  }
  let cancerTriangles = [];
  for (let i = 0; i < 5; i++) {
    let a = [6 + 12 * i, 18];
    let b = [12 + 12 * i, 9];
    let c = [0 + 12 * i, 9];
    cancerTriangles.push([b, a, c]);
  }
  let capricornTriangles = [];
  for (let i = 0; i < 5; i++) {
    let a = [12 + 12 * i, 9];
    let b = [18 + 12 * i, 18];
    let c = [6 + 12 * i, 18];
    capricornTriangles.push([a, b, c]);
  }
  let antarcticTriangles = [];
  for (let i = 0; i < 5; i++) {
    let a = [12 + 12 * i, 27];
    let b = [18 + 12 * i, 18];
    let c = [6 + 12 * i, 18];
    antarcticTriangles.push([b, a, c]);
  }

  let six = cancerTriangles[0];
  let sixteen = antarcticTriangles[0];
  let seventeen = antarcticTriangles[1];
  let eighteen = antarcticTriangles[2];
  let nineteen = antarcticTriangles[3];
  let twenty = antarcticTriangles[4];

  return [
    ...arcticTriangles.reverse(),
    [six[2], six[0], six[1]],
    capricornTriangles[4],
    cancerTriangles[4],
    capricornTriangles[3],
    cancerTriangles[3],
    capricornTriangles[2],
    cancerTriangles[2],
    capricornTriangles[1],
    cancerTriangles[1],
    capricornTriangles[0],
    [twenty[2], twenty[0], twenty[1]],
    nineteen,
    [sixteen[2], sixteen[0], sixteen[1]],
    eighteen,
    seventeen,
  ];
};

export const drawHexTexture = (ctx, width, height) => {
  const Hex = Honeycomb.extendHex({
    size: 50, // default: 1
    orientation: "flat", // default: 'pointy'
  });
  const Grid = Honeycomb.defineGrid(Hex);
  let grid = Grid.rectangle({ width: 67, height: 28 });

  let xOffset = 0;
  let yOffset = 0;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  grid.forEach((hex) => {
    const point = hex.toPoint();
    // add the hex's position to each of its corner points
    const corners = hex.corners().map((corner) => corner.add(point));
    // separate the first from the other corners
    const [firstCorner, ...otherCorners] = corners;

    // move the "pen" to the first corner
    ctx.beginPath();
    ctx.moveTo(firstCorner.x + xOffset, firstCorner.y + yOffset);

    // draw lines to the other corners
    otherCorners.forEach(({ x, y }) => ctx.lineTo(x + xOffset, y + yOffset));
    // finish at the first corner
    ctx.lineTo(firstCorner.x + xOffset, firstCorner.y + yOffset);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.stroke();
  });

  let triangles = getGlobeTriangles();

  triangles.forEach((t) => {
    let a = grid.get(t[0]);
    let b = grid.get(t[1]);
    let c = grid.get(t[2]);

    let ax = a.toPoint().add(a.center()).x;
    let ay = a.toPoint().add(a.center()).y;
    let bx = b.toPoint().add(b.center()).x;
    let by = b.toPoint().add(b.center()).y;
    let cx = c.toPoint().add(c.center()).x;
    let cy = c.toPoint().add(c.center()).y;

    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx, cy);
    ctx.lineTo(ax, ay);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 5;
    ctx.stroke();
  });

  let drawLetter = (x, y, letter) => {
    let hex = grid.get([x, y]);
    let hx = hex.toPoint().add(hex.center()).x - 12;
    let hy = hex.toPoint().add(hex.center()).y;
    ctx.font = "48px monospace";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.strokeText(letter, hx, hy);
  };

  //drawLetter(6, 0, "a");
  //drawLetter(12, 9, "b");
  //drawLetter(0, 9, "c");

  drawLetter(6, 6, "1");
  drawLetter(18, 6, "2");
  drawLetter(30, 6, "3");
  drawLetter(42, 6, "4");
  drawLetter(54, 6, "5");

  drawLetter(6, 12, ".6");
  drawLetter(12, 15, "7");
  drawLetter(18, 12, "8");
  drawLetter(24, 15, ".9");
  drawLetter(30, 12, "10");
  drawLetter(36, 15, "11");
  drawLetter(42, 12, "12");
  drawLetter(48, 15, "13");
  drawLetter(54, 12, "14");
  drawLetter(60, 15, "15");

  drawLetter(12, 21, "16");
  drawLetter(24, 21, "17");
  drawLetter(36, 21, "18");
  drawLetter(48, 21, "19");
  drawLetter(60, 21, "20");
};

let getUVsForTriangle = (grid, a, b, c) => {
  let textureWidth = 1 * 100;
  let textureHeight = 0.866025 * 1 * 55;
  console.log("getting uvs for triangle");
  console.log({ a, b, c });
  let ax = grid.get(a).toPoint().add(grid.get(a).center()).x;
  let ay = grid.get(a).toPoint().add(grid.get(a).center()).y;
  let bx = grid.get(b).toPoint().add(grid.get(b).center()).x;
  let by = grid.get(b).toPoint().add(grid.get(b).center()).y;
  let cx = grid.get(c).toPoint().add(grid.get(c).center()).x;
  let cy = grid.get(c).toPoint().add(grid.get(c).center()).y;
  let uvs = {
    x0: ax / textureWidth,
    y0: 1 - ay / textureHeight,
    x1: bx / textureWidth,
    y1: 1 - by / textureHeight,
    x2: cx / textureWidth,
    y2: 1 - cy / textureHeight,
  };
  return [uvs.x0, uvs.y0, uvs.x1, uvs.y1, uvs.x2, uvs.y2];
};

export const getIcosahedronUVs = () => {
  const Hex = Honeycomb.extendHex({
    size: 1, // default: 1
    orientation: "flat", // default: 'pointy'
  });
  const Grid = Honeycomb.defineGrid(Hex);
  let grid = Grid.rectangle({ width: 67, height: 28 });

  let icoUVs = getGlobeTriangles()
    .map((t) => getUVsForTriangle(grid, t[0], t[1], t[2]))
    .flat();
  return icoUVs;
};

export const hexTextureAsUri = (width) => {
  let canvas = document.getElementById("hiddenCanvas");
  canvas.width = 50 * 100;
  canvas.height = 0.866025 * 50 * 55;
  //canvas.width = width;
  //canvas.height = 0.866025 * width;
  let ctx = canvas.getContext("2d");
  drawHexTexture(ctx, canvas.width, canvas.height);
  let dataURL = canvas.toDataURL("image/png");
  return dataURL;
};
