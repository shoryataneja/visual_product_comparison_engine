import React, { useState, useEffect } from 'react';
import { extractEmbedding } from './ai/index.js';
import { findTopSimilar } from './ai/similarityUtils.js';

import ImageUploader from './components/ImageUploader';
import ResultsGrid from './components/ResultsGrid';
import { Layers } from 'lucide-react';
import './App.css';

function App() {
  const [catalog, setCatalog] = useState([]);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);

  // Load catalog on mount
  useEffect(() => {
    async function loadCatalog() {
      try {
        const response = await fetch('/catalog.json');
        if (!response.ok) throw new Error('Failed to load catalog');
        const data = await response.json();
        setCatalog(data.products || []);
      } catch (error) {
        console.error('Error loading catalog:', error);
      } finally {
        setIsCatalogLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const handleImageUpload = async (imgElement) => {
    setIsProcessing(true);
    try {
      // 1. Extract and normalize embedding using MobileNet v2
      // Note: extractEmbedding calls getModel() inside which loads TF.js model lazily
      const queryEmbedding = await extractEmbedding(imgElement);

      // 2. Perform cosine similarity against catalog
      // 3. Get top 10 most similar
      const similarProducts = findTopSimilar(queryEmbedding, catalog, 6);

      setResults(similarProducts);
    } catch (error) {
      console.error('Error during image processing:', error);
      alert('Failed to process image. Make sure TensorFlow is ready.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="gold-gradient-text">
          <Layers size={48} style={{ display: 'inline', marginRight: '16px', verticalAlign: 'text-bottom' }} />
          Overclock Vision
        </h1>
        <p>AI-Powered Visual Product Discovery Engine</p>
      </header>

      {isCatalogLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="loader"></div>
          <p className="gold-gradient-text" style={{ marginTop: '1rem' }}>Initializing AI Ecosystem...</p>
        </div>
      ) : (
        <main className="main-content">
          <aside className="sidebar">
            <ImageUploader
              onImageUpload={handleImageUpload}
              isProcessing={isProcessing}
            />
          </aside>

          <section className="results-section">
            <ResultsGrid
              results={results}
              isLoading={isProcessing}
            />
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
