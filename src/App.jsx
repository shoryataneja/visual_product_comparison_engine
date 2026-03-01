import React, { useState, useEffect, useRef } from 'react';
import { extractEmbedding } from './ai/index.js';
import { findTopSimilar } from './ai/similarityUtils.js';

import ImageUploader from './components/ImageUploader';
import ResultsGrid from './components/ResultsGrid';
import LandingPage from './components/LandingPage';
import { PiUserCircleDuotone, PiShieldCheckFill, PiClockCounterClockwiseBold, PiTrashBold } from 'react-icons/pi';
import './App.css';

function App() {
  const [catalog, setCatalog] = useState([]);
  const [results, setResults] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);
  const [threshold, setThreshold] = useState(30);
  const [queryImageLocal, setQueryImageLocal] = useState(null);
  const [history, setHistory] = useState([]);
  const catalogRef = useRef([]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('visualSearchHistory');
  };

  useEffect(() => {
    async function loadCatalog() {
      try {
        const response = await fetch('/catalog.json');
        if (!response.ok) throw new Error('Failed to load catalog');
        const data = await response.json();
        setCatalog(data.products || []);
        catalogRef.current = data.products || [];
      } catch (error) {
        console.error('Error loading catalog:', error);
      } finally {
        setIsCatalogLoading(false);
      }
    }
    loadCatalog();

    const savedHistory = localStorage.getItem('visualSearchHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('visualSearchHistory', JSON.stringify(history.slice(0, 10)));
  }, [history]);

  useEffect(() => {
    if (allResults.length > 0) {
      const minSim = threshold / 100;
      const filtered = allResults
        .filter(r => r.similarity >= minSim)
        .sort((a, b) => b.similarity - a.similarity);
      setResults(filtered);
    }
  }, [threshold, allResults]);

  const addToHistory = (imgData) => {
    setHistory(prev => {
      const filtered = prev.filter(item => item.image.slice(0, 50) !== imgData.slice(0, 50));
      return [{ image: imgData, timestamp: Date.now() }, ...filtered].slice(0, 8);
    });
  };

  const getBase64Image = (img) => {
    const canvas = document.createElement("canvas");
    const MAX_WIDTH = 150;
    const scale = MAX_WIDTH / img.naturalWidth;
    canvas.width = MAX_WIDTH;
    canvas.height = img.naturalHeight * scale;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", 0.7);
  };

  const runSearch = async (imgElement, skipHistory = false) => {
    setIsProcessing(true);
    setResults([]);
    setAllResults([]);

    let historyImage = null;
    if (!skipHistory) {
      try {
        historyImage = getBase64Image(imgElement);
      } catch (e) {
        console.warn("Could not capture history image", e);
      }
    }

    setTimeout(async () => {
      try {
        const queryEmbedding = await extractEmbedding(imgElement);
        const similarProducts = findTopSimilar(queryEmbedding, catalogRef.current, 20, 0);
        setAllResults(similarProducts);
        const minSim = threshold / 100;
        setResults(similarProducts.filter(r => r.similarity >= minSim));

        if (!skipHistory && historyImage) {
          addToHistory(historyImage);
        }
      } catch (error) {
        console.error('Error during image processing:', error);
      } finally {
        setIsProcessing(false);
      }
    }, 2800);
  };

  const handleImageUpload = async (imgElement) => {
    await runSearch(imgElement);
  };

  const handleChainSearch = async (item) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = item.image;
    img.onload = async () => {
      setQueryImageLocal(item.image);
      await runSearch(img);
    };
  };

  const handleHistorySearch = (item) => {
    const img = new Image();
    img.src = item.image;
    img.onload = async () => {
      setQueryImageLocal(item.image);
      await runSearch(img, true);
    };
  };

  const handleNewSearch = () => {
    setResults([]);
    setAllResults([]);
    setQueryImageLocal(null);
    setThreshold(30);
  };

  if (!showApp) {
    return <LandingPage onLaunch={() => window.scrollTo(0, 0) || setShowApp(true)} />;
  }

  return (
    <div className="app-container">
      <nav className="top-nav">
        <div
          className="brand app-brand-btn"
          onClick={() => setShowApp(false)}
          title="Back to Landing Page"
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-icon-wrapper">
            <img src="/eye-icon.png" alt="Visual Lens Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(245,184,0,0.5))' }} />
          </div>
          <span className="brand-text-gradient">Visual Lens</span>
        </div>

        <div className="nav-right">
          {!isProcessing && results.length > 0 && (
            <button className="btn-new-search-nav" onClick={handleNewSearch}>
              <PiClockCounterClockwiseBold size={18} />
              <span>Reset Search</span>
            </button>
          )}
          <div className="status-badge">
            <div className="status-dot"></div>
            LOCAL AI ENGINE: ONLINE
          </div>
          <button className="profile-btn">
            <PiUserCircleDuotone size={22} />
          </button>
        </div>
      </nav>

      <main className="main-content">
        {(!results || results.length === 0) && (
          <div className="hero">
            <h1>Visual Product Search</h1>
            <div className="hero-subtitle">Local Enterprise Intelligence</div>
          </div>
        )}

        {isCatalogLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4rem 0' }}>
            <div className="scanning-state" style={{ border: 'none', background: 'transparent', boxShadow: 'none', animation: 'none' }}>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(245, 184, 0, 0.2)', borderTopColor: 'var(--accent-yellow)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Initializing Engine...</div>
            </div>
          </div>
        ) : (
          <>
            {!isProcessing && (!results || results.length === 0) && history.length > 0 && (
              <div className="history-section">
                <div className="history-header">
                  <div className="history-title">
                    <PiClockCounterClockwiseBold />
                    <span>Recent Visual Queries</span>
                  </div>
                  <button className="clear-history-btn" onClick={clearHistory}>
                    <PiTrashBold />
                    Clear
                  </button>
                </div>
                <div className="history-list">
                  {history.map((item, idx) => (
                    <div key={item.timestamp || idx} className="history-item" onClick={() => handleHistorySearch(item)}>
                      <img src={item.image} alt="Past search" />
                      <div className="history-item-overlay">
                        <span>Re-search</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!results || results.length === 0 || isProcessing) && (
              <ImageUploader
                onImageUpload={handleImageUpload}
                isProcessing={isProcessing}
                setQueryImageLocal={setQueryImageLocal}
              />
            )}

            {!isProcessing && results.length > 0 && (
              <>
                <div className="slider-panel">
                  <div className="slider-label">
                    <span>AI Confidence Threshold</span>
                    <span className="slider-value">{threshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="95"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="similarity-slider"
                  />
                  <div className="slider-hints">
                    <span>Show More</span>
                    <span>{results.length} results</span>
                    <span>Exact Only</span>
                  </div>
                </div>

                <ResultsGrid
                  results={results}
                  isLoading={isProcessing}
                  queryImage={queryImageLocal}
                  onChainSearch={handleChainSearch}
                  onNewSearch={handleNewSearch}
                />
              </>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-left">
          <PiShieldCheckFill size={16} />
          Privacy Note: All processing occurs locally on your machine. No data is sent to the cloud.
        </div>
        <div className="footer-right">
          <span className="footer-link">Privacy Policy</span>
          <span className="footer-link">Terms of Service</span>
          <span className="footer-link">V2.4.0-STABLE</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
