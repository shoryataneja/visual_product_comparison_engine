import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let modelInstance = null;

export async function getModel() {
  if (modelInstance) {
    return modelInstance;
  }

  try {
    await tf.setBackend('webgl');
    await tf.ready();
    console.log('TensorFlow.js backend initialized:', tf.getBackend());

    modelInstance = await mobilenet.load({
      version: 2,
      alpha: 0.5,
    });

    console.log('MobileNet v2 loaded successfully');
    return modelInstance;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
}
