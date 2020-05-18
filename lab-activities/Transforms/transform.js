export function identity2D() {
  return [[1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]];
}

export function rotate2D(angle = 0) {
  // TODO #2a return the appropriate matrix as an array-of-arrays
  return [[Math.cos(angle), -Math.sin(angle), 0],
  		  [Math.sin(angle), Math.cos(angle), 0],
  		  [0, 0, 1]];
}

export function shearX(sx) {
  // TODO #2b return the appropriate matrix as an array-of-arrays
  return [[1, sx, 0],
  		  [0, 1, 0],
  		  [0, 0, 1]];
}

export function shearY(sy) {
  // TODO #2c return the appropriate matrix as an array-of-arrays
  return [[1, 0 ,0],
  		  [sy, 1, 0],
  		  [0, 0, 1]];
}

export function scale2D(sx = 1, sy = 1) {
  // TODO #2d return the appropriate matrix as an array-of-arrays
  return [[sx, 0, 0],
  		  [0, sy, 0],
  		  [0, 0, 1]];
}

export function translate2D(dx = 0, dy = 0) {
  // TODO #2e return the appropriate matrix as an array-of-arrays
  return [[1, 0, dx],
  		  [0, 1, dy],
  		  [0, 0, 1]];
}

export function identity3D() {
  return [[1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]];
}

export function rotateX3D(angle = 0) {
  return [[1, 0, 0, 0],
          [0, Math.cos(angle), -Math.sin(angle), 0],
  		  [0, Math.sin(angle), Math.cos(angle), 0],
  		  [0, 0, 0, 1]];
}

export function rotateY3D(angle = 0) {
  return [[Math.cos(angle), 0, Math.sin(angle), 0],
          [ 0, 1, 0, 0],
  		  [-Math.sin(angle), 0, Math.cos(angle), 0],
  		  [0, 0, 0, 1]];
}

export function rotateZ3D(angle = 0) {
  return [[Math.cos(angle), -Math.sin(angle), 0, 0],
  		  [Math.sin(angle), Math.cos(angle), 0, 0],
  		  [0, 0, 1, 0],
  		  [0, 0, 0, 1]];
}

export function shearX3D(sx) {
  return [[1, sx, 0 ,0],
  		  [0, 1, 0, 0],
  		  [0, 0, 1, 0],
  		  [0, 0, 0, 1]];
}

export function shearY3D(sy) {
  return [[1, 0, 0, 0],
  		  [sy, 1, 0, 0],
  		  [0, 0, 1, 0],
  		  [0, 0, 0, 1]];
}

export function scale3D(sx = 1, sy = 1, sz = 1) {
  return [[sx, 0, 0, 0],
  		  [0, sy, 0, 0],
  		  [0, 0, sz, 0],
  		  [0, 0, 0, 1]];
}

export function translate3D(dx = 0, dy = 0, dz = 0) {
  return [[1, 0, 0, dx],
  		  [0, 1, 0, dy],
  		  [0, 0, 1, dz],
  		  [0, 0, 0, 1]];
}
