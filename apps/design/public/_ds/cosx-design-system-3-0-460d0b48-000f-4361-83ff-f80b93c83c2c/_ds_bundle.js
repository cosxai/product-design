/* @ds-bundle: {"format":4,"namespace":"COSXDesignSystem30_460d0b","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Figure","sourcePath":"components/core/Figure.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"Marker","sourcePath":"components/core/Marker.jsx"},{"name":"MetaLabel","sourcePath":"components/core/MetaLabel.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Table","sourcePath":"components/data/Table.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"03658f5565ce","components/core/Button.jsx":"b6672227fb99","components/core/Card.jsx":"fba253151d82","components/core/Figure.jsx":"3d24b3ae969a","components/core/Icon.jsx":"03701b083089","components/core/IconButton.jsx":"694af510c0e0","components/core/Logo.jsx":"5f5ccad5588f","components/core/Marker.jsx":"612134913b2f","components/core/MetaLabel.jsx":"2612e48cfff7","components/core/Tag.jsx":"5537690d76b1","components/data/Table.jsx":"c4ede5a935a5","components/feedback/Dialog.jsx":"75ac6a5e6d08","components/feedback/Toast.jsx":"b45233980ea2","components/feedback/Tooltip.jsx":"1109b91bfb64","components/forms/Checkbox.jsx":"47408c569273","components/forms/Field.jsx":"9c957f2093fc","components/forms/Input.jsx":"4e2a16c700a4","components/forms/Radio.jsx":"ca6f4415a1d0","components/forms/Select.jsx":"b19261ad0ec0","components/forms/Switch.jsx":"cf82109f915c","components/forms/Textarea.jsx":"aaae04066cbb","components/navigation/Tabs.jsx":"cde5423a9b01","ui_kits/website/Sections.jsx":"c2d6ef06a826","ui_kits/workspace/Overview.jsx":"4afc75b2ab98","ui_kits/workspace/Register.jsx":"2f42b0d97cfa","ui_kits/workspace/Shell.jsx":"82865e9139df","ui_kits/workspace/data.jsx":"6517810a90a9"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.COSXDesignSystem30_460d0b = window.COSXDesignSystem30_460d0b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
/**
 * COSX 3.0 Badge. Product status in the brand's own materials: yellow for attention,
 * one red for overdue, ink for everything else. `attention` and `error` fill; `progress`
 * is an ink outline; `complete` and `neutral` are a grey dot so cleared rows recede.
 * Wording is always present; the colour is redundancy.
 */
function Badge({
  children,
  status = 'neutral',
  appearance,
  style = {}
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    borderRadius: 'var(--radius-sm)'
  };
  const mode = appearance || {
    attention: 'fill',
    error: 'fill',
    progress: 'outline',
    complete: 'dot',
    neutral: 'dot'
  }[status] || 'dot';
  if (mode === 'fill') {
    const fill = status === 'error' ? {
      background: 'var(--status-error)',
      color: '#FFFFFF'
    } : status === 'attention' ? {
      background: 'var(--yellow-accent)',
      color: 'var(--ink)'
    } : {
      background: 'var(--ink)',
      color: 'var(--linen)'
    };
    return /*#__PURE__*/React.createElement("span", {
      style: {
        ...base,
        padding: '5px 8px',
        ...fill,
        ...style
      }
    }, children);
  }
  if (mode === 'outline') {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        ...base,
        padding: '4px 7px',
        border: '1px solid var(--ink)',
        color: 'var(--text-primary)',
        ...style
      }
    }, children);
  }
  const dot = status === 'error' ? 'var(--status-error)' : status === 'attention' ? 'var(--yellow-accent)' : status === 'progress' ? 'var(--ink)' : 'var(--grey)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      ...base,
      color: 'var(--text-secondary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 'var(--radius-pill)',
      background: dot,
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button. On paper the primary is solid ink with linen text; on an ink or yellow ground
 * (`ground="ink"` / `ground="yellow"`) the primary is the yellow with ink text. Contrast is
 * ink's job, so the yellow never has to be louder than the page. Secondary is a --rule
 * border shifting to ink. Ghost is text only. 8px radius. Never a shadow, never a scale.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  ground = 'paper',
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const [hov, setHov] = React.useState(false);
  const [foc, setFoc] = React.useState(false);
  const sizes = {
    sm: {
      padding: '8px 14px',
      fontSize: 13
    },
    md: {
      padding: '11px 18px',
      fontSize: 14
    },
    lg: {
      padding: '14px 24px',
      fontSize: 16
    }
  };
  const onPaper = ground === 'paper';
  const fg = ground === 'ink' ? 'var(--linen)' : 'var(--ink)';
  const variants = {
    primary: onPaper ? {
      background: hov ? 'var(--ink-raised)' : 'var(--ink)',
      color: 'var(--linen)',
      border: '1px solid transparent'
    } : ground === 'yellow' ? {
      background: hov ? 'var(--ink-raised)' : 'var(--ink)',
      color: 'var(--linen)',
      border: '1px solid transparent'
    } : {
      background: hov ? 'var(--yellow-accent-hover)' : 'var(--yellow-accent)',
      color: 'var(--ink)',
      border: '1px solid transparent'
    },
    yellow: {
      background: hov ? 'var(--yellow-hover)' : 'var(--yellow)',
      color: 'var(--ink)',
      border: '1px solid transparent'
    },
    secondary: {
      background: 'transparent',
      color: fg,
      border: '1px solid ' + (hov ? fg : ground === 'ink' ? 'var(--rule-inverse)' : 'rgba(17,17,17,.18)')
    },
    ghost: {
      background: hov ? ground === 'ink' ? 'var(--ink-raised)' : 'rgba(17,17,17,.05)' : 'transparent',
      color: fg,
      border: '1px solid transparent'
    },
    ink: {
      background: hov ? 'var(--ink-raised)' : 'var(--ink)',
      color: 'var(--linen)',
      border: '1px solid transparent'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    onFocus: e => {
      setFoc(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFoc(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      lineHeight: 1,
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 'var(--disabled-opacity)' : 1,
      outline: 'none',
      boxShadow: foc ? '0 0 0 3px ' + (ground === 'ink' ? 'var(--ink)' : ground === 'yellow' ? 'var(--yellow)' : 'var(--bg-page)') + ', 0 0 0 5px ' + (ground === 'ink' ? 'var(--yellow)' : 'var(--ink)') : 'none',
      whiteSpace: 'nowrap',
      transition: 'background var(--motion-colour) var(--easing), border-color var(--motion-colour) var(--easing)',
      ...sizes[size],
      ...variants[variant],
      ...style
    }
  }), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Panel — a rounded region of the page (16px). `sunk` sits on linen, `field` on the yellow field, `ink` on the dark ground. `accent` adds a 4px mark rule on top. No shadow. */
function Card({
  children,
  padding = 24,
  sunk = false,
  field = false,
  ink = false,
  accent = false,
  outline,
  interactive = false,
  radius = 'var(--radius-lg)',
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const bg = ink ? 'var(--ink)' : field ? 'var(--yellow)' : sunk ? 'var(--bg-sunk)' : interactive && hover ? 'var(--hover)' : 'var(--bg-page)';
  const showOutline = outline ?? !(sunk || field || ink);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest, {
    style: {
      background: bg,
      color: ink ? 'var(--linen)' : 'var(--ink)',
      border: showOutline ? '1px solid ' + (interactive && hover ? 'var(--text-primary)' : 'var(--rule)') : 'none',
      borderTop: accent ? '4px solid var(--yellow-accent)' : undefined,
      borderRadius: radius,
      padding,
      boxShadow: 'none',
      cursor: interactive ? 'pointer' : 'default',
      overflow: 'hidden',
      transition: 'border-color var(--motion-colour) var(--easing), background var(--motion-colour) var(--easing)',
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Figure.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Figure — a large tabular number, a short yellow rule beneath, then the mono label
 * and an optional qualifier or source. Every figure is sourced or it is removed.
 */
function Figure({
  value,
  label,
  qualifier,
  source,
  size = 64,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: size,
      lineHeight: 1,
      letterSpacing: 'var(--track-figure)',
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      background: 'var(--yellow-accent)',
      borderRadius: 2,
      margin: '14px 0 12px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 500,
      letterSpacing: 0,
      color: 'var(--text-secondary)'
    }
  }, label), qualifier && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.5,
      color: 'var(--text-secondary)',
      marginTop: 6,
      maxWidth: '28ch'
    }
  }, qualifier), source && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: 0,
      color: 'var(--text-secondary)',
      marginTop: 8
    }
  }, source));
}
Object.assign(__ds_scope, { Figure });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Figure.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Lucide line icon (CDN, substituted set) masked to currentColor. Use sparingly; 16–20px in UI. */
function Icon({
  name,
  size = 18,
  color = 'currentColor',
  label,
  style = {},
  ...rest
}) {
  const url = 'https://cdn.jsdelivr.net/npm/lucide-static@0.454.0/icons/' + name + '.svg';
  return /*#__PURE__*/React.createElement("span", _extends({
    role: label ? 'img' : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      flex: 'none',
      background: color,
      WebkitMaskImage: 'url(' + url + ')',
      maskImage: 'url(' + url + ')',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Square icon-only button. Outline shifts --rule to ink on hover; ghost takes the --hover wash; solid is ink. */
function IconButton({
  name,
  label,
  variant = 'outline',
  size = 34,
  disabled = false,
  style = {},
  ...rest
}) {
  const [hov, setHov] = React.useState(false);
  const [foc, setFoc] = React.useState(false);
  const v = {
    outline: {
      border: '1px solid ' + (hov ? 'var(--text-primary)' : 'var(--rule)'),
      background: 'transparent',
      color: 'var(--text-primary)'
    },
    ghost: {
      border: '1px solid transparent',
      background: hov ? 'var(--hover)' : 'transparent',
      color: 'var(--text-primary)'
    },
    solid: {
      border: '1px solid var(--ink)',
      background: hov ? 'var(--ink-raised)' : 'var(--ink)',
      color: 'var(--linen)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    onFocus: () => setFoc(true),
    onBlur: () => setFoc(false),
    style: {
      width: size,
      height: size,
      display: 'inline-grid',
      placeItems: 'center',
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      boxShadow: foc ? 'var(--focus-ring)' : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 'var(--disabled-opacity)' : 1,
      padding: 0,
      transition: 'border-color var(--motion-colour) var(--easing), background var(--motion-colour) var(--easing)',
      ...v,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: name,
    size: Math.round(size * 0.5)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * COSX logo — official artwork from assets/. variant: wordmark | icon | tile. tone: ink | white.
 * `tile` is the loop on a yellow square (app icon, avatar, favicon): colour from the ground, never from the mark.
 * `rule` adds the 4px yellow rule beneath the wordmark — the standard lockup. Never recolour beyond these.
 */
function Logo({
  variant = 'wordmark',
  tone = 'ink',
  rule = false,
  height = 28,
  base = '../../assets',
  alt = 'COSX',
  style = {},
  ...rest
}) {
  if (variant === 'tile') {
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        width: height,
        height,
        borderRadius: Math.round(height * 0.22),
        background: 'var(--yellow)',
        display: 'inline-grid',
        placeItems: 'center',
        flex: 'none',
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("img", {
      src: base + '/logo-icon.svg',
      alt: alt,
      style: {
        width: height,
        height: height,
        display: 'block'
      }
    }));
  }
  const file = 'logo-' + variant + (tone === 'white' ? '-white' : '') + '.svg';
  const ratio = variant === 'icon' ? 1 : 225 / 62;
  const img = /*#__PURE__*/React.createElement("img", {
    src: base + '/' + file,
    alt: alt,
    style: {
      height,
      width: Math.round(height * ratio),
      flex: 'none',
      display: 'block'
    }
  });
  if (!rule) return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      ...style
    }
  }, rest), img);
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: Math.round(height * 0.45),
      ...style
    }
  }, rest), img, /*#__PURE__*/React.createElement("span", {
    style: {
      width: Math.round(height * ratio),
      height: 4,
      borderRadius: 2,
      background: 'var(--yellow-accent)'
    }
  }));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Marker.jsx
