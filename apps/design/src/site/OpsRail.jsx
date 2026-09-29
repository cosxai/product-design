// OpsRail — converted once from the Claude Design export (pages/Ops Rail.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';

/* eslint-disable */
class Logic extends DCLogic {
  renderVals() {
    const zh = this.props.lang === 'zh';
    const p = (en, z) => (zh ? z : en);
    const mode = this.props.mode ?? 'inbox';
    const it = (label, o = {}) => {
      const on = !!o.on;
      return {
        label,
        icon: o.icon || 'dot',
        iconDisplay: o.icon ? 'inline-flex' : 'none',
        ini: o.ini || '',
        tile: o.tile || 'transparent',
        tileDisplay: o.ini ? 'grid' : 'none',
        count: o.count || '',
        cd: o.count ? 'inline-block' : 'none',
        countBg: o.hot ? 'var(--yellow-accent)' : 'transparent',
        countFg: o.hot ? 'var(--ink)' : on ? 'rgba(17,17,17,.7)' : 'var(--text-secondary)',
        countW: o.hot ? 600 : 500,
        bg: on ? 'var(--yellow)' : 'transparent',
        fg: on ? 'var(--ink)' : 'var(--text-primary)',
        w: on ? 500 : 400,
      };
    };
    const g = (label, items) => ({ label, ld: label ? 'block' : 'none', items });
    const groups =
      mode === 'project'
        ? [
            g('', [
              it(p('Overview', '概览'), { icon: 'layout-dashboard' }),
              it(p('Review', '审阅'), { icon: 'list-checks', count: '12', hot: true, on: true }),
              it(p('Parties', '当事人'), { icon: 'users' }),
              it(p('Applications', '申请'), { icon: 'file-check' }),
              it(p('Materials', '材料'), { icon: 'folder' }),
              it(p('Timeline', '时间线'), { icon: 'calendar' }),
              it(p('Pipeline', '流程'), { icon: 'workflow' }),
            ]),
          ]
        : [
            g('', [
              it(p('All open', '全部未关闭'), { icon: 'inbox', count: '12', on: true }),
              it(p('Assigned to me', '分配给我'), { icon: 'user', count: '5' }),
              it(p('Unassigned', '未分配'), { icon: 'user-round-x', count: '2', hot: true }),
              it(p('Waiting on us', '等我们处理'), { icon: 'clock', count: '5' }),
              it(p('Waiting on customer', '等客户'), { icon: 'hourglass', count: '4' }),
              it(p('Closed', '已关闭'), { icon: 'archive' }),
            ]),
            g(p('Customers', '客户'), [
              it('Halden Capital', { ini: 'H', tile: '#D6E4DA', count: '5' }),
              it('Vela Family Office', { ini: 'V', tile: '#E6DDF0', count: '2' }),
              it('Northgate LP', { ini: 'N', tile: '#DCE6F0', count: '1' }),
              it('Kowloon Bay Fund', { ini: 'K', tile: '#F0E0D6', count: '4' }),
            ]),
          ];
    const defs = [
      ['home', 'home', p('Home', '首页')],
      ['inbox', 'inbox', p('Inbox', '收件箱'), '12'],
      ['projects', 'briefcase', p('Projects', '项目')],
      ['docs', 'file-text', p('Documents', '文档')],
      ['agr', 'pen-line', p('Agreements', '协议')],
      ['cust', 'users', p('Customers', '客户')],
      ['matters', 'scale', p('Matters', '案件')],
      ['mkt', 'megaphone', p('Marketing', '营销')],
      ['admin', 'settings', p('Admin', '管理')],
    ];
    const active = mode === 'project' ? 'projects' : 'inbox';
    return {
      isInbox: mode !== 'project',
      isProject: mode === 'project',
      title: p('Inbox', '收件箱'),
      searchLabel: p('Search', '搜索'),
      backLabel: p('All projects', '全部项目'),
      projName: p('Wang family · Global Talent', '王氏家庭 · 全球人才签证'),
      projKind: p('Matter · immigration', '案件 · 移民'),
      groups,
      foot: [
        ['user-cog', p('Members & access', '成员与权限')],
        ['settings', p('Project settings', '项目设置')],
      ].map(([icon, label]) => ({ icon, label })),
      items: defs.map(([k, icon, label, count]) => ({
        icon,
        label,
        count: count || '',
        cd: count && k !== active ? 'inline-block' : 'none',
        bg: k === active ? 'var(--yellow)' : 'transparent',
        fg: k === active ? 'var(--ink)' : 'var(--text-primary)',
      })),
    };
  }
}

export const pageCss = '';

