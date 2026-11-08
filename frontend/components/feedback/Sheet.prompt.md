Bottom sheet that slides up over a scrim — for quick edits (pause a pill, confirm a dispense, refill).
```jsx
<div style={{position:"relative"}}><Sheet open={open} onClose={close} title="Take a break" footer={<Button fullWidth>Save</Button>}>…</Sheet></div>
```
- Must sit inside a position:relative screen container.
