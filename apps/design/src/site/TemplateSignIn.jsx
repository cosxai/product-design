// TemplateSignIn — converted once from the Claude Design export (Template Sign In.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';
import SiteHeader from './SiteHeader';
import SiteNav from './SiteNav';

/* eslint-disable */
class Logic extends DCLogic {
  dict = { zh: {}, en: {} };
  state = Object.assign({ lang: this.pref('cosx-site-lang', 'en'), theme: this.pref('cosx-site-theme', 'light') }, { m: 'pw' });
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
    var seg = this.merge([this.seg('m', ['pw', 'code', 'passkey'])]);
    var s = this.state,
      zh = b.zh;
    return Object.assign(seg, {
      pv: this.pv(b.dark ? 'ink' : 'paper'),
      pvGround: b.ground,
      google_D: 'block',
      googleD: 'block',
      microsoftD: 'block',
      appleD: b.dark ? 'none' : 'block',
      appleWD: b.dark ? 'block' : 'none',
      pwD: s.m === 'pw' ? 'flex' : 'none',
      codeD: s.m === 'code' ? 'flex' : 'none',
      cta: s.m === 'passkey' ? (zh ? '使用通行密钥' : 'Use passkey') : s.m === 'code' ? (zh ? '验证' : 'Verify') : zh ? '登录' : 'Sign in',
      foot: s.m === 'code' ? (zh ? '验证码已发送 · 48 秒后可重发' : 'Code sent · resend in 48 s') : zh ? '忘记密码？' : 'Forgot password?',
    });
  }
  renderVals() {
    var b = this.base();
    return Object.assign(b, this.page(b));
  }
}

export const pageCss = '';

