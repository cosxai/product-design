// PatternNavigation — converted once from the Claude Design export (Pattern Navigation.dc.html); edit freely.
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
    { view: 'entity', ctx: 'open' },
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
    var seg = this.merge([this.seg('view', ['module', 'entity']), this.seg('ctx', ['open', 'closed'])]);
    var s = this.state,
      zh = b.zh,
      ent = s.view === 'entity';
    var rail = {};
    ['home', 'inbox', 'briefcase', 'file-text', 'users', 'megaphone'].forEach(function (k) {
      rail[k.replace('-', '_')] = k === 'briefcase' ? '#FFE3A0' : 'transparent';
    });
    var crumb = ent
      ? zh
        ? 'COSX Advisory / 项目 / Harbour Series A / 文档'
        : 'COSX Advisory / Projects / Harbour Series A / Documents'
      : zh
        ? 'COSX Advisory / 项目'
        : 'COSX Advisory / Projects';
    return Object.assign(seg, {
      pv: this.pv(b.dark ? 'ink' : 'paper'),
      rail: rail,
      ctxD: s.ctx === 'open' ? 'flex' : 'none',
      modD: ent ? 'none' : 'flex',
      entD: ent ? 'flex' : 'none',
      crumb: crumb,
    });
  }
  renderVals() {
    var b = this.base();
    return Object.assign(b, this.page(b));
  }
}

export const pageCss =
  '.h180:hover{background: var(--bg-well) !important}\n.h181:hover{background: var(--bg-well) !important}\n.h182:hover{background: var(--bg-well) !important}';

