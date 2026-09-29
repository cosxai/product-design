// PatternSignIn — Patterns · Sign-in, from the Claude Design page (site/Pattern Sign In.dc.html).
// Unlike the converted pages, every specimen here is the real @cosxai/ui component, so
// this page cannot drift from the code: what you see is what the apps render.
import { useEffect, useState } from 'react';
import { Check, LogOut, ShieldCheck, X } from 'lucide-react';
import {
  AuthIconTile,
  AuthLayout,
  AuthPanel,
  AuthStepHead,
  Button,
  Input,
  Logo,
  Select,
  Spinner,
  ThemeSwitch,
  WorkspaceMark,
  WorkspaceRow,
} from '@cosxai/ui';
import colorsCss from '@cosxai/ui/tokens/colors.css?raw';

import { DCLogic, useLogic } from '../dc/runtime';
import SiteHeader from './SiteHeader';
import SiteNav from './SiteNav';

/* eslint-disable */
class Logic extends DCLogic {
  state = { lang: this.pref('cosx-site-lang', 'en'), theme: this.pref('cosx-site-theme', 'light') };
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
  }
  renderVals() {
    const s = this.state;
    const zh = s.lang === 'zh';
    const dark = s.theme === 'dark';
    return {
      lang: s.lang,
      theme: s.theme,
      zh,
      dark,
      toggleLang: () => {
        const l = zh ? 'en' : 'zh';
        this.save('cosx-site-lang', l);
        this.setState({ lang: l });
      },
      toggleTheme: () => {
        const t = dark ? 'light' : 'dark';
        this.save('cosx-site-theme', t);
        this.setState({ theme: t });
      },
    };
  }
}

