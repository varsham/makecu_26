import React from "react";
const TONES = { white: "var(--surface-card)", paper: "var(--surface-sunken)", oat: "var(--oat)", tan: "var(--tan)", honey: "var(--honey)", mauve: "var(--mauve)", leaf: "var(--leaf-50)", rose: "var(--rose-50)", sky: "var(--sky-50)", apricot: "var(--apricot-50)" };
export function Card({ children, tone = "white", padding = 16, onClick, elevated = true, style }) {
  return (
    <div onClick={onClick} role={onClick ? "button" : undefined}
      style={{ background: TONES[tone] || tone, borderRadius: "var(--radius-lg)", padding,
        boxShadow: elevated && tone === "white" ? "var(--shadow-1)" : "none", cursor: onClick ? "pointer" : undefined, ...style }}>
      {children}
    </div>
  );
}
