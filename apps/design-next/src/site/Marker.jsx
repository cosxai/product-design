// Marker — converted once from the Claude Design export (Marker.dc.html); edit freely.
import * as React from 'react';
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';
import SiteHeader from './SiteHeader';
import SiteNav from './SiteNav';

/* eslint-disable */
class Logic extends DCLogic {
  dict = { zh: {}, en: {} };
  state = Object.assign({ lang: this.pref('cosx-site-lang', 'en'), theme: this.pref('cosx-site-theme', 'light') }, { replay: 0 });
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
    var zh = b.zh,
      key = this.state.replay;
    return {
      replay: () => this.setState((s) => ({ replay: s.replay + 1 })),
      markerDemo: React.createElement(
        'span',
        {
          key: key + (zh ? 'z' : 'e'),
          className: 'rise',
          style: { fontSize: 34, fontWeight: 500, lineHeight: 1.25, letterSpacing: zh ? 0 : '-.02em' },
        },
        zh ? '117 家机构中，' : 'Of 117 organisations, ',
        React.createElement('span', { className: 'marker draw' }, zh ? '20 家没有写明监管机构' : '20 name no regulator'),
      ),
    };
  }
  renderVals() {
    var b = this.base();
    return Object.assign(b, this.page(b));
  }
}

export const pageCss = '';

