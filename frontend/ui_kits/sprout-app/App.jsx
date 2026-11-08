function App() {
  const { TabBar, Toast } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const dev = window.SproutDevice;
  const live = dev.wantsLive;                      // the address ends in ?live=1: use the real machine and the saved medicines
  // Live mode starts empty and loads the saved medicines. It never shows or saves the demo pills,
  // because anything saved here is also what the machine dispenses.
  const [pills, setPills] = React.useState(live ? [] : D.seedPills);
  const [pillsLoaded, setPillsLoaded] = React.useState(!live);
  const lastSynced = React.useRef(null);           // the last medicine list we sent or received, to avoid saving the same thing again
  const [tab, setTab] = React.useState(() => localStorage.getItem("sprout-kit-tab") || "today");
  const [route, setRoute] = React.useState(null);
  const [toast, setToast] = React.useState({ m: "", icon: "check", visible: false });
  const [status, setStatus] = React.useState("ready");
  const [taken, setTaken] = React.useState([]);    // demo mode: dose times given by hand
  const [doneRemote, setDoneRemote] = React.useState({});   // live mode: what the machine says it did today
  const [todayKey, setTodayKey] = React.useState(D.todayISO());
  const scroller = React.useRef(null);
  const timer = React.useRef(null);
  React.useEffect(() => window.SproutDevice.onStatus(setStatus), []);

  // Live mode: load the saved medicines, and pick up changes made anywhere else.
  React.useEffect(() => {
    if (!live) return;
    let stopped = false, off = null;
    dev.onReady(() => {
      if (stopped) return;
      off = dev.subscribePills((remote) => {
        lastSynced.current = JSON.stringify(remote);
        setPills(remote);
        setPillsLoaded(true);
      });
    });
    return () => { stopped = true; if (off) off(); };
  }, []);

  // Live mode: save changes. Never before the first load, or an empty list would erase the saved medicines.
  React.useEffect(() => {
    if (!live || !pillsLoaded) return;
    const json = JSON.stringify(pills);
    if (json === lastSynced.current) return;       // that is exactly what we just received or saved
    lastSynced.current = json;
    dev.savePills(pills).catch((e) => showToast("Couldn't save: " + e.message, "x"));
  }, [pills, pillsLoaded]);

  // Keep "today" right across midnight, and (live mode) follow which dose times the machine has already handled today.
  React.useEffect(() => { const id = setInterval(() => setTodayKey(D.todayISO()), 30000); return () => clearInterval(id); }, []);
  React.useEffect(() => {
    if (!live) return;
    let stopped = false, off = null;
    dev.onReady(() => { if (!stopped) off = dev.subscribeDone(todayKey, setDoneRemote); });
    return () => { stopped = true; if (off) off(); setDoneRemote({}); };
  }, [todayKey]);
  // "0800" -> "08:00". A time counts as taken once the machine has dispensed it, or is dispensing it right now.
  const takenTimes = live
    ? Object.keys(doneRemote).filter((k) => doneRemote[k] === "ok" || doneRemote[k] === "dispensing").map((k) => k.slice(0, 2) + ":" + k.slice(2))
    : taken;
  React.useEffect(() => { localStorage.setItem("sprout-kit-tab", tab); }, [tab]);
  React.useEffect(() => { if (scroller.current) scroller.current.scrollTop = 0; }, [tab, route && route.name]);
  // sticky = true keeps the message on screen until the next toast replaces it (used for progress).
  const showToast = (m, icon = "check", sticky = false) => {
    clearTimeout(timer.current);
    setToast({ m, icon, visible: true });
    if (!sticky) timer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2600);
  };
  const update = (p) => setPills((ps) => ps.map((x) => (x.id === p.id ? p : x)));
  const dispense = async (list, msg, time) => {
    let results;
    try {
      results = await window.SproutDevice.dispense(list.map((p) => p.compartment), null, (n, total) => {
        // progress message while each pill is being dispensed, e.g. "Dispensing 2 of 3: Vitamin D"
        const name = list[n - 1].name;
        showToast(total === 1 ? "Dispensing " + name + "…" : "Dispensing " + n + " of " + total + ": " + name, "pill", true);
      });
    } catch (e) {
      showToast(e.message || "Sprout couldn't be reached", "x");
      return;
    }
    // results[i] is the outcome for list[i]. It can be shorter than the list if a pill got stuck.
    const ok = list.map((p, i) => !!(results[i] && results[i].dispensed));
    setPills((ps) => ps.map((p) => {
      const i = list.findIndex((x) => x.id === p.id);
      return i >= 0 && ok[i] ? { ...p, dispensed: p.dispensed + 1 } : p;   // only count pills that really dropped
    }));
    if (ok.every(Boolean)) {
      if (time) {
        setTaken((t) => [...t, time]);
        if (live) dev.markDone(D.todayISO(), time).catch(() => {});   // tell the machine, so it doesn't dispense this time again
      }
      showToast(msg, "check");
    } else {
      showToast("Something got stuck. Please check Sprout.", "x");
    }
  };
  let screen;
  if (route && route.name === "detail") {
    const p = pills.find((x) => x.id === route.id);
    screen = <window.PillDetail pill={p} pills={pills} onBack={() => setRoute(null)} onEdit={() => setRoute({ name: "edit", id: p.id })} onUpdate={update} toast={showToast}
      onDelete={(gone) => { setPills((ps) => ps.filter((x) => x.id !== gone.id)); setRoute(null); showToast(gone.name + " was removed. Compartment " + gone.compartment + " is free", "check"); }}
      onPauseCategory={(cat, until) => setPills((ps) => ps.map((x) => (x.category === cat ? { ...x, pausedUntil: until } : x)))} />;
  } else if (route && (route.name === "add" || route.name === "edit")) {
    const editing = route.name === "edit" ? pills.find((x) => x.id === route.id) : null;
    screen = <window.AddMedicine pills={pills} editing={editing} onBack={() => setRoute(editing ? { name: "detail", id: editing.id } : null)}
      onSave={(p) => {
        if (editing) { update(p); setRoute({ name: "detail", id: p.id }); showToast("Saved! " + p.name + " is updated", "check"); }
        else { setPills((ps) => [...ps, p]); setRoute(null); setTab("pills"); showToast(p.name + " is all set in No. " + p.compartment, "sprout"); }
      }} />;
  } else if (tab === "today") screen = <window.TodayScreen pills={pills} deviceStatus={status} onDispense={dispense} takenTimes={takenTimes} />;
  else if (tab === "pills") screen = <window.PillsScreen pills={pills} onOpen={(id) => setRoute({ name: "detail", id })} onAdd={() => (pills.length >= D.COMPARTMENT_COUNT ? showToast("All " + D.COMPARTMENT_COUNT + " compartments are full", "x") : setRoute({ name: "add" }))} />;
  else screen = <window.ScheduleScreen pills={pills} />;
  const tabs = [{ id: "today", label: "Today", icon: "sun" }, { id: "pills", label: "My Pills", icon: "pill" }, { id: "schedule", label: "Schedule", icon: "calendar-days" }];
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 480, height: "100%", overflow: "hidden", background: "var(--bg-app)", display: "flex", flexDirection: "column" }}>
      <div ref={scroller} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingTop: 20 }}>{screen}</div>
      {!route && <TabBar items={tabs} value={tab} onChange={(t) => { setTab(t); setRoute(null); }} />}
      <div style={{ position: "absolute", left: 16, right: 16, bottom: route ? 30 : 104, display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 60 }}>
        <Toast message={toast.m} icon={toast.icon} visible={toast.visible} />
      </div>
    </div>
  );
}
window.App = App;
