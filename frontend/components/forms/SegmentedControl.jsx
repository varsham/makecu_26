import React from "react";
export function SegmentedControl({ options = [], value, onChange, fullWidth = true }) {
  return (
    <div style={{ display: fullWidth ? "flex" : "inline-flex", padding: 4, gap: 4, borderRadius: "var(--radius-pill)", background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--border-soft)" }}>
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        const on = opt.value === value;
        return (
          <button key={opt.value} type="button" onClick={() => onChange && onChange(opt.value)}
            style={{ flex: fullWidth ? 1 : undefined, height: 38, padding: "0 16px", borderRadius: "var(--radius-pill)", border: 0, cursor: "pointer",
              background: on ? "var(--surface-card)" : "transparent", boxShadow: on ? "var(--shadow-2)" : "none",
              color: on ? "var(--text-strong)" : "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, transition: "all var(--dur-base) var(--ease-soft)" }}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
