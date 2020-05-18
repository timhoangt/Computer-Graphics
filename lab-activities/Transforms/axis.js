import * as Mat from "./matmath.js"
import {
  identity2D
} from "./transform.js"

export default function Axis(dimension) {
  this.dimension = dimension;
  this.m = identity2D();
}

Axis.prototype.draw = function (canvas, transform = identity2D()) {
  const ctx = canvas.getContext("2d");

  let vertices;
  switch (this.dimension) {
    case "x":
      vertices = [[-canvas.width / 2, 0, 1], [canvas.width / 2, 0, 1]];
      ctx.strokeStyle = "blue";
      break;
    case "y":
      vertices = [[0, -canvas.height / 2, 1], [0, canvas.height / 2, 1]];
      ctx.strokeStyle = "green";
      break;
    default:
      return;
  }

  const transformedVerts = Mat.mult(transform, Mat.mult(this.m, Mat.transpose(vertices)));
  const axis = new Path2D();
  axis.moveTo(transformedVerts[0][0] + canvas.width / 2, canvas.height / 2 - transformedVerts[1][0]);
  axis.lineTo(transformedVerts[0][1] + canvas.width / 2, canvas.height / 2 - transformedVerts[1][1]);

  ctx.lineWidth = 1;
  ctx.stroke(axis);
}

Axis.prototype.transform = function (m) {
  this.m = Mat.mult(m, this.m);
}
