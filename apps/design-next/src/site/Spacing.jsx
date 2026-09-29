// Spacing — converted once from the Claude Design export (Spacing.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';
import SiteHeader from './SiteHeader';
import SiteNav from './SiteNav';

/* eslint-disable */
class Logic extends DCLogic {
  dict = { zh: {}, en: {} };
  state = Object.assign({ lang: this.pref('cosx-site-lang', 'en'), theme: this.pref('cosx-site-theme', 'light') }, {});
  pref(k, d) {
    try {
      return localStorage.getItem(k) || d;
    } catch (e) {
      return d;
    }
  }
  save(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }
  componentDidMount() {
    this._sync = () => this.setState({ lang: this.pref('cosx-site-lang', 'en'), theme: this.pref('cosx-site-theme', 'light') });
    window.addEventListener('storage', this._sync);
  }
  componentWillUnmount() {
    window.removeEventListener('storage', this._sync);
    clearTimeout(this._t);
  }
  pv(g) {
    var P =
      {
        paper: ['#FEFDFB', '#F5F2EC', '#ECE9E3', '#111111', '#696969', 'rgba(17,17,17,.10)', 'rgba(17,17,17,.06)', '#F7F6F4'],
        yellow: ['#FFE3A0', '#FFF1D6', '#F7D98F', '#111111', 'rgba(17,17,17,.7)', 'rgba(17,17,17,.14)', 'rgba(17,17,17,.08)', '#F7D98F'],
        ink: ['#111111', '#1B1B1B', '#232221', '#F5F2EC', '#9E9E9E', 'rgba(245,242,236,.18)', 'rgba(245,242,236,.09)', '#1F1E1D'],
      }[g] || [];
    return { bgPage: P[0], bgSunk: P[1], bgWell: P[2], tp: P[3], ts: P[4], rule: P[5], ruleSoft: P[6], hover: P[7] };
  }
  seg(key, opts) {
    var set = {},
      on = {},
      self = this;
    opts.forEach(function (o) {
      set[key + '_' + o] = function () {
        self.setState({ [key]: o });
      };
      var a = self.state[key] === o;
      on[key + '_' + o] = { bg: a ? 'var(--brand-field, var(--yellow))' : 'transparent', fg: a ? 'var(--ink)' : 'var(--text-primary)' };
    });
    return { set: set, on: on };
  }
  merge(parts) {
    var set = {},
      on = {};
    parts.forEach(function (p) {
      Object.assign(set, p.set);
      Object.assign(on, p.on);
    });
    return { set: set, on: on };
  }
  copyText(txt) {
    try {
      navigator.clipboard && navigator.clipboard.writeText(txt);
    } catch (e) {}
    this.setState({ copied: true });
    clearTimeout(this._t);
    this._t = setTimeout(() => this.setState({ copied: false }), 1400);
  }

  base() {
    var s = this.state,
      zh = s.lang === 'zh',
      dark = s.theme === 'dark';
    return {
      lang: s.lang,
      theme: s.theme,
      zh: zh,
      en: !zh,
      dark: dark,
      T: this.dict[zh ? 'zh' : 'en'],
      dz: zh ? 'inline' : 'none',
      de: zh ? 'none' : 'inline',
      htmlLang: zh ? 'zh-CN' : 'en-GB',
      modeClass: dark ? 'ink-mode' : '',
      ground: dark ? 'ink' : 'paper',
      lightD: dark ? 'none' : 'block',
      darkD: dark ? 'block' : 'none',
      copyLabel: s.copied ? (zh ? '已复制' : 'Copied') : zh ? '复制' : 'Copy',
      copyIcon: s.copied ? 'check' : 'copy',
      toggleLang: () => {
        var l = zh ? 'en' : 'zh';
        this.save('cosx-site-lang', l);
        this.setState({ lang: l });
      },
      toggleTheme: () => {
        var t = dark ? 'light' : 'dark';
        this.save('cosx-site-theme', t);
        this.setState({ theme: t });
      },
      go: {
        colour: () => {
          location.href = '/colour';
        },
        button: () => {
          location.href = '/button';
        },
        spec: () => {
          location.href = '../ui-spec/MetaRoom Components.dc.html';
        },
        portal: () => {
          location.href = '../pages/MetaRoom Customer Portal.dc.html';
        },
      },
    };
  }
  page(b) {
    return {};
  }
  renderVals() {
    var b = this.base();
    return Object.assign(b, this.page(b));
  }
}

