import { useState, useEffect } from 'react';
import { Activity, WifiOff, MapPin, Globe2, PhoneCall, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FooterTaped } from './components/Footer';
import { Navbar } from './components/Navbar';
import { LoginCard, RegisterCard } from './components/Auth';
import { SOSPage } from './components/SOSPage';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      if (['#login', '#register', '#sos'].includes(window.location.hash)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isAuthPage = currentHash === '#login' || currentHash === '#register';

  return (
    <>
      <Navbar />

      <AnimatePresence mode="wait">
        {currentHash === '#login' && (
          <motion.main 
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className="auth-wrapper">
              <div className="hero-bg"></div>
              <LoginCard />
            </section>
          </motion.main>
        )}

        {currentHash === '#register' && (
          <motion.main 
            key="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className="auth-wrapper">
              <div className="hero-bg"></div>
              <RegisterCard />
            </section>
          </motion.main>
        )}

        {!isAuthPage && currentHash !== '#sos' && (
          <motion.main 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className="hero-wrapper">
              <div className="hero-bg"></div>
              <div className="container">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.03)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--border)', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <Activity size={16} color="var(--primary)" />
                    Response Engine v2.0 is Live
                  </div>
                  <h1 className="headline">
                    The Golden Hour,<br/>
                    <span>Secured.</span>
                  </h1>
                  <p className="subheadline">
                    A highly-resilient, offline-first emergency dispatch layer. Locates trauma centers and dispatch units instantly, regardless of network connectivity.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <a href="#register" className="btn btn-danger">
                      Deploy Now <ArrowRight size={18} />
                    </a>
                    <a href="#docs" className="btn btn-solid" style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}>
                      View Documentation
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            <section id="features" className="container">
              <div className="bento-grid">
                
                {/* Card 1: Large Offline Mode feature */}
                <div className="bento-card col-span-2 row-span-2" style={{ background: 'linear-gradient(145deg, #f9fafb, #ffffff)' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring" style={{ animationDelay: '1.5s' }}></div>
                    <div style={{ background: 'var(--primary)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 0 30px rgba(255,42,63,0.5)' }}>
                      <WifiOff size={40} color="white" />
                    </div>
                  </div>
                  <div style={{ zIndex: 2, marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Zero Connectivity Required.</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>Pre-cached regional data enables full operation in cellular dead zones. Immediate access to trauma protocols without dropping a single frame.</p>
                  </div>
                </div>

                {/* Card 2: Speed */}
                <div className="bento-card col-span-2">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.8rem' }}>&lt; 3 Second Latency</h3>
                      <p style={{ fontSize: '1.05rem', maxWidth: '300px' }}>Multi-threaded processing ensures nearest services are ranked and surfaced almost instantly upon launch.</p>
                    </div>
                    <Activity size={48} color="var(--primary)" opacity={0.5} />
                  </div>
                </div>

                {/* Card 3: Global */}
                <div className="bento-card col-span-2">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.8rem' }}>Global Vectoring</h3>
                      <p style={{ fontSize: '1.05rem', maxWidth: '300px' }}>Dynamically switches regional database layers based on realtime GPS trilateration when crossing borders.</p>
                    </div>
                    <Globe2 size={48} color="var(--primary)" opacity={0.5} />
                  </div>
                </div>

              </div>
            </section>

            <section id="how-it-works" className="container" style={{ padding: '6rem 0' }}>
              <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem', letterSpacing: '-1px' }}>Protocol Execution</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
                <div style={{ flex: '1 1 300px', borderLeft: '4px solid var(--primary)', paddingLeft: '2rem' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '2px' }}>PHASE 01</div>
                  <MapPin size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                  <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Signal Acquisition</h4>
                  <p style={{ color: 'var(--text-muted)' }}>Multi-band GPS locks coordinates instantly, functioning entirely independent of cellular networks.</p>
                </div>
                <div style={{ flex: '1 1 300px', borderLeft: '4px solid var(--surface-hover)', paddingLeft: '2rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '2px' }}>PHASE 02</div>
                  <Activity size={32} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
                  <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Resource Triangulation</h4>
                  <p style={{ color: 'var(--text-muted)' }}>System queries offline DB to cross-reference location with trauma centers and verified towing.</p>
                </div>
                <div style={{ flex: '1 1 300px', borderLeft: '4px solid var(--surface-hover)', paddingLeft: '2rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '2px' }}>PHASE 03</div>
                  <PhoneCall size={32} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
                  <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>One-Touch Dispatch</h4>
                  <p style={{ color: 'var(--text-muted)' }}>A single interaction bridges communication protocols and hands off navigation vectors.</p>
                </div>
              </div>
            </section>

            <section id="impact" className="container" style={{ padding: '2rem 0 8rem 0' }}>
              <div style={{ background: 'var(--surface-hover)', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', border: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-1px' }}>Global Impact</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                  ROADSoS is engineered to drastically reduce dispatch latency and save lives in critical situations when every second counts.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>30%</div>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>Reduction in Response Time</div>
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>10k+</div>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>Active Regional Nodes</div>
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>99.9%</div>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>Offline System Reliability</div>
                  </div>
                </div>
              </div>
            </section>
          </motion.main>
        )}

        {currentHash === '#sos' && (
          <motion.main 
            key="sos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SOSPage />
          </motion.main>
        )}
      </AnimatePresence>

      <FooterTaped />
    </>
  );
}

export default App;
