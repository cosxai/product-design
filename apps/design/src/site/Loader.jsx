// Loader — converted once from the Claude Design export (Loader.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';
import SiteHeader from './SiteHeader';
import SiteNav from './SiteNav';

/* eslint-disable */
class Logic extends DCLogic {
  dict = { zh: {}, en: {} };
  state = Object.assign(
    { lang: this.pref('cosx-site-lang', 'zh'), theme: this.pref('cosx-site-theme', 'light') },
    { gnd: 'paper', sz: '240', sp: '1', tr: 'on' },
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
    this._sync = () => this.setState({ lang: this.pref('cosx-site-lang', 'zh'), theme: this.pref('cosx-site-theme', 'light') });
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
          location.href = 'Colour.dc.html';
        },
        button: () => {
          location.href = 'Button.dc.html';
        },
        spec: () => {
          location.href = '../ui-spec/Metaroom Components.dc.html';
        },
        portal: () => {
          location.href = '../pages/Metaroom Customer Portal.dc.html';
        },
      },
    };
  }
  page(b) {
    var seg = this.merge([
      this.seg('gnd', ['paper', 'yellow', 'ink']),
      this.seg('sz', ['48', '96', '240']),
      this.seg('sp', ['0.6', '1', '1.6']),
      this.seg('tr', ['on', 'off']),
    ]);
    var s = this.state,
      tone = s.gnd === 'ink' ? 'accent' : 'ink';
    var code =
      '<BrandLoader size={' +
      s.sz +
      '}' +
      (tone !== 'ink' ? ' tone="' + tone + '"' : '') +
      (s.tr === 'off' ? ' track={false}' : '') +
      (s.sp !== '1' ? ' speed={' + s.sp + '}' : '') +
      ' />';
    return Object.assign(seg, {
      pv: this.pv(s.gnd),
      code: code,
      copyCode: () => this.copyText(code),
      plSize: s.sz,
      plTone: tone,
      plTrack: s.tr,
      plSpeed: s.sp,
      inkTone: b.dark ? 'linen' : 'ink',
      btnTone: b.dark ? 'ink' : 'linen',
    });
  }
  renderVals() {
    var b = this.base();
    return Object.assign(b, this.page(b));
  }
}

export const pageCss =
  '.h60:hover{background: var(--bg-well) !important}\n.h61:hover{background: var(--bg-well) !important}\n.h62:hover{background: var(--bg-well) !important}';

