import * as tf from '@tensorflow/tfjs';

export async function extractRawEmbedding(model, imageElement) {
  return tf.tidy(() => {
    const embeddingTensor = model.infer(imageElement, true);

    const embedding = embeddingTensor.arraySync();

    return Array.isArray(embedding[0]) ? embedding[0] : embedding;
  });
}