export default function Marker(props) {
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
            <SiteNav lang={v.lang} current="marker" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>品牌 · 标记</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Brand · The marker</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>标记划在承载发现的那句话下面</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    The marker sits under the phrase that carries the finding
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
                    accent 黄色的荧光笔，覆盖行高的下 60%。它是 COSX 的签名：每个标题最多一处，标在有数字的短语上。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    An accent-yellow highlighter in the lower 60% of the line. It is the COSX signature: one per headline at most, on the
                    phrase with the number.
                  </span>
                </p>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>构成</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Anatomy</span>
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
                <div style={{ position: 'relative', padding: '24px 0 8px' }}>
                  <span style={{ fontSize: '48px', fontWeight: '500', letterSpacing: '-.02em', lineHeight: '1.2' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      {'其中 '}
                      <span className="marker">20 家没有写明</span>
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      {'Of these, '}
                      <span className="marker">20 name none</span>
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {'· '}
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>覆盖行高下 60%</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Lower 60% of the line</span>
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {'· '}
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      拉丁文色带从 40% 开始，中文从 50%
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Band starts at 40% for Latin, 50% for Chinese
                    </span>
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {'· '}
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>文字仍是墨色</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Type stays ink</span>
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {'· '}
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>class="marker" 或 Marker 组件</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      class="marker" or the Marker component
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="grounds"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不同底色</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>On each ground</span>
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
                    纸、亚麻、黄色上画色带。墨色上没有色带：发现直接用 accent 黄色写，黄色本身就是荧光笔。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    A band on paper, linen and the yellow. On ink there is no band: the finding is set in accent yellow, and the yellow
                    itself is the highlighter.
                  </span>
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      borderRadius: '16px',
                      background: '#FEFDFB',
                      color: '#111',
                      padding: '28px',
                      minHeight: '140px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.06)',
                    }}
                  >
                    <span style={{ fontSize: '22px', fontWeight: '500', lineHeight: '1.3' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        <span
                          style={{
                            background: 'linear-gradient(transparent 40%, #FFD166 40%, #FFD166 94%, transparent 94%)',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            padding: '0 .08em',
                            margin: '0 -.08em',
                            color: '#111',
                          }}
                        >
                          47 家
                        </span>
                        直接面向客户
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        <span
                          style={{
                            background: 'linear-gradient(transparent 40%, #FFD166 40%, #FFD166 94%, transparent 94%)',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            padding: '0 .08em',
                            margin: '0 -.08em',
                            color: '#111',
                          }}
                        >
                          47
                        </span>
                        {' deal with clients'}
                      </span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>纸</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Paper</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      borderRadius: '16px',
                      background: '#F5F2EC',
                      color: '#111',
                      padding: '28px',
                      minHeight: '140px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.06)',
                    }}
                  >
                    <span style={{ fontSize: '22px', fontWeight: '500', lineHeight: '1.3' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        <span
                          style={{
                            background: 'linear-gradient(transparent 40%, #FFD166 40%, #FFD166 94%, transparent 94%)',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            padding: '0 .08em',
                            margin: '0 -.08em',
                            color: '#111',
                          }}
                        >
                          47 家
                        </span>
                        直接面向客户
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        <span
                          style={{
                            background: 'linear-gradient(transparent 40%, #FFD166 40%, #FFD166 94%, transparent 94%)',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            padding: '0 .08em',
                            margin: '0 -.08em',
                            color: '#111',
                          }}
                        >
                          47
                        </span>
                        {' deal with clients'}
                      </span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>亚麻</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Linen</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      borderRadius: '16px',
                      background: '#FFE3A0',
                      color: '#111',
                      padding: '28px',
                      minHeight: '140px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.06)',
                    }}
                  >
                    <span style={{ fontSize: '22px', fontWeight: '500', lineHeight: '1.3' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        <span
                          style={{
                            background: 'linear-gradient(transparent 40%, #FFD166 40%, #FFD166 94%, transparent 94%)',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            padding: '0 .08em',
                            margin: '0 -.08em',
                            color: '#111',
                          }}
                        >
                          47 家
                        </span>
                        直接面向客户
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        <span
                          style={{
                            background: 'linear-gradient(transparent 40%, #FFD166 40%, #FFD166 94%, transparent 94%)',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            padding: '0 .08em',
                            margin: '0 -.08em',
                            color: '#111',
                          }}
                        >
                          47
                        </span>
                        {' deal with clients'}
                      </span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>黄色</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Yellow</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      borderRadius: '16px',
                      background: '#111111',
                      color: '#F5F2EC',
                      padding: '28px',
                      minHeight: '140px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.06)',
                    }}
                  >
                    <span style={{ fontSize: '22px', fontWeight: '500', lineHeight: '1.3' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        <span style={{ color: '#FFD166' }}>47 家</span>直接面向客户
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        <span style={{ color: '#FFD166' }}>47</span>
                        {' deal with clients'}
                      </span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>墨色</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Ink</span>
                  </span>
                </div>
              </div>
              <div
                id="motion"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>入场</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>On entry</span>
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
                <div style={{ minHeight: '90px', display: 'flex', alignItems: 'center' }}>{show(v.markerDemo)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <DS.Button variant="secondary" size="sm" ground={v.ground} onClick={v.replay}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>重播</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Replay</span>
                  </DS.Button>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      标题落定后再画出标记：640ms、ease-out、延迟 350ms。发现总是最后到达。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      The marker draws after the headline lands: 640ms, ease-out, 350ms delay. The finding arrives last.
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
                    <span style={{ fontSize: '20px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        {'117 家中 '}
                        <span className="marker">20 家没有监管</span>
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        {'Of 117, '}
                        <span className="marker">20 are unregulated</span>
                      </span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>标在带数字的短语上。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Mark the phrase that holds the number.
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
                    <span style={{ fontSize: '20px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        <span className="marker">重新定义</span>移民科技
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        <span className="marker">Redefining</span>
                        {' immigration tech'}
                      </span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不要用来强调口号或形容词。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Don’t use it to emphasise a slogan or an adjective.
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
                    <span style={{ fontSize: '20px', fontWeight: '500', color: '#111' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        {'其中 '}
                        <span
                          style={{
                            background: 'linear-gradient(transparent 40%, #FFD166 40%, #FFD166 94%, transparent 94%)',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            padding: '0 .08em',
                            margin: '0 -.08em',
                            color: '#111',
                          }}
                        >
                          20 家
                        </span>
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        {'Of these, '}
                        <span
                          style={{
                            background: 'linear-gradient(transparent 40%, #FFD166 40%, #FFD166 94%, transparent 94%)',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            padding: '0 .08em',
                            margin: '0 -.08em',
                            color: '#111',
                          }}
                        >
                          20
                        </span>
                      </span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>在浅色底上画色带。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>A band on light grounds.</span>
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
                    <div style={{ background: '#111', padding: '18px 22px', borderRadius: '12px' }}>
                      <span
                        style={{
                          fontSize: '20px',
                          fontWeight: '500',
                          color: '#111',
                          background: 'linear-gradient(transparent 40%, #FFD166 40%)',
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>其中 20 家</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Of these, 20</span>
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      墨色上不画色带：墨字在色带外会消失。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      No band on ink: ink type vanishes outside it.
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