try { (() => {
/**
 * Marker — the highlighter stroke behind a phrase in a headline. The brand's signature
 * emphasis: a band in the lower part of the line so ascenders clear it, cloned across
 * line breaks. On paper the band is accent yellow behind ink type; on ink (`onInk`) there is
 * no band: the phrase is set in accent yellow, because the yellow itself is the highlighter there.
 */
function Marker({
  children,
  color = 'var(--marker)',
  onInk = false,
  draw = false,
  as = 'span',
  style = {}
}) {
  const T = as;
  const band = color;
  if (onInk) return /*#__PURE__*/React.createElement(T, {
    className: "marker on-ink",
    style: {
      color: 'var(--yellow-accent)',
      ...style
    }
  }, children);
  return /*#__PURE__*/React.createElement(T, {
    className: draw ? 'marker draw' : 'marker',
    style: {
      background: 'linear-gradient(transparent 42%, ' + band + ' 42%, ' + band + ' 94%, transparent 94%)',
      WebkitBoxDecorationBreak: 'clone',
      boxDecorationBreak: 'clone',
      padding: '0 .08em',
      margin: '0 -.08em',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Marker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Marker.jsx", error: String((e && e.message) || e) }); }

// components/core/MetaLabel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Label — the eyebrow, status line, metadata, page number. Geist 12px 500, sentence case,
 * --text-secondary. No caps, no tracking, no second face. `rule="yellow"` draws the 4px
 * yellow rule beneath. tone="yellow" is legal ONLY on an ink ground.
 */
function MetaLabel({
  children,
  tone = 'grey',
  size = 'md',
  rule = false,
  as = 'div',
  style = {},
  ...rest
}) {
  const T = as;
  const color = {
    grey: 'var(--text-secondary)',
    ink: 'var(--text-primary)',
    inverse: 'var(--grey-inverse)',
    linen: 'var(--linen)',
    yellow: 'var(--yellow-accent)',
    amber: 'var(--yellow-accent)'
  }[tone];
  const fs = {
    sm: 11.5,
    md: 12,
    lg: 13.5
  }[size];
  const r = rule === true ? 'hair' : rule === 'amber' ? 'yellow' : rule;
  return /*#__PURE__*/React.createElement(T, _extends({
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: fs,
      fontWeight: 500,
      color,
      lineHeight: 1.4,
      paddingBottom: r ? 10 : 0,
      borderBottom: r === 'yellow' ? '4px solid var(--yellow-accent)' : r === 'hair' ? '1px solid var(--rule)' : 'none',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { MetaLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/MetaLabel.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
/** Quiet metadata tag — sunk one step, hairline edge, grey mono text. Categories and references. */
function Tag({
  children,
  onRemove,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      letterSpacing: 0,
      color: 'var(--text-secondary)',
      background: 'var(--bg-sunk)',
      border: '1px solid var(--rule-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '3px 7px',
      lineHeight: 1.3,
      ...style
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: onRemove,
    "aria-label": "Remove",
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: 0,
      color: 'var(--text-secondary)',
      fontSize: 12,
      lineHeight: 1
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/Table.jsx
try { (() => {
/**
 * COSX 3.0 Table. Head at --linen in mono caps at grey. Body rows on the page,
 * separated by --rule-soft. Row hover at --hover. A row that needs attention takes
 * a status wash; the Badge carries the wording. Numeric columns
 * are right-aligned and tabular.
 *
 * columns: [{ key, label, align?: 'left'|'right', mono?: boolean, width?, render?: (row) => node }]
 * rows:    [{ id, status?: 'attention'|'error'|'progress'|'complete', ...cells }]
 */
function Table({
  columns = [],
  rows = [],
  onRowClick,
  dense = false,
  style = {}
}) {
  const [hov, setHov] = React.useState(null);
  const wash = {
    attention: ['var(--status-attention-wash)', 'var(--yellow-accent)'],
    error: ['var(--status-error-wash)', 'var(--status-error)']
  };
  const pad = dense ? '7px 12px' : '10px 14px';
  return /*#__PURE__*/React.createElement("table", {
    style: {
      borderCollapse: 'collapse',
      width: '100%',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      background: 'var(--bg-sunk)',
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: 0,
      color: 'var(--text-secondary)',
      textAlign: c.align || 'left',
      padding: pad,
      borderBottom: '1px solid var(--rule)',
      width: c.width,
      whiteSpace: 'nowrap'
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => {
    const w = wash[r.status];
    const bg = w ? w[0] : hov === i ? 'var(--hover)' : 'transparent';
    return /*#__PURE__*/React.createElement("tr", {
      key: r.id ?? i,
      onMouseEnter: () => setHov(i),
      onMouseLeave: () => setHov(null),
      onClick: onRowClick ? () => onRowClick(r) : undefined,
      style: {
        cursor: onRowClick ? 'pointer' : 'default'
      }
    }, columns.map((c, ci) => /*#__PURE__*/React.createElement("td", {
      key: c.key,
      style: {
        padding: pad,
        borderBottom: '1px solid var(--rule-soft)',
        background: bg,
        verticalAlign: 'middle',
        textAlign: c.align || 'left',
        fontFamily: c.mono ? 'var(--font-mono)' : undefined,
        fontSize: c.mono ? 11 : undefined,
        color: c.mono && c.key !== 'due' ? 'var(--text-secondary)' : undefined,
        fontVariantNumeric: c.align === 'right' || c.mono ? 'tabular-nums' : undefined,
        whiteSpace: c.mono ? 'nowrap' : undefined,
        transition: 'background var(--motion-colour) var(--easing)'
      }
    }, c.render ? c.render(r) : r[c.key])));
  })));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Table.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Overlay — page colour on the --scrim. The scrim lifts it; there is no shadow, no blur, no radius. */
function Dialog({
  open = false,
  title,
  eyebrow,
  onClose,
  footer,
  children,
  width = 520,
  style = {},
  ...rest
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "presentation",
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--scrim)',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement("div", _extends({
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '100%',
      background: 'var(--bg-page)',
      border: '1px solid var(--rule)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      padding: '24px 28px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: 0,
      color: 'var(--text-secondary)',
      marginBottom: 10
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 21,
      fontWeight: 500,
      letterSpacing: 'var(--track-heading)',
      lineHeight: 1.2
    }
  }, title)), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    name: "x",
    label: "Close",
    variant: "ghost",
    size: 30,
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 28px 24px',
      fontSize: 13.5,
      lineHeight: 1.6,
      color: 'var(--text-secondary)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      padding: '16px 28px',
      borderTop: '1px solid var(--rule)',
      background: 'var(--bg-sunk)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Notice — ink surface with linen text, 12px radius. Status is a dot in the brand's materials: yellow for attention, red for failed, linen for done. No shadow. */
function Toast({
  open = true,
  status = 'neutral',
  title,
  children,
  onClose,
  action,
  style = {},
  ...rest
}) {
  if (!open) return null;
  const lbl = {
    neutral: 'Notice',
    complete: 'Done',
    attention: 'Attention',
    error: 'Failed',
    progress: 'In progress'
  }[status] || 'Notice';
  const dot = {
    neutral: 'var(--grey-inverse)',
    complete: 'var(--linen)',
    attention: 'var(--yellow-accent)',
    error: 'var(--status-error)',
    progress: 'var(--grey-inverse)'
  }[status] || 'var(--grey-inverse)';
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      width: 320,
      maxWidth: '100%',
      background: 'var(--ink)',
      color: 'var(--linen)',
      borderRadius: 12,
      padding: '14px 16px',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 'var(--radius-pill)',
      background: dot,
      marginTop: 5,
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: status === 'attention' ? 'var(--yellow-accent)' : 'var(--grey-inverse)',
      marginBottom: 3
    }
  }, lbl), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.4
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.5,
      color: 'var(--grey-inverse)',
      marginTop: 2
    }
  }, children), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, action)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--grey-inverse)',
      cursor: 'pointer',
      padding: 2,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
/** Tooltip — ink chip, linen text, 180ms fade. No shadow. */
function Tooltip({
  content,
  side = 'top',
  children,
  style = {}
}) {
  const [on, setOn] = React.useState(false);
  const pos = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%,-8px)'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translate(-50%,8px)'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translate(-8px,-50%)'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translate(8px,-50%)'
    }
  }[side];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    },
    onMouseEnter: () => setOn(true),
    onMouseLeave: () => setOn(false),
    onFocus: () => setOn(true),
    onBlur: () => setOn(false)
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      ...pos,
      background: 'var(--ink)',
      color: 'var(--linen)',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      lineHeight: 1.4,
      padding: '5px 9px',
      borderRadius: 'var(--radius-md)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 50,
      opacity: on ? 1 : 0,
      transition: 'opacity var(--motion-fade) var(--easing)'
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Square checkbox — sunk box with a --rule edge, ink fill when checked. Radius 2px. */
function Checkbox({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'flex-start',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 'var(--disabled-opacity)' : 1,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 16,
      height: 16,
      flex: 'none',
      marginTop: 2,
      borderRadius: 'var(--radius-md)',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--linen)',
      border: '1px solid ' + (checked ? 'var(--ink)' : 'var(--text-secondary)'),
      background: checked ? 'var(--ink)' : 'var(--bg-sunk)',
      transition: 'background var(--motion-colour) var(--easing)'
    }
  }, checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 11
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-primary)',
      lineHeight: 1.45
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)',
      lineHeight: 1.5
    }
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Label + hint/error wrapper for any control. Mono-caps grey label; error is wording in vermilion, never colour alone. */
function Field({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), label && /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: 0,
      color: 'var(--text-secondary)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", null, " \xB7 required")), children, (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      lineHeight: 1.5,
      color: error ? 'var(--status-error)' : 'var(--text-secondary)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * COSX 3.0 text input. Sits at --linen, one step below the page, with a --rule border.
 * Focus takes an ink border and the amber ring. Disabled drops to --sunk-2 with grey
 * text. Error takes a vermilion border plus wording — the border alone is not enough.
 */
function Input({
  label,
  hint,
  prefix = null,
  suffix = null,
  invalid = false,
  disabled = false,
  style = {},
  id,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || (label ? 'in-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const wrap = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: disabled ? 'var(--bg-well)' : 'var(--bg-sunk)',
    border: '1px solid ' + (invalid ? 'var(--status-error)' : focused ? 'var(--text-primary)' : disabled ? 'var(--rule-soft)' : 'var(--rule)'),
    borderRadius: 'var(--radius-md)',
    padding: '0 10px',
    boxShadow: focused ? 'var(--focus-ring)' : 'none',
    transition: 'border-color var(--motion-colour) var(--easing)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: 0,
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      display: 'flex'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    disabled: disabled,
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: disabled ? 'var(--text-secondary)' : 'var(--text-primary)',
      padding: '8px 0',
      minWidth: 0
    }
  })), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      display: 'flex'
    }
  }, suffix)), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      lineHeight: 1.5,
      color: invalid ? 'var(--status-error)' : 'var(--text-secondary)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
