import * as Honeycomb from "honeycomb-grid";

const hexWidth = 12 + 1;
const hexHeight = 9 + 1;

// https://hexagoncalculator.apphb.com/

export const drawHexTexture = (ctx, width) => {
  const Hex = Honeycomb.extendHex({
    size: 50, // default: 1
    orientation: "flat", // default: 'pointy'
  });
  const Grid = Honeycomb.defineGrid(Hex);
  let grid = Grid.rectangle({ width: hexWidth, height: hexHeight });

  grid.forEach((hex) => {
    const point = hex.toPoint();
    // add the hex's position to each of its corner points
    const corners = hex.corners().map((corner) => corner.add(point));
    // separate the first from the other corners
    const [firstCorner, ...otherCorners] = corners;

    // move the "pen" to the first corner
    ctx.beginPath();
    ctx.moveTo(firstCorner.x, firstCorner.y);

    // draw lines to the other corners
    otherCorners.forEach(({ x, y }) => ctx.lineTo(x, y));
    // finish at the first corner
    ctx.lineTo(firstCorner.x, firstCorner.y);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.stroke();
  });
};

export const hexTextureAsUri = (width) => {
  let canvas = document.getElementById("hiddenCanvas");
  canvas.width = width;
  canvas.height = width;
  let ctx = canvas.getContext("2d");
  drawHexTexture(ctx, width);
  let dataURL = canvas.toDataURL("image/png");
  return dataURL;
};
