// TemplateList — converted once from the Claude Design export (Template List.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';
import SiteHeader from './SiteHeader';
import SiteNav from './SiteNav';

/* eslint-disable */
class Logic extends DCLogic {
  dict = { zh: {}, en: {} };
  state = Object.assign(
    { lang: this.pref('cosx-site-lang', 'en'), theme: this.pref('cosx-site-theme', 'light') },
    { v: 'cards', sel: [1, 2] },
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
    var seg = this.merge([this.seg('v', ['cards', 'list'])]);
    var s = this.state,
      zh = b.zh,
      self = this,
      sel = s.sel;
    var pick = {},
      ring = {},
      cb = {},
      cbRing = {},
      rowBg = {};
    for (var i = 0; i < 6; i++) {
      (function (i) {
        pick['i' + i] = function () {
          var n = sel.slice();
          var j = n.indexOf(i);
          if (j >= 0) n.splice(j, 1);
          else n.push(i);
          self.setState({ sel: n });
        };
      })(i);
      var on = sel.indexOf(i) >= 0;
      ring['i' + i] = on ? '0 0 0 2px var(--text-primary)' : 'inset 0 0 0 1px var(--rule)';
      cb['i' + i] = on ? 'var(--text-primary)' : 'var(--bg-page)';
      cbRing['i' + i] = on ? 'none' : 'inset 0 0 0 1.5px var(--rule)';
      rowBg['i' + i] = on ? 'var(--bg-sunk)' : 'transparent';
    }
    var n = sel.length;
    var acts = n
      ? [
          ['share-2', zh ? '分享' : 'Share'],
          ['folder-input', zh ? '移动' : 'Move'],
          ['trash-2', zh ? '删除' : 'Delete'],
          ['x', zh ? '取消' : 'Cancel'],
        ]
      : [
          ['plus', zh ? '新建' : 'New'],
          ['upload', zh ? '上传' : 'Upload'],
          ['square-check', zh ? '选择' : 'Select'],
        ];
    return Object.assign(seg, {
      pv: this.pv(b.dark ? 'ink' : 'paper'),
      pvGround: b.ground,
      pick: pick,
      ring: ring,
      cb: cb,
      cbRing: cbRing,
      rowBg: rowBg,
      cardsD: s.v === 'cards' ? 'grid' : 'none',
      listD: s.v === 'list' ? 'flex' : 'none',
      selD: n ? 'inline-flex' : 'none',
      selLabel: zh ? '已选 ' + n + ' 项' : n + ' selected',
      acts: acts.map(function (a) {
        return { icon: a[0], label: a[1], fg: a[0] === 'trash-2' ? '#FF8A84' : '#F5F2EC' };
      }),
    });
  }
  renderVals() {
    var b = this.base();
    return Object.assign(b, this.page(b));
  }
}

export const pageCss = '';

