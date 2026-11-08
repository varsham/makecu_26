import React from "react";
export function RangeSlider({ value, min = 1, max = 8, step = 1, onChange, formatValue, showTicks = true }) {
  const ref = React.useRef(null);
  const pct = ((value - min) / (max - min)) * 100;
  const fromX = (x) => {
    const r = ref.current.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (x - r.left) / r.width));
    const v = Math.round((min + t * (max - min)) / step) * step;
    if (v !== value && onChange) onChange(v);
  };
  const ticks = [];
  for (let v = min; v <= max; v += step) ticks.push(v);
  return (
    <div style={{ fontFamily: "var(--font-body)", userSelect: "none" }}>
      <div ref={ref} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); fromX(e.clientX); }}
        onPointerMove={(e) => { if (e.buttons) fromX(e.clientX); }}
        style={{ position: "relative", height: 44, cursor: "pointer", touchAction: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 17, height: 10, borderRadius: 99, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--border-soft)" }} />
        <div style={{ position: "absolute", left: 0, width: pct + "%", top: 17, height: 10, borderRadius: 99, background: "var(--leaf-200)" }} />
        <div style={{ position: "absolute", left: `calc(${pct}% - 16px)`, top: 6, width: 32, height: 32, borderRadius: "50%", background: "var(--brand)", border: "4px solid var(--white)", boxShadow: "var(--shadow-2)", boxSizing: "border-box" }} />
      </div>
      {showTicks && (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 6px", fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
          {ticks.map((t) => <span key={t} style={{ color: t === value ? "var(--brand)" : undefined }}>{formatValue ? formatValue(t) : t}</span>)}
        </div>
      )}
    </div>
  );
}
