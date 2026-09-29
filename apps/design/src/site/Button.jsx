// Button — converted once from the Claude Design export (Button.dc.html); edit freely.
import * as React from 'react';
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';
import SiteHeader from './SiteHeader';
import SiteNav from './SiteNav';
import SpecSections from './SpecSections';
import SpecSectionsEN from './SpecSectionsEN';

/* eslint-disable */
class Logic extends DCLogic {
  dict = { zh: {}, en: {} };
  state = Object.assign(
    { lang: this.pref('cosx-site-lang', 'en'), theme: this.pref('cosx-site-theme', 'light') },
    { variant: 'primary', size: 'md', gnd: 'paper', icon: 'off', dis: 'off' },
  );
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
    var DSI = DS || {},
      h = React.createElement;
    var seg = this.merge([
      this.seg('variant', ['primary', 'secondary', 'ghost', 'yellow', 'ink']),
      this.seg('size', ['sm', 'md', 'lg']),
      this.seg('gnd', ['paper', 'yellow', 'ink']),
      this.seg('icon', ['off', 'on']),
      this.seg('dis', ['off', 'on']),
    ]);
    var s = this.state,
      label = b.zh ? '分享' : 'Share';
    var code =
      '<Button' +
      (s.variant !== 'primary' ? ' variant="' + s.variant + '"' : '') +
      (s.size !== 'md' ? ' size="' + s.size + '"' : '') +
      (s.gnd !== 'paper' ? ' ground="' + s.gnd + '"' : '') +
      (s.icon === 'on' ? ' iconLeft={<Icon name="share-2" />}' : '') +
      (s.dis === 'on' ? ' disabled' : '') +
      '>' +
      label +
      '</Button>';
    return Object.assign(seg, {
      pv: this.pv(s.gnd),
      code: code,
      copyCode: () => this.copyText(code),
      pbVariant: s.variant,
      pbSize: s.size,
      pbGround: s.gnd,
      pbDisabled: s.dis === 'on',
      pbIcon: s.icon === 'on' && DSI.Icon ? h(DSI.Icon, { name: 'share-2', size: 15 }) : null,
      pbLabel: label,
    });
  }
  renderVals() {
    var b = this.base();
    return Object.assign(b, this.page(b));
  }
}

export const pageCss =
  '.h60:hover{background: var(--bg-well) !important}\n.h61:hover{background: var(--bg-well) !important}\n.h62:hover{background: var(--bg-well) !important}';

