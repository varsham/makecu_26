// Sprout dispenser adapter. Talks to the machine through Firebase, following the data
// contract in docs/firebase-contract.md.
//
// To dispense, the app writes /device/dispenseCompartment (1 to 3) and a new /device/trigger
// in ONE update(). The device rotates to that compartment, releases a pill, then writes
// /device/result = { trigger, compartment, dispensed } and sets /device/status
// ("ready" | "moving" | "jam"). The app never writes status or result.
//
// Default mode is "demo" (simulated) so the UI kit never moves a real machine.
// To go live: await SproutDevice.connect(firebaseConfig). index.html does this when the page
// URL ends in ?live=1.
(function () {
  const COMPARTMENTS = 3;            // the machine has 3 compartments
  const RESULT_TIMEOUT_MS = 60000;   // give up waiting for the device after 60 seconds
  const listeners = new Set();
  let status = "ready";
  let db = null, fb = null;
  const setStatus = (s) => { status = s; listeners.forEach((fn) => fn(s)); };

  // Wait until the device is not in the middle of something.
  const waitIdle = () => new Promise((res) => {
    if (status !== "moving") return res();
    const fn = (s) => { if (s !== "moving") { listeners.delete(fn); res(); } };
    listeners.add(fn);
  });

  // Wait for the device to answer one specific request (matched by the trigger value).
  function waitForResult(id) {
    return new Promise((resolve, reject) => {
      let done = false, off = null;
      const finish = (fn) => { if (done) return; done = true; clearTimeout(timer); if (off) off(); fn(); };
      const timer = setTimeout(() => finish(() => reject(new Error("Sprout didn't answer in time"))), RESULT_TIMEOUT_MS);
      off = fb.onValue(fb.ref(db, "device/result"), (snap) => {
        const r = snap.val();
        if (r && r.trigger === id) finish(() => resolve(r));
      });
      if (done) off();   // the answer arrived before `off` existed
    });
  }

  // Dispense one pill from one compartment. Resolves to { dispensed: true | false }.
  async function sendOne(compartment) {
    if (db) {
      if (compartment < 1 || compartment > COMPARTMENTS) {
        throw new Error("No. " + compartment + " doesn't exist. Sprout has " + COMPARTMENTS + " compartments.");
      }
      await waitIdle();
      const id = Date.now();
      const answer = waitForResult(id);        // start listening before sending
      answer.catch(() => {});                  // avoid an "unhandled" warning if sending fails first
      await fb.update(fb.ref(db, "device"), { dispenseCompartment: compartment, trigger: id });   // ONE update()
      const r = await answer;
      return { dispensed: !!r.dispensed };
    }
    // demo mode: pretend it worked
    setStatus("moving");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("ready");
    return { dispensed: true };
  }

  window.SproutDevice = {
    get mode() { return db ? "live" : "demo"; },
    get status() { return status; },
    onStatus(fn) { listeners.add(fn); fn(status); return () => listeners.delete(fn); },
    // compartments: array of compartment numbers, one entry per pill (repeat for 2 pills).
    // Returns one { dispensed } per pill that was tried. It stops after the first pill that
    // didn't drop, so the array can be shorter than the list. Throws if the device can't be reached.
    // Optional callbacks: onStart(n, total) fires just before pill n begins; onStep(n, total) fires after it finishes.
    async dispense(compartments, onStep, onStart) {
      const results = [];
      for (let i = 0; i < compartments.length; i++) {
        onStart && onStart(i + 1, compartments.length);
        const r = await sendOne(compartments[i]);
        results.push(r);
        onStep && onStep(i + 1, compartments.length);
        if (!r.dispensed) break;
      }
      return results;
    },
    async connect(firebaseConfig) {
      const app = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
      fb = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");
      db = fb.getDatabase(app.initializeApp(firebaseConfig));
      fb.onValue(fb.ref(db, "device/status"), (snap) => setStatus(snap.val() || "offline"));
    },
  };
})();
