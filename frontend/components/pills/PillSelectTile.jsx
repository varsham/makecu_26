import React from "react";
import { Icon } from "../core/Icon.jsx";
export function PillSelectTile({ name, compartment, color = "var(--oat)", count, selected, disabled, onToggle }) {
  return (
    <button type="button" aria-pressed={!!selected} disabled={disabled} onClick={onToggle}
      style={{ position: "relative", textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10, minHeight: 112, padding: 12,
        borderRadius: "var(--radius-md)", border: 0, cursor: disabled ? "not-allowed" : "pointer", background: color, opacity: disabled ? 0.45 : 1,
        boxShadow: selected ? "0 0 0 3px var(--brand), var(--shadow-2)" : "none", transform: selected ? "translateY(-2px)" : "none",
        transition: "all var(--dur-base) var(--ease-sprout)", fontFamily: "var(--font-body)", color: "var(--ink-900)" }}>
      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500 }}>{String(compartment).padStart(2, "0")}</span>
        <span style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          background: selected ? "var(--brand)" : "rgba(255,253,249,.7)", color: "var(--white)", transition: "background var(--dur-fast)" }}>
          {selected && <Icon name="check" size={15} strokeWidth={3} />}</span>
      </span>
      <span>
        <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, lineHeight: 1.2 }}>{name}</span>
        {count != null && <span style={{ display: "block", fontSize: 12, fontWeight: 500, marginTop: 2, color: "var(--ink-700)" }}>{count} left</span>}
      </span>
    </button>
  );
}
