import React from "react";
import { IconButton } from "../core/IconButton.jsx";
export function TopBar({ title, eyebrow, onBack, actions, large }) {
  return (
    <header style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px var(--screen-pad) 12px", minHeight: 56 }}>
      {onBack && <IconButton icon="chevron-left" label="Back" onClick={onBack} style={{ marginLeft: -10 }} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 2 }}>{eyebrow}</div>}
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: large ? 30 : 20, lineHeight: 1.15, color: "var(--text-strong)" }}>{title}</h1>
      </div>
      {actions && <div style={{ display: "flex", gap: 4 }}>{actions}</div>}
    </header>
  );
}
