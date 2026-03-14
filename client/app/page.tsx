"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type * as L from 'leaflet';

// Dynamically import leaflet on client-side only
const Leaflet = typeof window !== 'undefined' ? require('leaflet') : null;

interface IncidentType {
  key: string;
  label: string;
  color: string;
}

interface Severity {
  key: string;
  label: string;
}

interface Incident {
  id: string;
  type: string;
  severity: string;
  description: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

const INCIDENT_TYPES: IncidentType[] = [
  { key: "accident", label: "Accident", color: "#ff4d4d" },
  { key: "hazard", label: "Hazard", color: "#f5a524" },
  { key: "crime", label: "Crime", color: "#3b82f6" },
  { key: "flood", label: "Flood", color: "#22c55e" },
  { key: "other", label: "Other", color: "#a78bfa" },
];

const SEVERITIES: Severity[] = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
];

export default function Home() {
  const mapRef = useRef<L.Map | null>(null);
  const incidentsRef = useRef<Incident[]>([]);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(INCIDENT_TYPES.map(t => t.key)));
  const [pendingLatLng, setPendingLatLng] = useState<L.LatLng | null>(null);
  const [selectedType, setSelectedType] = useState<string>("hazard");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("medium");
  const [description, setDescription] = useState<string>("");
  const [charsLeft, setCharsLeft] = useState<number>(280);
  const [errorBox, setErrorBox] = useState<string>("");
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Leaflet && !mapRef.current) {
      // Initialize map centered on Jamaica
      mapRef.current = Leaflet.map('map').setView([18.1096, -77.2975], 9);
      
      // Add dark mode tile layer (CartoDB Dark Matter)
      Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);

      // Map click handler
      mapRef.current!.on('click', (e) => {
        openPanel(e.latlng);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setCharsLeft(280 - description.length);
  }, [description]);

  const typeMeta = (typeKey: string): IncidentType => {
    return INCIDENT_TYPES.find(t => t.key === typeKey) ?? INCIDENT_TYPES[0];
  };

  const openPanel = (latlng: L.LatLng) => {
    setPendingLatLng(latlng);
    setPanelOpen(true);
    setErrorBox("");
  };

  const closePanel = () => {
    setPanelOpen(false);
    setPendingLatLng(null);
    setDescription("");
    setSelectedType("hazard");
    setSelectedSeverity("medium");
    setErrorBox("");
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 280) {
      setDescription(value);
    }
  };

  const handleSubmit = () => {
    if (!pendingLatLng) {
      setErrorBox("Please select a location on the map");
      return;
    }

    if (!description.trim()) {
      setErrorBox("Description cannot be empty");
      return;
    }

    const newIncident: Incident = {
      id: crypto.randomUUID(),
      type: selectedType,
      severity: selectedSeverity,
      description: description.trim(),
      latitude: pendingLatLng.lat,
      longitude: pendingLatLng.lng,
      created_at: new Date().toISOString(),
    };

    incidentsRef.current.push(newIncident);
    addMarkerToMap(newIncident);
    closePanel();
  };

  const addMarkerToMap = (incident: Incident) => {
    if (!mapRef.current || !Leaflet) return;

    const meta = typeMeta(incident.type);
    const marker = Leaflet.circleMarker([incident.latitude, incident.longitude], {
      radius: 12,
      fillColor: meta.color,
      color: 'rgba(255,255,255,0.8)',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.7,
    }).addTo(mapRef.current);

    marker.bindPopup(`
      <div style="min-width: 200px;">
        <strong style="color: ${meta.color}; font-size: 14px;">${meta.label}</strong><br/>
        <span style="font-size: 12px; opacity: 0.8;">Severity: ${incident.severity}</span><br/>
        <p style="margin: 8px 0 0 0; font-size: 13px;">${incident.description}</p>
        <small style="opacity: 0.6; display: block; margin-top: 8px;">${new Date(incident.created_at).toLocaleString()}</small>
      </div>
    `);

    markersRef.current.set(incident.id, marker);
  };

  const toggleFilter = (typeKey: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(typeKey)) {
      newFilters.delete(typeKey);
    } else {
      newFilters.add(typeKey);
    }
    setActiveFilters(newFilters);

    // Update marker visibility
    markersRef.current.forEach((marker, id) => {
      const incident = incidentsRef.current.find(i => i.id === id);
      if (incident) {
        if (newFilters.has(incident.type)) {
          marker.addTo(mapRef.current!);
        } else {
          marker.remove();
        }
      }
    });
  };

  const clearForm = () => {
    setDescription("");
    setSelectedType("hazard");
    setSelectedSeverity("medium");
    setErrorBox("");
  };

  return (
    <div className="app">
      <div id="map" suppressHydrationWarning={true}></div>

      {/* Top Filter Bar */}
      <div className="topbar">
        <div className="chip-row" id="filterRow" aria-label="Incident type filters" suppressHydrationWarning={true}>
          {INCIDENT_TYPES.map((type) => (
            <button
              key={type.key}
              className={`chip ${activeFilters.has(type.key) ? 'active' : ''}`}
              onClick={() => toggleFilter(type.key)}
              style={{ borderLeft: `3px solid ${type.color}` }}
            >
              <span className="dot" style={{ backgroundColor: type.color }}></span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Side Panel */}
      <aside className={`panel ${panelOpen ? 'open' : ''}`} id="panel" aria-label="New report panel">
        <div className="panel-header">
          <div className="panel-title">
            <h2>New Report</h2>
            <p className="coords" id="coordsText" suppressHydrationWarning={true}>
              {pendingLatLng ? `${pendingLatLng.lat.toFixed(5)}, ${pendingLatLng.lng.toFixed(5)}` : 'Click the map to set a location'}
            </p>
          </div>
          <button className="close-btn" onClick={closePanel} title="Close">✕</button>
        </div>

        <div className="panel-body">
          <div className="section-label">Incident Type</div>
          <div className="btn-group" id="typeButtons">
            {INCIDENT_TYPES.map((type) => (
              <button
                key={type.key}
                className={`seg-btn ${selectedType === type.key ? 'selected' : ''}`}
                onClick={() => setSelectedType(type.key)}
                style={{ 
                  borderColor: selectedType === type.key ? type.color : undefined,
                  boxShadow: selectedType === type.key ? `0 0 0 2px ${type.color}33 inset` : undefined
                }}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="section-label">Severity</div>
          <div className="btn-group" id="severityButtons">
            {SEVERITIES.map((sev) => (
              <button
                key={sev.key}
                className={`seg-btn ${selectedSeverity === sev.key ? 'selected' : ''}`}
                onClick={() => setSelectedSeverity(sev.key)}
              >
                {sev.label}
              </button>
            ))}
          </div>

          <div className="section-label">Description</div>
          <textarea
            id="desc"
            maxLength={280}
            placeholder="Describe what's happening…"
            value={description}
            onChange={handleDescriptionChange}
          />
          <div className="hint" suppressHydrationWarning={true}>
            <span id="charsLeft">{charsLeft}</span> characters left
          </div>

          <div className="actions">
            <button className="ghost" id="clearBtn" type="button" onClick={clearForm}>
              Clear
            </button>
            <button className="primary" id="submitBtn" type="button" onClick={handleSubmit}>
              Broadcast Incident
            </button>
          </div>

          <div className="error" id="errorBox" style={{ display: errorBox ? 'block' : 'none' }}>
            {errorBox}
          </div>
        </div>
      </aside>

      {/* Brand Badge */}
      <div className="brand" title="MVP UI (frontend only)">
        <div className="brand-badge">V</div>
        <div>
          <div style={{ fontWeight: 900, letterSpacing: '0.2px' }}>VISION</div>
          <small>Jamaica map — MVP UI</small>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --bg: #0b1220;
          --panel: rgba(16, 24, 40, 0.92);
          --panel-border: rgba(255, 255, 255, 0.08);
          --text: rgba(255, 255, 255, 0.92);
          --muted: rgba(255, 255, 255, 0.65);
          --chip: rgba(255, 255, 255, 0.10);
          --chip-active: rgba(255, 255, 255, 0.18);
          --accent: #f5a524;
          --danger: #ff4d4d;
        }

        * {
          box-sizing: border-box;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

        html,
        body {
          height: 100%;
          margin: 0;
          background: var(--bg);
          color: var(--text);
        }

        .app {
          position: relative;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        #map {
          height: 100%;
          width: 100%;
        }

        /* Top filter bar */
        .topbar {
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .chip-row {
          display: flex;
          gap: 10px;
          padding: 10px;
          border: 1px solid var(--panel-border);
          background: rgba(10, 16, 28, 0.65);
          backdrop-filter: blur(8px);
          border-radius: 999px;
          pointer-events: auto;
          overflow-x: auto;
          max-width: min(980px, 100%);
        }

        .chip {
          border: 1px solid var(--panel-border);
          background: var(--chip);
          color: var(--text);
          padding: 10px 14px;
          border-radius: 999px;
          cursor: pointer;
          user-select: none;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          white-space: nowrap;
          transition: transform 120ms ease, background 120ms ease;
        }

        .chip:hover {
          transform: translateY(-1px);
          background: var(--chip-active);
        }

        .chip.active {
          border-color: rgba(245, 165, 36, 0.45);
          background: rgba(245, 165, 36, 0.12);
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          display: inline-block;
        }

        /* Side panel */
        .panel {
          position: absolute;
          top: 14px;
          right: 14px;
          width: min(420px, calc(100% - 28px));
          max-height: calc(100% - 28px);
          z-index: 1000;
          border: 1px solid var(--panel-border);
          background: var(--panel);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          overflow: hidden;
          display: none;
        }

        .panel.open {
          display: block;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 16px 10px 16px;
          border-bottom: 1px solid var(--panel-border);
        }

        .panel-title {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .panel-title h2 {
          font-size: 18px;
          margin: 0;
          letter-spacing: 0.2px;
        }

        .coords {
          font-size: 12px;
          color: var(--muted);
          margin: 0;
        }

        .close-btn {
          border: 1px solid var(--panel-border);
          background: rgba(255, 255, 255, 0.06);
          color: var(--text);
          width: 36px;
          height: 36px;
          border-radius: 10px;
          cursor: pointer;
        }

        .panel-body {
          padding: 14px 16px 16px 16px;
          overflow: auto;
          max-height: calc(100% - 64px);
        }

        .section-label {
          color: var(--muted);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.4px;
          margin: 14px 0 8px 0;
          text-transform: uppercase;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .btn-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .seg-btn {
          flex: 1;
          min-width: 120px;
          border: 1px solid var(--panel-border);
          background: rgba(255, 255, 255, 0.06);
          color: var(--text);
          padding: 12px 12px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          text-align: center;
        }

        .seg-btn.selected {
          border-color: rgba(245, 165, 36, 0.55);
          box-shadow: 0 0 0 2px rgba(245, 165, 36, 0.12) inset;
        }

        textarea,
        input[type="text"] {
          width: 100%;
          border: 1px solid var(--panel-border);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          border-radius: 12px;
          padding: 12px;
          outline: none;
          resize: vertical;
        }

        textarea {
          min-height: 90px;
          max-height: 220px;
        }

        .hint {
          font-size: 12px;
          color: var(--muted);
          margin-top: 6px;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }

        .primary {
          flex: 1;
          border: 0;
          background: var(--accent);
          color: #161616;
          font-weight: 900;
          padding: 12px 14px;
          border-radius: 12px;
          cursor: pointer;
        }

        .ghost {
          border: 1px solid var(--panel-border);
          background: rgba(255, 255, 255, 0.06);
          color: var(--text);
          font-weight: 800;
          padding: 12px 14px;
          border-radius: 12px;
          cursor: pointer;
        }

        .error {
          margin-top: 10px;
          color: var(--danger);
          font-size: 13px;
          font-weight: 700;
          display: none;
        }

        /* Small brand badge */
        .brand {
          position: absolute;
          left: 14px;
          bottom: 14px;
          z-index: 1000;
          border: 1px solid var(--panel-border);
          background: rgba(10, 16, 28, 0.65);
          backdrop-filter: blur(8px);
          border-radius: 14px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-badge {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: rgba(245, 165, 36, 0.15);
          border: 1px solid rgba(245, 165, 36, 0.35);
          font-weight: 900;
          color: var(--accent);
        }

        /* Leaflet popups */
        .leaflet-popup-content-wrapper,
        .leaflet-popup-tip {
          background: rgba(16, 24, 40, 0.95);
          color: var(--text);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .leaflet-container a {
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}
