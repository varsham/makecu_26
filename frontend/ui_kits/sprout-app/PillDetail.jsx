function PillDetail({ pill: p, pills, onBack, onEdit, onUpdate, onPauseCategory, onDelete, toast }) {
  const { TopBar, IconButton, Card, Badge, Button, StockMeter, CompartmentTag, Sheet, NumberStepper, Switch, Icon } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const c = D.CATEGORIES[p.category];
  const th = D.thresholds(p);
  const [sheet, setSheet] = React.useState(null);
  const [refillN, setRefillN] = React.useState(p.refill);
  const [breakDays, setBreakDays] = React.useState(3);
  const [wholeCat, setWholeCat] = React.useState(false);
  const sameCat = pills.filter((x) => x.category === p.category).length;
  const row = (icon, label, value) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: "1px solid var(--border-soft)" }}>
      <Icon name={icon} size={18} color="var(--text-muted)" />
      <span style={{ flex: 1, color: "var(--text-muted)", fontSize: 14 }}>{label}</span>
      <span style={{ fontWeight: 600, color: "var(--text-strong)", fontSize: 15, textAlign: "right" }}>{value}</span>
    </div>
  );
  return (
    <div style={{ minHeight: "100%" }}>
      <TopBar title={p.name} onBack={onBack} actions={<IconButton icon="pencil" label="Edit" onClick={onEdit} />} />
      <div style={{ padding: "0 var(--screen-pad) 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card tone="white" style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: "var(--radius-md)", background: c.color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-700)" }}>No.</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--ink-900)", lineHeight: 1 }}>{String(p.compartment).padStart(2, "0")}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, color: "var(--text-muted)" }}>{p.dose}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                <Badge tone={c.tone} dot>{c.label}</Badge>
                {p.pausedUntil && <Badge tone="sky" icon="pause">Paused</Badge>}
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 18 }}>
          <StockMeter count={D.left(p)} total={p.refill} lowAt={th.lowAt} outAt={th.outAt} />
          <div style={{ fontSize: 14, color: "var(--text-muted)", margin: "10px 0 14px" }}>
            {p.dispensed} dispensed since you refilled {p.refill}.
          </div>
          <Button fullWidth variant="soft" icon="package-plus" onClick={() => setSheet("refill")}>I refilled this</Button>
        </Card>

        <Card style={{ padding: "6px 18px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, padding: "10px 0", color: "var(--text-strong)" }}>Schedule</div>
          {row("repeat", "How often", p.manual ? "As needed" : p.days.length === 7 ? "Every day" : p.days.map((i) => D.DOW[i]).join(" "))}
          {row("clock", "When", p.manual ? "Manual" : p.times.map(D.fmtTime).join(", "))}
          {row("pill", "Per day", p.manual ? "—" : `${p.times.length}×`)}
        </Card>

        {p.pausedUntil ? (
          <Button fullWidth variant="secondary" icon="play" onClick={() => { onUpdate({ ...p, pausedUntil: null }); toast("Welcome back! " + p.name + " is on again", "play"); }}>Resume now</Button>
        ) : (
          <Button fullWidth variant="secondary" icon="pause" onClick={() => setSheet("break")}>Take a break</Button>
        )}
        <Button fullWidth variant="danger" icon="trash-2" onClick={() => setSheet("delete")}>Remove from my Sprout</Button>
      </div>

      <Sheet open={sheet === "delete"} onClose={() => setSheet(null)} title={"Remove " + p.name + "?"}
        footer={<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Button fullWidth size="lg" variant="danger" icon="trash-2" onClick={() => { setSheet(null); onDelete(p); }}>Yes, remove it</Button>
          <Button fullWidth variant="secondary" onClick={() => setSheet(null)}>Keep it</Button>
        </div>}>
        <p style={{ margin: "0 0 12px", color: "var(--text-body)", lineHeight: 1.5 }}>
          {p.name} comes off your schedule right away, and Sprout will stop dispensing it.
        </p>
        <p style={{ margin: 0, color: "var(--text-body)", lineHeight: 1.5 }}>
          Take any pills out of compartment {p.compartment} yourself. The compartment is then free for another medicine.
        </p>
      </Sheet>

      <Sheet open={sheet === "refill"} onClose={() => setSheet(null)} title="Log a refill"
        footer={<Button fullWidth size="lg" onClick={() => { onUpdate({ ...p, refill: refillN, dispensed: 0 }); setSheet(null); toast("Refilled! " + refillN + " " + p.name + " in No. " + p.compartment, "package-check"); }}>Save refill</Button>}>
        <p style={{ margin: "0 0 18px", color: "var(--text-body)", lineHeight: 1.5 }}>How many pills did you put into compartment {p.compartment}? We'll count down from here.</p>
        <div style={{ display: "flex", justifyContent: "center" }}><NumberStepper value={refillN} min={1} max={200} onChange={setRefillN} unit="pills" /></div>
      </Sheet>

      <Sheet open={sheet === "break"} onClose={() => setSheet(null)} title="Take a break"
        footer={<Button fullWidth size="lg" icon="pause" onClick={() => {
          const until = D.addDaysISO(D.todayISO(), breakDays);   // the date it comes back, e.g. "2026-11-15"
          if (wholeCat) onPauseCategory(p.category, until); else onUpdate({ ...p, pausedUntil: until });
          setSheet(null); toast(`Paused ${wholeCat ? "all " + c.label.toLowerCase() : p.name} until ${D.fmtShortDate(until)}`, "pause");
        }}>Pause for {breakDays} {breakDays === 1 ? "day" : "days"}</Button>}>
        <p style={{ margin: "0 0 18px", color: "var(--text-body)", lineHeight: 1.5 }}>Your other pills stay on schedule. We'll pick this back up automatically.</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontWeight: 600, color: "var(--text-strong)" }}>How long?</span>
          <NumberStepper value={breakDays} min={1} max={30} onChange={setBreakDays} unit="days" />
        </div>
        {sameCat > 1 && <Switch label={`Pause all ${c.label.toLowerCase()}`} description={`${sameCat} pills in this category`} checked={wholeCat} onChange={setWholeCat} />}
      </Sheet>
    </div>
  );
}
window.PillDetail = PillDetail;
