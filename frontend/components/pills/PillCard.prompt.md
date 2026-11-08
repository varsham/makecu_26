The "My Pills" list item — name, dose, category, compartment, schedule summary and a stock meter.
```jsx
<PillCard name="Vitamin D" dose="1000 IU · 1 softgel" category="Vitamins" categoryTone="honey" categoryColor="var(--cat-vitamin)"
  compartment={3} count={6} total={30} schedule="Every day · 8:00 am" />
```
- paused swaps the category badge for a sky "Paused" badge and dims the card.
