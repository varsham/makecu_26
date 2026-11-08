// Seed data + helpers for the Sprout app UI kit (demo only).
(function () {
  const CATEGORIES = {
    daily: { label: "Daily", color: "var(--cat-daily)", tone: "leaf" },
    vitamin: { label: "Vitamins", color: "var(--cat-vitamin)", tone: "honey" },
    heart: { label: "Heart", color: "var(--cat-heart)", tone: "rose" },
    pain: { label: "Pain relief", color: "var(--cat-pain)", tone: "apricot" },
    sleep: { label: "Sleep", color: "var(--cat-sleep)", tone: "sky" },
    other: { label: "Other", color: "var(--cat-other)", tone: "mauve" },
  };
  const ALL = [0, 1, 2, 3, 4, 5, 6];
  const seedPills = [
    { id: "p1", name: "Lisinopril", dose: "10 mg · 1 tablet", category: "heart", compartment: 1, refill: 30, dispensed: 12, days: ALL, times: ["08:00"], manual: false, pausedUntil: null },
    { id: "p2", name: "Vitamin D", dose: "1000 IU · 1 softgel", category: "vitamin", compartment: 2, refill: 30, dispensed: 24, days: ALL, times: ["08:00"], manual: false, pausedUntil: null },
    { id: "p3", name: "Metformin", dose: "500 mg · 1 tablet", category: "daily", compartment: 3, refill: 60, dispensed: 32, days: ALL, times: ["08:00", "20:00"], manual: false, pausedUntil: null },
    { id: "p4", name: "Melatonin", dose: "3 mg", category: "sleep", compartment: 4, refill: 60, dispensed: 20, days: [0, 1, 2, 3, 6], times: ["21:30"], manual: false, pausedUntil: null },
    { id: "p5", name: "Ibuprofen", dose: "200 mg · as needed", category: "pain", compartment: 5, refill: 24, dispensed: 2, days: [], times: [], manual: true, pausedUntil: null },
    { id: "p6", name: "Omega-3", dose: "1 capsule", category: "vitamin", compartment: 6, refill: 30, dispensed: 28, days: [0, 2, 4], times: ["08:00"], manual: false, pausedUntil: 18 },
  ];
  const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const fmtTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
  };
  const left = (p) => Math.max(0, p.refill - p.dispensed);
  const perDay = (p) => (p.manual ? 1 : (p.times.length * p.days.length) / 7) || 1;
  const thresholds = (p) => ({ lowAt: Math.max(7, Math.round(perDay(p) * 7)), outAt: Math.max(3, Math.round(perDay(p) * 3)) });
  const summary = (p) => {
    if (p.pausedUntil) return `Taking a break until Aug ${p.pausedUntil}`;
    if (p.manual) return "Whenever you need it";
    const d = p.days.length === 7 ? "Every day" : p.days.map((i) => DOW[i]).join(", ");
    return `${d} · ${p.times.map(fmtTime).join(", ")}`;
  };
  // Aug 2026: the 1st is a Saturday. Weekday index, Monday = 0.
  const weekdayOf = (year, month, day) => (new Date(year, month, day).getDay() + 6) % 7;
  const scheduledOn = (pills, year, month, day) =>
    pills.filter((p) => !p.manual && p.days.includes(weekdayOf(year, month, day)) && !(p.pausedUntil && month === 7 && day < p.pausedUntil));
  window.SproutData = { CATEGORIES, seedPills, DOW, fmtTime, left, thresholds, summary, weekdayOf, scheduledOn, TODAY: { year: 2026, month: 7, day: 13 } };
})();
