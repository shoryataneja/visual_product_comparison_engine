export function normalizeVector(vector) {
  const norm = Math.sqrt(
    vector.reduce((sum, val) => sum + val * val, 0)
  );

  if (norm === 0) {
    return vector;
  }

  return vector.map(val => val / norm);
}
