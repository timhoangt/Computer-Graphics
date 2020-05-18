import * as THREE from './vendor/build/three.module.js';

const ONEDEGREE = Math.PI / 180;

// TODO #0 rename your class and module
export default function ShishKebab() {
  // TODO #1 set the initial position/scale/orientation of your model
  const self = this;

  this.scale.x = this.scale.y = this.scale.z = 5;
  this.position.x = -5;
  this.position.y = 30;
  this.incr = 0.1;

  // TODO #2 create the shapes that you'll use to build your model.
  //    I recommend simple, built-in geometries like cube, sphere, etc.
  //    Be sure to choose shapes the fit the object you want to create.
  //    Examples:
  //      - for a hinged pendulum (a la textbook) you might use two Boxes and a Cylinder
  //      - for a Car you might use several Boxes (makes it easier to see the wheels moving!)
  //      - for a Bird might be composed of a sphere/capsule for a body
  //        and two flattened Boxes for wings
  //    Later, once you get it working, you can decide it you want to make it prettier
  // TODO #2a create a base mesh from a simple geometry
  function createMaterials() {
    const stickMaterial = new THREE.MeshStandardMaterial( {
      color: 0xb1f800, 
      flatShading: true,
    } );
    stickMaterial.color.convertSRGBToLinear();

    const potatoMaterial = new THREE.MeshStandardMaterial( {
      color: 0xffa700, 
      flatShading: true,
    } );
    potatoMaterial.color.convertSRGBToLinear();

    const meatballMaterial = new THREE.MeshStandardMaterial( {
      color: 0xff3333, 
      flatShading: true,
    } );
    meatballMaterial.color.convertSRGBToLinear();
    return {

      stickMaterial,
      potatoMaterial,
      meatballMaterial,

    };

  }

  function createGeometries() {
    const stickGeometry = new THREE.CylinderBufferGeometry( 0.5, 0.5, 30, 1000 );
    stickGeometry.rotateX( - Math.PI / 2);
    // TODO #2b create a second mesh from another geometry
    
    const potatoGeometry = new THREE.BoxBufferGeometry( 5, 5, 1.5 );
    // TODO #2c create a third mesh from another geometry
    
    const meatballGeometry = new THREE.SphereBufferGeometry( 3, 1000, 1000 );
  // TODO #2d (Optional) add more meshes if you want to make a more complex object!
    return {
      stickGeometry,
      potatoGeometry,
      meatballGeometry,
    };

  }


  // TODO #3 assemble the shapes into a hierarchy appropriate for animating your object
  const shishKebab = new THREE.Group();
  const materials = createMaterials();
  const geometries = createGeometries();
  // TODO #3a add the base mesh to your model
  const stick = new THREE.Mesh( geometries.stickGeometry, materials.stickMaterial );
  // TODO #3b add the second mesh to your model or the base mesh (depending on your design)
  const potato = new THREE.Mesh( geometries.potatoGeometry, materials.potatoMaterial );
  // TODO #3c add the third mesh to your model, the base, or the second mesh (depending on your design)
  const meatball = new THREE.Mesh( geometries.meatballGeometry, materials.meatballMaterial );
  // TODO #3d (Optional) attach more meshes to make a more complex object!

  // TODO #4 apply transformations to each mesh in order achieve the desired position/sizing/orientation
  stick.position.set( 4, 0, -10 );
  potato.position.set( 4, 0, -20 );
  meatball.position.set( 4, 0, 0 );

  // TODO #5 create and assign materials to your meshes to give your object some character!
  this.add(stick, potato, meatball);
}

ShishKebab.prototype = new THREE.Object3D();

ShishKebab.prototype.animate = function () {

  // TODO #6 update transformations on each node of your model
  // appropriately to yield the desired animation(s)
  //    Examples:
  //      - for a hinged pendulum (a la textbook) you might increment the rotations on the arms
  //      - for a Car increment the translation on the top-level node and the rotations on the wheel nodes
  //      - for a Bird increment the translation on the top-level node, a vertical "bob" translation on the
  //        body node, and rotations (with limited range) on the wing nodes
  


  this.rotation.z -= 0.01;
  this.position.x += 0.3;
  
}

// TODO #7 (Optional) add additional methods for updating transformations
// on your model for use with input controls for user interaction