export default function Button(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="Button" precedence="page">
        {pageCss}
      </style>
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
          <SiteHeader lang={v.lang} theme={v.theme} section="components" onLang={v.toggleLang} onTheme={v.toggleTheme} />
        </div>{' '}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {' '}
          <div className="sc-host" style={{ position: 'sticky', top: '64px' }}>
            <SiteNav lang={v.lang} current="button" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>组件 · 按钮</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Components · Button</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>按钮</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Button</span>
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
                    触发一个动作。纸面和黄色上的主按钮是墨色，墨色上是黄色。每个视图只有一个主按钮。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Triggers an action. The primary is ink on paper and on the yellow, and yellow on ink. One primary per view.
                  </span>
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>核心组件</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Core component</span>
                  </span>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>稳定</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Stable</span>
                  </span>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>客户门户 · Ops</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Portal · Ops</span>
                  </span>
                </div>
              </div>
              <div
                id="example"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>示例</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Example</span>
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
                    调整下方选项，预览和代码会同步更新。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Change the options below; the preview and the code update together.
                  </span>
                </p>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden' }}>
                <div
                  style={{
                    minHeight: '220px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    padding: '48px 32px',
                    boxSizing: 'border-box',
                    '--bg-page': v.pv?.bgPage,
                    '--bg-sunk': v.pv?.bgSunk,
                    '--bg-well': v.pv?.bgWell,
                    '--text-primary': v.pv?.tp,
                    '--text-secondary': v.pv?.ts,
                    '--rule': v.pv?.rule,
                    '--rule-soft': v.pv?.ruleSoft,
                    '--hover': v.pv?.hover,
                    background: 'var(--bg-page)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <DS.Button variant={v.pbVariant} size={v.pbSize} ground={v.pbGround} disabled={v.pbDisabled} iconLeft={v.pbIcon}>
                    {show(v.pbLabel)}
                  </DS.Button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    padding: '18px 20px',
                    borderTop: '1px solid var(--rule)',
                    background: 'var(--bg-page)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>类型</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Variant</span>
                    </span>
                    <div
                      style={{
                        display: 'inline-flex',
                        flexWrap: 'wrap',
                        gap: '2px',
                        padding: '3px',
                        borderRadius: '10px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={v.set?.variant_primary}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.variant_primary?.bg,
                          color: v.on?.variant_primary?.fg,
                        }}
                      >
                        Primary
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.variant_secondary}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.variant_secondary?.bg,
                          color: v.on?.variant_secondary?.fg,
                        }}
                      >
                        Secondary
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.variant_ghost}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.variant_ghost?.bg,
                          color: v.on?.variant_ghost?.fg,
                        }}
                      >
                        Ghost
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.variant_yellow}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.variant_yellow?.bg,
                          color: v.on?.variant_yellow?.fg,
                        }}
                      >
                        Yellow
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.variant_ink}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.variant_ink?.bg,
                          color: v.on?.variant_ink?.fg,
                        }}
                      >
                        Ink
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>尺寸</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Size</span>
                    </span>
                    <div
                      style={{
                        display: 'inline-flex',
                        flexWrap: 'wrap',
                        gap: '2px',
                        padding: '3px',
                        borderRadius: '10px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={v.set?.size_sm}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.size_sm?.bg,
                          color: v.on?.size_sm?.fg,
                        }}
                      >
                        S
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.size_md}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.size_md?.bg,
                          color: v.on?.size_md?.fg,
                        }}
                      >
                        M
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.size_lg}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.size_lg?.bg,
                          color: v.on?.size_lg?.fg,
                        }}
                      >
                        L
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>底色</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Ground</span>
                    </span>
                    <div
                      style={{
                        display: 'inline-flex',
                        flexWrap: 'wrap',
                        gap: '2px',
                        padding: '3px',
                        borderRadius: '10px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={v.set?.gnd_paper}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.gnd_paper?.bg,
                          color: v.on?.gnd_paper?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>纸</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Paper</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.gnd_yellow}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.gnd_yellow?.bg,
                          color: v.on?.gnd_yellow?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>黄</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Yellow</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.gnd_ink}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.gnd_ink?.bg,
                          color: v.on?.gnd_ink?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>墨</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Ink</span>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>图标</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Icon</span>
                    </span>
                    <div
                      style={{
                        display: 'inline-flex',
                        flexWrap: 'wrap',
                        gap: '2px',
                        padding: '3px',
                        borderRadius: '10px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={v.set?.icon_off}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.icon_off?.bg,
                          color: v.on?.icon_off?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>无</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Off</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.icon_on}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.icon_on?.bg,
                          color: v.on?.icon_on?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>有</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>On</span>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不可用</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Disabled</span>
                    </span>
                    <div
                      style={{
                        display: 'inline-flex',
                        flexWrap: 'wrap',
                        gap: '2px',
                        padding: '3px',
                        borderRadius: '10px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={v.set?.dis_off}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.dis_off?.bg,
                          color: v.on?.dis_off?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>否</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>No</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.dis_on}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.dis_on?.bg,
                          color: v.on?.dis_on?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>是</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Yes</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 12px 12px 20px',
                    borderTop: '1px solid var(--rule)',
                    background: 'var(--bg-sunk)',
                  }}
                >
                  <code
                    style={{
                      flex: '1',
                      minWidth: '0',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {show(v.code)}
                  </code>
                  <button
                    type="button"
                    onClick={v.copyCode}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '30px',
                      padding: '0 10px',
                      border: 'none',
                      borderRadius: '6px',
                      background: 'var(--bg-page)',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: 'none',
                    }}
                  >
                    <DS.Icon name="copy" size={13} />
                    {show(v.copyLabel)}
                  </button>
                </div>
              </div>
              <div
                id="variants"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>变体</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Variants</span>
                </h2>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>纸面</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>On paper</span>
                  </span>
                  <div
                    style={{
                      borderRadius: '16px',
                      background: 'var(--paper)',
                      color: '#111',
                      padding: '28px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      alignItems: 'center',
                      minHeight: '100px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <DS.Button ground="paper">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>发布</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Publish</span>
                    </DS.Button>
                    <DS.Button variant="secondary" ground="paper">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>预览</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Preview</span>
                    </DS.Button>
                    <DS.Button variant="ghost" ground="paper">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>取消</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Cancel</span>
                    </DS.Button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>黄色 field</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>On the yellow field</span>
                  </span>
                  <div
                    style={{
                      borderRadius: '16px',
                      background: '#FFE3A0',
                      color: '#111',
                      padding: '28px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      alignItems: 'center',
                      minHeight: '100px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <DS.Button ground="yellow">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>发布</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Publish</span>
                    </DS.Button>
                    <DS.Button variant="secondary" ground="yellow">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>预览</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Preview</span>
                    </DS.Button>
                    <DS.Button variant="ghost" ground="yellow">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>取消</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Cancel</span>
                    </DS.Button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>墨色</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>On ink</span>
                  </span>
                  <div
                    style={{
                      borderRadius: '16px',
                      background: '#111',
                      color: '#F5F2EC',
                      padding: '28px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      alignItems: 'center',
                      minHeight: '100px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <DS.Button ground="ink">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>发布</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Publish</span>
                    </DS.Button>
                    <DS.Button variant="secondary" ground="ink">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>预览</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Preview</span>
                    </DS.Button>
                    <DS.Button variant="ghost" ground="ink">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>取消</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Cancel</span>
                    </DS.Button>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>尺寸</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Sizes</span>
                </span>
                <div
                  style={{
                    borderRadius: '16px',
                    background: 'var(--bg-sunk)',
                    color: 'var(--text-primary)',
                    padding: '28px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    alignItems: 'center',
                    minHeight: '100px',
                    boxSizing: 'border-box',
                  }}
                >
                  <DS.Button size="sm" ground={v.ground}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>分享</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Share</span>
                  </DS.Button>
                  <DS.Button ground={v.ground}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>分享</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Share</span>
                  </DS.Button>
                  <DS.Button size="lg" ground={v.ground}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>分享</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Share</span>
                  </DS.Button>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>32 · 40 · 48</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>用法</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Usage</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>一个主按钮</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>One primary</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      每个视图只放一个 Primary；其余用 Secondary 或 Ghost。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      One Primary per view; the rest are Secondary or Ghost.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>动词 + 宾语</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Verb and object</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      文案写清楚会发生什么：发布登记册、发送 4 条提醒。不用“确定”“提交”。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Say what happens: Publish register, Send 4 reminders. Not OK or Submit.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>异步结果留在按钮里</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Keep async results in place</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      进行中锁定宽度并显示转圈；成功在原位确认 1.6 秒；失败在按钮下方写原因并给重试。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      While busy, lock the width and show a spinner; confirm success in place for 1.6s; on failure explain below the button
                      and offer Retry.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>危险操作</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Destructive actions</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      永久删除用红色按钮，并放在对话框里二次确认。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Permanent deletion uses the red button inside a confirming dialog.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Yellow 类型</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>The Yellow variant</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      在任何底色上都填黄色，只用于行内需要处理的快捷操作。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Fills yellow on any ground; only for inline actions that need attention.
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="dodont"
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <DS.Button ground="paper">
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>发送邀请</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Send invite</span>
                      </DS.Button>
                      <DS.Button variant="ghost" ground="paper">
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>取消</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Cancel</span>
                      </DS.Button>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>一个主按钮，旁边是次要动作。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      One primary beside a quieter action.
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <DS.Button ground="paper">
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>发送</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Send</span>
                      </DS.Button>
                      <DS.Button ground="paper">
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>保存</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Save</span>
                      </DS.Button>
                      <DS.Button ground="paper">
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>发布</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Publish</span>
                      </DS.Button>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不要并排多个主按钮。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Don’t put several primaries side by side.
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
                    <DS.Button ground="paper">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>发布登记册</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Publish register</span>
                    </DS.Button>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>写清楚动作和对象。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Name the action and its object.</span>
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
                    <DS.Button ground="paper">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>确定</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>OK</span>
                    </DS.Button>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不用“确定”“提交”这类模糊文案。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Avoid vague labels like OK or Submit.
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="props"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>属性</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Props</span>
                </h2>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflowX: 'auto' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '12px 20px',
                    background: 'var(--bg-sunk)',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>属性</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Prop</span>
                  </span>
                  <span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>类型</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Type</span>
                  </span>
                  <span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>默认</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Default</span>
                  </span>
                  <span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>说明</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Description</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>variant</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    'primary' | 'secondary' | 'ghost' | 'yellow' | 'ink'
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>'primary'</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      视觉类型。Primary 的颜色由 ground 决定。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Visual type. The primary’s colour follows ground.
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>ground</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    'paper' | 'yellow' | 'ink'
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>'paper'</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      按钮所在的底色，决定主按钮颜色和焦点环。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      The surface it sits on; sets the primary colour and focus ring.
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>size</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    'sm' | 'md' | 'lg'
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>'md'</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>高度 32 / 40 / 48。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Height 32 / 40 / 48.</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>disabled</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    boolean
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>false</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不可用。在旁边写明原因。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Unavailable. State the reason nearby.
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>iconLeft</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    ReactNode
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>—</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>文字前的图标，14–16px。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Icon before the label, 14 to 16px.
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>iconRight</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    ReactNode
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>—</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>文字后的图标。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Icon after the label.</span>
                  </span>
                </div>
              </div>
              <div
                id="a11y"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>无障碍</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Accessibility</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>焦点</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Focus</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      2px 墨色焦点环，偏移 3px；墨色底上是黄色环。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      2px ink ring at 3px offset; yellow on ink.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>仅图标</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Icon only</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      用 IconButton，并提供 label 作为无障碍名称。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Use IconButton with a label for its accessible name.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>进行中</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Busy</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>设置 aria-busy，并阻止重复点击。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Set aria-busy and block repeat clicks.
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="metaroom"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>MetaRoom 中的完整规范</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Full spec in MetaRoom</span>
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
                    以下内容来自 MetaRoom 组件规范：更多类型、状态矩阵和业务示例。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    From the MetaRoom component spec: more types, state matrices and product examples.
                  </span>
                </p>
              </div>
              <div style={{ marginTop: '8px', borderTop: '1px solid var(--rule)' }}>
                {v.zh ? (
                  <>
                    <div className="sc-host">
                      <SpecSections only="s02" theme={v.theme} />
                    </div>
                  </>
                ) : null}
                {v.en ? (
                  <>
                    <div className="sc-host">
                      <SpecSectionsEN only="s02" theme={v.theme} />
                    </div>
                  </>
                ) : null}
              </div>
              <div
                id="related"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>相关</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Related</span>
                </h2>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'stretch',
                }}
              >
                <a
                  href="/dialog"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    padding: '18px 20px',
                    borderRadius: '16px',
                    background: 'var(--bg-sunk)',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    height: '100%',
                    boxSizing: 'border-box',
                  }}
                  className={'h60'}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>对话框</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Dialog</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>危险操作在对话框里确认。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Confirm destructive actions in a dialog.
                    </span>
                  </span>
                </a>
                <a
                  href="../ui-spec/MetaRoom Components.dc.html#s02"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    padding: '18px 20px',
                    borderRadius: '16px',
                    background: 'var(--bg-sunk)',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    height: '100%',
                    boxSizing: 'border-box',
                  }}
                  className={'h61'}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>MetaRoom 按钮规范</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>MetaRoom button spec</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>状态矩阵与异步按钮。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>State matrix and async buttons.</span>
                  </span>
                </a>
                <a
                  href="/spacing"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    padding: '18px 20px',
                    borderRadius: '16px',
                    background: 'var(--bg-sunk)',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    height: '100%',
                    boxSizing: 'border-box',
                  }}
                  className={'h62'}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>间距与形状</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Spacing and shape</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>8px 圆角与尺寸。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>The 8px radius and sizes.</span>
                  </span>
                </a>
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
