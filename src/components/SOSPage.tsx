import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, AlertTriangle, MapPin, Wifi, 
  Database, Cpu, Phone, Heart, Wrench, Flame, 
  User, Power, XCircle, RefreshCw 
} from 'lucide-react';
import { OfflineMap } from './OfflineMap';

interface IncidentCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export const SOSPage = () => {
  const [sosState, setSosState] = useState<'idle' | 'countdown' | 'active'>('idle');
  const [countdown, setCountdown] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState<string>('medical');
  const [gpsLocked, setGpsLocked] = useState(false);
  const countdownIntervalRef = useRef<number | null>(null);

  // Connection and Geolocation states
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Cache for last known coordinates
  const [lastKnownCoords, setLastKnownCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [lastKnownAccuracy, setLastKnownAccuracy] = useState<number | null>(null);

  // Sync real-world online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Geolocation tracker
  useEffect(() => {
    if (!navigator.geolocation) {
      const defaultLoc = { lat: 9.692294, lng: 78.458557 };
      setCoords(defaultLoc);
      setAccuracy(5.0);
      setLastKnownCoords(defaultLoc);
      setLastKnownAccuracy(5.0);
      setGpsLocked(true);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const newLoc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setCoords(newLoc);
      setAccuracy(position.coords.accuracy);
      setGpsLocked(true);

      // Cache the last known location when GPS updates successfully
      setLastKnownCoords(newLoc);
      setLastKnownAccuracy(position.coords.accuracy);
    };

    const handleError = (error: GeolocationPositionError) => {
      console.warn("Geolocation tracking error: ", error);
      const fallbackLoc = { lat: 9.692294, lng: 78.458557 };
      setCoords(prev => prev || fallbackLoc);
      setAccuracy(15.0);
      setGpsLocked(true);

      // Initialize last known coords if still null
      setLastKnownCoords(prev => prev || fallbackLoc);
      setLastKnownAccuracy(prev => prev || 15.0);
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Determine which coordinates and accuracy to display based on connection state
  const defaultFallbackLoc = { lat: 9.692294, lng: 78.458557 };
  const displayCoords = isOnline 
    ? (coords || lastKnownCoords || defaultFallbackLoc) 
    : (lastKnownCoords || defaultFallbackLoc);

  const displayAccuracy = isOnline 
    ? (accuracy || lastKnownAccuracy || 5.0) 
    : (lastKnownAccuracy || 15.0);

  const formatLat = (l: number) => `${Math.abs(l).toFixed(5)}° ${l >= 0 ? 'N' : 'S'}`;
  const formatLng = (l: number) => `${Math.abs(l).toFixed(5)}° ${l >= 0 ? 'E' : 'W'}`;

  // Telemetry details mapping real coords
  const telemetry = {
    latitude: displayCoords ? formatLat(displayCoords.lat) : 'ACQUIRING...',
    longitude: displayCoords ? formatLng(displayCoords.lng) : 'ACQUIRING...',
    accuracy: displayAccuracy ? `± ${displayAccuracy.toFixed(1)} meters` : 'Calculating...',
    satellites: gpsLocked ? 9 : 0,
    dbVersion: 'v4.12-Offline-Local',
    nodeStrength: isOnline ? '98% (Mesh Active)' : '0% (Local Mesh Offline)',
  };

  // Haversine distance (meters)
  const haversine = (a: {lat:number,lng:number}, b: {lat:number,lng:number}) => {
    const toRad = (v: number) => v * Math.PI / 180;
    const R = 6371000;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const sinDLat = Math.sin(dLat/2);
    const sinDLon = Math.sin(dLon/2);
    const aVal = sinDLat*sinDLat + Math.cos(lat1)*Math.cos(lat2)*sinDLon*sinDLon;
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1-aVal));
    return R * c;
  };

  // Generate nearby service fixtures around current location
  const generateNearbyServices = (center: {lat:number,lng:number}) => {
    const list = [
      { id: 'h1', type: 'hospital', name: 'St. Mary Trauma Center', phone: '+1-555-0101', lat: center.lat + 0.012, lng: center.lng - 0.006 },
      { id: 'a1', type: 'ambulance', name: 'EMS Unit 19', phone: '+1-555-0119', lat: center.lat + 0.006, lng: center.lng - 0.002 },
      { id: 'p1', type: 'police', name: 'Central Precinct', phone: '+1-555-0133', lat: center.lat - 0.008, lng: center.lng + 0.01 },
      { id: 't1', type: 'towing', name: 'Rapid Tow Co.', phone: '+1-555-0144', lat: center.lat + 0.02, lng: center.lng + 0.003 },
      { id: 'h2', type: 'hospital', name: 'General Hospital ER', phone: '+1-555-0122', lat: center.lat - 0.02, lng: center.lng - 0.008 },
      { id: 'a2', type: 'ambulance', name: 'EMS Unit 04', phone: '+1-555-0104', lat: center.lat - 0.003, lng: center.lng + 0.005 },
      { id: 'p2', type: 'police', name: 'West Side Station', phone: '+1-555-0166', lat: center.lat + 0.01, lng: center.lng + 0.02 }
    ];
    return list.map(s => ({ ...s, distance: Math.round(haversine(center, {lat: s.lat, lng: s.lng})) }));
  };

  const nearbyServices = displayCoords ? generateNearbyServices(displayCoords) : [];
  nearbyServices.sort((a,b) => a.distance - b.distance);

  const counts = {
    hospital: nearbyServices.filter(s => s.type === 'hospital').length,
    ambulance: nearbyServices.filter(s => s.type === 'ambulance').length,
    police: nearbyServices.filter(s => s.type === 'police').length,
    towing: nearbyServices.filter(s => s.type === 'towing').length,
  };

  const categories: IncidentCategory[] = [
    { id: 'medical', label: 'Medical Alert', icon: <Heart size={20} />, color: 'var(--primary)' },
    { id: 'accident', label: 'Road Accident', icon: <AlertTriangle size={20} />, color: '#ffb703' },
    { id: 'mechanical', label: 'Vehicle Breakdown', icon: <Wrench size={20} />, color: '#2a9d8f' },
    { id: 'fire', label: 'Fire / Hazard', icon: <Flame size={20} />, color: '#e76f51' },
  ];



  // Countdown timer handler
  useEffect(() => {
    if (sosState === 'countdown') {
      setCountdown(5);
      countdownIntervalRef.current = window.setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            triggerSOSDirectly();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [sosState]);

  const triggerSOSDirectly = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setSosState('active');
  };
  const handleCancelCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setSosState('idle');
  };

  return (
    <div className="sos-dashboard-wrapper">
      <div className="container" style={{ padding: '7rem 2rem 4rem 2rem' }}>
        {/* Top bar: brand + persistent SOS + online status */}
        <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div className="brand-logo" style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 8 }}></div>
            <div style={{ fontWeight: 700, letterSpacing: '0.6px' }}>ROADSoS</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ fontSize: '0.9rem', color: isOnline ? 'var(--primary)' : 'var(--text-muted)' }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</div>
            <button className="main-sos-button" onClick={() => setSosState(s => s === 'active' ? 'idle' : 'active')} style={{ padding: '8px 12px' }}>
              <ShieldAlert size={16} color="white" />
              <span style={{ marginLeft: 8 }}>{sosState === 'active' ? 'SOS ACTIVE' : 'SOS'}</span>
            </button>
          </div>
        </div>
        
