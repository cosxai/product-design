// SiteHeader — converted once from the Claude Design export (Site Header.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';

/* eslint-disable */
class Logic extends DCLogic {
  renderVals() {
    const zh = (this.props.lang ?? 'zh') === 'zh',
      dark = this.props.theme === 'dark',
      sec = this.props.section ?? '';
    const defs = [
      ['foundations', '基础', 'Foundations', '/colour'],
      ['brand', '品牌', 'Brand', '/logo'],
      ['components', '组件', 'Components', '/button'],
      ['patterns', '产品模式', 'Patterns', '/pattern-navigation'],
      ['templates', '页面模板', 'Templates', '/template-sign-in'],
      ['resources', '资源', 'Resources', '/downloads'],
    ];
    return {
      items: defs.map(([k, z, e, href]) => ({
        label: zh ? z : e,
        href: href || '#',
        title: href ? '' : zh ? '即将推出' : 'Coming soon',
        bg: k === sec ? 'var(--brand-field, var(--yellow))' : 'transparent',
        fg: k === sec ? 'var(--ink)' : href ? 'var(--text-primary)' : 'var(--text-secondary)',
      })),
      langLabel: zh ? 'EN' : '中文',
      langTitle: zh ? 'Switch to English' : '切换到中文',
      themeIcon: dark ? 'sun' : 'moon',
      themeTitle: zh ? (dark ? '浅色' : '深色') : dark ? 'Light' : 'Dark',
      onLang: this.props.onLang,
      onTheme: this.props.onTheme,
    };
  }
}

export const pageCss = '';

export default function SiteHeader(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: '0',
          zIndex: '20',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '0 24px',
          background: 'var(--bg-page)',
          borderBottom: '1px solid var(--rule)',
          boxSizing: 'border-box',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans-cjk)',
        }}
      >
        {' '}
        <a
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--text-primary)', flex: 'none' }}
        >
          <span
            style={{ width: '30px', height: '30px', borderRadius: '7px', background: '#FFE3A0', display: 'grid', placeItems: 'center' }}
          >
            <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: 'block' }} />
          </span>
          <span style={{ fontSize: '15px', fontWeight: '500', whiteSpace: 'nowrap' }}>COSX Design System</span>
        </a>{' '}
        <nav
          style={{
            display: 'flex',
            gap: '2px',
            minWidth: '0',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            maskImage: 'linear-gradient(to right, #000 calc(100% - 24px), transparent)',
          }}
        >
          {' '}
          {list(v.items).map((i$, $i) => {
            const s1 = { ...v, i: i$, $index: $i };
            return (
              <Fragment key={$i}>
                <a
                  href={s1.i?.href}
                  title={s1.i?.title}
                  style={{
                    height: '34px',
                    padding: '0 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    background: s1.i?.bg,
                    color: s1.i?.fg,
                  }}
                >
                  {show(s1.i?.label)}
                </a>
              </Fragment>
            );
          })}{' '}
        </nav>{' '}
        <div style={{ flex: '1' }} />{' '}
        <button
          type="button"
          onClick={v.onLang}
          title={v.langTitle}
          style={{
            height: '34px',
            padding: '0 12px',
            border: '1px solid var(--rule)',
            borderRadius: '8px',
            background: 'transparent',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans-cjk)',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            flex: 'none',
          }}
        >
          {show(v.langLabel)}
        </button>{' '}
        <button
          type="button"
          onClick={v.onTheme}
          aria-label={v.themeTitle}
          title={v.themeTitle}
          style={{
            width: '34px',
            height: '34px',
            border: '1px solid var(--rule)',
            borderRadius: '8px',
            background: 'transparent',
            color: 'var(--text-primary)',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            flex: 'none',
          }}
        >
          <DS.Icon name={v.themeIcon} size={16} />
        </button>
      </header>
    </>
  );
}
