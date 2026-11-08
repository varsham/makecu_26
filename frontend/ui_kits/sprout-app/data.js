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
  const COMPARTMENT_COUNT = 3;   // the machine has 3 compartments, so at most 3 medicines
  const ALL = [0, 1, 2, 3, 4, 5, 6];
  const seedPills = [
    { id: "p1", name: "Lisinopril", dose: "10 mg · 1 tablet", category: "heart", compartment: 1, refill: 30, dispensed: 12, days: ALL, times: ["08:00"], manual: false, pausedUntil: null },
    { id: "p2", name: "Vitamin D", dose: "1000 IU · 1 softgel", category: "vitamin", compartment: 2, refill: 30, dispensed: 24, days: ALL, times: ["08:00"], manual: false, pausedUntil: null },
    { id: "p3", name: "Metformin", dose: "500 mg · 1 tablet", category: "daily", compartment: 3, refill: 60, dispensed: 32, days: ALL, times: ["08:00", "20:00"], manual: false, pausedUntil: null },
  ];
  const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const fmtTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
  };
  const left = (p) => Math.max(0, p.refill - p.dispensed);
  const perDay = (p) => (p.manual ? 1 : (p.times.length * p.days.length) / 7) || 1;
  const thresholds = (p) => ({ lowAt: Math.max(7, Math.round(perDay(p) * 7)), outAt: Math.max(3, Math.round(perDay(p) * 3)) });
  // ---- Dates. "Today" is always worked out in Eastern time, the same clock the machine uses. ----
  const pad2 = (n) => String(n).padStart(2, "0");
  const easternNow = () => {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "numeric", day: "numeric",
      hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
    const get = (type) => Number(parts.find((x) => x.type === type).value);
    return { year: get("year"), month: get("month") - 1, day: get("day"), hour: get("hour"), minute: get("minute") };   // month is 0-11, like JavaScript dates
  };
  const isoDate = (year, month, day) => `${year}-${pad2(month + 1)}-${pad2(day)}`;   // "2026-11-08"
  const todayISO = () => { const t = easternNow(); return isoDate(t.year, t.month, t.day); };
  const addDaysISO = (iso, n) => {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + n));
    return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
  };
  const fmtShortDate = (iso) => {                                                       // "Nov 15"
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  };
  const todayLabel = () => {                                                            // "Sunday, November 8"
    const t = easternNow();
    return new Date(Date.UTC(t.year, t.month, t.day)).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
  };
  const greeting = () => { const h = easternNow().hour; return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };
  // A break is stored as the date the medicine comes back ("2026-11-15"): it is paused on every day before that date.
  const isPaused = (p, year, month, day) => !!p.pausedUntil && isoDate(year, month, day) < p.pausedUntil;

  const summary = (p) => {
    if (p.pausedUntil) return `Taking a break until ${fmtShortDate(p.pausedUntil)}`;
    if (p.manual) return "Whenever you need it";
    const d = p.days.length === 7 ? "Every day" : p.days.map((i) => DOW[i]).join(", ");
    return `${d} · ${p.times.map(fmtTime).join(", ")}`;
  };
  // Weekday index of a calendar date, Monday = 0.
  const weekdayOf = (year, month, day) => (new Date(year, month, day).getDay() + 6) % 7;
  const scheduledOn = (pills, year, month, day) =>
    pills.filter((p) => !p.manual && p.days.includes(weekdayOf(year, month, day)) && !isPaused(p, year, month, day));
  window.SproutData = {
    CATEGORIES, COMPARTMENT_COUNT, seedPills, DOW, fmtTime, left, thresholds, summary, weekdayOf, scheduledOn,
    easternNow, isoDate, todayISO, addDaysISO, fmtShortDate, todayLabel, greeting, isPaused,
    get TODAY() { const t = easternNow(); return { year: t.year, month: t.month, day: t.day }; },   // the real date, in Eastern time
  };
})();
