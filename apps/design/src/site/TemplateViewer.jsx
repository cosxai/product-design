// TemplateViewer — converted once from the Claude Design export (Template Viewer.dc.html); edit freely.
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
    { mode: 'on', panel: 'on' },
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
          location.href = '../ui-spec/Metaroom Components.dc.html';
        },
        portal: () => {
          location.href = '../pages/Metaroom Customer Portal.dc.html';
        },
      },
    };
  }
  page(b) {
    var seg = this.merge([this.seg('mode', ['off', 'on']), this.seg('panel', ['on', 'off'])]);
    var s = this.state,
      zh = b.zh,
      on = s.mode === 'on';
    var acts = on
      ? [
          ['crosshair', zh ? '评论模式 · 点击放置' : 'Comment mode · click to place', 0],
          ['eye', zh ? '显示已解决' : 'Show resolved', 0],
          ['check', zh ? '完成' : 'Done', 1],
        ]
      : [
          ['download', zh ? '下载' : 'Download', 0],
          ['share-2', zh ? '分享' : 'Share', 0],
          ['message-square', zh ? '评论' : 'Comment', 0],
          ['presentation', zh ? '演示' : 'Present', 0],
        ];
    return Object.assign(seg, {
      pv: this.pv(b.dark ? 'ink' : 'paper'),
      acts: acts.map(function (a) {
        return { icon: a[0], label: a[1], bg: a[2] ? '#FFD166' : 'transparent', fg: a[2] ? '#111' : '#F5F2EC' };
      }),
      panelD: s.panel === 'on' ? 'flex' : 'none',
      cursor: on ? 'crosshair' : 'default',
    });
  }
  renderVals() {
    var b = this.base();
    return Object.assign(b, this.page(b));
  }
}

export const pageCss = '';