        {/* Telemetry Bar */}
        <div className="telemetry-bar">
          <div className="telemetry-item" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <MapPin size={16} color={gpsLocked ? 'var(--primary)' : 'var(--text-muted)'} />
            <span>GPS: {gpsLocked ? `${telemetry.latitude}, ${telemetry.longitude}` : 'ACQUIRING SIGNAL...'}</span>
            {!isOnline && (
              <span className="offline-badge" style={{ fontSize: '0.72rem', background: 'rgba(239, 35, 60, 0.1)', color: 'var(--primary)', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(239, 35, 60, 0.2)', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.5px' }}>
                LAST KNOWN LOCK
              </span>
            )}
          </div>
          <button 
            className="telemetry-item connection-toggle-btn"
            onClick={() => setIsOnline(prev => !prev)}
            title="Simulate network tower connectivity state"
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              transition: 'background 0.2s',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              color: isOnline ? 'var(--text)' : 'var(--text-muted)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <Wifi size={16} color={isOnline ? 'var(--primary)' : 'var(--text-muted)'} />
            <span>{isOnline ? '98% (Tower Online)' : '0% (Tower Offline)'}</span>
          </button>
          <div className="telemetry-item">
            <Database size={16} color="var(--text-muted)" />
            <span>Database: {telemetry.dbVersion}</span>
          </div>
          <div className="telemetry-item">
            <Cpu size={16} color="var(--text-muted)" />
            <span>Power: 98%</span>
          </div>
        </div>

