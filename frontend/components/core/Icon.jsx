import React from "react";
const toPascal = (s) => s.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
export function Icon({ name, size = 20, strokeWidth = 2, color = "currentColor", style }) {
  const [, force] = React.useState(0);
  const lib = typeof window !== "undefined" ? window.lucide : null;
  React.useEffect(() => {
    if (lib) return;
    const t = setInterval(() => { if (window.lucide) { clearInterval(t); force((x) => x + 1); } }, 100);
    return () => clearInterval(t);
  }, [lib]);
  let node = lib && lib.icons && lib.icons[toPascal(name)];
  if (node && node[0] === "svg") node = node[2];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", flexShrink: 0, ...style }}>
      {(node || []).map(([tag, attrs], i) => React.createElement(tag, { ...attrs, key: i }))}
    </svg>
  );
}
