import React from "react";
import { Icon } from "../core/Icon.jsx";
const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export function CalendarMonth({ year, month, days = {}, today, selected, rangeEnd, onSelect, onPrev, onNext }) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const n = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= n; d++) cells.push(d);
  const inRange = (d) => !rangeEnd || new Date(year, month, d) <= rangeEnd;
  const iconBtn = (name, fn, label) => (
    <button type="button" onClick={fn} aria-label={label} style={{ width: 40, height: 40, border: 0, background: "transparent", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-900)" }}>
      <Icon name={name} size={22} /></button>
  );
  return (
    <div style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
        <div style={{ flex: 1, fontSize: 22, fontWeight: 500 }}>{MONTHS[month]} {year}</div>
        {iconBtn("chevron-left", onPrev, "Previous month")}{iconBtn("chevron-right", onNext, "Next month")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 6 }}>
        {DOW.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 13, fontWeight: 500, color: "var(--ink-700)", paddingBottom: 6 }}>{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={"e" + i} />;
          const info = days[d] || {};
          const active = inRange(d);
          const isSel = selected === d, isToday = today === d;
          return (
            <button key={d} type="button" onClick={() => onSelect && onSelect(d)} disabled={!active}
              style={{ aspectRatio: "0.82", border: 0, borderRadius: "var(--radius-sm)", padding: "5px 6px", textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "space-between",
                background: active ? (info.tone ? `var(--${info.tone})` : "var(--oat)") : "transparent",
                boxShadow: isSel ? "0 0 0 2.5px var(--ink-900)" : !active ? "inset 0 0 0 1.5px var(--ink-100)" : "none",
                cursor: active ? "pointer" : "default", color: active ? "var(--ink-900)" : "var(--ink-300)", fontFamily: "inherit", transition: "box-shadow var(--dur-fast)" }}>
              <span style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>{d}{isToday && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />}</span>
              {active && info.dots && <span style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>{info.dots.map((c, k) => <span key={k} style={{ width: 7, height: 7, borderRadius: "50%", background: c, boxShadow: "0 0 0 1px rgba(43,39,36,.15)" }} />)}</span>}
              {active && info.paused && <Icon name="pause" size={12} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
