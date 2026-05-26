interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "Get emergency services in seconds, not minutes. Every moment counts."
  },
  {
    icon: "📍",
    title: "Location-Aware",
    description: "Automatically detects your location and surfaces the nearest help."
  },
  {
    icon: "📡",
    title: "Works Offline",
    description: "Critical data cached locally. Stay connected even with no signal."
  },
  {
    icon: "🌍",
    title: "Global Coverage",
    description: "Emergency services data across multiple countries and regions."
  },
  {
    icon: "☎️",
    title: "One-Tap Calling",
    description: "Direct connection to services with automatic location sharing."
  },
  {
    icon: "🔒",
    title: "Privacy First",
    description: "Your data stays with you. No tracking or unnecessary data collection."
  }
];

export default function Features() {
  return (
    <section className="features">
      <div className="container">
        <h2>Why ROADSoS?</h2>
        <p className="section-subtitle">Built for road emergencies, designed for survival</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