export default function TemplateList(props) {
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
          <SiteHeader lang={v.lang} theme={v.theme} section="templates" onLang={v.toggleLang} onTheme={v.toggleTheme} />
        </div>{' '}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {' '}
          <div className="sc-host" style={{ position: 'sticky', top: '64px' }}>
            <SiteNav lang={v.lang} current="list" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>页面模板 · 列表与文档库</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Templates · Lists</span>
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
                    卡片或列表，选中后操作栏换成选择动作
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Cards or a list; selecting swaps the action bar to selection actions
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
                    文档库、客户、任务都用这套列表：页头放页面动作，工具栏放搜索、筛选和视图切换，选择动作在底部操作栏。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Documents, clients and tasks share this list: page actions in the header, search, filters and view in the toolbar,
                    selection actions in the bottom bar.
                  </span>
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>页面模板</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Template</span>
                  </span>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>MetaRoom</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>MetaRoom</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>点击卡片或行选中；切换卡片和列表。</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Click a card or row to select it; switch between cards and list.
                  </span>
                </p>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '520px',
                    display: 'flex',
                    position: 'relative',
                    overflow: 'hidden',
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
                  <div
                    style={{
                      width: '56px',
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
                    <div style={{ height: '10px' }} />
                    <span
                      style={{
                        width: '38px',
                        height: '36px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="home" size={16} />
                    </span>
                    <span
                      style={{
                        width: '38px',
                        height: '36px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="inbox" size={16} />
                    </span>
                    <span
                      style={{
                        width: '38px',
                        height: '36px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="briefcase" size={16} />
                    </span>
                    <span
                      style={{
                        width: '38px',
                        height: '36px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: '#FFE3A0',
                        color: '#111',
                      }}
                    >
                      <DS.Icon name="file-text" size={16} />
                    </span>
                    <span
                      style={{
                        width: '38px',
                        height: '36px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="users" size={16} />
                    </span>
                  </div>
                  <div
                    style={{
                      flex: '1',
                      minWidth: '0',
                      padding: '22px 24px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '500', flex: '1' }}>Harbour Series A</span>
                      <DS.Button variant="secondary" size="sm" ground={v.pvGround}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>新建文件夹</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>New folder</span>
                      </DS.Button>
                      <DS.Button size="sm" ground={v.pvGround}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>上传</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Upload</span>
                      </DS.Button>
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '220px',
                          height: '34px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '0 10px',
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <DS.Icon name="search" size={14} />
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>搜索此文件夹</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Search this folder</span>
                      </span>
                      <span style={{ flex: '1' }} />
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
                          onClick={v.set?.v_cards}
                          style={{
                            height: '28px',
                            padding: '0 10px',
                            border: 'none',
                            borderRadius: '8px',
                            fontFamily: 'inherit',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            background: v.on?.v_cards?.bg,
                            color: v.on?.v_cards?.fg,
                          }}
                        >
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>卡片</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Cards</span>
                        </button>
                        <button
                          type="button"
                          onClick={v.set?.v_list}
                          style={{
                            height: '28px',
                            padding: '0 10px',
                            border: 'none',
                            borderRadius: '8px',
                            fontFamily: 'inherit',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            background: v.on?.v_list?.bg,
                            color: v.on?.v_list?.fg,
                          }}
                        >
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>列表</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>List</span>
                        </button>
                      </div>
                    </div>{' '}
                    <div style={{ display: v.cardsD, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={v.pick?.i0}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: '14px',
                          border: 'none',
                          padding: '0',
                          overflow: 'hidden',
                          background: 'var(--bg-page)',
                          boxShadow: v.ring?.i0,
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            height: '70px',
                            width: '100%',
                            background: 'var(--bg-sunk)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                        >
                          <DS.Icon name="file-text" size={20} />
                          <span
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: '8px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              background: v.cb?.i0,
                              boxShadow: v.cbRing?.i0,
                              color: 'var(--bg-page)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="check" size={12} />
                          </span>
                        </span>
                        <span style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Shareholder agreement v3
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>PDF</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={v.pick?.i1}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: '14px',
                          border: 'none',
                          padding: '0',
                          overflow: 'hidden',
                          background: 'var(--bg-page)',
                          boxShadow: v.ring?.i1,
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            height: '70px',
                            width: '100%',
                            background: 'var(--bg-sunk)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                        >
                          <DS.Icon name="file-spreadsheet" size={20} />
                          <span
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: '8px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              background: v.cb?.i1,
                              boxShadow: v.cbRing?.i1,
                              color: 'var(--bg-page)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="check" size={12} />
                          </span>
                        </span>
                        <span style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Cap table.xlsx
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Excel</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={v.pick?.i2}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: '14px',
                          border: 'none',
                          padding: '0',
                          overflow: 'hidden',
                          background: 'var(--bg-page)',
                          boxShadow: v.ring?.i2,
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            height: '70px',
                            width: '100%',
                            background: 'var(--bg-sunk)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                        >
                          <DS.Icon name="file-text" size={20} />
                          <span
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: '8px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              background: v.cb?.i2,
                              boxShadow: v.cbRing?.i2,
                              color: 'var(--bg-page)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="check" size={12} />
                          </span>
                        </span>
                        <span style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Investor factsheet Q3
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>PDF</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={v.pick?.i3}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: '14px',
                          border: 'none',
                          padding: '0',
                          overflow: 'hidden',
                          background: 'var(--bg-page)',
                          boxShadow: v.ring?.i3,
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            height: '70px',
                            width: '100%',
                            background: 'var(--bg-sunk)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                        >
                          <DS.Icon name="file-lock" size={20} />
                          <span
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: '8px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              background: v.cb?.i3,
                              boxShadow: v.cbRing?.i3,
                              color: 'var(--bg-page)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="check" size={12} />
                          </span>
                        </span>
                        <span style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Loan agreement.pdf
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>PDF</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={v.pick?.i4}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: '14px',
                          border: 'none',
                          padding: '0',
                          overflow: 'hidden',
                          background: 'var(--bg-page)',
                          boxShadow: v.ring?.i4,
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            height: '70px',
                            width: '100%',
                            background: 'var(--bg-sunk)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                        >
                          <DS.Icon name="mail" size={20} />
                          <span
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: '8px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              background: v.cb?.i4,
                              boxShadow: v.cbRing?.i4,
                              color: 'var(--bg-page)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="check" size={12} />
                          </span>
                        </span>
                        <span style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Re: Side letter.eml
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Email</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={v.pick?.i5}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: '14px',
                          border: 'none',
                          padding: '0',
                          overflow: 'hidden',
                          background: 'var(--bg-page)',
                          boxShadow: v.ring?.i5,
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            height: '70px',
                            width: '100%',
                            background: 'var(--bg-sunk)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                        >
                          <DS.Icon name="file-text" size={20} />
                          <span
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: '8px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              background: v.cb?.i5,
                              boxShadow: v.cbRing?.i5,
                              color: 'var(--bg-page)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="check" size={12} />
                          </span>
                        </span>
                        <span style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Board minutes 2025
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Word</span>
                        </span>
                      </button>
                    </div>{' '}
                    <div style={{ display: v.listD, flexDirection: 'column' }}>
                      <button
                        type="button"
                        onClick={v.pick?.i0}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          height: '44px',
                          padding: '0 10px',
                          border: 'none',
                          borderBottom: '1px solid var(--rule-soft)',
                          background: v.rowBg?.i0,
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            background: v.cb?.i0,
                            boxShadow: v.cbRing?.i0,
                            color: 'var(--bg-page)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="check" size={12} />
                        </span>
                        <DS.Icon name="file-text" size={15} />
                        <span style={{ flex: '1' }}>Shareholder agreement v3</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.pick?.i1}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          height: '44px',
                          padding: '0 10px',
                          border: 'none',
                          borderBottom: '1px solid var(--rule-soft)',
                          background: v.rowBg?.i1,
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            background: v.cb?.i1,
                            boxShadow: v.cbRing?.i1,
                            color: 'var(--bg-page)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="check" size={12} />
                        </span>
                        <DS.Icon name="file-spreadsheet" size={15} />
                        <span style={{ flex: '1' }}>Cap table.xlsx</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Excel</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.pick?.i2}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          height: '44px',
                          padding: '0 10px',
                          border: 'none',
                          borderBottom: '1px solid var(--rule-soft)',
                          background: v.rowBg?.i2,
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            background: v.cb?.i2,
                            boxShadow: v.cbRing?.i2,
                            color: 'var(--bg-page)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="check" size={12} />
                        </span>
                        <DS.Icon name="file-text" size={15} />
                        <span style={{ flex: '1' }}>Investor factsheet Q3</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.pick?.i3}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          height: '44px',
                          padding: '0 10px',
                          border: 'none',
                          borderBottom: '1px solid var(--rule-soft)',
                          background: v.rowBg?.i3,
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            background: v.cb?.i3,
                            boxShadow: v.cbRing?.i3,
                            color: 'var(--bg-page)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="check" size={12} />
                        </span>
                        <DS.Icon name="file-lock" size={15} />
                        <span style={{ flex: '1' }}>Loan agreement.pdf</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.pick?.i4}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          height: '44px',
                          padding: '0 10px',
                          border: 'none',
                          borderBottom: '1px solid var(--rule-soft)',
                          background: v.rowBg?.i4,
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            background: v.cb?.i4,
                            boxShadow: v.cbRing?.i4,
                            color: 'var(--bg-page)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="check" size={12} />
                        </span>
                        <DS.Icon name="mail" size={15} />
                        <span style={{ flex: '1' }}>Re: Side letter.eml</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Email</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.pick?.i5}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          height: '44px',
                          padding: '0 10px',
                          border: 'none',
                          borderBottom: '1px solid var(--rule-soft)',
                          background: v.rowBg?.i5,
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            background: v.cb?.i5,
                            boxShadow: v.cbRing?.i5,
                            color: 'var(--bg-page)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="check" size={12} />
                        </span>
                        <DS.Icon name="file-text" size={15} />
                        <span style={{ flex: '1' }}>Board minutes 2025</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Word</span>
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      left: 'calc(56px + (100% - 56px) / 2)',
                      bottom: '20px',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      padding: '5px',
                      borderRadius: '14px',
                      background: '#111',
                      color: '#F5F2EC',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        display: v.selD,
                        alignItems: 'center',
                        height: '32px',
                        padding: '0 10px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#FFD166',
                      }}
                    >
                      {show(v.selLabel)}
                    </span>
                    {list(v.acts).map((a$, $i) => {
                      const s1 = { ...v, a: a$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '7px',
                              height: '32px',
                              padding: '0 10px',
                              borderRadius: '9px',
                              fontSize: '13px',
                              fontWeight: '500',
                              color: s1.a?.fg,
                            }}
                          >
                            <DS.Icon name={s1.a?.icon} size={15} />
                            {show(s1.a?.label)}
                          </span>
                        </Fragment>
                      );
                    })}
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>页头</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Header</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      标题 + 最多 1 个主按钮和 2 个次按钮。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Title with at most one primary and two secondary buttons.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>工具栏</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Toolbar</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      搜索（写明范围）、排序、筛选、视图切换；右侧显示数量。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Search (with its scope), sort, filters and the view switch; the count on the right.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>选择</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Selection</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      卡片和行都可以整块点选，Shift 连选，Esc 取消。星标在卡片右上角，不进操作栏。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Whole cards and rows select, Shift extends, Esc clears. The star sits top right of a card, not in the bar.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>空与加载</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Empty and loading</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      骨架与最终布局一致；空状态一句话加一个动作。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Skeletons match the final layout; empty states have one line and one action.
                    </span>
                  </span>
                </div>
              </div>
              <a
                href="../pages/MetaRoom Customer Portal.dc.html#docs"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  alignSelf: 'flex-start',
                }}
              >
                <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>打开完整页面</span>
                <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Open the full page</span>
                <DS.Icon name="arrow-up-right" size={14} />
              </a>
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
