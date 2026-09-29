// Writing — converted once from the Claude Design export (Writing.dc.html); edit freely.
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

export default function Writing(props) {
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
          <SiteHeader lang={v.lang} theme={v.theme} section="" onLang={v.toggleLang} onTheme={v.toggleTheme} />
        </div>{' '}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {' '}
          <div className="sc-host" style={{ position: 'sticky', top: '64px' }}>
            <SiteNav lang={v.lang} current="writing" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>内容 · 界面写作</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Content · Writing</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>界面文案：说清楚会发生什么</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Interface copy says what will happen
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
                    语气规则见品牌页。这一页只讲产品界面：按钮、状态、错误、空状态、日期和数字。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    The voice rules live on the brand page. This page covers product UI only: buttons, states, errors, empty states, dates
                    and numbers.
                  </span>
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>内容</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Content</span>
                  </span>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>稳定</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Stable</span>
                  </span>
                </div>
              </div>
              <div
                id="buttons"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>按钮与链接</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Buttons and links</span>
                </h2>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '20px',
                    padding: '16px 20px',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>主按钮</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Primary</span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="check" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>发送 4 条提醒</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Send 4 reminders</span>
                    </span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
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
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>确定</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>OK</span>
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '20px',
                    padding: '16px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>危险操作</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Destructive</span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="check" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>永久删除</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Delete forever</span>
                    </span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
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
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>是的，我确定</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Yes, I’m sure</span>
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '20px',
                    padding: '16px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>取消</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Cancel</span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="check" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>取消</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Cancel</span>
                    </span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
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
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不，谢谢</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>No thanks</span>
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '20px',
                    padding: '16px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>链接</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Links</span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="check" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>查看 3 条评论</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>See 3 comments</span>
                    </span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
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
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>点击这里</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Click here</span>
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="states"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>状态与进度</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>States and progress</span>
                </h2>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '20px',
                    padding: '16px 20px',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>进行中</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>In progress</span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="check" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        正在整理文档 · 44 个中已完成 31 个
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        Organising documents · 31 of 44 ready
                      </span>
                    </span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
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
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>请稍候…</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Please wait…</span>
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '20px',
                    padding: '16px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>等待他人</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Waiting</span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="check" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>等 Li Wei 审批</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Waiting on Li Wei to approve</span>
                    </span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
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
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>待处理</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Pending</span>
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '20px',
                    padding: '16px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>完成</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Done</span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="check" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>3 个文件已移到归档</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>3 files moved to Archive</span>
                    </span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
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
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>操作成功！</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Success!</span>
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="errors"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>错误</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Errors</span>
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
                    写发生了什么、为什么、下一步做什么。不道歉，不责怪用户。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Say what happened, why, and what to do next. No apologies, no blaming the user.
                  </span>
                </p>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '20px',
                    padding: '16px 20px',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>网络</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Network</span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="check" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        无法连接邮件服务器。你的草稿已保存，稍后重试。
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        Couldn’t reach the mail server. Your draft is saved; try again shortly.
                      </span>
                    </span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
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
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>出错了</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Something went wrong</span>
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '20px',
                    padding: '16px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>校验</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Validation</span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="check" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>请补全域名，例如 harbour.vc</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        Add the domain, e.g. harbour.vc
                      </span>
                    </span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
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
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>邮箱格式无效</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Invalid email format</span>
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '20px',
                    padding: '16px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>权限</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Permission</span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="check" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        只有管理员可以修改。请联系 Sam Ortiz。
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        Only admins can change this. Ask Sam Ortiz.
                      </span>
                    </span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
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
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>禁止访问</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Access denied</span>
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="empty"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>空状态</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Empty states</span>
                </h2>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '20px',
                    padding: '16px 20px',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>还没有内容</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Nothing yet</span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="check" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        还没有文档。分享给你的文件和你上传的文件会出现在这里。
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        No documents yet. Files shared with you and files you upload appear here.
                      </span>
                    </span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
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
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>这里空空如也</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Nothing to see here</span>
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '20px',
                    padding: '16px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>筛选无结果</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>No results</span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-page)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="check" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        没有匹配这 2 个筛选条件的文档。
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        No documents match these 2 filters.
                      </span>
                    </span>
                  </span>
                  <span style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
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
                        marginTop: '2px',
                      }}
                    >
                      <DS.Icon name="x" size={11} />
                    </span>
                    <span>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>无数据</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>No data</span>
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="format"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>日期、时间与数字</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Dates, times and numbers</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>日期</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Dates</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      英文 24 September 2026，中文 2026 年 9 月 24 日。列表里一周内用相对时间：“2 小时前”“昨天”。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      English 24 September 2026, Chinese 2026 年 9 月 24 日. Within a week in lists, relative: 2 hours ago, Yesterday.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>时间</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Times</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      24 小时制，08:30 to 18:30。跨时区时写上时区。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      24-hour, 08:30 to 18:30. Add the time zone when it crosses zones.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>金额</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Money</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      £1.2m、£184.9m；表格里写完整数字并右对齐。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      £1.2m, £184.9m; full figures right-aligned in tables.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>数量</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Counts</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      0 时不显示徽章；“1 份文档”“2 份文档”按单复数写。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Hide badges at zero; write 1 document and 2 documents.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>空值</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Empty values</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      表格空格写破折号 —，不写 0 或 N/A。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Empty cells take a dash —, not 0 or N/A.
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="names"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>常用词</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Words we use</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>工作区</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Workspace</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      一个团队或客户的空间。不用 tenant、organisation、instance。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      A team’s or customer’s space. Not tenant, organisation or instance.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>项目</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Project</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      一个案件、交易或服务。不用 matter（除非在法律场景）、case。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      A matter, deal or engagement. Not case.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>分享</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Share</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      给别人访问。不用 grant、publish。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Giving someone access. Not grant or publish.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>任务</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Task</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      交给团队或 Agent 的一件事。客户界面不用 ticket。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Something handed to the team or the Agent. Not ticket in customer UI.
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