export default function TemplateViewer(props) {
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
            <SiteNav lang={v.lang} current="viewer" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>页面模板 · 查看器</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Templates · Viewer</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>页面在中间，评论在右，操作栏在下</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    The page in the middle, comments on the right, the action bar below
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
                    文档、表格、邮件共用一个查看器。水印、评论钉和缩放叠在页面上；进入评论模式后，操作栏换成模式状态。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Documents, sheets and emails share one viewer. The watermark, pins and zoom sit over the page; in comment mode the
                    action bar switches to the mode state.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Metaroom</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Metaroom</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>切换评论模式和评论面板。</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Toggle comment mode and the comments panel.
                  </span>
                </p>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '580px',
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
                  <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        height: '48px',
                        flex: 'none',
                        borderBottom: '1px solid var(--rule)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '0 18px',
                        fontSize: '13px',
                      }}
                    >
                      <span>Harbour Series A</span>
                      <span style={{ color: 'var(--text-secondary)' }}>/</span>
                      <span style={{ fontWeight: '500' }}>Shareholder agreement v3</span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '2px 5px',
                          borderRadius: '4px',
                          background: 'var(--bg-sunk)',
                        }}
                      >
                        PDF
                      </span>
                    </div>
                    <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
                      <div
                        style={{
                          flex: '1',
                          position: 'relative',
                          background: 'var(--bg-sunk)',
                          display: 'flex',
                          justifyContent: 'center',
                          paddingTop: '20px',
                          overflow: 'hidden',
                          cursor: v.cursor,
                        }}
                      >
                        {' '}
                        <div
                          style={{
                            width: '380px',
                            height: '480px',
                            background: '#FEFDFB',
                            boxShadow: '0 0 0 1px rgba(17,17,17,.06)',
                            padding: '40px 44px',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '9px',
                            position: 'relative',
                          }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>7. Transfer of shares</span>
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '96%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '100%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '92%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '98%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '60%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '0%', marginTop: '6px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '100%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '94%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '97%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '88%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '100%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '40%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '0%', marginTop: '6px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '99%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '95%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '100%', marginTop: '0px' }} />
                          <span style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: '70%', marginTop: '0px' }} />
                          <span
                            style={{
                              position: 'absolute',
                              left: '220px',
                              top: '120px',
                              width: '24px',
                              height: '24px',
                              borderRadius: '999px 999px 999px 4px',
                              background: '#FFD166',
                              color: '#111',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '11px',
                              fontWeight: '600',
                            }}
                          >
                            1
                          </span>
                          <span
                            style={{
                              position: 'absolute',
                              left: '110px',
                              top: '250px',
                              width: '24px',
                              height: '24px',
                              borderRadius: '999px 999px 999px 4px',
                              background: '#111',
                              color: '#F5F2EC',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '11px',
                              fontWeight: '600',
                            }}
                          >
                            2
                          </span>
                        </div>{' '}
                        <div
                          style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: '18px',
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
                                    background: s1.a?.bg,
                                    color: s1.a?.fg,
                                  }}
                                >
                                  <DS.Icon name={s1.a?.icon} size={15} />
                                  {show(s1.a?.label)}
                                </span>
                              </Fragment>
                            );
                          })}
                        </div>{' '}
                        <div
                          style={{
                            position: 'absolute',
                            right: '16px',
                            bottom: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            height: '36px',
                            padding: '0 12px',
                            borderRadius: '999px',
                            background: 'var(--bg-page)',
                            boxShadow: '0 0 0 1px var(--rule)',
                            fontSize: '12px',
                            fontWeight: '500',
                            gap: '10px',
                          }}
                        >
                          <DS.Icon name="minus" size={13} />
                          100%
                          <DS.Icon name="plus" size={13} />
                        </div>
                      </div>
                      <div
                        style={{
                          width: '260px',
                          flex: 'none',
                          borderLeft: '1px solid var(--rule)',
                          display: v.panelD,
                          flexDirection: 'column',
                          background: 'var(--bg-page)',
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: '500', padding: '14px 16px' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>评论</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Comments</span>
                          {' · 2'}
                        </span>
                        <div style={{ display: 'flex', gap: '10px', padding: '12px 16px', borderTop: '1px solid var(--rule-soft)' }}>
                          <span
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '999px 999px 999px 4px',
                              background: '#FFD166',
                              color: '#111',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '10px',
                              fontWeight: '600',
                              flex: 'none',
                            }}
                          >
                            1
                          </span>
                          <span style={{ fontSize: '13px', lineHeight: '1.5' }}>
                            <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>7.2 条是否包括家族信托？</span>
                            <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                              Does 7.2 cover a family trust?
                            </span>
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', padding: '12px 16px', borderTop: '1px solid var(--rule-soft)' }}>
                          <span
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '999px 999px 999px 4px',
                              background: '#111',
                              color: '#F5F2EC',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '10px',
                              fontWeight: '600',
                              flex: 'none',
                            }}
                          >
                            2
                          </span>
                          <span style={{ fontSize: '13px', lineHeight: '1.5' }}>
                            <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>请确认领售门槛是 75%。</span>
                            <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                              Please confirm drag-along is 75%.
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '18px 20px', borderTop: '1px solid var(--rule)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>评论模式</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Comment mode</span>
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
                        onClick={v.set?.mode_off}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.mode_off?.bg,
                          color: v.on?.mode_off?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>关</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Off</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.mode_on}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.mode_on?.bg,
                          color: v.on?.mode_on?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>开</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>On</span>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>评论面板</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Comments panel</span>
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
                        onClick={v.set?.panel_on}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.panel_on?.bg,
                          color: v.on?.panel_on?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>显示</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Shown</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.panel_off}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.panel_off?.bg,
                          color: v.on?.panel_off?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>隐藏</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Hidden</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>页头</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Header</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      面包屑到文件名，后接格式和状态；星标在最右。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Breadcrumb to the file name, then format and state; the star far right.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>画布</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Canvas</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      亚麻底上的纸面页面；页码和尺寸在页面上方。水印用 7% 墨色。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Paper pages on linen; page number and size above. Watermark at 7% ink.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>操作栏</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Action bar</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      下载、分享、评论、演示；评论模式时变为模式状态，带“完成”。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Download, Share, Comment, Present; in comment mode it becomes the mode state with Done.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>缩放</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Zoom</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>右下胶囊：−、比例、+、适合页面。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Bottom-right pill: minus, percentage, plus, fit page.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>评论</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Comments</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      右侧 340 面板，按未解决 / 已解决分组；点击跳到评论钉。手机上为底部抽屉。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      A 340 panel grouped by open and resolved; click to jump to the pin. A bottom sheet on phones.
                    </span>
                  </span>
                </div>
              </div>
              <a
                href="../pages/Metaroom Customer Portal.dc.html#viewer"
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
