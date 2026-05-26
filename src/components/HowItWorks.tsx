interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "1",
    title: "Open ROADSoS",
    description: "Launch the app or press the emergency button"
  },
  {
    number: "2",
    title: "Instant Detection",
    description: "App automatically pinpoints your exact location"
  },
  {
    number: "3",
    title: "See Services",
    description: "Find nearest ambulances, hospitals, police, and rescue teams"
  },
  {
    number: "4",
    title: "One-Tap Help",
    description: "Call directly with your location auto-shared"
  }
];

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="container">
        <h2>How It Works</h2>
        <p className="section-subtitle">Simple. Fast. Lifesaving.</p>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector">→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
