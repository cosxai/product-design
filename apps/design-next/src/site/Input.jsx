// Input — converted once from the Claude Design export (Input.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';
import SiteHeader from './SiteHeader';
import SiteNav from './SiteNav';
import SpecSections from './SpecSections';
import SpecSectionsEN from './SpecSectionsEN';

/* eslint-disable */
class Logic extends DCLogic {
  dict = {
    zh: {
      l1: '文件夹名称',
      p1: '例如：尽职调查',
      l2: '自定义域名',
      l3: '收件人邮箱',
      h3: '请补全域名，例如 harbour.vc',
      l4: '工作区 ID',
      l5: '同步目录',
      h5: '只有管理员可以修改',
      l6: '密码',
      l7: '邮箱',
      p8: '请输入邮箱',
    },
    en: {
      l1: 'Folder name',
      p1: 'e.g. Due diligence',
      l2: 'Custom domain',
      l3: 'Recipient email',
      h3: 'Add the domain, e.g. harbour.vc',
      l4: 'Workspace ID',
      l5: 'Sync folder',
      h5: 'Only admins can change this',
      l6: 'Password',
      l7: 'Email',
      p8: 'Enter your email',
    },
  };
  state = Object.assign(
    { lang: this.pref('cosx-site-lang', 'en'), theme: this.pref('cosx-site-theme', 'light') },
    { lab: 'on', hint: 'on', st: 'default', suf: 'on', val: 'portal.halden' },
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
    var seg = this.merge([
      this.seg('lab', ['on', 'off']),
      this.seg('hint', ['on', 'off']),
      this.seg('st', ['default', 'invalid', 'disabled']),
      this.seg('suf', ['off', 'on']),
    ]);
    var s = this.state,
      zh = b.zh,
      inv = s.st === 'invalid';
    var label = s.lab === 'on' ? (zh ? '自定义域名' : 'Custom domain') : undefined;
    var hint = inv
      ? zh
        ? '域名只能包含字母、数字和连字符'
        : 'Use letters, numbers and hyphens only'
      : s.hint === 'on'
        ? zh
          ? '客户通过这个地址访问门户'
          : 'Customers open the portal at this address'
        : undefined;
    var code =
      '<Input' +
      (label ? ' label="' + label + '"' : '') +
      (hint ? ' hint="' + hint + '"' : '') +
      (s.suf === 'on' ? ' suffix=".co"' : '') +
      (inv ? ' invalid' : '') +
      (s.st === 'disabled' ? ' disabled' : '') +
      ' />';
    return Object.assign(seg, {
      pv: this.pv(b.dark ? 'ink' : 'paper'),
      code: code,
      copyCode: () => this.copyText(code),
      piLabel: label,
      piHint: hint,
      piPh: 'portal.halden',
      piVal: s.val,
      piChange: (e) => this.setState({ val: e && e.target ? e.target.value : e }),
      piInvalid: inv,
      piDisabled: s.st === 'disabled',
      piSuffix: s.suf === 'on' ? '.co' : undefined,
    });
  }
  renderVals() {
    var b = this.base();
    return Object.assign(b, this.page(b));
  }
}

export const pageCss =
  '.h50:hover{background: var(--bg-well) !important}\n.h51:hover{background: var(--bg-well) !important}\n.h52:hover{background: var(--bg-well) !important}';

