Chunky draggable slider with tick labels — used for "plan ahead N weeks" on the schedule screen.
```jsx
<RangeSlider value={weeks} min={1} max={8} onChange={setWeeks} formatValue={(w) => w + "w"} />
```
