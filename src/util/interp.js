export function lerp(x0, x1, t0, t1, tx) {
  return x0 + ((tx - t0) / (t1 - t0)) * (x1 - x0);
}
