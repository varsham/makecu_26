import React from "react";
export function Switch({ checked, onChange, label, description, disabled }) {
  const knob = (
    <span role="switch" aria-checked={!!checked} onClick={() => !disabled && onChange && onChange(!checked)}
      style={{ position: "relative", width: 50, height: 30, borderRadius: 99, flexShrink: 0, cursor: disabled ? "not-allowed" : "pointer",
        background: checked ? "var(--brand)" : "var(--ink-100)", transition: "background var(--dur-base) var(--ease-soft)", opacity: disabled ? 0.45 : 1 }}>
      <span style={{ position: "absolute", top: 3, left: checked ? 23 : 3, width: 24, height: 24, borderRadius: "50%", background: "var(--white)",
        boxShadow: "var(--shadow-2)", transition: "left var(--dur-base) var(--ease-sprout)" }} />
    </span>
  );
  if (!label) return knob;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--font-body)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-strong)" }}>{label}</div>
        {description && <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{description}</div>}
      </div>
      {knob}
    </div>
  );
}
