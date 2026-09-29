// Home — converted once from the Claude Design export (Home.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';
import SiteHeader from './SiteHeader';

/* eslint-disable */
class Logic extends DCLogic {
  dict = { zh: { inLabel: '收件人' }, en: { inLabel: 'Recipient' } };
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

export const pageCss =
  '.h40:hover{background: var(--hover) !important}\n.h41:hover{background: var(--hover) !important}\n.h42:hover{background: var(--hover) !important}\n.h43:hover{background: var(--hover) !important}\n.h44:hover{background: var(--hover) !important}\n.h45:hover{background: var(--hover) !important}\n.h46:hover{background: var(--hover) !important}';

export default function Home(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="Home" precedence="page">
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
          <SiteHeader lang={v.lang} theme={v.theme} section="" onLang={v.toggleLang} onTheme={v.toggleTheme} />
        </div>{' '}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {' '}
          <main style={{ flex: '1', minWidth: '0', padding: '24px 24px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <section
                  style={{
                    '--bg-page': '#FEFDFB',
                    '--bg-sunk': '#F5F2EC',
                    '--bg-well': '#ECE9E3',
                    '--bg-chrome': '#E3E0DA',
                    '--text-primary': '#111111',
                    '--text-secondary': '#696969',
                    '--text-label': '#696969',
                    '--rule': 'rgba(17,17,17,.10)',
                    '--rule-soft': 'rgba(17,17,17,.06)',
                    '--hover': '#F7F6F4',
                    '--focus-ring': '0 0 0 3px #FEFDFB, 0 0 0 5px #111111',
                    background: '#FFE3A0',
                    color: '#111',
                    borderRadius: '24px',
                    padding: '72px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '48px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {' '}
                  <div style={{ flex: '1 1 480px', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {' '}
                    <span style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(17,17,17,.7)' }}>COSX Design System 3.0</span>{' '}
                    <h1
                      style={{
                        margin: '0',
                        fontSize: '60px',
                        fontWeight: '500',
                        lineHeight: '1.12',
                        letterSpacing: '-.025em',
                        textWrap: 'pretty',
                      }}
                    >
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        {'一套设计系统，覆盖 COSX 的品牌、官网与 '}
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
                          AI 工作台
                        </span>
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        {'One system for the COSX brand, website and '}
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
                          AI workspace
                        </span>
                      </span>
                    </h1>{' '}
                    <p style={{ margin: '0', fontSize: '18px', lineHeight: '1.7', color: 'rgba(17,17,17,.7)', maxWidth: '34em' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        暖白纸面、墨色文字、一种黄色。这里收录基础规范、组件、产品模式和页面模板，以及它们在 MetaRoom 中的用法。
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        Warm white paper, ink type and one yellow. Foundations, components, product patterns and page templates, and how
                        MetaRoom uses them.
                      </span>
                    </p>{' '}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <DS.Button size="lg" ground="yellow" onClick={v.go?.colour}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>从基础开始</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Start with foundations</span>
                      </DS.Button>
                      <DS.Button variant="secondary" size="lg" ground="yellow" onClick={v.go?.button}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>浏览组件</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Browse components</span>
                      </DS.Button>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ flex: '0 1 400px', display: 'flex', justifyContent: 'flex-end' }}>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        background: '#FEFDFB',
                        color: '#111',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px',
                        boxSizing: 'border-box',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.35' }}>
                          <span style={{ fontSize: '15px', fontWeight: '500' }}>Harbour Series A</span>
                          <span style={{ fontSize: '12px', color: '#696969' }}>
                            <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>数据室 · 214 份文档</span>
                            <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                              Data room · 214 documents
                            </span>
                          </span>
                        </div>
                      </div>{' '}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <DS.Badge status="attention">
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>等你处理</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Awaiting you</span>
                        </DS.Badge>
                        <DS.Badge status="progress">
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>处理中</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>In progress</span>
                        </DS.Badge>
                        <DS.Badge status="complete">
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>已签署</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Signed</span>
                        </DS.Badge>
                        <DS.Badge status="error">
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>已逾期</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Overdue</span>
                        </DS.Badge>
                      </div>{' '}
                      <DS.Input label={v.T?.inLabel} defaultValue="anna.k@harbour.vc" />{' '}
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <DS.Button variant="ghost" size="sm" ground="paper">
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>取消</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Cancel</span>
                        </DS.Button>
                        <DS.Button size="sm" ground="paper">
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>发送邀请</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Send invite</span>
                        </DS.Button>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '6px', paddingTop: '4px' }}>
                        <span
                          style={{
                            flex: '1',
                            height: '28px',
                            borderRadius: '6px',
                            background: '#FEFDFB',
                            boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.08)',
                          }}
                        />
                        <span
                          style={{
                            flex: '1',
                            height: '28px',
                            borderRadius: '6px',
                            background: '#F5F2EC',
                            boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.08)',
                          }}
                        />
                        <span
                          style={{
                            flex: '1',
                            height: '28px',
                            borderRadius: '6px',
                            background: '#ECE9E3',
                            boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.08)',
                          }}
                        />
                        <span
                          style={{
                            flex: '1',
                            height: '28px',
                            borderRadius: '6px',
                            background: '#FFE3A0',
                            boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.08)',
                          }}
                        />
                        <span
                          style={{
                            flex: '1',
                            height: '28px',
                            borderRadius: '6px',
                            background: '#FFD166',
                            boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.08)',
                          }}
                        />
                        <span
                          style={{
                            flex: '1',
                            height: '28px',
                            borderRadius: '6px',
                            background: '#111111',
                            boxShadow: 'inset 0 0 0 1px rgba(17,17,17,.08)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </section>
                <section
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px',
                    padding: '72px',
                    borderRadius: '24px',
                    background: 'var(--bg-sunk)',
                  }}
                >
                  <h2
                    id="start"
                    style={{ margin: '0', fontSize: '28px', fontWeight: '500', letterSpacing: '-.01em', scrollMarginTop: '80px' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>从这里开始</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Start here</span>
                  </h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                      gap: '16px',
                      alignItems: 'stretch',
                    }}
                  >
                    <a
                      href="/colour"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '24px',
                        borderRadius: '16px',
                        background: 'var(--bg-page)',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        height: '100%',
                        minHeight: '190px',
                        boxSizing: 'border-box',
                      }}
                      className={'h40'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'var(--bg-sunk)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <DS.Icon name="palette" size={18} />
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>4 页</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>4 pages</span>
                        </span>
                      </div>
                      <span style={{ fontSize: '19px', fontWeight: '500', paddingTop: '8px' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>基础</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Foundations</span>
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          颜色、字体、间距、圆角与动效，所有界面共用。
                        </span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          Colour, type, spacing, shape and motion, shared by every surface.
                        </span>
                      </span>
                    </a>
                    <a
                      href="/logo"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '24px',
                        borderRadius: '16px',
                        background: 'var(--bg-page)',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        height: '100%',
                        minHeight: '190px',
                        boxSizing: 'border-box',
                      }}
                      className={'h41'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'var(--bg-sunk)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <DS.Icon name="stamp" size={18} />
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>4 页</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>4 pages</span>
                        </span>
                      </div>
                      <span style={{ fontSize: '19px', fontWeight: '500', paddingTop: '8px' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>品牌</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Brand</span>
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          标志、黄色的使用规则、标记和语气。
                        </span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          The logo, the rules for the yellow, the marker and the voice.
                        </span>
                      </span>
                    </a>
                    <a
                      href="/button"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '24px',
                        borderRadius: '16px',
                        background: 'var(--bg-page)',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        height: '100%',
                        minHeight: '190px',
                        boxSizing: 'border-box',
                      }}
                      className={'h42'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'var(--bg-sunk)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <DS.Icon name="component" size={18} />
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>已发布 22 个</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>22 published</span>
                        </span>
                      </div>
                      <span style={{ fontSize: '19px', fontWeight: '500', paddingTop: '8px' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>组件</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Components</span>
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          每个组件一页：可交互示例、变体、用法和属性。
                        </span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          One page per component: live example, variants, usage and props.
                        </span>
                      </span>
                    </a>
                    <a
                      href="/pattern-navigation"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '24px',
                        borderRadius: '16px',
                        background: 'var(--bg-page)',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        height: '100%',
                        minHeight: '190px',
                        boxSizing: 'border-box',
                      }}
                      className={'h43'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'var(--bg-sunk)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <DS.Icon name="layout-panel-left" size={18} />
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>4 页</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>4 pages</span>
                        </span>
                      </div>
                      <span style={{ fontSize: '19px', fontWeight: '500', paddingTop: '8px' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>产品模式</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Patterns</span>
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          导航、操作栏、Agent 对话和状态，来自 MetaRoom 的规范草稿。
                        </span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          Navigation, the action bar, Agent conversation and status, from the MetaRoom spec draft.
                        </span>
                      </span>
                    </a>
                    <a
                      href="/template-sign-in"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '24px',
                        borderRadius: '16px',
                        background: 'var(--bg-page)',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        height: '100%',
                        minHeight: '190px',
                        boxSizing: 'border-box',
                      }}
                      className={'h44'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'var(--bg-sunk)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <DS.Icon name="app-window" size={18} />
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>4 个</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>4 templates</span>
                        </span>
                      </div>
                      <span style={{ fontSize: '19px', fontWeight: '500', paddingTop: '8px' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>页面模板</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Templates</span>
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          登录、设置、列表和查看器，全部是可用的页面。
                        </span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          Sign in, settings, lists and the viewer, as working pages.
                        </span>
                      </span>
                    </a>
                    <a
                      href="/writing"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '24px',
                        borderRadius: '16px',
                        background: 'var(--bg-page)',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        height: '100%',
                        minHeight: '190px',
                        boxSizing: 'border-box',
                      }}
                      className={'h45'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'var(--bg-sunk)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <DS.Icon name="pen-line" size={18} />
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>1 页</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>1 page</span>
                        </span>
                      </div>
                      <span style={{ fontSize: '19px', fontWeight: '500', paddingTop: '8px' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>内容写作</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Writing</span>
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          界面文案、日期与数字格式、中英文混排。
                        </span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          Interface copy, dates and numbers, mixed Chinese and English.
                        </span>
                      </span>
                    </a>
                    <a
                      href="/downloads"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '24px',
                        borderRadius: '16px',
                        background: 'var(--bg-page)',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        height: '100%',
                        minHeight: '190px',
                        boxSizing: 'border-box',
                      }}
                      className={'h46'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'var(--bg-sunk)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <DS.Icon name="download" size={18} />
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>1 页</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>1 page</span>
                        </span>
                      </div>
                      <span style={{ fontSize: '19px', fontWeight: '500', paddingTop: '8px' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>资源</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Resources</span>
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>标志文件、字体和设计稿。</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          Logo files, fonts and design files.
                        </span>
                      </span>
                    </a>
                  </div>
                </section>
                <section
                  style={{
                    background: '#111',
                    color: '#F5F2EC',
                    borderRadius: '24px',
                    padding: '72px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '760px' }}>
                    {' '}
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#9E9E9E' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>产品案例 · MetaRoom</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Case study · MetaRoom</span>
                    </span>{' '}
                    <h2
                      style={{
                        margin: '0',
                        fontSize: '44px',
                        fontWeight: '500',
                        lineHeight: '1.2',
                        letterSpacing: '-.02em',
                        textWrap: 'pretty',
                      }}
                    >
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        客户门户与 Ops 工作台，<span style={{ color: '#FFD166' }}>共用一套 22 节的组件规范</span>
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        {'The customer portal and the Ops workbench '}
                        <span style={{ color: '#FFD166' }}>share one 22-section spec</span>
                      </span>
                    </h2>{' '}
                    <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.7', color: '#9E9E9E' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        客户看到五个入口和自己的品牌色；Ops 成员同时服务多个客户。两边用同一套外壳、操作栏和状态语言，差别只在入口和权限。
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        Customers see five entries in their own brand colour; Ops staff serve many customers at once. Both use the same
                        shell, action bar and status language, and differ only in entries and permissions.
                      </span>
                    </p>{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '48px',
                          fontWeight: '500',
                          letterSpacing: '-.02em',
                          fontVariantNumeric: 'tabular-nums',
                          color: '#F5F2EC',
                        }}
                      >
                        22
                      </span>
                      <span style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#FFD166' }} />
                      <span style={{ fontSize: '13px', color: '#9E9E9E' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>设计系统基础组件</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Design system primitives</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '48px',
                          fontWeight: '500',
                          letterSpacing: '-.02em',
                          fontVariantNumeric: 'tabular-nums',
                          color: '#F5F2EC',
                        }}
                      >
                        22
                      </span>
                      <span style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#FFD166' }} />
                      <span style={{ fontSize: '13px', color: '#9E9E9E' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>MetaRoom 规范章节</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          Sections in the MetaRoom spec
                        </span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '48px',
                          fontWeight: '500',
                          letterSpacing: '-.02em',
                          fontVariantNumeric: 'tabular-nums',
                          color: '#F5F2EC',
                        }}
                      >
                        3
                      </span>
                      <span style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#FFD166' }} />
                      <span style={{ fontSize: '13px', color: '#9E9E9E' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          组关键页面：客户门户、Ops、登录
                        </span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          Page sets: portal, Ops, sign in
                        </span>
                      </span>
                    </div>
                  </div>{' '}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <DS.Button size="lg" ground="ink" onClick={v.go?.spec}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>查看组件规范</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Read the spec</span>
                    </DS.Button>
                    <DS.Button variant="secondary" size="lg" ground="ink" onClick={v.go?.portal}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>查看客户门户</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>See the customer portal</span>
                    </DS.Button>
                  </div>
                </section>
                <section
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px',
                    padding: '72px',
                    borderRadius: '24px',
                    background: 'var(--bg-page)',
                    boxShadow: 'inset 0 0 0 1px var(--rule)',
                  }}
                >
                  <h2
                    id="principles"
                    style={{ margin: '0', fontSize: '28px', fontWeight: '500', letterSpacing: '-.01em', scrollMarginTop: '80px' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>设计原则</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Principles</span>
                  </h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
                      gap: '16px',
                      alignItems: 'start',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        paddingTop: '18px',
                        borderTop: '1px solid var(--rule)',
                      }}
                    >
                      <span
                        style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}
                      >
                        01
                      </span>
                      <span style={{ fontSize: '18px', fontWeight: '500' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>可追溯</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Traceable</span>
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          每个数字都有出处，每个动作都有记录。
                        </span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          Every figure has a source and every action a record.
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        paddingTop: '18px',
                        borderTop: '1px solid var(--rule)',
                      }}
                    >
                      <span
                        style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}
                      >
                        02
                      </span>
                      <span style={{ fontSize: '18px', fontWeight: '500' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>保密</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Confidential by construction</span>
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          权限写在结构里：客户只看到分享给自己的内容。
                        </span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          Access is built into the structure: customers see only what is shared with them.
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        paddingTop: '18px',
                        borderTop: '1px solid var(--rule)',
                      }}
                    >
                      <span
                        style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}
                      >
                        03
                      </span>
                      <span style={{ fontSize: '18px', fontWeight: '500' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>负责</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Accountable</span>
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          对外或不可撤销的操作，由人确认后才执行。
                        </span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          Anything that leaves the workspace or can’t be undone waits for a person.
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        paddingTop: '18px',
                        borderTop: '1px solid var(--rule)',
                      }}
                    >
                      <span
                        style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}
                      >
                        04
                      </span>
                      <span style={{ fontSize: '18px', fontWeight: '500' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>平实</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Plain</span>
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          短句，事实写在前面，不用形容词造势。
                        </span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                          Short sentences, the fact first, no adjectives for effect.
                        </span>
                      </span>
                    </div>
                  </div>
                </section>
                <section
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    padding: '72px',
                    borderRadius: '24px',
                    background: 'var(--bg-sunk)',
                  }}
                >
                  <h2
                    id="changelog"
                    style={{ margin: '0', fontSize: '28px', fontWeight: '500', letterSpacing: '-.01em', scrollMarginTop: '80px' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>更新日志</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Changelog</span>
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 200px) minmax(0, 1fr)',
                        gap: '24px',
                        padding: '20px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>2026 年 9 月 28 日</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>28 September 2026</span>
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '500' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>设计系统站上线</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Design system site</span>
                        </span>
                        <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                            首页、基础 4 页、品牌 4 页、组件 10 页、产品模式 4 页、页面模板 4 页、写作与下载；中英文与深色模式。
                          </span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                            Home, four foundation, four brand, ten component, four pattern and four template pages, plus writing and
                            downloads, in Chinese and English, light and dark.
                          </span>
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 200px) minmax(0, 1fr)',
                        gap: '24px',
                        padding: '20px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>2026 年 9 月 24 日</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>24 September 2026</span>
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '500' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>MetaRoom 组件规范 v1 草案</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>MetaRoom spec v1 draft</span>
                        </span>
                        <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                            22 节组件规范，客户门户、Ops 工作台和登录页面。
                          </span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                            A 22-section component spec with customer portal, Ops and sign-in pages.
                          </span>
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 200px) minmax(0, 1fr)',
                        gap: '24px',
                        padding: '20px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>2026 年 9 月</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>September 2026</span>
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '500' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>COSX Design System 3.0</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>COSX Design System 3.0</span>
                        </span>
                        <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                            暖白纸面、墨色文字、一种黄色；Geist 单一字族；4/6/8/16/24 圆角。
                          </span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                            Warm white paper, ink type, one yellow; Geist as the single family; a 4/6/8/16/24 radius ladder.
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <div>
                <footer
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '16px 32px',
                    padding: '32px 0 16px',
                    marginTop: '48px',
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
                </footer>
              </div>{' '}
            </div>
          </main>{' '}
        </div>
      </div>
    </>
  );
}
