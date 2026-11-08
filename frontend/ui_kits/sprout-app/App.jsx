function App() {
  const { TabBar, Toast } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const [pills, setPills] = React.useState(D.seedPills);
  const [tab, setTab] = React.useState(() => localStorage.getItem("sprout-kit-tab") || "today");
  const [route, setRoute] = React.useState(null);
  const [toast, setToast] = React.useState({ m: "", icon: "check", visible: false });
  const [status, setStatus] = React.useState("ready");
  const [taken, setTaken] = React.useState([]);
  const scroller = React.useRef(null);
  const timer = React.useRef(null);
  React.useEffect(() => window.SproutDevice.onStatus(setStatus), []);
  React.useEffect(() => { localStorage.setItem("sprout-kit-tab", tab); }, [tab]);
  React.useEffect(() => { if (scroller.current) scroller.current.scrollTop = 0; }, [tab, route && route.name]);
  const showToast = (m, icon = "check") => {
    clearTimeout(timer.current);
    setToast({ m, icon, visible: true });
    timer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2600);
  };
  const update = (p) => setPills((ps) => ps.map((x) => (x.id === p.id ? p : x)));
  const dispense = async (list, msg, time) => {
    await window.SproutDevice.dispense(list.map((p) => p.compartment));
    setPills((ps) => ps.map((p) => (list.some((x) => x.id === p.id) ? { ...p, dispensed: p.dispensed + 1 } : p)));
    if (time) setTaken((t) => [...t, time]);
    showToast(msg, "check");
  };
  let screen;
  if (route && route.name === "detail") {
    const p = pills.find((x) => x.id === route.id);
    screen = <window.PillDetail pill={p} pills={pills} onBack={() => setRoute(null)} onEdit={() => setRoute({ name: "edit", id: p.id })} onUpdate={update} toast={showToast}
      onPauseCategory={(cat, until) => setPills((ps) => ps.map((x) => (x.category === cat ? { ...x, pausedUntil: until } : x)))} />;
  } else if (route && (route.name === "add" || route.name === "edit")) {
    const editing = route.name === "edit" ? pills.find((x) => x.id === route.id) : null;
    screen = <window.AddMedicine pills={pills} editing={editing} onBack={() => setRoute(editing ? { name: "detail", id: editing.id } : null)}
      onSave={(p) => {
        if (editing) { update(p); setRoute({ name: "detail", id: p.id }); showToast("Saved! " + p.name + " is updated", "check"); }
        else { setPills((ps) => [...ps, p]); setRoute(null); setTab("pills"); showToast(p.name + " is all set in No. " + p.compartment, "sprout"); }
      }} />;
  } else if (tab === "today") screen = <window.TodayScreen pills={pills} deviceStatus={status} onDispense={dispense} takenTimes={taken} />;
  else if (tab === "pills") screen = <window.PillsScreen pills={pills} onOpen={(id) => setRoute({ name: "detail", id })} onAdd={() => setRoute({ name: "add" })} />;
  else screen = <window.ScheduleScreen pills={pills} />;
  const tabs = [{ id: "today", label: "Today", icon: "sun" }, { id: "pills", label: "My Pills", icon: "pill" }, { id: "schedule", label: "Schedule", icon: "calendar-days" }];
  return (
    <div style={{ width: 390, height: 844, borderRadius: 52, padding: 10, background: "#2B2724", boxShadow: "0 30px 80px rgba(74,60,44,.28)", flexShrink: 0 }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 42, overflow: "hidden", background: "var(--bg-app)", display: "flex", flexDirection: "column" }}>
        <window.StatusBar />
        <div ref={scroller} style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{screen}</div>
        {!route && <TabBar items={tabs} value={tab} onChange={(t) => { setTab(t); setRoute(null); }} />}
        <div style={{ position: "absolute", left: 16, right: 16, bottom: route ? 30 : 104, display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 60 }}>
          <Toast message={toast.m} icon={toast.icon} visible={toast.visible} />
        </div>
      </div>
    </div>
  );
}
window.App = App;
