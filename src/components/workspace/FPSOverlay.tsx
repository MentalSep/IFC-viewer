import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function FPSOverlay() {
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const frames = useRef<number>(0);
  const [fps, setFps] = useState<number>(0);

  useEffect(() => {
    const loop = (t: number) => {
      if (lastRef.current === null) lastRef.current = t;
      frames.current++;
      const delta = t - (lastRef.current || t);
      if (delta >= 500) {
        const currentFps = Math.round((frames.current / delta) * 1000);
        setFps(currentFps);
        frames.current = 0;
        lastRef.current = t;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="panel fps-overlay" style={{ width: 120 }}>
      <div className="panel-header">
        <div>
          <p className="panel-subtitle">Performance</p>
          <h3>FPS</h3>
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <div className="panel-item-title">{fps} fps</div>
        <div className="panel-item-meta">Render</div>
      </div>
    </motion.div>
  );
}
