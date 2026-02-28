import React, { useEffect } from 'react';
import {
    PiCloudWarningDuotone,
    PiCoinsDuotone,
    PiLockKeyDuotone,
    PiShieldCheckDuotone,
    PiLightningDuotone,
    PiCpuDuotone,
    PiArrowRightBold,
    PiImageDuotone,
    PiScanDuotone,
    PiGridFourDuotone
} from 'react-icons/pi';
import './LandingPage.css';

const LandingPage = ({ onLaunch }) => {

    useEffect(() => {
        // Smooth scrolling for anchor links within the landing page
        document.querySelectorAll('.nav-links a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                document.getElementById(targetId)?.scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }, []);

    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="brand" style={{ gap: '1rem' }}>
                    <img src="/eye-icon.png" alt="Visual Lens Logo" className="landing-logo" />
                    <span>Visual Lens</span>
                </div>
                <div className="nav-links">
                    <a href="#problem">The Problem</a>
                    <a href="#solution">Architecture</a>
                    <a href="#how">How it Works</a>
                </div>
            </nav>

            <header className="hero-section">
                <div className="hero-bg-glow"></div>
                <h1>Search Products Visually.<br />Instantly. Offline.</h1>
                <p className="hero-subtext">
                    AI-powered visual similarity engine that runs entirely on your device — no cloud APIs, no privacy concerns.
                </p>
                <div className="hero-actions">
                    <button className="btn-primary" onClick={onLaunch}>Launch Demo</button>
                    <a href="#problem" className="btn-secondary">Learn More</a>
                </div>
            </header>

            <section id="problem" className="problem-section">
                <h2 className="section-title">Why Current Visual Search Falls Short</h2>
                <p className="section-subtitle">Most visual product search tools rely on cloud APIs, increasing cost, latency, and privacy risks.</p>
                <div className="card-grid">
                    <div className="feature-card">
                        <img src="/icon-cloud.png" alt="Cloud API" className="card-icon" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                        <h3>Cloud Dependency</h3>
                        <p>Total reliance on external servers causes lag and potential downtime during crucial moments.</p>
                    </div>
                    <div className="feature-card">
                        <img src="/icon-coins.png" alt="High Cost API" className="card-icon" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                        <h3>High API Costs</h3>
                        <p>Paying per request scales poorly as your platform grows and user searches increase.</p>
                    </div>
                    <div className="feature-card">
                        <img src="/icon-lock.png" alt="Privacy Issues" className="card-icon" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                        <h3>Data Privacy</h3>
                        <p>Sending user images directly to third-party APIs compromises their fundamental privacy.</p>
                    </div>
                </div>
            </section>

            <section id="solution" className="solution-section">
                <h2 className="section-title">A New Approach to Visual Search</h2>
                <div className="card-grid">
                    <div className="feature-card highlight">
                        <img src="/icon-shield.png" alt="Offline Safe" className="card-icon yellow" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                        <h3>100% Offline Processing</h3>
                        <p>All feature extraction happens securely within the user's browser.</p>
                    </div>
                    <div className="feature-card highlight">
                        <img src="/icon-realtime.png" alt="Real Time Local Network" className="card-icon yellow" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                        <h3>Real-Time Matching</h3>
                        <p>Zero network latency means instantaneous visual similarity results.</p>
                    </div>
                    <div className="feature-card highlight">
                        <img src="/icon-step-ai.png" alt="MobileNet TFjs" className="card-icon yellow" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                        <h3>On-Device AI with TF.js</h3>
                        <p>Powered by MobileNetV2 running optimally on local machine tensor cores.</p>
                    </div>
                </div>
            </section>

            <section id="how" className="how-section">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-container">
                    <div className="step-box highlight-white">
                        <div className="step-number">01</div>
                        <div className="step-icon-wrapper">
                            <img src="/icon-step-album.png" alt="Upload Image" className="step-icon" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                        </div>
                        <h4>Upload Image</h4>
                        <p>Select a product picture securely.</p>
                    </div>
                    <PiArrowRightBold size={36} className="step-arrow" />
                    <div className="step-box highlight-yellow">
                        <div className="step-number">02</div>
                        <div className="step-icon-wrapper yellow">
                            <img src="/icon-extract.png" alt="Locally Extract" className="step-icon yellow" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                        </div>
                        <h4>Extract Locally</h4>
                        <p>AI generates 1,024-D feature vector.</p>
                    </div>
                    <PiArrowRightBold size={36} className="step-arrow" />
                    <div className="step-box highlight-green">
                        <div className="step-number">03</div>
                        <div className="step-icon-wrapper green">
                            <img src="/icon-step-match.png" alt="Rank Matches" className="step-icon green" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                        </div>
                        <h4>Rank Matches</h4>
                        <p>Cosine similarity returns best items.</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-badge">🔒 100% Private — Runs Only On Your Device</div>
                <h2 className="section-title cta-title">Experience Private AI-Powered<br />Visual Search</h2>
                <p className="cta-subtitle">No sign-up. No cloud. No data leaves your browser.<br />Just instant, intelligent visual matching.</p>

                <div className="cta-stats">
                    <div className="cta-stat">
                        <span className="cta-stat-number">1,024</span>
                        <span className="cta-stat-label">Feature Dimensions</span>
                    </div>
                    <div className="cta-stat-divider" />
                    <div className="cta-stat">
                        <span className="cta-stat-number">&lt;100ms</span>
                        <span className="cta-stat-label">Similarity Matching</span>
                    </div>
                    <div className="cta-stat-divider" />
                    <div className="cta-stat">
                        <span className="cta-stat-number">0KB</span>
                        <span className="cta-stat-label">Data Uploaded</span>
                    </div>
                </div>

                <button className="btn-primary large mt-4" onClick={onLaunch}>Launch Demo Engine →</button>
                <p className="cta-footnote">Powered by TensorFlow.js · MobileNetV2 · Cosine Similarity</p>
            </section>
        </div>
    );
};

export default LandingPage;
