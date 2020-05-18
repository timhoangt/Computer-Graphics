//All of our transformation matrices

export function Scale(v) {
  return [[v, 0, 0, 0],
          [0, v, 0, 0],
          [0, 0, v, 0],
          [0, 0, 0, 1]];
}

export function Translate(v) {
  return [[1, 0, 0, v[0]],
          [0, 1, 0, v[1]],
          [0, 0, 1, v[2]],
          [0, 0, 0, 1  ]];
}

export function RotateX(a) {
  return [[1, 0, 0, 0],
          [0, Math.cos(a),-Math.sin(a), 0],
          [0, Math.sin(a), Math.cos(a), 0],
          [0, 0, 0, 1]];
}

export function RotateY(a) {
  return [[Math.cos(a), 0, Math.sin(a), 0],
          [0, 1, 0, 0],
          [-Math.sin(a), 0, Math.cos(a), 0],
          [0, 0, 0, 1]];
}

export function RotateZ(a) {
  return [[Math.cos(a),-Math.sin(a), 0, 0],
          [Math.sin(a), Math.cos(a), 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]];
}
