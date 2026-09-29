// Yellow — converted once from the Claude Design export (Yellow.dc.html); edit freely.
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
          location.href = '../ui-spec/Metaroom Components.dc.html';
        },
        portal: () => {
          location.href = '../pages/Metaroom Customer Portal.dc.html';
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

export default function Yellow(props) {
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
          <SiteHeader lang={v.lang} theme={v.theme} section="brand" onLang={v.toggleLang} onTheme={v.toggleTheme} />
        </div>{' '}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {' '}
          <div className="sc-host" style={{ position: 'sticky', top: '64px' }}>
            <SiteNav lang={v.lang} current="yellow" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>品牌 · 黄色</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Brand · The yellow</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>一种黄色，按面积分三种强度</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    One yellow, three strengths by area
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
                    黄色是 COSX 唯一的彩色，但从不写字。大面积用浅的 field，小面积用饱和的 accent，行高亮用更浅的 light。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    The yellow is COSX’s only colour, and it never writes a letter. Field for large areas, accent for small ones, light for
                    row washes.
                  </span>
                </p>
              </div>
              <div
                id="area"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>面积规则</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>The area rule</span>
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
                    同一色相，面积越小饱和度越高，看起来才是同一种黄。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Same hue; the smaller the area, the more chroma it needs to read as the same yellow.
                  </span>
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                <div
                  style={{
                    borderRadius: '24px',
                    background: '#FFE3A0',
                    color: '#111',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    minHeight: '220px',
                    boxSizing: 'border-box',
                  }}
                >
                  <span style={{ fontSize: '22px', fontWeight: '500' }}>Field</span>
                  <span style={{ fontSize: '13px', color: 'rgba(17,17,17,.7)' }}>
                    {'#FFE3A0 · '}
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>区块、选中标签、面板</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Sections, the selected tab, panels
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    borderRadius: '24px',
                    background: 'var(--bg-sunk)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '220px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '999px', background: '#FFD166' }} />
                    <span style={{ width: '12px', height: '12px', borderRadius: '999px', background: '#FFD166' }} />
                    <span style={{ width: '12px', height: '12px', borderRadius: '999px', background: '#FFD166' }} />
                    <span style={{ width: '12px', height: '12px', borderRadius: '999px', background: '#FFD166' }} />
                  </div>
                  <span style={{ width: '56px', height: '4px', borderRadius: '2px', background: '#FFD166' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '18px', fontWeight: '500' }}>Accent</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {'#FFD166 · '}
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>点、线、标记</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Dots, rules, the marker</span>
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: '24px',
                    background: 'var(--bg-sunk)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '220px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ height: '22px', borderRadius: '6px', background: 'var(--bg-page)' }} />
                    <span style={{ height: '22px', borderRadius: '6px', background: '#FFF1D6' }} />
                    <span style={{ height: '22px', borderRadius: '6px', background: 'var(--bg-page)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '18px', fontWeight: '500' }}>Light</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {'#FFF1D6 · '}
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>行高亮</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Row washes</span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                id="flip"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>在墨色上翻转</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>The flip on ink</span>
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
                    墨色上的标题强调、按钮、标记都是小面积，用 accent；field 在墨色上会显得发白，只用于面板。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    On ink the headline emphasis, button and marker are small and take the accent; the field reads as cream there and is
                    kept for panels.
                  </span>
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                <div
                  style={{
                    borderRadius: '16px',
                    background: '#111',
                    minHeight: '160px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px',
                    boxSizing: 'border-box',
                    justifyContent: 'flex-start',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '500', color: '#F5F2EC', lineHeight: '1.3' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        20 家<span style={{ color: '#FFD166' }}>没有写明监管机构</span>
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        {'20 '}
                        <span style={{ color: '#FFD166' }}>name no regulator</span>
                      </span>
                    </span>
                    <span
                      style={{
                        alignSelf: 'flex-start',
                        height: '36px',
                        padding: '0 14px',
                        borderRadius: '8px',
                        background: '#FFD166',
                        color: '#111',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '13px',
                        fontWeight: '600',
                      }}
                    >
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>阅读研究</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Read the research</span>
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: '16px',
                    background: '#111',
                    minHeight: '160px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      borderRadius: '16px',
                      background: '#FFE3A0',
                      color: '#111',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '36px', fontWeight: '500' }}>117</span>
                    <span style={{ fontSize: '13px', color: 'rgba(17,17,17,.7)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>家机构</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>organisations</span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                id="charts"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>图表中的黄色</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Yellow in charts</span>
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
                    墨色是基底，accent 是发现。一张图最多两类；超过两类用强度阶梯，不加新色相。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Ink is the base, accent is the finding. Two classes at most per chart; more than two uses the ladder, not new hues.
                  </span>
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: '#FFD166' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                    <span style={{ aspectRatio: '1', borderRadius: '3px', background: 'var(--text-primary)' }} />
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      华夫图：一格一家机构，20 家为发现。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Waffle: one square per organisation; the 20 are the finding.
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
                  <div
                    style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gridTemplateRows: '1fr 1fr', gap: '4px', height: '170px' }}
                  >
                    <span style={{ gridRow: 'span 2', borderRadius: '8px', background: '#FFD166' }} />
                    <span style={{ borderRadius: '8px', background: '#FFE3A0' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      <span style={{ borderRadius: '8px', background: '#FFEECE' }} />
                      <span style={{ borderRadius: '8px', background: '#FFF3DC' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      树图：按阶梯 5 → 1 取色，没有比 accent 更深的黄。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Treemap: steps 5 to 1 on the ladder; nothing darker than the accent.
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
                    <div
                      style={{
                        borderRadius: '12px',
                        background: '#FFE3A0',
                        padding: '18px 22px',
                        color: '#111',
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>黄色区块，墨色文字</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>A yellow section with ink type</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>黄色是面积，文字是墨色。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Yellow is the area; type is ink.</span>
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
                        borderRadius: '12px',
                        background: '#F4D54A',
                        padding: '18px 22px',
                        color: '#111',
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>柠檬黄区块</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>A lemon section</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      不用柠檬黄（色相 95）；换色相正是它显得冲突的原因。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      No lemon (hue 95); the hue shift is what made it clash.
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#FFD166' }} />
                      <span style={{ fontSize: '15px' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>等你处理</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Awaiting you</span>
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>小面积用 accent。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Small areas take the accent.</span>
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
                    <div style={{ width: '100%', maxWidth: '260px', height: '110px', borderRadius: '12px', background: '#FFD166' }} />
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      不要把 accent 铺成大面积：它会显得刺眼。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Don’t spread the accent over large areas; it shouts.
                    </span>
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