export default function OpsRail(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <nav style={{ height: '100%', flex: 'none', display: 'flex', color: 'var(--text-primary)' }}>
        {' '}
        <div
          style={{
            width: '64px',
            flex: 'none',
            background: 'var(--bg-sunk)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '16px 0',
            boxSizing: 'border-box',
          }}
        >
          {' '}
          <div
            title="COSX Advisory"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--yellow)',
              color: 'var(--ink)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '14px',
            }}
          >
            <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
          </div>{' '}
          {list(v.items).map((it$, $i) => {
            const s1 = { ...v, it: it$, $index: $i };
            return (
              <Fragment key={$i}>
                {' '}
                <div
                  title={s1.it?.label}
                  style={{
                    position: 'relative',
                    width: '44px',
                    height: '40px',
                    borderRadius: '8px',
                    display: 'grid',
                    placeItems: 'center',
                    background: s1.it?.bg,
                    color: s1.it?.fg,
                  }}
                >
                  <DS.Icon name={s1.it?.icon} size={18} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '0',
                      fontSize: '10px',
                      fontWeight: '600',
                      padding: '1px 5px',
                      borderRadius: '999px',
                      background: 'var(--yellow-accent)',
                      color: 'var(--ink)',
                      boxShadow: '0 0 0 2px var(--bg-sunk)',
                      display: s1.it?.cd,
                    }}
                  >
                    {show(s1.it?.count)}
                  </span>
                </div>{' '}
              </Fragment>
            );
          })}{' '}
          <div style={{ flex: '1' }} />{' '}
          <div
            title="Agent"
            style={{
              width: '44px',
              height: '40px',
              borderRadius: '8px',
              display: 'grid',
              placeItems: 'center',
              background: 'var(--ink)',
              color: 'var(--yellow-accent)',
              marginBottom: '8px',
            }}
          >
            <DS.Icon name="sparkles" size={18} />
          </div>{' '}
          <span
            title="Sam Ortiz"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '999px',
              background: 'var(--bg-chrome)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '11px',
              fontWeight: '600',
            }}
          >
            SO
          </span>{' '}
        </div>{' '}
        <div
          style={{
            width: '248px',
            flex: 'none',
            background: 'var(--bg-page)',
            borderRight: '1px solid var(--rule)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            padding: '16px 10px',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {' '}
          {v.isInbox ? (
            <>
              {' '}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 8px 12px' }}>
                <span style={{ fontSize: '15px', fontWeight: '500' }}>{show(v.title)}</span>
                <span style={{ display: 'inline-flex', color: 'var(--text-secondary)' }}>
                  <DS.Icon name="panel-left-close" size={16} />
                </span>
              </div>{' '}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  height: '34px',
                  padding: '0 10px',
                  borderRadius: '8px',
                  background: 'var(--bg-sunk)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  marginBottom: '4px',
                }}
              >
                <DS.Icon name="search" size={15} />
                {show(v.searchLabel)}
                <span style={{ marginLeft: 'auto', fontSize: '11px' }}>⌘K</span>
              </div>{' '}
            </>
          ) : null}{' '}
          {v.isProject ? (
            <>
              {' '}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '30px',
                  padding: '0 8px',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                }}
              >
                <DS.Icon name="arrow-left" size={14} />
                {show(v.backLabel)}
              </div>{' '}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px',
                  marginBottom: '6px',
                  borderRadius: '10px',
                  boxShadow: 'inset 0 0 0 1px var(--rule)',
                }}
              >
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    background: 'var(--ink)',
                    color: 'var(--linen)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '11px',
                    fontWeight: '600',
                    flex: 'none',
                  }}
                >
                  WF
                </span>
                <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.3' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {show(v.projName)}
                  </span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{show(v.projKind)}</span>
                </div>
                <DS.Icon name="chevrons-up-down" size={14} />
              </div>{' '}
            </>
          ) : null}{' '}
          {list(v.groups).map((g$, $i) => {
            const s2 = { ...v, g: g$, $index: $i };
            return (
              <Fragment key={$i}>
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {' '}
                  <span
                    style={{
                      display: s2.g?.ld,
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)',
                      padding: '14px 10px 4px',
                    }}
                  >
                    {show(s2.g?.label)}
                  </span>{' '}
                  {list(s2.g?.items).map((m$, $i) => {
                    const s3 = { ...s2, m: m$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        {' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            height: '32px',
                            padding: '0 10px',
                            borderRadius: '8px',
                            background: s3.m?.bg,
                            color: s3.m?.fg,
                            fontSize: '13px',
                            fontWeight: s3.m?.w,
                          }}
                        >
                          {' '}
                          <span style={{ display: s3.m?.iconDisplay, flex: 'none' }}>
                            <DS.Icon name={s3.m?.icon} size={15} />
                          </span>{' '}
                          <span
                            style={{
                              display: s3.m?.tileDisplay,
                              width: '18px',
                              height: '18px',
                              borderRadius: '5px',
                              background: s3.m?.tile,
                              color: 'var(--ink)',
                              placeItems: 'center',
                              fontSize: '9px',
                              fontWeight: '600',
                              flex: 'none',
                            }}
                          >
                            {show(s3.m?.ini)}
                          </span>{' '}
                          <span style={{ flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {show(s3.m?.label)}
                          </span>{' '}
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: s3.m?.countW,
                              padding: '1px 6px',
                              borderRadius: '999px',
                              background: s3.m?.countBg,
                              color: s3.m?.countFg,
                              display: s3.m?.cd,
                            }}
                          >
                            {show(s3.m?.count)}
                          </span>{' '}
                        </div>{' '}
                      </Fragment>
                    );
                  })}{' '}
                </div>{' '}
              </Fragment>
            );
          })}{' '}
          <div style={{ flex: '1' }} />{' '}
          {v.isProject ? (
            <>
              {' '}
              <div style={{ height: '1px', background: 'var(--rule-soft)', margin: '6px 0' }} />{' '}
              {list(v.foot).map((m$, $i) => {
                const s4 = { ...v, m: m$, $index: $i };
                return (
                  <Fragment key={$i}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                    >
                      <DS.Icon name={s4.m?.icon} size={15} />
                      {show(s4.m?.label)}
                    </div>
                  </Fragment>
                );
              })}{' '}
            </>
          ) : null}{' '}
        </div>
      </nav>
    </>
  );
}
