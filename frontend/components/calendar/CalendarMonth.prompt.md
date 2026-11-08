Monday-first month grid of rounded, softly-coloured day tiles (the moodboard calendar) with dose dots per day.
```jsx
<CalendarMonth year={2026} month={7} today={12} selected={12} rangeEnd={new Date(2026,7,30)}
  days={{ 12: { tone: "honey", dots: ["var(--cat-vitamin)","var(--cat-heart)"] } }} onSelect={setDay} />
```
- Days past rangeEnd render as hairline outlines — tie rangeEnd to the "plan ahead" slider.
