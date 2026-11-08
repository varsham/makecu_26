const { Icon: KIcon } = window.SproutDesignSystem_50f72c;

function SectionLabel({ children, action }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "22px 0 10px" }}>
      <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--text-strong)" }}>{children}</h2>
      {action}
    </div>
  );
}

function FilterChip({ label, color, active, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", borderRadius: 99, flexShrink: 0, cursor: "pointer",
      border: active ? "1.5px solid var(--ink-900)" : "1.5px solid var(--border-soft)", background: active ? "var(--ink-900)" : "var(--surface-card)",
      color: active ? "var(--white)" : "var(--text-body)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14 }}>
      {color && <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />}
      {label}
    </button>
  );
}

function DeviceStatus({ status }) {
  const moving = status === "moving";
  const ok = status === "ready";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 32, padding: "0 12px 0 10px", borderRadius: 99, background: "var(--surface-card)", boxShadow: "var(--shadow-1)",
      fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--text-body)" }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: moving ? "var(--apricot-600)" : ok ? "var(--leaf-400)" : "var(--ink-300)" }} />
      {moving ? "Sprout is dispensing…" : ok ? "Sprout is ready" : "Sprout is offline"}
    </span>
  );
}

function StatusBar() {
  return (
    <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 30px 0 34px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, color: "var(--ink-900)", flexShrink: 0 }}>
      <span>9:41</span>
      <span style={{ display: "flex", gap: 6, alignItems: "center" }}><KIcon name="signal" size={17} /><KIcon name="wifi" size={17} /><KIcon name="battery-full" size={22} /></span>
    </div>
  );
}

Object.assign(window, { SectionLabel, FilterChip, DeviceStatus, StatusBar });
