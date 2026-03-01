import React, { useEffect, useState } from 'react';
import { PiMagnifyingGlassBold, PiArrowCounterClockwiseBold, PiCheckCircleFill, PiWarningCircleFill, PiArrowsClockwiseBold } from 'react-icons/pi';

const ResultsGrid = ({ results, isLoading, queryImage, onChainSearch, onNewSearch }) => {
    const [mounted, setMounted] = useState(false);
    const [chainingId, setChainingId] = useState(null);

    useEffect(() => {
        if (!isLoading && results?.length > 0) {
            setTimeout(() => setMounted(true), 50);
        } else {
            setMounted(false);
        }
    }, [isLoading, results]);

    if (isLoading || !results || results.length === 0) {
        return null;
    }

    const handleChain = (item, id) => {
        setChainingId(id);
        setTimeout(() => setChainingId(null), 3000);
        onChainSearch && onChainSearch(item);
    };

    return (
        <div className="results-container">
            <div className="query-col">
                <div className="query-card">
                    <div className="query-card-title">Original Query</div>
                    {queryImage && <img src={queryImage} alt="Query" className="query-img" />}
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        MobileNet v2 extracted 1,024-dimensional features locally on your device.
                    </p>
                    <button className="new-search-btn" onClick={onNewSearch}>
                        <PiArrowCounterClockwiseBold size={16} />
                        New Search
                    </button>
                </div>
            </div>

            <div className="results-col">
                <div className="results-header-row">
                    <div className="results-title">
                        <PiMagnifyingGlassBold size={24} color="var(--text-primary)" />
                        <span>Similar Matches</span>
                        <span className="results-count-badge">{results.length}</span>
                    </div>
                    <div className="res-header-actions">
                        <div className="chain-hint">
                            💡 Click <strong>Find Similar</strong> on any card to find more
                        </div>
                        <button className="btn-secondary small" onClick={onNewSearch}>
                            Upload New Image
                        </button>
                    </div>
                </div>

                <div className="grid-container">
                    {results.map((result, index) => {
                        const { item, similarity } = result;
                        const percentage = Math.round(similarity * 100);
                        const cardId = item.id || index;
                        const isChaining = chainingId === cardId;

                        let colorHex = '#ef4444';
                        if (percentage >= 90) colorHex = '#10b981';
                        else if (percentage >= 70) colorHex = '#f5b800';

                        return (
                            <div
                                key={cardId}
                                className={`ui-card ${isChaining ? 'card-chaining' : ''}`}
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <div className="ui-card-image-wrapper">
                                    <div className="match-pill" style={{ backgroundColor: colorHex }}>
                                        {percentage}% MATCH
                                    </div>
                                    <img src={item.image} alt={item.name} className="ui-card-img" />

                                    <button
                                        className="chain-search-btn"
                                        onClick={() => handleChain(item, cardId)}
                                        title="Find products similar to this one"
                                    >
                                        <PiArrowsClockwiseBold size={14} />
                                        Find Similar
                                    </button>
                                </div>

                                <div className="ui-card-content">
                                    <h4 className="ui-card-title" title={item.name}>{item.name}</h4>
                                    <span className="ui-card-subtitle">{item.brand || 'PREMIUM COLLECTION'}</span>

                                    <div className="confidence-container">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: colorHex }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {percentage >= 90 ? <PiCheckCircleFill /> : percentage >= 70 ? <PiWarningCircleFill color="#f5b800" /> : <PiWarningCircleFill color="#ef4444" />}
                                                Confidence Score
                                            </span>
                                        </div>
                                        <div className="confidence-bar-bg">
                                            <div
                                                className="confidence-bar-fill"
                                                style={{ width: mounted ? `${percentage}%` : '0%', backgroundColor: colorHex }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="ui-card-footer">
                                        <span className="ui-card-price">{item.price || '₹0'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ResultsGrid;
