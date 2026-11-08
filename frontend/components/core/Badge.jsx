import React from "react";
import { Icon } from "./Icon.jsx";
const TONES = {
  leaf: ["var(--leaf-50)", "var(--leaf-800)", "var(--leaf-400)"],
  rose: ["var(--rose-50)", "var(--rose-700)", "var(--rose-500)"],
  sky: ["var(--sky-50)", "var(--sky-800)", "var(--sky-600)"],
  apricot: ["var(--apricot-50)", "var(--apricot-800)", "var(--apricot-600)"],
  honey: ["#F8EBD0", "#7A5A1E", "var(--honey)"],
  mauve: ["#EEEAEA", "var(--ink-700)", "var(--mauve)"],
  neutral: ["var(--surface-sunken)", "var(--text-body)", "var(--ink-300)"],
};
export function Badge({ children, tone = "neutral", icon, dot, style }) {
  const [bg, fg, dc] = TONES[tone] || TONES.neutral;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 10px", borderRadius: "var(--radius-pill)",
      background: bg, color: fg, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", ...style }}>
      {dot && <span style={{ width: 8, height: 8, borderRadius: "50%", background: dc }} />}
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  );
}
