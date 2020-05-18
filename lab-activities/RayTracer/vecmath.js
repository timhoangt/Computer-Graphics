/** Vector arithmetic and operations. */

export function norm(a) {
  const magnitude = Math.sqrt(dot(a, a));
  return a.map(ai => ai / magnitude);
}

export function mult(k, a) {
  return a.map(ai => k * ai);
}

export function add(a, b) {
  return a.reduce((c, ai, i) => { c.push(ai + b[i]); return c; }, []);
}
export function diff(a, b) {
  return a.reduce((c, ai, i) => { c.push(ai - b[i]); return c; }, []);
}

export function dot(a, b) {
  return a.reduce((r, ai, i) => r + ai*b[i], 0);
}

export function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}