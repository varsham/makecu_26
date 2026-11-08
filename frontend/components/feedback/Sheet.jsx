import React from "react";
import { IconButton } from "../core/IconButton.jsx";
export function Sheet({ open, onClose, title, children, footer }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: open ? "auto" : "none" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--scrim)", opacity: open ? 1 : 0, transition: "opacity var(--dur-base) var(--ease-soft)" }} />
      <div role="dialog" aria-label={title} style={{ position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "88%", display: "flex", flexDirection: "column",
        background: "var(--bg-app)", borderRadius: "var(--radius-xl) var(--radius-xl) 0 0", boxShadow: "var(--shadow-3)",
        transform: open ? "translateY(0)" : "translateY(105%)", transition: "transform var(--dur-slow) var(--ease-soft)" }}>
        <div style={{ width: 40, height: 5, borderRadius: 99, background: "var(--ink-100)", margin: "10px auto 0" }} />
        {title && <div style={{ display: "flex", alignItems: "center", padding: "8px 12px 4px 20px" }}>
          <div style={{ flex: 1, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, color: "var(--text-strong)" }}>{title}</div>
          <IconButton icon="x" label="Close" onClick={onClose} /></div>}
        <div style={{ overflow: "auto", padding: "8px 20px 20px", fontFamily: "var(--font-body)" }}>{children}</div>
        {footer && <div style={{ padding: "12px 20px 28px", borderTop: "1px solid var(--border-soft)" }}>{footer}</div>}
      </div>
    </div>
  );
}
