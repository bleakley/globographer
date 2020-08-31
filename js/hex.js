import * as Honeycomb from "honeycomb-grid";

const triangleSize = 12;
const hexWidth = 5.5 * triangleSize;
const hexHeight = 3 * (triangleSize * 0.75 + 1);

// https://hexagoncalculator.apphb.com/

export const drawHexTexture = (ctx, width, height) => {
  const Hex = Honeycomb.extendHex({
    size: 50, // default: 1
    orientation: "flat", // default: 'pointy'
  });
  const Grid = Honeycomb.defineGrid(Hex);
  let grid = Grid.rectangle({ width: 66, height: 27 });

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

  let a = grid.get([0, 9]);
  let b = grid.get([12, 9]);
  let c = grid.get([6, 0]);

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
  //ctx.stroke();

  return {
    xStart: ax / width,
    xEnd: bx / width,
    yStart: (height - ay) / height,
    yEnd: (height - cy) / height,
    width,
    height,
  };
};

export const hexTextureAsUri = (width) => {
  let canvas = document.getElementById("hiddenCanvas");
  canvas.width = 50 * 100;
  canvas.height = 0.866025 * 50 * 55;
  //canvas.width = width;
  //canvas.height = 0.866025 * width;
  let ctx = canvas.getContext("2d");
  let data = drawHexTexture(ctx, canvas.width, canvas.height);
  let dataURL = canvas.toDataURL("image/png");
  return { data, dataURL };
};
