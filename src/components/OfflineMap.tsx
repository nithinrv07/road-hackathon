import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Coords {
  lat: number;
  lng: number;
}

interface OfflineMapProps {
  coords: Coords | null;
  accuracy: number | null;
  isActive: boolean;
  isOnline: boolean;
  services?: Array<{ id: string; type: string; name: string; phone?: string; lat: number; lng: number }>;
}

export const OfflineMap: React.FC<OfflineMapProps> = ({ coords, accuracy, isActive, isOnline, services }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const serviceMarkersRef = useRef<L.Marker[]>([]);

  const [isFollowing, setIsFollowing] = useState(true);

  const lat = coords?.lat ?? 9.692294;
  const lng = coords?.lng ?? 78.458557;

  // Custom marker icons
  const userIcon = L.divIcon({
    className: 'custom-gps-marker',
    html: `<div class="marker-pulse-ring"></div><div class="marker-dot"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const emsIcon = L.divIcon({
    className: 'custom-ems-marker',
    html: `<div class="responder-dot ems"></div><div class="responder-label">EMS</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const polIcon = L.divIcon({
    className: 'custom-pol-marker',
    html: `<div class="responder-dot police"></div><div class="responder-label">POL</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const towIcon = L.divIcon({
    className: 'custom-tow-marker',
    html: `<div class="responder-dot tow"></div><div class="responder-label">TOW</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create leaflet map centered at coordinates
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([lat, lng], 15);

    // Standard OpenStreetMap tiles (caches naturally in browser)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Add scale control
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);

    // User location marker
    const userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
    userMarkerRef.current = userMarker;

    // Accuracy Circle
    if (accuracy) {
      const accuracyCircle = L.circle([lat, lng], {
        radius: accuracy,
        fillColor: 'var(--primary)',
        fillOpacity: 0.05,
        color: 'var(--primary)',
        weight: 1.5,
        opacity: 0.2
      }).addTo(map);
      accuracyCircleRef.current = accuracyCircle;
    }

    mapRef.current = map;

    const handleUserInteraction = () => setIsFollowing(false);
    map.on('movestart', handleUserInteraction);
    map.on('dragstart', handleUserInteraction);
    map.on('zoomstart', handleUserInteraction);

    return () => {
      if (mapRef.current) {
        map.off('movestart', handleUserInteraction);
        map.off('dragstart', handleUserInteraction);
        map.off('zoomstart', handleUserInteraction);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Render service markers (hospitals, ambulances, police, towing)
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing service markers
    serviceMarkersRef.current.forEach(m => m.remove());
    serviceMarkersRef.current = [];

    if (!services || !services.length) return;

    const map = mapRef.current;

    services.forEach(s => {
      // choose color by type
      const color = s.type === 'hospital' ? '#2ecc71' : s.type === 'ambulance' ? '#3498db' : s.type === 'police' ? '#8e44ad' : '#f39c12';
      const icon = L.divIcon({
        className: 'service-marker-icon',
        html: `<div style="background:${color};width:14px;height:14px;border-radius:14px;border:2px solid #fff;box-shadow:0 0 0 2px rgba(0,0,0,0.06);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      const m = L.marker([s.lat, s.lng], { icon }).addTo(map);
      (m as any).serviceData = s;
      serviceMarkersRef.current.push(m);
    });

    return () => {
      serviceMarkersRef.current.forEach(m => m.remove());
      serviceMarkersRef.current = [];
    };
  }, [services]);

  // Update map center & user marker when coordinates change
  useEffect(() => {
    if (mapRef.current && coords) {
      if (isFollowing) {
        mapRef.current.setView([coords.lat, coords.lng]);
      }

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([coords.lat, coords.lng]);
      }

      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setLatLng([coords.lat, coords.lng]);
        if (accuracy) {
          accuracyCircleRef.current.setRadius(accuracy);
        }
      } else if (accuracy) {
        const accuracyCircle = L.circle([coords.lat, coords.lng], {
          radius: accuracy,
          fillColor: 'var(--primary)',
          fillOpacity: 0.05,
          color: 'var(--primary)',
          weight: 1.5,
          opacity: 0.2
        }).addTo(mapRef.current);
        accuracyCircleRef.current = accuracyCircle;
      }
    }
  }, [coords, accuracy, isFollowing]);

  // Animate responder units moving towards the user when SOS is active
  useEffect(() => {
    if (!mapRef.current || !coords || !isActive) return;

    const map = mapRef.current;
    
    // Spawn positions at random offsets
    const emsPos: [number, number] = [coords.lat + 0.005, coords.lng - 0.005];
    const polPos: [number, number] = [coords.lat - 0.004, coords.lng + 0.006];
    const towPos: [number, number] = [coords.lat + 0.006, coords.lng + 0.002];

    const emsMarker = L.marker(emsPos, { icon: emsIcon }).addTo(map);
    const polMarker = L.marker(polPos, { icon: polIcon }).addTo(map);
    const towMarker = L.marker(towPos, { icon: towIcon }).addTo(map);

    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 25000; // 25 seconds to reach user

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Linear interpolation to user center
      const curEmsLat = emsPos[0] + (coords.lat - emsPos[0]) * progress;
      const curEmsLng = emsPos[1] + (coords.lng - emsPos[1]) * progress;

      const curPolLat = polPos[0] + (coords.lat - polPos[0]) * progress;
      const curPolLng = polPos[1] + (coords.lng - polPos[1]) * progress;

      const curTowLat = towPos[0] + (coords.lat - towPos[0]) * progress;
      const curTowLng = towPos[1] + (coords.lng - towPos[1]) * progress;

      emsMarker.setLatLng([curEmsLat, curEmsLng]);
      polMarker.setLatLng([curPolLat, curPolLng]);
      towMarker.setLatLng([curTowLat, curTowLng]);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      emsMarker.remove();
      polMarker.remove();
      towMarker.remove();
    };
  }, [isActive, coords]);

  // Recenter helper
  const handleRecenter = () => {
    if (mapRef.current && coords) {
      setIsFollowing(true);
      mapRef.current.setView([coords.lat, coords.lng], 15);
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  return (
    <div className="sidebar-section">
      <h3 className="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', verticalAlign: 'middle' }}>
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
        <span>Tactical Offline-First Grid</span>
      </h3>
      <div 
        className={`radar-map-card ${isOnline ? 'online-grid' : 'offline-grid-tactical'}`} 
        style={{ height: '240px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}
      >
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

        {/* Map HUD Overlays */}
        <div className="map-hud-overlay">
          <div className="hud-status">
            <span className="hud-status-dot"></span>
            {isOnline ? 'ONLINE METROPOLITAN GRID' : 'TACTICAL OFFLINE GRID'}
          </div>
          <div className="hud-coord">LAT: {lat.toFixed(6)}°</div>
          <div className="hud-coord">LNG: {lng.toFixed(6)}°</div>
          <div className="hud-accuracy">
            {isOnline ? `ACC: ±${(accuracy ?? 5).toFixed(1)}m (Live GPS)` : `LAST LOCK: ±${(accuracy ?? 15).toFixed(1)}m (Offline)`}
          </div>
        </div>

        {/* Map Control Buttons */}
        <div className="map-controls-group">
          <button onClick={handleRecenter} title="Recenter Map" className="map-ctrl-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '14px', height: '14px' }}>
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button onClick={handleZoomIn} title="Zoom In" className="map-ctrl-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '14px', height: '14px' }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button onClick={handleZoomOut} title="Zoom Out" className="map-ctrl-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '14px', height: '14px' }}>
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
