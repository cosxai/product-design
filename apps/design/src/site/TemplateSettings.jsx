// TemplateSettings — converted once from the Claude Design export (Template Settings.dc.html); edit freely.
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
    { g: true, a: false, e: true, t: true },
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
    var s = this.state,
      zh = b.zh,
      self = this,
      keys = ['g', 'a', 'e', 't'],
      init = { g: true, a: false, e: true, t: true };
    var tg = {},
      sw = {};
    keys.forEach(function (k) {
      tg[k] = function (v) {
        self.setState({ [k]: typeof v === 'boolean' ? v : !self.state[k] });
      };
      sw[k] = !!s[k];
    });
    var diff = keys.filter(function (k) {
      return s[k] !== init[k];
    });
    var names = { g: 'Google', a: 'Apple', e: zh ? '邮箱和密码' : 'Email and password', t: zh ? '两步验证' : 'Two-step verification' };
    return {
      pv: this.pv(b.dark ? 'ink' : 'paper'),
      pvGround: b.ground,
      tg: tg,
      sw: sw,
      barD: diff.length ? 'flex' : 'none',
      dirtyText:
        (zh ? '未保存的更改 · ' : 'Unsaved changes · ') +
        diff
          .map(function (k) {
            return names[k];
          })
          .join(zh ? '、' : ', '),
      discard: () => this.setState(init),
    };
  }
  renderVals() {
    var b = this.base();
    return Object.assign(b, this.page(b));
  }
}

export const pageCss = '';

export default function TemplateSettings(props) {
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
            <SiteNav lang={v.lang} current="settings" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>页面模板 · 设置</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Templates · Settings</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>左边分组菜单，右边“说明 + 控件”</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Grouped menu on the left, description and control on the right
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
                    工作区设置、个人偏好和实体设置都用这个模板。开关立即生效；表单类修改后底部出现保存条。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Workspace settings, personal preferences and entity settings share this template. Switches apply at once; form edits
                    raise a save bar.
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    切换“邮箱和密码”或“Apple”，底部会出现保存条。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Toggle Email and password or Apple to raise the save bar.
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
                        background: 'transparent',
                        color: 'var(--text-primary)',
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
                      width: '200px',
                      flex: 'none',
                      borderRight: '1px solid var(--rule)',
                      padding: '16px 10px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
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
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>返回工作区</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Back to workspace</span>
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', padding: '12px 10px 4px' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>工作区</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Workspace</span>
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="sliders-horizontal" size={15} />
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>通用</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>General</span>
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="palette" size={15} />
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>品牌</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Brand</span>
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="users" size={15} />
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>成员</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Members</span>
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        background: '#FFE3A0',
                        color: '#111',
                      }}
                    >
                      <DS.Icon name="shield" size={15} />
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>安全</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Security</span>
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="plug" size={15} />
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>集成</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Integrations</span>
                    </span>
                  </div>
                  <div style={{ flex: '1', minWidth: '0', padding: '28px 32px 80px', boxSizing: 'border-box', overflow: 'hidden' }}>
                    <span style={{ fontSize: '22px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>安全</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Security</span>
                    </span>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '4px 0 12px' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        谁可以登录 COSX Advisory，以及怎样登录。
                      </span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        Who can sign in to COSX Advisory, and how.
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) auto',
                        gap: '24px',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Google</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Google</span>
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>显示在登录页和客户域名上</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                            On the sign-in page and customer domains
                          </span>
                        </span>
                      </div>
                      <DS.Switch checked={v.sw?.g} onChange={v.tg?.g} />
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) auto',
                        gap: '24px',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Apple</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Apple</span>
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>手机用户常用</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Common on phones</span>
                        </span>
                      </div>
                      <DS.Switch checked={v.sw?.a} onChange={v.tg?.a} />
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) auto',
                        gap: '24px',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>邮箱和密码</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Email and password</span>
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>至少保留一种登录方式</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                            At least one method must stay on
                          </span>
                        </span>
                      </div>
                      <DS.Switch checked={v.sw?.e} onChange={v.tg?.e} />
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) auto',
                        gap: '24px',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>强制两步验证</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                            Require two-step verification
                          </span>
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>包括客户；2 位成员尚未设置</span>
                          <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                            Including customers; 2 members not set up
                          </span>
                        </span>
                      </div>
                      <DS.Switch checked={v.sw?.t} onChange={v.tg?.t} />
                    </div>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      left: '256px',
                      right: '0',
                      bottom: '0',
                      display: v.barD,
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 32px',
                      borderTop: '1px solid var(--rule)',
                      background: 'var(--bg-page)',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#FFD166' }} />
                    <span style={{ fontSize: '13px', flex: '1' }}>{show(v.dirtyText)}</span>
                    <DS.Button variant="ghost" size="sm" ground={v.pvGround} onClick={v.discard}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>放弃</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Discard</span>
                    </DS.Button>
                    <DS.Button size="sm" ground={v.pvGround} onClick={v.discard}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>保存更改</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Save changes</span>
                    </DS.Button>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>菜单</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Menu</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      按“工作区 / 你”分组，每项带图标；顶部“返回工作区”。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Grouped by Workspace and You, each with an icon; Back to workspace on top.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>两列</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Two columns</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      左列标题和一句说明，右列控件；宽度不够时上下排。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Title and one line on the left, the control on the right; stacked when narrow.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>保存</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Saving</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      开关立即生效并出提示；表单修改后出现底部保存条，离开前提示。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Switches apply with a toast; form edits raise a save bar and warn before leaving.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>危险区</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Danger zone</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      删除、转移所有权放在页面底部单独卡片，输入名称确认。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Delete and transfer ownership sit in a separate card at the bottom, confirmed by typing the name.
                    </span>
                  </span>
                </div>
              </div>
              <a
                href="../ui-spec/Metaroom Components.dc.html#s22"
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
                      <SpecSections only="s22" theme={v.theme} />
                    </div>
                  </>
                ) : null}
                {v.en ? (
                  <>
                    <div className="sc-host">
                      <SpecSectionsEN only="s22" theme={v.theme} />
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
