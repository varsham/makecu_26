function AddMedicine({ pills, editing, onBack, onSave }) {
  const { TopBar, Card, Button, TextField, SegmentedControl, DayPicker, NumberStepper, Switch, Badge, Icon } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const [step, setStep] = React.useState(editing ? "form" : "choose");
  const [fromScan, setFromScan] = React.useState(false);
  const blank = { name: "", dose: "", category: "daily", compartment: null, days: [0, 1, 2, 3, 4, 5, 6], times: ["08:00"], manual: false, refill: 30, dispensed: 0, pausedUntil: null };
  const [f, setF] = React.useState(editing || blank);
  const [countOn, setCountOn] = React.useState(!!editing);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const taken = pills.filter((p) => !editing || p.id !== editing.id).map((p) => p.compartment);
  const firstFree = [1, 2, 3, 4, 5, 6, 7, 8].find((n) => !taken.includes(n));
  const setTimesCount = (n) => {
    const defaults = ["08:00", "20:00", "13:00", "17:00", "22:00", "06:00"];
    setF((s) => ({ ...s, times: Array.from({ length: n }, (_, i) => s.times[i] || defaults[i]).sort() }));
  };
  const scan = () => {
    setStep("reading");
    setTimeout(() => {
      setF({ ...blank, name: "Amoxicillin", dose: "500 mg · 1 capsule", category: "other", days: [0, 1, 2, 3, 4, 5, 6], times: ["08:00", "20:00"], refill: 20, compartment: firstFree });
      setCountOn(true); setFromScan(true); setStep("form");
    }, 1600);
  };
  const label = (t, opt) => (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, color: "var(--text-strong)", marginBottom: 8 }}>
      {t}{opt && <span style={{ fontWeight: 500, color: "var(--text-muted)", fontSize: 13 }}>Optional</span>}
    </div>
  );

  if (step === "choose") return (
    <div>
      <TopBar title="Add a medicine" onBack={onBack} />
      <div style={{ padding: "0 var(--screen-pad) 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ margin: "0 0 6px", color: "var(--text-body)", lineHeight: 1.5 }}>Snap a photo of the prescription label and we'll fill things in for you. You can fix anything after.</p>
        {[["camera", "Scan a label", "Fastest — we read the name, dose and timing", "honey", () => setStep("scan")],
          ["pencil-line", "Fill it in myself", "Type everything in by hand", "oat", () => { setF({ ...blank, compartment: firstFree }); setStep("form"); }]].map(([ic, t, s, tone, fn]) => (
          <Card key={t} tone={tone} elevated={false} onClick={fn} style={{ display: "flex", alignItems: "center", gap: 14, padding: 18 }}>
            <span style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,253,249,.75)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-900)" }}><Icon name={ic} size={22} /></span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--ink-900)" }}>{t}</span>
              <span style={{ display: "block", fontSize: 14, color: "var(--ink-700)", marginTop: 2 }}>{s}</span>
            </span>
            <Icon name="chevron-right" size={20} color="var(--ink-700)" />
          </Card>
        ))}
      </div>
    </div>
  );

  if (step === "scan" || step === "reading") return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--ink-900)" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "8px 12px", color: "var(--white)" }}>
        <button onClick={() => setStep("choose")} aria-label="Close" style={{ width: 44, height: 44, border: 0, background: "transparent", color: "inherit", cursor: "pointer" }}><Icon name="x" size={24} /></button>
        <span style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18 }}>Scan a label</span>
        <span style={{ width: 44 }} />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "1.4", borderRadius: "var(--radius-lg)", background: "#3a342f", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-300)", fontSize: 14 }}>
          {[["0", "0", "top", "left"], ["0", "auto", "top", "right"], ["auto", "0", "bottom", "left"], ["auto", "auto", "bottom", "right"]].map(([, , v, h], i) => (
            <span key={i} style={{ position: "absolute", [v]: -2, [h]: -2, width: 34, height: 34, borderRadius: 10, [`border${v[0].toUpperCase() + v.slice(1)}`]: "4px solid var(--leaf-200)", [`border${h[0].toUpperCase() + h.slice(1)}`]: "4px solid var(--leaf-200)" }} />
          ))}
          {step === "reading" ? <span style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--leaf-200)", fontWeight: 600 }}><Icon name="scan-text" size={20} />Reading your label…</span> : "Line up the label inside the frame"}
        </div>
      </div>
      <div style={{ padding: "8px 0 36px", display: "flex", justifyContent: "center" }}>
        <button onClick={scan} disabled={step === "reading"} aria-label="Take photo" style={{ width: 76, height: 76, borderRadius: "50%", border: "5px solid var(--white)", background: "var(--leaf-200)", cursor: "pointer", opacity: step === "reading" ? 0.5 : 1 }} />
      </div>
    </div>
  );

  const canSave = f.name.trim() && f.compartment;
  return (
    <div>
      <TopBar title={editing ? "Edit " + editing.name : "New medicine"} onBack={editing ? onBack : () => setStep("choose")} />
      <div style={{ padding: "0 var(--screen-pad) 28px", display: "flex", flexDirection: "column", gap: 20 }}>
        {fromScan && <Card tone="leaf" elevated={false} style={{ display: "flex", gap: 10, alignItems: "center", padding: 14 }}>
          <Icon name="scan-text" size={20} color="var(--leaf-800)" /><span style={{ fontSize: 14, color: "var(--leaf-800)", fontWeight: 600 }}>Filled in from your label. Give it a quick look over.</span></Card>}
        <TextField label="Medicine name" placeholder="e.g. Vitamin D" value={f.name} onChange={(v) => set("name", v)} />
        <TextField label="Dose" optional placeholder="e.g. 500 mg · 1 tablet" value={f.dose} onChange={(v) => set("dose", v)} />
        <div>{label("Category")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.entries(D.CATEGORIES).map(([k, c]) => <window.FilterChip key={k} label={c.label} color={c.color} active={f.category === k} onClick={() => set("category", k)} />)}
          </div></div>
        <div>{label("Compartment")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(0,1fr))", gap: 6 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
              const used = taken.includes(n), on = f.compartment === n;
              return <button key={n} disabled={used} onClick={() => set("compartment", n)} style={{ aspectRatio: "0.85", borderRadius: "var(--radius-sm)", border: 0, cursor: used ? "not-allowed" : "pointer",
                fontFamily: "var(--font-mono)", fontSize: 13, background: on ? D.CATEGORIES[f.category].color : used ? "transparent" : "var(--oat)",
                boxShadow: on ? "0 0 0 2.5px var(--ink-900)" : used ? "inset 0 0 0 1.5px var(--ink-100)" : "none", color: used ? "var(--ink-300)" : "var(--ink-900)" }}>{String(n).padStart(2, "0")}</button>;
            })}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Pop the pills into this slot on your Sprout.</div></div>
        <div>{label("How often")}
          <SegmentedControl options={[{ value: "sched", label: "On a schedule" }, { value: "manual", label: "As needed" }]} value={f.manual ? "manual" : "sched"} onChange={(v) => set("manual", v === "manual")} /></div>
        {!f.manual && <>
          <div>{label("Which days")}<DayPicker value={f.days} onChange={(v) => set("days", v)} /></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>Times a day <span style={{ fontWeight: 500, color: "var(--text-muted)" }}>· optional</span></span>
            <NumberStepper value={f.times.length} min={1} max={6} onChange={setTimesCount} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {f.times.map((t, i) => <TextField key={i} type="time" icon="clock" value={t} onChange={(v) => set("times", f.times.map((x, j) => (j === i ? v : x)))} />)}
          </div>
        </>}
        <div>
          <Switch label="Count my pills" description="We'll let you know when you're running low" checked={countOn} onChange={setCountOn} />
          {countOn && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
            <span style={{ fontSize: 14, color: "var(--text-body)" }}>Pills I have right now</span>
            <NumberStepper value={f.refill - f.dispensed} min={1} max={300} onChange={(v) => setF((s) => ({ ...s, refill: v, dispensed: 0 }))} />
          </div>}
        </div>
        <Button fullWidth size="lg" icon="check" disabled={!canSave} onClick={() => onSave({ ...f, id: f.id || "p" + Date.now() })}>{editing ? "Save changes" : "Add to my Sprout"}</Button>
      </div>
    </div>
  );
}
window.AddMedicine = AddMedicine;
