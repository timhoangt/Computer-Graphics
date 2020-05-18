import * as Mat from "./matmath.js"
import {
  identity2D
} from "./transform.js"

export default function Triangle(a, b, c, color) {
  this.verts = [a.concat(1), b.concat(1), c.concat(1)];
  this.color = color;
  this.m = identity2D();
}

Triangle.prototype.draw = function (canvas, transform = identity2D()) {
  const transformedVerts = Mat.mult(transform, Mat.mult(this.m, Mat.transpose(this.verts)));
  const triangle = new Path2D();
  triangle.moveTo(transformedVerts[0][0] + canvas.width / 2, canvas.height / 2 - transformedVerts[1][0]);
  triangle.lineTo(transformedVerts[0][1] + canvas.width / 2, canvas.height / 2 - transformedVerts[1][1]);
  triangle.lineTo(transformedVerts[0][2] + canvas.width / 2, canvas.height / 2 - transformedVerts[1][2]);
  triangle.lineTo(transformedVerts[0][0] + canvas.width / 2, canvas.height / 2 - transformedVerts[1][0]);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = this.color;
  ctx.fill(triangle);
}

Triangle.prototype.transform = function (m) {
  this.m = Mat.mult(m, this.m);
}
