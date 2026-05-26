import { useState, useEffect } from 'react';
import { ShieldAlert, Menu, X, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const features = [
    { title: "Zero Connectivity", description: "Mesh routing protocol", href: "#features" },
    { title: "Live Triangulation", description: "Precision signal tracking", href: "#features" },
    { title: "Emergency Dispatch", description: "Automated AI routing", href: "#features" },
    { title: "Hardware Ready", description: "IoT module support", href: "#features" },
  ];

  return (
    <>
      <header className="nav-header" style={{ padding: '1rem 0' }}>
        <div className="container nav-inner">
          {/* Logo */}
          <a href="#" className="brand">
            <ShieldAlert size={28} color="var(--primary)" />
            ROAD<span>SoS</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'none', gap: '2rem', alignItems: 'center' }}>
            <div 
              className="nav-dropdown-trigger"
              style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500, color: 'var(--text)' }}
              onMouseEnter={() => setIsFeaturesOpen(true)}
              onMouseLeave={() => setIsFeaturesOpen(false)}
            >
              Features <ChevronDown size={14} style={{ transform: isFeaturesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              
              {/* Mega Menu */}
              {isFeaturesOpen && (
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', width: '600px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', zIndex: 100 }}>
                  {features.map((feature, i) => (
                    <a key={i} href={feature.href} style={{ padding: '0.75rem', borderRadius: '8px', textDecoration: 'none', color: 'var(--text)', transition: 'background 0.2s' }} className="dropdown-item">
                      <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{feature.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{feature.description}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a href="#how-it-works" className="nav-link">Protocol</a>
            <a href="#impact" className="nav-link">Impact</a>
            <a href="#docs" className="nav-link">Docs</a>
          </nav>

          {/* Desktop Actions */}
          <div className="desktop-actions" style={{ display: 'none', gap: '1rem', alignItems: 'center' }}>
            {currentHash === '#sos' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', marginRight: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', background: '#06d6a0', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #06d6a0' }}></span>
                  Node Secure
                </div>
                <a href="#" className="btn btn-outline" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Disconnect Node</a>
              </>
            ) : (
              <>
                <a href="#login" className="btn btn-outline" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Login</a>
                <a href="#register" className="btn btn-solid">Register Now</a>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="mobile-toggle" style={{ display: 'block', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)' }} onClick={() => setIsMobileOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Sheet */}
      {isMobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setIsMobileOpen(false)}></div>
          <div style={{ position: 'relative', width: '80%', maxWidth: '350px', background: 'var(--bg)', height: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', borderLeft: '1px solid var(--border)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a href="#" className="brand">
                <ShieldAlert size={28} color="var(--primary)" />
                ROAD<span>SoS</span>
              </a>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)' }} onClick={() => setIsMobileOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text)' }}>Features <ChevronDown size={18} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', paddingLeft: '1rem' }}>
                  {features.map((feature, i) => (
                    <a key={i} href={feature.href} style={{ textDecoration: 'none', color: 'var(--text)' }}>
                      <div style={{ fontWeight: 500 }}>{feature.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{feature.description}</div>
                    </a>
                  ))}
                </div>
              </div>
              <a href="#how-it-works" style={{ fontWeight: 500, textDecoration: 'none', color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }} onClick={() => setIsMobileOpen(false)}>Protocol</a>
              <a href="#impact" style={{ fontWeight: 500, textDecoration: 'none', color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }} onClick={() => setIsMobileOpen(false)}>Impact</a>
              <a href="#docs" style={{ fontWeight: 500, textDecoration: 'none', color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }} onClick={() => setIsMobileOpen(false)}>Docs</a>
            </div>

            {currentHash === '#sos' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                  <span style={{ width: '8px', height: '8px', background: '#06d6a0', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #06d6a0' }}></span>
                  Secure Dispatch Node Active
                </div>
                <a href="#" className="btn btn-outline" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, textAlign: 'center' }} onClick={() => setIsMobileOpen(false)}>Disconnect Node</a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
                <a href="#login" className="btn btn-outline" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, textAlign: 'center' }} onClick={() => setIsMobileOpen(false)}>Login</a>
                <a href="#register" className="btn btn-solid" style={{ textAlign: 'center' }} onClick={() => setIsMobileOpen(false)}>Register Now</a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
