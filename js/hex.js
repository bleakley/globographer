import * as Honeycomb from "honeycomb-grid";

const triangleSize = 12;
const hexWidth = triangleSize + 1;
const hexHeight = triangleSize * 0.75 + 1;

// https://hexagoncalculator.apphb.com/

export const drawHexTexture = (ctx, width) => {
  const Hex = Honeycomb.extendHex({
    size: width / 20, // default: 1
    orientation: "flat", // default: 'pointy'
  });
  const Grid = Honeycomb.defineGrid(Hex);
  let grid = Grid.rectangle({ width: hexWidth, height: hexHeight });

  let xOffset = 0;
  let yOffset = 0;

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
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  let a = grid.get([0, 9]);
  let b = grid.get([12, 9]);
  let c = grid.get([6, 0]);

  console.log({ a, b, c });

  ctx.beginPath();
  ctx.moveTo(
    a.toPoint().add(a.center()).x + xOffset,
    a.toPoint().add(a.center()).y + yOffset
  );
  ctx.lineTo(
    b.toPoint().add(b.center()).x + xOffset,
    b.toPoint().add(b.center()).y + yOffset
  );
  ctx.lineTo(
    c.toPoint().add(c.center()).x + xOffset,
    c.toPoint().add(c.center()).y + yOffset
  );
  ctx.lineTo(
    a.toPoint().add(a.center()).x + xOffset,
    a.toPoint().add(a.center()).y + yOffset
  );
  ctx.strokeStyle = "green";
  ctx.lineWidth = 1;
  ctx.stroke();
};

export const hexTextureAsUri = (width) => {
  let canvas = document.getElementById("hiddenCanvas");
  canvas.width = width;
  canvas.height = 0.866025 * width;
  let ctx = canvas.getContext("2d");
  drawHexTexture(ctx, width);
  let dataURL = canvas.toDataURL("image/png");
  return dataURL;
};
