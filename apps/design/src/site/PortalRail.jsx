// PortalRail — converted once from the Claude Design export (pages/Portal Rail.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';

/* eslint-disable */
class Logic extends DCLogic {
  row(label, o = {}) {
    const on = !!o.on;
    return {
      label,
      sub: o.sub || '',
      subDisplay: o.sub ? 'block' : 'none',
      icon: o.icon || 'dot',
      iconDisplay: o.icon ? 'inline-flex' : 'none',
      dot: o.dot || 'transparent',
      ring: o.ring || 'none',
      dotDisplay: o.dot || o.ring ? 'inline-block' : 'none',
      count: o.count || '',
      cd: o.count ? 'inline-block' : 'none',
      bg: on ? 'var(--brand-field)' : 'transparent',
      fg: on ? 'var(--ink)' : 'var(--text-primary)',
      subFg: on ? 'rgba(17,17,17,.7)' : 'var(--text-secondary)',
      countBg: on ? 'var(--paper)' : 'var(--brand-mark)',
      w: on ? 500 : 400,
      h: o.sub ? '46px' : '30px',
      pad: o.sub ? '6px 10px' : o.tree ? `0 10px 0 ${4 + (o.depth || 0) * 14}px` : '0 10px',
      chevDisplay: o.tree ? 'inline-flex' : 'none',
      chevOp: o.chev ? 1 : 0,
      chevRot: o.chev === 'open' ? 'rotate(90deg)' : 'none',
    };
  }
  grp(label, rows) {
    return { label, ld: label ? 'block' : 'none', items: rows };
  }
  renderVals() {
    const zh = this.props.lang === 'zh';
    const p = (en, z) => (zh ? z : en);
    const halden = (this.props.brand ?? 'metaroom') === 'halden';
    const active = this.props.active ?? 'agent';
    const r = (l, o) => this.row(l, o),
      g = (l, rows) => this.grp(l, rows);
    const att = 'var(--brand-mark)',
      ink = 'var(--text-primary)',
      prog = 'inset 0 0 0 1.5px var(--text-primary)';
    const ctx = {
      agent: {
        title: p('Conversation', '对话'),
        action: p('New conversation', '新对话'),
        actionIcon: 'plus',
        groups: [
          g(p('Today', '今天'), [
            r(p('Chase NDA signatures', '催签保密协议'), { sub: p('Handed over as T-128', '已转为任务 T-128'), on: true }),
            r(p('What changed this week?', '这周有什么变化？'), { sub: p('3 investors opened the data room', '3 位投资人打开了数据室') }),
          ]),
          g(p('This week', '本周'), [
            r(p('Q3 report → website article', '第三季度报告 → 网站文章'), { sub: 'T-124 · ' + p('awaiting you', '等你处理') }),
            r(p('Translate the term sheet', '翻译条款清单'), { sub: p('Delivered Tuesday', '周二已交付') }),
          ]),
          g(p('Earlier', '更早'), [
            r(p('Kowloon Bay onboarding', '九龙湾基金开户'), { sub: '12 Sep' }),
            r(p('Find the latest cap table', '找最新的股权结构表'), { sub: '8 Sep' }),
          ]),
        ],
      },
      tasks: {
        title: p('My tasks', '我的任务'),
        action: p('New task', '新建任务'),
        actionIcon: 'plus',
        groups: [
          g(p('Awaiting you · 2', '等你处理 · 2'), [
            r(p('Sign the engagement letter', '签署委托协议'), { dot: att, sub: 'T-131 · ' + p('due Friday', '周五截止') }),
            r(p('Approve the Q3 investor update', '审批第三季度投资人简报'), { dot: att, sub: 'T-124 · Sam Ortiz', on: true }),
          ]),
          g(p('In progress · 3', '进行中 · 3'), [
            r(p('Chase NDA signatures', '催签保密协议'), { ring: prog, sub: 'T-128 · Sam Ortiz' }),
            r(p('Series A data room index', 'A 轮数据室目录'), { ring: prog, sub: 'T-122 · Agent' }),
          ]),
          g(p('Delivered · 2', '已交付 · 2'), [
            r(p('Translate the term sheet', '翻译条款清单'), { dot: ink, sub: 'T-119 · ' + p('Tuesday', '周二') }),
          ]),
        ],
      },
      docs: {
        title: p('Documents', '文档'),
        action: p('Upload', '上传'),
        actionIcon: 'upload',
        groups: [
          g('', [
            r(p('All documents', '全部文档'), { icon: 'files', on: true }),
            r(p('Shared with me', '分享给我'), { icon: 'inbox', count: '2' }),
            r(p('Signed', '已签署'), { icon: 'pen-line' }),
            r(p('Starred', '星标'), { icon: 'star' }),
          ]),
          g(p('Folders', '文件夹'), [
            r(p('Harbour Series A', 'Harbour A 轮'), { tree: 1, chev: 'open', icon: 'folder-open' }),
            r(p('Financials 财务', '财务 Financials'), { tree: 1, chev: 'closed', icon: 'folder', depth: 1 }),
            r('Legal', { tree: 1, chev: 'closed', icon: 'folder', depth: 1 }),
            r(p('Signed copies', '已签署副本'), { tree: 1, icon: 'folder-lock', depth: 1 }),
            r(p('Kowloon Bay Fund II', '九龙湾基金 II'), { tree: 1, chev: 'closed', icon: 'folder' }),
            r(p('My uploads', '我上传的'), { tree: 1, chev: 'closed', icon: 'folder' }),
          ]),
        ],
      },
      clients: {
        title: p('My clients', '我的客户'),
        action: p('Add a prospect', '添加潜在客户'),
        actionIcon: 'user-plus',
        groups: [
          g(p('Projects', '项目'), [
            r(p('Harbour Series A', 'Harbour A 轮'), {
              icon: 'briefcase',
              sub: p('24 contacts · 2 at term sheet', '24 位联系人 · 2 位到条款'),
              on: true,
            }),
            r(p('Kowloon Bay Fund II', '九龙湾基金 II'), { icon: 'briefcase', sub: p('9 contacts', '9 位联系人') }),
          ]),
          g(p('Views', '视图'), [
            r(p('All contacts', '全部联系人'), { icon: 'users' }),
            r(p('Needs follow-up', '需要跟进'), { icon: 'bell', count: '7' }),
            r(p('Declined', '已拒绝'), { icon: 'user-x' }),
          ]),
        ],
      },
      content: {
        title: p('My content', '我的内容'),
        action: p('Ask for new content', '提出新内容需求'),
        actionIcon: 'plus',
        groups: [
          g(p('Waiting for me · 1', '等我处理 · 1'), [
            r(p('Q3 2026 investor update', '2026 年第三季度投资人简报'), {
              dot: att,
              sub: p('Article · v3 · Sam Ortiz', '文章 · 第 3 版 · Sam Ortiz'),
              on: true,
            }),
          ]),
          g(p('Drafts · 2', '草稿 · 2'), [
            r(p('Team page', '团队页面'), { dot: 'var(--grey)', sub: p('Page · edited by you', '页面 · 你编辑') }),
            r(p('Fund II launch note', '二期基金发布说明'), { ring: prog, sub: p('Article · Agent drafting', '文章 · Agent 起草中') }),
          ]),
          g(p('Published · 6', '已发布 · 6'), [
            r(p('Q2 2026 investor update', '2026 年第二季度投资人简报'), { dot: ink, sub: p('2,340 views', '2,340 次浏览') }),
            r(p('Our approach to deployment', '我们的投资节奏'), { dot: ink, sub: p('812 views', '812 次浏览') }),
          ]),
        ],
      },
    }[active] || { title: '', groups: [] };
    const defs = [
      ['agent', 'message-circle', p('Conversation', '对话'), 0],
      ['tasks', 'square-check', p('My tasks', '我的任务'), 1],
      ['docs', 'file-text', p('Documents', '文档'), 0],
      ['clients', 'users', p('My clients', '我的客户'), 1],
      ['content', 'newspaper', p('My content', '我的内容'), 1],
    ];
    return {
      initial: halden ? 'H' : 'M',
      logoDisplay: halden ? 'none' : 'block',
      initialDisplay: halden ? 'inline' : 'none',
      brandName: halden ? 'Halden Capital' : 'MetaRoom',
      userName: p('Li Wei', '李维'),
      searchLabel: p('Search', '搜索'),
      title: ctx.title,
      groups: ctx.groups,
      hasAction: !!ctx.action,
      actionLabel: ctx.action || '',
      actionIcon: ctx.actionIcon || 'plus',
      fullW: { style: { width: '100%', marginBottom: 4 } },
      items: defs.map(([k, icon, label, dot]) => ({
        icon,
        label,
        bg: k === active ? 'var(--brand-field)' : 'transparent',
        fg: k === active ? 'var(--ink)' : 'var(--text-primary)',
        dotDisplay: dot && k !== active ? 'block' : 'none',
      })),
    };
  }
}

