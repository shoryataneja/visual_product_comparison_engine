import { getModel } from './modelLoader.js';
import { extractRawEmbedding } from './embeddingExtractor.js';
import { normalizeVector } from './vectorUtils.js';

export async function extractEmbedding(imageElement) {
  try {
    const model = await getModel();

    const rawEmbedding = await extractRawEmbedding(model, imageElement);

    const normalizedEmbedding = normalizeVector(rawEmbedding);

    return normalizedEmbedding;
  } catch (error) {
    console.error('Error extracting embedding:', error);
    throw error;
  }
}

export { normalizeVector } from './vectorUtils.js';
export { getModel } from './modelLoader.js';
