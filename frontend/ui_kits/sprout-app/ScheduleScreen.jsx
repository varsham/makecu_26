function ScheduleScreen({ pills }) {
  const { TopBar, Card, RangeSlider, CalendarMonth, Icon } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const T = D.TODAY;
  const [weeks, setWeeks] = React.useState(4);
  const [ym, setYm] = React.useState({ y: T.year, m: T.month });
  const [sel, setSel] = React.useState(T.day);
  const start = new Date(T.year, T.month, T.day);
  const end = new Date(start.getTime() + weeks * 7 * 864e5 - 864e5);
  const isCur = ym.y === T.year && ym.m === T.month;
  const tones = ["oat", "tan", "oat", "honey", "mauve", "oat", "honey"];
  const n = new Date(ym.y, ym.m + 1, 0).getDate();
  const days = {};
  for (let d = 1; d <= n; d++) {
    const dt = new Date(ym.y, ym.m, d);
    if (dt < start || dt > end) { days[d] = { tone: dt < start ? "paper-2" : undefined }; continue; }
    const list = D.scheduledOn(pills, ym.y, ym.m, d);
    const cats = [...new Set(list.map((p) => p.category))];
    const paused = pills.some((p) => p.pausedUntil && ym.m === 7 && d < p.pausedUntil && p.days.includes(D.weekdayOf(ym.y, ym.m, d)));
    days[d] = { tone: tones[D.weekdayOf(ym.y, ym.m, d)], dots: cats.map((k) => D.CATEGORIES[k].color), paused };
  }
  const shift = (k) => { const m = ym.m + k; setYm({ y: ym.y + Math.floor(m / 12), m: (m + 12) % 12 }); setSel(null); };
  const selList = sel ? D.scheduledOn(pills, ym.y, ym.m, sel) : [];
  const selDate = sel ? new Date(ym.y, ym.m, sel) : null;
  const selInRange = selDate && selDate >= start && selDate <= end;
  const byTime = {};
  selList.forEach((p) => p.times.forEach((t) => (byTime[t] = byTime[t] || []).push(p)));
  const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <div>
      <TopBar large title="Schedule" eyebrow="Your Sprout plan" />
      <div style={{ padding: "0 var(--screen-pad) 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, color: "var(--text-strong)" }}>Plan ahead</span>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{weeks} {weeks === 1 ? "week" : "weeks"} · until {endLabel}</span>
          </div>
          <RangeSlider value={weeks} min={1} max={8} onChange={setWeeks} formatValue={(w) => w + "w"} />
        </Card>
        <Card style={{ padding: 14 }}>
          <CalendarMonth year={ym.y} month={ym.m} days={days} today={isCur ? T.day : undefined} selected={sel}
            rangeEnd={end} onSelect={setSel} onPrev={() => shift(-1)} onNext={() => shift(1)} />
        </Card>
        {sel && selInRange && (
          <Card style={{ padding: 18 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, color: "var(--text-strong)", marginBottom: 8 }}>
              {selDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            {Object.keys(byTime).sort().map((t) => (
              <div key={t} style={{ display: "flex", gap: 14, padding: "10px 0", borderTop: "1px solid var(--border-soft)" }}>
                <span style={{ width: 64, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", paddingTop: 2 }}>{D.fmtTime(t)}</span>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  {byTime[t].map((p) => (
                    <span key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, color: "var(--text-strong)" }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: D.CATEGORIES[p.category].color }} />{p.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {!selList.length && <div style={{ color: "var(--text-muted)", fontSize: 14, display: "flex", gap: 8, alignItems: "center" }}><Icon name="coffee" size={16} />A rest day. Nothing scheduled.</div>}
          </Card>
        )}
      </div>
    </div>
  );
}
window.ScheduleScreen = ScheduleScreen;