/** Radio group — round sunk controls, ink dot when selected. Vertical by default. */
function Radio({
  name,
  options = [],
  value,
  onChange,
  direction = 'column',
  disabled = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction,
      gap: direction === 'row' ? 22 : 10,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    const on = v === value;
    return /*#__PURE__*/React.createElement("label", {
      key: v,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--disabled-opacity)' : 1
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: name,
      value: v,
      checked: on,
      disabled: disabled,
      onChange: () => onChange && onChange(v),
      style: {
        position: 'absolute',
        opacity: 0,
        width: 0,
        height: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": true,
      style: {
        width: 16,
        height: 16,
        borderRadius: 'var(--radius-pill)',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--bg-sunk)',
        border: '1px solid ' + (on ? 'var(--ink)' : 'var(--text-secondary)'),
        transition: 'border-color var(--motion-colour) var(--easing)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--ink)',
        transform: on ? 'scale(1)' : 'scale(0)',
        transition: 'transform var(--motion-colour) var(--easing)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        color: 'var(--text-primary)'
      }
    }, l));
  }));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Select — a styled listbox, not the native control. Trigger sits in sunk chrome; the menu is
 * paper with a 12px radius and a hairline, rising 6px on open. The selected row is a field-yellow
 * pill; the keyboard-active row takes --hover. Set `searchable` (or pass more than 8 options and
 * it turns itself on) for a filter field at the top of the menu. Options may carry a `meta` string
 * and a `group` label. No shadow: the menu reads as paper lifted off paper by its hairline.
 */
