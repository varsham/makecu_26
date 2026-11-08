function PillsScreen({ pills, onOpen, onAdd }) {
  const { TopBar, IconButton, PillCard, Card, Icon } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const [filter, setFilter] = React.useState("all");
  const used = Object.keys(D.CATEGORIES).filter((k) => pills.some((p) => p.category === k));
  const shown = pills.filter((p) => filter === "all" || p.category === filter);
  const low = pills.filter((p) => !p.pausedUntil && D.left(p) <= D.thresholds(p).lowAt);
  return (
    <div>
      <TopBar large title="My Pills" eyebrow={`${pills.length} medicines in your Sprout`} actions={<IconButton icon="plus" label="Add medicine" variant="solid" onClick={onAdd} />} />
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "2px var(--screen-pad) 4px", scrollbarWidth: "none" }}>
        <window.FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
        {used.map((k) => <window.FilterChip key={k} label={D.CATEGORIES[k].label} color={D.CATEGORIES[k].color} active={filter === k} onClick={() => setFilter(k)} />)}
      </div>
      <div style={{ padding: "14px var(--screen-pad) 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {low.length > 0 && filter === "all" && (
          <Card tone="apricot" elevated={false} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Icon name="package-open" size={22} color="var(--apricot-800)" />
            <div style={{ fontSize: 14, color: "var(--apricot-800)", lineHeight: 1.45 }}>
              <b>Time to refill soon.</b> {low.map((p) => `${p.name} (${D.left(p)} left)`).join(" and ")}. Tap a pill to log a refill.
            </div>
          </Card>
        )}
        {shown.map((p) => {
          const c = D.CATEGORIES[p.category];
          const th = D.thresholds(p);
          return (
            <window.PillRow key={p.id} p={p} c={c} th={th} onOpen={() => onOpen(p.id)} />
          );
        })}
      </div>
    </div>
  );
}

function PillRow({ p, c, th, onOpen }) {
  const { PillCard } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  return (
    <PillCard name={p.name} dose={p.dose} category={c.label} categoryTone={c.tone} categoryColor={c.color} compartment={p.compartment}
      count={D.left(p)} total={p.refill} lowAt={th.lowAt} outAt={th.outAt} schedule={D.summary(p)} paused={!!p.pausedUntil} onClick={onOpen} />
  );
}
Object.assign(window, { PillsScreen, PillRow });
