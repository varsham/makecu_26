// Sprout dispenser adapter. Builds on the data contract in varsham/makecu_26 frontend/README.md
// without changing it: the app writes /device/{stepperTarget, servoAngle, trigger} in ONE update()
// and only READS /device/status ("ready" | "moving").
//
// Default mode is "demo" (simulated) so the UI kit never moves a real machine.
// To go live: await SproutDevice.connect(firebaseConfig) — same config as frontend/index.html.
(function () {
  const COMPARTMENTS = 8;      // assumption: 8 compartments evenly spaced on one stepper turn
  const SERVO_DROP = 90;       // assumption: servo angle that releases a pill; confirm with firmware owner
  const listeners = new Set();
  let status = "ready";
  let db = null, fb = null;
  const setStatus = (s) => { status = s; listeners.forEach((fn) => fn(s)); };

  // Compartment 1..N → even stepper position 0..1022 (1024 = one full turn)
  const compartmentToStepper = (n) => {
    let v = Math.round(((n - 1) * 1024) / COMPARTMENTS);
    v -= v % 2;
    return Math.min(Math.max(v, 0), 1022);
  };

  const waitReady = () => new Promise((res) => {
    if (status === "ready") return res();
    const fn = (s) => { if (s === "ready") { listeners.delete(fn); res(); } };
    listeners.add(fn);
  });

  async function sendOne(compartment) {
    const payload = { stepperTarget: compartmentToStepper(compartment), servoAngle: SERVO_DROP, trigger: Date.now() };
    if (db) {
      await fb.update(fb.ref(db, "device"), payload); // one update() — never write status
      await new Promise((r) => setTimeout(r, 400));
      await waitReady();
    } else {
      setStatus("moving");
      await new Promise((r) => setTimeout(r, 900));
      setStatus("ready");
    }
  }

  window.SproutDevice = {
    get mode() { return db ? "live" : "demo"; },
    get status() { return status; },
    onStatus(fn) { listeners.add(fn); fn(status); return () => listeners.delete(fn); },
    compartmentToStepper,
    // compartments: array of compartment numbers, one entry per pill (repeat for 2 pills)
    async dispense(compartments, onStep) {
      for (let i = 0; i < compartments.length; i++) {
        await waitReady();
        await sendOne(compartments[i]);
        onStep && onStep(i + 1, compartments.length);
      }
    },
    async connect(firebaseConfig) {
      const app = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
      fb = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");
      db = fb.getDatabase(app.initializeApp(firebaseConfig));
      fb.onValue(fb.ref(db, "device/status"), (snap) => setStatus(snap.val() || "offline"));
    },
  };
})();
