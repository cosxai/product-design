// MetaRoomNavigation — converted once from the Claude Design export (ui-spec/MetaRoom Navigation.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';

/* eslint-disable */
class Logic extends DCLogic {
  renderVals() {
    const mods = [
      ['home', 'Home'],
      ['briefcase', 'Projects'],
      ['file-text', 'Documents'],
      ['pen-line', 'Agreements'],
      ['users', 'Customers'],
      ['scale', 'Matters'],
      ['megaphone', 'Marketing'],
      ['settings', 'Admin'],
    ];
    const tree = [
      [0, 'Harbour data room', 'folder-open', 'open'],
      [1, '2026 Q3 尽调材料', 'folder-open', 'open'],
      [2, 'Legal', 'folder-open', 'open'],
      [3, 'Shareholder agreements', 'folder', 'active'],
      [3, 'Side letters', 'folder', ''],
      [2, 'Financials 财务报表', 'folder', ''],
      [1, 'Dropbox · Harbour mirror', 'folder-sync', ''],
      [1, 'Signed copies', 'folder-lock', 'leaf'],
      [0, 'Inbox · deals@', 'mail', ''],
    ].map(([d, label, icon, st]) => ({
      label,
      icon,
      indent: 2 + d * 14 + 'px',
      bg: st === 'active' ? 'var(--yellow)' : 'transparent',
      w: st === 'active' ? 500 : 400,
      chev: st === 'leaf' || st === 'active' ? 0 : 1,
      rot: st === 'open' ? 'rotate(90deg)' : 'none',
    }));
    const modulesB = [];
    mods.slice(0, 7).forEach(([icon, label]) => {
      const on = label === 'Documents';
      modulesB.push({
        icon,
        label,
        meta: '',
        h: '34px',
        pad: '10px',
        bg: 'transparent',
        fs: '13.5px',
        w: on ? 600 : 500,
        fg: 'var(--ink)',
        iconDisplay: 'inline-flex',
      });
      if (on)
        [
          ['All documents', ''],
          ['Recent', ''],
          ['Starred', ''],
          ['Shared with me', '3'],
          ['Shared by me', ''],
          ['Trash', ''],
        ].forEach(([l, m]) =>
          modulesB.push({
            icon: 'dot',
            label: l,
            meta: m,
            h: '30px',
            pad: '36px',
            bg: l === 'All documents' ? 'var(--yellow)' : 'transparent',
            fs: '13px',
            w: l === 'All documents' ? 500 : 400,
            fg: 'var(--ink)',
            iconDisplay: 'none',
          }),
        );
    });
    const it = (icon, label, count, on) => ({
      icon,
      label,
      count: count || '',
      cd: count ? 'inline-block' : 'none',
      bg: on ? 'var(--yellow)' : 'transparent',
      w: on ? 500 : 400,
    });
    const grp = (label, items) => ({ label, ld: label ? 'block' : 'none', items: items.map((a) => it(...a)) });
    const modules2b = [];
    mods.slice(0, 7).forEach(([icon, label]) => {
      const on = label === 'Projects';
      modules2b.push({
        icon,
        label,
        meta: '',
        h: '34px',
        pad: '10px',
        bg: 'transparent',
        fs: '13.5px',
        w: on ? 600 : 500,
        fg: 'var(--ink)',
        iconDisplay: 'inline-flex',
      });
      if (on)
        [
          ['All projects', ''],
          ['Assigned to me', '5'],
          ['Archived', ''],
          ['Wang family · Global Talent', '', 1],
          ['Harbour Series A', ''],
        ].forEach(([l, m, sel]) =>
          modules2b.push({
            icon: 'dot',
            label: l,
            meta: m,
            h: '30px',
            pad: '36px',
            bg: sel ? 'var(--yellow)' : 'transparent',
            fs: '13px',
            w: sel ? 500 : 400,
            fg: 'var(--ink)',
            iconDisplay: 'none',
          }),
        );
    });
    const badge = (k) =>
      k === 'err'
        ? { bBg: 'var(--status-error)', bFg: '#fff' }
        : k === 'att'
          ? { bBg: 'var(--yellow-accent)', bFg: 'var(--ink)' }
          : { bBg: 'var(--linen)', bFg: 'var(--ink)' };
    const tab = ([label, count, on]) => ({
      label,
      count: count || '',
      cd: count ? 'inline-block' : 'none',
      fg: on ? 'var(--ink)' : 'var(--grey)',
      line: on ? 'inset 0 -2px 0 var(--ink)' : 'none',
    });
    return {
      navCards: [
        ['page', 'Shareholder agreement 股东协议 v3', 'PDF', 'Signed', 'var(--ink)', 'none', 1],
        ['page', 'Shareholder agreement v2', 'PDF', '3 weeks ago', 'var(--grey)', 'none'],
        ['icon', 'Cap table.xlsx', 'Excel', 'Yesterday', 'var(--grey)', 'none', 1, 'file-spreadsheet'],
        ['icon', 'Loan agreement.pdf', 'PDF', 'Password', 'var(--yellow-accent)', 'none', 0, 'file-lock'],
        ['icon', 'Re: Side letter comments.eml', 'Email', 'Indexing', 'transparent', 'inset 0 0 0 1.5px var(--ink)', 0, 'mail'],
        ['page', 'Board minutes 2025', 'Word', '3 days ago', 'var(--grey)', 'none'],
        ['page', 'Drag-along notice', 'PDF', '12 Sep', 'var(--grey)', 'none'],
        ['page', 'Tag-along notice', 'PDF', '12 Sep', 'var(--grey)', 'none'],
      ].map(([k, title, fmt, meta, dot, ring, star, icon]) => ({
        title,
        fmt,
        meta,
        dot,
        ring,
        icon: icon || 'file',
        pageDisplay: k === 'page' ? 'flex' : 'none',
        iconDisplay: k === 'page' ? 'none' : 'grid',
        starDisplay: star ? 'grid' : 'none',
      })),
      modsProj: mods.map(([icon, label]) => ({ icon, label, bg: label === 'Projects' ? 'var(--yellow)' : 'transparent' })),
      modsMkt: mods.map(([icon, label]) => ({ icon, label, bg: label === 'Marketing' ? 'var(--yellow)' : 'transparent' })),
      modules2b,
      projMenu: [
        grp('', [
          ['layout-dashboard', 'Overview'],
          ['list-checks', 'Review', '12', 1],
          ['users', 'Parties'],
          ['file-check', 'Applications'],
          ['folder', 'Materials'],
          ['calendar', 'Timeline'],
          ['workflow', 'Pipeline'],
        ]),
      ],
      projFoot: [
        grp('', [
          ['user-cog', 'Members & access'],
          ['settings', 'Project settings'],
        ]),
      ],
      siteMenu: [
        grp('Content', [
          ['file-text', 'Pages'],
          ['newspaper', 'Articles', '1'],
          ['image', 'Media'],
        ]),
        grp('Audience', [
          ['users', 'Subscribers', '', 1],
          ['mail', 'Newsletters'],
          ['clipboard-list', 'Forms', '3'],
        ]),
        grp('Insights', [
          ['activity', 'Traffic'],
          ['mouse-pointer-click', 'Engagement'],
        ]),
      ],
      siteFoot: [
        grp('', [
          ['globe', 'Domain & brand'],
          ['settings', 'Site settings'],
        ]),
      ],
      projTabs: [['Overview'], ['Review', '12', 1], ['Parties'], ['Applications'], ['Materials'], ['Timeline'], ['Pipeline']].map(tab),
      siteTabs: [['Overview'], ['Pages'], ['Articles', '1'], ['Subscribers', '', 1]].map(tab),
      siteMore: [
        ['image', 'Media'],
        ['mail', 'Newsletters'],
        ['clipboard-list', 'Forms'],
        ['activity', 'Traffic'],
        ['mouse-pointer-click', 'Engagement'],
      ].map(([icon, label]) => ({ icon, label })),
      qRows: [
        ['Fact conflict', '王志远 · date of birth', 'Conflict', 'err'],
        ['Fact review', '李敏 · employer since', 'Needs review', 'att'],
        ['Material ownership', 'Bank statement 2025-06.pdf', 'Needs review', 'att'],
        ['Merge proposal', 'Employment contract · 2 parts', 'Needs review', 'att'],
        ['Stale check', 'Global Talent · endorsement evidence', 'Stale', 'neu'],
        ['Fact review', '王志远 · UK entry date', 'Suggestion', 'neu'],
      ].map(([kind, title, status, k]) => ({ kind, title, status, ...badge(k) })),
      subs: [
        ['Anna Kowalski', 'Weekly · since Mar 2025'],
        ['王志远', 'Monthly · since Jan 2026'],
        ['James Park', 'Weekly · since Aug 2026'],
        ['Maria Rossi', 'Paused'],
      ].map(([name, meta]) => ({ name, meta })),
      tabsProj: [
        ['home', 'Home'],
        ['briefcase', 'Projects', 1],
        ['file-text', 'Docs'],
        ['sparkles', 'Agent'],
        ['menu', 'More'],
      ].map(([icon, label, on]) => ({ icon, label, bg: on ? 'var(--yellow)' : 'transparent' })),
      modulesA: mods.map(([icon, label]) => ({ icon, label, bg: label === 'Documents' ? 'var(--yellow)' : 'transparent' })),
      modulesB,
      modulesC: mods.slice(0, 7).map(([icon, label]) => ({ label, bg: label === 'Documents' ? 'var(--yellow)' : 'transparent' })),
      viewsDocs: [
        ['files', 'All documents', ''],
        ['clock', 'Recent', ''],
        ['star', 'Starred', ''],
        ['inbox', 'Shared with me', '3'],
        ['send', 'Shared by me', ''],
        ['trash-2', 'Trash', ''],
      ].map(([icon, label, meta]) => ({ icon, label, meta })),
      tree,
      rows: [
        ['file-text', 'Shareholder agreement 股东协议 v3.pdf', 'Signed · 2 h ago'],
        ['file-text', 'Shareholder agreement v2.pdf', '3 weeks ago'],
        ['file-spreadsheet', 'Cap table.xlsx', 'Yesterday'],
        ['file-lock', 'Loan agreement.pdf', 'Password'],
        ['mail', 'Re: Side letter comments.eml', 'Indexing'],
        ['file-text', 'Board minutes 2025.docx', '3 days ago'],
        ['file-text', 'Drag-along notice.pdf', '12 Sep'],
      ].map(([icon, name, meta]) => ({ icon, name, meta })),
      opsTabs: [
        ['home', 'Home'],
        ['briefcase', 'Projects'],
        ['file-text', 'Docs'],
        ['sparkles', 'Agent'],
        ['menu', 'More'],
      ].map(([icon, label]) => ({ icon, label, bg: label === 'Docs' ? 'var(--yellow)' : 'transparent' })),
    };
  }
}

