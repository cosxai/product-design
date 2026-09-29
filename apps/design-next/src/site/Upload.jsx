// Upload — converted once from the Claude Design export (Upload.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';
import SiteHeader from './SiteHeader';
import SiteNav from './SiteNav';
import SpecSections from './SpecSections';
import SpecSectionsEN from './SpecSectionsEN';

/* eslint-disable */
class Logic extends DCLogic {
  dict = { zh: { choose: '选择文件', clear: '清除列表' }, en: { choose: 'Choose files', clear: 'Clear list' } };
  state = Object.assign(
    { lang: this.pref('cosx-site-lang', 'en'), theme: this.pref('cosx-site-theme', 'light') },
    { files: [], drag: false, win: false },
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
    this._depth = 0;
    var hasFiles = (e) => e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0;
    this._de = (e) => {
      if (!hasFiles(e)) return;
      this._depth++;
      if (!this.state.win) this.setState({ win: true });
    };
    this._dl = (e) => {
      if (!hasFiles(e)) return;
      this._depth = Math.max(0, this._depth - 1);
      if (this._depth === 0) this.setState({ win: false });
    };
    this._dp = (e) => {
      this._depth = 0;
      if (this.state.win) this.setState({ win: false });
    };
    this._key = (e) => {
      if (e.key === 'Escape' && this.state.win) {
        this._depth = 0;
        this.setState({ win: false });
      }
    };
    window.addEventListener('dragenter', this._de);
    window.addEventListener('dragleave', this._dl);
    window.addEventListener('drop', this._dp);
    window.addEventListener('dragover', (e) => {
      if (hasFiles(e)) e.preventDefault();
    });
    window.addEventListener('keydown', this._key);
    this._sync = () => this.setState({ lang: this.pref('cosx-site-lang', 'en'), theme: this.pref('cosx-site-theme', 'light') });
    window.addEventListener('storage', this._sync);
  }
  componentWillUnmount() {
    window.removeEventListener('dragenter', this._de);
    window.removeEventListener('dragleave', this._dl);
    window.removeEventListener('drop', this._dp);
    window.removeEventListener('keydown', this._key);
    window.removeEventListener('storage', this._sync);
    clearTimeout(this._t);
    clearInterval(this._iv);
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
  tick() {
    if (this._iv) return;
    this._iv = setInterval(() => {
      var any = false;
      this.setState(
        (st) => ({
          files: st.files.map((f) => {
            if (f.st !== 'up') return f;
            any = true;
            var p = Math.min(100, f.pct + 7 + Math.round(Math.random() * 9));
            if (f.fail && p >= 62) return Object.assign({}, f, { pct: 62, st: 'fail' });
            return Object.assign({}, f, { pct: p, st: p >= 100 ? 'done' : 'up' });
          }),
        }),
        () => {
          if (!this.state.files.some((f) => f.st === 'up')) {
            clearInterval(this._iv);
            this._iv = null;
          }
        },
      );
    }, 180);
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
    var s = this.state,
      zh = b.zh,
      self = this;
    var add = function (list) {
      var now = Date.now();
      var items = list.map(function (f, i) {
        return { id: now + i, name: f.name, size: f.size || 0, pct: 0, st: 'up', fail: /^fail/i.test(f.name) };
      });
      self.setState(function (st) {
        return { files: st.files.concat(items), drag: false };
      });
      self.tick();
    };
    var fmt = function (n) {
      return n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
    };
    var done = s.files.filter(function (f) {
        return f.st === 'done';
      }).length,
      failed = s.files.filter(function (f) {
        return f.st === 'fail';
      }).length;
    var Z = s.drag
      ? {
          style: 'solid',
          border: '#111',
          bg: '#FFE3A0',
          fg: '#111',
          sub: 'rgba(17,17,17,.7)',
          icon: 'arrow-down-to-line',
          title: zh ? '松开即可上传' : 'Release to upload',
          hint: zh ? '上传到“尽调材料”' : 'to Due diligence',
        }
      : {
          style: 'dashed',
          border: 'var(--rule)',
          bg: 'var(--bg-page)',
          fg: 'var(--text-primary)',
          sub: 'var(--text-secondary)',
          icon: 'upload',
          title: zh ? '拖入文件或文件夹' : 'Drop files or folders',
          hint: zh ? '单个文件最大 2 GB' : 'Up to 2 GB each',
        };
    var stop = function (e) {
      e.preventDefault();
      e.stopPropagation();
    };
    var closeOv = function () {
      self._depth = 0;
      self.setState({ win: false });
    };
    return {
      ovD: s.win ? 'flex' : 'none',
      ovTitle: zh ? '放到任何位置即可上传' : 'Drop anywhere to upload',
      ovSub: zh ? '上传到“Harbour A 轮 / 尽调材料”' : 'to Harbour Series A / Due diligence',
      ovHint: zh ? 'Esc 取消' : 'Esc to cancel',
      ovPreview: function () {
        self.setState({ win: true });
      },
      ovClose: closeOv,
      ovOver: function (e) {
        e.preventDefault();
      },
      ovLeave: function (e) {
        e.preventDefault();
      },
      ovDrop: function (e) {
        e.preventDefault();
        self._depth = 0;
        self.setState({ win: false });
        add(Array.prototype.slice.call((e.dataTransfer && e.dataTransfer.files) || []));
      },
      pv: this.pv(b.dark ? 'ink' : 'paper'),
      zone: Z,
      dragOn: function (e) {
        stop(e);
        self.setState({ drag: true });
      },
      dragOver: function (e) {
        stop(e);
        if (!self.state.drag) self.setState({ drag: true });
      },
      dragOff: function (e) {
        stop(e);
        if (!e.currentTarget.contains(e.relatedTarget)) self.setState({ drag: false });
      },
      drop: function (e) {
        stop(e);
        add(Array.prototype.slice.call((e.dataTransfer && e.dataTransfer.files) || []));
      },
      pickFiles: function (e) {
        add(Array.prototype.slice.call(e.target.files || []));
        e.target.value = '';
      },
      sample: function () {
        add([
          { name: 'Shareholder agreement v3.pdf', size: 2400000 },
          { name: 'Cap table.xlsx', size: 184000 },
          { name: 'fail-board-minutes.docx', size: 920000 },
        ]);
      },
      clear: function () {
        self.setState({ files: [] });
      },
      listD: s.files.length ? 'flex' : 'none',
      summary:
        (zh ? '已完成 ' : '') +
        done +
        ' / ' +
        s.files.length +
        (zh ? '' : ' done') +
        (failed ? (zh ? ' · ' + failed + ' 个失败' : ' · ' + failed + ' failed') : ''),
      files: s.files.map(function (f) {
        var up = f.st === 'up',
          fl = f.st === 'fail';
        return {
          name: f.name,
          icon: fl ? 'file-warning' : up ? 'file-up' : 'file-check',
          meta: up ? f.pct + '%' : fl ? (zh ? '连接中断' : 'Connection dropped') : fmt(f.size),
          metaFg: fl ? 'var(--status-error-text)' : 'var(--text-secondary)',
          pct: f.pct + '%',
          barD: up ? 'block' : 'none',
          bg: fl ? 'var(--status-error-wash)' : 'transparent',
          actLabel: up ? (zh ? '取消' : 'Cancel') : fl ? (zh ? '重试' : 'Retry') : zh ? '移除' : 'Remove',
          actBg: fl ? 'var(--bg-page)' : 'transparent',
          act: function () {
            self.setState(function (st) {
              return {
                files: fl
                  ? st.files.map(function (x) {
                      return x.id === f.id ? Object.assign({}, x, { st: 'up', pct: 0, fail: false }) : x;
                    })
                  : st.files.filter(function (x) {
                      return x.id !== f.id;
                    }),
              };
            });
            if (fl) self.tick();
          },
        };
      }),
    };
  }
  renderVals() {
    var b = this.base();
    return Object.assign(b, this.page(b));
  }
}

export const pageCss = '.h60:hover{background: var(--bg-well) !important}\n.h61:hover{background: var(--bg-well) !important}';

export default function Upload(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="Upload" precedence="page">
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
            <SiteNav lang={v.lang} current="upload" />
          </div>{' '}
          <main style={{ flex: '1', minWidth: '0', padding: '48px 56px 64px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>组件 · 上传</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Components · Upload</span>
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>拖进来，或者选择文件</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Drop files in, or choose them</span>
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
                    落点、全屏落点、上传行和进度条，用于文档库、任务附件和 Agent 对话。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    The drop zone, the full-screen drop, upload rows and progress, for libraries, task attachments and the Agent
                    conversation.
                  </span>
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{ fontSize: '12px', fontWeight: '500', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}
                  >
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>组件</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Component</span>
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
                    把电脑里的文件拖到下面，或点“选择文件”。文件不会真的上传，进度是模拟的；名字以 fail 开头的文件会演示失败。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    Drag files from your computer below, or choose them. Nothing is really uploaded and progress is simulated; files named
                    fail… demonstrate a failure.
                  </span>
                </p>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden' }}>
                <div
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
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
                    onDragEnter={v.dragOn}
                    onDragOver={v.dragOver}
                    onDragLeave={v.dragOff}
                    onDrop={v.drop}
                    style={{
                      minHeight: '180px',
                      borderRadius: '16px',
                      border: `1.5px ${v.zone?.style ?? ''} ${v.zone?.border ?? ''}`,
                      background: v.zone?.bg,
                      color: v.zone?.fg,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '24px',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      transition: 'background 120ms, border-color 120ms',
                    }}
                  >
                    {' '}
                    <DS.Icon name={v.zone?.icon} size={22} />{' '}
                    <span style={{ fontSize: '15px', fontWeight: '500' }}>{show(v.zone?.title)}</span>{' '}
                    <span style={{ fontSize: '13px', color: v.zone?.sub }}>{show(v.zone?.hint)}</span>{' '}
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                      <label
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          height: '34px',
                          padding: '0 14px',
                          borderRadius: '8px',
                          background: 'var(--text-primary)',
                          color: 'var(--bg-page)',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        {show(v.T?.choose)}
                        <input type="file" multiple="" onChange={v.pickFiles} style={{ display: 'none' }} />
                      </label>
                      <DS.Button variant="ghost" size="sm" ground={v.ground} onClick={v.sample}>
                        <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>添加示例文件</span>
                        <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Add sample files</span>
                      </DS.Button>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ display: v.listD, flexDirection: 'column', gap: '4px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        padding: '0 2px 4px',
                      }}
                    >
                      <span>{show(v.summary)}</span>
                      <button
                        type="button"
                        onClick={v.clear}
                        style={{
                          border: 'none',
                          background: 'none',
                          padding: '0',
                          color: 'var(--text-primary)',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: '500',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        {show(v.T?.clear)}
                      </button>
                    </div>{' '}
                    {list(v.files).map((f$, $i) => {
                      const s1 = { ...v, f: f$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '10px 12px',
                              borderRadius: '10px',
                              background: s1.f?.bg,
                            }}
                          >
                            <DS.Icon name={s1.f?.icon} size={16} />
                            <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {show(s1.f?.name)}
                                </span>
                                <span style={{ flex: 'none', fontVariantNumeric: 'tabular-nums', color: s1.f?.metaFg }}>
                                  {show(s1.f?.meta)}
                                </span>
                              </div>
                              <div
                                style={{
                                  height: '4px',
                                  borderRadius: '999px',
                                  background: 'var(--bg-well)',
                                  overflow: 'hidden',
                                  display: s1.f?.barD,
                                }}
                              >
                                <div
                                  style={{
                                    height: '100%',
                                    width: s1.f?.pct,
                                    background: 'var(--text-primary)',
                                    transition: 'width 180ms linear',
                                  }}
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={s1.f?.act}
                              aria-label={s1.f?.actLabel}
                              style={{
                                flex: 'none',
                                height: '28px',
                                padding: '0 10px',
                                border: 'none',
                                borderRadius: '6px',
                                background: s1.f?.actBg,
                                color: 'var(--text-primary)',
                                fontFamily: 'inherit',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              {show(s1.f?.actLabel)}
                            </button>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>
                </div>
              </div>
              <div
                id="fullscreen"
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>全屏落点</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Full-screen drop</span>
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
                    文件拖进浏览器窗口时，整页盖上一层落点，放到任何位置都能上传。试着把文件拖到这个页面的任意位置，或者点下面的按钮预览。
                  </span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                    When files enter the browser window, a drop layer covers the page and a drop anywhere uploads. Drag a file anywhere on
                    this page, or preview it below.
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
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                  <DS.Button variant="secondary" size="sm" ground={v.ground} onClick={v.ovPreview}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>预览全屏落点</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Preview full-screen drop</span>
                  </DS.Button>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Esc 或点击任意处关闭</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Esc or click anywhere to close</span>
                  </span>
                </div>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>何时出现</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>When</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      只在拖入的是文件时出现（dataTransfer 含 Files），拖动页面里的文字或卡片不会触发。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Only when the drag carries files (dataTransfer has Files); dragging text or cards on the page doesn’t trigger it.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>目标</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Target</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      写明文件会上传到哪里：当前文件夹，或者没有文件夹时的“我的上传”。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Name where files will go: the current folder, or My uploads when there isn’t one.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>和局部落点</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>With local zones</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      全屏层出现时，页面里的文件夹和局部落点仍然可以接收，悬停在上面时全屏层的文字改为那个文件夹。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Folders and local zones still accept under the layer; hovering one changes the layer’s wording to that folder.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>层级</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Layer</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      在对话框之下、页面之上；对话框打开时不出现。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Above the page, below dialogs; it never appears while a dialog is open.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>离开</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Leaving</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      拖出窗口、按 Esc 或放下后立即消失，没有延迟。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Leaves at once when the drag exits the window, on Esc, or after the drop.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>权限</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Permission</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      只读的页面不显示；显示一行说明“你在这里只能查看”。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Read-only pages don’t show it; instead a line says you can only view here.
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
                  <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>落点状态</span>
                  <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Drop zone states</span>
                </h2>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      height: '140px',
                      borderRadius: '16px',
                      border: '1.5px dashed var(--rule)',
                      background: 'var(--bg-page)',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textAlign: 'center',
                      padding: '12px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <DS.Icon name="upload" size={20} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>拖入文件或文件夹</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Drop files or folders</span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>空闲：虚线边框。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Idle: a dashed edge.</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      height: '140px',
                      borderRadius: '16px',
                      border: '1.5px dashed var(--text-primary)',
                      background: 'var(--yellow-12)',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textAlign: 'center',
                      padding: '12px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <DS.Icon name="upload" size={20} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>放到这里</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Drop here</span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>拖进窗口：所有可放置的区域亮起。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Dragging into the window: every drop target lights up.
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      height: '140px',
                      borderRadius: '16px',
                      border: '1.5px solid #111',
                      background: '#FFE3A0',
                      color: '#111',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textAlign: 'center',
                      padding: '12px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <DS.Icon name="arrow-down-to-line" size={20} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>松开上传到“尽调材料”</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                        Release to upload to Due diligence
                      </span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      悬停在区域上：黄色 field，写明目标文件夹。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Over the zone: the yellow field, naming the folder.
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      height: '140px',
                      borderRadius: '16px',
                      border: '1.5px dashed var(--status-error)',
                      background: 'var(--status-error-wash)',
                      color: '#111',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textAlign: 'center',
                      padding: '12px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <DS.Icon name="file-x" size={20} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不支持 .exe 文件</span>
                      <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>.exe files aren’t supported</span>
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>不能接受：写明原因，不是只变红。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Refused: say why, don’t just turn red.
                    </span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>整个窗口都是落点</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>The whole window accepts</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      文件拖进窗口时，页面上的文件夹、列表和落点同时亮起；只在具体区域上松开时才上传。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      When files enter the window, folders, lists and zones light up; upload happens only on release over one of them.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>上传前检查</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Check before upload</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      拖入文件夹时先列出将上传的内容，标出不支持的类型和过深的层级，再确认。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      For folders, list what will upload and flag unsupported types and deep nesting before confirming.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>进度</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Progress</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      每个文件一行：名称、百分比、可取消。批次写“28 / 41 · 1 个失败”。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      One row per file: name, percentage, cancel. Batches read 28 / 41 · 1 failed.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>失败</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Failures</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      失败的行加浅红底，写原因并提供重试；其他文件继续上传。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Failed rows take a red wash with the reason and Retry; the rest keep going.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>离开页面</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Leaving</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      上传中关闭页面会提示；刷新后批次仍在。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Closing the page mid-upload asks first; batches survive a refresh.
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
                      没有拖放：只显示“选择文件”和“拍照上传”。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      No drag and drop: Choose files and Take a photo only.
                    </span>
                  </span>
                </div>
              </div>
              <div
                id="proposal"
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>accept</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    string
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>—</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      允许的类型，如 ".pdf,.docx,image/*"。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Allowed types, e.g. ".pdf,.docx,image/*".
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>multiple</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    boolean
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>true</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>允许多选。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Allow several files.</span>
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>directory</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    boolean
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>false</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>允许拖入文件夹。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Allow folders.</span>
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>maxSize</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    number
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>2 GB</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>单个文件上限。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Per-file limit.</span>
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>target</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    string
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>—</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>目标文件夹名，悬停时显示。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Target folder name shown on hover.
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>compact</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    boolean
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>false</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>列表视图里的单行落点。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>A one-line zone for list views.</span>
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>onFiles</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    {'(files: File[]) => void'}
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>—</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>通过检查的文件。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Files that passed the checks.</span>
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: '500' }}>onReject</code>
                  <code
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}
                  >
                    {'(items) => void'}
                  </code>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>—</code>
                  <span style={{ lineHeight: '1.6' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>被拒绝的文件和原因。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Refused files with reasons.</span>
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>键盘</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Keyboard</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      落点里的“选择文件”是真正的按钮；拖放不是唯一方式。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Choose files is a real button; drag and drop is never the only way.
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
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>播报</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>Announcements</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      进度按 25% 步进播报；完成和失败会读出。
                    </span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Progress is announced in 25% steps; completion and failure are read out.
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
                      <SpecSections only="s05" theme={v.theme} />
                    </div>
                  </>
                ) : null}
                {v.en ? (
                  <>
                    <div className="sc-host">
                      <SpecSectionsEN only="s05" theme={v.theme} />
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
                  alignItems: 'start',
                  alignItems: 'stretch',
                }}
              >
                <a
                  href="../ui-spec/MetaRoom Components.dc.html#s05"
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
                  className={'h60'}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>MetaRoom 上传与进度</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>MetaRoom upload and progress</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>文件夹检查与批次进度。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>
                      Folder checks and batch progress.
                    </span>
                  </span>
                </a>
                <a
                  href="/template-list"
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
                  className={'h61'}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>列表模板</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>List template</span>
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                    <span style={{ display: v.dz, lineHeight: 'inherit', letterSpacing: 'inherit' }}>文档库里的落点。</span>
                    <span style={{ display: v.de, lineHeight: 'inherit', letterSpacing: 'inherit' }}>The drop zone in a library.</span>
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
              </footer>
              <div
                onDragOver={v.ovOver}
                onDrop={v.ovDrop}
                onDragLeave={v.ovLeave}
                onClick={v.ovClose}
                style={{
                  position: 'fixed',
                  inset: '0',
                  zIndex: '80',
                  display: v.ovD,
                  padding: '24px',
                  boxSizing: 'border-box',
                  background: 'rgba(255,227,160,.66)',
                  WebkitBackdropFilter: 'blur(14px) saturate(.9)',
                  backdropFilter: 'blur(14px) saturate(.9)',
                }}
              >
                {' '}
                <div
                  style={{
                    flex: '1',
                    borderRadius: '24px',
                    border: '2px dashed #111',
                    color: '#111',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '14px',
                    textAlign: 'center',
                    padding: '48px',
                    boxSizing: 'border-box',
                  }}
                >
                  {' '}
                  <span
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '18px',
                      background: '#111',
                      color: '#FFE3A0',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <DS.Icon name="arrow-down-to-line" size={28} />
                  </span>{' '}
                  <span style={{ fontSize: '36px', fontWeight: '500', letterSpacing: '-.02em', lineHeight: '1.2' }}>{show(v.ovTitle)}</span>{' '}
                  <span style={{ fontSize: '16px', color: 'rgba(17,17,17,.7)' }}>{show(v.ovSub)}</span>{' '}
                  <span style={{ fontSize: '12px', color: 'rgba(17,17,17,.7)', paddingTop: '8px' }}>{show(v.ovHint)}</span>{' '}
                </div>
              </div>{' '}
            </div>
          </main>{' '}
        </div>
      </div>
    </>
  );
}
