"use client";

import { useState, useEffect } from 'react';
import './styles.css';
import LandingScreen from './components/LandingScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import MapComponent from './components/MapComponent';
import ThemeToggle from './components/ThemeToggle';
import { login, logout } from './utils/auth';

interface Incident {
  id: string;
  type: string;
  severity?: string;
  description?: string;
  latitude: number;
  longitude: number;
  created_at?: string;
  location?: string;
  price?: string;
  parish?: string;
  details?: string;
  riskLevel?: string;
}

const INCIDENT_TYPES = [
  { key: "all", label: "All", color: "#2ecc71" },
  { key: "crime", label: "Crime", color: "#e74c3c" },
  { key: "accident", label: "Accident", color: "#f39c12" },
  { key: "flood", label: "Flood", color: "#3498db" },
  { key: "hazard", label: "Others", color: "#9b59b6" },
];

const PARISHES = [
  "All Parishes",
  "Kingston West",
  "Kingston East",
  "Kingston Central",
  "St. Andrew South",
  "St. Andrew North",
  "St. Andrew Central",
  "St. Andrew West",
  "St. Catherine South",
  "St. James",
  "Westmoreland"
];

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'login' | 'signup' | 'app'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['all']));

  // Load incidents from API
  useEffect(() => {
    if (currentScreen === 'app') {
      fetchIncidents();
    }
  }, [currentScreen]);

  const fetchIncidents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/incidents');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      console.log('Fetched incidents:', data.length);
      setIncidents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setIncidents([]);
    }
  };

  const handleGetStarted = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = (email: string) => {
    const user = login(email);
    setUserEmail(user.email);
    setUserName(user.name);
    setIsLoggedIn(true);
    setCurrentScreen('app');
  };

  const handleSignupSuccess = (name: string, email: string) => {
    const user = login(email, name);
    setUserEmail(user.email);
    setUserName(user.name);
    setIsLoggedIn(true);
    setCurrentScreen('app');
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserEmail('');
    setUserName('');
    setCurrentScreen('landing');
  };

  const toggleFilter = (typeKey: string) => {
    const newFilters = new Set(activeFilters);
    if (typeKey === 'all') {
      // If clicking "All", clear other filters and set only all
      if (newFilters.has('all')) {
        // If all is already active, don't allow deselecting it
        return;
      } else {
        newFilters.clear();
        newFilters.add('all');
      }
    } else {
      // Remove 'all' when selecting specific categories
      newFilters.delete('all');
      if (newFilters.has(typeKey)) {
        newFilters.delete(typeKey);
        // If no filters left, add 'all' back
        if (newFilters.size === 0) {
          newFilters.add('all');
        }
      } else {
        newFilters.add(typeKey);
      }
    }
    setActiveFilters(newFilters);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else {
      const hours = Math.floor(diffMins / 60);
      return `${hours}h ago`;
    }
  };

  const typeMeta = (typeKey: string) => {
    return INCIDENT_TYPES.find(t => t.key === typeKey) || INCIDENT_TYPES[0];
  };

  // Render based on current screen
  if (currentScreen === 'landing') {
    return (
      <>
        <div id="landingScreen" className="screen active">
          <LandingScreen onGetStarted={handleGetStarted} />
        </div>
        <ThemeToggle />
      </>
    );
  }

  if (currentScreen === 'login') {
    return (
      <>
        <div id="loginScreen" className="screen active">
          <div className="login-container">
            <LoginScreen 
              onBack={() => setCurrentScreen('landing')}
              onSignupClick={() => setCurrentScreen('signup')}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        </div>
        <ThemeToggle />
      </>
    );
  }

  if (currentScreen === 'signup') {
    return (
      <>
        <div id="signupScreen" className="screen active">
          <div className="login-container">
            <SignupScreen 
              onBack={() => setCurrentScreen('login')}
              onSignupSuccess={handleSignupSuccess}
            />
          </div>
        </div>
        <ThemeToggle />
      </>
    );
  }

  // App Screen
  return (
    <>
      <div id="appScreen" className="screen active">
        <div className="app">
          <MapComponent 
            incidents={incidents.filter((i) => {
              if (activeFilters.has('all')) return true;
              return activeFilters.has(i.type);
            })}
            typeColors={INCIDENT_TYPES.map((t) => ({ key: t.key, color: t.color }))}
            activeFilters={activeFilters}
            selectedIncident={selectedIncident}
            onMarkerClick={(incident) => {
              setSelectedIncident(incident);
              setPanelOpen(true);
            }}
          />

          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

          <div className="topbar">
            <div className="chip-row">
              {INCIDENT_TYPES.map((type) => (
                <button
                  key={type.key}
                  type="button"
                  className={`chip ${activeFilters.has(type.key) ? 'active' : ''}`}
                  onClick={() => toggleFilter(type.key)}
                  aria-pressed={activeFilters.has(type.key)}
                >
                  <span className="dot" style={{ backgroundColor: type.color, minWidth: '12px', minHeight: '12px', border: '2px solid white', boxShadow: '0 0 6px rgba(0,0,0,0.5)' }} />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setPanelOpen((o) => !o)}
            aria-label={panelOpen ? 'Close list' : 'Open list'}
            title={panelOpen ? 'Close list' : 'Open list'}
          >
            {panelOpen ? '✕' : '☰'}
          </button>

          <div className={`panel ${selectedIncident || panelOpen ? 'open' : ''}`}>
            {(selectedIncident || panelOpen) ? (
              <>
                <div className="panel-header">
                  <div className="panel-title">
                    <h2>{selectedIncident ? typeMeta(selectedIncident.type).label : 'Incidents'}</h2>
                    <p className="coords">
                      {selectedIncident
                        ? `${selectedIncident.latitude?.toFixed(4)}, ${selectedIncident.longitude?.toFixed(4)}`
                        : 'Select a spot on the map or list'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => {
                      setSelectedIncident(null);
                      setPanelOpen(false);
                    }}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
                <div className="panel-body">
                  {selectedIncident && (
                  <div className="featured">
                    <div className="featured-img">
                      <div className="featured-img-inner">
                        <span className="incident-icon-big">📍</span>
                      </div>
                      <div className="badge-hot">HOT</div>
                      <div className="rating-badge">★ 4.8</div>
                    </div>
                    <div className="featured-body">
                      <div className="featured-title">{typeMeta(selectedIncident.type).label}</div>
                      <div className="featured-addr">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>
                        {selectedIncident.location || 'Unknown location'}
                      </div>
                      <div className="meta-row">
                        <div className="meta-item">{selectedIncident.created_at ? formatTime(selectedIncident.created_at) : 'Recently'}</div>
                        <div className="meta-item">Verified</div>
                      </div>
                      <div className="featured-desc">{selectedIncident.description || 'No description available'}</div>
                      <div className="price-row">
                        <span className="price-label">Impact Level</span>
                        <span className="price-val">
                          <span className="severity-dot" style={{ backgroundColor: typeMeta(selectedIncident.type).color }} />
                          {selectedIncident.price || '—'}
                        </span>
                      </div>
                      <div className="action-row">
                        <button type="button" className="btn-primary-small" onClick={() => {
                          if (selectedIncident) {
                            setSelectedIncident(selectedIncident);
                            setPanelOpen(true);
                          }
                        }}>View Details</button>
                        <button type="button" className="btn-icon">❤</button>
                        <button type="button" className="btn-icon">🔗</button>
                      </div>
                    </div>
                  </div>
                  )}

              {/* Thumbnails - only when an incident is selected */}
              {selectedIncident && (
              <div className="thumbs">
                <div className="thumb active-thumb">
                  <div className="thumb-img">📍</div>
                  <div className="thumb-label">Main View</div>
                  <div className="thumb-sub">On-site</div>
                </div>
                <div className="thumb">
                  <div className="thumb-img">🗺️</div>
                  <div className="thumb-label">Map</div>
                  <div className="thumb-sub">Overview</div>
                </div>
                <div className="thumb">
                  <div className="thumb-img">📊</div>
                  <div className="thumb-label">Data</div>
                  <div className="thumb-sub">Analytics</div>
                </div>
              </div>
              )}

              {/* Incident List */}
              <div className="list-header">Recent Incidents ({incidents.length})</div>
              <div className="incident-list">
                {incidents.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    No incidents reported yet
                  </div>
                ) : (
                  incidents.map((incident) => (
                    <div
                      key={incident.id}
                      className={`inc-row ${selectedIncident?.id === incident.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedIncident(incident);
                        setPanelOpen(true);
                      }}
                    >
                      <div 
                        className="inc-dot-wrap"
                        style={{ backgroundColor: `${typeMeta(incident.type).color}33`, color: typeMeta(incident.type).color }}
                      >
                        {incident.type === 'crime' && '👮'}
                        {incident.type === 'accident' && '🚗'}
                        {incident.type === 'flood' && '🌊'}
                        {incident.type === 'hazard' && '⚠️'}
                        {incident.type === 'all' && '📍'}
                      </div>
                      <div className="inc-info">
                        <div className="inc-type">{typeMeta(incident.type).label}</div>
                        <div className="inc-loc">{incident.location || 'Unknown location'}</div>
                        <div className="inc-time">{incident.created_at ? formatTime(incident.created_at) : 'Recently'}</div>
                      </div>
                      <div className="inc-heart">♥</div>
                    </div>
                  ))
                )}
              </div>
                </div>
              </>
                ) : null}
          </div>

          <div className="brand">
            <div className="brand-badge">V</div>
            <div>
              <strong>Vision</strong>
              <small>Incident reporting</small>
            </div>
          </div>
        </div>
      </div>
      <ThemeToggle />
    </>
  );
}
