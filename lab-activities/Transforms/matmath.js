import * as Vec from "./vecmath.js";

/** Matrix arithmetic and operations. */

export function row(m, i) {
  return m[i];
}

export function column(m, j) {
  return m.map(row => row[j]);
}

export function transpose(m) {
  const result = [];
  for (let i = 0; i < m[0].length; i++) {
    result.push(new Array(m.length));
    for (let j = 0; j < m.length; j++)
      result[i][j] = m[j][i];
  }
  return result;
}

export function mult(a, b) {
  const c = [];
  for (let i = 0; i < a.length; i++) {
    c.push([]);
    for (let j = 0; j < b[0].length; j++)
      c[i][j] = Vec.dot(row(a, i), column(b, j));
  }
  return c;
}

export function add(a, b) {
  const c = [];
  for (let i = 0; i < a.length; i++)
    c[i] = Vec.add(row(a, i), row(b, i));
  return c;
}

export function diff(a, b) {
  const c = [];
  for (let i = 0; i < a.length; i++)
    c[i] = Vec.diff(row(a, i), row(b, i));
  return c;
}

export function determinant(m) {
  if (m.length == 1) {
    return m[0];
  } else if (m.length == 2) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  } else if (m.length == 3) {
    return m[0][0] * cofactor(m, 0, 0) - m[0][1] * cofactor(m, 0, 1) + m[0][2] * cofactor(m, 0, 2);
  } else if (m.length == 4) {
    return m[0][0] * cofactor(m, 0, 0) - m[0][1] * cofactor(m, 0, 1) + m[0][2] * cofactor(m, 0, 2) - m[0][3] * cofactor(m, 0, 3);
  }
}

export function cofactor(m, i, j) {
  const result = m.map(r => r.slice());
  result.splice(i, 1);
  result.forEach(r => r.splice(j, 1));
  return determinant(result);
}

export function inverse(m) {
  const d = determinant(m);
  const minv = [];
  for (let i = 0; i < m.length; i++) {
    minv.push([]);
    for (let j = 0; j < m[0].length; j++) {
      minv[i][j] = cofactor(m, j, i) / (((i + j) % 2) ? -d : d);
    }
  }
  return minv;
}
