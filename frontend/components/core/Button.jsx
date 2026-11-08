import React from "react";
import { Icon } from "./Icon.jsx";
const VARIANTS = {
  primary: { bg: "var(--brand)", fg: "var(--text-on-accent)", bd: "transparent", sh: "var(--shadow-2)" },
  secondary: { bg: "var(--surface-card)", fg: "var(--text-strong)", bd: "var(--border-soft)", sh: "var(--shadow-1)" },
  soft: { bg: "var(--brand-soft)", fg: "var(--leaf-800)", bd: "transparent", sh: "none" },
  ghost: { bg: "transparent", fg: "var(--brand)", bd: "transparent", sh: "none" },
  danger: { bg: "var(--accent-soft)", fg: "var(--rose-700)", bd: "transparent", sh: "none" },
};
const SIZES = { sm: { h: 36, px: 14, fs: 14, ic: 16 }, md: { h: 44, px: 20, fs: 16, ic: 18 }, lg: { h: 56, px: 26, fs: 18, ic: 22 } };
export function Button({ children, variant = "primary", size = "md", icon, iconRight, fullWidth, disabled, onClick, type = "button", style }) {
  const [pressed, setPressed] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
      style={{
        display: fullWidth ? "flex" : "inline-flex", width: fullWidth ? "100%" : undefined, alignItems: "center", justifyContent: "center", gap: 8,
        height: s.h, padding: `0 ${s.px}px`, borderRadius: "var(--radius-pill)", border: `1.5px solid ${v.bd}`,
        background: v.bg, color: v.fg, boxShadow: pressed ? "var(--shadow-press)" : v.sh,
        fontFamily: "var(--font-display)", fontWeight: 600, fontSize: s.fs, letterSpacing: ".01em",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
        transform: pressed && !disabled ? "scale(.97)" : "none", transition: "transform var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast)",
        ...style,
      }}>
      {icon && <Icon name={icon} size={s.ic} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.ic} />}
    </button>
  );
}
