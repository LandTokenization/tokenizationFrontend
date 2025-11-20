import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <main>
      {/* HERO SECTION ONLY */}
      <section className="hero-section">
        <div className="container hero-container">

          <div className="hero-content">
            <p className="badge">Demo Prototype · Gelephu Mindfulness City</p>

            <h1 className="hero-headline">GMC Token Economy Prototype</h1>

            <p className="hero-subline">
              Exploring tokenization for transparent and equitable land compensation in
              Gelephu Mindfulness City — a new standard for mindful governance.
            </p>

            <div className="hero-actions">
              <a href="/login" className="button primary-button">Launch Prototype</a>
              <a href="#about" className="button secondary-button">Learn More</a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="mock-dashboard-card">
              <p className="card-title">Token Overview (Simulated)</p>

              <div className="data-point">
                <span className="label">Total Tokens Issued</span>
                <span className="value">1,000,000 GMC</span>
              </div>

              <div className="data-point">
                <span className="label">Current Value</span>
                <span className="value">1 GMC = 0.85 USD</span>
              </div>

              <div className="data-point">
                <span className="label">Citizen Holders</span>
                <span className="value">1,245</span>
              </div>

              <div className="data-point">
                <span className="label">Total Value Locked</span>
                <span className="value">$850,000 USD</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default Home;