function Select({
  options = [],
  value,
  onChange,
  placeholder = 'Choose one',
  searchable,
  invalid = false,
  disabled = false,
  emptyText = 'Nothing matches that.',
  style = {},
  ...rest
}) {
  const norm = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const wrap = React.useRef(null);
  const listRef = React.useRef(null);
  const canSearch = searchable ?? norm.length > 8;
  const selected = norm.find(o => o.value === value);
  const shown = React.useMemo(() => {
    if (!q.trim()) return norm;
    const t = q.trim().toLowerCase();
    return norm.filter(o => (o.label + ' ' + (o.meta || '')).toLowerCase().includes(t));
  }, [q, options]);
  React.useEffect(() => {
    if (!open) return;
    const away = e => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, [open]);
  React.useEffect(() => {
    if (open) {
      setQ('');
      setActive(Math.max(0, shown.findIndex(o => o.value === value)));
    }
  }, [open]);
  React.useEffect(() => {
    const el = listRef.current && listRef.current.querySelector('[data-active="true"]');
    if (el && listRef.current) {
      const {
        offsetTop,
        offsetHeight
      } = el;
      const box = listRef.current;
      if (offsetTop < box.scrollTop) box.scrollTop = offsetTop - 4;else if (offsetTop + offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = offsetTop + offsetHeight - box.clientHeight + 4;
    }
  }, [active, open]);
  const pick = o => {
    if (o.disabled) return;
    onChange && onChange(o.value);
    setOpen(false);
  };
  const onKey = e => {
    if (disabled) return;
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(i => Math.min(shown.length - 1, i + 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(i => Math.max(0, i - 1));
    }
    if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      setActive(shown.length - 1);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      shown[active] && pick(shown[active]);
    }
  };
  let lastGroup = null;
  return /*#__PURE__*/React.createElement("div", {
    ref: wrap,
    style: {
      position: 'relative',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "combobox",
    "aria-expanded": open,
    "aria-haspopup": "listbox",
    disabled: disabled,
    onClick: () => setOpen(o => !o),
    onKeyDown: onKey
  }, rest, {
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      textAlign: 'left',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? 'var(--bg-well)' : 'var(--bg-sunk)',
      borderRadius: 'var(--radius-md)',
      padding: '9px 10px',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: selected && !disabled ? 'var(--text-primary)' : 'var(--text-secondary)',
      outline: 'none',
      border: '1px solid ' + (invalid ? 'var(--status-error)' : open ? 'var(--text-primary)' : 'var(--rule)'),
      boxShadow: open ? 'var(--focus-ring)' : 'none',
      transition: 'border-color var(--motion-colour) var(--easing)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, selected ? selected.label : placeholder), selected && selected.meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)',
      flex: 'none'
    }
  }, selected.meta), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      color: 'var(--text-secondary)',
      display: 'flex',
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--motion-max) var(--easing-out)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 14
  }))), open && /*#__PURE__*/React.createElement("div", {
    role: "listbox",
    className: "rise",
    style: {
      position: 'absolute',
      zIndex: 60,
      top: 'calc(100% + 6px)',
      left: 0,
      minWidth: '100%',
      background: 'var(--bg-page)',
      border: '1px solid var(--rule)',
      borderRadius: 'var(--radius-lg)',
      padding: 4,
      boxSizing: 'border-box',
      overflow: 'hidden',
      '--motion-reveal': '200ms'
    }
  }, canSearch && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      padding: '5px 8px 8px',
      borderBottom: '1px solid var(--rule-soft)',
      margin: '0 0 4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      display: 'flex',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 13
  })), /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: q,
    onChange: e => {
      setQ(e.target.value);
      setActive(0);
    },
    onKeyDown: onKey,
    placeholder: "Filter",
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-primary)',
      minWidth: 0,
      padding: 0
    }
  }), q && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setQ(''),
    "aria-label": "Clear",
    style: {
      border: 'none',
      background: 'none',
      padding: 2,
      cursor: 'pointer',
      color: 'var(--text-secondary)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 12
  }))), /*#__PURE__*/React.createElement("div", {
    ref: listRef,
    style: {
      maxHeight: 208,
      overflowY: 'auto'
    }
  }, shown.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 10px 12px',
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, emptyText), shown.map((o, i) => {
    const on = o.value === value,
      act = i === active,
      head = o.group && o.group !== lastGroup;
    lastGroup = o.group || lastGroup;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: o.value
    }, head && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 10px 4px',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--text-secondary)'
      }
    }, o.group), /*#__PURE__*/React.createElement("div", {
      role: "option",
      "aria-selected": on,
      "data-active": act,
      onMouseEnter: () => setActive(i),
      onClick: () => pick(o),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 'var(--radius-md)',
        fontSize: 13,
        lineHeight: 1.35,
        cursor: o.disabled ? 'not-allowed' : 'pointer',
        opacity: o.disabled ? 'var(--disabled-opacity)' : 1,
        background: on ? 'var(--yellow)' : act ? 'var(--hover)' : 'transparent',
        color: 'var(--text-primary)',
        transition: 'background var(--motion-colour) var(--easing)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontWeight: on ? 500 : 400
      }
    }, o.label), o.meta && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: on ? 'var(--text-on-yellow-secondary)' : 'var(--text-secondary)',
        flex: 'none',
        fontVariantNumeric: 'tabular-nums'
      }
    }, o.meta), on && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "check",
      size: 13
    }))));
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/** Switch — pill track (one of two places the pill radius is allowed). Sunk chrome off, ink on. No shadow on the knob. */
function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  style = {}
}) {
  const on = !!checked;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": on,
    tabIndex: disabled ? -1 : 0,
    onClick: () => !disabled && onChange && onChange(!on),
    onKeyDown: e => {
      if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        onChange && onChange(!on);
      }
    },
    style: {
      width: 34,
      height: 20,
      borderRadius: 'var(--radius-pill)',
      background: on ? 'var(--ink)' : 'var(--bg-chrome)',
      border: '1px solid ' + (on ? 'var(--ink)' : 'var(--rule)'),
      position: 'relative',
      transition: 'background var(--motion-colour) var(--easing)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 'var(--disabled-opacity)' : 1,
      flexShrink: 0,
      outline: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: on ? 16 : 2,
      width: 14,
      height: 14,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--paper)',
      transition: 'left var(--motion-colour) var(--easing)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Multi-line input in sunk chrome. Pair with Field for label and hint. */
