interface Service {
  name: string;
  icon: string;
  color: string;
  description: string;
}

const services: Service[] = [
  {
    name: "Ambulances",
    icon: "🚑",
    color: "#FF6B6B",
    description: "Nearby ambulance services for immediate medical transport"
  },
  {
    name: "Trauma Centers",
    icon: "🏥",
    color: "#4ECDC4",
    description: "Specialized trauma and emergency care facilities"
  },
  {
    name: "Police Stations",
    icon: "🚓",
    color: "#45B7D1",
    description: "Law enforcement for accident documentation and assistance"
  },
  {
    name: "Fire & Rescue",
    icon: "🚒",
    color: "#FFA07A",
    description: "Emergency response and vehicle extrication teams"
  },
  {
    name: "Towing Services",
    icon: "🚗",
    color: "#96CEB4",
    description: "Quick vehicle recovery and towing to safety"
  },
  {
    name: "Roadside Help",
    icon: "🔧",
    color: "#FFEAA7",
    description: "Mechanical assistance and puncture repair shops"
  }
];

export default function Services() {
  return (
    <section className="services">
      <div className="container">
        <h2>Services at Your Fingertips</h2>
        <p className="section-subtitle">One app. All the emergency services you need.</p>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card" style={{ borderTopColor: service.color }}>
              <div className="service-icon" style={{ backgroundColor: service.color + "20" }}>
                {service.icon}
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
