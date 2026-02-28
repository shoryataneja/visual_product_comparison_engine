import React from 'react';
import { Compass } from 'lucide-react';
import SimilarityBadge from './SimilarityBadge';

const ResultsGrid = ({ results, isLoading }) => {
    if (isLoading) {
        return (
            <div className="glass-panel results-container" style={{ padding: '2rem' }}>
                <div className="empty-state" style={{ minHeight: '300px' }}>
                    <div className="loader"></div>
                    <p className="gold-gradient-text" style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                        Analyzing visual similarities across catalog...
                    </p>
                </div>
            </div>
        );
    }

    if (!results || results.length === 0) {
        return (
            <div className="glass-panel results-container" style={{ padding: '2rem' }}>
                <div className="empty-state">
                    <Compass className="empty-icon" />
                    <h3 style={{ color: 'var(--text-main)' }}>No comparisons yet</h3>
                    <p>Upload a product image to discover visually similar items powered by MobileNet v2.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel results-container" style={{ padding: '2rem' }}>
            <div className="results-header">
                <h2>Top Visually Similar Products</h2>
                <span style={{ color: 'var(--text-muted)' }}>Found {results.length} matches</span>
            </div>

            <div className="results-grid">
                {results.map((result, index) => {
                    const { item, similarity } = result;
                    return (
                        <div key={item.id || index} className="glass-panel product-card" style={{ padding: '15px' }}>
                            <div className="product-image-container">
                                <img src={item.image} alt={item.name} className="product-image" />
                            </div>

                            <div className="product-info">
                                <span className="product-brand">{item.brand || 'Premium Brand'}</span>
                                <h4 className="product-name" title={item.name}>{item.name}</h4>
                                <span className="product-category">{item.category}</span>
                                <SimilarityBadge score={similarity} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResultsGrid;
