import * as THREE from './vendor/build/three.module.js';
import {
  GLTFLoader
} from './vendor/examples/jsm/loaders/GLTFLoader.js';

const ONEDEGREE = Math.PI / 180;
const MAXTURN = 80 * ONEDEGREE;
const MINTURN = -MAXTURN;
const BIKESCALE = 10;
const WHEELRAD = 1.25 * BIKESCALE;

export default function Bicycle() {
  const self = this;

  this.scale.x = this.scale.y = this.scale.z = BIKESCALE;
  this.position.x = -21;
  this.position.y = 14;
  this.incr = 1; // for controlling the speed of animation

  const loader = new GLTFLoader().setPath('./models/');
  loader.load('frame.gltf', function (gltf) {
    const frame = gltf.scene;
    self.add(frame);

    loader.load('wheel.gltf', function (gltf) {
      self.rearWheel = gltf.scene;
      self.rearWheel.position.x = -0.1;
      self.rearWheel.position.y = 0;
      frame.add(self.rearWheel);

      loader.load('steeringAssembly.gltf', function (gltf) {
        self.steeringAssembly = gltf.scene;

        const steeringTransform = new THREE.Object3D();
        steeringTransform.position.x = 3.3;
        steeringTransform.position.y = 1.35;
        steeringTransform.rotation.z = 20 * ONEDEGREE;

        steeringTransform.add(self.steeringAssembly);
        frame.add(steeringTransform);

        loader.load('wheel.gltf', function (gltf) {
          self.frontWheel = gltf.scene;
          self.frontWheel.position.x = 0.25;
          self.frontWheel.position.y = -1.55;
          self.steeringAssembly.add(self.frontWheel);

          self.buildGUI();
        })
      });
    });
  });
}

Bicycle.prototype = new THREE.Object3D();

Bicycle.prototype.animate = function () {
  this.rearWheel.rotation.z -= this.incr;

  const frontWheelIncr = this.incr / Math.cos(this.steeringAssembly.rotation.y);
  this.rotation.y += Math.atan(1.25 * frontWheelIncr * Math.sin(this.steeringAssembly.rotation.y) / 3.6);
  this.frontWheel.rotation.z -= frontWheelIncr;

  const moveIncr = -WHEELRAD * this.incr;
  this.position.x -= moveIncr * Math.cos(this.rotation.y);
  this.position.z += moveIncr * Math.sin(this.rotation.y);
}

Bicycle.prototype.pedalFwd = function () {
  this.incr += ONEDEGREE;
}

Bicycle.prototype.pedalRev = function () {
  this.incr -= ONEDEGREE;
}

Bicycle.prototype.turnRight = function () {
  if (this.steeringAssembly.rotation.y > MINTURN) {
    this.steeringAssembly.rotation.y -= ONEDEGREE;
  }
}

Bicycle.prototype.turnLeft = function () {
  if (this.steeringAssembly.rotation.y < MAXTURN) {
    this.steeringAssembly.rotation.y += ONEDEGREE;
  }
}

Bicycle.prototype.buildGUI = function () {
  var gui = new dat.GUI();
  var bikeFolder = gui.addFolder('Bicycle');
  bikeFolder.add(this, 'incr', MINTURN / 4, MAXTURN / 4).listen();
  bikeFolder.add(this.steeringAssembly.rotation, 'y', MINTURN, MAXTURN).listen();
  bikeFolder.open();
}
