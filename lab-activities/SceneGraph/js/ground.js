import * as THREE from './vendor/build/three.module.js';

export default function Ground(x, y, z) {
  THREE.Mesh.call(this, this.geometry, new THREE.MeshLambertMaterial());

  // TODO #2 position your object
  this.position.x = x;
  this.position.y = 0;
  this.position.z = z;
  const self = this;

  // TODO #3 load a texture image and assign a new material using that texture
  new THREE.TextureLoader().load('./textures/light_wood.jpg', texture => {
    self.texture = texture;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 50, 50);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    self.material = new THREE.MeshLambertMaterial({
      map: texture
    });
  });
};

Ground.prototype = Object.create(THREE.Mesh.prototype);

// TODO #1 all Ground objects should have a Plane geometry
Ground.prototype.geometry = new THREE.PlaneGeometry(10000, 10000, 1, 1);
Ground.prototype.geometry.rotateX( - Math.PI / 2);