export const pageCss = '';

export default function PortalRail(props) {
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
            title={v.brandName}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--brand-field)',
              color: 'var(--ink)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '14px',
            }}
          >
            <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: v.logoDisplay }} />
            <span style={{ display: v.initialDisplay }}>{show(v.initial)}</span>
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
                      top: '6px',
                      right: '7px',
                      width: '7px',
                      height: '7px',
                      borderRadius: '999px',
                      background: 'var(--brand-mark)',
                      boxShadow: '0 0 0 2px var(--bg-sunk)',
                      display: s1.it?.dotDisplay,
                    }}
                  />
                </div>{' '}
              </Fragment>
            );
          })}{' '}
          <div style={{ flex: '1' }} />{' '}
          <span
            title={v.userName}
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
            LW
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
              marginBottom: '8px',
            }}
          >
            <DS.Icon name="search" size={15} />
            {show(v.searchLabel)}
            <span style={{ marginLeft: 'auto', fontSize: '11px' }}>⌘K</span>
          </div>{' '}
          {v.hasAction ? (
            <>
              <div className="sc-host-x" style={{ width: '100%' }}>
                <DS.Button variant="secondary" size="sm" {...v.fullW}>
                  <DS.Icon name={v.actionIcon} size={14} />
                  {show(v.actionLabel)}
                </DS.Button>
              </div>
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
                            minHeight: s3.m?.h,
                            padding: s3.m?.pad,
                            borderRadius: '8px',
                            background: s3.m?.bg,
                            color: s3.m?.fg,
                            boxSizing: 'border-box',
                          }}
                        >
                          {' '}
                          <span style={{ display: s3.m?.chevDisplay }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                flex: 'none',
                                marginRight: '-4px',
                                opacity: s3.m?.chevOp,
                                transform: s3.m?.chevRot,
                              }}
                            >
                              <DS.Icon name="chevron-right" size={12} />
                            </span>
                          </span>
                          <span style={{ display: s3.m?.iconDisplay, flex: 'none' }}>
                            <DS.Icon name={s3.m?.icon} size={15} />
                          </span>{' '}
                          <span
                            style={{
                              display: s3.m?.dotDisplay,
                              width: '8px',
                              height: '8px',
                              borderRadius: '999px',
                              background: s3.m?.dot,
                              boxShadow: s3.m?.ring,
                              flex: 'none',
                            }}
                          />{' '}
                          <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.35' }}>
                            <span
                              style={{
                                fontSize: '13px',
                                fontWeight: s3.m?.w,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {show(s3.m?.label)}
                            </span>
                            <span
                              style={{
                                display: s3.m?.subDisplay,
                                fontSize: '11.5px',
                                color: s3.m?.subFg,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {show(s3.m?.sub)}
                            </span>
                          </div>{' '}
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '600',
                              padding: '1px 6px',
                              borderRadius: '999px',
                              background: s3.m?.countBg,
                              color: 'var(--ink)',
                              display: s3.m?.cd,
                              flex: 'none',
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
        </div>
      </nav>
    </>
  );
}
