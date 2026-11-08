/* @ds-bundle: {"format":4,"namespace":"SproutDesignSystem_50f72c","components":[{"name":"CalendarMonth","sourcePath":"components/calendar/CalendarMonth.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Sheet","sourcePath":"components/feedback/Sheet.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"DayPicker","sourcePath":"components/forms/DayPicker.jsx"},{"name":"NumberStepper","sourcePath":"components/forms/NumberStepper.jsx"},{"name":"RangeSlider","sourcePath":"components/forms/RangeSlider.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"TopBar","sourcePath":"components/navigation/TopBar.jsx"},{"name":"CompartmentTag","sourcePath":"components/pills/CompartmentTag.jsx"},{"name":"PillCard","sourcePath":"components/pills/PillCard.jsx"},{"name":"PillSelectTile","sourcePath":"components/pills/PillSelectTile.jsx"},{"name":"StockMeter","sourcePath":"components/pills/StockMeter.jsx"}],"sourceHashes":{"components/calendar/CalendarMonth.jsx":"4e778bfa957b","components/core/Badge.jsx":"c21dc162f8b3","components/core/Button.jsx":"023c8becf1a1","components/core/Card.jsx":"9321d5ccda1a","components/core/Icon.jsx":"6531f0a4ecbd","components/core/IconButton.jsx":"b05d6ca304d6","components/feedback/Sheet.jsx":"b2bfbacddbc8","components/feedback/Toast.jsx":"24d24bf354be","components/forms/DayPicker.jsx":"1bc52e8c93f5","components/forms/NumberStepper.jsx":"40d7ad2c5a18","components/forms/RangeSlider.jsx":"37af6754834a","components/forms/SegmentedControl.jsx":"299e54605a63","components/forms/Switch.jsx":"1c952be7fe7b","components/forms/TextField.jsx":"68d0226aa510","components/navigation/TabBar.jsx":"d0bea0ecef98","components/navigation/TopBar.jsx":"0eb72bd9e259","components/pills/CompartmentTag.jsx":"b5f57a4825bf","components/pills/PillCard.jsx":"b9d622ae3286","components/pills/PillSelectTile.jsx":"c7e6de79775f","components/pills/StockMeter.jsx":"ab35f1ec53b0","ui_kits/sprout-app/AddMedicine.jsx":"4eb6f0756930","ui_kits/sprout-app/App.jsx":"1b7704065760","ui_kits/sprout-app/Bits.jsx":"3d2ff19e5af0","ui_kits/sprout-app/PillDetail.jsx":"ffed6be30a35","ui_kits/sprout-app/PillsScreen.jsx":"dd6837aaf23f","ui_kits/sprout-app/ScheduleScreen.jsx":"79ca042caa02","ui_kits/sprout-app/TodayScreen.jsx":"d473d66804d1","ui_kits/sprout-app/data.js":"021d056daeac","ui_kits/sprout-app/sproutDevice.js":"8496108db544"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SproutDesignSystem_50f72c = window.SproutDesignSystem_50f72c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Card.jsx
try { (() => {
const TONES = {
  white: "var(--surface-card)",
  paper: "var(--surface-sunken)",
  oat: "var(--oat)",
  tan: "var(--tan)",
  honey: "var(--honey)",
  mauve: "var(--mauve)",
  leaf: "var(--leaf-50)",
  rose: "var(--rose-50)",
  sky: "var(--sky-50)",
  apricot: "var(--apricot-50)"
};
function Card({
  children,
  tone = "white",
  padding = 16,
  onClick,
  elevated = true,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    role: onClick ? "button" : undefined,
    style: {
      background: TONES[tone] || tone,
      borderRadius: "var(--radius-lg)",
      padding,
      boxShadow: elevated && tone === "white" ? "var(--shadow-1)" : "none",
      cursor: onClick ? "pointer" : undefined,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
const toPascal = s => s.split("-").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("");
function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  color = "currentColor",
  style
}) {
  const [, force] = React.useState(0);
  const lib = typeof window !== "undefined" ? window.lucide : null;
  React.useEffect(() => {
    if (lib) return;
    const t = setInterval(() => {
      if (window.lucide) {
        clearInterval(t);
        force(x => x + 1);
      }
    }, 100);
    return () => clearInterval(t);
  }, [lib]);
  let node = lib && lib.icons && lib.icons[toPascal(name)];
  if (node && node[0] === "svg") node = node[2];
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      display: "block",
      flexShrink: 0,
      ...style
    }
  }, (node || []).map(([tag, attrs], i) => React.createElement(tag, {
    ...attrs,
    key: i
  })));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/calendar/CalendarMonth.jsx
try { (() => {
const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function CalendarMonth({
  year,
  month,
  days = {},
  today,
  selected,
  rangeEnd,
  onSelect,
  onPrev,
  onNext
}) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const n = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= n; d++) cells.push(d);
  const inRange = d => !rangeEnd || new Date(year, month, d) <= rangeEnd;
  const iconBtn = (name, fn, label) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: fn,
    "aria-label": label,
    style: {
      width: 40,
      height: 40,
      border: 0,
      background: "transparent",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--ink-900)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: name,
    size: 22
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      color: "var(--ink-900)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 22,
      fontWeight: 500
    }
  }, MONTHS[month], " ", year), iconBtn("chevron-left", onPrev, "Previous month"), iconBtn("chevron-right", onNext, "Next month")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7, minmax(0,1fr))",
      gap: 6
    }
  }, DOW.map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      textAlign: "center",
      fontSize: 13,
      fontWeight: 500,
      color: "var(--ink-700)",
      paddingBottom: 6
    }
  }, d)), cells.map((d, i) => {
    if (!d) return /*#__PURE__*/React.createElement("div", {
      key: "e" + i
    });
    const info = days[d] || {};
    const active = inRange(d);
    const isSel = selected === d,
      isToday = today === d;
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      type: "button",
      onClick: () => onSelect && onSelect(d),
      disabled: !active,
      style: {
        aspectRatio: "0.82",
        border: 0,
        borderRadius: "var(--radius-sm)",
        padding: "5px 6px",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: active ? info.tone ? `var(--${info.tone})` : "var(--oat)" : "transparent",
        boxShadow: isSel ? "0 0 0 2.5px var(--ink-900)" : !active ? "inset 0 0 0 1.5px var(--ink-100)" : "none",
        cursor: active ? "pointer" : "default",
        color: active ? "var(--ink-900)" : "var(--ink-300)",
        fontFamily: "inherit",
        transition: "box-shadow var(--dur-fast)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: 4
      }
    }, d, isToday && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "var(--accent)"
      }
    })), active && info.dots && /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 3
      }
    }, info.dots.map((c, k) => /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: c,
        boxShadow: "0 0 0 1px rgba(43,39,36,.15)"
      }
    }))), active && info.paused && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "pause",
      size: 12
    }));
  })));
}
Object.assign(__ds_scope, { CalendarMonth });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/calendar/CalendarMonth.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const TONES = {
  leaf: ["var(--leaf-50)", "var(--leaf-800)", "var(--leaf-400)"],
  rose: ["var(--rose-50)", "var(--rose-700)", "var(--rose-500)"],
  sky: ["var(--sky-50)", "var(--sky-800)", "var(--sky-600)"],
  apricot: ["var(--apricot-50)", "var(--apricot-800)", "var(--apricot-600)"],
  honey: ["#F8EBD0", "#7A5A1E", "var(--honey)"],
  mauve: ["#EEEAEA", "var(--ink-700)", "var(--mauve)"],
  neutral: ["var(--surface-sunken)", "var(--text-body)", "var(--ink-300)"]
};
function Badge({
  children,
  tone = "neutral",
  icon,
  dot,
  style
}) {
  const [bg, fg, dc] = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 26,
      padding: "0 10px",
      borderRadius: "var(--radius-pill)",
      background: bg,
      color: fg,
      fontFamily: "var(--font-body)",
      fontSize: 13,
      fontWeight: 600,
      whiteSpace: "nowrap",
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: dc
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const VARIANTS = {
  primary: {
    bg: "var(--brand)",
    fg: "var(--text-on-accent)",
    bd: "transparent",
    sh: "var(--shadow-2)"
  },
  secondary: {
    bg: "var(--surface-card)",
    fg: "var(--text-strong)",
    bd: "var(--border-soft)",
    sh: "var(--shadow-1)"
  },
  soft: {
    bg: "var(--brand-soft)",
    fg: "var(--leaf-800)",
    bd: "transparent",
    sh: "none"
  },
  ghost: {
    bg: "transparent",
    fg: "var(--brand)",
    bd: "transparent",
    sh: "none"
  },
  danger: {
    bg: "var(--accent-soft)",
    fg: "var(--rose-700)",
    bd: "transparent",
    sh: "none"
  }
};
const SIZES = {
  sm: {
    h: 36,
    px: 14,
    fs: 14,
    ic: 16
  },
  md: {
    h: 44,
    px: 20,
    fs: 16,
    ic: 18
  },
  lg: {
    h: 56,
    px: 26,
    fs: 18,
    ic: 22
  }
};
function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  fullWidth,
  disabled,
  onClick,
  type = "button",
  style
}) {
  const [pressed, setPressed] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      display: fullWidth ? "flex" : "inline-flex",
      width: fullWidth ? "100%" : undefined,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      height: s.h,
      padding: `0 ${s.px}px`,
      borderRadius: "var(--radius-pill)",
      border: `1.5px solid ${v.bd}`,
      background: v.bg,
      color: v.fg,
      boxShadow: pressed ? "var(--shadow-press)" : v.sh,
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: s.fs,
      letterSpacing: ".01em",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transform: pressed && !disabled ? "scale(.97)" : "none",
      transition: "transform var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast)",
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.ic
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.ic
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  label,
  variant = "plain",
  size = 44,
  onClick,
  disabled,
  style
}) {
  const V = {
    plain: {
      bg: "transparent",
      fg: "var(--text-strong)"
    },
    soft: {
      bg: "var(--surface-sunken)",
      fg: "var(--text-strong)"
    },
    solid: {
      bg: "var(--brand)",
      fg: "var(--text-on-accent)"
    },
    card: {
      bg: "var(--surface-card)",
      fg: "var(--text-strong)"
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    title: label,
    onClick: onClick,
    disabled: disabled,
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      border: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: V.bg,
      color: V.fg,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      boxShadow: variant === "card" ? "var(--shadow-1)" : "none",
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.48)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Sheet.jsx
try { (() => {
function Sheet({
  open,
  onClose,
  title,
  children,
  footer
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 50,
      pointerEvents: open ? "auto" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--scrim)",
      opacity: open ? 1 : 0,
      transition: "opacity var(--dur-base) var(--ease-soft)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-label": title,
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      maxHeight: "88%",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-app)",
      borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
      boxShadow: "var(--shadow-3)",
      transform: open ? "translateY(0)" : "translateY(105%)",
      transition: "transform var(--dur-slow) var(--ease-soft)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 5,
      borderRadius: 99,
      background: "var(--ink-100)",
      margin: "10px auto 0"
    }
  }), title && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      padding: "8px 12px 4px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 20,
      color: "var(--text-strong)"
    }
  }, title), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "auto",
      padding: "8px 20px 20px",
      fontFamily: "var(--font-body)"
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 20px 28px",
      borderTop: "1px solid var(--border-soft)"
    }
  }, footer)));
}
Object.assign(__ds_scope, { Sheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Sheet.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  message,
  icon = "sprout",
  visible = true,
  tone = "dark"
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 16px",
      borderRadius: "var(--radius-pill)",
      background: dark ? "var(--ink-900)" : "var(--surface-card)",
      color: dark ? "var(--white)" : "var(--text-strong)",
      boxShadow: "var(--shadow-3)",
      fontFamily: "var(--font-body)",
      fontSize: 15,
      fontWeight: 600,
      width: "max-content",
      maxWidth: "100%",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(.96)",
      transition: "all var(--dur-slow) var(--ease-sprout)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: "var(--leaf-200)",
      color: "var(--leaf-800)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })), message);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/DayPicker.jsx
try { (() => {
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
function DayPicker({
  value = [],
  onChange,
  size = 40
}) {
  const toggle = i => {
    if (!onChange) return;
    onChange(value.includes(i) ? value.filter(d => d !== i) : [...value, i].sort());
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 6
    }
  }, DAYS.map((d, i) => {
    const on = value.includes(i);
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      type: "button",
      "aria-pressed": on,
      onClick: () => toggle(i),
      style: {
        width: size,
        height: size + 4,
        borderRadius: "var(--radius-sm)",
        border: 0,
        cursor: "pointer",
        background: on ? "var(--brand)" : "var(--oat)",
        color: on ? "var(--white)" : "var(--ink-700)",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 14,
        transition: "all var(--dur-base) var(--ease-sprout)",
        transform: on ? "translateY(-2px)" : "none",
        boxShadow: on ? "var(--shadow-2)" : "none"
      }
    }, d);
  }));
}
Object.assign(__ds_scope, { DayPicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/DayPicker.jsx", error: String((e && e.message) || e) }); }

// components/forms/NumberStepper.jsx
try { (() => {
function NumberStepper({
  value = 0,
  min = 0,
  max = 999,
  step = 1,
  onChange,
  unit,
  size = "md"
}) {
  const h = size === "sm" ? 36 : 44;
  const set = n => onChange && onChange(Math.max(min, Math.min(max, n)));
  const btn = (icon, d, dis) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: dis,
    onClick: () => set(value + d),
    "aria-label": icon,
    style: {
      width: h,
      height: h,
      borderRadius: "50%",
      border: 0,
      background: "var(--surface-card)",
      color: "var(--text-strong)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: dis ? "not-allowed" : "pointer",
      opacity: dis ? 0.35 : 1,
      boxShadow: "var(--shadow-1)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18
  }));
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: 4,
      borderRadius: "var(--radius-pill)",
      background: "var(--surface-sunken)"
    }
  }, btn("minus", -step, value <= min), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 44,
      textAlign: "center",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 18,
      color: "var(--text-strong)"
    }
  }, value, unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 500,
      fontSize: 13,
      color: "var(--text-muted)",
      marginLeft: 4
    }
  }, unit)), btn("plus", step, value >= max));
}
Object.assign(__ds_scope, { NumberStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/NumberStepper.jsx", error: String((e && e.message) || e) }); }

// components/forms/RangeSlider.jsx
try { (() => {
function RangeSlider({
  value,
  min = 1,
  max = 8,
  step = 1,
  onChange,
  formatValue,
  showTicks = true
}) {
  const ref = React.useRef(null);
  const pct = (value - min) / (max - min) * 100;
  const fromX = x => {
    const r = ref.current.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (x - r.left) / r.width));
    const v = Math.round((min + t * (max - min)) / step) * step;
    if (v !== value && onChange) onChange(v);
  };
  const ticks = [];
  for (let v = min; v <= max; v += step) ticks.push(v);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      userSelect: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onPointerDown: e => {
      e.currentTarget.setPointerCapture(e.pointerId);
      fromX(e.clientX);
    },
    onPointerMove: e => {
      if (e.buttons) fromX(e.clientX);
    },
    style: {
      position: "relative",
      height: 44,
      cursor: "pointer",
      touchAction: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 17,
      height: 10,
      borderRadius: 99,
      background: "var(--surface-sunken)",
      boxShadow: "inset 0 0 0 1px var(--border-soft)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      width: pct + "%",
      top: 17,
      height: 10,
      borderRadius: 99,
      background: "var(--leaf-200)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: `calc(${pct}% - 16px)`,
      top: 6,
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "var(--brand)",
      border: "4px solid var(--white)",
      boxShadow: "var(--shadow-2)",
      boxSizing: "border-box"
    }
  })), showTicks && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0 6px",
      fontSize: 12,
      color: "var(--text-muted)",
      fontWeight: 600
    }
  }, ticks.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      color: t === value ? "var(--brand)" : undefined
    }
  }, formatValue ? formatValue(t) : t))));
}
Object.assign(__ds_scope, { RangeSlider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RangeSlider.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
function SegmentedControl({
  options = [],
  value,
  onChange,
  fullWidth = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: fullWidth ? "flex" : "inline-flex",
      padding: 4,
      gap: 4,
      borderRadius: "var(--radius-pill)",
      background: "var(--surface-sunken)",
      boxShadow: "inset 0 0 0 1px var(--border-soft)"
    }
  }, options.map(o => {
    const opt = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    const on = opt.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: opt.value,
      type: "button",
      onClick: () => onChange && onChange(opt.value),
      style: {
        flex: fullWidth ? 1 : undefined,
        height: 38,
        padding: "0 16px",
        borderRadius: "var(--radius-pill)",
        border: 0,
        cursor: "pointer",
        background: on ? "var(--surface-card)" : "transparent",
        boxShadow: on ? "var(--shadow-2)" : "none",
        color: on ? "var(--text-strong)" : "var(--text-muted)",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 15,
        transition: "all var(--dur-base) var(--ease-soft)"
      }
    }, opt.label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  label,
  description,
  disabled
}) {
  const knob = /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": !!checked,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      position: "relative",
      width: 50,
      height: 30,
      borderRadius: 99,
      flexShrink: 0,
      cursor: disabled ? "not-allowed" : "pointer",
      background: checked ? "var(--brand)" : "var(--ink-100)",
      transition: "background var(--dur-base) var(--ease-soft)",
      opacity: disabled ? 0.45 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 3,
      left: checked ? 23 : 3,
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: "var(--white)",
      boxShadow: "var(--shadow-2)",
      transition: "left var(--dur-base) var(--ease-sprout)"
    }
  }));
  if (!label) return knob;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: "var(--text-strong)"
    }
  }, label), description && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)",
      marginTop: 2
    }
  }, description)), knob);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function TextField({
  label,
  hint,
  optional,
  value,
  onChange,
  placeholder,
  icon,
  suffix,
  type = "text",
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      fontFamily: "var(--font-body)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-strong)"
    }
  }, label, optional && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: "var(--text-muted)",
      fontSize: 13
    }
  }, "Optional")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      height: 50,
      padding: "0 16px",
      borderRadius: "var(--radius-md)",
      background: "var(--surface-card)",
      border: `1.5px solid ${focus ? "var(--brand)" : "var(--border-soft)"}`,
      boxShadow: focus ? "0 0 0 4px var(--brand-soft)" : "none",
      transition: "all var(--dur-fast)"
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    placeholder: placeholder,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 0,
      background: "transparent",
      fontFamily: "inherit",
      fontSize: 16,
      color: "var(--text-strong)"
    }
  }), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      fontSize: 14
    }
  }, suffix)), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, hint));
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
function TabBar({
  items = [],
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      justifyContent: "space-around",
      padding: "8px 10px 26px",
      background: "var(--surface-card)",
      borderTop: "1px solid var(--border-soft)"
    }
  }, items.map(it => {
    const on = it.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      type: "button",
      onClick: () => onChange && onChange(it.id),
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        border: 0,
        background: "transparent",
        cursor: "pointer",
        padding: "4px 0",
        color: on ? "var(--leaf-800)" : "var(--text-muted)",
        fontFamily: "var(--font-body)",
        fontSize: 12,
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 56,
        height: 32,
        borderRadius: 99,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: on ? "var(--leaf-200)" : "transparent",
        transition: "background var(--dur-base) var(--ease-soft)"
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 22
    })), it.label);
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TopBar.jsx
try { (() => {
function TopBar({
  title,
  eyebrow,
  onBack,
  actions,
  large
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px var(--screen-pad) 12px",
      minHeight: 56
    }
  }, onBack && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "chevron-left",
    label: "Back",
    onClick: onBack,
    style: {
      marginLeft: -10
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-muted)",
      marginBottom: 2
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: large ? 30 : 20,
      lineHeight: 1.15,
      color: "var(--text-strong)"
    }
  }, title)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, actions));
}
Object.assign(__ds_scope, { TopBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TopBar.jsx", error: String((e && e.message) || e) }); }

// components/pills/CompartmentTag.jsx
try { (() => {
function CompartmentTag({
  number,
  color = "var(--oat)",
  size = "md"
}) {
  const s = size === "sm" ? 28 : 36;
  return /*#__PURE__*/React.createElement("span", {
    title: "Compartment " + number,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: s,
      height: s,
      borderRadius: "var(--radius-sm)",
      background: color,
      color: "var(--ink-900)",
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: size === "sm" ? 12 : 14,
      flexShrink: 0
    }
  }, String(number).padStart(2, "0"));
}
Object.assign(__ds_scope, { CompartmentTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/pills/CompartmentTag.jsx", error: String((e && e.message) || e) }); }

// components/pills/PillSelectTile.jsx
try { (() => {
function PillSelectTile({
  name,
  compartment,
  color = "var(--oat)",
  count,
  selected,
  disabled,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-pressed": !!selected,
    disabled: disabled,
    onClick: onToggle,
    style: {
      position: "relative",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: 10,
      minHeight: 112,
      padding: 12,
      borderRadius: "var(--radius-md)",
      border: 0,
      cursor: disabled ? "not-allowed" : "pointer",
      background: color,
      opacity: disabled ? 0.45 : 1,
      boxShadow: selected ? "0 0 0 3px var(--brand), var(--shadow-2)" : "none",
      transform: selected ? "translateY(-2px)" : "none",
      transition: "all var(--dur-base) var(--ease-sprout)",
      fontFamily: "var(--font-body)",
      color: "var(--ink-900)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      fontWeight: 500
    }
  }, String(compartment).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: selected ? "var(--brand)" : "rgba(255,253,249,.7)",
      color: "var(--white)",
      transition: "background var(--dur-fast)"
    }
  }, selected && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 15,
    strokeWidth: 3
  }))), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: 1.2
    }
  }, name), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 12,
      fontWeight: 500,
      marginTop: 2,
      color: "var(--ink-700)"
    }
  }, count, " left")));
}
Object.assign(__ds_scope, { PillSelectTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/pills/PillSelectTile.jsx", error: String((e && e.message) || e) }); }

// components/pills/StockMeter.jsx
try { (() => {
function StockMeter({
  count,
  total,
  lowAt = 7,
  outAt = 3,
  compact,
  style
}) {
  const level = count <= outAt ? "out" : count <= lowAt ? "low" : "ok";
  const label = {
    ok: "Plenty left",
    low: "Running low",
    out: "Almost out"
  }[level];
  const pct = Math.max(4, Math.min(100, count / Math.max(total, 1) * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      minWidth: compact ? 72 : 160,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 8,
      marginBottom: 6
    }
  }, !compact && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: `var(--stock-${level})`
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: compact ? 16 : 15,
      color: "var(--text-strong)",
      marginLeft: compact ? "auto" : 0
    }
  }, count, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 500,
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, " left"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 99,
      background: `var(--stock-${level}-soft)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: pct + "%",
      borderRadius: 99,
      background: `var(--stock-${level})`,
      transition: "width var(--dur-slow) var(--ease-soft)"
    }
  })));
}
Object.assign(__ds_scope, { StockMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/pills/StockMeter.jsx", error: String((e && e.message) || e) }); }

// components/pills/PillCard.jsx
try { (() => {
function PillCard({
  name,
  dose,
  category,
  categoryColor = "var(--oat)",
  categoryTone = "neutral",
  compartment,
  count,
  total,
  lowAt,
  outAt,
  schedule,
  paused,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    role: onClick ? "button" : undefined,
    style: {
      background: "var(--surface-card)",
      borderRadius: "var(--radius-lg)",
      padding: 16,
      boxShadow: "var(--shadow-1)",
      cursor: onClick ? "pointer" : undefined,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      opacity: paused ? 0.72 : 1,
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, compartment != null && /*#__PURE__*/React.createElement(__ds_scope.CompartmentTag, {
    number: compartment,
    color: categoryColor
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 18,
      color: "var(--text-strong)",
      lineHeight: 1.2
    }
  }, name), dose && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--text-muted)",
      marginTop: 2
    }
  }, dose)), paused ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "sky",
    icon: "pause"
  }, "Paused") : category && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: categoryTone,
    dot: true
  }, category)), schedule && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 14,
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "clock",
    size: 16,
    color: "var(--text-muted)"
  }), schedule), count != null && /*#__PURE__*/React.createElement(__ds_scope.StockMeter, {
    count: count,
    total: total || count,
    lowAt: lowAt,
    outAt: outAt
  }));
}
Object.assign(__ds_scope, { PillCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/pills/PillCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sprout-app/AddMedicine.jsx
try { (() => {
function AddMedicine({
  pills,
  editing,
  onBack,
  onSave
}) {
  const {
    TopBar,
    Card,
    Button,
    TextField,
    SegmentedControl,
    DayPicker,
    NumberStepper,
    Switch,
    Badge,
    Icon
  } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const [step, setStep] = React.useState(editing ? "form" : "choose");
  const [fromScan, setFromScan] = React.useState(false);
  const blank = {
    name: "",
    dose: "",
    category: "daily",
    compartment: null,
    days: [0, 1, 2, 3, 4, 5, 6],
    times: ["08:00"],
    manual: false,
    refill: 30,
    dispensed: 0,
    pausedUntil: null
  };
  const [f, setF] = React.useState(editing || blank);
  const [countOn, setCountOn] = React.useState(!!editing);
  const set = (k, v) => setF(s => ({
    ...s,
    [k]: v
  }));
  const taken = pills.filter(p => !editing || p.id !== editing.id).map(p => p.compartment);
  const firstFree = [1, 2, 3, 4, 5, 6, 7, 8].find(n => !taken.includes(n));
  const setTimesCount = n => {
    const defaults = ["08:00", "20:00", "13:00", "17:00", "22:00", "06:00"];
    setF(s => ({
      ...s,
      times: Array.from({
        length: n
      }, (_, i) => s.times[i] || defaults[i]).sort()
    }));
  };
  const scan = () => {
    setStep("reading");
    setTimeout(() => {
      setF({
        ...blank,
        name: "Amoxicillin",
        dose: "500 mg · 1 capsule",
        category: "other",
        days: [0, 1, 2, 3, 4, 5, 6],
        times: ["08:00", "20:00"],
        refill: 20,
        compartment: firstFree
      });
      setCountOn(true);
      setFromScan(true);
      setStep("form");
    }, 1600);
  };
  const label = (t, opt) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-strong)",
      marginBottom: 8
    }
  }, t, opt && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: "var(--text-muted)",
      fontSize: 13
    }
  }, "Optional"));
  if (step === "choose") return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopBar, {
    title: "Add a medicine",
    onBack: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--screen-pad) 24px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 6px",
      color: "var(--text-body)",
      lineHeight: 1.5
    }
  }, "Snap a photo of the prescription label and we'll fill things in for you. You can fix anything after."), [["camera", "Scan a label", "Fastest — we read the name, dose and timing", "honey", () => setStep("scan")], ["pencil-line", "Fill it in myself", "Type everything in by hand", "oat", () => {
    setF({
      ...blank,
      compartment: firstFree
    });
    setStep("form");
  }]].map(([ic, t, s, tone, fn]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    tone: tone,
    elevated: false,
    onClick: fn,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: "50%",
      background: "rgba(255,253,249,.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--ink-900)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 22
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 18,
      color: "var(--ink-900)"
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 14,
      color: "var(--ink-700)",
      marginTop: 2
    }
  }, s)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 20,
    color: "var(--ink-700)"
  })))));
  if (step === "scan" || step === "reading") return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--ink-900)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      padding: "8px 12px",
      color: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep("choose"),
    "aria-label": "Close",
    style: {
      width: 44,
      height: 44,
      border: 0,
      background: "transparent",
      color: "inherit",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 24
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "center",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 18
    }
  }, "Scan a label"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: "1.4",
      borderRadius: "var(--radius-lg)",
      background: "#3a342f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--ink-300)",
      fontSize: 14
    }
  }, [["0", "0", "top", "left"], ["0", "auto", "top", "right"], ["auto", "0", "bottom", "left"], ["auto", "auto", "bottom", "right"]].map(([,, v, h], i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      [v]: -2,
      [h]: -2,
      width: 34,
      height: 34,
      borderRadius: 10,
      [`border${v[0].toUpperCase() + v.slice(1)}`]: "4px solid var(--leaf-200)",
      [`border${h[0].toUpperCase() + h.slice(1)}`]: "4px solid var(--leaf-200)"
    }
  })), step === "reading" ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      color: "var(--leaf-200)",
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "scan-text",
    size: 20
  }), "Reading your label\u2026") : "Line up the label inside the frame")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0 36px",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: scan,
    disabled: step === "reading",
    "aria-label": "Take photo",
    style: {
      width: 76,
      height: 76,
      borderRadius: "50%",
      border: "5px solid var(--white)",
      background: "var(--leaf-200)",
      cursor: "pointer",
      opacity: step === "reading" ? 0.5 : 1
    }
  })));
  const canSave = f.name.trim() && f.compartment;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopBar, {
    title: editing ? "Edit " + editing.name : "New medicine",
    onBack: editing ? onBack : () => setStep("choose")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--screen-pad) 28px",
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, fromScan && /*#__PURE__*/React.createElement(Card, {
    tone: "leaf",
    elevated: false,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "scan-text",
    size: 20,
    color: "var(--leaf-800)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--leaf-800)",
      fontWeight: 600
    }
  }, "Filled in from your label. Give it a quick look over.")), /*#__PURE__*/React.createElement(TextField, {
    label: "Medicine name",
    placeholder: "e.g. Vitamin D",
    value: f.name,
    onChange: v => set("name", v)
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Dose",
    optional: true,
    placeholder: "e.g. 500 mg \xB7 1 tablet",
    value: f.dose,
    onChange: v => set("dose", v)
  }), /*#__PURE__*/React.createElement("div", null, label("Category"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, Object.entries(D.CATEGORIES).map(([k, c]) => /*#__PURE__*/React.createElement(window.FilterChip, {
    key: k,
    label: c.label,
    color: c.color,
    active: f.category === k,
    onClick: () => set("category", k)
  })))), /*#__PURE__*/React.createElement("div", null, label("Compartment"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(8, minmax(0,1fr))",
      gap: 6
    }
  }, [1, 2, 3, 4, 5, 6, 7, 8].map(n => {
    const used = taken.includes(n),
      on = f.compartment === n;
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      disabled: used,
      onClick: () => set("compartment", n),
      style: {
        aspectRatio: "0.85",
        borderRadius: "var(--radius-sm)",
        border: 0,
        cursor: used ? "not-allowed" : "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        background: on ? D.CATEGORIES[f.category].color : used ? "transparent" : "var(--oat)",
        boxShadow: on ? "0 0 0 2.5px var(--ink-900)" : used ? "inset 0 0 0 1.5px var(--ink-100)" : "none",
        color: used ? "var(--ink-300)" : "var(--ink-900)"
      }
    }, String(n).padStart(2, "0"));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)",
      marginTop: 6
    }
  }, "Pop the pills into this slot on your Sprout.")), /*#__PURE__*/React.createElement("div", null, label("How often"), /*#__PURE__*/React.createElement(SegmentedControl, {
    options: [{
      value: "sched",
      label: "On a schedule"
    }, {
      value: "manual",
      label: "As needed"
    }],
    value: f.manual ? "manual" : "sched",
    onChange: v => set("manual", v === "manual")
  })), !f.manual && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, label("Which days"), /*#__PURE__*/React.createElement(DayPicker, {
    value: f.days,
    onChange: v => set("days", v)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-strong)"
    }
  }, "Times a day ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: "var(--text-muted)"
    }
  }, "\xB7 optional")), /*#__PURE__*/React.createElement(NumberStepper, {
    value: f.times.length,
    min: 1,
    max: 6,
    onChange: setTimesCount
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, f.times.map((t, i) => /*#__PURE__*/React.createElement(TextField, {
    key: i,
    type: "time",
    icon: "clock",
    value: t,
    onChange: v => set("times", f.times.map((x, j) => j === i ? v : x))
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Switch, {
    label: "Count my pills",
    description: "We'll let you know when you're running low",
    checked: countOn,
    onChange: setCountOn
  }), countOn && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--text-body)"
    }
  }, "Pills I have right now"), /*#__PURE__*/React.createElement(NumberStepper, {
    value: f.refill - f.dispensed,
    min: 1,
    max: 300,
    onChange: v => setF(s => ({
      ...s,
      refill: v,
      dispensed: 0
    }))
  }))), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    icon: "check",
    disabled: !canSave,
    onClick: () => onSave({
      ...f,
      id: f.id || "p" + Date.now()
    })
  }, editing ? "Save changes" : "Add to my Sprout")));
}
window.AddMedicine = AddMedicine;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sprout-app/AddMedicine.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sprout-app/App.jsx
try { (() => {
function App() {
  const {
    TabBar,
    Toast
  } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const [pills, setPills] = React.useState(D.seedPills);
  const [tab, setTab] = React.useState(() => localStorage.getItem("sprout-kit-tab") || "today");
  const [route, setRoute] = React.useState(null);
  const [toast, setToast] = React.useState({
    m: "",
    icon: "check",
    visible: false
  });
  const [status, setStatus] = React.useState("ready");
  const [taken, setTaken] = React.useState([]);
  const scroller = React.useRef(null);
  const timer = React.useRef(null);
  React.useEffect(() => window.SproutDevice.onStatus(setStatus), []);
  React.useEffect(() => {
    localStorage.setItem("sprout-kit-tab", tab);
  }, [tab]);
  React.useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0;
  }, [tab, route && route.name]);
  const showToast = (m, icon = "check") => {
    clearTimeout(timer.current);
    setToast({
      m,
      icon,
      visible: true
    });
    timer.current = setTimeout(() => setToast(t => ({
      ...t,
      visible: false
    })), 2600);
  };
  const update = p => setPills(ps => ps.map(x => x.id === p.id ? p : x));
  const dispense = async (list, msg, time) => {
    await window.SproutDevice.dispense(list.map(p => p.compartment));
    setPills(ps => ps.map(p => list.some(x => x.id === p.id) ? {
      ...p,
      dispensed: p.dispensed + 1
    } : p));
    if (time) setTaken(t => [...t, time]);
    showToast(msg, "check");
  };
  let screen;
  if (route && route.name === "detail") {
    const p = pills.find(x => x.id === route.id);
    screen = /*#__PURE__*/React.createElement(window.PillDetail, {
      pill: p,
      pills: pills,
      onBack: () => setRoute(null),
      onEdit: () => setRoute({
        name: "edit",
        id: p.id
      }),
      onUpdate: update,
      toast: showToast,
      onPauseCategory: (cat, until) => setPills(ps => ps.map(x => x.category === cat ? {
        ...x,
        pausedUntil: until
      } : x))
    });
  } else if (route && (route.name === "add" || route.name === "edit")) {
    const editing = route.name === "edit" ? pills.find(x => x.id === route.id) : null;
    screen = /*#__PURE__*/React.createElement(window.AddMedicine, {
      pills: pills,
      editing: editing,
      onBack: () => setRoute(editing ? {
        name: "detail",
        id: editing.id
      } : null),
      onSave: p => {
        if (editing) {
          update(p);
          setRoute({
            name: "detail",
            id: p.id
          });
          showToast("Saved! " + p.name + " is updated", "check");
        } else {
          setPills(ps => [...ps, p]);
          setRoute(null);
          setTab("pills");
          showToast(p.name + " is all set in No. " + p.compartment, "sprout");
        }
      }
    });
  } else if (tab === "today") screen = /*#__PURE__*/React.createElement(window.TodayScreen, {
    pills: pills,
    deviceStatus: status,
    onDispense: dispense,
    takenTimes: taken
  });else if (tab === "pills") screen = /*#__PURE__*/React.createElement(window.PillsScreen, {
    pills: pills,
    onOpen: id => setRoute({
      name: "detail",
      id
    }),
    onAdd: () => setRoute({
      name: "add"
    })
  });else screen = /*#__PURE__*/React.createElement(window.ScheduleScreen, {
    pills: pills
  });
  const tabs = [{
    id: "today",
    label: "Today",
    icon: "sun"
  }, {
    id: "pills",
    label: "My Pills",
    icon: "pill"
  }, {
    id: "schedule",
    label: "Schedule",
    icon: "calendar-days"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 844,
      borderRadius: 52,
      padding: 10,
      background: "#2B2724",
      boxShadow: "0 30px 80px rgba(74,60,44,.28)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      borderRadius: 42,
      overflow: "hidden",
      background: "var(--bg-app)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(window.StatusBar, null), /*#__PURE__*/React.createElement("div", {
    ref: scroller,
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden"
    }
  }, screen), !route && /*#__PURE__*/React.createElement(TabBar, {
    items: tabs,
    value: tab,
    onChange: t => {
      setTab(t);
      setRoute(null);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      right: 16,
      bottom: route ? 30 : 104,
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 60
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    message: toast.m,
    icon: toast.icon,
    visible: toast.visible
  }))));
}
window.App = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sprout-app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sprout-app/Bits.jsx
try { (() => {
const {
  Icon: KIcon
} = window.SproutDesignSystem_50f72c;
function SectionLabel({
  children,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      margin: "22px 0 10px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 18,
      color: "var(--text-strong)"
    }
  }, children), action);
}
function FilterChip({
  label,
  color,
  active,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 36,
      padding: "0 14px",
      borderRadius: 99,
      flexShrink: 0,
      cursor: "pointer",
      border: active ? "1.5px solid var(--ink-900)" : "1.5px solid var(--border-soft)",
      background: active ? "var(--ink-900)" : "var(--surface-card)",
      color: active ? "var(--white)" : "var(--text-body)",
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: 14
    }
  }, color && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: color
    }
  }), label);
}
function DeviceStatus({
  status
}) {
  const moving = status === "moving";
  const ok = status === "ready";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 32,
      padding: "0 12px 0 10px",
      borderRadius: 99,
      background: "var(--surface-card)",
      boxShadow: "var(--shadow-1)",
      fontFamily: "var(--font-body)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: "50%",
      background: moving ? "var(--apricot-600)" : ok ? "var(--leaf-400)" : "var(--ink-300)"
    }
  }), moving ? "Sprout is dispensing…" : ok ? "Sprout is ready" : "Sprout is offline");
}
function StatusBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "6px 30px 0 34px",
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: 16,
      color: "var(--ink-900)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "signal",
    size: 17
  }), /*#__PURE__*/React.createElement(KIcon, {
    name: "wifi",
    size: 17
  }), /*#__PURE__*/React.createElement(KIcon, {
    name: "battery-full",
    size: 22
  })));
}
Object.assign(window, {
  SectionLabel,
  FilterChip,
  DeviceStatus,
  StatusBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sprout-app/Bits.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sprout-app/PillDetail.jsx
try { (() => {
function PillDetail({
  pill: p,
  pills,
  onBack,
  onEdit,
  onUpdate,
  onPauseCategory,
  toast
}) {
  const {
    TopBar,
    IconButton,
    Card,
    Badge,
    Button,
    StockMeter,
    CompartmentTag,
    Sheet,
    NumberStepper,
    Switch,
    Icon
  } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const c = D.CATEGORIES[p.category];
  const th = D.thresholds(p);
  const [sheet, setSheet] = React.useState(null);
  const [refillN, setRefillN] = React.useState(p.refill);
  const [breakDays, setBreakDays] = React.useState(3);
  const [wholeCat, setWholeCat] = React.useState(false);
  const sameCat = pills.filter(x => x.category === p.category).length;
  const row = (icon, label, value) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 0",
      borderTop: "1px solid var(--border-soft)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: "var(--text-muted)",
      fontSize: 14
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: "var(--text-strong)",
      fontSize: 15,
      textAlign: "right"
    }
  }, value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: p.name,
    onBack: onBack,
    actions: /*#__PURE__*/React.createElement(IconButton, {
      icon: "pencil",
      label: "Edit",
      onClick: onEdit
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--screen-pad) 24px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Card, {
    tone: "white",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: "var(--radius-md)",
      background: c.color,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "var(--ink-700)"
    }
  }, "No."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 22,
      color: "var(--ink-900)",
      lineHeight: 1
    }
  }, String(p.compartment).padStart(2, "0"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      color: "var(--text-muted)"
    }
  }, p.dose), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginTop: 6,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: c.tone,
    dot: true
  }, c.label), p.pausedUntil && /*#__PURE__*/React.createElement(Badge, {
    tone: "sky",
    icon: "pause"
  }, "Paused"))))), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement(StockMeter, {
    count: D.left(p),
    total: p.refill,
    lowAt: th.lowAt,
    outAt: th.outAt
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--text-muted)",
      margin: "10px 0 14px"
    }
  }, p.dispensed, " dispensed since you refilled ", p.refill, "."), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    variant: "soft",
    icon: "package-plus",
    onClick: () => setSheet("refill")
  }, "I refilled this")), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: "6px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 17,
      padding: "10px 0",
      color: "var(--text-strong)"
    }
  }, "Schedule"), row("repeat", "How often", p.manual ? "As needed" : p.days.length === 7 ? "Every day" : p.days.map(i => D.DOW[i]).join(" ")), row("clock", "When", p.manual ? "Manual" : p.times.map(D.fmtTime).join(", ")), row("pill", "Per day", p.manual ? "—" : `${p.times.length}×`)), p.pausedUntil ? /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    variant: "secondary",
    icon: "play",
    onClick: () => {
      onUpdate({
        ...p,
        pausedUntil: null
      });
      toast("Welcome back! " + p.name + " is on again", "play");
    }
  }, "Resume now") : /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    variant: "secondary",
    icon: "pause",
    onClick: () => setSheet("break")
  }, "Take a break")), /*#__PURE__*/React.createElement(Sheet, {
    open: sheet === "refill",
    onClose: () => setSheet(null),
    title: "Log a refill",
    footer: /*#__PURE__*/React.createElement(Button, {
      fullWidth: true,
      size: "lg",
      onClick: () => {
        onUpdate({
          ...p,
          refill: refillN,
          dispensed: 0
        });
        setSheet(null);
        toast("Refilled! " + refillN + " " + p.name + " in No. " + p.compartment, "package-check");
      }
    }, "Save refill")
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 18px",
      color: "var(--text-body)",
      lineHeight: 1.5
    }
  }, "How many pills did you put into compartment ", p.compartment, "? We'll count down from here."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(NumberStepper, {
    value: refillN,
    min: 1,
    max: 200,
    onChange: setRefillN,
    unit: "pills"
  }))), /*#__PURE__*/React.createElement(Sheet, {
    open: sheet === "break",
    onClose: () => setSheet(null),
    title: "Take a break",
    footer: /*#__PURE__*/React.createElement(Button, {
      fullWidth: true,
      size: "lg",
      icon: "pause",
      onClick: () => {
        const until = 13 + breakDays;
        if (wholeCat) onPauseCategory(p.category, until);else onUpdate({
          ...p,
          pausedUntil: until
        });
        setSheet(null);
        toast(`Paused ${wholeCat ? "all " + c.label.toLowerCase() : p.name} until Aug ${until}`, "pause");
      }
    }, "Pause for ", breakDays, " ", breakDays === 1 ? "day" : "days")
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 18px",
      color: "var(--text-body)",
      lineHeight: 1.5
    }
  }, "Your other pills stay on schedule. We'll pick this back up automatically."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: "var(--text-strong)"
    }
  }, "How long?"), /*#__PURE__*/React.createElement(NumberStepper, {
    value: breakDays,
    min: 1,
    max: 30,
    onChange: setBreakDays,
    unit: "days"
  })), sameCat > 1 && /*#__PURE__*/React.createElement(Switch, {
    label: `Pause all ${c.label.toLowerCase()}`,
    description: `${sameCat} pills in this category`,
    checked: wholeCat,
    onChange: setWholeCat
  })));
}
window.PillDetail = PillDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sprout-app/PillDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sprout-app/PillsScreen.jsx
try { (() => {
function PillsScreen({
  pills,
  onOpen,
  onAdd
}) {
  const {
    TopBar,
    IconButton,
    PillCard,
    Card,
    Icon
  } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const [filter, setFilter] = React.useState("all");
  const used = Object.keys(D.CATEGORIES).filter(k => pills.some(p => p.category === k));
  const shown = pills.filter(p => filter === "all" || p.category === filter);
  const low = pills.filter(p => !p.pausedUntil && D.left(p) <= D.thresholds(p).lowAt);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopBar, {
    large: true,
    title: "My Pills",
    eyebrow: `${pills.length} medicines in your Sprout`,
    actions: /*#__PURE__*/React.createElement(IconButton, {
      icon: "plus",
      label: "Add medicine",
      variant: "solid",
      onClick: onAdd
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      overflowX: "auto",
      padding: "2px var(--screen-pad) 4px",
      scrollbarWidth: "none"
    }
  }, /*#__PURE__*/React.createElement(window.FilterChip, {
    label: "All",
    active: filter === "all",
    onClick: () => setFilter("all")
  }), used.map(k => /*#__PURE__*/React.createElement(window.FilterChip, {
    key: k,
    label: D.CATEGORIES[k].label,
    color: D.CATEGORIES[k].color,
    active: filter === k,
    onClick: () => setFilter(k)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px var(--screen-pad) 24px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, low.length > 0 && filter === "all" && /*#__PURE__*/React.createElement(Card, {
    tone: "apricot",
    elevated: false,
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "package-open",
    size: 22,
    color: "var(--apricot-800)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--apricot-800)",
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement("b", null, "Time to refill soon."), " ", low.map(p => `${p.name} (${D.left(p)} left)`).join(" and "), ". Tap a pill to log a refill.")), shown.map(p => {
    const c = D.CATEGORIES[p.category];
    const th = D.thresholds(p);
    return /*#__PURE__*/React.createElement(window.PillRow, {
      key: p.id,
      p: p,
      c: c,
      th: th,
      onOpen: () => onOpen(p.id)
    });
  })));
}
function PillRow({
  p,
  c,
  th,
  onOpen
}) {
  const {
    PillCard
  } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  return /*#__PURE__*/React.createElement(PillCard, {
    name: p.name,
    dose: p.dose,
    category: c.label,
    categoryTone: c.tone,
    categoryColor: c.color,
    compartment: p.compartment,
    count: D.left(p),
    total: p.refill,
    lowAt: th.lowAt,
    outAt: th.outAt,
    schedule: D.summary(p),
    paused: !!p.pausedUntil,
    onClick: onOpen
  });
}
Object.assign(window, {
  PillsScreen,
  PillRow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sprout-app/PillsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sprout-app/ScheduleScreen.jsx
try { (() => {
function ScheduleScreen({
  pills
}) {
  const {
    TopBar,
    Card,
    RangeSlider,
    CalendarMonth,
    Icon
  } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const T = D.TODAY;
  const [weeks, setWeeks] = React.useState(4);
  const [ym, setYm] = React.useState({
    y: T.year,
    m: T.month
  });
  const [sel, setSel] = React.useState(T.day);
  const start = new Date(T.year, T.month, T.day);
  const end = new Date(start.getTime() + weeks * 7 * 864e5 - 864e5);
  const isCur = ym.y === T.year && ym.m === T.month;
  const tones = ["oat", "tan", "oat", "honey", "mauve", "oat", "honey"];
  const n = new Date(ym.y, ym.m + 1, 0).getDate();
  const days = {};
  for (let d = 1; d <= n; d++) {
    const dt = new Date(ym.y, ym.m, d);
    if (dt < start || dt > end) {
      days[d] = {
        tone: dt < start ? "paper-2" : undefined
      };
      continue;
    }
    const list = D.scheduledOn(pills, ym.y, ym.m, d);
    const cats = [...new Set(list.map(p => p.category))];
    const paused = pills.some(p => p.pausedUntil && ym.m === 7 && d < p.pausedUntil && p.days.includes(D.weekdayOf(ym.y, ym.m, d)));
    days[d] = {
      tone: tones[D.weekdayOf(ym.y, ym.m, d)],
      dots: cats.map(k => D.CATEGORIES[k].color),
      paused
    };
  }
  const shift = k => {
    const m = ym.m + k;
    setYm({
      y: ym.y + Math.floor(m / 12),
      m: (m + 12) % 12
    });
    setSel(null);
  };
  const selList = sel ? D.scheduledOn(pills, ym.y, ym.m, sel) : [];
  const selDate = sel ? new Date(ym.y, ym.m, sel) : null;
  const selInRange = selDate && selDate >= start && selDate <= end;
  const byTime = {};
  selList.forEach(p => p.times.forEach(t => (byTime[t] = byTime[t] || []).push(p)));
  const endLabel = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopBar, {
    large: true,
    title: "Schedule",
    eyebrow: "Your Sprout plan"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--screen-pad) 24px",
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 17,
      color: "var(--text-strong)"
    }
  }, "Plan ahead"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, weeks, " ", weeks === 1 ? "week" : "weeks", " \xB7 until ", endLabel)), /*#__PURE__*/React.createElement(RangeSlider, {
    value: weeks,
    min: 1,
    max: 8,
    onChange: setWeeks,
    formatValue: w => w + "w"
  })), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(CalendarMonth, {
    year: ym.y,
    month: ym.m,
    days: days,
    today: isCur ? T.day : undefined,
    selected: sel,
    rangeEnd: end,
    onSelect: setSel,
    onPrev: () => shift(-1),
    onNext: () => shift(1)
  })), sel && selInRange && /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 17,
      color: "var(--text-strong)",
      marginBottom: 8
    }
  }, selDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  })), Object.keys(byTime).sort().map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      gap: 14,
      padding: "10px 0",
      borderTop: "1px solid var(--border-soft)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 64,
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "var(--text-muted)",
      paddingTop: 2
    }
  }, D.fmtTime(t)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, byTime[t].map(p => /*#__PURE__*/React.createElement("span", {
    key: p.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontWeight: 600,
      color: "var(--text-strong)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: D.CATEGORIES[p.category].color
    }
  }), p.name))))), !selList.length && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-muted)",
      fontSize: 14,
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "coffee",
    size: 16
  }), "A rest day. Nothing scheduled."))));
}
window.ScheduleScreen = ScheduleScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sprout-app/ScheduleScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sprout-app/TodayScreen.jsx
try { (() => {
function TodayScreen({
  pills,
  deviceStatus,
  onDispense,
  takenTimes
}) {
  const {
    TopBar,
    Card,
    Button,
    PillSelectTile,
    Icon,
    Badge
  } = window.SproutDesignSystem_50f72c;
  const D = window.SproutData;
  const [sel, setSel] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const {
    year,
    month,
    day
  } = D.TODAY;
  const today = D.scheduledOn(pills, year, month, day);
  const slots = {};
  today.forEach(p => p.times.forEach(t => {
    (slots[t] = slots[t] || []).push(p);
  }));
  const times = Object.keys(slots).sort();
  const next = times.find(t => !takenTimes.includes(t));
  const toggle = id => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const run = async (list, label, time) => {
    setBusy(true);
    await onDispense(list, label, time);
    setBusy(false);
    setSel([]);
  };
  const greeting = "Good morning";
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopBar, {
    large: true,
    eyebrow: "Thursday, August 13",
    title: greeting
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--screen-pad) 24px"
    }
  }, /*#__PURE__*/React.createElement(window.DeviceStatus, {
    status: deviceStatus
  }), next ? /*#__PURE__*/React.createElement(Card, {
    style: {
      marginTop: 16,
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-muted)"
    }
  }, "Up next"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 26,
      color: "var(--text-strong)"
    }
  }, D.fmtTime(next))), /*#__PURE__*/React.createElement(Badge, {
    tone: "leaf",
    icon: "pill"
  }, slots[next].length, " ", slots[next].length === 1 ? "pill" : "pills")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      margin: "14px 0 16px"
    }
  }, slots[next].map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: D.CATEGORIES[p.category].color
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontWeight: 600,
      color: "var(--text-strong)"
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      fontSize: 14
    }
  }, "No. ", p.compartment)))), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    icon: "sparkles",
    disabled: busy || deviceStatus === "moving",
    onClick: () => run(slots[next], "Your " + D.fmtTime(next) + " pills are ready", next)
  }, "Dispense now")) : /*#__PURE__*/React.createElement(Card, {
    tone: "leaf",
    style: {
      marginTop: 16,
      display: "flex",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sprout",
    size: 24,
    color: "var(--leaf-600)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: "var(--leaf-800)"
    }
  }, "That's everything for today. Nice work!")), times.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 12,
      flexWrap: "wrap"
    }
  }, times.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 30,
      padding: "0 12px",
      borderRadius: 99,
      fontSize: 13,
      fontWeight: 600,
      background: takenTimes.includes(t) ? "var(--leaf-50)" : "var(--surface-sunken)",
      color: takenTimes.includes(t) ? "var(--leaf-800)" : "var(--text-muted)"
    }
  }, takenTimes.includes(t) && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    strokeWidth: 3
  }), D.fmtTime(t)))), /*#__PURE__*/React.createElement(window.SectionLabel, {
    action: sel.length > 0 && /*#__PURE__*/React.createElement("button", {
      onClick: () => setSel([]),
      style: {
        border: 0,
        background: "none",
        color: "var(--brand)",
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer"
      }
    }, "Clear")
  }, "Manual mode"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--text-muted)",
      marginTop: -4,
      marginBottom: 12
    }
  }, "Tap the pills you'd like, then dispense."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0,1fr))",
      gap: 8
    }
  }, [...pills].sort((a, b) => a.compartment - b.compartment).map(p => /*#__PURE__*/React.createElement(PillSelectTile, {
    key: p.id,
    name: p.name,
    compartment: p.compartment,
    color: D.CATEGORIES[p.category].color,
    count: D.left(p),
    disabled: D.left(p) === 0,
    selected: sel.includes(p.id),
    onToggle: () => toggle(p.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    variant: sel.length ? "primary" : "secondary",
    icon: "sparkles",
    disabled: !sel.length || busy || deviceStatus === "moving",
    onClick: () => run(pills.filter(p => sel.includes(p.id)), `All done! ${sel.length} ${sel.length === 1 ? "pill" : "pills"} dispensed`)
  }, sel.length ? `Dispense ${sel.length} ${sel.length === 1 ? "pill" : "pills"}` : "Pick pills to dispense"))));
}
window.TodayScreen = TodayScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sprout-app/TodayScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sprout-app/data.js
try { (() => {
// Seed data + helpers for the Sprout app UI kit (demo only).
(function () {
  const CATEGORIES = {
    daily: {
      label: "Daily",
      color: "var(--cat-daily)",
      tone: "leaf"
    },
    vitamin: {
      label: "Vitamins",
      color: "var(--cat-vitamin)",
      tone: "honey"
    },
    heart: {
      label: "Heart",
      color: "var(--cat-heart)",
      tone: "rose"
    },
    pain: {
      label: "Pain relief",
      color: "var(--cat-pain)",
      tone: "apricot"
    },
    sleep: {
      label: "Sleep",
      color: "var(--cat-sleep)",
      tone: "sky"
    },
    other: {
      label: "Other",
      color: "var(--cat-other)",
      tone: "mauve"
    }
  };
  const ALL = [0, 1, 2, 3, 4, 5, 6];
  const seedPills = [{
    id: "p1",
    name: "Lisinopril",
    dose: "10 mg · 1 tablet",
    category: "heart",
    compartment: 1,
    refill: 30,
    dispensed: 12,
    days: ALL,
    times: ["08:00"],
    manual: false,
    pausedUntil: null
  }, {
    id: "p2",
    name: "Vitamin D",
    dose: "1000 IU · 1 softgel",
    category: "vitamin",
    compartment: 2,
    refill: 30,
    dispensed: 24,
    days: ALL,
    times: ["08:00"],
    manual: false,
    pausedUntil: null
  }, {
    id: "p3",
    name: "Metformin",
    dose: "500 mg · 1 tablet",
    category: "daily",
    compartment: 3,
    refill: 60,
    dispensed: 32,
    days: ALL,
    times: ["08:00", "20:00"],
    manual: false,
    pausedUntil: null
  }, {
    id: "p4",
    name: "Melatonin",
    dose: "3 mg",
    category: "sleep",
    compartment: 4,
    refill: 60,
    dispensed: 20,
    days: [0, 1, 2, 3, 6],
    times: ["21:30"],
    manual: false,
    pausedUntil: null
  }, {
    id: "p5",
    name: "Ibuprofen",
    dose: "200 mg · as needed",
    category: "pain",
    compartment: 5,
    refill: 24,
    dispensed: 2,
    days: [],
    times: [],
    manual: true,
    pausedUntil: null
  }, {
    id: "p6",
    name: "Omega-3",
    dose: "1 capsule",
    category: "vitamin",
    compartment: 6,
    refill: 30,
    dispensed: 28,
    days: [0, 2, 4],
    times: ["08:00"],
    manual: false,
    pausedUntil: 18
  }];
  const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const fmtTime = t => {
    const [h, m] = t.split(":").map(Number);
    return `${(h + 11) % 12 + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
  };
  const left = p => Math.max(0, p.refill - p.dispensed);
  const perDay = p => (p.manual ? 1 : p.times.length * p.days.length / 7) || 1;
  const thresholds = p => ({
    lowAt: Math.max(7, Math.round(perDay(p) * 7)),
    outAt: Math.max(3, Math.round(perDay(p) * 3))
  });
  const summary = p => {
    if (p.pausedUntil) return `Taking a break until Aug ${p.pausedUntil}`;
    if (p.manual) return "Whenever you need it";
    const d = p.days.length === 7 ? "Every day" : p.days.map(i => DOW[i]).join(", ");
    return `${d} · ${p.times.map(fmtTime).join(", ")}`;
  };
  // Aug 2026: the 1st is a Saturday. Weekday index, Monday = 0.
  const weekdayOf = (year, month, day) => (new Date(year, month, day).getDay() + 6) % 7;
  const scheduledOn = (pills, year, month, day) => pills.filter(p => !p.manual && p.days.includes(weekdayOf(year, month, day)) && !(p.pausedUntil && month === 7 && day < p.pausedUntil));
  window.SproutData = {
    CATEGORIES,
    seedPills,
    DOW,
    fmtTime,
    left,
    thresholds,
    summary,
    weekdayOf,
    scheduledOn,
    TODAY: {
      year: 2026,
      month: 7,
      day: 13
    }
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sprout-app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/sprout-app/sproutDevice.js
try { (() => {
// Sprout dispenser adapter. Builds on the data contract in varsham/makecu_26 frontend/README.md
// without changing it: the app writes /device/{stepperTarget, servoAngle, trigger} in ONE update()
// and only READS /device/status ("ready" | "moving").
//
// Default mode is "demo" (simulated) so the UI kit never moves a real machine.
// To go live: await SproutDevice.connect(firebaseConfig) — same config as frontend/index.html.
(function () {
  const COMPARTMENTS = 8; // assumption: 8 compartments evenly spaced on one stepper turn
  const SERVO_DROP = 90; // assumption: servo angle that releases a pill; confirm with firmware owner
  const listeners = new Set();
  let status = "ready";
  let db = null,
    fb = null;
  const setStatus = s => {
    status = s;
    listeners.forEach(fn => fn(s));
  };

  // Compartment 1..N → even stepper position 0..1022 (1024 = one full turn)
  const compartmentToStepper = n => {
    let v = Math.round((n - 1) * 1024 / COMPARTMENTS);
    v -= v % 2;
    return Math.min(Math.max(v, 0), 1022);
  };
  const waitReady = () => new Promise(res => {
    if (status === "ready") return res();
    const fn = s => {
      if (s === "ready") {
        listeners.delete(fn);
        res();
      }
    };
    listeners.add(fn);
  });
  async function sendOne(compartment) {
    const payload = {
      stepperTarget: compartmentToStepper(compartment),
      servoAngle: SERVO_DROP,
      trigger: Date.now()
    };
    if (db) {
      await fb.update(fb.ref(db, "device"), payload); // one update() — never write status
      await new Promise(r => setTimeout(r, 400));
      await waitReady();
    } else {
      setStatus("moving");
      await new Promise(r => setTimeout(r, 900));
      setStatus("ready");
    }
  }
  window.SproutDevice = {
    get mode() {
      return db ? "live" : "demo";
    },
    get status() {
      return status;
    },
    onStatus(fn) {
      listeners.add(fn);
      fn(status);
      return () => listeners.delete(fn);
    },
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
      fb.onValue(fb.ref(db, "device/status"), snap => setStatus(snap.val() || "offline"));
    }
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sprout-app/sproutDevice.js", error: String((e && e.message) || e) }); }

__ds_ns.CalendarMonth = __ds_scope.CalendarMonth;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Sheet = __ds_scope.Sheet;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.DayPicker = __ds_scope.DayPicker;

__ds_ns.NumberStepper = __ds_scope.NumberStepper;

__ds_ns.RangeSlider = __ds_scope.RangeSlider;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.TopBar = __ds_scope.TopBar;

__ds_ns.CompartmentTag = __ds_scope.CompartmentTag;

__ds_ns.PillCard = __ds_scope.PillCard;

__ds_ns.PillSelectTile = __ds_scope.PillSelectTile;

__ds_ns.StockMeter = __ds_scope.StockMeter;

})();
