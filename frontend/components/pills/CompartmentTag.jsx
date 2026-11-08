import React from "react";
export function CompartmentTag({ number, color = "var(--oat)", size = "md" }) {
  const s = size === "sm" ? 28 : 36;
  return (
    <span title={"Compartment " + number} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: s, height: s,
      borderRadius: "var(--radius-sm)", background: color, color: "var(--ink-900)", fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: size === "sm" ? 12 : 14, flexShrink: 0 }}>
      {String(number).padStart(2, "0")}
    </span>
  );
}
