function TodayScreen({ pills, deviceStatus, onDispense, takenTimes }) {
  const { TopBar, Card, Button, PillSelectTile, Icon, Badge } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const [sel, setSel] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const { year, month, day } = D.TODAY;
  const today = D.scheduledOn(pills, year, month, day);
  const slots = {};
  today.forEach((p) => p.times.forEach((t) => { (slots[t] = slots[t] || []).push(p); }));
  const times = Object.keys(slots).sort();
  const next = times.find((t) => !takenTimes.includes(t));
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const run = async (list, label, time) => {
    setBusy(true);
    await onDispense(list, label, time);
    setBusy(false);
    setSel([]);
  };
  const greeting = D.greeting();
  return (
    <div>
      <TopBar large eyebrow={D.todayLabel()} title={greeting} />
      <div style={{ padding: "0 var(--screen-pad) 24px" }}>
        <window.DeviceStatus status={deviceStatus} />

        {next ? (
          <Card style={{ marginTop: 16, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>Up next</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, color: "var(--text-strong)" }}>{D.fmtTime(next)}</div>
              </div>
              <Badge tone="leaf" icon="pill">{slots[next].length} {slots[next].length === 1 ? "pill" : "pills"}</Badge>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "14px 0 16px" }}>
              {slots[next].map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15 }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: D.CATEGORIES[p.category].color }} />
                  <span style={{ flex: 1, fontWeight: 600, color: "var(--text-strong)" }}>{p.name}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: 14 }}>No. {p.compartment}</span>
                </div>
              ))}
            </div>
            <Button fullWidth size="lg" icon="sparkles" disabled={busy || deviceStatus === "moving"} onClick={() => run(slots[next], "Your " + D.fmtTime(next) + " pills are ready", next)}>
              Dispense now
            </Button>
          </Card>
        ) : (
          <Card tone="leaf" style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
            <Icon name="sprout" size={24} color="var(--leaf-600)" />
            <div style={{ fontWeight: 600, color: "var(--leaf-800)" }}>
              {pills.length === 0 ? "Add your first medicine in My Pills to get started." : today.length === 0 ? "Nothing is scheduled for today." : "That's everything for today. Nice work!"}
            </div>
          </Card>
        )}

        {times.length > 1 && (
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {times.map((t) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 30, padding: "0 12px", borderRadius: 99, fontSize: 13, fontWeight: 600,
                background: takenTimes.includes(t) ? "var(--leaf-50)" : "var(--surface-sunken)", color: takenTimes.includes(t) ? "var(--leaf-800)" : "var(--text-muted)" }}>
                {takenTimes.includes(t) && <Icon name="check" size={14} strokeWidth={3} />}{D.fmtTime(t)}
              </span>
            ))}
          </div>
        )}

        <window.SectionLabel action={sel.length > 0 && <button onClick={() => setSel([])} style={{ border: 0, background: "none", color: "var(--brand)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Clear</button>}>
          Manual mode
        </window.SectionLabel>
        <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: -4, marginBottom: 12 }}>Tap the pills you'd like, then dispense.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 }}>
          {[...pills].sort((a, b) => a.compartment - b.compartment).map((p) => (
            <PillSelectTile key={p.id} name={p.name} compartment={p.compartment} color={D.CATEGORIES[p.category].color} count={D.left(p)}
              disabled={D.left(p) === 0} selected={sel.includes(p.id)} onToggle={() => toggle(p.id)} />
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <Button fullWidth size="lg" variant={sel.length ? "primary" : "secondary"} icon="sparkles" disabled={!sel.length || busy || deviceStatus === "moving"}
            onClick={() => run(pills.filter((p) => sel.includes(p.id)), `All done! ${sel.length} ${sel.length === 1 ? "pill" : "pills"} dispensed`)}>
            {sel.length ? `Dispense ${sel.length} ${sel.length === 1 ? "pill" : "pills"}` : "Pick pills to dispense"}
          </Button>
        </div>
      </div>
    </div>
  );
}
window.TodayScreen = TodayScreen;