export const pageCss =
  'html, body { margin: 0; background: var(--sunk-2); -webkit-font-smoothing: antialiased; }\n    a { color: var(--ink); text-underline-offset: 3px; }\n    a:hover { color: var(--grey); }';

export default function MetaRoomNavigation(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="MetaRoomNavigation" precedence="page">
        {pageCss}
      </style>
      <section
        lang="zh-CN"
        style={{
          width: 'max-content',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          padding: '72px',
          fontFamily: 'var(--font-sans-cjk)',
          color: 'var(--ink)',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        {' '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '920px' }}>
          {' '}
          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>
            第 2 轮 · 多一层的结构 · 模块 → 列表 → 实体（带自己的菜单）
          </span>{' '}
          <h1 style={{ margin: '0', fontSize: '40px', fontWeight: '500', lineHeight: '1.25' }}>
            项目和站点都是<span className="marker">带自己菜单的实体</span>，需要一个固定的位置放这层菜单
          </h1>{' '}
          <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.8', color: 'var(--grey)' }}>
            文档树是同一个实体内部的层级，放在页内就够了。项目的子模块（Review、Parties、Pipeline…）和站点的子模块（Pages、Subscribers、Traffic…）是导航，而且各自带设置。下面三种放法都用同两个场景：王氏家庭项目的
            Review，Halden 站点的 Subscribers。
          </p>{' '}
        </div>{' '}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'flex-start' }}>
          {' '}
          <div id="2a" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {' '}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'var(--ink)',
                  color: 'var(--linen)',
                }}
              >
                2a
              </span>
              <span style={{ fontSize: '22px', fontWeight: '500' }}>
                {'基于 '}
                <a href="#1a">1a</a>
                {' · 上下文栏跟随层级'}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'var(--ink)',
                  color: 'var(--yellow-accent)',
                }}
              >
                已确定
              </span>
            </div>{' '}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 360px)', gap: '16px', fontSize: '13px', lineHeight: '1.6' }}>
              {' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>结构</span>
                <span style={{ color: 'var(--grey)' }}>
                  图标栏始终放模块。在项目列表页，上下文栏放视图和最近项目；进入项目后，整栏换成这个项目的菜单，顶部是“← All
                  projects”和项目切换器，项目设置放在底部。
                </span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>Marketing 站点</span>
                <span style={{ color: 'var(--grey)' }}>
                  做法相同，菜单按 Content / Audience / Insights 分组，域名和站点设置放在底部。点进某个订阅者只加到面包屑里，菜单仍停在
                  Subscribers。
                </span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>代价</span>
                <span style={{ color: 'var(--grey)' }}>和 1a 一样，两列固定占 312px。好处是在任何一层都能一键切到别的模块。</span>
              </div>{' '}
            </div>{' '}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {' '}
              <div
                style={{
                  flex: 'none',
                  width: '1200px',
                  height: '720px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'var(--paper)',
                  boxShadow: '0 0 0 1px var(--rule)',
                  display: 'flex',
                }}
              >
                {' '}
                <div
                  style={{
                    width: '64px',
                    flex: 'none',
                    background: 'var(--linen)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '16px 0',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--yellow)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '14px',
                    }}
                  >
                    <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
                  </div>{' '}
                  {list(v.modsProj).map((m$, $i) => {
                    const s1 = { ...v, m: m$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div
                          title={s1.m?.label}
                          style={{
                            width: '44px',
                            height: '40px',
                            borderRadius: '8px',
                            display: 'grid',
                            placeItems: 'center',
                            background: s1.m?.bg,
                          }}
                        >
                          <DS.Icon name={s1.m?.icon} size={18} />
                        </div>
                      </Fragment>
                    );
                  })}{' '}
                </div>{' '}
                <div
                  style={{
                    width: '248px',
                    flex: 'none',
                    borderRight: '1px solid var(--rule)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    padding: '14px 10px',
                    boxSizing: 'border-box',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '30px',
                      padding: '0 8px',
                      fontSize: '13px',
                      color: 'var(--grey)',
                    }}
                  >
                    <DS.Icon name="arrow-left" size={14} />
                    All projects
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px',
                      marginBottom: '10px',
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
                      <span
                        style={{ fontSize: '13px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        Wang family · Global Talent
                      </span>
                      <span style={{ fontSize: '11.5px', color: 'var(--grey)' }}>Matter · immigration</span>
                    </div>
                    <DS.Icon name="chevrons-up-down" size={14} />
                  </div>{' '}
                  {list(v.projMenu).map((g$, $i) => {
                    const s2 = { ...v, g: g$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              display: s2.g?.ld,
                              fontSize: '12px',
                              fontWeight: '500',
                              color: 'var(--grey)',
                              padding: '12px 10px 4px',
                            }}
                          >
                            {show(s2.g?.label)}
                          </span>
                          {list(s2.g?.items).map((m$, $i) => {
                            const s3 = { ...s2, m: m$, $index: $i };
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
                                    background: s3.m?.bg,
                                    fontSize: '13px',
                                    fontWeight: s3.m?.w,
                                  }}
                                >
                                  <DS.Icon name={s3.m?.icon} size={15} />
                                  {show(s3.m?.label)}
                                  <span
                                    style={{
                                      marginLeft: 'auto',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      padding: '1px 6px',
                                      borderRadius: '999px',
                                      background: 'var(--yellow-accent)',
                                      display: s3.m?.cd,
                                    }}
                                  >
                                    {show(s3.m?.count)}
                                  </span>
                                </div>
                              </Fragment>
                            );
                          })}
                        </div>
                      </Fragment>
                    );
                  })}{' '}
                  <div style={{ flex: '1' }} /> <div style={{ height: '1px', background: 'var(--rule-soft)', margin: '6px 0' }} />{' '}
                  {list(v.projFoot).map((g$, $i) => {
                    const s4 = { ...v, g: g$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {list(s4.g?.items).map((m$, $i) => {
                            const s5 = { ...s4, m: m$, $index: $i };
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
                                    background: s5.m?.bg,
                                    fontSize: '13px',
                                  }}
                                >
                                  <DS.Icon name={s5.m?.icon} size={15} />
                                  {show(s5.m?.label)}
                                </div>
                              </Fragment>
                            );
                          })}
                        </div>
                      </Fragment>
                    );
                  })}{' '}
                </div>{' '}
                <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                  {' '}
                  <div
                    style={{
                      height: '52px',
                      flex: 'none',
                      borderBottom: '1px solid var(--rule)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0 20px',
                      fontSize: '13px',
                    }}
                  >
                    <span>Projects</span>
                    <span style={{ color: 'var(--grey)' }}>/</span>
                    <span>Wang family · Global Talent</span>
                    <span style={{ color: 'var(--grey)' }}>/</span>
                    <span style={{ fontWeight: '500' }}>Review</span>
                    <div style={{ flex: '1' }} />
                    <DS.Icon name="inbox" size={18} />
                  </div>{' '}
                  <div style={{ flex: '1', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {' '}
                    <span style={{ fontSize: '22px', fontWeight: '500', paddingBottom: '8px' }}>Review</span>{' '}
                    {list(v.qRows).map((r$, $i) => {
                      const s6 = { ...v, r: r$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              height: '48px',
                              borderBottom: '1px solid var(--rule-soft)',
                              fontSize: '13px',
                            }}
                          >
                            <span style={{ width: '130px', flex: 'none', fontSize: '12px', color: 'var(--grey)' }}>{show(s6.r?.kind)}</span>
                            <span style={{ flex: '1' }}>{show(s6.r?.title)}</span>
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '4px 7px',
                                borderRadius: '6px',
                                background: s6.r?.bBg,
                                color: s6.r?.bFg,
                              }}
                            >
                              {show(s6.r?.status)}
                            </span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {' '}
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>Marketing · 站点内</span>{' '}
                <div
                  style={{
                    width: '400px',
                    height: '600px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--paper)',
                    boxShadow: '0 0 0 1px var(--rule)',
                    display: 'flex',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      width: '64px',
                      flex: 'none',
                      background: 'var(--linen)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '16px 0',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--yellow)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '14px',
                      }}
                    >
                      <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
                    </div>{' '}
                    {list(v.modsMkt).map((m$, $i) => {
                      const s7 = { ...v, m: m$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              width: '44px',
                              height: '40px',
                              borderRadius: '8px',
                              display: 'grid',
                              placeItems: 'center',
                              background: s7.m?.bg,
                            }}
                          >
                            <DS.Icon name={s7.m?.icon} size={18} />
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                  <div
                    style={{
                      width: '248px',
                      flex: 'none',
                      borderRight: '1px solid var(--rule)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      padding: '14px 10px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '30px',
                        padding: '0 8px',
                        fontSize: '13px',
                        color: 'var(--grey)',
                      }}
                    >
                      <DS.Icon name="arrow-left" size={14} />
                      All sites
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px',
                        borderRadius: '10px',
                        boxShadow: 'inset 0 0 0 1px var(--rule)',
                      }}
                    >
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '7px',
                          background: '#D6E4DA',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '11px',
                          fontWeight: '600',
                          flex: 'none',
                        }}
                      >
                        H
                      </span>
                      <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.3' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>portal.halden.co</span>
                        <span style={{ fontSize: '11.5px', color: 'var(--grey)' }}>Halden Capital</span>
                      </div>
                      <DS.Icon name="chevrons-up-down" size={14} />
                    </div>{' '}
                    {list(v.siteMenu).map((g$, $i) => {
                      const s8 = { ...v, g: g$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span
                              style={{
                                display: s8.g?.ld,
                                fontSize: '12px',
                                fontWeight: '500',
                                color: 'var(--grey)',
                                padding: '12px 10px 4px',
                              }}
                            >
                              {show(s8.g?.label)}
                            </span>
                            {list(s8.g?.items).map((m$, $i) => {
                              const s9 = { ...s8, m: m$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      height: '30px',
                                      padding: '0 10px',
                                      borderRadius: '8px',
                                      background: s9.m?.bg,
                                      fontSize: '13px',
                                      fontWeight: s9.m?.w,
                                    }}
                                  >
                                    <DS.Icon name={s9.m?.icon} size={15} />
                                    {show(s9.m?.label)}
                                    <span
                                      style={{
                                        marginLeft: 'auto',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        padding: '1px 6px',
                                        borderRadius: '999px',
                                        background: 'var(--yellow-accent)',
                                        display: s9.m?.cd,
                                      }}
                                    >
                                      {show(s9.m?.count)}
                                    </span>
                                  </div>
                                </Fragment>
                              );
                            })}
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                    <div style={{ flex: '1' }} /> <div style={{ height: '1px', background: 'var(--rule-soft)', margin: '6px 0' }} />{' '}
                    {list(v.siteFoot).map((g$, $i) => {
                      const s10 = { ...v, g: g$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {list(s10.g?.items).map((m$, $i) => {
                              const s11 = { ...s10, m: m$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      height: '30px',
                                      padding: '0 10px',
                                      borderRadius: '8px',
                                      fontSize: '13px',
                                    }}
                                  >
                                    <DS.Icon name={s11.m?.icon} size={15} />
                                    {show(s11.m?.label)}
                                  </div>
                                </Fragment>
                              );
                            })}
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                  <div style={{ flex: '1', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ height: '12px', width: '80%', borderRadius: '4px', background: 'var(--sunk-2)' }} />
                    <div style={{ height: '8px', borderRadius: '4px', background: 'var(--linen)' }} />
                    <div style={{ height: '8px', borderRadius: '4px', background: 'var(--linen)' }} />
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          <div id="2b" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {' '}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'var(--ink)',
                  color: 'var(--linen)',
                }}
              >
                2b
              </span>
              <span style={{ fontSize: '22px', fontWeight: '500' }}>
                {'基于 '}
                <a href="#1b">1b</a>
                {' · 实体页头 + 标签'}
              </span>
            </div>{' '}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 360px)', gap: '16px', fontSize: '13px', lineHeight: '1.6' }}>
              {' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>结构</span>
                <span style={{ color: 'var(--grey)' }}>
                  主栏不变，Projects
                  下面列出最近项目作为快捷入口。项目详情顶部是实体页头（名称、阶段、切换器、统计数字），下面一行是标签；设置放在标签行末尾的齿轮里。
                </span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>Marketing 站点</span>
                <span style={{ color: 'var(--grey)' }}>
                  站点有 8 个子模块，超过 4 个就要折进 More，分组也没了：Subscribers 和 Newsletters 会被拆到两处。
                </span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>代价</span>
                <span style={{ color: 'var(--grey)' }}>
                  子模块在 6 个以内、只有一层时最轻；数量一多就放不下。另外它和文档页里的页内树是两种不同的“页内导航”。
                </span>
              </div>{' '}
            </div>{' '}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {' '}
              <div
                style={{
                  flex: 'none',
                  width: '1200px',
                  height: '720px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'var(--paper)',
                  boxShadow: '0 0 0 1px var(--rule)',
                  display: 'flex',
                }}
              >
                {' '}
                <div
                  style={{
                    width: '232px',
                    flex: 'none',
                    background: 'var(--linen)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px 12px',
                    gap: '2px',
                    boxSizing: 'border-box',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px 16px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        background: 'var(--yellow)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>COSX Advisory</span>
                  </div>{' '}
                  {list(v.modules2b).map((m$, $i) => {
                    const s12 = { ...v, m: m$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            height: s12.m?.h,
                            paddingLeft: s12.m?.pad,
                            paddingRight: '10px',
                            borderRadius: '8px',
                            background: s12.m?.bg,
                            fontSize: s12.m?.fs,
                            fontWeight: s12.m?.w,
                            color: s12.m?.fg,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                          }}
                        >
                          <span style={{ display: s12.m?.iconDisplay }}>
                            <DS.Icon name={s12.m?.icon} size={16} />
                          </span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{show(s12.m?.label)}</span>
                          <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--grey)' }}>{show(s12.m?.meta)}</span>
                        </div>
                      </Fragment>
                    );
                  })}{' '}
                </div>{' '}
                <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                  {' '}
                  <div
                    style={{
                      height: '52px',
                      flex: 'none',
                      borderBottom: '1px solid var(--rule)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0 20px',
                      fontSize: '13px',
                    }}
                  >
                    <span>Projects</span>
                    <span style={{ color: 'var(--grey)' }}>/</span>
                    <span>Wang family · Global Talent</span>
                    <span style={{ color: 'var(--grey)' }}>/</span>
                    <span style={{ fontWeight: '500' }}>Review</span>
                  </div>{' '}
                  <div style={{ padding: '24px 32px 0', display: 'flex', flexDirection: 'column', gap: '16px', flex: 'none' }}>
                    {' '}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
                      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>Matter · immigration</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '24px', fontWeight: '500' }}>Wang family · Global Talent</span>
                          <DS.Icon name="chevrons-up-down" size={16} />
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              padding: '4px 7px',
                              borderRadius: '6px',
                              boxShadow: 'inset 0 0 0 1px var(--ink)',
                            }}
                          >
                            Extracting facts
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '22px', fontWeight: '500' }}>44</span>
                        <span style={{ fontSize: '12px', color: 'var(--grey)' }}>Documents</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '22px', fontWeight: '500' }}>12</span>
                        <span style={{ fontSize: '12px', color: 'var(--grey)' }}>To review</span>
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderBottom: '1px solid var(--rule)' }}>
                      {list(v.projTabs).map((s$, $i) => {
                        const s13 = { ...v, s: s$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                height: '40px',
                                padding: '0 12px',
                                fontSize: '13px',
                                fontWeight: '500',
                                color: s13.s?.fg,
                                boxShadow: s13.s?.line,
                              }}
                            >
                              {show(s13.s?.label)}
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  padding: '1px 6px',
                                  borderRadius: '999px',
                                  background: 'var(--yellow-accent)',
                                  color: 'var(--ink)',
                                  display: s13.s?.cd,
                                }}
                              >
                                {show(s13.s?.count)}
                              </span>
                            </span>
                          </Fragment>
                        );
                      })}
                      <div style={{ flex: '1' }} />
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '40px',
                          padding: '0 8px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: 'var(--grey)',
                        }}
                      >
                        <DS.Icon name="settings" size={15} />
                        Settings
                      </span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ flex: '1', padding: '12px 32px', display: 'flex', flexDirection: 'column' }}>
                    {' '}
                    {list(v.qRows).map((r$, $i) => {
                      const s14 = { ...v, r: r$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              height: '48px',
                              borderBottom: '1px solid var(--rule-soft)',
                              fontSize: '13px',
                            }}
                          >
                            <span style={{ width: '130px', flex: 'none', fontSize: '12px', color: 'var(--grey)' }}>
                              {show(s14.r?.kind)}
                            </span>
                            <span style={{ flex: '1' }}>{show(s14.r?.title)}</span>
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '4px 7px',
                                borderRadius: '6px',
                                background: s14.r?.bBg,
                                color: s14.r?.bFg,
                              }}
                            >
                              {show(s14.r?.status)}
                            </span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {' '}
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>Marketing · 站点内 · 标签放不下</span>{' '}
                <div
                  style={{
                    width: '400px',
                    height: '600px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--paper)',
                    boxShadow: '0 0 0 1px var(--rule)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 16px',
                    boxSizing: 'border-box',
                    gap: '12px',
                    position: 'relative',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>Site · Halden Capital</span>
                    <span style={{ fontSize: '20px', fontWeight: '500' }}>portal.halden.co</span>
                  </div>{' '}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--rule)' }}>
                    {list(v.siteTabs).map((s$, $i) => {
                      const s15 = { ...v, s: s$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              height: '38px',
                              padding: '0 8px',
                              fontSize: '12.5px',
                              fontWeight: '500',
                              color: s15.s?.fg,
                              boxShadow: s15.s?.line,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {show(s15.s?.label)}
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: '600',
                                padding: '1px 5px',
                                borderRadius: '999px',
                                background: 'var(--yellow-accent)',
                                color: 'var(--ink)',
                                display: s15.s?.cd,
                              }}
                            >
                              {show(s15.s?.count)}
                            </span>
                          </span>
                        </Fragment>
                      );
                    })}
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        height: '38px',
                        padding: '0 8px',
                        fontSize: '12.5px',
                        fontWeight: '500',
                        color: 'var(--ink)',
                        background: 'var(--hover)',
                        borderRadius: '8px 8px 0 0',
                      }}
                    >
                      More
                      <DS.Icon name="chevron-down" size={13} />
                    </span>
                    <div style={{ flex: '1' }} />
                    <DS.Icon name="settings" size={15} />
                  </div>{' '}
                  <div
                    style={{
                      position: 'absolute',
                      left: '236px',
                      top: '116px',
                      width: '160px',
                      background: 'var(--paper)',
                      border: '1px solid var(--rule)',
                      borderRadius: '12px',
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1px',
                    }}
                  >
                    {list(v.siteMore).map((m$, $i) => {
                      const s16 = { ...v, m: m$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              height: '30px',
                              padding: '0 8px',
                              borderRadius: '8px',
                              fontSize: '13px',
                            }}
                          >
                            <DS.Icon name={s16.m?.icon} size={14} />
                            {show(s16.m?.label)}
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>{' '}
                  {list(v.subs).map((s$, $i) => {
                    const s17 = { ...v, s: s$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '8px 0',
                            borderBottom: '1px solid var(--rule-soft)',
                            width: '200px',
                          }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>{show(s17.s?.name)}</span>
                          <span style={{ fontSize: '12px', color: 'var(--grey)' }}>{show(s17.s?.meta)}</span>
                        </div>
                      </Fragment>
                    );
                  })}{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          <div id="2c" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {' '}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'var(--ink)',
                  color: 'var(--linen)',
                }}
              >
                2c
              </span>
              <span style={{ fontSize: '22px', fontWeight: '500' }}>
                {'基于 '}
                <a href="#1b">1b</a>
                {' · 单栏下钻'}
              </span>
            </div>{' '}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 360px)', gap: '16px', fontSize: '13px', lineHeight: '1.6' }}>
              {' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>结构</span>
                <span style={{ color: 'var(--grey)' }}>
                  进入项目后，单栏的模块列表整体换成项目菜单（从右往左滑入），顶部“← Projects”回到模块层。工作区行、搜索、Agent
                  和头像的位置不变。
                </span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>Marketing 站点</span>
                <span style={{ color: 'var(--grey)' }}>和 2a 的结构完全一样，分组菜单放得下，站点设置在底部。</span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>代价</span>
                <span style={{ color: 'var(--grey)' }}>在项目里时，要去别的模块得先点返回，或者用 ⌘K、工作区菜单。好处是单栏不加宽。</span>
              </div>{' '}
            </div>{' '}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {' '}
              <div
                style={{
                  flex: 'none',
                  width: '1200px',
                  height: '720px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'var(--paper)',
                  boxShadow: '0 0 0 1px var(--rule)',
                  display: 'flex',
                }}
              >
                {' '}
                <div
                  style={{
                    width: '232px',
                    flex: 'none',
                    background: 'var(--linen)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px 12px',
                    gap: '2px',
                    boxSizing: 'border-box',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px 12px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        background: 'var(--yellow)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>COSX Advisory</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--grey)' }}>
                      <DS.Icon name="chevrons-up-down" size={14} />
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
                      background: 'var(--paper)',
                      color: 'var(--grey)',
                      fontSize: '13px',
                      marginBottom: '6px',
                    }}
                  >
                    <DS.Icon name="search" size={15} />
                    Search<span style={{ marginLeft: 'auto', fontSize: '11px' }}>⌘K</span>
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '30px',
                      padding: '0 8px',
                      fontSize: '13px',
                      color: 'var(--grey)',
                    }}
                  >
                    <DS.Icon name="arrow-left" size={14} />
                    Projects
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px',
                      marginBottom: '8px',
                      borderRadius: '10px',
                      background: 'var(--paper)',
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
                      <span
                        style={{ fontSize: '13px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        Wang family · Global Talent
                      </span>
                      <span style={{ fontSize: '11.5px', color: 'var(--grey)' }}>Matter · immigration</span>
                    </div>
                    <DS.Icon name="chevrons-up-down" size={14} />
                  </div>{' '}
                  {list(v.projMenu).map((g$, $i) => {
                    const s18 = { ...v, g: g$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {list(s18.g?.items).map((m$, $i) => {
                            const s19 = { ...s18, m: m$, $index: $i };
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
                                    background: s19.m?.bg,
                                    fontSize: '13px',
                                    fontWeight: s19.m?.w,
                                  }}
                                >
                                  <DS.Icon name={s19.m?.icon} size={15} />
                                  {show(s19.m?.label)}
                                  <span
                                    style={{
                                      marginLeft: 'auto',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      padding: '1px 6px',
                                      borderRadius: '999px',
                                      background: 'var(--yellow-accent)',
                                      display: s19.m?.cd,
                                    }}
                                  >
                                    {show(s19.m?.count)}
                                  </span>
                                </div>
                              </Fragment>
                            );
                          })}
                        </div>
                      </Fragment>
                    );
                  })}{' '}
                  <div style={{ flex: '1' }} />{' '}
                  {list(v.projFoot).map((g$, $i) => {
                    const s20 = { ...v, g: g$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {list(s20.g?.items).map((m$, $i) => {
                            const s21 = { ...s20, m: m$, $index: $i };
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
                                  <DS.Icon name={s21.m?.icon} size={15} />
                                  {show(s21.m?.label)}
                                </div>
                              </Fragment>
                            );
                          })}
                        </div>
                      </Fragment>
                    );
                  })}{' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      height: '38px',
                      padding: '0 10px',
                      marginTop: '8px',
                      borderRadius: '8px',
                      background: 'var(--ink)',
                      color: 'var(--linen)',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    <span style={{ color: 'var(--yellow-accent)', display: 'inline-flex' }}>
                      <DS.Icon name="sparkles" size={16} />
                    </span>
                    Agent
                  </div>{' '}
                </div>{' '}
                <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                  {' '}
                  <div
                    style={{
                      height: '52px',
                      flex: 'none',
                      borderBottom: '1px solid var(--rule)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0 20px',
                      fontSize: '13px',
                    }}
                  >
                    <span>Projects</span>
                    <span style={{ color: 'var(--grey)' }}>/</span>
                    <span>Wang family · Global Talent</span>
                    <span style={{ color: 'var(--grey)' }}>/</span>
                    <span style={{ fontWeight: '500' }}>Review</span>
                    <div style={{ flex: '1' }} />
                    <DS.Icon name="inbox" size={18} />
                  </div>{' '}
                  <div style={{ flex: '1', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {' '}
                    <span style={{ fontSize: '22px', fontWeight: '500', paddingBottom: '8px' }}>Review</span>{' '}
                    {list(v.qRows).map((r$, $i) => {
                      const s22 = { ...v, r: r$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              height: '48px',
                              borderBottom: '1px solid var(--rule-soft)',
                              fontSize: '13px',
                            }}
                          >
                            <span style={{ width: '130px', flex: 'none', fontSize: '12px', color: 'var(--grey)' }}>
                              {show(s22.r?.kind)}
                            </span>
                            <span style={{ flex: '1' }}>{show(s22.r?.title)}</span>
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '4px 7px',
                                borderRadius: '6px',
                                background: s22.r?.bBg,
                                color: s22.r?.bFg,
                              }}
                            >
                              {show(s22.r?.status)}
                            </span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {' '}
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>Marketing · 站点内</span>{' '}
                <div
                  style={{
                    width: '400px',
                    height: '600px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--paper)',
                    boxShadow: '0 0 0 1px var(--rule)',
                    display: 'flex',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      width: '232px',
                      flex: 'none',
                      background: 'var(--linen)',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '16px 12px',
                      gap: '2px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '30px',
                        padding: '0 8px',
                        fontSize: '13px',
                        color: 'var(--grey)',
                      }}
                    >
                      <DS.Icon name="arrow-left" size={14} />
                      Marketing
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px',
                        borderRadius: '10px',
                        background: 'var(--paper)',
                      }}
                    >
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '7px',
                          background: '#D6E4DA',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '11px',
                          fontWeight: '600',
                          flex: 'none',
                        }}
                      >
                        H
                      </span>
                      <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.3' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>portal.halden.co</span>
                        <span style={{ fontSize: '11.5px', color: 'var(--grey)' }}>Halden Capital</span>
                      </div>
                      <DS.Icon name="chevrons-up-down" size={14} />
                    </div>{' '}
                    {list(v.siteMenu).map((g$, $i) => {
                      const s23 = { ...v, g: g$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span
                              style={{
                                display: s23.g?.ld,
                                fontSize: '12px',
                                fontWeight: '500',
                                color: 'var(--grey)',
                                padding: '12px 10px 4px',
                              }}
                            >
                              {show(s23.g?.label)}
                            </span>
                            {list(s23.g?.items).map((m$, $i) => {
                              const s24 = { ...s23, m: m$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      height: '30px',
                                      padding: '0 10px',
                                      borderRadius: '8px',
                                      background: s24.m?.bg,
                                      fontSize: '13px',
                                      fontWeight: s24.m?.w,
                                    }}
                                  >
                                    <DS.Icon name={s24.m?.icon} size={15} />
                                    {show(s24.m?.label)}
                                    <span
                                      style={{
                                        marginLeft: 'auto',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        padding: '1px 6px',
                                        borderRadius: '999px',
                                        background: 'var(--yellow-accent)',
                                        display: s24.m?.cd,
                                      }}
                                    >
                                      {show(s24.m?.count)}
                                    </span>
                                  </div>
                                </Fragment>
                              );
                            })}
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                    <div style={{ flex: '1' }} />{' '}
                    {list(v.siteFoot).map((g$, $i) => {
                      const s25 = { ...v, g: g$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {list(s25.g?.items).map((m$, $i) => {
                              const s26 = { ...s25, m: m$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      height: '30px',
                                      padding: '0 10px',
                                      borderRadius: '8px',
                                      fontSize: '13px',
                                    }}
                                  >
                                    <DS.Icon name={s26.m?.icon} size={15} />
                                    {show(s26.m?.label)}
                                  </div>
                                </Fragment>
                              );
                            })}
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                  <div style={{ flex: '1', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ height: '12px', width: '80%', borderRadius: '4px', background: 'var(--sunk-2)' }} />
                    <div style={{ height: '8px', borderRadius: '4px', background: 'var(--linen)' }} />
                    <div style={{ height: '8px', borderRadius: '4px', background: 'var(--linen)' }} />
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            maxWidth: '920px',
            padding: '20px 24px',
            borderRadius: '16px',
            background: 'var(--yellow)',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(17,17,17,.7)' }}>怎么选</span>
          <span style={{ fontSize: '15px', lineHeight: '1.8' }}>
            2a 和 2c 的信息结构其实一样，都是实体菜单占据导航栏，区别只在模块图标是否一直可见。所以在这里选 1a 还是 1b，就等于选 2a 还是
            2c。2b 只适合子模块少、以后也不会增加的实体，Marketing 站点现在就已经放不下了。我的建议是：选 1a 就用 2a，选 1b 就用
            2c，项目和站点用同一套规则。
          </span>
        </div>{' '}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 360px)', gap: '16px' }}>
            {' '}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--paper)',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>最多两层菜单</span>
              <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                第一层是全局模块，第二层是实体菜单。再往下的层级（某个订阅者、第 4 条冲突）只出现在面包屑和页面里，菜单保持父项选中。
              </span>
            </div>{' '}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--paper)',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>实体切换器</span>
              <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                放在实体菜单顶部。不用回列表就能换项目或站点，列表里排最近访问的，可以搜索。切换后停在同一个子模块。
              </span>
            </div>{' '}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--paper)',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>设置归属</span>
              <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                项目设置和站点设置属于实体，放在实体菜单底部，和成员与权限放在一组。工作区设置仍然在 Admin 里。
              </span>
            </div>{' '}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--paper)',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>面包屑</span>
              <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                从模块开始：Projects / Wang family / Review / Conflict 4。每一段都能点，实体那一段带切换器。
              </span>
            </div>{' '}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--paper)',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>返回</span>
              <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                浏览器返回和“← Projects”效果一致。回到列表时，筛选、排序和滚动位置都恢复原样。
              </span>
            </div>{' '}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--paper)',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>手机 · 三个方案相同</span>
              <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                实体菜单变成页头下面的“章节”按钮，点开是底部抽屉；切换器放在标题上。
              </span>
            </div>{' '}
          </div>{' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {' '}
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>手机 · 项目内</span>{' '}
            <div
              style={{
                width: '360px',
                height: '720px',
                borderRadius: '36px',
                overflow: 'hidden',
                background: 'var(--paper)',
                boxShadow: '0 0 0 1px var(--rule), 0 0 0 8px var(--sunk-3)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {' '}
              <div style={{ height: '44px', flex: 'none' }} />{' '}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '0 6px', height: '52px', flex: 'none' }}>
                <span style={{ width: '44px', height: '44px', display: 'grid', placeItems: 'center' }}>
                  <DS.Icon name="chevron-left" size={20} />
                </span>
                <div style={{ flex: '1', minWidth: '0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.25' }}>
                    <span style={{ fontSize: '11px', color: 'var(--grey)' }}>Projects</span>
                    <span
                      style={{ fontSize: '16px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      Wang family · Global Talent
                    </span>
                  </div>
                  <DS.Icon name="chevrons-up-down" size={14} />
                </div>
              </div>{' '}
              <div style={{ padding: '4px 16px 12px', flex: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    height: '44px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    background: 'var(--linen)',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  <DS.Icon name="list-checks" size={16} />
                  Review
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      background: 'var(--yellow-accent)',
                    }}
                  >
                    12
                  </span>
                  <span style={{ marginLeft: 'auto', display: 'inline-flex' }}>
                    <DS.Icon name="chevron-down" size={16} />
                  </span>
                </div>
              </div>{' '}
              <div style={{ flex: '1', padding: '0 16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {' '}
                {list(v.qRows).map((r$, $i) => {
                  const s27 = { ...v, r: r$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          minHeight: '60px',
                          borderBottom: '1px solid var(--rule-soft)',
                        }}
                      >
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {show(s27.r?.title)}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--grey)' }}>{show(s27.r?.kind)}</span>
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '3px 6px',
                            borderRadius: '6px',
                            background: s27.r?.bBg,
                            color: s27.r?.bFg,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {show(s27.r?.status)}
                        </span>
                      </div>
                    </Fragment>
                  );
                })}{' '}
              </div>{' '}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  padding: '8px 8px 26px',
                  borderTop: '1px solid var(--rule)',
                  flex: 'none',
                }}
              >
                {list(v.tabsProj).map((t$, $i) => {
                  const s28 = { ...v, t: t$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                        <span
                          style={{
                            width: '44px',
                            height: '28px',
                            borderRadius: '999px',
                            display: 'grid',
                            placeItems: 'center',
                            background: s28.t?.bg,
                          }}
                        >
                          <DS.Icon name={s28.t?.icon} size={18} />
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '500' }}>{show(s28.t?.label)}</span>
                      </div>
                    </Fragment>
                  );
                })}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {' '}
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>手机 · 站点章节抽屉</span>{' '}
            <div
              style={{
                width: '360px',
                height: '720px',
                borderRadius: '36px',
                overflow: 'hidden',
                background: 'var(--scrim)',
                boxShadow: '0 0 0 1px var(--rule), 0 0 0 8px var(--sunk-3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              {' '}
              <div
                style={{
                  background: 'var(--paper)',
                  borderRadius: '20px 20px 0 0',
                  padding: '8px 12px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                {' '}
                <div
                  style={{
                    width: '36px',
                    height: '4px',
                    borderRadius: '999px',
                    background: 'var(--rule)',
                    alignSelf: 'center',
                    marginBottom: '10px',
                  }}
                />{' '}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>portal.halden.co</span>
                  <span style={{ fontSize: '13px', fontWeight: '500', textDecoration: 'underline' }}>Switch site</span>
                </div>{' '}
                {list(v.siteMenu).map((g$, $i) => {
                  const s29 = { ...v, g: g$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)', padding: '10px 8px 2px' }}>
                          {show(s29.g?.label)}
                        </span>
                        {list(s29.g?.items).map((m$, $i) => {
                          const s30 = { ...s29, m: m$, $index: $i };
                          return (
                            <Fragment key={$i}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  minHeight: '44px',
                                  padding: '0 10px',
                                  borderRadius: '10px',
                                  background: s30.m?.bg,
                                  fontSize: '15px',
                                  fontWeight: s30.m?.w,
                                }}
                              >
                                <DS.Icon name={s30.m?.icon} size={17} />
                                {show(s30.m?.label)}
                              </div>
                            </Fragment>
                          );
                        })}
                      </div>
                    </Fragment>
                  );
                })}{' '}
                <div style={{ height: '1px', background: 'var(--rule-soft)', margin: '8px 0' }} />{' '}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '44px', padding: '0 10px', fontSize: '15px' }}>
                  <DS.Icon name="settings" size={17} />
                  Site settings
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>
      </section>
      <section
        lang="zh-CN"
        style={{
          width: 'max-content',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          padding: '72px',
          fontFamily: 'var(--font-sans-cjk)',
          color: 'var(--ink)',
        }}
      >
        {' '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '880px' }}>
          {' '}
          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>第 1 轮 · 布局与导航 · 需求 3.4</span>{' '}
          <h1 style={{ margin: '0', fontSize: '40px', fontWeight: '500', lineHeight: '1.25' }}>
            三种主/次导航拆法，<span className="marker">同一个 Ops 文档场景</span>对比
          </h1>{' '}
          <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.8', color: 'var(--grey)' }}>
            {
              '每个方案给出展开、收起、手机三态。场景：Ops 成员在 6 层深的文件夹里。客户门户共用同一骨架，只有 5 个入口，没有文件夹树。已确定 '
            }
            <a href="#1a">1a</a>
            {' + '}
            <a href="#2a">2a</a>，规范见组件页第 13 节。
          </p>{' '}
        </div>{' '}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'flex-start' }}>
          {' '}
          <div id="1a" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {' '}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'var(--ink)',
                  color: 'var(--linen)',
                }}
              >
                1a
              </span>
              <span style={{ fontSize: '22px', fontWeight: '500' }}>图标栏 + 上下文栏</span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'var(--ink)',
                  color: 'var(--yellow-accent)',
                }}
              >
                已确定
              </span>
            </div>{' '}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 360px)', gap: '16px', fontSize: '13px', lineHeight: '1.6' }}>
              {' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>结构</span>
                <span style={{ color: 'var(--grey)' }}>
                  文档页与客户门户共用：第二栏是视图 + 文件夹树，内容区是卡片或列表。64px 图标栏放模块；248px
                  上下文栏放当前模块的视图、树和项目子页。工作区管理也是一个模块，不再替换整条栏。
                </span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>收起</span>
                <span style={{ color: 'var(--grey)' }}>上下文栏隐藏；悬停模块图标时以浮层弹出，树仍可达、可作为拖放目标。</span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>代价</span>
                <span style={{ color: 'var(--grey)' }}>两列恒占 312px；客户门户只有 5 个入口，第二列多数时候是空的。</span>
              </div>{' '}
            </div>{' '}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {' '}
              <div
                style={{
                  flex: 'none',
                  width: '1200px',
                  height: '720px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'var(--paper)',
                  boxShadow: '0 0 0 1px var(--rule)',
                  display: 'flex',
                }}
              >
                {' '}
                <div
                  style={{
                    width: '64px',
                    flex: 'none',
                    background: 'var(--linen)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '16px 0',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--yellow)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '14px',
                    }}
                  >
                    <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
                  </div>{' '}
                  {list(v.modulesA).map((m$, $i) => {
                    const s31 = { ...v, m: m$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        {' '}
                        <div
                          title={s31.m?.label}
                          style={{
                            width: '44px',
                            height: '40px',
                            borderRadius: '8px',
                            display: 'grid',
                            placeItems: 'center',
                            background: s31.m?.bg,
                          }}
                        >
                          <DS.Icon name={s31.m?.icon} size={18} />
                        </div>{' '}
                      </Fragment>
                    );
                  })}{' '}
                  <div style={{ flex: '1' }} />{' '}
                  <div
                    style={{
                      width: '44px',
                      height: '40px',
                      borderRadius: '8px',
                      display: 'grid',
                      placeItems: 'center',
                      background: 'var(--ink)',
                      color: 'var(--yellow-accent)',
                    }}
                  >
                    <DS.Icon name="sparkles" size={18} />
                  </div>{' '}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '999px',
                      background: 'var(--sunk-3)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '11px',
                      fontWeight: '600',
                      marginTop: '8px',
                    }}
                  >
                    WL
                  </div>{' '}
                </div>{' '}
                <div
                  style={{
                    width: '248px',
                    flex: 'none',
                    borderRight: '1px solid var(--rule)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px 10px',
                    gap: '2px',
                    boxSizing: 'border-box',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 12px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '500' }}>Documents</span>
                    <DS.Icon name="panel-left-close" size={16} />
                  </div>{' '}
                  {list(v.viewsDocs).map((v$, $i) => {
                    const s32 = { ...v, v: v$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            height: '32px',
                            padding: '0 8px',
                            borderRadius: '8px',
                            fontSize: '13px',
                          }}
                        >
                          <DS.Icon name={s32.v?.icon} size={15} />
                          {show(s32.v?.label)}
                          <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--grey)' }}>{show(s32.v?.meta)}</span>
                        </div>
                      </Fragment>
                    );
                  })}{' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)', padding: '16px 8px 6px' }}>Folders</div>{' '}
                  {list(v.tree).map((n$, $i) => {
                    const s33 = { ...v, n: n$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            height: '30px',
                            paddingLeft: s33.n?.indent,
                            paddingRight: '8px',
                            borderRadius: '8px',
                            background: s33.n?.bg,
                            fontSize: '13px',
                            fontWeight: s33.n?.w,
                          }}
                        >
                          <span
                            style={{ width: '16px', display: 'grid', placeItems: 'center', opacity: s33.n?.chev, transform: s33.n?.rot }}
                          >
                            <DS.Icon name="chevron-right" size={12} />
                          </span>
                          <DS.Icon name={s33.n?.icon} size={14} />
                          <span style={{ paddingLeft: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {show(s33.n?.label)}
                          </span>
                        </div>
                      </Fragment>
                    );
                  })}{' '}
                </div>{' '}
                <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                  {' '}
                  <div
                    style={{
                      height: '52px',
                      flex: 'none',
                      borderBottom: '1px solid var(--rule)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0 20px',
                      fontSize: '13px',
                    }}
                  >
                    <span style={{ fontWeight: '500' }}>COSX Advisory</span>
                    <span style={{ color: 'var(--grey)' }}>/</span>
                    <span style={{ padding: '1px 6px', borderRadius: '5px', background: 'var(--hover)' }}>…</span>
                    <span style={{ color: 'var(--grey)' }}>/</span>
                    <span>Legal</span>
                    <span style={{ color: 'var(--grey)' }}>/</span>
                    <span style={{ fontWeight: '500' }}>Shareholder agreements</span>
                    <div style={{ flex: '1' }} />
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        height: '32px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        background: 'var(--linen)',
                        color: 'var(--grey)',
                        width: '200px',
                      }}
                    >
                      <DS.Icon name="search" size={14} />
                      Search<span style={{ marginLeft: 'auto', fontSize: '11px' }}>⌘K</span>
                    </span>
                    <DS.Icon name="inbox" size={18} />
                  </div>{' '}
                  <div
                    style={{
                      flex: '1',
                      minWidth: '0',
                      padding: '24px 28px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '22px', fontWeight: '500', flex: '1' }}>Shareholder agreements</span>
                      <span style={{ fontSize: '12px', color: 'var(--grey)' }}>12 documents</span>
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '260px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '34px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          background: 'var(--linen)',
                          color: 'var(--grey)',
                          fontSize: '13px',
                        }}
                      >
                        <DS.Icon name="search" size={14} />
                        Search this folder
                      </div>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '34px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        Last updated
                        <DS.Icon name="chevron-down" size={13} />
                      </span>
                      <div style={{ flex: '1' }} />
                      <div style={{ display: 'inline-flex', gap: '2px', padding: '3px', borderRadius: '10px', background: 'var(--linen)' }}>
                        <span
                          style={{
                            width: '30px',
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '8px',
                            background: 'var(--yellow)',
                          }}
                        >
                          <DS.Icon name="layout-grid" size={14} />
                        </span>
                        <span style={{ width: '30px', height: '28px', display: 'grid', placeItems: 'center', borderRadius: '8px' }}>
                          <DS.Icon name="list" size={14} />
                        </span>
                      </div>
                    </div>{' '}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px' }}>
                      {' '}
                      {list(v.navCards).map((c$, $i) => {
                        const s34 = { ...v, c: c$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '16px',
                                border: '1px solid var(--rule)',
                                background: 'var(--paper)',
                                overflow: 'hidden',
                              }}
                            >
                              {' '}
                              <div
                                style={{
                                  height: '104px',
                                  background: 'var(--linen)',
                                  display: 'flex',
                                  alignItems: 'flex-end',
                                  justifyContent: 'center',
                                  position: 'relative',
                                }}
                              >
                                {' '}
                                <div
                                  style={{
                                    width: '56%',
                                    height: '86px',
                                    background: 'var(--paper)',
                                    borderRadius: '4px 4px 0 0',
                                    boxShadow: '0 0 0 1px var(--rule-soft)',
                                    display: s34.c?.pageDisplay,
                                    flexDirection: 'column',
                                    gap: '5px',
                                    padding: '10px',
                                    boxSizing: 'border-box',
                                  }}
                                >
                                  <div style={{ height: '4px', width: '60%', background: 'var(--sunk-3)', borderRadius: '2px' }} />
                                  <div style={{ height: '3px', background: 'var(--sunk-2)', borderRadius: '2px' }} />
                                  <div style={{ height: '3px', background: 'var(--sunk-2)', borderRadius: '2px' }} />
                                  <div style={{ height: '3px', width: '70%', background: 'var(--sunk-2)', borderRadius: '2px' }} />
                                </div>{' '}
                                <div style={{ position: 'absolute', inset: '0', display: s34.c?.iconDisplay, placeItems: 'center' }}>
                                  <DS.Icon name={s34.c?.icon} size={22} />
                                </div>{' '}
                                <span
                                  style={{
                                    position: 'absolute',
                                    right: '8px',
                                    top: '8px',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '999px',
                                    background: 'var(--yellow-accent)',
                                    display: s34.c?.starDisplay,
                                    placeItems: 'center',
                                  }}
                                >
                                  <DS.Icon name="star" size={13} />
                                </span>{' '}
                              </div>{' '}
                              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <span
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {show(s34.c?.title)}
                                </span>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '12px',
                                    color: 'var(--grey)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: '600',
                                      padding: '2px 5px',
                                      borderRadius: '4px',
                                      background: 'var(--linen)',
                                      color: 'var(--ink)',
                                    }}
                                  >
                                    {show(s34.c?.fmt)}
                                  </span>
                                  <span
                                    style={{
                                      width: '7px',
                                      height: '7px',
                                      borderRadius: '999px',
                                      background: s34.c?.dot,
                                      boxShadow: s34.c?.ring,
                                      flex: 'none',
                                    }}
                                  />
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{show(s34.c?.meta)}</span>
                                </div>
                              </div>{' '}
                            </div>
                          </Fragment>
                        );
                      })}{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {' '}
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>收起 · 悬停弹出上下文栏</span>{' '}
                <div
                  style={{
                    width: '400px',
                    height: '600px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--paper)',
                    boxShadow: '0 0 0 1px var(--rule)',
                    display: 'flex',
                    position: 'relative',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      width: '64px',
                      flex: 'none',
                      background: 'var(--linen)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '16px 0',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--yellow)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '14px',
                      }}
                    >
                      <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
                    </div>{' '}
                    {list(v.modulesA).map((m$, $i) => {
                      const s35 = { ...v, m: m$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              width: '44px',
                              height: '40px',
                              borderRadius: '8px',
                              display: 'grid',
                              placeItems: 'center',
                              background: s35.m?.bg,
                            }}
                          >
                            <DS.Icon name={s35.m?.icon} size={18} />
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                  <div
                    style={{
                      position: 'absolute',
                      left: '70px',
                      top: '60px',
                      width: '248px',
                      padding: '10px',
                      borderRadius: '16px',
                      background: 'var(--paper)',
                      boxShadow: '0 0 0 1px var(--rule)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)', padding: '4px 8px 6px' }}>
                      Folders · pinned while hovering
                    </span>{' '}
                    {list(v.tree).map((n$, $i) => {
                      const s36 = { ...v, n: n$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              height: '30px',
                              paddingLeft: s36.n?.indent,
                              borderRadius: '8px',
                              background: s36.n?.bg,
                              fontSize: '13px',
                            }}
                          >
                            <span
                              style={{ width: '16px', display: 'grid', placeItems: 'center', opacity: s36.n?.chev, transform: s36.n?.rot }}
                            >
                              <DS.Icon name="chevron-right" size={12} />
                            </span>
                            <DS.Icon name={s36.n?.icon} size={14} />
                            <span style={{ paddingLeft: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {show(s36.n?.label)}
                            </span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {' '}
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>手机 · 上下文栏变为一页</span>{' '}
                <div
                  style={{
                    width: '360px',
                    height: '720px',
                    borderRadius: '36px',
                    overflow: 'hidden',
                    background: 'var(--paper)',
                    boxShadow: '0 0 0 1px var(--rule), 0 0 0 8px var(--sunk-3)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {' '}
                  <div style={{ height: '44px' }} />{' '}
                  <div style={{ padding: '8px 20px 12px', fontSize: '22px', fontWeight: '500' }}>Documents</div>{' '}
                  <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column' }}>
                    {' '}
                    {list(v.viewsDocs).map((v$, $i) => {
                      const s37 = { ...v, v: v$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              minHeight: '48px',
                              padding: '0 8px',
                              fontSize: '15px',
                              borderBottom: '1px solid var(--rule-soft)',
                            }}
                          >
                            <DS.Icon name={s37.v?.icon} size={17} />
                            {show(s37.v?.label)}
                            <span style={{ marginLeft: 'auto' }}>
                              <DS.Icon name="chevron-right" size={15} />
                            </span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                    <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)', padding: '16px 8px 6px' }}>Folders</div>{' '}
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '48px', padding: '0 8px', fontSize: '15px' }}
                    >
                      <DS.Icon name="folder" size={17} />
                      Harbour data room
                      <span style={{ marginLeft: 'auto' }}>
                        <DS.Icon name="chevron-right" size={15} />
                      </span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ flex: '1' }} />{' '}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      padding: '8px 8px 26px',
                      borderTop: '1px solid var(--rule)',
                    }}
                  >
                    {' '}
                    {list(v.opsTabs).map((t$, $i) => {
                      const s38 = { ...v, t: t$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                            <span
                              style={{
                                width: '44px',
                                height: '28px',
                                borderRadius: '999px',
                                display: 'grid',
                                placeItems: 'center',
                                background: s38.t?.bg,
                              }}
                            >
                              <DS.Icon name={s38.t?.icon} size={18} />
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: '500' }}>{show(s38.t?.label)}</span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          <div id="1b" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {' '}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'var(--ink)',
                  color: 'var(--linen)',
                }}
              >
                1b
              </span>
              <span style={{ fontSize: '22px', fontWeight: '500' }}>单栏，树搬进文档页</span>
            </div>{' '}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 360px)', gap: '16px', fontSize: '13px', lineHeight: '1.6' }}>
              {' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>结构</span>
                <span style={{ color: 'var(--grey)' }}>
                  232px 单栏：模块固定在上，当前模块的视图就地缩进展开（3–8
                  项，不会把模块挤出视口）。深层文件夹树只在文档页内，作为可调宽的左窗格。项目子页用页内标签。
                </span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>收起</span>
                <span style={{ color: 'var(--grey)' }}>
                  栏收为 56px 图标；树是页面内容，不受影响，照常作为拖放目标。偏好记住，窄屏默认收起。
                </span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>管理页</span>
                <span style={{ color: 'var(--grey)' }}>
                  工作区管理与个人偏好是独立页面，有自己的左侧子导航和“返回工作区”，主栏不再变形。
                </span>
              </div>{' '}
            </div>{' '}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {' '}
              <div
                style={{
                  flex: 'none',
                  width: '1200px',
                  height: '720px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'var(--paper)',
                  boxShadow: '0 0 0 1px var(--rule)',
                  display: 'flex',
                }}
              >
                {' '}
                <div
                  style={{
                    width: '232px',
                    flex: 'none',
                    background: 'var(--linen)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px 12px',
                    gap: '2px',
                    boxSizing: 'border-box',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px 16px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        background: 'var(--yellow)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>COSX Advisory</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--grey)' }}>
                      <DS.Icon name="chevrons-up-down" size={14} />
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
                      background: 'var(--paper)',
                      color: 'var(--grey)',
                      fontSize: '13px',
                      marginBottom: '10px',
                    }}
                  >
                    <DS.Icon name="search" size={15} />
                    Search<span style={{ marginLeft: 'auto', fontSize: '11px' }}>⌘K</span>
                  </div>{' '}
                  {list(v.modulesB).map((m$, $i) => {
                    const s39 = { ...v, m: m$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        {' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            height: s39.m?.h,
                            paddingLeft: s39.m?.pad,
                            paddingRight: '10px',
                            borderRadius: '8px',
                            background: s39.m?.bg,
                            fontSize: s39.m?.fs,
                            fontWeight: s39.m?.w,
                            color: s39.m?.fg,
                          }}
                        >
                          <span style={{ display: s39.m?.iconDisplay }}>
                            <DS.Icon name={s39.m?.icon} size={16} />
                          </span>
                          {show(s39.m?.label)}
                          <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--grey)' }}>{show(s39.m?.meta)}</span>
                        </div>{' '}
                      </Fragment>
                    );
                  })}{' '}
                  <div style={{ flex: '1' }} />{' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      height: '38px',
                      padding: '0 10px',
                      borderRadius: '8px',
                      background: 'var(--ink)',
                      color: 'var(--linen)',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    <span style={{ color: 'var(--yellow-accent)', display: 'inline-flex' }}>
                      <DS.Icon name="sparkles" size={16} />
                    </span>
                    Agent<span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--grey-inverse)' }}>I</span>
                  </div>{' '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 8px 0' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '999px',
                        background: 'var(--sunk-3)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      WL
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>Wei Li</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--grey)' }}>
                      <DS.Icon name="panel-left-close" size={16} />
                    </span>
                  </div>{' '}
                </div>{' '}
                <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                  {' '}
                  <div
                    style={{
                      height: '52px',
                      flex: 'none',
                      borderBottom: '1px solid var(--rule)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0 20px',
                      fontSize: '13px',
                    }}
                  >
                    <span style={{ fontWeight: '500' }}>COSX Advisory</span>
                    <span style={{ color: 'var(--grey)' }}>/</span>
                    <span>Documents</span>
                    <span style={{ color: 'var(--grey)' }}>/</span>
                    <span style={{ padding: '1px 6px', borderRadius: '5px', background: 'var(--hover)' }}>…</span>
                    <span style={{ color: 'var(--grey)' }}>/</span>
                    <span style={{ fontWeight: '500' }}>Shareholder agreements</span>
                    <div style={{ flex: '1' }} />
                    <span style={{ position: 'relative', display: 'inline-flex' }}>
                      <DS.Icon name="inbox" size={18} />
                      <span
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-9px',
                          fontSize: '10px',
                          fontWeight: '600',
                          padding: '1px 5px',
                          borderRadius: '999px',
                          background: 'var(--yellow-accent)',
                        }}
                      >
                        4
                      </span>
                    </span>
                  </div>{' '}
                  <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
                    {' '}
                    <div
                      style={{
                        width: '260px',
                        flex: 'none',
                        borderRight: '1px solid var(--rule)',
                        padding: '16px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        boxSizing: 'border-box',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>Folders</span>
                        <DS.Icon name="panel-left-close" size={14} />
                      </div>{' '}
                      {list(v.tree).map((n$, $i) => {
                        const s40 = { ...v, n: n$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                height: '30px',
                                paddingLeft: s40.n?.indent,
                                paddingRight: '8px',
                                borderRadius: '8px',
                                background: s40.n?.bg,
                                fontSize: '13px',
                                fontWeight: s40.n?.w,
                              }}
                            >
                              <span
                                style={{
                                  width: '16px',
                                  display: 'grid',
                                  placeItems: 'center',
                                  opacity: s40.n?.chev,
                                  transform: s40.n?.rot,
                                }}
                              >
                                <DS.Icon name="chevron-right" size={12} />
                              </span>
                              <DS.Icon name={s40.n?.icon} size={14} />
                              <span style={{ paddingLeft: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {show(s40.n?.label)}
                              </span>
                            </div>
                          </Fragment>
                        );
                      })}{' '}
                    </div>{' '}
                    <div style={{ flex: '1', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0' }}>
                      {' '}
                      <span style={{ fontSize: '22px', fontWeight: '500' }}>Shareholder agreements</span>{' '}
                      {list(v.rows).map((r$, $i) => {
                        const s41 = { ...v, r: r$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                height: '44px',
                                borderBottom: '1px solid var(--rule-soft)',
                                fontSize: '13px',
                              }}
                            >
                              <DS.Icon name={s41.r?.icon} size={16} />
                              <span style={{ flex: '1' }}>{show(s41.r?.name)}</span>
                              <span style={{ fontSize: '12px', color: 'var(--grey)' }}>{show(s41.r?.meta)}</span>
                            </div>
                          </Fragment>
                        );
                      })}{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {' '}
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>收起 · 树仍在页内</span>{' '}
                <div
                  style={{
                    width: '400px',
                    height: '600px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--paper)',
                    boxShadow: '0 0 0 1px var(--rule)',
                    display: 'flex',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      width: '56px',
                      flex: 'none',
                      background: 'var(--linen)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '16px 0',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        background: 'var(--yellow)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '14px',
                      }}
                    >
                      <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
                    </div>{' '}
                    {list(v.modulesA).map((m$, $i) => {
                      const s42 = { ...v, m: m$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              width: '40px',
                              height: '38px',
                              borderRadius: '8px',
                              display: 'grid',
                              placeItems: 'center',
                              background: s42.m?.bg,
                            }}
                          >
                            <DS.Icon name={s42.m?.icon} size={17} />
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                  <div
                    style={{
                      width: '220px',
                      flex: 'none',
                      borderRight: '1px solid var(--rule)',
                      padding: '16px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)', padding: '0 8px 8px' }}>Folders</span>{' '}
                    {list(v.tree).map((n$, $i) => {
                      const s43 = { ...v, n: n$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              height: '30px',
                              paddingLeft: s43.n?.indent,
                              borderRadius: '8px',
                              background: s43.n?.bg,
                              fontSize: '13px',
                            }}
                          >
                            <span
                              style={{ width: '16px', display: 'grid', placeItems: 'center', opacity: s43.n?.chev, transform: s43.n?.rot }}
                            >
                              <DS.Icon name="chevron-right" size={12} />
                            </span>
                            <DS.Icon name={s43.n?.icon} size={14} />
                            <span style={{ paddingLeft: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {show(s43.n?.label)}
                            </span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                  <div style={{ flex: '1', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ height: '12px', width: '80%', borderRadius: '4px', background: 'var(--sunk-2)' }} />
                    <div style={{ height: '8px', borderRadius: '4px', background: 'var(--linen)' }} />
                    <div style={{ height: '8px', borderRadius: '4px', background: 'var(--linen)' }} />
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {' '}
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>手机 · 逐级进入 + 路径条</span>{' '}
                <div
                  style={{
                    width: '360px',
                    height: '720px',
                    borderRadius: '36px',
                    overflow: 'hidden',
                    background: 'var(--paper)',
                    boxShadow: '0 0 0 1px var(--rule), 0 0 0 8px var(--sunk-3)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {' '}
                  <div style={{ height: '44px' }} />{' '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px', height: '48px' }}>
                    <span style={{ width: '44px', height: '44px', display: 'grid', placeItems: 'center' }}>
                      <DS.Icon name="chevron-left" size={20} />
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.25' }}>
                      <span style={{ fontSize: '16px', fontWeight: '500' }}>Shareholder agreements</span>
                    </div>
                  </div>{' '}
                  <div style={{ display: 'flex', gap: '6px', padding: '0 16px 12px', overflow: 'hidden' }}>
                    <span
                      style={{
                        flex: 'none',
                        height: '30px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        background: 'var(--linen)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12px',
                      }}
                    >
                      Documents
                    </span>
                    <span
                      style={{
                        flex: 'none',
                        height: '30px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        background: 'var(--linen)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12px',
                      }}
                    >
                      …
                    </span>
                    <span
                      style={{
                        flex: 'none',
                        height: '30px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        background: 'var(--linen)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12px',
                      }}
                    >
                      Legal
                    </span>
                    <span
                      style={{
                        flex: 'none',
                        height: '30px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        background: 'var(--yellow)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      Shareholder agreements
                    </span>
                  </div>{' '}
                  <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column' }}>
                    {' '}
                    {list(v.rows).map((r$, $i) => {
                      const s44 = { ...v, r: r$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              minHeight: '56px',
                              borderBottom: '1px solid var(--rule-soft)',
                              fontSize: '15px',
                            }}
                          >
                            <DS.Icon name={s44.r?.icon} size={17} />
                            <span style={{ flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {show(s44.r?.name)}
                            </span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                  <div style={{ flex: '1' }} />{' '}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      padding: '8px 8px 26px',
                      borderTop: '1px solid var(--rule)',
                    }}
                  >
                    {' '}
                    {list(v.opsTabs).map((t$, $i) => {
                      const s45 = { ...v, t: t$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                            <span
                              style={{
                                width: '44px',
                                height: '28px',
                                borderRadius: '999px',
                                display: 'grid',
                                placeItems: 'center',
                                background: s45.t?.bg,
                              }}
                            >
                              <DS.Icon name={s45.t?.icon} size={18} />
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: '500' }}>{show(s45.t?.label)}</span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          <div id="1c" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {' '}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'var(--ink)',
                  color: 'var(--linen)',
                }}
              >
                1c
              </span>
              <span style={{ fontSize: '22px', fontWeight: '500' }}>模块在顶栏，左栏只放视图与树</span>
            </div>{' '}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 360px)', gap: '16px', fontSize: '13px', lineHeight: '1.6' }}>
              {' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>结构</span>
                <span style={{ color: 'var(--grey)' }}>
                  顶栏放品牌、模块标签、搜索、收件箱、头像；左栏只属于当前模块。模块切换时左栏整体更换，但位置固定、不会被挤出。
                </span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>收起</span>
                <span style={{ color: 'var(--grey)' }}>左栏完全隐藏；面包屑左侧出现“Folders”按钮，点开为弹出树。</span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>代价</span>
                <span style={{ color: 'var(--grey)' }}>
                  7 个模块 + 搜索挤在顶栏，窄屏要折叠进“更多”；与 Agent 右侧抽屉并存时横向空间最紧。
                </span>
              </div>{' '}
            </div>{' '}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {' '}
              <div
                style={{
                  flex: 'none',
                  width: '1200px',
                  height: '720px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'var(--paper)',
                  boxShadow: '0 0 0 1px var(--rule)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {' '}
                <div
                  style={{
                    height: '56px',
                    flex: 'none',
                    borderBottom: '1px solid var(--rule)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0 16px',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '7px',
                      background: 'var(--yellow)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginRight: '16px',
                    }}
                  >
                    <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
                  </div>{' '}
                  {list(v.modulesC).map((m$, $i) => {
                    const s46 = { ...v, m: m$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <span
                          style={{
                            height: '34px',
                            padding: '0 12px',
                            borderRadius: '8px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '13px',
                            fontWeight: '500',
                            background: s46.m?.bg,
                          }}
                        >
                          {show(s46.m?.label)}
                        </span>
                      </Fragment>
                    );
                  })}{' '}
                  <div style={{ flex: '1' }} />{' '}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      height: '32px',
                      padding: '0 12px',
                      borderRadius: '8px',
                      background: 'var(--linen)',
                      color: 'var(--grey)',
                      fontSize: '13px',
                      width: '180px',
                    }}
                  >
                    <DS.Icon name="search" size={14} />
                    Search<span style={{ marginLeft: 'auto', fontSize: '11px' }}>⌘K</span>
                  </span>{' '}
                  <span style={{ width: '36px', height: '36px', display: 'grid', placeItems: 'center' }}>
                    <DS.Icon name="inbox" size={18} />
                  </span>{' '}
                  <span
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '8px',
                      background: 'var(--ink)',
                      color: 'var(--yellow-accent)',
                    }}
                  >
                    <DS.Icon name="sparkles" size={16} />
                  </span>{' '}
                  <span
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '999px',
                      background: 'var(--sunk-3)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '10px',
                      fontWeight: '600',
                      marginLeft: '6px',
                    }}
                  >
                    WL
                  </span>{' '}
                </div>{' '}
                <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
                  {' '}
                  <div
                    style={{
                      width: '256px',
                      flex: 'none',
                      background: 'var(--linen)',
                      padding: '16px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {' '}
                    {list(v.viewsDocs).map((v$, $i) => {
                      const s47 = { ...v, v: v$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              height: '32px',
                              padding: '0 8px',
                              borderRadius: '8px',
                              fontSize: '13px',
                            }}
                          >
                            <DS.Icon name={s47.v?.icon} size={15} />
                            {show(s47.v?.label)}
                            <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--grey)' }}>{show(s47.v?.meta)}</span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                    <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)', padding: '16px 8px 6px' }}>Folders</div>{' '}
                    {list(v.tree).map((n$, $i) => {
                      const s48 = { ...v, n: n$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              height: '30px',
                              paddingLeft: s48.n?.indent,
                              paddingRight: '8px',
                              borderRadius: '8px',
                              background: s48.n?.bg,
                              fontSize: '13px',
                              fontWeight: s48.n?.w,
                            }}
                          >
                            <span
                              style={{ width: '16px', display: 'grid', placeItems: 'center', opacity: s48.n?.chev, transform: s48.n?.rot }}
                            >
                              <DS.Icon name="chevron-right" size={12} />
                            </span>
                            <DS.Icon name={s48.n?.icon} size={14} />
                            <span style={{ paddingLeft: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {show(s48.n?.label)}
                            </span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                  <div style={{ flex: '1', padding: '20px 32px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0' }}>
                    {' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <span>Documents</span>
                      <span style={{ color: 'var(--grey)' }}>/</span>
                      <span style={{ padding: '1px 6px', borderRadius: '5px', background: 'var(--hover)' }}>…</span>
                      <span style={{ color: 'var(--grey)' }}>/</span>
                      <span style={{ fontWeight: '500' }}>Shareholder agreements</span>
                    </div>{' '}
                    <span style={{ fontSize: '22px', fontWeight: '500' }}>Shareholder agreements</span>{' '}
                    {list(v.rows).map((r$, $i) => {
                      const s49 = { ...v, r: r$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              height: '44px',
                              borderBottom: '1px solid var(--rule-soft)',
                              fontSize: '13px',
                            }}
                          >
                            <DS.Icon name={s49.r?.icon} size={16} />
                            <span style={{ flex: '1' }}>{show(s49.r?.name)}</span>
                            <span style={{ fontSize: '12px', color: 'var(--grey)' }}>{show(s49.r?.meta)}</span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {' '}
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>收起 · 面包屑旁弹出树</span>{' '}
                <div
                  style={{
                    width: '400px',
                    height: '600px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--paper)',
                    boxShadow: '0 0 0 1px var(--rule)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      height: '56px',
                      borderBottom: '1px solid var(--rule)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0 16px',
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        background: 'var(--yellow)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
                    </div>
                    <span
                      style={{
                        height: '34px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '13px',
                        fontWeight: '500',
                        background: 'var(--yellow)',
                      }}
                    >
                      Documents
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--grey)' }}>More</span>
                  </div>{' '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 16px', fontSize: '13px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '30px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        boxShadow: 'inset 0 0 0 1px var(--ink)',
                        fontWeight: '500',
                      }}
                    >
                      <DS.Icon name="folder-tree" size={14} />
                      Folders
                    </span>
                    <span>… / Shareholder agreements</span>
                  </div>{' '}
                  <div
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '104px',
                      width: '260px',
                      padding: '8px',
                      borderRadius: '16px',
                      background: 'var(--paper)',
                      boxShadow: '0 0 0 1px var(--rule)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    {' '}
                    {list(v.tree).map((n$, $i) => {
                      const s50 = { ...v, n: n$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              height: '30px',
                              paddingLeft: s50.n?.indent,
                              borderRadius: '8px',
                              background: s50.n?.bg,
                              fontSize: '13px',
                            }}
                          >
                            <span
                              style={{ width: '16px', display: 'grid', placeItems: 'center', opacity: s50.n?.chev, transform: s50.n?.rot }}
                            >
                              <DS.Icon name="chevron-right" size={12} />
                            </span>
                            <DS.Icon name={s50.n?.icon} size={14} />
                            <span style={{ paddingLeft: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {show(s50.n?.label)}
                            </span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {' '}
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>手机 · 顶部模块切换 + 树抽屉</span>{' '}
                <div
                  style={{
                    width: '360px',
                    height: '720px',
                    borderRadius: '36px',
                    overflow: 'hidden',
                    background: 'var(--scrim)',
                    boxShadow: '0 0 0 1px var(--rule), 0 0 0 8px var(--sunk-3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      background: 'var(--paper)',
                      borderRadius: '20px 20px 0 0',
                      padding: '8px 12px 30px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      height: '520px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        width: '36px',
                        height: '4px',
                        borderRadius: '999px',
                        background: 'var(--rule)',
                        alignSelf: 'center',
                        marginBottom: '12px',
                      }}
                    />{' '}
                    <span style={{ fontSize: '16px', fontWeight: '500', padding: '0 8px 10px' }}>Folders</span>{' '}
                    {list(v.tree).map((n$, $i) => {
                      const s51 = { ...v, n: n$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              minHeight: '44px',
                              paddingLeft: s51.n?.indent,
                              borderRadius: '10px',
                              background: s51.n?.bg,
                              fontSize: '15px',
                            }}
                          >
                            <span
                              style={{ width: '20px', display: 'grid', placeItems: 'center', opacity: s51.n?.chev, transform: s51.n?.rot }}
                            >
                              <DS.Icon name="chevron-right" size={14} />
                            </span>
                            <DS.Icon name={s51.n?.icon} size={16} />
                            <span style={{ paddingLeft: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {show(s51.n?.label)}
                            </span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 320px)', gap: '16px', paddingTop: '16px' }}>
          {' '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '20px',
              borderRadius: '16px',
              background: 'var(--paper)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>三种可见性</span>
            <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
              可用 → 显示；不可用 → 隐藏（客户永远看不到灰色占位）；可用但未开启 → 仅管理员可见，带“Turn it on”。
            </span>
          </div>{' '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '20px',
              borderRadius: '16px',
              background: 'var(--paper)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>分享的位置</span>
            <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
              1b 中作为文档模块下的固定视图 “Shared with me / Shared by me”，不再嵌在树里。
            </span>
          </div>{' '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '20px',
              borderRadius: '16px',
              background: 'var(--paper)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>右侧槽位</span>
            <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
              三个方案相同：Agent 抽屉与侧面板共用；≥1280px 推开内容，更窄时覆盖，手机全屏。
            </span>
          </div>{' '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '20px',
              borderRadius: '16px',
              background: 'var(--paper)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--grey)' }}>公开页外壳</span>
            <span style={{ fontSize: '13px', lineHeight: '1.6' }}>分享链接、邀请接受、外部签署：只有工作区品牌的极简页头，无左栏。</span>
          </div>{' '}
        </div>
      </section>
    </>
  );
}
