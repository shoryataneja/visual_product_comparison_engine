import React from 'react';
import { Target } from 'lucide-react';

const SimilarityBadge = ({ score }) => {
    // Convert 0-1 score to percentage
    const percentage = Math.round(score * 100);

    return (
        <div className="similarity-badge">
            <Target size={14} className="gold-text" style={{ color: '#d4af37' }} />
            <div className="similarity-bar-bg">
                <div
                    className="similarity-bar-fill"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <span className="similarity-text">{percentage}% Match</span>
        </div>
    );
};

export default SimilarityBadge;
