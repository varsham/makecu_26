# Sprout Design System

Sprout is a smart pill dispenser built for MakeCU 2026. An ESP32 turns a stepper (to pick a compartment) and a servo (to release a pill); a companion app tells it what to dispense through Firebase. This design system covers the **companion app**: picking and dispensing pills, scheduling, a "My Pills" inventory with low-stock warnings, and adding medicines by scanning a label or by hand.

## Sources
- GitHub: https://github.com/varsham/makecu_26 (branch `main`). `firmware/servo_control/` (ESP32 sketch) and `frontend/` (a single-page "Motor Control" web app + the Firebase data contract in `frontend/README.md`). The existing frontend is a plain functional test page (system font, blue accent); it defines **no visual design**. Explore the repo for the device contract before building real integrations. Nothing in the repo was modified.
- Moodboard: `assets/moodboard.png` (uploaded as "MIXED BOARD!!!.png"): paired paint-dab swatches, a hand-painted pill-and-sprout illustration, a soft-tiled monthly calendar, mossy/leafy photography, and sketchy robot character doodles. All visual decisions here come from this board.
- Live demo of the original frontend: https://sprout-makecu26.web.app

## Products
- **Sprout app** (mobile, 390pt wide). UI kit at `ui_kits/sprout-app/`. The only product surface for now.
- The physical dispenser has no screen; the app is the whole interface.