function Textarea({
  invalid = false,
  disabled = false,
  rows = 4,
  style = {},
  ...rest
}) {
  const [f, setF] = React.useState(false);
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    disabled: disabled,
    onFocus: e => {
      setF(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setF(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      width: '100%',
      boxSizing: 'border-box',
      background: disabled ? 'var(--bg-well)' : 'var(--bg-sunk)',
      color: disabled ? 'var(--text-secondary)' : 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      lineHeight: 1.55,
      padding: '8px 10px',
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      resize: 'vertical',
      boxShadow: f ? 'var(--focus-ring)' : 'none',
      border: '1px solid ' + (invalid ? 'var(--status-error)' : f ? 'var(--text-primary)' : 'var(--rule)'),
      transition: 'border-color var(--motion-colour) var(--easing)',
      ...style
    }
  }));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/** Tabs. `underline` (default): hairline rule, ink underline on the active tab. `pills`: rounded linen blocks with a mono index, the active one on the yellow field. */
function Tabs({
  items = [],
  value,
  onChange,
  variant = 'underline',
  style = {}
}) {
  const norm = it => typeof it === 'string' ? {
    value: it,
    label: it
  } : it;
  if (variant === 'pills') {
    return /*#__PURE__*/React.createElement("div", {
      role: "tablist",
      style: {
        display: 'flex',
        gap: 10,
        ...style
      }
    }, items.map(norm).map((it, i) => {
      const active = it.value === value;
      return /*#__PURE__*/React.createElement("button", {
        key: it.value,
        role: "tab",
        "aria-selected": active,
        onClick: () => onChange && onChange(it.value),
        style: {
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 18px',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          borderRadius: 'var(--radius-md)',
          background: active ? 'var(--yellow)' : 'var(--bg-sunk)',
          color: 'var(--ink)',
          fontFamily: 'var(--font-sans)',
          fontSize: 14,
          fontWeight: 500,
          transition: 'background var(--motion-colour) var(--easing)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          letterSpacing: 0,
          color: active ? 'var(--ink)' : 'var(--text-secondary)'
        }
      }, String(i + 1).padStart(2, '0')), it.label);
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 2,
      borderBottom: '1px solid var(--rule)',
      ...style
    }
  }, items.map(norm).map(it => {
    const active = it.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(it.value),
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 12px',
        marginBottom: -1,
        fontFamily: 'var(--font-sans)',
        fontSize: 13.5,
        fontWeight: active ? 500 : 400,
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        borderBottom: '2px solid ' + (active ? 'var(--text-primary)' : 'transparent'),
        transition: 'color var(--motion-colour) var(--easing)'
      }
    }, it.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Sections.jsx
try { (() => {
/** Site header — wordmark, text nav, one ink CTA. Paper, hairline below. */
function SiteNav() {
  const {
    Button
  } = window.COSXDesignSystem30_460d0b;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 36,
      padding: '0 56px',
      height: 80,
      maxWidth: 1280,
      margin: '0 auto',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-wordmark.svg",
    alt: "COSX",
    style: {
      height: 24,
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 28,
      marginLeft: 8,
      fontSize: 15,
      fontWeight: 500
    }
  }, ['What we do', 'Practices', 'Research', 'About'].map(n => /*#__PURE__*/React.createElement("a", {
    key: n,
    href: "#",
    style: {
      color: 'var(--text-primary)',
      textDecoration: 'none'
    }
  }, n))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--text-primary)',
      textDecoration: 'none'
    }
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    size: "md"
  }, "Book a call"));
}

/** Hero — marker headline and lede on the left; on the right a yellow field holding a product preview (a mini register) and one sourced figure. */
function Hero() {
  const {
    Button,
    Marker,
    Badge
  } = window.COSXDesignSystem30_460d0b;
  const rows = [['14.4', 'Revised Programme within ten Business Days', 'attention', 'Action needed'], ['16.1', "Monthly progress report to Employer's Representative", 'progress', 'In progress'], ['21.3', 'Evidence of cover on request', 'error', 'Overdue'], ['24.5', 'Notify Employer of any subcontractor change', 'complete', 'Cleared']];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '40px 56px 32px',
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      gap: 48,
      alignItems: 'center',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-secondary)',
      marginBottom: 16
    }
  }, "The AI back office for regulated professional services"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 54,
      fontWeight: 500,
      lineHeight: 1.04,
      letterSpacing: '-.03em',
      maxWidth: '15ch'
    }
  }, "Your casework, ", /*#__PURE__*/React.createElement(Marker, null, "completed and returned.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 1.55,
      color: 'var(--text-secondary)',
      maxWidth: '42ch',
      margin: '22px 0 28px'
    }
  }, "COSX runs AI agents inside your practice \u2014 on your data, under your supervision \u2014 and hands back finished work with every finding cited."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg"
  }, "Book a call"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary"
  }, "See how it works")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      marginTop: 36,
      paddingTop: 22,
      borderTop: '1px solid var(--rule)'
    }
  }, [['14', 'firms live'], ['38k', 'documents returned'], ['98.4%', 'findings cited']].map(([v, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: '-.03em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)',
      marginTop: 6
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--yellow)',
      borderRadius: 'var(--radius-xl)',
      padding: '36px 0 0 36px',
      overflow: 'hidden',
      position: 'relative',
      minHeight: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--text-on-yellow-secondary)',
      marginBottom: 14
    }
  }, "Grandblue \xB7 Obligations register"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-page)',
      borderRadius: '14px 0 0 0',
      border: '1px solid var(--rule)',
      borderRight: 'none',
      borderBottom: 'none',
      fontFamily: 'var(--font-sans)',
      minHeight: 340
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 18px',
      borderBottom: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500
    }
  }, "10 obligations \xB7 5 open"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, "Contract dated 12 March 2026")), /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Publish register")), rows.map(([ref, t, st, lb], i) => /*#__PURE__*/React.createElement("div", {
    key: ref,
    style: {
      display: 'grid',
      gridTemplateColumns: '44px 1fr auto',
      gap: 14,
      alignItems: 'center',
      padding: '12px 18px',
      borderBottom: '1px solid var(--rule-soft)',
      background: st === 'error' ? 'var(--status-error-wash)' : st === 'attention' ? 'var(--yellow-32)' : 'transparent',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, ref), /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, t), /*#__PURE__*/React.createElement(Badge, {
    status: st
  }, lb))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 18px',
      fontSize: 12,
      color: 'var(--text-secondary)'
    }
  }, "Every row checked back to the contract clause it came from."))));
}

