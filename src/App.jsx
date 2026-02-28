import React, { useState, useEffect } from 'react';
import { extractEmbedding } from './ai/index.js';
import { findTopSimilar } from './ai/similarityUtils.js';

import ImageUploader from './components/ImageUploader';
import ResultsGrid from './components/ResultsGrid';
import LandingPage from './components/LandingPage';
import { PiUserCircleDuotone, PiShieldCheckFill } from 'react-icons/pi';
import './App.css';

function App() {
  const [catalog, setCatalog] = useState([]);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);

  // Track the uploaded image visually for the layout
  const [queryImageLocal, setQueryImageLocal] = useState(null);

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
    setResults([]); // clear past results while scanning

    // Increased delay for startup scanning state feel
    setTimeout(async () => {
      try {
        const queryEmbedding = await extractEmbedding(imgElement);
        const similarProducts = findTopSimilar(queryEmbedding, catalog, 6); // Up to 6 matches (3x2 grid)
        setResults(similarProducts);
      } catch (error) {
        console.error('Error during image processing:', error);
      } finally {
        setIsProcessing(false);
      }
    }, 2800); // 2.8s scan duration for visual SaaS effect
  };

  if (!showApp) {
    return <LandingPage onLaunch={() => window.scrollTo(0, 0) || setShowApp(true)} />;
  }

  return (
    <div className="app-container">
      {/* Top Navigation */}
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
          <div className="status-badge">
            <div className="status-dot"></div>
            LOCAL AI ENGINE: ONLINE
          </div>
          <button className="profile-btn">
            <PiUserCircleDuotone size={22} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
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
            {(!results || results.length === 0 || isProcessing) && (
              <ImageUploader
                onImageUpload={handleImageUpload}
                isProcessing={isProcessing}
                setQueryImageLocal={setQueryImageLocal}
              />
            )}

            {!isProcessing && results.length > 0 && (
              <ResultsGrid results={results} isLoading={isProcessing} queryImage={queryImageLocal} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
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
