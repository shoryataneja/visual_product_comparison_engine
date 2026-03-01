export function cosineSimilarity(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length');
  }

  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);

  return dotProduct;
}

export function findTopSimilar(queryEmbedding, catalog, topK = 10, minSimilarity = 0.3) {
  const results = catalog.map(item => ({
    item,
    similarity: cosineSimilarity(queryEmbedding, item.embedding)
  }));

  return results
    .filter(r => r.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}
