// Logo — converted once from the Claude Design export (Logo.dc.html); edit freely.
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

export default function Logo(props) {
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
            <SiteNav lang={v.lang} current="logo" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>品牌 · 标志</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Brand · Logo</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>标志的颜色来自底色，不来自标志本身</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    The logo takes its colour from the ground, never from the mark
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
                    字标 COSX 中的 CO 是一条连续的余弦 · 无穷线；图标就是这条线本身。纸、亚麻和黄色上用墨色，墨色上用白色。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    In the COSX wordmark the CO is one continuous cosine-infinity loop; the icon is the loop alone. Ink on paper, linen and
                    the yellow; white on ink.
                  </span>
                </p>
              </div>
              <div
                id="marks"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>两种形式</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Two forms</span>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      borderRadius: '16px',
                      background: 'var(--paper)',
                      minHeight: '160px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px',
                      boxSizing: 'border-box',
                      boxShadow: 'inset 0 0 0 1px var(--rule)',
                    }}
                  >
                    <img src="../assets/logo-wordmark.svg" alt="COSX" style={{ height: '44px', display: 'block' }} />
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>字标 · 默认使用</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Wordmark · the default</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      borderRadius: '16px',
                      background: 'var(--paper)',
                      minHeight: '160px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px',
                      boxSizing: 'border-box',
                      boxShadow: 'inset 0 0 0 1px var(--rule)',
                    }}
                  >
                    <img src="../assets/logo-icon.svg" alt="COSX" style={{ height: '64px', display: 'block' }} />
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>图标 · 空间不够或已有品牌语境时</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Icon · when space is short or the brand is already clear
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>底色</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Grounds</span>
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
                    四种底色，两种颜色的标志。标志永远不是黄色，也不做双色。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Four grounds, two colours of mark. The mark is never yellow and never two-tone.
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
                      minHeight: '160px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px',
                      boxSizing: 'border-box',
                      boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.1)',
                    }}
                  >
                    <img src="../assets/logo-wordmark.svg" alt="COSX" style={{ height: '32px', display: 'block' }} />
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
                      minHeight: '160px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <img src="../assets/logo-wordmark.svg" alt="COSX" style={{ height: '32px', display: 'block' }} />
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
                      minHeight: '160px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <img src="../assets/logo-wordmark.svg" alt="COSX" style={{ height: '32px', display: 'block' }} />
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>黄色 field</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Yellow field</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      borderRadius: '16px',
                      background: '#111111',
                      minHeight: '160px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <img src="../assets/logo-wordmark-white.svg" alt="COSX" style={{ height: '32px', display: 'block' }} />
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>墨色</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Ink</span>
                  </span>
                </div>
              </div>
              <div
                id="brandcolour"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>把品牌色放在标志旁边</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Putting the brand colour next to the mark
                  </span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>只有两种认可的方式。</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>There are two sanctioned ways.</span>
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
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>黄色方块</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Yellow tile</span>
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '12px 0' }}>
                    <span
                      style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '21px',
                        background: '#FFE3A0',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: 'block' }} />
                    </span>
                    <span
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '14px',
                        background: '#FFE3A0',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: 'block' }} />
                    </span>
                    <span
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '9px',
                        background: '#FFE3A0',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: 'block' }} />
                    </span>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: '#FFE3A0',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: 'block' }} />
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      图标占方块的 78%（图形自带约 17% 内边距），field 黄底，圆角为边长的 22%。用于应用图标、头像、网站图标、社交账号。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      The loop at 78% of the tile (the artwork carries about 17% padding), on field yellow, corner radius 22% of the side.
                      For app icons, avatars, favicons and social profiles.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>字标横线</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Lockup rule</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 0' }}>
                    <img src="../assets/logo-wordmark.svg" alt="COSX" style={{ height: '36px', display: 'block' }} />
                    <span style={{ width: '112px', height: '4px', borderRadius: '2px', background: '#FFD166' }} />
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      字标下方一条 4px accent 黄线，与字标等宽。用于封面、页脚和名片。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      A 4px accent-yellow rule under the wordmark, as wide as the mark. For covers, footers and cards.
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="space"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>留白与尺寸</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Clear space and size</span>
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
                  <div style={{ display: 'grid', placeItems: 'center', padding: '20px' }}>
                    <div
                      style={{
                        padding: '28px',
                        boxShadow: 'inset 0 0 0 1px var(--rule)',
                        borderRadius: '4px',
                        background: 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(17,17,17,.04) 6px 7px)',
                      }}
                    >
                      <img
                        src="../assets/logo-wordmark.svg"
                        alt="COSX"
                        style={{ height: '40px', display: 'block', background: 'var(--paper)' }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>四周留白不小于 CO 线圈的高度。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Clear space on every side is at least the height of the loop.
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
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', padding: '20px 0' }}>
                    <img src="../assets/logo-wordmark.svg" alt="COSX" style={{ height: '36px', display: 'block' }} />
                    <img src="../assets/logo-wordmark.svg" alt="COSX" style={{ height: '20px', display: 'block' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>100px</span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      字标最小宽度 100px；再小时改用黄色方块图标。封面上单独的线圈高度是标题字号的 0.6 倍，左对齐，距标题 40px。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Minimum wordmark width 100px; smaller than that, use the yellow tile. A bare loop above a cover headline is 0.6× the
                      headline size, left-aligned, 40px above.
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="misuse"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>错误用法</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Misuse</span>
                </h2>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '16px',
                      background: 'var(--bg-sunk)',
                      height: '140px',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: 'inset 0 3px 0 var(--status-error)',
                    }}
                  >
                    <img
                      src="../assets/logo-wordmark.svg"
                      alt="COSX"
                      style={{ height: '30px', display: 'block', filter: 'sepia(1) saturate(6) hue-rotate(5deg) brightness(1.35)' }}
                    />
                  </div>
                  <span style={{ display: 'flex', gap: '8px', fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--status-error)',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不要把标志改成黄色。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Don’t make the mark yellow.</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '16px',
                      background: 'var(--bg-sunk)',
                      height: '140px',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: 'inset 0 3px 0 var(--status-error)',
                    }}
                  >
                    <img
                      src="../assets/logo-wordmark.svg"
                      alt="COSX"
                      style={{ height: '30px', display: 'block', transform: 'scaleX(1.5)' }}
                    />
                  </div>
                  <span style={{ display: 'flex', gap: '8px', fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--status-error)',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不要拉伸或压扁。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Don’t stretch or squash it.</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '16px',
                      background: 'var(--bg-sunk)',
                      height: '140px',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: 'inset 0 3px 0 var(--status-error)',
                    }}
                  >
                    <div style={{ background: '#FFD166', padding: '18px 22px', borderRadius: '8px' }}>
                      <img src="../assets/logo-wordmark.svg" alt="COSX" style={{ height: '26px', display: 'block' }} />
                    </div>
                  </div>
                  <span style={{ display: 'flex', gap: '8px', fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--status-error)',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不要放在 accent 黄上。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Don’t place it on the accent.</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '16px',
                      background: 'var(--bg-sunk)',
                      height: '140px',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: 'inset 0 3px 0 var(--status-error)',
                    }}
                  >
                    <img
                      src="../assets/logo-wordmark.svg"
                      alt="COSX"
                      style={{ height: '30px', display: 'block', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.35))' }}
                    />
                  </div>
                  <span style={{ display: 'flex', gap: '8px', fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--status-error)',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不要加阴影、描边或特效。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>No shadows, outlines or effects.</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '16px',
                      background: 'var(--bg-sunk)',
                      height: '140px',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: 'inset 0 3px 0 var(--status-error)',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <img src="../assets/logo-icon.svg" alt="COSX" style={{ height: '30px', display: 'block' }} />
                      <span style={{ fontSize: '26px', fontWeight: '600', letterSpacing: '.02em' }}>SX</span>
                    </span>
                  </div>
                  <span style={{ display: 'flex', gap: '8px', fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--status-error)',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不要重绘或替换字形。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Don’t redraw or re-set it.</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '16px',
                      background: 'var(--bg-sunk)',
                      height: '140px',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: 'inset 0 3px 0 var(--status-error)',
                    }}
                  >
                    <div style={{ background: 'linear-gradient(135deg, #FFE3A0, #F5F2EC)', padding: '18px 22px', borderRadius: '8px' }}>
                      <img src="../assets/logo-wordmark.svg" alt="COSX" style={{ height: '26px', display: 'block' }} />
                    </div>
                  </div>
                  <span style={{ display: 'flex', gap: '8px', fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--status-error)',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不要放在渐变或照片上。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Don’t place it on gradients or busy photos.
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="files"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>文件</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Files</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>logo-wordmark.svg</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>logo-wordmark.svg</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>墨色字标，用于纸、亚麻、黄色。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Ink wordmark for paper, linen and the yellow.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>logo-wordmark-white.svg</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>logo-wordmark-white.svg</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>白色字标，用于墨色。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>White wordmark for ink.</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>logo-icon.svg</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>logo-icon.svg</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>墨色图标，也用于黄色方块。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Ink icon, also used in the yellow tile.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>logo-icon-white.svg</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>logo-icon-white.svg</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>白色图标，用于墨色。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>White icon for ink.</span>
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
