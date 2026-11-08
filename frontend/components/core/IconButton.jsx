import React from "react";
import { Icon } from "./Icon.jsx";
export function IconButton({ icon, label, variant = "plain", size = 44, onClick, disabled, style }) {
  const V = {
    plain: { bg: "transparent", fg: "var(--text-strong)" },
    soft: { bg: "var(--surface-sunken)", fg: "var(--text-strong)" },
    solid: { bg: "var(--brand)", fg: "var(--text-on-accent)" },
    card: { bg: "var(--surface-card)", fg: "var(--text-strong)" },
  }[variant];
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled}
      style={{ width: size, height: size, borderRadius: "50%", border: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: V.bg, color: V.fg, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
        boxShadow: variant === "card" ? "var(--shadow-1)" : "none", flexShrink: 0, ...style }}>
      <Icon name={icon} size={Math.round(size * 0.48)} />
    </button>
  );
}
