import React from "react";
import { Icon } from "../core/Icon.jsx";
export function TabBar({ items = [], value, onChange }) {
  return (
    <nav style={{ display: "flex", justifyContent: "space-around", padding: "8px 10px 26px", background: "var(--surface-card)", borderTop: "1px solid var(--border-soft)" }}>
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button key={it.id} type="button" onClick={() => onChange && onChange(it.id)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, border: 0, background: "transparent", cursor: "pointer", padding: "4px 0",
              color: on ? "var(--leaf-800)" : "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600 }}>
            <span style={{ width: 56, height: 32, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center",
              background: on ? "var(--leaf-200)" : "transparent", transition: "background var(--dur-base) var(--ease-soft)" }}>
              <Icon name={it.icon} size={22} /></span>
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}