## Index
- `styles.css`: entry point (imports only) → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`
- `guidelines/`: foundation specimen cards (colors, type, spacing, radii, shadows, brand, motion)
- `assets/`: `sprout-mark.png` (pill + leaves mark, cut out of the moodboard), `moodboard.png`
- `components/`: React primitives (see below), each with `.jsx`, `.d.ts`, `.prompt.md`, and one card per folder
- `ui_kits/sprout-app/`: click-through app (Today, My Pills, Pill detail, Schedule, Add medicine) + `sproutDevice.js` Firebase adapter
- `thumbnail.html`, `SKILL.md`, `github.md`

## Components
- core: **Icon**, **Button**, **IconButton**, **Badge**, **Card**
- forms: **TextField**, **NumberStepper**, **Switch**, **RangeSlider**, **DayPicker**, **SegmentedControl**
- pills: **StockMeter**, **CompartmentTag**, **PillCard**, **PillSelectTile**
- calendar: **CalendarMonth**
- navigation: **TabBar**, **TopBar**
- feedback: **Sheet**, **Toast**

No source defined a component inventory, so this is an authored set sized to the app brief. **Intentional additions:** `Icon` wraps the Lucide CDN set so every component draws glyphs the same way.

---

## CONTENT FUNDAMENTALS
Sprout talks like a kind friend who's good at remembering things. Warm, plain, never clinical, never nagging.

- **Person:** "you" for the user; "we" for Sprout when it does work ("We'll count down from here", "We'll pick this back up automatically"). The machine is called "Sprout" ("Sprout is ready").
- **Casing:** Sentence case everywhere: titles, buttons, tabs ("My Pills" is the one proper-noun tab name). No ALL CAPS except tiny eyebrow labels.
- **Buttons:** short verbs + object: "Dispense now", "Dispense 2 pills", "I refilled this", "Take a break", "Add to my Sprout", "Save refill".
- **Confirmations celebrate a little:** "All done! 3 pills dispensed", "Refilled! 30 Vitamin D in No. 2", "That's everything for today. Nice work!"
- **Warnings stay gentle and useful:** "Time to refill soon. Vitamin D (6 left)." Not "LOW STOCK". Stock states are "Plenty left / Running low / Almost out".
- **Breaks, not skips:** pausing is "Take a break", "Your other pills stay on schedule."
- **Medical content stays factual.** Name, dose, timing are shown exactly; never joke about dosage.
- **Optional fields** are labelled "Optional", never starred.
- **Emoji:** not used. Warmth comes from words, colour and the illustration.
- Numbers: compartments are "No. 3" / mono "03"; times are "8:00 am" lowercase.

## VISUAL FOUNDATIONS
- **Colour:** four paired hues from the paint dabs, each a soft tint + deep tone: Leaf (`#CBD960`/`#617028`, the brand), Rose (`#F7A9B9`/`#CE6377`, the pill), Sky (`#BFE5F0`/`#0874A0`), Apricot (`#FCAD6A`/`#F76D0B`). Surfaces are the calendar's warm paper (`#F4F2EE`) and tiles: oat, tan, honey, mauve. Text is warm brown-grey ink (`#2B2724`), never pure black. Leaf-600 is the only solid fill for primary actions.
- **Semantic colour:** stock ok = leaf-400, low = apricot-600, almost out = rose-500, each with a tint track. Categories use tile colours (Daily lime, Vitamins honey, Heart rose, Pain apricot, Sleep sky, Other mauve). Category colour also tints the compartment tile, so the app matches what you see on the machine.
- **Type:** Fredoka (rounded display) for titles, numbers in buttons and day tiles; Figtree for body/UI; DM Mono for compartment numbers and times in lists. Titles 600 weight, body 400/600.
- **Backgrounds:** flat warm paper. No gradients, no textures, no photos in the UI. The painted sprout mark is the only illustration; the moodboard's hand-painted, slightly uneven edges are the vibe, expressed through very round corners and soft colour.
- **Signature motif:** the calendar tile: rounded rect (10px), number top-left, soft fill. Reused for day tiles, compartment tags, manual-mode pill tiles and the day picker.
- **Corners:** generous: 10 (tiles), 14 (inputs), 20 (cards), 28 (sheets), pill (buttons, chips, badges, tab highlight).
- **Cards:** white, radius 20, whisper shadow (`0 1px 2px rgba(74,60,44,.08)`), no border. Alternative: flat tint cards (honey, leaf, apricot) with no shadow for callouts. Never coloured left borders.
- **Shadows:** warm brown-tinted, low. Three levels + an inset "press" shadow.
- **Borders:** 1.5px hairlines in ink-100 on inputs and secondary buttons; focus = leaf border + 4px leaf-50 ring.
- **Motion:** soft ease (`cubic-bezier(.3,.7,.4,1)`) for sheets/fades at 200–360ms; a springy overshoot (`cubic-bezier(.34,1.4,.64,1)`) for things that "sprout": selected tiles lifting 2px, switch knobs, toasts popping in.
- **Hover/press:** press scales buttons to .97 with an inset shadow; selected tiles lift + get a 3px leaf ring. Hover is minimal (mobile-first).
- **Transparency/blur:** only the sheet scrim (ink at 32%). No glassmorphism.
- **Imagery vibe** (marketing, if any): warm, green, mossy, natural daylight, slightly grainy, per the moodboard photos.
- **Layout:** 20px screen padding, 12–16px gaps between cards, bottom tab bar fixed, large 30px titles on tab roots, 20px titles + back chevron on pushed screens. Hit targets ≥44px.

## ICONOGRAPHY
- No icon set exists in the repo or moodboard. **Substitution:** [Lucide](https://lucide.dev) via CDN (`https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js`), 2px rounded strokes, which matches the rounded chevrons and calendar glyph in the moodboard calendar. Render with the `Icon` component (`<Icon name="calendar-days" />`).
- Common glyphs: `pill`, `sparkles` (dispense), `sun`/`calendar-days` (tabs), `camera`/`scan-text` (label scan), `pause`/`play`, `package-plus` (refill), `clock`, `check`, `sprout`.
- Sizes: 16 in badges/small buttons, 18–20 inline, 22 in tab bar.
- No emoji, no unicode glyph icons. The painted sprout mark (`assets/sprout-mark.png`) is the only brand illustration; don't redraw it in SVG.
- The moodboard's hand-doodled calendar icons and robot sketches are reference for mood, not shippable assets.

## Fonts
No font files were provided. Fredoka, Figtree and DM Mono load from Google Fonts in `tokens/fonts.css`. Swap in licensed files if the team picks different faces.
