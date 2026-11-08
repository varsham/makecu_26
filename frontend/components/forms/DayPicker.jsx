import React from "react";
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
export function DayPicker({ value = [], onChange, size = 40 }) {
  const toggle = (i) => {
    if (!onChange) return;
    onChange(value.includes(i) ? value.filter((d) => d !== i) : [...value, i].sort());
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
      {DAYS.map((d, i) => {
        const on = value.includes(i);
        return (
          <button key={d} type="button" aria-pressed={on} onClick={() => toggle(i)}
            style={{ width: size, height: size + 4, borderRadius: "var(--radius-sm)", border: 0, cursor: "pointer",
              background: on ? "var(--brand)" : "var(--oat)", color: on ? "var(--white)" : "var(--ink-700)",
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, transition: "all var(--dur-base) var(--ease-sprout)",
              transform: on ? "translateY(-2px)" : "none", boxShadow: on ? "var(--shadow-2)" : "none" }}>{d}</button>
        );
      })}
    </div>
  );
}
