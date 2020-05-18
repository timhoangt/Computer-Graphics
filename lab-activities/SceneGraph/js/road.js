import * as THREE from './vendor/build/three.module.js';

export default function Road(x, z) {
  THREE.Mesh.call(this, this.geometry, new THREE.MeshLambertMaterial());
  this.position.x = x;
  this.position.y = 0;
  this.position.z = z;
  const self = this;
  new THREE.TextureLoader().load('./textures/rough_asphalt_tile.jpg', texture => {
    self.texture = texture;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 50);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    self.material = new THREE.MeshLambertMaterial({
      map: texture
    });
  });
};

Road.prototype = Object.create(THREE.Mesh.prototype);
Road.prototype.geometry = new THREE.CubeGeometry(10000, 0.1, 10000, 1, 1, 1);
