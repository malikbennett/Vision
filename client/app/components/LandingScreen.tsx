import React from 'react';

interface LandingScreenProps {
  onGetStarted: () => void;
}

export default function LandingScreen({ onGetStarted }: LandingScreenProps) {
  return (
    <div className="landing-container">
        <div className="landing-content">
          <div className="landing-icon">👁️</div>
          <h1 className="landing-title">Vision</h1>
          <p className="landing-subtitle">Community-Driven Incident Reporting</p>
          
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🗺️</span>
              <div>
                <h3>Real-Time Map</h3>
                <p>See incidents as they happen across Jamaica</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📍</span>
              <div>
                <h3>Instant Reporting</h3>
                <p>Click anywhere on the map to report an incident</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <div>
                <h3>Community Driven</h3>
                <p>Help your community stay safe and informed</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <h3>Fast & Easy</h3>
                <p>Report incidents in seconds with our simple interface</p>
              </div>
            </div>
          </div>

          <button className="btn-large" type="button" onClick={onGetStarted}>Get Started</button>
          <p className="landing-footer">Keeping Jamaica safe, one report at a time</p>
        </div>
    </div>
  );
}