/** The light (paper) tokens, read from the kit: a light specimen stays light on the ink site. */
const PAPER = (() => {
  const root = colorsCss.slice(colorsCss.indexOf(':root'), colorsCss.indexOf('.ink-mode'));
  const out = {};
  for (const m of root.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
})();

/** A specimen ground: light or ink, whatever the site's theme. */
function Ground({ ink, style, className, children, ...rest }) {
  return (
    <div className={ink ? `ink-mode ${className ?? ''}` : className} style={{ ...(ink ? null : PAPER), background: 'var(--bg-page)', color: 'var(--text-primary)', ...style }} {...rest}>
      {children}
    </div>
  );
}

const card = { background: 'var(--bg-page)', border: '1px solid var(--rule)', borderRadius: '16px', minWidth: 0, boxSizing: 'border-box', overflow: 'hidden' };
const caption = { fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)', textWrap: 'pretty' };
const label = { fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' };

function Section({ id, title, lead, children }) {
  return (
    <section id={id} style={{ scrollMarginTop: '80px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '56px', paddingBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 500, lineHeight: 1.3, letterSpacing: '-.01em' }}>{title}</h2>
        {lead && <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: '44em', textWrap: 'pretty' }}>{lead}</p>}
      </div>
      {children}
    </section>
  );
}

function Pill({ children }) {
  return <span style={{ fontSize: '12px', fontWeight: 500, padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-sunk)' }}>{children}</span>;
}

/** The numbered dots of the anatomy. */
function Dot({ n, style }) {
  return (
    <span
      aria-hidden
      style={{ position: 'absolute', width: 20, height: 20, borderRadius: 999, background: '#111', color: '#FFD166', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, zIndex: 2, ...style }}
    >
      {n}
    </span>
  );
}

const brand = (
  <>
    <Logo variant="tile" height={32} alt="" />
    <span>COSX</span>
  </>
);

/** The first sign-in step, as the frame specimens carry it. */
function SignInStep({ t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AuthStepHead
        icon={<Logo variant="tile" height={56} alt="" />}
        title={t('Sign in to COSX', '登录 COSX')}
      >
        {t('Use your work email or an account you already have.', '用工作邮箱，或你已有的账号。')}
      </AuthStepHead>
      <Input aria-label={t('Email', '邮箱')} placeholder="name@company.com" />
      <Button size="lg" className="w-full">
        {t('Continue with email', '用邮箱继续')}
      </Button>
    </div>
  );
}

function Footer({ t, zh }) {
  return (
    <>
      <span>{t('Privacy · Status', '隐私 · 服务状态')}</span>
      <div style={{ width: 180 }}>
        <Select size="sm" aria-label={t('Language', '语言')} value={zh ? 'zh-Hans' : 'en'} options={[{ value: 'en', label: 'English' }, { value: 'zh-Hans', label: '简体中文' }]} />
      </div>
    </>
  );
}

function Frame({ t, zh, ink, width = 1000, height = 600, panel = true, dots = false }) {
  const [mode, setMode] = useState('system');
  return (
    <Ground ink={ink} style={{ position: 'relative', width, height, flex: 'none' }} lang={zh ? 'zh-CN' : 'en-GB'}>
      {dots && (
        <>
          <Dot n={1} style={{ left: 30, top: 38 }} />
          <Dot n={2} style={{ left: 420, top: 38 }} />
          <Dot n={3} style={{ left: 64, top: 200 }} />
          <Dot n={4} style={{ left: 64, top: 432 }} />
          <Dot n={5} style={{ left: 30, top: 548 }} />
          <Dot n={6} style={{ left: 580, top: 38 }} />
        </>
      )}
      <AuthLayout
        brand={brand}
        headerEnd={<ThemeSwitch value={mode} onChange={setMode} labels={themeLabels(t)} />}
        help={t('Having trouble? Ask your workspace admin or email support@cosx.co.', '遇到问题？请联系工作区管理员，或发邮件至 support@cosx.co。')}
        footer={<Footer t={t} zh={zh} />}
        panel={
          panel ? (
            <AuthPanel
              eyebrow={t('Your workspaces', '你的工作区')}
              lead={t('Every workspace you belong to, ', '你所在的每个工作区，')}
              mark={t('under one sign-in.', '一次登录。')}
              sub={t('Customers, colleagues and your own space, each with its own access.', '客户、同事和你自己的空间，各有各的权限。')}
            />
          ) : undefined
        }
      >
        <SignInStep t={t} />
      </AuthLayout>
    </Ground>
  );
}

const themeLabels = (t) => ({ group: t('Theme', '主题'), system: t('Theme: match system', '主题：跟随系统'), light: t('Theme: light', '主题：浅色'), ink: t('Theme: dark', '主题：深色') });

/** The yellow panel on its own, as AuthLayout's aside draws it. */
function PanelCard({ children, zh, height = 320, width }) {
  return (
    <div lang={zh ? 'zh-CN' : 'en-GB'} className="flex flex-col justify-between gap-8 overflow-hidden rounded-[24px] bg-brand-field p-10 text-ink" style={{ height, width, boxSizing: 'border-box' }}>
      {children}
    </div>
  );
}

function StepCard({ caption: cap, children }) {
  return (
    <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '28px' }}>{children}</div>
      <div style={{ ...label, padding: '12px 28px', borderTop: '1px solid var(--rule-soft)' }}>{cap}</div>
    </div>
  );
}

const WORKSPACES = [
  { name: 'Halden Capital', detail: 'halden' },
  { name: 'Vela Family Office', detail: 'vela' },
  { name: 'Northwind Trust', detail: 'northwind', logoUrl: '/does-not-exist/logo.png' },
  { name: 'Ben Zhang', detail: 'benjamin' },
];

function Chooser({ t }) {
  const [busy, setBusy] = useState();
  useEffect(() => {
    if (!busy) return undefined;
    const id = setTimeout(() => setBusy(undefined), 2400);
    return () => clearTimeout(id);
  }, [busy]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <AuthStepHead title={t('Choose a workspace', '选择工作区')}>{t('Signed in as sam@cosx.co', '已登录为 sam@cosx.co')}</AuthStepHead>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {WORKSPACES.map((w) => (
          <li key={w.name}>
            <WorkspaceRow name={w.name} detail={w.detail} logoUrl={w.logoUrl} busy={busy === w.name} disabled={busy !== undefined} onClick={() => setBusy(w.name)} />
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-[13px] text-fg-secondary underline-offset-[3px] hover:text-fg hover:underline">
          {t('Sign out', '退出登录')}
        </button>
      </div>
    </div>
  );
}

export default function PatternSignIn(props) {
  const v = useLogic(Logic, props);
  const t = (en, zh) => (v.zh ? zh : en);
  const [tryMode, setTryMode] = useState('system');
  const noop = () => {};
  return (
    <div lang={v.zh ? 'zh-CN' : 'en-GB'} className={v.dark ? 'ink-mode' : ''} style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans-cjk)', fontSize: '15px' }}>
      <div className="sc-host" style={{ position: 'sticky', top: 0, zIndex: 20 }}>
        <SiteHeader lang={v.lang} theme={v.theme} section="patterns" onLang={v.toggleLang} onTheme={v.toggleTheme} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div className="sc-host" style={{ position: 'sticky', top: '64px' }}>
          <SiteNav lang={v.lang} current="signin" />
        </div>
        <main style={{ flex: 1, minWidth: 0, padding: '48px 56px 64px', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto 0 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>{t('Patterns · Sign-in', '产品模式 · 登录')}</div>
              <h1 style={{ margin: 0, fontSize: '44px', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-.02em', textWrap: 'pretty' }}>
                {t('One sign-in, every product: the step on the left, why it matters on the right', '一套登录，所有产品：左边是步骤，右边说明为什么')}
              </h1>
              <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: '40em', textWrap: 'pretty' }}>
                {t(
                  'Desktop and web sign-in both use these components (@cosxai/ui 1.0.0-alpha.8). Broken down by component below; names match the code, and every specimen on this page is the component itself.',
                  '桌面端和网页端的登录都用这组组件（@cosxai/ui 1.0.0-alpha.8）。下面按组件拆开，名称与代码一致；本页每个示例就是组件本身。',
                )}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Pill>{t('Pattern', '产品模式')}</Pill>
                <Pill>{t('Decided', '已确定')}</Pill>
              </div>
            </div>

            <Section
              id="layout"
              title={t('AuthLayout · the page frame', 'AuthLayout · 页面框架')}
              lead={t('At 900px and above the yellow panel shows; below 900px it disappears and only the left column remains.', '宽度 ≥ 900px 时显示右侧黄色面板；更窄时面板消失，只留左栏。')}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={label}>{t('≥ 900px · light', '≥ 900px · 浅色')}</div>
                <div style={{ ...card, overflowX: 'auto' }}>
                  <Frame t={t} zh={v.zh} ink={false} dots />
                </div>
                <div style={label}>{t('≥ 900px · ink', '≥ 900px · 墨色')}</div>
                <div style={{ ...card, overflowX: 'auto' }}>
                  <Frame t={t} zh={v.zh} ink />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 440px) 1fr', gap: 24, alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={label}>{t('< 900px · the panel drops', '< 900px · 面板消失')}</div>
                    <div style={card}>
                      <Frame t={t} zh={v.zh} ink={false} width={440} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={label}>{t('Anatomy', '构成')}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, lineHeight: 1.6 }}>
                      {[
                        t('Product lockup, top left: Logo tile + product name', '产品标识：Logo 方块 + 产品名，左上'),
                        t('Theme switch, top right (see ThemeSwitch)', '主题切换，右上（见 ThemeSwitch）'),
                        t('The step: a centred 400px column', '步骤：居中的 400px 列'),
                        t('Help line: one line under the step', '帮助行：步骤下方，一句话'),
                        t('Footer: Privacy · Status left, language picker right', '页脚：左 Privacy · Status，右语言选择'),
                        t('The yellow panel, right (see AuthPanel)', '右侧黄色面板（见 AuthPanel）'),
                      ].map((text, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                          <span style={{ position: 'relative', width: 20, height: 20, flex: 'none', top: 4 }}>
                            <Dot n={i + 1} style={{ left: 0, top: 0 }} />
                          </span>
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              id="panel"
              title={t('AuthPanel · the text in the yellow panel', 'AuthPanel · 黄色面板里的文字')}
              lead={t(
                'The COSX wordmark on top; at the bottom an eyebrow, a large statement (plain first half, highlighted second half) and one explanatory sentence.',
                '顶部 COSX 字标；底部依次是眉题、一句大字（前半平实、后半高亮）、一句解释。',
              )}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(440px, 100%), 1fr))', gap: 16 }}>
                <PanelCard>
                  <AuthPanel eyebrow="Your workspaces" lead="Every workspace you belong to, " mark="under one sign-in." sub="Customers, colleagues and your own space, each with its own access." />
                </PanelCard>
                <PanelCard>
                  <AuthPanel eyebrow="Security" lead="A second step " mark="keeps the workspace yours." sub="Only Halden Capital asks for it. Your other workspaces open as usual." />
                </PanelCard>
                <PanelCard>
                  <AuthPanel eyebrow="Desktop" lead="Sign in once in your browser, " mark="stay signed in on this computer." sub="Passkeys and single sign-on work the same as on the web." />
                </PanelCard>
                <PanelCard>
                  <AuthPanel eyebrow="Web" lead="Sign in once, " mark="open any workspace from here." sub="Passkeys and single sign-on work the same as in the desktop app." />
                </PanelCard>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 16, marginTop: 16, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={label}>{t('Chinese highlight', '中文高亮')}</div>
                  <PanelCard zh>
                    <AuthPanel eyebrow="工作区" lead="你所在的每个工作区，" mark="一次登录。" sub="客户、同事和你自己的空间，各有各的权限。" />
                  </PanelCard>
                  <p style={{ ...caption, margin: 0 }}>
                    {t(
                      'The highlight wraps with the text, drawing a band on each line (box-decoration-break: clone). The Chinese band starts at 50%, at 1.35 leading and zero tracking.',
                      '高亮随文字换行，每一行各画一段色带（box-decoration-break: clone）。中文色带从 50% 开始，行高 1.35，字距 0。',
                    )}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={label}>{t('Wrapping at a narrow width', '窄宽度下的换行示意')}</div>
                  <PanelCard zh width={300} height={420}>
                    <AuthPanel eyebrow="工作区" lead="你所在的每个工作区，" mark="一次登录，全部打开。" />
                  </PanelCard>
                </div>
              </div>
            </Section>

            <Section
              id="step"
              title={t('AuthStepHead + AuthIconTile · a step’s heading', 'AuthStepHead + AuthIconTile · 步骤标题')}
              lead={t(
                'A 56px icon tile, a 30px title and one sentence. The tile has three tones: plain for a normal step, yellow for done, error for failed. The icon slot can also hold a Spinner (waiting) or a workspace logo (landing after entering a workspace).',
                '56px 图标方块 + 30px 标题 + 一句解释。方块三种色调：plain 普通步骤，yellow 完成，error 失败。图标位也可以放 Spinner（等待）或工作区标志（进入工作区后的落地页）。',
              )}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(440px, 100%), 1fr))', gap: 16 }}>
                <StepCard caption={t('Product mark · first step', '产品标志 · 首屏')}>
                  <AuthStepHead
                    icon={<Logo variant="tile" height={56} alt="" />}
                    title="Sign in to COSX"
                  >
                    Use your work email or an account you already have.
                  </AuthStepHead>
                </StepCard>
                <StepCard caption={t('plain + Spinner · waiting', 'plain + Spinner · 等待')}>
                  <AuthStepHead icon={<Spinner size={26} label="Waiting" />} title="Finish signing in in your browser">
                    We opened a new tab. Come back here once you see “You’re signed in”.
                  </AuthStepHead>
                </StepCard>
                <StepCard caption={t('plain · a normal step', 'plain · 普通步骤')}>
                  <AuthStepHead
                    icon={
                      <AuthIconTile>
                        <ShieldCheck size={26} strokeWidth={1.75} />
                      </AuthIconTile>
                    }
                    title="Confirm it’s you to open Halden Capital"
                  >
                    Halden Capital requires two-step verification.
                  </AuthStepHead>
                </StepCard>
                <StepCard caption={t('error · failed', 'error · 失败')}>
                  <AuthStepHead
                    icon={
                      <AuthIconTile tone="error">
                        <X size={26} strokeWidth={1.75} />
                      </AuthIconTile>
                    }
                    title="Sign-in didn’t finish"
                  >
                    The request expired after 10 minutes, so nothing was changed.
                  </AuthStepHead>
                </StepCard>
                <StepCard caption={t('plain · signed out (not an error)', 'plain · 已退出（不是错误）')}>
                  <AuthStepHead
                    icon={
                      <AuthIconTile>
                        <LogOut size={24} strokeWidth={1.75} />
                      </AuthIconTile>
                    }
                    title="You’re signed out"
                  >
                    Sign in again to open your workspaces.
                  </AuthStepHead>
                </StepCard>
                <StepCard caption={t('Workspace logo · landing', '工作区标志 · 落地页')}>
                  <AuthStepHead icon={<WorkspaceMark name="Halden Capital" size={56} />} title="Opening Halden Capital">
                    portal.halden.co
                  </AuthStepHead>
                </StepCard>
                <StepCard caption={t('yellow · done', 'yellow · 完成')}>
                  <AuthStepHead
                    icon={
                      <AuthIconTile tone="yellow">
                        <Check size={26} strokeWidth={1.75} />
                      </AuthIconTile>
                    }
                    title="You’re signed in"
                  >
                    Returning you to the app. You can close this tab.
                  </AuthStepHead>
                </StepCard>
              </div>
            </Section>

            <Section
              id="theme"
              title={t('ThemeSwitch · theme switch', 'ThemeSwitch · 主题切换')}
              lead={t(
                'Collapsed it shows only the current option; hover or focus expands all three: match system · light · dark. A quick click steps to the next; a click on an option picks it only once the switch has been open for 0.8 s, so a first tap on touch screens doesn’t land on the wrong one.',
                '收起时只显示当前选项；悬停或聚焦时展开三项：跟随系统 · 浅色 · 深色。快速点击切到下一项；展开满 0.8 秒后点击某项才会选中它，避免触屏的第一下点错。',
              )}
            >
              <div style={{ ...card, padding: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{t('Try it', '试一试')}</span>
                <ThemeSwitch value={tryMode} onChange={setTryMode} labels={themeLabels(t)} />
                <span style={caption}>{t('This demonstrates the control only; it doesn’t change the site theme.', '这里只演示控件本身，不会切换站点主题。')}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(440px, 100%), 1fr))', gap: 16 }}>
                {[false, true].map((ink) => (
                  <Ground key={String(ink)} ink={ink} style={{ ...card, padding: 24, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '14px 20px', alignItems: 'center' }}>
                    <span style={{ gridColumn: '1 / -1', fontSize: 14, fontWeight: 500 }}>{ink ? t('Ink', '墨色') : t('Light', '浅色')}</span>
                    {[
                      ['system', t('Collapsed · match system', '收起 · 跟随系统')],
                      ['light', t('Collapsed · light', '收起 · 浅色')],
                      ['ink', t('Collapsed · dark', '收起 · 深色')],
                    ].map(([m, name]) => (
                      <div key={m} style={{ display: 'contents' }}>
                        <ThemeSwitch value={m} onChange={noop} labels={themeLabels(t)} />
                        <span style={caption}>{name}</span>
                      </div>
                    ))}
                    <ThemeSwitch value="light" onChange={noop} labels={themeLabels(t)} defaultOpen />
                    <span style={caption}>{t('Expanded', '展开')}</span>
                  </Ground>
                ))}
              </div>
            </Section>

            <Section
              id="workspaces"
              title={t('WorkspaceRow + WorkspaceMark · workspace list', 'WorkspaceRow + WorkspaceMark · 工作区列表')}
              lead={t(
                'Each row: a logo or initial on the yellow, the name, one line of detail and a chevron. With no logo, or if it fails to load, the initial shows on the yellow.',
                '每行：标志或首字母（黄底）+ 名称 + 一行说明 + 右侧箭头。没有标志或加载失败时，显示黄底首字母。',
              )}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>
                <div style={{ ...card, padding: 28 }}>
                  <Chooser t={t} />
                </div>
                <div style={{ ...card, padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t('States', '状态')}</div>
                  {[
                    [t('Normal', '默认'), {}],
                    [t('Hover', '悬停'), { className: 'bg-hover' }],
                    [t('Keyboard focus', '键盘聚焦'), { className: 'shadow-(--focus-ring)' }],
                    [t('Opening', '正在打开'), { busy: true }],
                    [t('Other rows disabled', '其他行不可用'), { disabled: true }],
                  ].map(([name, p]) => (
                    <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={label}>{name}</span>
                      <WorkspaceRow name="Halden Capital" detail="halden" tabIndex={-1} {...p} />
                    </div>
                  ))}
                  <p style={{ ...caption, margin: 0 }}>
                    {t(
                      'Click any row on the left to see Opening: the chevron becomes a Spinner and the other rows are disabled. Row 3’s logo fails to load, so it shows the initial.',
                      '点左边列表里的任意一行，看“正在打开”的效果：箭头变成 Spinner，其他行不可用。第 3 行的标志加载失败，所以显示首字母。',
                    )}
                  </p>
                </div>
              </div>
            </Section>

            <Section id="decided" title={t('Decided detail · the line under the title', '已定细节 · 标题下的说明行')}>
              <div style={{ ...card, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, textWrap: 'pretty' }}>
                  {t(
                    '“Signed in as …” under “Choose a workspace” matches every other step’s explanation: 15px / 1.6 / text-secondary.',
                    '“Choose a workspace”标题下的“Signed in as …”与其他步骤的说明行统一为同一规格：15px / 1.6 / text-secondary。',
                  )}
                </p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
                    <thead>
                      <tr style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
                        {[t('Prop', '属性'), t('Type', '类型'), t('Default', '默认'), t('Description', '说明')].map((h) => (
                          <th key={h} style={{ fontWeight: 500, padding: '8px 12px', borderBottom: '1px solid var(--rule)' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>AuthStepHead.children</td>
                        <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>ReactNode</td>
                        <td style={{ padding: '10px 12px' }}>—</td>
                        <td style={{ padding: '10px 12px' }}>
                          {t('15px / 1.6 / --text-secondary on every step, including “Signed in as …”.', '15px / 1.6 / --text-secondary，所有步骤相同，包括“Signed in as …”。')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            <Section id="rules" title={t('Rules', '规则')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 16 }}>
                {[
                  [t('One set of components', '同一套组件'), t('Desktop and web both use these components. Products don’t write their own sign-in pages.', '桌面端和网页端都用这组组件，产品不自己写登录页。')],
                  [t('Text comes from outside', '文字由外部传入'), t('Components carry no translations or product names; English by default.', '组件不带翻译和产品名，默认英文。')],
                  [t('Where sign out goes', '退出登录的位置'), t('Under the workspace list, never top right.', '放在工作区列表下方，不放右上角。')],
                  [t('Red means failed', '红色只给失败'), t('Only “didn’t finish / failed” uses the red tile; being signed out is not an error.', '只有“没完成 / 失败”用红色方块；已退出不是错误。')],
                  [t('Chinese highlight wraps', '中文高亮换行'), t('In the yellow panel, the Chinese highlight wraps with the text.', '黄色面板里的中文高亮随文字换行。')],
                ].map(([h, body]) => (
                  <div key={h} style={{ ...card, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{h}</h3>
                    <span style={caption}>{body}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="related" title={t('Related', '相关')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 16 }}>
                {[
                  ['/metaroom-auth/metaroom-sign-in', t('Metaroom Sign In (full screen)', 'Metaroom 登录（整页）'), t('The main flow, desktop and MCP consent, 21 screens.', '主流程、桌面端和 MCP 授权，共 21 屏。')],
                  ['/pages/metaroom-auth', t('Metaroom sign-in · more screens', 'Metaroom 登录 · 补充页面'), t('Reset, required two-step, error pages.', '找回密码、强制二次验证、错误页。')],
                  ['/pattern-status', t('Status', '状态'), t('How red, yellow and ink are used.', '红色、黄色和墨色的用法。')],
                ].map(([href, h, body]) => (
                  <a key={href} href={href} style={{ ...card, padding: 24, display: 'flex', flexDirection: 'column', gap: 8, textDecoration: 'none' }}>
                    <span style={{ fontSize: 16, fontWeight: 500 }}>{h}</span>
                    <span style={caption}>{body}</span>
                  </a>
                ))}
              </div>
            </Section>
          </div>
        </main>
      </div>
    </div>
  );
}
