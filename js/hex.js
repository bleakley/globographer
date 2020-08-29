import * as Honeycomb from "honeycomb-grid";

export const drawHexTexture = (ctx) => {
  const Hex = Honeycomb.extendHex({
    size: 100, // default: 1
    orientation: "flat", // default: 'pointy'
  });
  const Grid = Honeycomb.defineGrid(Hex);
  let grid = Grid.rectangle({ width: 12, height: 9 });

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
