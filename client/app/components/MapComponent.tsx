"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Incident {
  id: string;
  type: string;
  latitude: number;
  longitude: number;
  severity?: string;
  description?: string;
  created_at?: string;
  location?: string;
  price?: string;
}

export type TypeColor = { key: string; color: string };

interface MapComponentProps {
  incidents: Incident[];
  typeColors?: TypeColor[];
  onMarkerClick?: (incident: Incident) => void;
  activeFilters?: Set<string>;
  selectedIncident?: Incident | null;
}

const defaultTypeColors: TypeColor[] = [
  { key: 'crime', color: '#e74c3c' },
  { key: 'crash', color: '#f39c12' },
  { key: 'hazard', color: '#3498db' },
];

export default function MapComponent({ incidents, typeColors = defaultTypeColors, onMarkerClick, activeFilters, selectedIncident }: MapComponentProps) {
  const mapRef = useRef<any | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const el = mapContainerRef.current;
    if (!el || mapRef.current) return;

    import('leaflet').then((L) => {
      const leaflet = L.default || L;
      mapRef.current = leaflet.map(el, {
        center: [18.1096, -77.2975],
        zoom: 9,
        zoomControl: false,
      });

      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      leaflet.control.zoom({ position: 'bottomleft' }).addTo(mapRef.current);

      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mounted]);

  useEffect(() => {
    // Zoom to selected incident if exists
    if (selectedIncident && mapRef.current) {
      import('leaflet').then((L) => {
        const leaflet = L.default || L;
        mapRef.current.flyTo([selectedIncident.latitude, selectedIncident.longitude], 15, {
          duration: 1.5
        });
      });
    }
  }, [selectedIncident]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    import('leaflet').then((L) => {
      const leaflet = L.default || L;
      const getColor = (type: string) => typeColors.find((t) => t.key === type)?.color ?? '#e74c3c';

      console.log('Rendering markers for incidents:', incidents.length);
      console.log('Active filters:', Array.from(activeFilters || []));

      incidents.forEach((incident) => {
        const color = getColor(incident.type);
        console.log(`Creating marker for ${incident.type} at [${incident.latitude}, ${incident.longitude}] with color ${color}`);
        const marker = leaflet.circleMarker([incident.latitude, incident.longitude], {
          radius: 10,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(mapRef.current!);

        marker.on('click', () => onMarkerClick?.(incident));
        markersRef.current.set(incident.id, marker);
      });

      // Auto-zoom to fit visible markers when filters change
      if (incidents.length > 0 && activeFilters && activeFilters.size > 0 && !selectedIncident) {
        const group = leaflet.featureGroup(
          incidents.map((incident) => 
            leaflet.circleMarker([incident.latitude, incident.longitude])
          )
        );
        mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 13 });
        console.log('Zoomed to fit bounds');
      } else if (incidents.length === 0 && !selectedIncident) {
        // Reset to default view if no incidents
        mapRef.current.setView([18.1096, -77.2975], 9);
        console.log('No incidents, reset to default view');
      }
    });
  }, [incidents, typeColors, onMarkerClick, activeFilters, selectedIncident]);

  if (!mounted) {
    return <div id="map" className="map-placeholder" />;
  }
  return <div ref={mapContainerRef} id="map" />;
}
