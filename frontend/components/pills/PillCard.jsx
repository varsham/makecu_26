import React from "react";
import { Icon } from "../core/Icon.jsx";
import { Badge } from "../core/Badge.jsx";
import { CompartmentTag } from "./CompartmentTag.jsx";
import { StockMeter } from "./StockMeter.jsx";
export function PillCard({ name, dose, category, categoryColor = "var(--oat)", categoryTone = "neutral", compartment, count, total, lowAt, outAt, schedule, paused, onClick }) {
  return (
    <div onClick={onClick} role={onClick ? "button" : undefined}
      style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: 16, boxShadow: "var(--shadow-1)", cursor: onClick ? "pointer" : undefined,
        display: "flex", flexDirection: "column", gap: 12, opacity: paused ? 0.72 : 1, fontFamily: "var(--font-body)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {compartment != null && <CompartmentTag number={compartment} color={categoryColor} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--text-strong)", lineHeight: 1.2 }}>{name}</div>
          {dose && <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 2 }}>{dose}</div>}
        </div>
        {paused ? <Badge tone="sky" icon="pause">Paused</Badge> : category && <Badge tone={categoryTone} dot>{category}</Badge>}
      </div>
      {schedule && <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-body)" }}><Icon name="clock" size={16} color="var(--text-muted)" />{schedule}</div>}
      {count != null && <StockMeter count={count} total={total || count} lowAt={lowAt} outAt={outAt} />}
    </div>
  );
}
