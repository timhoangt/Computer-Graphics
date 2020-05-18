import {degreesToRadians} from "./genmath.js";
import * as Vec from "./vecmath.js";

/* Scene representation */
export function Scene(surface) {
  this.image = document.getElementById("viewport"); // HTML5 canvas element serving as render buffer
  this.surface = surface; // a Surface object (must have a valid intersect method)
  this.backgroundColor = [0.5, 0.5, 0.5]; // default background color when no intersection is found
  this.camera = { // simple definition for a linear-perspective viewer
    aspect: this.image.width / this.image.height,
    fov: degreesToRadians(60),
    // eye/camera position
    e: [ 0, 0, 0 ],
    // basis vector for camera coordinate frame
    u: [ 1, 0, 0 ],
    v: [ 0, 1, 0 ],
    w: [ 0, 0, 1 ],
    // distance to the image/view plane
    d: 1
  };
}

/* Generate viewing ray through the pixel with given coordinates */
Scene.prototype.project = function(i, j) {

  const top = this.camera.d*Math.tan(this.camera.fov/2);
  const right = this.camera.aspect * top;
  const bottom = -top;
  const left = -right;
  const u = left + (right - left) * (i + 0.5) / this.image.width;
  const v = top - (top - bottom) * (j + 0.5) / this.image.height;

  return {

    direction: Vec.add(Vec.mult(-this.camera.d, this.camera.w), Vec.add(Vec.mult(u, this.camera.u), Vec.mult(v, this.camera.v))),

    origin: this.camera.e
  };
};

/* Compute the shaded color for the given object intersection.*/
Scene.prototype.shade = function(hit) {
  if (hit){
  
    this.light = {
      //position of light
      position: [-2 , 6, 1],
      //color
      color: [1, 1, 1]
    };

    //compute p from ray and t
    let p = Vec.add(hit.ray.origin, (Vec.mult(hit.t, hit.ray.direction)));

    // get the surface normal
    let n = hit.object.normal(p);

    //get the angle between light intersection with the object and the ray intersection with the object
    let l = Vec.norm(Vec.diff(this.light.position, p));

    let ev = Vec.norm(Vec.mult(-1, hit.ray.direction));

    const h = Vec.norm(Vec.add(ev, l));

    //L = kd I max(0, n · l) + ks I max(0, n · h)p,
    
    let color = this.light.color;
    color[0] = (hit.object.color[0] * this.light.color[0] * Math.max(0, Vec.dot(n, l))) + (hit.object.color[0] * this.light.color[0] * Math.pow(Math.max(0, Vec.dot(n, h)), hit.object.shininess));
    color[1] = (hit.object.color[1] * this.light.color[1] * Math.max(0, Vec.dot(n, l))) + (hit.object.color[1] * this.light.color[1] * Math.pow(Math.max(0, Vec.dot(n, h)), hit.object.shininess));
    color[2] = (hit.object.color[2] * this.light.color[2] * Math.max(0, Vec.dot(n, l))) + (hit.object.color[2] * this.light.color[2] * Math.pow(Math.max(0, Vec.dot(n, h)), hit.object.shininess));

    
    

    return color;
  }
  //  Otherwise return the background color.
  else{
    return this.backgroundColor;
  }
  

};

/* Basic ray tracing algorithm. */
Scene.prototype.trace = function() {
  for (let j = 0; j < this.image.height; j++)
    for (let i = 0; i < this.image.width; i++) {

      const ray   = this.project(i,j);
      const hit   = this.surface.intersect(ray);
      // Set the pixel color in the render buffer
      this.image.getContext("2d").fillStyle = arrayToColor(this.shade(hit));
      this.image.getContext("2d").fillRect(i, j, 1, 1);
    }
};

/* Helper function to convert an number array to a CSS color value */
function arrayToColor(rgb) {
  return "rgb(" + 255*rgb[0] + "," + 255*rgb[1] + "," + 255*rgb[2] + ")";
}
