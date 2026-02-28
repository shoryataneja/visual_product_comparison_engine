import React, { useEffect, useState } from 'react';
import { PiMagnifyingGlassBold, PiDotsThreeBold, PiCheckCircleFill, PiWarningCircleFill } from 'react-icons/pi';

const ResultsGrid = ({ results, isLoading, queryImage }) => {
    const [mounted, setMounted] = useState(false);

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

    return (
        <div className="results-container">
            {/* Left Column: Query Image Layout */}
            <div className="query-col">
                <div className="query-card">
                    <div className="query-card-title">Original Query</div>
                    {queryImage && <img src={queryImage} alt="Query" className="query-img" />}
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MobileNet v2 extracted 1,024-dimensional features locally on your device.</p>
                </div>
            </div>

            {/* Right Column: Matched Grid */}
            <div className="results-col">
                <div className="results-header-row">
                    <div className="results-title">
                        <PiMagnifyingGlassBold size={24} color="var(--text-primary)" />
                        <span>Similar Matches</span>
                    </div>
                    <div className="filters">
                        <button className="filter-btn">Filter</button>
                        <button className="filter-btn">Sort by Match</button>
                    </div>
                </div>

                <div className="grid-container">
                    {results.map((result, index) => {
                        const { item, similarity } = result;
                        const percentage = Math.round(similarity * 100);

                        let colorHex = '#ef4444'; // Red for low
                        if (percentage >= 90) colorHex = '#10b981'; // Green for high 
                        else if (percentage >= 70) colorHex = '#f5b800'; // Yellow for mid

                        return (
                            <div key={item.id || index} className="ui-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="ui-card-image-wrapper">
                                    <div className="match-pill" style={{ backgroundColor: colorHex }}>
                                        {percentage}% MATCH
                                    </div>
                                    <img src={item.image} alt={item.name} className="ui-card-img" />
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
                                        <span className="ui-card-price">${item.price || '0.00'}</span>
                                        <button className="ui-card-more">
                                            <PiDotsThreeBold size={20} />
                                        </button>
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