export default function Input(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="Input" precedence="page">
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
          <SiteHeader lang={v.lang} theme={v.theme} section="components" onLang={v.toggleLang} onTheme={v.toggleTheme} />
        </div>{' '}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {' '}
          <div className="sc-host" style={{ position: 'sticky', top: '64px' }}>
            <SiteNav lang={v.lang} current="input" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>组件 · 输入框</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Components · Input</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>输入框</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Input</span>
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
                    单行文本输入。输入框下沉到亚麻底色，聚焦时出现墨色边。标签在上，说明或错误在下。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Single-line text entry. The field sinks to linen and takes an ink edge on focus. Label above, hint or error below.
                  </span>
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>核心组件</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Core component</span>
                  </span>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>稳定</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Stable</span>
                  </span>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>客户门户 · Ops</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Portal · Ops</span>
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
                    调整下方选项，预览和代码会同步更新。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Change the options below; the preview and the code update together.
                  </span>
                </p>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden' }}>
                <div
                  style={{
                    minHeight: '220px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    padding: '48px 32px',
                    boxSizing: 'border-box',
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
                  <div style={{ width: '100%', maxWidth: '360px' }}>
                    <DS.Input
                      label={v.piLabel}
                      hint={v.piHint}
                      placeholder={v.piPh}
                      value={v.piVal}
                      onChange={v.piChange}
                      invalid={v.piInvalid}
                      disabled={v.piDisabled}
                      suffix={v.piSuffix}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    padding: '18px 20px',
                    borderTop: '1px solid var(--rule)',
                    background: 'var(--bg-page)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>标签</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Label</span>
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
                        onClick={v.set?.lab_on}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.lab_on?.bg,
                          color: v.on?.lab_on?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>有</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>On</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.lab_off}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.lab_off?.bg,
                          color: v.on?.lab_off?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>无</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Off</span>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>说明</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Hint</span>
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
                        onClick={v.set?.hint_on}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.hint_on?.bg,
                          color: v.on?.hint_on?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>有</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>On</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.hint_off}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.hint_off?.bg,
                          color: v.on?.hint_off?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>无</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Off</span>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>状态</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>State</span>
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
                        onClick={v.set?.st_default}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.st_default?.bg,
                          color: v.on?.st_default?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>默认</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Default</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.st_invalid}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.st_invalid?.bg,
                          color: v.on?.st_invalid?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>错误</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Invalid</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.st_disabled}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.st_disabled?.bg,
                          color: v.on?.st_disabled?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不可用</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Disabled</span>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>后缀</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Suffix</span>
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
                        onClick={v.set?.suf_off}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.suf_off?.bg,
                          color: v.on?.suf_off?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>无</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Off</span>
                      </button>
                      <button
                        type="button"
                        onClick={v.set?.suf_on}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: v.on?.suf_on?.bg,
                          color: v.on?.suf_on?.fg,
                        }}
                      >
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>域名</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Domain</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 12px 12px 20px',
                    borderTop: '1px solid var(--rule)',
                    background: 'var(--bg-sunk)',
                  }}
                >
                  <code
                    style={{
                      flex: '1',
                      minWidth: '0',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {show(v.code)}
                  </code>
                  <button
                    type="button"
                    onClick={v.copyCode}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '30px',
                      padding: '0 10px',
                      border: 'none',
                      borderRadius: '6px',
                      background: 'var(--bg-page)',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: 'none',
                    }}
                  >
                    <DS.Icon name="copy" size={13} />
                    {show(v.copyLabel)}
                  </button>
                </div>
              </div>
              <div
                id="variants"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>变体</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Variants</span>
                </h2>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>默认</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Default</span>
                  </span>
                  <DS.Input label={v.T?.l1} placeholder={v.T?.p1} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>已填写 · 后缀</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Filled · suffix</span>
                  </span>
                  <DS.Input label={v.T?.l2} defaultValue="portal.halden" suffix=".co" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>错误</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Invalid</span>
                  </span>
                  <DS.Input label={v.T?.l3} defaultValue="anna.k@harbour" invalid={true} hint={v.T?.h3} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>只读</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Read-only</span>
                  </span>
                  <DS.Input label={v.T?.l4} defaultValue="ws_7Hq2mR" readOnly={true} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不可用</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Disabled</span>
                  </span>
                  <DS.Input label={v.T?.l5} defaultValue="/Harbour" disabled={true} hint={v.T?.h5} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>密码</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Password</span>
                  </span>
                  <DS.Input label={v.T?.l6} type="password" defaultValue="correct-horse" />
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>用法</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Usage</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>标签总在</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Always label</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      每个输入框都有可见标签；占位文字只给示例，不代替标签。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Every field has a visible label; the placeholder shows an example and never replaces it.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>错误写解决办法</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Errors say how to fix</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      错误文字写怎么改，而不只是“格式错误”。失焦后再校验，不在输入时打断。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Say how to fix it, not just “Invalid format”. Validate on blur, not while typing.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>搜索与复制</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Search and copy</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      搜索框和复制框是单独的组件：内置防抖、清除、复制反馈。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Search and copy fields are separate components with debounce, clear and copy feedback built in.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>宽度</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Width</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      宽度匹配预期内容长度：邮箱 320，验证码 6 格，名称占满。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Match the expected content: 320 for email, six cells for a code, full width for a name.
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
                    <div style={{ width: '260px' }}>
                      <DS.Input label={v.T?.l7} placeholder="name@company.com" />
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>可见标签 + 示例占位。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      A visible label with an example placeholder.
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
                    <div style={{ width: '260px' }}>
                      <DS.Input placeholder={v.T?.p8} />
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不要只用占位文字当标签。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Don’t use the placeholder as the label.
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="props"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>属性</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Props</span>
                </h2>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflowX: 'auto' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '12px 20px',
                    background: 'var(--bg-sunk)',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>属性</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Prop</span>
                  </span>
                  <span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>类型</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Type</span>
                  </span>
                  <span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>默认</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Default</span>
                  </span>
                  <span>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>说明</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Description</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>label</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    string
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>—</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>字段上方的标签。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Label above the field.</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>hint</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    string
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>—</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>下方说明；invalid 时显示为错误。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Helper below; shown as the error when invalid.
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>prefix</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    ReactNode
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>—</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>输入框内前缀，如货币。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Inside prefix, such as a currency.
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>suffix</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    ReactNode
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>—</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>输入框内后缀，如域名。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Inside suffix, such as a domain.</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>invalid</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    boolean
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>false</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>错误状态：红色边框与说明。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Error state: red edge and hint.</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.8fr) minmax(0, 1.2fr) minmax(64px, 0.5fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--rule-soft)',
                    fontSize: '13px',
                    alignItems: 'baseline',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>…input</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    InputHTMLAttributes
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>—</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      value、onChange、type、disabled、readOnly 等原生属性。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Native attributes: value, onChange, type, disabled, readOnly.
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="a11y"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>无障碍</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Accessibility</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>关联</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Association</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      标签和说明通过 for / aria-describedby 关联到输入框。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Label and hint are tied to the input with for and aria-describedby.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>错误</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Errors</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      invalid 时设置 aria-invalid，错误文字会被读出。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Invalid sets aria-invalid and the error is announced.
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
                      高度 44，设置正确的 inputmode 与 autocomplete。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      44 tall, with the right inputmode and autocomplete.
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
                      <SpecSections only="s03" theme={v.theme} />
                    </div>
                  </>
                ) : null}
                {v.en ? (
                  <>
                    <div className="sc-host">
                      <SpecSectionsEN only="s03" theme={v.theme} />
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
                  href="/select"
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
                  className={'h50'}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>下拉选择</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Select</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>从固定选项中选择。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Choose from fixed options.</span>
                  </span>
                </a>
                <a
                  href="../ui-spec/MetaRoom Components.dc.html#s03"
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
                  className={'h51'}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>MetaRoom 文本输入</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>MetaRoom text inputs</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>验证码、搜索框、复制框、@ 提及。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Codes, search, copy fields, @mentions.
                    </span>
                  </span>
                </a>
                <a
                  href="../ui-spec/MetaRoom Components.dc.html#s19"
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
                  className={'h52'}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>表单扩展</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Form extensions</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>金额、日期范围、标签输入。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Money, date ranges, tag input.</span>
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
