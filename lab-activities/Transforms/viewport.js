import {
  identity2D
} from "./transform.js"

export default function Viewport(canvas) {
  this.canvas = canvas;
  this.m = identity2D();
}

Viewport.prototype.clear = function () {
  this.canvas.getContext("2d")
    .clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Viewport.prototype.camera = function (cameraMatrix) {
  this.m = cameraMatrix;
}

Viewport.prototype.render = function (objects, clear = true) {
  if (clear) this.clear();
  objects.forEach(obj => obj.draw(this.canvas, this.m));
};