/** Three-up cards — how it works. */
function Steps() {
  const steps = [['Map', 'The process is documented against the regulator\'s rule book and the firm\'s own precedents. Once per profession, not once per firm.'], ['Run', 'Agents work inside your workspace, on your data, with UK and EU residency. People handle the exceptions.'], ['Return', 'Finished output comes back with every finding cited to its source. A finding without a citation is not a finding.']];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '32px 56px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 22px',
      fontSize: 30,
      fontWeight: 500,
      letterSpacing: '-.02em'
    }
  }, "How the work comes back"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
      gap: 16
    }
  }, steps.map(([t, b], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      border: '1px solid var(--rule)',
      borderRadius: 'var(--radius-lg)',
      padding: '26px 26px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--text-secondary)'
    }
  }, "0", i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 500,
      letterSpacing: '-.02em'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--text-secondary)'
    }
  }, b)))));
}

/** Ink band — statement with the finding in yellow, a yellow button, three figures. */
function InkBand() {
  const {
    Button
  } = window.COSXDesignSystem30_460d0b;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ink)',
      color: 'var(--linen)',
      margin: '32px 0 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '72px 56px',
      boxSizing: 'border-box',
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 44,
      fontWeight: 500,
      lineHeight: 1.08,
      letterSpacing: '-.025em',
      maxWidth: '18ch'
    }
  }, "Every finding an agent returns can be ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--yellow-accent)'
    }
  }, "checked back to its source.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.55,
      color: 'var(--grey-inverse)',
      maxWidth: '46ch',
      margin: '20px 0 28px'
    }
  }, "The audit trail is a property of the workspace, not a feature bolted onto it. Your compliance officer sees what the agent saw."), /*#__PURE__*/React.createElement(Button, {
    ground: "ink",
    size: "lg"
  }, "See what we do")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, [['14', 'firms live'], ['9.2×', 'faster turnaround'], ['98.4%', 'findings cited']].map(([v, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: '-.03em',
      color: 'var(--yellow-accent)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--grey-inverse)',
      marginTop: 10
    }
  }, l))))));
}

/** Practices — yellow field with three rows. */
function Practices() {
  const {
    Button
  } = window.COSXDesignSystem30_460d0b;
  const rows = [['Legal', 'Immigration casework', 'Applications assembled against the current rules, evidence checked, the file returned ready for review.'], ['Funds', 'Investor diligence', 'KYC and AML refreshes run across the whole register, every source recorded, every exception surfaced.'], ['Accounting', 'Audit confirmations', 'Confirmation packs prepared and reconciled, with the discrepancies listed rather than buried.']];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '56px 56px 64px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--yellow)',
      borderRadius: 'var(--radius-xl)',
      padding: '40px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 24,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 36,
      fontWeight: 500,
      lineHeight: 1.1,
      letterSpacing: '-.025em'
    }
  }, "Three professions, one operating model."), /*#__PURE__*/React.createElement(Button, {
    ground: "yellow"
  }, "All practices")), rows.map(([k, t, b], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'grid',
      gridTemplateColumns: '140px 260px 1fr',
      gap: 24,
      padding: '20px 0',
      borderTop: '1px solid rgba(17,17,17,.14)',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--text-on-yellow-secondary)'
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 500,
      letterSpacing: '-.01em'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.55
    }
  }, b)))));
}
function SiteFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '28px 56px',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-wordmark.svg",
    alt: "COSX",
    style: {
      height: 16
    }
  }), /*#__PURE__*/React.createElement("span", null, "COSINE X LIMITED \xB7 London \xB7 Singapore"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 20
    }
  }, ['Privacy', 'Security', 'Contact'].map(n => /*#__PURE__*/React.createElement("a", {
    key: n,
    href: "#",
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, n)))));
}
Object.assign(window, {
  SiteNav,
  Hero,
  Steps,
  InkBand,
  Practices,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/workspace/Overview.jsx
try { (() => {
/** Overview — header, one yellow strip for the finding, four stat tiles, matter cards, activity beside a small ink card. Weight sits low. */
function Overview({
  onOpen
}) {
  const {
    Button,
    Badge,
    Marker
  } = window.COSXDesignSystem30_460d0b;
  const {
    MATTERS,
    OBLIGATIONS,
    ACTIVITY,
    countBy,
    allRows,
    Field,
    InkCard,
    Panel,
    Eyebrow,
    PageHeader
  } = window;
  const rows = allRows();
  const outstanding = rows.filter(r => r.status !== 'complete').length;
  const meta = {
    fontSize: 12,
    color: 'var(--text-secondary)',
    fontVariantNumeric: 'tabular-nums'
  };
  const dot = {
    error: 'var(--status-error)',
    attention: 'var(--yellow-accent)',
    progress: 'var(--ink)',
    complete: 'var(--grey)'
  };
  return /*#__PURE__*/React.createElement("main", {
    style: {
      padding: '24px 28px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Monday 15 September 2026",
    title: /*#__PURE__*/React.createElement("span", null, "Three matters, ", /*#__PURE__*/React.createElement(Marker, null, outstanding, " obligations"), " open this month"),
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "New matter")
  }), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.45,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 500
    }
  }, "Grandblue 21.3 is overdue."), " Evidence of cover was due 14 September; the escalation notice has not been sent."), /*#__PURE__*/React.createElement(Button, {
    ground: "yellow",
    size: "sm",
    onClick: () => onOpen('grandblue')
  }, "Open Grandblue"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
      gap: 12
    }
  }, [['error', 'Overdue'], ['attention', 'Action needed'], ['progress', 'In progress'], ['complete', 'Cleared']].map(([k, l]) => /*#__PURE__*/React.createElement(Panel, {
    key: k,
    style: {
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 999,
      background: dot[k]
    }
  }), l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: '-.03em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, countBy(rows, k))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 10px',
      fontSize: 15,
      fontWeight: 500
    }
  }, "Active matters"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
      gap: 12
    }
  }, MATTERS.map(m => {
    const rs = OBLIGATIONS[m.id];
    const open = rs.filter(r => r.status !== 'complete').length;
    return /*#__PURE__*/React.createElement(Panel, {
      key: m.id,
      onClick: () => onOpen(m.id),
      style: {
        padding: 16,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        fontWeight: 500
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)',
        marginTop: 2
      }
    }, m.kind)), /*#__PURE__*/React.createElement(Badge, {
      status: m.next.status
    }, {
      error: 'Overdue',
      attention: 'Action',
      progress: 'On track'
    }[m.next.status])), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 3,
        height: 6
      }
    }, rs.map(r => /*#__PURE__*/React.createElement("span", {
      key: r.id,
      style: {
        flex: 1,
        borderRadius: 2,
        background: r.status === 'complete' ? 'var(--sunk-3)' : dot[r.status]
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        ...meta
      }
    }, /*#__PURE__*/React.createElement("span", null, open, " of ", rs.length, " open"), /*#__PURE__*/React.createElement("span", null, "Next \xB7 ", m.next.ref, " \xB7 ", m.next.due)));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 260px',
      gap: 12,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    style: {
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 10
    }
  }, "Recent activity"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, ACTIVITY.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '110px 1fr auto',
      gap: 14,
      alignItems: 'center',
      padding: '8px 0',
      borderTop: i ? '1px solid var(--rule-soft)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    status: a.status,
    appearance: "dot"
  }, {
    complete: 'Cleared',
    progress: 'Sent',
    error: 'Overdue',
    attention: 'Flagged'
  }[a.status]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, a.text), /*#__PURE__*/React.createElement("span", {
    style: meta
  }, a.meta))))), /*#__PURE__*/React.createElement(InkCard, {
    eyebrow: "Next due \xB7 Grandblue",
    value: "14.4 \xB7 12 Sep",
    label: "Revised Programme within ten Business Days"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    ground: "ink",
    size: "sm",
    onClick: () => onOpen('grandblue')
  }, "Open"), /*#__PURE__*/React.createElement(Button, {
    ground: "ink",
    variant: "secondary",
    size: "sm"
  }, "Snooze")))));
}
window.Overview = Overview;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/workspace/Overview.jsx", error: String((e && e.message) || e) }); }

