"use client";

import { useState, useEffect } from "react";
import { WarningGraphic } from "./warning-graphic";

export default function DemoWarning() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let t: number | undefined;
    if (countdown !== null && countdown > 0) {
      t = window.setTimeout(() => setCountdown(c => (c === null ? null : c - 1)), 1000);
    } else if (countdown === 0) {
      setLoading(true);
      // simulate loading state for 3s
      t = window.setTimeout(() => setLoading(false), 3000);
    }
    return () => { if (t) clearTimeout(t); };
  }, [countdown]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      {!loading ? (
        <div style={{ textAlign: 'center' }}>
          <WarningGraphic width={600} height={230} className="drop-shadow-lg" />
          <div style={{ marginTop: 16 }}>
            {countdown === null ? (
              <button className="btn btn-danger" onClick={() => setCountdown(5)}>Activate</button>
            ) : countdown > 0 ? (
              <div style={{ fontSize: 18 }}>Activating in {countdown}...</div>
            ) : (
              <div style={{ fontSize: 18 }}>Starting...</div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)' }}>
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Loading dispatch module...</div>
            <WarningGraphic width={420} height={160} color="#ffffff" />
          </div>
        </div>
      )}
    </div>
  );
}