export const pageCss = '';

export default function Spacing(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <div
        lang={v.htmlLang}
        className={v.modeClass}
        style={{
          minHeight: '100vh',
          background: 'var(--bg-page)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans-cjk)',
          fontSize: '15px',
        }}
      >
        {' '}
        <div className="sc-host" style={{ position: 'sticky', top: '0', zIndex: '20' }}>
          <SiteHeader lang={v.lang} theme={v.theme} section="foundations" onLang={v.toggleLang} onTheme={v.toggleTheme} />
        </div>{' '}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {' '}
          <div className="sc-host" style={{ position: 'sticky', top: '64px' }}>
            <SiteNav lang={v.lang} current="space" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>基础 · 间距与形状</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Foundations · Spacing and shape</span>
                </div>
                <h1
                  style={{
                    margin: '0',
                    fontSize: '44px',
                    fontWeight: '500',
                    lineHeight: '1.15',
                    letterSpacing: '-.02em',
                    textWrap: 'pretty',
                  }}
                >
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>先用留白分隔，再用线</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Whitespace separates first, rules second
                  </span>
                </h1>
                <p
                  style={{
                    margin: '0',
                    fontSize: '17px',
                    lineHeight: '1.7',
                    color: 'var(--text-secondary)',
                    maxWidth: '40em',
                    textWrap: 'pretty',
                  }}
                >
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    间距、圆角和线各有一套固定阶梯。没有阴影：层次靠下沉的底色和遮罩。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Spacing, radius and rules each follow a fixed ladder. No shadows: depth comes from sunk grounds and the scrim.
                  </span>
                </p>
              </div>
              <div
                id="spacing"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingTop: '56px',
                  paddingBottom: '20px',
                  scrollMarginTop: '80px',
                }}
              >
                <h2 style={{ margin: '0', fontSize: '26px', fontWeight: '500', lineHeight: '1.3', letterSpacing: '-.01em' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>间距</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Spacing</span>
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 70px minmax(0, 1fr)',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500' }}>--s-1</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>4px</span>
                  <span style={{ height: '16px', width: '4px', borderRadius: '4px', background: 'var(--text-primary)' }} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 70px minmax(0, 1fr)',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500' }}>--s-2</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>8px</span>
                  <span style={{ height: '16px', width: '8px', borderRadius: '4px', background: 'var(--text-primary)' }} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 70px minmax(0, 1fr)',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500' }}>--s-3</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>12px</span>
                  <span style={{ height: '16px', width: '12px', borderRadius: '4px', background: 'var(--text-primary)' }} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 70px minmax(0, 1fr)',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500' }}>--s-4</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>16px</span>
                  <span style={{ height: '16px', width: '16px', borderRadius: '4px', background: 'var(--text-primary)' }} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 70px minmax(0, 1fr)',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500' }}>--s-5</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>22px</span>
                  <span style={{ height: '16px', width: '22px', borderRadius: '4px', background: 'var(--text-primary)' }} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 70px minmax(0, 1fr)',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500' }}>--s-6</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>32px</span>
                  <span style={{ height: '16px', width: '32px', borderRadius: '4px', background: 'var(--text-primary)' }} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 70px minmax(0, 1fr)',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500' }}>--s-7</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>48px</span>
                  <span style={{ height: '16px', width: '48px', borderRadius: '4px', background: 'var(--text-primary)' }} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 70px minmax(0, 1fr)',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500' }}>--s-8</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>72px</span>
                  <span style={{ height: '16px', width: '72px', borderRadius: '4px', background: 'var(--text-primary)' }} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 70px minmax(0, 1fr)',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500' }}>--s-9</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>96px</span>
                  <span style={{ height: '16px', width: '96px', borderRadius: '4px', background: 'var(--text-primary)' }} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 70px minmax(0, 1fr)',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500' }}>--s-10</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>128px</span>
                  <span style={{ height: '16px', width: '128px', borderRadius: '4px', background: 'var(--text-primary)' }} />
                </div>
              </div>
              <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                  控件内部 4–12，组件之间 16–32，区块之间 48–96。所有画板四边留 72。
                </span>
                <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                  4 to 12 inside controls, 16 to 32 between components, 48 to 96 between sections. Every artboard has 72 margins.
                </span>
              </span>
              <div
                id="radius"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingTop: '56px',
                  paddingBottom: '20px',
                  scrollMarginTop: '80px',
                }}
              >
                <h2 style={{ margin: '0', fontSize: '26px', fontWeight: '500', lineHeight: '1.3', letterSpacing: '-.01em' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>圆角</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Radius</span>
                </h2>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(150px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span
                    style={{ height: '110px', borderRadius: '4px', background: 'var(--bg-sunk)', boxShadow: 'inset 0 0 0 1px var(--rule)' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>4px</span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>--radius-xs</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>勾选框</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Checkboxes</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span
                    style={{ height: '110px', borderRadius: '6px', background: 'var(--bg-sunk)', boxShadow: 'inset 0 0 0 1px var(--rule)' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>6px</span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>--radius-sm</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>标签、徽章</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Tags, badges</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span
                    style={{ height: '110px', borderRadius: '8px', background: 'var(--bg-sunk)', boxShadow: 'inset 0 0 0 1px var(--rule)' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>8px</span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>--radius-md</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>按钮、输入框、图表块</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Buttons, inputs, chart blocks</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span
                    style={{
                      height: '110px',
                      borderRadius: '16px',
                      background: 'var(--bg-sunk)',
                      boxShadow: 'inset 0 0 0 1px var(--rule)',
                    }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>16px</span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>--radius-lg</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>面板、卡片、对话框</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Panels, cards, dialogs</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span
                    style={{ height: '110px', borderRadius: '24px', background: '#FFE3A0', boxShadow: 'inset 0 0 0 1px var(--rule)' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>24px</span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>--radius-xl</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>整个区块、页面级色块</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Whole sections, page fields</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span
                    style={{
                      height: '110px',
                      borderRadius: '999px',
                      background: 'var(--bg-sunk)',
                      boxShadow: 'inset 0 0 0 1px var(--rule)',
                    }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>999px</span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>--radius-pill</code>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>圆点、开关轨道</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Dots, switch tracks</span>
                  </span>
                </div>
              </div>
              <div
                id="rules"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingTop: '56px',
                  paddingBottom: '20px',
                  scrollMarginTop: '80px',
                }}
              >
                <h2 style={{ margin: '0', fontSize: '26px', fontWeight: '500', lineHeight: '1.3', letterSpacing: '-.01em' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>线</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Rules</span>
                </h2>
                <p
                  style={{
                    margin: '0',
                    fontSize: '15px',
                    lineHeight: '1.7',
                    color: 'var(--text-secondary)',
                    maxWidth: '44em',
                    textWrap: 'pretty',
                  }}
                >
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    线只有三种粗细。不用左侧彩色竖线表示状态：用底色和文字。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Three weights only. No coloured left border for state: use a wash and the wording.
                  </span>
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                <div
                  style={{
                    background: 'var(--bg-page)',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    minWidth: '0',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ height: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ display: 'block', height: '1px', background: 'var(--rule)' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>1px</span>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>分隔线、边框（墨色 10% / 6%）</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Hairlines and borders, ink at 10% / 6%
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    background: 'var(--bg-page)',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    minWidth: '0',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ height: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ display: 'block', width: '40px', height: '4px', borderRadius: '2px', background: '#FFD166' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>4px</span>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>字标、眉题、数字下方的黄线</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Under the wordmark, an eyebrow or a figure
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    background: 'var(--bg-page)',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    minWidth: '0',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ height: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ display: 'block', height: '8px', borderRadius: '4px', background: 'var(--text-primary)' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>8px</span>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>色带</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Bands</span>
                  </span>
                </div>
              </div>
              <div
                id="elevation"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingTop: '56px',
                  paddingBottom: '20px',
                  scrollMarginTop: '80px',
                }}
              >
                <h2 style={{ margin: '0', fontSize: '26px', fontWeight: '500', lineHeight: '1.3', letterSpacing: '-.01em' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>层级</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Elevation</span>
                </h2>
                <p
                  style={{
                    margin: '0',
                    fontSize: '15px',
                    lineHeight: '1.7',
                    color: 'var(--text-secondary)',
                    maxWidth: '44em',
                    textWrap: 'pretty',
                  }}
                >
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    没有阴影。输入框下沉到亚麻底色，浮层用页面色放在遮罩上，悬停加深一级。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    No shadows. Inputs sink to linen, overlays are page colour on the scrim, hover deepens one step.
                  </span>
                </p>
              </div>
              <div
                style={{
                  borderRadius: '24px',
                  background: 'var(--bg-sunk)',
                  padding: '32px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '24px',
                  alignItems: 'center',
                }}
              >
                {' '}
                <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>下沉 · 输入框</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Sunk · input</span>
                  </span>
                  <div
                    style={{
                      height: '40px',
                      borderRadius: '8px',
                      background: 'var(--bg-page)',
                      boxShadow: 'inset 0 0 0 1px var(--rule)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>搜索文档</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Search documents</span>
                  </div>
                </div>{' '}
                <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>悬停 · 加深一级</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Hover · one step deeper</span>
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span
                      style={{
                        flex: '1',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '13px',
                      }}
                    >
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>默认</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Default</span>
                    </span>
                    <span
                      style={{
                        flex: '1',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'var(--bg-well)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '13px',
                      }}
                    >
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>悬停</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Hover</span>
                    </span>
                  </div>
                </div>{' '}
                <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>浮层 · 遮罩上的页面色</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Overlay · page on the scrim</span>
                  </span>
                  <div
                    style={{
                      height: '96px',
                      borderRadius: '12px',
                      background: 'rgba(17,17,17,.40)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <span style={{ width: '60%', height: '52px', borderRadius: '10px', background: 'var(--bg-page)' }} />
                  </div>
                </div>
              </div>
              <div
                id="layout"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingTop: '56px',
                  paddingBottom: '20px',
                  scrollMarginTop: '80px',
                }}
              >
                <h2 style={{ margin: '0', fontSize: '26px', fontWeight: '500', lineHeight: '1.3', letterSpacing: '-.01em' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>版式</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Layout</span>
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 200px) minmax(0, 1fr)',
                    gap: '24px',
                    padding: '16px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>区块</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Sections</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      页面由一段段 24px 圆角的区块叠成，嵌在亚麻底上：纸、黄色 field、墨色。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Pages stack sections with 24px corners inset on linen: paper, yellow field, ink.
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 200px) minmax(0, 1fr)',
                    gap: '24px',
                    padding: '16px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>眉题</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Eyebrow</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      每个区块以序号眉题开头（03 / 服务对象），再接一个标题。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Each section opens with an index eyebrow (03 / Who we serve) and one headline.
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 200px) minmax(0, 1fr)',
                    gap: '24px',
                    padding: '16px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>栅格</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Grid</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>12 列，间距 24，最大宽度 1180。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>12 columns, 24 gutter, 1180 max.</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 200px) minmax(0, 1fr)',
                    gap: '24px',
                    padding: '16px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>画板</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Artboards</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      社交图 1080 × 1350，演示 1280 × 720，四边 72。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Social 1080 × 1350, decks 1280 × 720, 72 margins.
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 200px) minmax(0, 1fr)',
                    gap: '24px',
                    padding: '16px 0',
                    borderBottom: '1px solid var(--rule-soft)',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>主操作</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Primary action</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>每个视图只有一个主按钮。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>One primary action per view.</span>
                  </span>
                </div>
              </div>
              <div
                id="usage"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingTop: '56px',
                  paddingBottom: '20px',
                  scrollMarginTop: '80px',
                }}
              >
                <h2 style={{ margin: '0', fontSize: '26px', fontWeight: '500', lineHeight: '1.3', letterSpacing: '-.01em' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>该做与不该做</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Do and don’t</span>
                </h2>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '999px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                      }}
                    >
                      <DS.Icon name="check" size={12} />
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>该做</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Do</span>
                    </span>
                  </div>
                  <div
                    style={{
                      minHeight: '150px',
                      borderRadius: '12px',
                      background: 'var(--bg-sunk)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      boxSizing: 'border-box',
                      boxShadow: 'inset 0 3px 0 var(--text-primary)',
                    }}
                  >
                    <div
                      style={{
                        width: '220px',
                        padding: '18px',
                        borderRadius: '16px',
                        background: 'var(--bg-page)',
                        boxShadow: 'inset 0 0 0 1px var(--rule)',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>边框或底色区分层级</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        A border or a ground marks depth
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      用 1px 墨色 10% 边框，或者下沉一级的底色。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Use a 1px ink-10% border or a ground one step deeper.
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '999px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'var(--status-error)',
                        color: '#fff',
                      }}
                    >
                      <DS.Icon name="x" size={12} />
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不该做</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Don’t</span>
                    </span>
                  </div>
                  <div
                    style={{
                      minHeight: '150px',
                      borderRadius: '12px',
                      background: 'var(--bg-sunk)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      boxSizing: 'border-box',
                      boxShadow: 'inset 0 3px 0 var(--status-error)',
                    }}
                  >
                    <div
                      style={{
                        width: '220px',
                        padding: '18px',
                        borderRadius: '16px',
                        background: 'var(--bg-page)',
                        boxShadow: '0 12px 32px rgba(0,0,0,.18)',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>投影卡片</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Drop-shadow card</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不用投影，悬停时不上浮、不放大。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      No shadows; nothing lifts or scales on hover.
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '999px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                      }}
                    >
                      <DS.Icon name="check" size={12} />
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>该做</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Do</span>
                    </span>
                  </div>
                  <div
                    style={{
                      minHeight: '150px',
                      borderRadius: '12px',
                      background: 'var(--bg-sunk)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      boxSizing: 'border-box',
                      boxShadow: 'inset 0 3px 0 var(--text-primary)',
                    }}
                  >
                    <div
                      style={{
                        width: '240px',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        background: '#FFF1D6',
                        color: '#111',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>等你处理 · 2 份文件</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Awaiting you · 2 files</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>状态用底色和文字表达。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      A wash and the wording carry the state.
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '999px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'var(--status-error)',
                        color: '#fff',
                      }}
                    >
                      <DS.Icon name="x" size={12} />
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不该做</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Don’t</span>
                    </span>
                  </div>
                  <div
                    style={{
                      minHeight: '150px',
                      borderRadius: '12px',
                      background: 'var(--bg-sunk)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      boxSizing: 'border-box',
                      boxShadow: 'inset 0 3px 0 var(--status-error)',
                    }}
                  >
                    <div
                      style={{
                        width: '240px',
                        padding: '14px 16px',
                        borderRadius: '4px',
                        background: 'var(--bg-page)',
                        boxShadow: 'inset 4px 0 0 #FFD166, inset 0 0 0 1px var(--rule)',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>等你处理 · 2 份文件</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Awaiting you · 2 files</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不用左侧彩色竖线。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>No coloured left border.</span>
                  </span>
                </div>
              </div>
              <footer
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '16px 32px',
                  padding: '40px 0 0',
                  marginTop: '96px',
                  borderTop: '1px solid var(--rule)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                }}
              >
                <img src="../assets/logo-wordmark.svg" alt="COSX" style={{ height: '18px', display: v.lightD }} />
                <img src="../assets/logo-wordmark-white.svg" alt="COSX" style={{ height: '18px', display: v.darkD }} />
                <span>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    {'© 2026 COSINE X LTD 保留所有权利 · '}
                    <a href="/terms">使用条款</a>
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    {'© 2026 COSINE X LTD. All rights reserved. · '}
                    <a href="/terms">Terms of use</a>
                  </span>
                </span>
                <div style={{ flex: '1' }} />
                <span>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    COSX Design System 3.0 · 最近更新 2026 年 9 月 28 日
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    COSX Design System 3.0 · Updated 28 September 2026
                  </span>
                </span>
              </footer>{' '}
            </div>
          </main>{' '}
        </div>
      </div>
    </>
  );
}
