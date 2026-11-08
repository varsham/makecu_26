import React from "react";
export function StockMeter({ count, total, lowAt = 7, outAt = 3, compact, style }) {
  const level = count <= outAt ? "out" : count <= lowAt ? "low" : "ok";
  const label = { ok: "Plenty left", low: "Running low", out: "Almost out" }[level];
  const pct = Math.max(4, Math.min(100, (count / Math.max(total, 1)) * 100));
  return (
    <div style={{ fontFamily: "var(--font-body)", minWidth: compact ? 72 : 160, ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
        {!compact && <span style={{ fontSize: 13, fontWeight: 600, color: `var(--stock-${level})` }}>{label}</span>}
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: compact ? 16 : 15, color: "var(--text-strong)", marginLeft: compact ? "auto" : 0 }}>
          {count}<span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12, color: "var(--text-muted)" }}> left</span></span>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: `var(--stock-${level}-soft)` }}>
        <div style={{ height: "100%", width: pct + "%", borderRadius: 99, background: `var(--stock-${level})`, transition: "width var(--dur-slow) var(--ease-soft)" }} />
      </div>
    </div>
  );
}
