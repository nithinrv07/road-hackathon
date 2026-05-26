"use client";

import { WarningGraphic } from "@/components/ui/warning-graphic";

export default function Demo() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background, #fff)' }}>
      <WarningGraphic
        width={600}
        height={230}
        enableAnimations={true}
        animationSpeed={1.5}
        className="drop-shadow-lg"
      />
    </div>
  );
}
