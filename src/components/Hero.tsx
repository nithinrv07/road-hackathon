export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>ROADSoS</h1>
          <p className="tagline">Emergency Help At Your Fingertips</p>
          <p className="description">
            When seconds matter on the road, ROADSoS connects you instantly to trauma centers, ambulances, police, and rescue services. One tap. One location. All the help you need.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Download App</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="screen-content">
                <div className="location-pin">📍</div>
                <p className="current-location">Your Location</p>
                <div className="services-list">
                  <div className="service-item ambulance">🚑 Ambulance (0.3 km)</div>
                  <div className="service-item hospital">🏥 Hospital (1.2 km)</div>
                  <div className="service-item police">🚓 Police (0.8 km)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
