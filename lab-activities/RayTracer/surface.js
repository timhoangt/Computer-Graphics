import * as Vec from "./vecmath.js";

/* Hit record structure */
function Hit(obj, t, ray) {
  this.object = obj;
  this.t = t;
  this.ray = ray;
}

/* Representation of a group of surfaces */

export function Group() {
  this.surfaces = [];
}

Group.prototype.intersect = function(ray) {
  // TODO Intersect the ray with all objects in this group
  //  and return the nearest hit (smallest value for t)
  let nearestHit = null;
  for(let i = 0; i < this.surfaces.length; i++){
    let hit = this.surfaces[i].intersect(ray);
    if (hit){
      if (nearestHit == null || hit.t < nearestHit.t){
        nearestHit = hit;
      }
    }
  }
  return nearestHit;
};

Group.prototype.addSurface = function(s) {
  this.surfaces.push(s);
}

/* Representation of spherical surface */

export function Sphere(center, radius, color, shininess) {
  this.center = center;
  this.radius = radius;
  this.color  = color;
  this.shininess = shininess;
}

Sphere.prototype.normal = function(p){
  //takes a point on the Sphere and computes the surface normal vector, n, at that point.
  let pc = Vec.diff(p, this.center)
  let n = Vec.mult((1/this.radius), pc);
  return n;
}

Sphere.prototype.intersect = function(ray) {

  const A  = Vec.dot(ray.direction, ray.direction); //A = d . d
  const ec = Vec.diff(ray.origin, this.center);
  const B  = Vec.dot(ray.direction, ec); //B = 2d . (e - c)
  const C  = Vec.dot(ec, ec) - this.radius*this.radius; //C = (e - c) . (e - c)

  const discriminant = (B*B) - (A*C);
  // TODO Check whether intersection exists and return an appropriate Hit object
  if (discriminant >= 0) {
    return new Hit(this, (-B - Math.sqrt(discriminant)) / A, ray);
  }
};