export default function TemplateSignIn(props) {
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
            <SiteNav lang={v.lang} current="auth" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>页面模板 · 登录与注册</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Templates · Sign in</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>一张卡片，第三方登录在前，邮箱在后</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    One card: providers first, email after
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
                    工作区品牌在卡片顶部；客户在自有域名访问时不出现平台名称。登录方式由工作区的安全设置决定。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    The workspace brand tops the card; on a customer domain the platform name never appears. Which methods show is set in
                    the workspace’s security settings.
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>切换邮箱登录的方式。</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Switch how email sign-in works.</span>
                </p>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '600px',
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
                  <div style={{ flex: '1', display: 'grid', placeItems: 'center', background: 'var(--bg-sunk)' }}>
                    <div
                      style={{
                        width: '380px',
                        borderRadius: '16px',
                        background: 'var(--bg-page)',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        boxSizing: 'border-box',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '6px' }}>
                        <span
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '7px',
                            background: '#FFE3A0',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: 'block' }} />
                        </span>
                        <span style={{ fontSize: '15px', fontWeight: '500' }}>COSX Advisory</span>
                      </div>{' '}
                      <span style={{ fontSize: '22px', fontWeight: '500' }}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>登录</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Sign in</span>
                      </span>{' '}
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          height: '42px',
                          borderRadius: '8px',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        <img src="../assets/social-google.svg" alt="" style={{ width: '18px', height: '18px', display: v.googleD }} />
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>使用 Google 继续</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Continue with Google</span>
                      </span>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          height: '42px',
                          borderRadius: '8px',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        <img src="../assets/social-microsoft.svg" alt="" style={{ width: '18px', height: '18px', display: v.microsoftD }} />
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>使用 Microsoft 登录</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Sign in with Microsoft</span>
                      </span>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          height: '42px',
                          borderRadius: '8px',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        <img src="../assets/social-apple.svg" alt="" style={{ width: '18px', height: '18px', display: v.appleD }} />
                        <img src="../assets/social-apple-white.svg" alt="" style={{ width: '18px', height: '18px', display: v.appleWD }} />
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>使用 Apple 继续</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Continue with Apple</span>
                      </span>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>或使用邮箱</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>or with email</span>
                        <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                      </div>{' '}
                      <div
                        style={{
                          height: '40px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 12px',
                          fontSize: '14px',
                        }}
                      >
                        li.wei@halden.co
                      </div>{' '}
                      <div
                        style={{
                          display: v.pwD,
                          height: '40px',
                          borderRadius: '8px',
                          background: 'var(--bg-page)',
                          boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                          alignItems: 'center',
                          padding: '0 12px',
                          fontSize: '14px',
                          letterSpacing: '.2em',
                        }}
                      >
                        ••••••••••
                      </div>{' '}
                      <div style={{ display: v.codeD, gap: '6px' }}>
                        <span
                          style={{
                            flex: '1',
                            height: '44px',
                            borderRadius: '8px',
                            background: 'var(--bg-sunk)',
                            boxShadow: 'none',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '18px',
                            fontWeight: '500',
                          }}
                        >
                          4
                        </span>
                        <span
                          style={{
                            flex: '1',
                            height: '44px',
                            borderRadius: '8px',
                            background: 'var(--bg-sunk)',
                            boxShadow: 'none',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '18px',
                            fontWeight: '500',
                          }}
                        >
                          8
                        </span>
                        <span
                          style={{
                            flex: '1',
                            height: '44px',
                            borderRadius: '8px',
                            background: 'var(--bg-sunk)',
                            boxShadow: 'none',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '18px',
                            fontWeight: '500',
                          }}
                        >
                          2
                        </span>
                        <span
                          style={{
                            flex: '1',
                            height: '44px',
                            borderRadius: '8px',
                            background: 'var(--bg-page)',
                            boxShadow: 'inset 0 0 0 1.5px var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '18px',
                            fontWeight: '500',
                          }}
                        />
                        <span
                          style={{
                            flex: '1',
                            height: '44px',
                            borderRadius: '8px',
                            background: 'var(--bg-sunk)',
                            boxShadow: 'none',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '18px',
                            fontWeight: '500',
                          }}
                        />
                        <span
                          style={{
                            flex: '1',
                            height: '44px',
                            borderRadius: '8px',
                            background: 'var(--bg-sunk)',
                            boxShadow: 'none',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '18px',
                            fontWeight: '500',
                          }}
                        />
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="sc-host-x" style={{ width: '100%' }}>
                          <DS.Button ground={v.pvGround}>{show(v.cta)}</DS.Button>
                        </div>
                      </div>{' '}
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>{show(v.foot)}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '18px 20px', borderTop: '1px solid var(--rule)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>邮箱方式</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Email method</span>
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
                        onClick={v.set?.m_pw}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.m_pw?.bg,
                          color: v.on?.m_pw?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>密码</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Password</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.m_code}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.m_code?.bg,
                          color: v.on?.m_code?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>邮箱验证码</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Email code</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.m_passkey}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.m_passkey?.bg,
                          color: v.on?.m_passkey?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>通行密钥</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Passkey</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>品牌区</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Brand</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      工作区品牌方块和名称。自有域名下不出现 MetaRoom 或 COSX。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      The workspace tile and name. No MetaRoom or COSX on a customer domain.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>第三方</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Providers</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      官方标志 18px，保持原色，放在中性次按钮上；文案按各家规范书写。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Official marks at 18px in full colour on neutral buttons, labelled in each provider’s own wording.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>邮箱</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Email</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      先输入邮箱，再按账号决定下一步：密码、验证码、通行密钥或跳转单点登录。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Email first; the next step depends on the account: password, code, passkey or SSO redirect.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>邀请注册</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Invitations</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      从邀请链接进入时预填邮箱，只多一步设置姓名。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      From an invite, the email is prefilled and one extra step asks for a name.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>卡片变为整页，按钮高 48。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      The card becomes the page; buttons are 48 tall.
                    </span>
                  </span>
                </div>
              </div>
              <a
                href="../pages/MetaRoom Auth.dc.html"
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
