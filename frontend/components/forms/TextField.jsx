import React from "react";
import { Icon } from "../core/Icon.jsx";
export function TextField({ label, hint, optional, value, onChange, placeholder, icon, suffix, type = "text", style }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-body)", ...style }}>
      {label && <span style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>
        {label}{optional && <span style={{ fontWeight: 500, color: "var(--text-muted)", fontSize: 13 }}>Optional</span>}</span>}
      <span style={{ display: "flex", alignItems: "center", gap: 10, height: 50, padding: "0 16px", borderRadius: "var(--radius-md)",
        background: "var(--surface-card)", border: `1.5px solid ${focus ? "var(--brand)" : "var(--border-soft)"}`,
        boxShadow: focus ? "0 0 0 4px var(--brand-soft)" : "none", transition: "all var(--dur-fast)" }}>
        {icon && <Icon name={icon} size={18} color="var(--text-muted)" />}
        <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: "transparent", fontFamily: "inherit", fontSize: 16, color: "var(--text-strong)" }} />
        {suffix && <span style={{ color: "var(--text-muted)", fontSize: 14 }}>{suffix}</span>}
      </span>
      {hint && <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{hint}</span>}
    </label>
  );
}