// ui_kits/workspace/Register.jsx
try { (() => {
/** Register — header, table in a panel with filters, detail column. Product scale. */
function Register({
  matterId,
  onBack,
  onPublish
}) {
  const {
    Button,
    Badge,
    Table,
    Select,
    Marker
  } = window.COSXDesignSystem30_460d0b;
  const {
    MATTERS,
    OBLIGATIONS,
    InkCard,
    Panel,
    Eyebrow,
    countBy,
    PageHeader
  } = window;
  const matter = MATTERS.find(m => m.id === matterId);
  const all = OBLIGATIONS[matterId];
  const [owner, setOwner] = React.useState('All');
  const [filter, setFilter] = React.useState('open');
  const [sel, setSel] = React.useState(all.find(r => r.status === 'error')?.id ?? all[0].id);
  React.useEffect(() => {
    setSel(all.find(r => r.status === 'error')?.id ?? all[0].id);
    setOwner('All');
  }, [matterId]);
  const owners = ['All', ...Array.from(new Set(all.map(r => r.owner)))];
  const rows = all.filter(r => (owner === 'All' || r.owner === owner) && (filter === 'all' || r.status !== 'complete'));
  const selected = all.find(r => r.id === sel);
  const open = all.filter(r => r.status !== 'complete').length;
  const columns = [{
    key: 'ref',
    label: 'Ref',
    mono: true,
    width: 56
  }, {
    key: 'obligation',
    label: 'Obligation',
    render: r => /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: r.id === sel ? 500 : 400
      }
    }, r.obligation)
  }, {
    key: 'owner',
    label: 'Owner',
    width: 100
  }, {
    key: 'due',
    label: 'Due',
    mono: true,
    width: 76
  }, {
    key: 'status',
    label: 'Status',
    width: 130,
    render: r => /*#__PURE__*/React.createElement(Badge, {
      status: r.status
    }, r.label)
  }];
  const chip = on => ({
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    fontSize: 12.5,
    fontWeight: 500,
    padding: '6px 10px',
    borderRadius: 'var(--radius-md)',
    background: on ? 'var(--ink)' : 'var(--bg-sunk)',
    color: on ? 'var(--linen)' : 'var(--text-primary)'
  });
  return /*#__PURE__*/React.createElement("main", {
    style: {
      padding: '24px 28px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: /*#__PURE__*/React.createElement("button", {
      onClick: onBack,
      style: {
        border: 'none',
        background: 'none',
        padding: 0,
        cursor: 'pointer',
        font: 'inherit',
        color: 'inherit'
      }
    }, "\u2190 Matters \xB7 ", matter.contract),
    title: /*#__PURE__*/React.createElement("span", null, matter.name, " \xB7 ", /*#__PURE__*/React.createElement(Marker, null, open, " of ", all.length), " obligations open"),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Export"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: onPublish
    }, "Publish register"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 260px',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '10px 12px',
      borderBottom: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: chip(filter === 'open'),
    onClick: () => setFilter('open')
  }, "Open \xB7 ", open), /*#__PURE__*/React.createElement("button", {
    style: chip(filter === 'all'),
    onClick: () => setFilter('all')
  }, "All \xB7 ", all.length), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Eyebrow, null, "Owner"), /*#__PURE__*/React.createElement(Select, {
    options: owners,
    value: owner,
    onChange: setOwner,
    style: {
      width: 140
    }
  })), /*#__PURE__*/React.createElement(Table, {
    columns: columns,
    rows: rows,
    dense: true,
    onRowClick: r => setSel(r.id)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 12px',
      borderTop: '1px solid var(--rule)',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", null, rows.length, " shown \xB7 ", countBy(all, 'error'), " overdue"), /*#__PURE__*/React.createElement("span", null, "Last published 4 Sep"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, selected && /*#__PURE__*/React.createElement(InkCard, {
    eyebrow: 'Clause ' + selected.ref + ' · ' + selected.owner,
    value: selected.due,
    label: selected.obligation
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
      paddingTop: 12,
      borderTop: '1px solid var(--rule-inverse)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    status: selected.status,
    appearance: selected.status === 'complete' ? 'dot' : 'fill',
    style: selected.status === 'complete' ? {
      color: 'var(--grey-inverse)'
    } : undefined
  }, selected.label), selected.status !== 'complete' && /*#__PURE__*/React.createElement(Button, {
    ground: "ink",
    size: "sm"
  }, "Mark cleared"))), /*#__PURE__*/React.createElement(Panel, {
    style: {
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Matter"), [['Type', matter.kind], ['Lead', matter.lead], ['Next due', matter.next.ref + ' · ' + matter.next.due]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      fontSize: 12.5,
      borderBottom: '1px solid var(--rule-soft)',
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, v))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    style: {
      alignSelf: 'flex-start'
    }
  }, "Open the contract")))));
}
window.Register = Register;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/workspace/Register.jsx", error: String((e && e.message) || e) }); }

// ui_kits/workspace/Shell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Sidebar — linen, 232px. Wordmark, primary nav with the active item as a yellow pill, matters list with status dots, account at the foot. */
function Sidebar({
  active,
  onSelect,
  matterId,
  onMatter
}) {
  const {
    MATTERS,
    OBLIGATIONS
  } = window;
  const items = [['Overview', 'layout-grid'], ['Matters', 'folder'], ['Documents', 'file-text'], ['Screening', 'search'], ['Reports', 'bar-chart']];
  const {
    Icon
  } = window.COSXDesignSystem30_460d0b;
  const dot = {
    error: 'var(--status-error)',
    attention: 'var(--yellow-accent)',
    progress: 'var(--ink)',
    complete: 'var(--grey)'
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 232,
      flexShrink: 0,
      background: 'var(--bg-page)',
      borderRight: '1px solid var(--rule)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 14px 16px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-wordmark.svg",
    alt: "COSX",
    style: {
      height: 16,
      display: 'block',
      margin: '4px 10px 26px'
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, items.map(([n, ic]) => {
    const on = n === active && !matterId || n === 'Matters' && matterId;
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      onClick: () => onSelect(n),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-sans)',
        fontSize: 13.5,
        fontWeight: 500,
        padding: '8px 10px',
        borderRadius: 'var(--radius-md)',
        background: on ? 'var(--yellow)' : 'transparent',
        color: 'var(--text-primary)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 15
    }), n);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--text-secondary)',
      padding: '24px 10px 8px'
    }
  }, "Active matters"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, MATTERS.map(m => {
    const on = m.id === matterId;
    const worst = OBLIGATIONS[m.id].some(r => r.status === 'error') ? 'error' : OBLIGATIONS[m.id].some(r => r.status === 'attention') ? 'attention' : 'progress';
    return /*#__PURE__*/React.createElement("button", {
      key: m.id,
      onClick: () => onMatter(m.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-sans)',
        fontSize: 13.5,
        padding: '7px 10px',
        borderRadius: 'var(--radius-md)',
        background: on ? 'var(--bg-sunk)' : 'transparent',
        color: 'var(--text-primary)',
        fontWeight: on ? 500 : 400
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 999,
        background: dot[worst],
        flex: 'none'
      }
    }), m.name);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 10px 0',
      borderTop: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 999,
      background: 'var(--ink)',
      color: 'var(--linen)',
      display: 'grid',
      placeItems: 'center',
      fontSize: 11,
      fontWeight: 600
    }
  }, "MA"), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500
    }
  }, "Milo Anand"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-secondary)'
    }
  }, "Harcourt & Vale LLP"))));
}