export default function Loader(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="Loader" precedence="page">
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
            <SiteNav lang={v.lang} current="loader" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>组件 · 加载动画</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Components · Loader</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>一笔沿着线圈跑，舒展成完整的标志</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    A stroke runs the loop and opens into the full mark
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
                    用 COSX 的 CO
                    线圈做的加载动画。短笔画沿线圈前进，减速时铺满成标志本身，停留片刻后继续。用于整页、启动页和需要品牌感的等待。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    A loading animation drawn from the COSX loop. A short stroke travels the loop, slows and opens into the mark itself,
                    holds, then runs on. For full pages, launch screens and waits that should feel like COSX.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>品牌</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Brand</span>
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
                  <DS.Loader size={v.plSize} tone={v.plTone} track={v.plTrack} speed={v.plSpeed} />
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
                        onClick={v.set?.sz_48}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.sz_48?.bg,
                          color: v.on?.sz_48?.fg,
                        }}
                      >
                        48
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.sz_96}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.sz_96?.bg,
                          color: v.on?.sz_96?.fg,
                        }}
                      >
                        96
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.sz_240}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.sz_240?.bg,
                          color: v.on?.sz_240?.fg,
                        }}
                      >
                        240
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>速度</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Speed</span>
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
                        onClick={v.set?.sp_0?.[6]}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.sp_0?.[6]?.bg,
                          color: v.on?.sp_0?.[6]?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>慢</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Slow</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.sp_1}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.sp_1?.bg,
                          color: v.on?.sp_1?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>标准</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Standard</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.sp_1?.[6]}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.sp_1?.[6]?.bg,
                          color: v.on?.sp_1?.[6]?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>快</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Fast</span>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>底轨</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Track</span>
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
                        onClick={v.set?.tr_on}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.tr_on?.bg,
                          color: v.on?.tr_on?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>显示</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>On</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.tr_off}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.tr_off?.bg,
                          color: v.on?.tr_off?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>隐藏</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Off</span>
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
                id="anatomy"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>过程</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>How it moves</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>一轮 3.4 秒，速度连续，没有跳变。</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    One cycle is 3.4 s, with continuous speed and no jumps.
                  </span>
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
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
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>1 · 跑</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>1 · Run</span>
                  </h3>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>短笔画沿线圈匀速前进 1.5 圈。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      A short stroke travels the loop 1.5 times at a steady pace.
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
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>2 · 舒展</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>2 · Open</span>
                  </h3>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      减速，同时向两端伸长，0.7 秒铺满。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      It slows and stretches both ways, filling the loop in 0.7 s.
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
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>3 · 停留</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>3 · Hold</span>
                  </h3>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      铺满时就是标志本身，停留 0.6 秒。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Filled, it is the mark itself; it holds for 0.6 s.
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
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>4 · 收回</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>4 · Close</span>
                  </h3>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>缩回短笔画，重新加速进入下一轮。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      It shrinks back to a stroke and picks up speed again.
                    </span>
                  </span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>底色</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Grounds</span>
                </h2>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
                }}
              >
                <div
                  style={{
                    borderRadius: '16px',
                    background: '#FEFDFB',
                    boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.1)',
                    minHeight: '200px',
                    padding: '20px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#696969' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>纸 · 墨色</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Paper · ink</span>
                  </span>
                  <div style={{ flex: '1', display: 'grid', placeItems: 'center' }}>
                    <DS.Loader size="120" tone="ink" />
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: '16px',
                    background: '#FFE3A0',
                    minHeight: '200px',
                    padding: '20px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(17,17,17,.7)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>黄色 field · 墨色</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Yellow field · ink</span>
                  </span>
                  <div style={{ flex: '1', display: 'grid', placeItems: 'center' }}>
                    <DS.Loader size="120" tone="ink" />
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: '16px',
                    background: '#111111',
                    minHeight: '200px',
                    padding: '20px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#9E9E9E' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>墨色 · accent 黄</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Ink · accent</span>
                  </span>
                  <div style={{ flex: '1', display: 'grid', placeItems: 'center' }}>
                    <DS.Loader size="120" tone="accent" />
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: '16px',
                    background: '#1B1B1B',
                    minHeight: '200px',
                    padding: '20px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#9E9E9E' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>墨色 · 亚麻</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Ink · linen</span>
                  </span>
                  <div style={{ flex: '1', display: 'grid', placeItems: 'center' }}>
                    <DS.Loader size="120" tone="linen" />
                  </div>
                </div>
              </div>
              <div
                id="sizes"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>尺寸</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Sizes</span>
                </h2>
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
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '40px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <DS.Loader size="96" tone={v.inkTone} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>96 px</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <DS.Loader size="64" tone={v.inkTone} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>64 px</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <DS.Loader size="48" tone={v.inkTone} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>48 px</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <DS.Loader size="32" tone={v.inkTone} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>32 px</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <DS.Loader size="24" tone={v.inkTone} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>24 px</span>
                  </div>
                </div>
                <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    宽度不小于 24 px。更小的位置用设计系统的小转圈，线圈在这个尺寸看不清。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    At least 24 px wide. Smaller places use the design system spinner; the loop can’t be read that small.
                  </span>
                </span>
              </div>
              <div
                id="inproduct"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>在产品里</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>In the product</span>
                </h2>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{ height: '200px', borderRadius: '16px', background: 'var(--bg-sunk)', display: 'grid', placeItems: 'center' }}
                  >
                    <div
                      style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '32px',
                        background: '#FFE3A0',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <DS.Loader size="96" tone="ink" />
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>桌面 App 启动页。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Desktop app launch.</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      height: '200px',
                      borderRadius: '16px',
                      background: 'var(--bg-sunk)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '14px',
                    }}
                  >
                    <DS.Loader size="64" tone={v.inkTone} />
                    <span style={{ fontSize: '15px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>正在打开 Halden Capital</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Opening Halden Capital</span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>整页加载，例如进入工作区。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Full-page loading, such as opening a workspace.
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{ height: '200px', borderRadius: '16px', background: 'var(--bg-sunk)', display: 'grid', placeItems: 'center' }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        height: '48px',
                        padding: '0 20px',
                        borderRadius: '8px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        fontSize: '15px',
                        fontWeight: '600',
                      }}
                    >
                      <DS.Loader size="30" tone={v.btnTone} track="off" />
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>正在登录</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Signing in</span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      按钮里：隐藏底轨，颜色跟随按钮文字。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      In a button: no track; the colour follows the label.
                    </span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>何时用</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>When</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      整页、启动页、进入工作区和登录这类需要品牌感的等待。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Full pages, launch screens, opening a workspace and signing in: waits that should feel like COSX.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>何时不用</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>When not</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      列表行、输入框、表格单元这类局部加载，继续用小转圈或骨架屏。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Local loading in rows, inputs and cells keeps the spinner or a skeleton.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>底轨</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Track</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      默认显示 12% 的标志作为底轨，让人一直认得出是 COSX。按钮里隐藏。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      By default a 12% mark sits underneath so it always reads as COSX. Hidden in buttons.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>颜色</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Colour</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      纸和黄色上用墨色；墨色上用 accent 黄或亚麻。不在纸上用黄色画线圈。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Ink on paper and the yellow; accent or linen on ink. Never a yellow loop on paper.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>文字</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Wording</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      旁边写明在等什么：“正在打开 Halden Capital”，不写“加载中…”。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Say what the wait is for, such as Opening Halden Capital, not Loading….
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <DS.Loader size="72" tone={v.inkTone} />
                      <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>正在打开 Halden Capital</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Opening Halden Capital</span>
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>一个加载动画，配一句具体的说明。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      One loader with a specific line of text.
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
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <DS.Loader size="48" tone={v.inkTone} />
                      <DS.Loader size="48" tone={v.inkTone} />
                      <DS.Loader size="48" tone={v.inkTone} />
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      不要在一屏里放多个；局部加载用小转圈。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Don’t put several on one screen; local loading uses the spinner.
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>size</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    number
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>48</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>宽度，单位 px，不小于 24。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Width in px, 24 or more.</span>
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>tone</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    'ink' | 'linen' | 'accent' | 'current'
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>'ink'</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>颜色，按底色选择；current 跟随文字颜色。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Colour, chosen by ground; current follows the text colour.</span>
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>track</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    boolean
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>true</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>是否显示淡色底轨。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Show the faint track.</span>
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>speed</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    number
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>1</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>速度倍数，0.6 到 1.6。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Speed multiplier, 0.6 to 1.6.</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>名称</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Name</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      带 role="img" 和 aria-label="Loading"；旁边的说明文字才是用户听到的内容。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Has role="img" and aria-label="Loading"; the line beside it is what people hear.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>减少动态效果</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Reduced motion</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>显示静止的完整标志。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Shows the full mark, still.</span>
                  </span>
                </div>
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
                  alignItems: 'start',
                  alignItems: 'stretch',
                }}
              >
                <a
                  href="Motion.dc.html"
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>动效</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Motion</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>入场与状态的节奏。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Timing for entry and state.</span>
                  </span>
                </a>
                <a
                  href="Logo.dc.html"
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>标志</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Logo</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>线圈的来源和使用规则。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Where the loop comes from and its rules.
                    </span>
                  </span>
                </a>
                <a
                  href="Pattern Status.dc.html"
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>状态</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Status</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>页面级加载与骨架。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Page-level loading and skeletons.
                    </span>
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
                <span>COSINE X LIMITED · cosx.co</span>
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
