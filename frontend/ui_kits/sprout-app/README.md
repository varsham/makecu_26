# Sprout app — UI kit

Click-through recreation of the Sprout companion app (390×844 phone). Composes the design-system components from `window.SproutDesignSystem_50f72c`.

Screens
- `TodayScreen.jsx` — next scheduled dose + **Manual mode** (pick pill tiles → Dispense)
- `PillsScreen.jsx` — **My Pills**: category filters, low-stock banner, PillCards
- `PillDetail.jsx` — compartment, stock since refill, schedule summary, "I refilled this" sheet, "Take a break" sheet (one pill or whole category)
- `ScheduleScreen.jsx` — "Plan ahead" week slider (1–8) driving the calendar range; tap a day for its doses
- `AddMedicine.jsx` — scan a label (simulated OCR) or fill in by hand; edit mode reuses the form
- `App.jsx` — phone shell, tabs, routing, toasts. `Bits.jsx` — small kit-only helpers.

Data & device
- `data.js` — seed pills, categories, schedule helpers (today is fixed to Thu Aug 13 2026).
- `sproutDevice.js` — adapter for the dispenser. Uses the existing Firebase contract from `varsham/makecu_26/frontend/README.md` unchanged (one `update()` of `stepperTarget`/`servoAngle`/`trigger`; read-only `status`). Runs simulated by default; `SproutDevice.connect(firebaseConfig)` goes live.
- Assumptions to confirm with the firmware owner: 8 compartments evenly spaced on one stepper turn, and servo angle 90 releases one pill.
