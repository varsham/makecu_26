Bar showing pills left since the last refill, coloured leaf → apricot → rose as stock drops.
```jsx
<StockMeter count={6} total={30} />
<StockMeter count={22} total={30} compact />
```
- Thresholds: lowAt (default 7), outAt (default 3). Ideally derive lowAt from daily usage × 7 days.
