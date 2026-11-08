import React from "react";
import { Icon } from "../core/Icon.jsx";
export function Toast({ message, icon = "sprout", visible = true, tone = "dark" }) {
  const dark = tone === "dark";
  return (
    <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: "var(--radius-pill)",
      background: dark ? "var(--ink-900)" : "var(--surface-card)", color: dark ? "var(--white)" : "var(--text-strong)", boxShadow: "var(--shadow-3)",
      fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, width: "max-content", maxWidth: "100%",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(.96)", transition: "all var(--dur-slow) var(--ease-sprout)" }}>
      <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--leaf-200)", color: "var(--leaf-800)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={16} /></span>
      {message}
    </div>
  );
}
