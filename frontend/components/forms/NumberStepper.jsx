import React from "react";
import { Icon } from "../core/Icon.jsx";
export function NumberStepper({ value = 0, min = 0, max = 999, step = 1, onChange, unit, size = "md" }) {
  const h = size === "sm" ? 36 : 44;
  const set = (n) => onChange && onChange(Math.max(min, Math.min(max, n)));
  const btn = (icon, d, dis) => (
    <button type="button" disabled={dis} onClick={() => set(value + d)} aria-label={icon}
      style={{ width: h, height: h, borderRadius: "50%", border: 0, background: "var(--surface-card)", color: "var(--text-strong)", display: "flex", alignItems: "center", justifyContent: "center", cursor: dis ? "not-allowed" : "pointer", opacity: dis ? 0.35 : 1, boxShadow: "var(--shadow-1)" }}>
      <Icon name={icon} size={18} />
    </button>
  );
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: 4, borderRadius: "var(--radius-pill)", background: "var(--surface-sunken)" }}>
      {btn("minus", -step, value <= min)}
      <span style={{ minWidth: 44, textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--text-strong)" }}>
        {value}{unit && <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13, color: "var(--text-muted)", marginLeft: 4 }}>{unit}</span>}
      </span>
      {btn("plus", step, value >= max)}
    </span>
  );
}
