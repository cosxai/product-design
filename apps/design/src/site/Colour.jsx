// Colour — converted once from the Claude Design export (Colour.dc.html); edit freely.
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
  state = Object.assign({ lang: this.pref('cosx-site-lang', 'en'), theme: this.pref('cosx-site-theme', 'light') }, { tok: '' });
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
    var self = this,
      cp = {},
      cl = {};
    ['--paper', '--linen', '--sunk-2', '--sunk-3', '--ink', '--ink-raised', '--grey', '--grey-inverse'].forEach(function (t) {
      var k = t.replace(/^--/, '').replace(/-/g, '_');
      cp[k] = function () {
        self.setState({ tok: t });
        self.copyText('var(' + t + ')');
      };
      cl[k] = self.state.copied && self.state.tok === t ? (b.zh ? '已复制' : 'Copied') : '';
    });
    return { cp: cp, cl: cl };
  }
  renderVals() {
    var b = this.base();
    return Object.assign(b, this.page(b));
  }
}

export const pageCss = '';

export default function Colour(props) {
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
            <SiteNav lang={v.lang} current="colour" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>基础 · 颜色</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Foundations · Colour</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>纸、墨和一种黄色</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Paper, ink and one yellow</span>
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
                    纸与亚麻是页面，墨色写所有文字，黄色是唯一的彩色：大面积用浅的 field，小面积用饱和的
                    accent，永远不用来写字。点击色块可复制变量。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Paper and linen are the page, ink writes every letter, and the yellow is the only colour: the pale field for large
                    areas, the saturated accent for small ones, and never for letters. Click a swatch to copy its variable.
                  </span>
                </p>
              </div>
              <div
                id="materials"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>材料</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Materials</span>
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
                    浅端四层用于页面与下沉，深端两层用于墨色页。两种灰不能互换：纸上用 grey，墨上用 grey-inverse。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Four light steps for the page and sunk areas, two dark steps for the ink page. The two greys never swap: grey on paper,
                    grey-inverse on ink.
                  </span>
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                <button
                  type="button"
                  onClick={v.cp?.paper}
                  title="--paper"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    padding: '0',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--bg-page)',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      height: '96px',
                      width: '100%',
                      background: '#FEFDFB',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '10px 12px',
                      boxSizing: 'border-box',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#111',
                    }}
                  >
                    {show(v.cl?.paper)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '12px 14px 14px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>纸 · 页面</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Paper · page</span>
                    </span>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      --paper · #FEFDFB
                    </code>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={v.cp?.linen}
                  title="--linen"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    padding: '0',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--bg-page)',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      height: '96px',
                      width: '100%',
                      background: '#F5F2EC',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '10px 12px',
                      boxSizing: 'border-box',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#111',
                    }}
                  >
                    {show(v.cl?.linen)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '12px 14px 14px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>亚麻 · 下沉 1</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Linen · sunk 1</span>
                    </span>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      --linen · #F5F2EC
                    </code>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={v.cp?.sunk_2}
                  title="--sunk-2"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    padding: '0',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--bg-page)',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      height: '96px',
                      width: '100%',
                      background: '#ECE9E3',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '10px 12px',
                      boxSizing: 'border-box',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#111',
                    }}
                  >
                    {show(v.cl?.sunk_2)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '12px 14px 14px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>下沉 2</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Sunk 2</span>
                    </span>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      --sunk-2 · #ECE9E3
                    </code>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={v.cp?.sunk_3}
                  title="--sunk-3"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    padding: '0',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--bg-page)',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      height: '96px',
                      width: '100%',
                      background: '#E3E0DA',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '10px 12px',
                      boxSizing: 'border-box',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#111',
                    }}
                  >
                    {show(v.cl?.sunk_3)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '12px 14px 14px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>下沉 3</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Sunk 3</span>
                    </span>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      --sunk-3 · #E3E0DA
                    </code>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={v.cp?.ink}
                  title="--ink"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    padding: '0',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--bg-page)',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      height: '96px',
                      width: '100%',
                      background: '#111111',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '10px 12px',
                      boxSizing: 'border-box',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#F5F2EC',
                    }}
                  >
                    {show(v.cl?.ink)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '12px 14px 14px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>墨 · 文字与墨色页</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Ink · type and ink page</span>
                    </span>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      --ink · #111111
                    </code>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={v.cp?.ink_raised}
                  title="--ink-raised"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    padding: '0',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--bg-page)',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      height: '96px',
                      width: '100%',
                      background: '#1B1B1B',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '10px 12px',
                      boxSizing: 'border-box',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#F5F2EC',
                    }}
                  >
                    {show(v.cl?.ink_raised)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '12px 14px 14px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>墨 · 抬升</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Ink raised</span>
                    </span>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      --ink-raised · #1B1B1B
                    </code>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={v.cp?.grey}
                  title="--grey"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    padding: '0',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--bg-page)',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      height: '96px',
                      width: '100%',
                      background: '#696969',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '10px 12px',
                      boxSizing: 'border-box',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#F5F2EC',
                    }}
                  >
                    {show(v.cl?.grey)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '12px 14px 14px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>灰 · 纸上次要文字</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Grey · secondary on paper</span>
                    </span>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      --grey · #696969
                    </code>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={v.cp?.grey_inverse}
                  title="--grey-inverse"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    padding: '0',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--bg-page)',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      height: '96px',
                      width: '100%',
                      background: '#9E9E9E',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '10px 12px',
                      boxSizing: 'border-box',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#111',
                    }}
                  >
                    {show(v.cl?.grey_inverse)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '12px 14px 14px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>反白灰 · 墨上次要文字</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        Grey inverse · secondary on ink
                      </span>
                    </span>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      --grey-inverse · #9E9E9E
                    </code>
                  </span>
                </button>
              </div>
              <div
                id="yellow"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>黄色</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>The yellow</span>
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
                    同一个色相（OKLCH 85），按面积分两档。小面积需要更高饱和度才能和大面积看起来是同一种颜色。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    One hue, OKLCH 85, split by area. A small area needs more chroma to read as the same colour as a large one.
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
                  <div
                    style={{
                      height: '160px',
                      borderRadius: '12px',
                      background: '#FFE3A0',
                      padding: '20px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      color: '#111',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>Field · #FFE3A0</span>
                    <span style={{ fontSize: '22px', fontWeight: '500', lineHeight: '1.3' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        区块底色、选中的标签、墨色页上的面板
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        Section grounds, the selected tab, a panel on ink
                      </span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      大面积用。上面的文字用墨色，次要文字用 70% 墨色，不用灰。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      For large areas. Text on it is ink; secondary text is ink at 70%, never grey.
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
                    style={{
                      height: '160px',
                      borderRadius: '12px',
                      background: 'var(--bg-sunk)',
                      padding: '20px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>Accent · #FFD166</span>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '64px' }}>
                      <span style={{ flex: '1', height: '40%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      <span style={{ flex: '1', height: '55%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      <span style={{ flex: '1', height: '48%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      <span style={{ flex: '1', height: '70%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      <span style={{ flex: '1', height: '100%', borderRadius: '6px', background: '#FFD166' }} />
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '999px', background: '#FFD166' }} />
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        标记、图表中的发现、4px 线、状态点
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        The marker, the finding in a chart, 4px rules, status dots
                      </span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      小面积用。墨色页上的标题强调、按钮也用 accent。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      For small areas. On ink, headline emphasis and the button take the accent too.
                    </span>
                  </span>
                </div>
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
                  marginTop: '16px',
                }}
              >
                <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>强度阶梯</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Intensity ladder</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span
                      style={{
                        height: '56px',
                        borderRadius: '8px',
                        background: '#FFF8EA',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.06)',
                      }}
                    />
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>--yellow-1</code>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>#FFF8EA</code>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span
                      style={{
                        height: '56px',
                        borderRadius: '8px',
                        background: '#FFF3DC',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.06)',
                      }}
                    />
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>--yellow-2</code>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>#FFF3DC</code>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span
                      style={{
                        height: '56px',
                        borderRadius: '8px',
                        background: '#FFEECE',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.06)',
                      }}
                    />
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>--yellow-3</code>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>#FFEECE</code>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span
                      style={{
                        height: '56px',
                        borderRadius: '8px',
                        background: '#FFE3A0',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.06)',
                      }}
                    />
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>--yellow-4 · field</code>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>#FFE3A0</code>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span
                      style={{
                        height: '56px',
                        borderRadius: '8px',
                        background: '#FFD166',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.06)',
                      }}
                    />
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>--yellow-5 · accent</code>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>#FFD166</code>
                  </div>
                </div>
                <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    树图和单色系列按阶梯取色，图表里没有比 accent 更深的黄。另有 --yellow-light #FFF1D6 用于行高亮，--yellow-hover #F7D98F
                    用于 field 填充的悬停。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Treemaps and single-hue series step through the ladder; nothing in a chart is darker than the accent. --yellow-light
                    #FFF1D6 is for row washes and --yellow-hover #F7D98F for hover on a field fill.
                  </span>
                </span>
              </div>
              <div
                id="ink"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>墨色页</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>On ink</span>
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
                    在墨色上规则反过来：标题强调、按钮这些小面积用 accent；field 只用于墨色页上的面板。墨色页上不画标记色带。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    On ink the rule flips: headline emphasis and the button are small against the dark and take the accent; the field is
                    only for panels. No marker band on ink.
                  </span>
                </p>
              </div>
              <div
                style={{
                  borderRadius: '24px',
                  background: '#111',
                  color: '#F5F2EC',
                  padding: '48px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '32px',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#9E9E9E' }}>
                    {'03 / '}
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>研究</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Research</span>
                  </span>
                  <span style={{ fontSize: '34px', fontWeight: '500', lineHeight: '1.2', letterSpacing: '-.02em' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      47 家直接面向移民客户的机构中，<span style={{ color: '#FFD166' }}>20 家没有写明监管机构</span>
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      {'Of the 47 organisations that deal with clients directly, '}
                      <span style={{ color: '#FFD166' }}>20 name no regulator</span>
                    </span>
                  </span>
                  <div>
                    <DS.Button ground="ink">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>阅读研究</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Read the research</span>
                    </DS.Button>
                  </div>
                </div>
                <div
                  style={{
                    flex: '0 1 260px',
                    borderRadius: '16px',
                    background: '#FFE3A0',
                    color: '#111',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '44px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>117</span>
                  <span style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#111' }} />
                  <span style={{ fontSize: '13px', color: 'rgba(17,17,17,.7)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>家机构，核实于 2026 年 9 月</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      organisations, verified September 2026
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="status"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>产品状态</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Product status</span>
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
                    只用于产品界面，不出现在品牌、营销和演示中。只有黄、墨和一种红；差别由形状承担，文字始终在场。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Product UI only; never on brand, marketing or deck surfaces. Yellow, ink and one red; shape does the work and the
                    wording is always present.
                  </span>
                </p>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
                    <DS.Badge status="attention">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>需要处理</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Attention</span>
                    </DS.Badge>
                    <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>accent 填充 · 墨字</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Accent fill · ink text</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
                    <DS.Badge status="error">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>逾期 / 错误</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Error</span>
                    </DS.Badge>
                    <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>唯一的红 #E0362F</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>The one red #E0362F</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
                    <DS.Badge status="progress">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>进行中</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Progress</span>
                    </DS.Badge>
                    <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>墨色描边</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Ink outline</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
                    <DS.Badge status="complete">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>已完成</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Complete</span>
                    </DS.Badge>
                    <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>灰点</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Grey dot</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
                    <DS.Badge status="neutral">
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>中性</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Neutral</span>
                    </DS.Badge>
                    <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>灰点，未知值回落到这里</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        Grey dot; unknown values fall back here
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div
                id="semantic"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>语义变量</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Semantic variables</span>
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
                    组件只引用语义变量。切换到深色模式时，这些变量整体替换，组件本身不用改。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Components reference semantic variables only. Dark mode swaps these as a set; components don’t change.
                  </span>
                </p>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) 120px 120px minmax(0, 1fr)',
                    gap: '16px',
                    padding: '12px 20px',
                    background: 'var(--bg-sunk)',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>变量</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Variable</span>
                  </span>
                  <span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>浅色</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Light</span>
                  </span>
                  <span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>深色</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Dark</span>
                  </span>
                  <span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>用途</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Use</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) 120px 120px minmax(0, 1fr)',
                    gap: '16px',
                    padding: '12px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>--bg-page</code>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#FEFDFB',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#111111',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>页面</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Page</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) 120px 120px minmax(0, 1fr)',
                    gap: '16px',
                    padding: '12px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>--bg-sunk</code>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#F5F2EC',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#1B1B1B',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>输入框、下沉区</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Inputs, sunk areas</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) 120px 120px minmax(0, 1fr)',
                    gap: '16px',
                    padding: '12px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>--bg-well</code>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#ECE9E3',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#232221',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>更深一层</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>One step deeper</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) 120px 120px minmax(0, 1fr)',
                    gap: '16px',
                    padding: '12px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>--text-primary</code>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#111111',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#F5F2EC',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>正文</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Body text</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) 120px 120px minmax(0, 1fr)',
                    gap: '16px',
                    padding: '12px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>--text-secondary</code>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#696969',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#9E9E9E',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>次要文字、标签</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Secondary text, labels</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) 120px 120px minmax(0, 1fr)',
                    gap: '16px',
                    padding: '12px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>--rule</code>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: 'rgba(17,17,17,.10)',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: 'rgba(245,242,236,.18)',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>分隔线、边框</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Rules, borders</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) 120px 120px minmax(0, 1fr)',
                    gap: '16px',
                    padding: '12px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>--hover</code>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#F7F6F4',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: '#1F1E1D',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>悬停</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Hover</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) 120px 120px minmax(0, 1fr)',
                    gap: '16px',
                    padding: '12px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>--scrim</code>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: 'rgba(17,17,17,.40)',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: 'rgba(17,17,17,.40)',
                        boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.12)',
                      }}
                    />
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>浮层遮罩</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Overlay scrim</span>
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
                        borderRadius: '12px',
                        background: '#FFE3A0',
                        padding: '18px 22px',
                        color: '#111',
                        fontSize: '16px',
                        fontWeight: '500',
                      }}
                    >
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>黄色做底，墨色写字</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Yellow as ground, ink for type</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>黄色是底色或标记，文字总是墨色。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Yellow is a ground or a mark; type is always ink.
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
                    <div style={{ fontSize: '22px', fontWeight: '500', color: '#FFD166' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>黄色的文字</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Yellow type</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不要在纸面上用任何黄色写字。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Never set type in any yellow on paper.
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
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <DS.Button ground="paper">
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>发布</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Publish</span>
                      </DS.Button>
                      <DS.Button variant="secondary" ground="paper">
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>取消</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Cancel</span>
                      </DS.Button>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      对比由墨色承担：纸上的主按钮是墨色。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Contrast is ink’s job: the primary button on paper is ink.
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
                        height: '80px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #FFD166, #FFE3A0 60%, #FEFDFB)',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不用渐变、光晕、玻璃、纹理。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      No gradients, glow, glass or texture.
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Metaroom 中的完整规范</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Full spec in Metaroom</span>
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
                    以下内容来自 Metaroom 组件规范：更多类型、状态矩阵和业务示例。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    From the Metaroom component spec: more types, state matrices and product examples.
                  </span>
                </p>
              </div>
              <div style={{ marginTop: '8px', borderTop: '1px solid var(--rule)' }}>
                {v.zh ? (
                  <>
                    <div className="sc-host">
                      <SpecSections only="s01" theme={v.theme} />
                    </div>
                  </>
                ) : null}
                {v.en ? (
                  <>
                    <div className="sc-host">
                      <SpecSectionsEN only="s01" theme={v.theme} />
                    </div>
                  </>
                ) : null}
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