/** Ink card — yellow figure, linen text. Product scale. */
function InkCard({
  eyebrow,
  value,
  label,
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ink)',
      color: 'var(--linen)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--grey-inverse)'
    }
  }, eyebrow), value !== undefined && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: '-.03em',
      color: 'var(--yellow-accent)',
      fontVariantNumeric: 'tabular-nums',
      marginTop: 6
    }
  }, value), label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.5,
      color: 'var(--linen)',
      marginTop: 4
    }
  }, label), children);
}

/** Yellow field — the one strip on a screen that carries the finding. Product scale: 12px radius, one line. */
function Field({
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--yellow)',
      borderRadius: 12,
      padding: '12px 16px',
      color: 'var(--ink)',
      ...style
    }
  }, children);
}

/** Outlined panel on paper. 12px radius. */
function Panel({
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--bg-page)',
      border: '1px solid var(--rule)',
      borderRadius: 12,
      overflow: 'hidden',
      ...style
    }
  }, rest), children);
}
const Eyebrow = ({
  children,
  inverse,
  style = {}
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 12,
    fontWeight: 500,
    color: inverse ? 'var(--grey-inverse)' : 'var(--text-secondary)',
    ...style
  }
}, children);

/** Page header — title 22px, actions right. */
function PageHeader({
  eyebrow,
  title,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 6
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 22,
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: '-.015em'
    }
  }, title)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexShrink: 0
    }
  }, actions));
}
Object.assign(window, {
  Sidebar,
  InkCard,
  Field,
  Panel,
  Eyebrow,
  PageHeader
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/workspace/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/workspace/data.jsx
try { (() => {
const MATTERS = [{
  id: 'grandblue',
  name: 'Grandblue',
  kind: 'Construction · JCT D&B 2016',
  contract: 'Contract dated 12 March 2026',
  lead: 'Milo Anand',
  next: {
    ref: '21.3',
    due: '14 Sep',
    status: 'error'
  }
}, {
  id: 'ratner',
  name: 'Ratner Associates',
  kind: 'Immigration · Sponsor licence',
  contract: 'Licence granted 3 May 2026',
  lead: 'Julian Reyes',
  next: {
    ref: '4.2',
    due: '22 Sep',
    status: 'attention'
  }
}, {
  id: 'vermilion',
  name: 'Vermilion Gate',
  kind: 'Funds · LPA',
  contract: 'LPA dated 30 January 2026',
  lead: 'Priya Nair',
  next: {
    ref: '9.1',
    due: '30 Oct',
    status: 'progress'
  }
}];
const OBLIGATIONS = {
  grandblue: [{
    id: 1,
    ref: '14.2',
    obligation: 'Written notice of Programme variation',
    owner: 'Contractor',
    due: '30 Sep',
    status: 'complete',
    label: 'Cleared'
  }, {
    id: 2,
    ref: '14.4',
    obligation: 'Revised Programme within ten Business Days',
    owner: 'Contractor',
    due: '12 Sep',
    status: 'attention',
    label: 'Action needed'
  }, {
    id: 3,
    ref: '16.1',
    obligation: "Monthly progress report to Employer's Representative",
    owner: 'Contractor',
    due: '30 Sep',
    status: 'progress',
    label: 'In progress'
  }, {
    id: 4,
    ref: '21.1',
    obligation: 'Maintain insurance per Schedule 3',
    owner: 'Contractor',
    due: 'Ongoing',
    status: 'complete',
    label: 'Cleared'
  }, {
    id: 5,
    ref: '21.3',
    obligation: 'Evidence of cover on request',
    owner: 'Contractor',
    due: '14 Sep',
    status: 'error',
    label: 'Overdue'
  }, {
    id: 6,
    ref: '24.5',
    obligation: 'Notify Employer of any subcontractor change',
    owner: 'Contractor',
    due: 'Ongoing',
    status: 'complete',
    label: 'Cleared'
  }, {
    id: 7,
    ref: '27.6',
    obligation: 'Certification of Milestone 2',
    owner: 'Employer',
    due: '28 Sep',
    status: 'progress',
    label: 'In progress'
  }, {
    id: 8,
    ref: '29.2',
    obligation: 'Interim payment within 21 days of certificate',
    owner: 'Employer',
    due: '19 Sep',
    status: 'attention',
    label: 'Action needed'
  }, {
    id: 9,
    ref: '31.4',
    obligation: 'Defects notification period commences',
    owner: 'Employer',
    due: 'TBC',
    status: 'complete',
    label: 'Cleared'
  }, {
    id: 10,
    ref: '33.1',
    obligation: 'Retention release on Practical Completion',
    owner: 'Employer',
    due: 'TBC',
    status: 'complete',
    label: 'Cleared'
  }],
  ratner: [{
    id: 1,
    ref: '4.2',
    obligation: 'Report change of migrant work address within 10 working days',
    owner: 'Sponsor',
    due: '22 Sep',
    status: 'attention',
    label: 'Action needed'
  }, {
    id: 2,
    ref: '4.5',
    obligation: 'Retain right-to-work evidence for each sponsored worker',
    owner: 'Sponsor',
    due: 'Ongoing',
    status: 'complete',
    label: 'Cleared'
  }, {
    id: 3,
    ref: '6.1',
    obligation: 'Annual sponsor compliance self-audit',
    owner: 'Sponsor',
    due: '3 May',
    status: 'progress',
    label: 'In progress'
  }, {
    id: 4,
    ref: '7.3',
    obligation: 'Key personnel change notified to UKVI',
    owner: 'Sponsor',
    due: 'Ongoing',
    status: 'complete',
    label: 'Cleared'
  }],
  vermilion: [{
    id: 1,
    ref: '9.1',
    obligation: 'Quarterly report to Limited Partners',
    owner: 'GP',
    due: '30 Oct',
    status: 'progress',
    label: 'In progress'
  }, {
    id: 2,
    ref: '9.4',
    obligation: 'Audited accounts within 120 days of year end',
    owner: 'GP',
    due: '30 Apr',
    status: 'complete',
    label: 'Cleared'
  }, {
    id: 3,
    ref: '12.2',
    obligation: 'Capital call notice, ten Business Days',
    owner: 'GP',
    due: 'As called',
    status: 'complete',
    label: 'Cleared'
  }]
};
const ACTIVITY = [{
  status: 'complete',
  text: '24.5 marked cleared',
  meta: 'Milo · 4 Sep'
}, {
  status: 'progress',
  text: '27.6 sent for certification',
  meta: 'Julian · 3 Sep'
}, {
  status: 'error',
  text: '21.3 passed its due date',
  meta: 'System · 2 Sep'
}, {
  status: 'attention',
  text: '14.4 flagged for action',
  meta: 'Milo · 1 Sep'
}];
const countBy = (rows, s) => rows.filter(r => r.status === s).length;
const allRows = () => Object.values(OBLIGATIONS).flat();
Object.assign(window, {
  MATTERS,
  OBLIGATIONS,
  ACTIVITY,
  countBy,
  allRows
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/workspace/data.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Figure = __ds_scope.Figure;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Marker = __ds_scope.Marker;

__ds_ns.MetaLabel = __ds_scope.MetaLabel;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