export default function PatternNavigation(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="PatternNavigation" precedence="page">
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
          <SiteHeader lang={v.lang} theme={v.theme} section="patterns" onLang={v.toggleLang} onTheme={v.toggleTheme} />
        </div>{' '}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {' '}
          <div className="sc-host" style={{ position: 'sticky', top: '64px' }}>
            <SiteNav lang={v.lang} current="nav" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>产品模式 · 导航</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Patterns · Navigation</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    图标栏放模块，上下文栏放当前模块的内容
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    An icon rail for modules, a context column for the current module
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
                    MetaRoom 客户门户和 Ops 工作台共用这套外壳。菜单最多两层；项目、站点这类实体进入后，上下文栏换成实体自己的菜单。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    The MetaRoom customer portal and Ops workbench share this shell. Menus go two levels deep at most; inside an entity such
                    as a project or site, the context column becomes that entity’s menu.
                  </span>
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>产品模式</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Pattern</span>
                  </span>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>已确定</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Decided</span>
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
                    切换查看模块视图、实体视图和收起状态。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Switch between a module, an entity and the collapsed state.
                  </span>
                </p>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '440px',
                    display: 'flex',
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
                  {' '}
                  <div
                    style={{
                      width: '60px',
                      flex: 'none',
                      background: 'var(--bg-sunk)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '14px 0',
                      borderRight: '1px solid var(--rule)',
                    }}
                  >
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        background: '#FFE3A0',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: 'block' }} />
                    </span>
                    <div style={{ height: '10px' }} />
                    <span
                      style={{
                        width: '40px',
                        height: '38px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: v.rail?.home,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="home" size={17} />
                    </span>
                    <span
                      style={{
                        width: '40px',
                        height: '38px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: v.rail?.inbox,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="inbox" size={17} />
                    </span>
                    <span
                      style={{
                        width: '40px',
                        height: '38px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: v.rail?.briefcase,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="briefcase" size={17} />
                    </span>
                    <span
                      style={{
                        width: '40px',
                        height: '38px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: v.rail?.file_text,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="file-text" size={17} />
                    </span>
                    <span
                      style={{
                        width: '40px',
                        height: '38px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: v.rail?.users,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="users" size={17} />
                    </span>
                    <span
                      style={{
                        width: '40px',
                        height: '38px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: v.rail?.megaphone,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="megaphone" size={17} />
                    </span>
                    <div style={{ flex: '1' }} />
                    <span
                      style={{
                        width: '40px',
                        height: '38px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'var(--ink)',
                        color: '#FFD166',
                      }}
                    >
                      <DS.Icon name="sparkles" size={16} />
                    </span>
                  </div>{' '}
                  <div
                    style={{
                      width: '232px',
                      flex: 'none',
                      borderRight: '1px solid var(--rule)',
                      padding: '16px 10px',
                      boxSizing: 'border-box',
                      display: v.ctxD,
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    {' '}
                    <div style={{ display: v.modD, flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '500', padding: '4px 8px 12px' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>项目</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Projects</span>
                      </span>
                      <span
                        style={{
                          height: '32px',
                          padding: '0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: '#FFE3A0',
                          color: '#111',
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>全部项目</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>All projects</span>
                      </span>
                      <span
                        style={{
                          height: '32px',
                          padding: '0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>我负责的</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Assigned to me</span>
                      </span>
                      <span
                        style={{
                          height: '32px',
                          padding: '0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>已归档</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Archived</span>
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', padding: '16px 10px 6px' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>最近</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Recent</span>
                      </span>
                      <span style={{ height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                        Harbour Series A
                      </span>
                      <span style={{ height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                        Kowloon Bay Fund II
                      </span>
                      <span style={{ height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                        Wang family
                      </span>
                    </div>{' '}
                    <div style={{ display: v.entD, flexDirection: 'column', gap: '2px' }}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '28px',
                          padding: '0 8px',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <DS.Icon name="arrow-left" size={13} />
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>全部项目</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>All projects</span>
                      </span>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '40px',
                          padding: '0 10px',
                          margin: '4px 0 10px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        Harbour Series A
                        <span style={{ marginLeft: 'auto', display: 'inline-flex', color: 'var(--text-secondary)' }}>
                          <DS.Icon name="chevrons-up-down" size={14} />
                        </span>
                      </span>
                      <span
                        style={{
                          height: '32px',
                          padding: '0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>概览</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Overview</span>
                      </span>
                      <span
                        style={{
                          height: '32px',
                          padding: '0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: '#FFE3A0',
                          color: '#111',
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>文档</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Documents</span>
                      </span>
                      <span
                        style={{
                          height: '32px',
                          padding: '0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>当事人</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Parties</span>
                      </span>
                      <span
                        style={{
                          height: '32px',
                          padding: '0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>时间线</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Timeline</span>
                      </span>
                      <span
                        style={{
                          height: '32px',
                          padding: '0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>分享</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Shares</span>
                      </span>
                      <div style={{ flex: '1', minHeight: '60px' }} />
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '32px',
                          padding: '0 10px',
                          fontSize: '13px',
                          borderTop: '1px solid var(--rule-soft)',
                        }}
                      >
                        <DS.Icon name="settings" size={14} />
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>项目设置</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Project settings</span>
                      </span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        height: '48px',
                        borderBottom: '1px solid var(--rule)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '0 20px',
                        fontSize: '13px',
                      }}
                    >
                      {show(v.crumb)}
                    </div>
                    <div style={{ flex: '1', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ height: '12px', width: '80%', borderRadius: '4px', background: 'var(--bg-well)' }} />
                      <span style={{ height: '12px', width: '64%', borderRadius: '4px', background: 'var(--bg-well)' }} />
                      <span style={{ height: '12px', width: '72%', borderRadius: '4px', background: 'var(--bg-well)' }} />
                      <span style={{ height: '12px', width: '58%', borderRadius: '4px', background: 'var(--bg-well)' }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '18px 20px', borderTop: '1px solid var(--rule)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>视图</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>View</span>
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
                        onClick={v.set?.view_module}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.view_module?.bg,
                          color: v.on?.view_module?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>模块</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Module</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.view_entity}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.view_entity?.bg,
                          color: v.on?.view_entity?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>实体（项目）</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Entity</span>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>上下文栏</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Context column</span>
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
                        onClick={v.set?.ctx_open}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.ctx_open?.bg,
                          color: v.on?.ctx_open?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>展开</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Open</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.ctx_closed}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.ctx_closed?.bg,
                          color: v.on?.ctx_closed?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>收起</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Collapsed</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="structure"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>结构</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Structure</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>图标栏</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Icon rail</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      60px，放品牌方块、模块、Agent 和头像。永远可见；模块只按权限显示或隐藏，不显示灰色占位。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      60px: the brand tile, modules, Agent and the avatar. Always visible; modules show or hide by permission, never as
                      greyed placeholders.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>上下文栏</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Context column</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      232px，放当前模块的视图和最近项。可以收起，偏好会记住；收起时悬停图标会弹出。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      232px: the module’s views and recent items. Collapsible and remembered; when collapsed, hovering a module shows it as
                      a flyout.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>进入实体</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Entering an entity</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      打开项目、站点这类实体后，上下文栏换成实体菜单：顶部是返回和实体切换器，中间是实体的功能，底部是实体设置。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Inside an entity such as a project or site, the column becomes its menu: back and a switcher at the top, its functions
                      in the middle, its settings at the bottom.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>两层为限</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Two levels</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      菜单最多两层。需要第三层时，改成页内标签或筛选。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Two menu levels at most. Anything deeper becomes in-page tabs or filters.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>面包屑</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Breadcrumb</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      从工作区品牌开始；超过 4 段时中间折叠。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Starts at the workspace brand; more than four segments fold in the middle.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>手机</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Mobile</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      图标栏变为底部 5 个标签；上下文栏变为一页，逐级进入。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      The rail becomes five bottom tabs; the context column becomes a page you step into.
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
                      <SpecSections only="s13" theme={v.theme} />
                    </div>
                  </>
                ) : null}
                {v.en ? (
                  <>
                    <div className="sc-host">
                      <SpecSectionsEN only="s13" theme={v.theme} />
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
                  href="../ui-spec/MetaRoom Components.dc.html#s13"
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
                  className={'h180'}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>规范 · 布局与导航</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Spec · Layout and navigation</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>完整状态与尺寸。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Every state and size.</span>
                  </span>
                </a>
                <a
                  href="../ui-spec/MetaRoom Navigation.dc.html"
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
                  className={'h181'}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>导航方案对比</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Navigation options</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>1a / 1b / 1c 与 2a 的比较。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>How 1a, 1b, 1c and 2a compared.</span>
                  </span>
                </a>
                <a
                  href="/pattern-action-bar"
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
                  className={'h182'}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>操作栏</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Action bar</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>页面动作的位置。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Where page actions live.</span>
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