        <div className="sos-layout-grid">
          
          {/* Main Interactive Control Area */}
          <div className="sos-card main-panel">
            <AnimatePresence mode="wait">
              
              {/* IDLE STATE */}
              {sosState === 'idle' && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="sos-panel-content"
                >
                  <div className="sos-panel-header">
                    <h2>Emergency Dispatch</h2>
                    <p>Select category and press the trigger below. SOS will notify nearby units instantly.</p>
                  </div>

                  {/* Categories */}
                  <div className="category-selector-grid">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        className={`category-button ${selectedCategory === cat.id ? 'active' : ''}`}
                        style={selectedCategory === cat.id ? { borderColor: cat.color, color: cat.color, background: `${cat.color}08` } : {}}
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        <div className="cat-icon-wrap" style={{ color: selectedCategory === cat.id ? cat.color : 'var(--text-muted)' }}>
                          {cat.icon}
                        </div>
                        <span className="cat-label">{cat.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Main Trigger removed per request */}
                </motion.div>
              )}

              {/* COUNTDOWN STATE */}
              {sosState === 'countdown' && (
                <motion.div 
                  key="countdown"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="sos-panel-content countdown-active"
                >
                  <div className="sos-warning-header">
                    <div className="warning-pulse">
                      <AlertTriangle size={36} color="var(--primary)" />
                    </div>
                    <h2>Emergency Broadcast Pending</h2>
                    <p>Broadcasting trauma protocol in 5 seconds. Hold cancel to abort.</p>
                  </div>

                  {/* Circular Timer Display */}
                  <div className="countdown-timer-circle">
                    <svg className="timer-svg" viewBox="0 0 100 100">
                      <circle className="timer-bg" cx="50" cy="50" r="45"></circle>
                      <motion.circle 
                        className="timer-fill" 
                        cx="50" 
                        cy="50" 
                        r="45"
                        initial={{ pathLength: 1 }}
                        animate={{ pathLength: countdown / 5 }}
                        transition={{ duration: 1, ease: 'linear' }}
                      ></motion.circle>
                    </svg>
                    <div className="countdown-number">{countdown}</div>
                  </div>

                  {/* Action Buttons: Emergency and Cancel */}
                  <div className="countdown-actions">
                    <button 
                      className="btn btn-danger emergency-now-btn"
                      onClick={triggerSOSDirectly}
                    >
                      <Power size={18} /> EMERGENCY (Activate Now)
                    </button>
                    <button 
                      className="btn btn-outline cancel-btn"
                      onClick={handleCancelCountdown}
                    >
                      <XCircle size={18} /> Cancel (False Alarm)
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ACTIVE STATE */}
              {sosState === 'active' && (
                <motion.div 
                  key="active"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="sos-panel-content active-emergency"
                >
                  <div style={{ display: 'flex', gap: '1rem', height: '520px' }}>
                    <div style={{ flex: 1, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <OfflineMap coords={displayCoords} accuracy={displayAccuracy} isActive={true} isOnline={isOnline} services={nearbyServices} />
                    </div>

                    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.4rem' }}>
                        <div className="stat-card">Hospitals<br/><strong>{counts.hospital}</strong></div>
                        <div className="stat-card">Ambulances<br/><strong>{counts.ambulance}</strong></div>
                        <div className="stat-card">Police<br/><strong>{counts.police}</strong></div>
                        <div className="stat-card">Towing<br/><strong>{counts.towing}</strong></div>
                      </div>

                      <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem' }}>
                        <h3 style={{ margin: '0 0 0.6rem 0' }}>Nearest Services</h3>
                        <div style={{ display: 'grid', gap: '0.6rem' }}>
                          {nearbyServices.map(s => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', borderRadius: 6, background: 'var(--surface)' }}>
                              <div>
                                <div style={{ fontWeight: 700 }}>{s.name}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.type.toUpperCase()} • {Math.round(s.distance)} m</div>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <a href={`tel:${s.phone}`} className="btn btn-small">Call</a>
                                <button className="btn btn-ghost" onClick={() => { /* optionally center map via API later */ }}>Navigate</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deactivate button */}
                  <button 
                    className="btn btn-outline deactivate-btn"
                    onClick={() => setSosState('idle')}
                  >
                    <RefreshCw size={16} /> RESOLVE / DEACTIVATE SOS
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Sidebar Area: Medical Details & Emergency Contacts */}
          <div className="sos-card sidebar-panel">
            {/* Offline map at the top of the sidebar */}
             <OfflineMap 
              coords={displayCoords} 
              accuracy={displayAccuracy} 
              isActive={sosState === 'active'} 
              isOnline={isOnline}
             />

            <div className="sidebar-section">
              <h3 className="section-title"><User size={18} /> User Medical Profile</h3>
              <div className="profile-details">
                <div className="profile-field">
                  <span className="field-label">Name</span>
                  <span className="field-value">Jane Doe (Operator)</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Blood Type</span>
                  <span className="field-value text-danger">O-Negative</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Medical Issues</span>
                  <span className="field-value">Asthma, Penicillin Allergy</span>
                </div>
                <div className="profile-field text-secondary">
                  <span className="field-label">Insurance ID</span>
                  <span className="field-value">BCBS-8821039A</span>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="section-title"><Phone size={18} /> Primary ICE Contact</h3>
              <div className="profile-details">
                <div className="profile-field">
                  <span className="field-label">Contact Name</span>
                  <span className="field-value">John Doe (Spouse)</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Phone Number</span>
                  <span className="field-value">+1 (555) 0188</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Address</span>
                  <span className="field-value">123 Rescue St, Safe City</span>
                </div>
              </div>
            </div>
          </div>

        </div>
        {/* Bottom info cards */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <div className="sos-card" style={{ flex: 1 }}>
            <h4>First Response Guide</h4>
            <ul>
              <li>Ensure scene safety</li>
              <li>Control bleeding</li>
              <li>Open airway, check breathing</li>
              <li>Immobilize spine if needed</li>
              <li>Prepare for EMS arrival (golden hour)</li>
            </ul>
          </div>
          <div className="sos-card" style={{ width: 360 }}>
            <h4>Offline Mode Status</h4>
            <p>Cached maps available. SMS fallback enabled for emergency alerts.</p>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Last Cache: 12 minutes ago</div>
          </div>
          <div className="sos-card" style={{ width: 320 }}>
            <h4>Global Coverage</h4>
            <p>Auto-adapting emergency numbers and language support across regions.</p>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem' }}>
              <div style={{ width: 28, height: 18, background: '#00247d' }}></div>
              <div style={{ width: 28, height: 18, background: '#ff0000' }}></div>
              <div style={{ width: 28, height: 18, background: '#0039a6' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
