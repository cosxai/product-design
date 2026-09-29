// PortalTabs — converted once from the Claude Design export (pages/Portal Tabs.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';

/* eslint-disable */
class Logic extends DCLogic {
  renderVals() {
    const zh = this.props.lang === 'zh';
    const active = this.props.active ?? 'agent';
    const defs = zh
      ? [
          ['agent', 'message-circle', '对话', ''],
          ['tasks', 'square-check', '任务', '3'],
          ['docs', 'file-text', '文档', ''],
          ['clients', 'users', '客户', ''],
          ['more', 'menu', '更多', ''],
        ]
      : [
          ['agent', 'message-circle', 'Agent', ''],
          ['tasks', 'square-check', 'Tasks', '3'],
          ['docs', 'file-text', 'Docs', ''],
          ['clients', 'users', 'Clients', ''],
          ['more', 'menu', 'More', ''],
        ];
    return {
      tabs: defs.map(([k, icon, label, count]) => ({
        icon,
        label,
        count,
        countDisplay: count ? 'inline-block' : 'none',
        bg: k === active ? 'var(--brand-field)' : 'transparent',
        fg: k === active ? 'var(--ink)' : 'var(--text-primary)',
      })),
    };
  }
}

export const pageCss = '';

export default function PortalTabs(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          padding: '6px 8px 26px',
          borderTop: '1px solid var(--rule)',
          background: 'var(--bg-page)',
          color: 'var(--text-primary)',
        }}
      >
        {' '}
        {list(v.tabs).map((t$, $i) => {
          const s1 = { ...v, t: t$, $index: $i };
          return (
            <Fragment key={$i}>
              {' '}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  minHeight: '48px',
                  position: 'relative',
                }}
              >
                {' '}
                <span
                  style={{
                    width: '48px',
                    height: '28px',
                    borderRadius: '999px',
                    display: 'grid',
                    placeItems: 'center',
                    background: s1.t?.bg,
                    color: s1.t?.fg,
                  }}
                >
                  <DS.Icon name={s1.t?.icon} size={18} />
                </span>{' '}
                <span style={{ fontSize: '11px', fontWeight: '500' }}>{show(s1.t?.label)}</span>{' '}
                <span
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    marginLeft: '8px',
                    fontSize: '10px',
                    fontWeight: '600',
                    padding: '1px 5px',
                    borderRadius: '999px',
                    background: 'var(--brand-mark)',
                    color: 'var(--ink)',
                    display: s1.t?.countDisplay,
                  }}
                >
                  {show(s1.t?.count)}
                </span>{' '}
              </div>{' '}
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
