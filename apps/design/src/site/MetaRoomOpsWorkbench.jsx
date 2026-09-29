// MetaRoomOpsWorkbench — converted once from the Claude Design export (pages/MetaRoom Ops Workbench.dc.html); edit freely.
import * as React from 'react';
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';
import OpsRail from './OpsRail';

/* eslint-disable */
class Logic extends DCLogic {
  dict() {
    return {
      en: {
        docEyebrow: 'Ops Workbench · key pages · navigation 1a + 2a · COSX Advisory workspace',
        docTitle: 'One person serving many customers',
        docLede:
          'A cross-customer inbox where customer tasks and conversations arrive, and the project review queue with its split dialog. Same component library as the Customer Portal.',
        search: 'Search',
        inbox: 'Inbox',
        list: 'List',
        board: 'Board',
        mineOnly: 'Assigned to me',
        projects: 'Projects',
        s1Title: 'Inbox · tasks and conversations from every customer',
        s1Note:
          'Filter or switch by customer. Everything a customer hands over, in conversation or by form, lands here as a task. Replies go back to the customer\u2019s conversation; internal notes never do.',
        fromConv: 'from conversation',
        t128: 'Chase NDA signatures · 4 investors',
        custMsg: 'Chase the investors who haven\u2019t signed the NDA yet.',
        agentPrep: 'prepared a reminder for each, not sent',
        sendReminders: 'Send 4 reminders',
        editDraft: 'Edit draft',
        internal: 'Internal',
        internalNote: 'Maria was only invited on Monday. Suggest we hold her reminder until Friday.',
        replyCust: 'Reply to customer',
        replyPh: 'Reply to Li Wei…',
        previewAs: 'Preview as customer',
        previewNote: 'Opens the Customer Portal exactly as Li Wei sees it, read-only, with a banner saying so.',
        s2Title: 'Project review queue',
        s2Note:
          'Project sub-pages live in the project menu in the context column (2a). Rows are grouped by stage; each opens the split dialog. Page actions stay in the floating bar here.',
        projName: 'Wang family · Global Talent',
        projEyebrow: 'Matter · immigration',
        stageFacts: 'Extracting facts',
        review: 'Review',
        searchQueue: 'Search the queue',
        allTypes: 'All types',
        processing: 'Organising documents · 31 of 44 ready',
        processingNote: 'Edits now may be overwritten',
        s3Title: 'Split dialog · question left, document right',
        s3Note:
          'The recommended choice carries a badge and a reason and is preselected. On phone the details come first and the document folds below.',
        splitEyebrow: 'Fact conflict · 王志远 · date of birth',
        splitQ: 'Which date of birth is correct?',
        splitContext: 'Two documents give different dates. Pick one; the other is kept as a noted discrepancy.',
        recommended: 'Recommended',
        otherValue: 'Enter another value',
        page2: 'Page 2 of 4',
        openFull: 'Open in full viewer',
        splitFoot: 'Enter confirms · J / K move between items',
        skip: 'Skip',
        confirmNext: 'Confirm and next',
        close: 'Close',
        showDoc: 'Show document',
      },
      zh: {
        docEyebrow: 'Ops 工作台 · 关键页面 · 导航方案 1a + 2a · COSX Advisory 工作区',
        docTitle: '一个人同时服务多个客户',
        docLede: '跨客户收件箱：客户的任务和对话都流入这里；以及项目审阅队列和拆分对话框。与客户门户共用同一套组件。',
        search: '搜索',
        inbox: '收件箱',
        list: '列表',
        board: '看板',
        mineOnly: '只看分配给我',
        projects: '项目',
        s1Title: '收件箱 · 所有客户的任务与对话',
        s1Note: '按客户筛选或切换。客户在对话中或通过表单交代的事，都在这里成为任务。回复会回到客户的对话中；内部备注永远不会。',
        fromConv: '来自对话',
        t128: '催签保密协议 · 4 位投资人',
        custMsg: '帮我催一下还没签保密协议的投资人。',
        agentPrep: '为每人准备好了提醒，尚未发送',
        sendReminders: '发送 4 条提醒',
        editDraft: '修改草稿',
        internal: '内部',
        internalNote: 'Maria 周一才受邀，建议她的提醒推迟到周五。',
        replyCust: '回复客户',
        replyPh: '回复李维…',
        previewAs: '以客户身份预览',
        previewNote: '以只读方式打开李维看到的客户门户，页顶有横幅提示。',
        s2Title: '项目审阅队列',
        s2Note: '项目子页在上下文栏的项目菜单里（2a）。按阶段分组，每一行打开拆分对话框。这里的页面操作保留在浮动操作栏中。',
        projName: '王氏家庭 · 全球人才签证',
        projEyebrow: '案件 · 移民',
        stageFacts: '提取事实中',
        review: '审阅',
        searchQueue: '搜索队列',
        allTypes: '全部类型',
        processing: '正在整理文档 · 44 个中已完成 31 个',
        processingNote: '此时修改可能被覆盖',
        s3Title: '拆分对话框 · 左侧问题，右侧文档',
        s3Note: '推荐项带徽章和理由并预先选中。手机上先看详情，文档折叠在下方。',
        splitEyebrow: '事实冲突 · 王志远 · 出生日期',
        splitQ: '哪个出生日期是正确的？',
        splitContext: '两份文件给出的日期不同。选择其一，另一个保留为已记录的差异。',
        recommended: '推荐',
        otherValue: '输入其他值',
        page2: '第 2 / 4 页',
        openFull: '在完整查看器中打开',
        splitFoot: 'Enter 确认 · J / K 切换条目',
        skip: '跳过',
        confirmNext: '确认并下一个',
        close: '关闭',
        showDoc: '显示文档',
      },
    };
  }
  rail(zh, active, extra) {
    const L = zh
      ? { home: '首页', inbox: '收件箱', projects: '项目', docs: '文档', agr: '协议', cust: '客户', matters: '案件', mkt: '营销' }
      : {
          home: 'Home',
          inbox: 'Inbox',
          projects: 'Projects',
          docs: 'Documents',
          agr: 'Agreements',
          cust: 'Customers',
          matters: 'Matters',
          mkt: 'Marketing',
        };
    const defs = [
      ['home', 'home', ''],
      ['inbox', 'inbox', '12'],
      ['projects', 'briefcase', ''],
      ['docs', 'file-text', ''],
      ['agr', 'pen-line', ''],
      ['cust', 'users', ''],
      ['matters', 'scale', ''],
      ['mkt', 'megaphone', ''],
    ];
    const out = [];
    defs.forEach(([k, icon, count]) => {
      const on = k === active;
      out.push({
        icon,
        label: L[k],
        count,
        countDisplay: count ? 'inline-block' : 'none',
        h: '34px',
        pad: '10px',
        bg: on && !extra ? 'var(--yellow)' : 'transparent',
        fg: on && !extra ? 'var(--ink)' : 'var(--text-primary)',
        fs: '13.5px',
        w: on ? 600 : 500,
        iconDisplay: 'inline-flex',
      });
      if (on && extra)
        extra.forEach(([l, c, sel]) =>
          out.push({
            icon: 'dot',
            label: l,
            count: c,
            countDisplay: c ? 'inline-block' : 'none',
            h: '30px',
            pad: '36px',
            bg: sel ? 'var(--yellow)' : 'transparent',
            fg: sel ? 'var(--ink)' : 'var(--text-primary)',
            fs: '13px',
            w: sel ? 500 : 400,
            iconDisplay: 'none',
          }),
        );
    });
    return out;
  }
  renderVals() {
    const zh = this.props.lang === 'zh';
    const t = this.dict()[zh ? 'zh' : 'en'];
    const dark = this.props.theme === 'dark';
    const pick = (en, z) => (zh ? z : en);
    const badge = (k) =>
      k === 'att'
        ? { bBg: 'var(--yellow-accent)', bFg: 'var(--ink)', bRing: 'none', bPad: '4px 7px' }
        : k === 'err'
          ? { bBg: 'var(--status-error)', bFg: '#fff', bRing: 'none', bPad: '4px 7px' }
          : k === 'prog'
            ? { bBg: 'transparent', bFg: 'var(--text-primary)', bRing: 'inset 0 0 0 1px var(--text-primary)', bPad: '3px 6px' }
            : { bBg: 'var(--bg-sunk)', bFg: 'var(--text-primary)', bRing: 'none', bPad: '4px 7px' };
    const tiles = { H: '#D6E4DA', V: '#E6DDF0', N: '#DCE6F0', K: '#F0E0D6' };
    const item = (ini, cust, kind, title, status, k, who, age, late, sel) => ({
      ini,
      cust,
      kind,
      title,
      status,
      who,
      age,
      tile: tiles[ini] || 'var(--bg-well)',
      ...badge(k),
      ageFg: late ? 'var(--status-error-text)' : 'var(--text-secondary)',
      ageW: late ? 600 : 400,
      titleW: sel || k === 'att' ? 500 : 400,
      bg: sel ? 'var(--row-wash)' : 'transparent',
      ring: sel ? 'inset 3px 0 0 var(--text-primary)' : 'none',
      bgPhone: 'transparent',
    });
    const groups = [
      {
        label: pick('New · 3', '新任务 · 3'),
        items: [
          item(
            'H',
            'Halden Capital',
            pick('Task', '任务'),
            t.t128,
            pick('New', '新'),
            'att',
            pick('Sam Ortiz', 'Sam Ortiz'),
            '14:02',
            false,
            true,
          ),
          item(
            'V',
            'Vela Family Office',
            pick('Conversation', '对话'),
            pick('Can you add my accountant to the data room?', '能把我的会计加到数据室吗？'),
            pick('New', '新'),
            'att',
            pick('Unassigned', '未分配'),
            '13:40',
          ),
          item(
            'N',
            'Northgate LP',
            pick('Form', '表单'),
            pick('Update registered address · 注册地址变更', '注册地址变更'),
            pick('New', '新'),
            'att',
            pick('Unassigned', '未分配'),
            '11:15',
          ),
        ],
      },
      {
        label: pick('Waiting on us · 5', '等我们处理 · 5'),
        items: [
          item(
            'H',
            'Halden Capital',
            pick('Content', '内容'),
            pick('Q3 report → website article + subscriber email', '第三季度报告 → 网站文章 + 订阅邮件'),
            pick('In progress', '进行中'),
            'prog',
            'Sam Ortiz',
            pick('2 d', '2 天'),
          ),
          item(
            'K',
            'Kowloon Bay Fund',
            pick('Task', '任务'),
            pick('Prepare the Series A data room index', '整理 A 轮数据室目录'),
            pick('Overdue', '逾期'),
            'err',
            'Agent',
            pick('4 d', '4 天'),
            true,
          ),
        ],
      },
      {
        label: pick('Waiting on customer · 4', '等客户 · 4'),
        items: [
          item(
            'H',
            'Halden Capital',
            pick('Signing', '签署'),
            pick('Engagement letter · Kowloon Bay Fund II', '委托协议 · 九龙湾基金 II'),
            pick('With customer', '等客户'),
            'neu',
            'Sam Ortiz',
            pick('1 d', '1 天'),
          ),
        ],
      },
    ];
    const stageRow = (kind, title, meta, status, k, action, primary, sel) => ({
      kind,
      title,
      meta,
      status,
      ...badge(k),
      action,
      aBg: primary ? 'var(--yellow-accent)' : 'transparent',
      aFg: primary ? 'var(--ink)' : 'var(--text-primary)',
      aRing: primary ? 'none' : 'inset 0 0 0 1px var(--rule)',
      bg: sel ? 'var(--row-wash)' : 'transparent',
      radius: sel ? '8px' : '0',
    });
    return {
      t,
      lang: zh ? 'zh' : 'en',
      htmlLang: zh ? 'zh-CN' : 'en-GB',
      modeClass: dark ? 'ink-mode' : '',
      ground: dark ? 'ink' : 'paper',
      rowWash: dark ? '#26231A' : 'var(--yellow-12)',
      fullW: { style: { width: '100%' } },
      tall: { style: { minHeight: 44 } },
      spinner: React.createElement('span', {
        style: {
          width: 12,
          height: 12,
          borderRadius: 999,
          border: '1.5px solid currentColor',
          borderRightColor: 'transparent',
          display: 'inline-block',
          boxSizing: 'border-box',
          animation: 'mr-spin .8s linear infinite',
        },
      }),
      pulseDot: React.createElement('span', {
        style: { width: 8, height: 8, borderRadius: 999, background: 'var(--yellow-accent)', display: 'inline-block' },
      }),
      railInbox: this.rail(zh, 'inbox'),
      railReview: this.rail(zh, 'projects', [
        [pick('All projects', '全部项目'), ''],
        [t.projName, '12', true],
        ['Harbour Series A', ''],
      ]),
      custFilters: [
        ['', pick('All customers', '全部客户'), '12', 1],
        ['H', 'Halden Capital', '5'],
        ['V', 'Vela FO', '2'],
        ['N', 'Northgate LP', '1'],
        ['K', 'Kowloon Bay', '4'],
      ].map(([ini, label, count, on]) => ({
        ini,
        label,
        count,
        tile: tiles[ini] || 'transparent',
        tileDisplay: ini ? 'grid' : 'none',
        bg: on ? 'var(--yellow)' : 'transparent',
        fg: on ? 'var(--ink)' : 'var(--text-primary)',
        ring: on ? 'none' : 'inset 0 0 0 1px var(--rule)',
        countFg: on ? 'rgba(17,17,17,.7)' : 'var(--text-secondary)',
      })),
      inboxGroups: groups,
      inboxFlat: groups.flatMap((g) => g.items).slice(0, 6),
      taskFields: [
        [pick('Status', '状态'), pick('New', '新')],
        [pick('Assignee', '处理人'), 'Sam Ortiz'],
        [pick('Waiting on', '在等'), pick('Us', '我们')],
        [pick('Project', '项目'), 'Harbour Series A'],
      ].map(([k, v]) => ({ k, v })),
      ndaPeople: [
        ['Anna Kowalski', 'Harbour Ventures', pick('9 days', '9 天')],
        ['王志远', '远川资本', pick('9 days', '9 天')],
        ['James Park', 'Northgate LP', pick('6 days', '6 天')],
        ['Maria Rossi', 'Vela Family Office', pick('2 days', '2 天')],
      ].map(([name, org, meta]) => ({ name, org, meta })),
      custFacts: [
        [pick('Open tasks', '进行中任务'), '5'],
        [pick('Projects', '项目'), '2'],
        [pick('Portal users', '门户用户'), '3'],
        [pick('Last seen', '最近访问'), pick('Just now', '刚刚')],
      ].map(([k, v]) => ({ k, v })),
      opsTabs: [
        ['home', pick('Home', '首页'), 0],
        ['inbox', pick('Inbox', '收件箱'), 1],
        ['briefcase', pick('Projects', '项目'), 0],
        ['sparkles', 'Agent', 0],
        ['menu', pick('More', '更多'), 0],
      ].map(([icon, label, on]) => ({
        icon,
        label,
        bg: on ? 'var(--yellow)' : 'transparent',
        fg: on ? 'var(--ink)' : 'var(--text-primary)',
      })),
      opsTabs2: [
        ['home', pick('Home', '首页'), 0],
        ['inbox', pick('Inbox', '收件箱'), 0],
        ['briefcase', pick('Projects', '项目'), 1],
        ['sparkles', 'Agent', 0],
        ['menu', pick('More', '更多'), 0],
      ].map(([icon, label, on]) => ({
        icon,
        label,
        bg: on ? 'var(--yellow)' : 'transparent',
        fg: on ? 'var(--ink)' : 'var(--text-primary)',
      })),
      projStats: [
        ['44', pick('Documents', '文档')],
        ['6', pick('Parties', '当事人')],
        ['12', pick('To review', '待审阅')],
      ].map(([v, k]) => ({ v, k })),
      subTabs: [
        [pick('Overview', '概览'), ''],
        [t.review, '12', 1],
        [pick('Parties', '当事人'), ''],
        [pick('Applications', '申请'), ''],
        [pick('Materials', '材料'), ''],
        [pick('Timeline', '时间线'), ''],
        [pick('Pipeline', '流程'), ''],
        [pick('Settings', '设置'), ''],
      ].map(([label, count, on]) => ({
        label,
        count,
        countDisplay: count ? 'inline-block' : 'none',
        fg: on ? 'var(--text-primary)' : 'var(--text-secondary)',
        line: on ? 'inset 0 -2px 0 var(--text-primary)' : 'none',
      })),
      subTabsPhone: [
        [t.review, 1],
        [pick('Overview', '概览'), 0],
        [pick('Parties', '当事人'), 0],
        [pick('Materials', '材料'), 0],
      ].map(([label, on]) => ({ label, bg: on ? 'var(--yellow)' : 'var(--bg-sunk)', fg: on ? 'var(--ink)' : 'var(--text-primary)' })),
      queue: [
        {
          n: '1',
          label: pick('What each document is', '每份文件是什么'),
          meta: pick('Done', '已完成'),
          dotBg: 'var(--text-primary)',
          dotFg: 'var(--bg-page)',
          rows: [],
        },
        {
          n: '2',
          label: pick('Who is involved', '涉及哪些人'),
          meta: pick('2 to review', '2 项待审'),
          dotBg: 'var(--text-primary)',
          dotFg: 'var(--bg-page)',
          rows: [
            stageRow(
              pick('Material ownership', '材料归属'),
              'Bank statement 2025-06.pdf',
              pick('Belongs to 王志远 or 李敏? · 2 candidates', '属于王志远还是李敏？· 2 个候选'),
              pick('Needs review', '待审'),
              'att',
              pick('Review', '审阅'),
              false,
            ),
            stageRow(
              pick('Merge proposal', '合并建议'),
              pick('Two pages of one employment contract', '同一份劳动合同的两部分'),
              pick('Scan p. 1–3 + Scan p. 4', '扫描件第 1–3 页 + 第 4 页'),
              pick('Needs review', '待审'),
              'att',
              pick('Review', '审阅'),
              false,
            ),
          ],
        },
        {
          n: '3',
          label: pick('What the documents say', '文件说了什么'),
          meta: pick('9 to review · running', '9 项待审 · 运行中'),
          dotBg: 'var(--yellow-accent)',
          dotFg: 'var(--ink)',
          rows: [
            stageRow(
              pick('Fact conflict', '事实冲突'),
              pick('王志远 · date of birth', '王志远 · 出生日期'),
              pick('14 Mar 1983 (passport) vs 13 Mar 1983 (birth certificate)', '1983-03-14（护照）与 1983-03-13（出生证明）'),
              pick('Conflict', '冲突'),
              'err',
              pick('Resolve', '处理'),
              true,
              true,
            ),
            stageRow(
              pick('Fact review', '事实审阅'),
              pick('李敏 · employer since', '李敏 · 入职日期'),
              pick('Low confidence · 2019-04 from payslip', '置信度低 · 来自工资单 2019-04'),
              pick('Needs review', '待审'),
              'att',
              pick('Confirm', '确认'),
              true,
            ),
            stageRow(
              pick('Fact review', '事实审阅'),
              pick('王志远 · UK entry date', '王志远 · 入境英国日期'),
              pick('Format suggestion · 03/09/2021 → 3 Sep 2021', '格式建议 · 03/09/2021 → 2021 年 9 月 3 日'),
              pick('Suggestion', '建议'),
              'neu',
              pick('Confirm', '确认'),
              true,
            ),
          ],
        },
        {
          n: '4',
          label: pick('Assessment', '评估'),
          meta: pick('Waits for stage 3', '等待第 3 阶段'),
          dotBg: 'var(--bg-well)',
          dotFg: 'var(--text-secondary)',
          rows: [
            stageRow(
              pick('Stale check', '过期检查'),
              pick('Global Talent · endorsement evidence', '全球人才 · 背书证据'),
              pick('Facts changed since last run', '上次运行后事实已变更'),
              pick('Stale', '已过期'),
              'neu',
              pick('Re-run', '重新运行'),
              false,
            ),
          ],
        },
      ],
      reviewActions: [
        ['play', pick('Run stage', '运行阶段'), 'R'],
        ['upload', pick('Upload', '上传'), 'U'],
        ['message-square', pick('Comment', '评论'), 'C'],
        ['more-horizontal', '', ''],
      ].map(([icon, label, key]) => ({ icon, label, key })),
      choices: [
        {
          value: pick('14 March 1983', '1983 年 3 月 14 日'),
          why: pick(
            'Passport, machine-readable zone and printed field agree. Passports outrank birth certificates for identity facts.',
            '护照机读区与印刷字段一致。身份类事实中护照优先于出生证明。',
          ),
          src: pick('Passport · p. 2', '护照 · 第 2 页'),
          on: true,
          rec: true,
        },
        {
          value: pick('13 March 1983', '1983 年 3 月 13 日'),
          why: pick('Birth certificate, handwritten; the 3 may be a misread 4.', '出生证明为手写；“3”可能是“4”的误读。'),
          src: pick('Birth certificate · p. 1', '出生证明 · 第 1 页'),
        },
      ].map((c) => ({
        ...c,
        ring: c.on ? 'inset 0 0 0 1.5px var(--text-primary)' : 'inset 0 0 0 1px var(--rule)',
        bg: c.on ? 'var(--row-wash)' : 'transparent',
        radioRing: c.on ? 'inset 0 0 0 1.5px var(--text-primary)' : 'inset 0 0 0 1px var(--rule)',
        dot: c.on ? 'block' : 'none',
        recDisplay: c.rec ? 'inline-block' : 'none',
        srcDisplay: 'inline',
      })),
    };
  }
}

export const pageCss =
  'html, body { margin: 0; background: var(--sunk-2); -webkit-font-smoothing: antialiased; }\n    a { color: var(--text-primary); text-underline-offset: 3px; }\n    a:hover { color: var(--text-secondary); }\n    @keyframes mr-spin { to { transform: rotate(360deg); } }\n    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }';

export default function MetaRoomOpsWorkbench(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="MetaRoomOpsWorkbench" precedence="page">
        {pageCss}
      </style>
      <div
        lang={v.htmlLang}
        className={v.modeClass}
        style={{
          width: 'max-content',
          display: 'flex',
          flexDirection: 'column',
          gap: '96px',
          padding: '72px',
          fontFamily: 'var(--font-sans-cjk)',
          fontSize: '14px',
          color: 'var(--text-primary)',
          background: 'var(--bg-well)',
          '--row-wash': v.rowWash,
        }}
      >
        {' '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '900px' }}>
          {' '}
          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.docEyebrow)}</span>{' '}
          <h1 style={{ margin: '0', fontSize: '40px', fontWeight: '500', lineHeight: '1.25' }}>{show(v.t?.docTitle)}</h1>{' '}
          <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>{show(v.t?.docLede)}</p>{' '}
        </div>{' '}
        <div id="inbox" data-screen-label="01 Ops inbox" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {' '}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: '600',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'var(--text-primary)',
                color: 'var(--bg-page)',
              }}
            >
              01
            </span>
            <span style={{ fontSize: '22px', fontWeight: '500', whiteSpace: 'nowrap' }}>{show(v.t?.s1Title)}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '760px' }}>{show(v.t?.s1Note)}</span>
          </div>{' '}
          <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
            {' '}
            <div
              style={{
                flex: 'none',
                width: '1440px',
                height: '900px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'var(--bg-page)',
                boxShadow: '0 0 0 1px var(--rule)',
                display: 'flex',
              }}
            >
              {' '}
              <div className="sc-host">
                <OpsRail mode="inbox" lang={v.lang} />
              </div>{' '}
              <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                {' '}
                <div
                  style={{
                    height: '56px',
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
                  <span style={{ color: 'var(--text-secondary)' }}>/</span>
                  <span>{show(v.t?.inbox)}</span>
                  <div style={{ flex: '1' }} />
                  <div style={{ display: 'inline-flex', gap: '2px', padding: '3px', borderRadius: '10px', background: 'var(--bg-sunk)' }}>
                    <span
                      style={{
                        height: '28px',
                        padding: '0 10px',
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: 'var(--yellow)',
                        color: 'var(--ink)',
                      }}
                    >
                      {show(v.t?.list)}
                    </span>
                    <span
                      style={{
                        height: '28px',
                        padding: '0 10px',
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {show(v.t?.board)}
                    </span>
                  </div>
                </div>{' '}
                <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
                  {' '}
                  <div
                    style={{
                      width: '360px',
                      flex: 'none',
                      borderRight: '1px solid var(--rule)',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    {list(v.inboxGroups).map((g$, $i) => {
                      const s1 = { ...v, g: g$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          {' '}
                          <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', padding: '14px 20px 6px' }}>
                            {show(s1.g?.label)}
                          </div>{' '}
                          {list(s1.g?.items).map((i$, $i) => {
                            const s2 = { ...s1, i: i$, $index: $i };
                            return (
                              <Fragment key={$i}>
                                {' '}
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    background: s2.i?.bg,
                                    boxShadow: s2.i?.ring,
                                  }}
                                >
                                  {' '}
                                  <span
                                    style={{
                                      width: '28px',
                                      height: '28px',
                                      borderRadius: '7px',
                                      background: s2.i?.tile,
                                      color: 'var(--ink)',
                                      display: 'grid',
                                      placeItems: 'center',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      flex: 'none',
                                    }}
                                  >
                                    {show(s2.i?.ini)}
                                  </span>{' '}
                                  <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {' '}
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '12px',
                                        color: 'var(--text-secondary)',
                                      }}
                                    >
                                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{show(s2.i?.cust)}</span>
                                      <span>{show(s2.i?.kind)}</span>
                                      <span
                                        style={{
                                          marginLeft: 'auto',
                                          fontVariantNumeric: 'tabular-nums',
                                          color: s2.i?.ageFg,
                                          fontWeight: s2.i?.ageW,
                                        }}
                                      >
                                        {show(s2.i?.age)}
                                      </span>
                                    </div>{' '}
                                    <span
                                      style={{
                                        fontSize: '13.5px',
                                        fontWeight: s2.i?.titleW,
                                        lineHeight: '1.4',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {show(s2.i?.title)}
                                    </span>{' '}
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '12px',
                                        color: 'var(--text-secondary)',
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontWeight: '600',
                                          padding: s2.i?.bPad,
                                          borderRadius: '6px',
                                          background: s2.i?.bBg,
                                          color: s2.i?.bFg,
                                          boxShadow: s2.i?.bRing,
                                        }}
                                      >
                                        {show(s2.i?.status)}
                                      </span>
                                      <span>{show(s2.i?.who)}</span>
                                    </div>{' '}
                                  </div>{' '}
                                </div>{' '}
                              </Fragment>
                            );
                          })}{' '}
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                  <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                    {' '}
                    <div
                      style={{
                        padding: '20px 28px 16px',
                        borderBottom: '1px solid var(--rule)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '5px',
                            background: '#D6E4DA',
                            color: 'var(--ink)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '9px',
                            fontWeight: '600',
                          }}
                        >
                          H
                        </span>
                        <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Halden Capital</span>
                        <span>
                          {'· Li Wei · T-128 · '}
                          {show(v.t?.fromConv)}
                        </span>
                        <div style={{ flex: '1' }} />
                        <DS.Button variant="ghost" size="sm" ground={v.ground}>
                          <DS.Icon name="eye" size={14} />
                          {show(v.t?.previewAs)}
                        </DS.Button>
                      </div>{' '}
                      <span style={{ fontSize: '20px', fontWeight: '500' }}>{show(v.t?.t128)}</span>{' '}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {list(v.taskFields).map((f$, $i) => {
                          const s3 = { ...v, f: f$, $index: $i };
                          return (
                            <Fragment key={$i}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  height: '30px',
                                  padding: '0 10px',
                                  borderRadius: '8px',
                                  background: 'var(--bg-sunk)',
                                  fontSize: '12px',
                                }}
                              >
                                <span style={{ color: 'var(--text-secondary)' }}>{show(s3.f?.k)}</span>
                                <span style={{ fontWeight: '500' }}>{show(s3.f?.v)}</span>
                                <DS.Icon name="chevron-down" size={12} />
                              </span>
                            </Fragment>
                          );
                        })}
                      </div>{' '}
                    </div>{' '}
                    <div
                      style={{ flex: '1', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '18px', overflow: 'hidden' }}
                    >
                      {' '}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '10px',
                            fontWeight: '600',
                            flex: 'none',
                          }}
                        >
                          LW
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '12px' }}>
                            <span style={{ fontWeight: '500' }}>Li Wei · Halden</span>{' '}
                            <span style={{ color: 'var(--text-secondary)' }}>· 14:02</span>
                          </span>
                          <span style={{ fontSize: '14px', lineHeight: '1.6' }}>{show(v.t?.custMsg)}</span>
                        </div>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '999px',
                            background: 'var(--ink)',
                            color: 'var(--yellow-accent)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="sparkles" size={13} />
                        </span>
                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '12px' }}>
                            <span style={{ fontWeight: '500' }}>Agent</span>{' '}
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {'· '}
                              {show(v.t?.agentPrep)}
                            </span>
                          </span>
                          <div style={{ borderRadius: '12px', border: '1px solid var(--rule)', display: 'flex', flexDirection: 'column' }}>
                            {list(v.ndaPeople).map((p$, $i) => {
                              const s4 = { ...v, p: p$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      padding: '9px 14px',
                                      borderBottom: '1px solid var(--rule-soft)',
                                      fontSize: '13px',
                                    }}
                                  >
                                    <span style={{ fontWeight: '500' }}>{show(s4.p?.name)}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{show(s4.p?.org)}</span>
                                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                      {show(s4.p?.meta)}
                                    </span>
                                  </div>
                                </Fragment>
                              );
                            })}
                            <div style={{ display: 'flex', gap: '8px', padding: '10px 14px' }}>
                              <DS.Button size="sm" ground={v.ground}>
                                {show(v.t?.sendReminders)}
                              </DS.Button>
                              <DS.Button variant="ghost" size="sm" ground={v.ground}>
                                {show(v.t?.editDraft)}
                              </DS.Button>
                            </div>
                          </div>
                        </div>
                      </div>{' '}
                      <div
                        style={{ display: 'flex', gap: '12px', padding: '12px 14px', borderRadius: '12px', background: 'var(--bg-sunk)' }}
                      >
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '999px',
                            background: 'var(--bg-chrome)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '10px',
                            fontWeight: '600',
                            flex: 'none',
                          }}
                        >
                          SO
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '500' }}>Sam Ortiz</span>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: '600',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              <DS.Icon name="eye-off" size={12} />
                              {show(v.t?.internal)}
                            </span>
                          </span>
                          <span style={{ fontSize: '14px', lineHeight: '1.6' }}>{show(v.t?.internalNote)}</span>
                        </div>
                      </div>{' '}
                    </div>{' '}
                    <div
                      style={{
                        padding: '12px 28px 20px',
                        borderTop: '1px solid var(--rule)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {' '}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignSelf: 'flex-start',
                          gap: '2px',
                          padding: '3px',
                          borderRadius: '10px',
                          background: 'var(--bg-sunk)',
                        }}
                      >
                        <span
                          style={{
                            height: '28px',
                            padding: '0 10px',
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: 'var(--yellow)',
                            color: 'var(--ink)',
                          }}
                        >
                          {show(v.t?.replyCust)}
                        </span>
                        <span
                          style={{
                            height: '28px',
                            padding: '0 10px',
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          {show(v.t?.internal)}
                        </span>
                      </div>{' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          minHeight: '44px',
                          padding: '4px 4px 4px 14px',
                          borderRadius: '12px',
                          background: 'var(--bg-sunk)',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span style={{ flex: '1', fontSize: '14px', color: 'var(--text-secondary)' }}>{show(v.t?.replyPh)}</span>
                        <DS.IconButton name="arrow-up" label="Send" variant="solid" size={36} />
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
            <div
              style={{
                width: '390px',
                height: '844px',
                borderRadius: '40px',
                overflow: 'hidden',
                background: 'var(--bg-page)',
                boxShadow: '0 0 0 1px var(--rule), 0 0 0 8px var(--bg-chrome)',
                display: 'flex',
                flexDirection: 'column',
                flex: 'none',
              }}
            >
              {' '}
              <div style={{ height: '47px', flex: 'none' }} />{' '}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 20px', height: '52px', flex: 'none' }}>
                <span style={{ fontSize: '24px', fontWeight: '500', flex: '1' }}>{show(v.t?.inbox)}</span>
                <DS.IconButton name="sliders-horizontal" label="Filter" variant="ghost" size={44} />
              </div>{' '}
              <div style={{ display: 'flex', gap: '6px', padding: '0 16px 12px', overflow: 'hidden', flex: 'none' }}>
                {list(v.custFilters).map((c$, $i) => {
                  const s5 = { ...v, c: c$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <span
                        style={{
                          flex: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '36px',
                          padding: '0 12px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: '500',
                          background: s5.c?.bg,
                          color: s5.c?.fg,
                          boxShadow: s5.c?.ring,
                        }}
                      >
                        {show(s5.c?.label)}
                        <span style={{ fontSize: '12px', color: s5.c?.countFg }}>{show(s5.c?.count)}</span>
                      </span>
                    </Fragment>
                  );
                })}
              </div>{' '}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {' '}
                {list(v.inboxFlat).map((i$, $i) => {
                  const s6 = { ...v, i: i$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '12px 16px',
                          minHeight: '72px',
                          boxSizing: 'border-box',
                          borderBottom: '1px solid var(--rule-soft)',
                          background: s6.i?.bgPhone,
                        }}
                      >
                        <span
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: s6.i?.tile,
                            color: 'var(--ink)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                            flex: 'none',
                          }}
                        >
                          {show(s6.i?.ini)}
                        </span>
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{show(s6.i?.cust)}</span>
                            <span style={{ marginLeft: 'auto', color: s6.i?.ageFg }}>{show(s6.i?.age)}</span>
                          </div>
                          <span style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {show(s6.i?.title)}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {show(s6.i?.status)}
                            {' · '}
                            {show(s6.i?.who)}
                          </span>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}{' '}
              </div>{' '}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  padding: '6px 8px 26px',
                  borderTop: '1px solid var(--rule)',
                  flex: 'none',
                }}
              >
                {list(v.opsTabs).map((t$, $i) => {
                  const s7 = { ...v, t: t$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '3px',
                          minHeight: '48px',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            width: '48px',
                            height: '28px',
                            borderRadius: '999px',
                            display: 'grid',
                            placeItems: 'center',
                            background: s7.t?.bg,
                            color: s7.t?.fg,
                          }}
                        >
                          <DS.Icon name={s7.t?.icon} size={18} />
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '500' }}>{show(s7.t?.label)}</span>
                      </div>
                    </Fragment>
                  );
                })}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div id="review" data-screen-label="02 Review queue" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {' '}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: '600',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'var(--text-primary)',
                color: 'var(--bg-page)',
              }}
            >
              02
            </span>
            <span style={{ fontSize: '22px', fontWeight: '500', whiteSpace: 'nowrap' }}>{show(v.t?.s2Title)}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '760px' }}>{show(v.t?.s2Note)}</span>
          </div>{' '}
          <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
            {' '}
            <div
              style={{
                flex: 'none',
                width: '1440px',
                height: '900px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'var(--bg-page)',
                boxShadow: '0 0 0 1px var(--rule)',
                display: 'flex',
                position: 'relative',
              }}
            >
              {' '}
              <div className="sc-host">
                <OpsRail mode="project" lang={v.lang} />
              </div>{' '}
              <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                {' '}
                <div
                  style={{
                    height: '56px',
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
                  <span style={{ color: 'var(--text-secondary)' }}>/</span>
                  <span>{show(v.t?.projects)}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>/</span>
                  <span style={{ fontWeight: '500' }}>{show(v.t?.projName)}</span>
                  <div style={{ flex: '1' }} />
                  <DS.Button variant="ghost" size="sm" ground={v.ground}>
                    <DS.Icon name="eye" size={14} />
                    {show(v.t?.previewAs)}
                  </DS.Button>
                </div>{' '}
                <div style={{ padding: '24px 32px 0', display: 'flex', flexDirection: 'column', gap: '16px', flex: 'none' }}>
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.projEyebrow)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px', fontWeight: '500' }}>{show(v.t?.projName)}</span>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: '4px 7px',
                            borderRadius: '6px',
                            boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                          }}
                        >
                          {show(v.t?.stageFacts)}
                        </span>
                      </div>
                    </div>
                    {list(v.projStats).map((s$, $i) => {
                      const s8 = { ...v, s: s$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '22px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>{show(s8.s?.v)}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s8.s?.k)}</span>
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>{' '}
                </div>{' '}
                <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
                  {' '}
                  <div
                    style={{
                      flex: '1',
                      minWidth: '0',
                      padding: '18px 32px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--yellow)',
                        color: 'var(--ink)',
                      }}
                    >
                      <span style={{ display: 'inline-flex' }}>{show(v.spinner)}</span>
                      <span style={{ fontSize: '13px', fontWeight: '500', flex: '1' }}>{show(v.t?.processing)}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(17,17,17,.7)' }}>{show(v.t?.processingNote)}</span>
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '280px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '34px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                          color: 'var(--text-secondary)',
                          fontSize: '13px',
                        }}
                      >
                        <DS.Icon name="search" size={14} />
                        {show(v.t?.searchQueue)}
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
                        {show(v.t?.allTypes)}
                        <DS.Icon name="chevron-down" size={14} />
                      </span>
                    </div>{' '}
                    {list(v.queue).map((g$, $i) => {
                      const s9 = { ...v, g: g$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {' '}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 0',
                                borderBottom: '1px solid var(--rule)',
                              }}
                            >
                              <span
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '999px',
                                  background: s9.g?.dotBg,
                                  color: s9.g?.dotFg,
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                }}
                              >
                                {show(s9.g?.n)}
                              </span>
                              <span style={{ fontSize: '13px', fontWeight: '500' }}>{show(s9.g?.label)}</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s9.g?.meta)}</span>
                            </div>{' '}
                            {list(s9.g?.rows).map((r$, $i) => {
                              const s10 = { ...s9, r: r$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  {' '}
                                  <div
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns: '160px minmax(0, 1fr) 150px 96px',
                                      gap: '14px',
                                      alignItems: 'center',
                                      padding: '10px 8px',
                                      borderBottom: '1px solid var(--rule-soft)',
                                      background: s10.r?.bg,
                                      borderRadius: s10.r?.radius,
                                    }}
                                  >
                                    {' '}
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s10.r?.kind)}</span>{' '}
                                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '0' }}>
                                      <span
                                        style={{
                                          fontSize: '13.5px',
                                          fontWeight: '500',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {show(s10.r?.title)}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: '12px',
                                          color: 'var(--text-secondary)',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {show(s10.r?.meta)}
                                      </span>
                                    </div>{' '}
                                    <span
                                      style={{
                                        justifySelf: 'start',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        padding: s10.r?.bPad,
                                        borderRadius: '6px',
                                        background: s10.r?.bBg,
                                        color: s10.r?.bFg,
                                        boxShadow: s10.r?.bRing,
                                      }}
                                    >
                                      {show(s10.r?.status)}
                                    </span>{' '}
                                    <span
                                      style={{
                                        justifySelf: 'end',
                                        height: '30px',
                                        padding: '0 12px',
                                        display: 'grid',
                                        placeItems: 'center',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        background: s10.r?.aBg,
                                        color: s10.r?.aFg,
                                        boxShadow: s10.r?.aRing,
                                      }}
                                    >
                                      {show(s10.r?.action)}
                                    </span>{' '}
                                  </div>{' '}
                                </Fragment>
                              );
                            })}{' '}
                          </div>{' '}
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                </div>{' '}
                <div
                  style={{
                    position: 'absolute',
                    left: 'calc(312px + (100% - 312px) / 2)',
                    bottom: '22px',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    padding: '5px',
                    borderRadius: '14px',
                    background: 'var(--ink)',
                    color: 'var(--linen)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {' '}
                  <span style={{ width: '14px', height: '32px', display: 'grid', placeItems: 'center', color: 'var(--grey-inverse)' }}>
                    <DS.Icon name="grip-vertical" size={14} />
                  </span>{' '}
                  {list(v.reviewActions).map((a$, $i) => {
                    const s11 = { ...v, a: a$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            height: '34px',
                            padding: '0 11px',
                            borderRadius: '9px',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          <DS.Icon name={s11.a?.icon} size={15} />
                          {show(s11.a?.label)}
                          <span style={{ fontSize: '11px', color: 'var(--grey-inverse)' }}>{show(s11.a?.key)}</span>
                        </span>
                      </Fragment>
                    );
                  })}{' '}
                  <span style={{ width: '1px', height: '20px', background: 'var(--rule-inverse)', margin: '0 4px' }} />
                  <span style={{ display: 'inline-flex', width: '32px', justifyContent: 'center' }}>{show(v.pulseDot)}</span>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
            <div
              style={{
                width: '390px',
                height: '844px',
                borderRadius: '40px',
                overflow: 'hidden',
                background: 'var(--bg-page)',
                boxShadow: '0 0 0 1px var(--rule), 0 0 0 8px var(--bg-chrome)',
                display: 'flex',
                flexDirection: 'column',
                flex: 'none',
              }}
            >
              {' '}
              <div style={{ height: '47px', flex: 'none' }} />{' '}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px', height: '52px', flex: 'none' }}>
                <DS.IconButton name="chevron-left" label="Back" variant="ghost" size={44} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.25' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{show(v.t?.projName)}</span>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>{show(v.t?.review)}</span>
                </div>
              </div>{' '}
              <div style={{ padding: '0 16px 12px', flex: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    height: '44px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    background: 'var(--bg-sunk)',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  <DS.Icon name="list-checks" size={16} />
                  {show(v.t?.review)}
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      background: 'var(--yellow-accent)',
                      color: 'var(--ink)',
                    }}
                  >
                    12
                  </span>
                  <span style={{ marginLeft: 'auto', display: 'inline-flex' }}>
                    <DS.Icon name="chevron-down" size={16} />
                  </span>
                </div>
              </div>{' '}
              <div style={{ flex: '1', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                {' '}
                {list(v.queue).map((g$, $i) => {
                  const s12 = { ...v, g: g$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', padding: '12px 0 4px' }}>
                        {show(s12.g?.n)}
                        {' · '}
                        {show(s12.g?.label)}
                      </span>
                      {list(s12.g?.rows).map((r$, $i) => {
                        const s13 = { ...s12, r: r$, $index: $i };
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
                                <span
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {show(s13.r?.title)}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s13.r?.kind)}</span>
                              </div>
                              <DS.Icon name="chevron-right" size={16} />
                            </div>
                          </Fragment>
                        );
                      })}
                    </Fragment>
                  );
                })}{' '}
              </div>{' '}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  padding: '6px 8px 26px',
                  borderTop: '1px solid var(--rule)',
                  flex: 'none',
                }}
              >
                {list(v.opsTabs2).map((t$, $i) => {
                  const s14 = { ...v, t: t$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '3px',
                          minHeight: '48px',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            width: '48px',
                            height: '28px',
                            borderRadius: '999px',
                            display: 'grid',
                            placeItems: 'center',
                            background: s14.t?.bg,
                            color: s14.t?.fg,
                          }}
                        >
                          <DS.Icon name={s14.t?.icon} size={18} />
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '500' }}>{show(s14.t?.label)}</span>
                      </div>
                    </Fragment>
                  );
                })}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div id="split" data-screen-label="03 Split dialog" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {' '}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: '600',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'var(--text-primary)',
                color: 'var(--bg-page)',
              }}
            >
              03
            </span>
            <span style={{ fontSize: '22px', fontWeight: '500', whiteSpace: 'nowrap' }}>{show(v.t?.s3Title)}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '760px' }}>{show(v.t?.s3Note)}</span>
          </div>{' '}
          <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
            {' '}
            <div
              style={{
                flex: 'none',
                width: '1440px',
                height: '900px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'var(--scrim)',
                boxShadow: '0 0 0 1px var(--rule)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {' '}
              <div
                style={{
                  width: '1180px',
                  height: '780px',
                  borderRadius: '16px',
                  background: 'var(--bg-page)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {' '}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '18px 24px',
                    borderBottom: '1px solid var(--rule)',
                  }}
                >
                  <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.splitEyebrow)}</span>
                    <span style={{ fontSize: '18px', fontWeight: '500' }}>{show(v.t?.splitQ)}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>4 / 12</span>
                  <DS.IconButton name="chevron-left" label="Previous" size={32} />
                  <DS.IconButton name="chevron-right" label="Next" size={32} />
                  <DS.IconButton name="x" label="Close" variant="ghost" size={32} />
                </div>{' '}
                <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
                  {' '}
                  <div
                    style={{
                      width: '440px',
                      flex: 'none',
                      padding: '20px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      borderRight: '1px solid var(--rule)',
                      boxSizing: 'border-box',
                    }}
                  >
                    {' '}
                    <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      {show(v.t?.splitContext)}
                    </span>{' '}
                    {list(v.choices).map((c$, $i) => {
                      const s15 = { ...v, c: c$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          {' '}
                          <div
                            style={{
                              display: 'flex',
                              gap: '12px',
                              padding: '14px',
                              borderRadius: '12px',
                              boxShadow: s15.c?.ring,
                              background: s15.c?.bg,
                            }}
                          >
                            {' '}
                            <span
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '999px',
                                boxShadow: s15.c?.radioRing,
                                display: 'grid',
                                placeItems: 'center',
                                flex: 'none',
                                marginTop: '1px',
                              }}
                            >
                              <span
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '999px',
                                  background: 'var(--text-primary)',
                                  display: s15.c?.dot,
                                }}
                              />
                            </span>{' '}
                            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(s15.c?.value)}</span>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    padding: '3px 6px',
                                    borderRadius: '5px',
                                    background: 'var(--yellow-accent)',
                                    color: 'var(--ink)',
                                    display: s15.c?.recDisplay,
                                  }}
                                >
                                  {show(s15.t?.recommended)}
                                </span>
                              </div>
                              <span style={{ fontSize: '12px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                                {show(s15.c?.why)}
                              </span>
                              <span
                                style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline', display: s15.c?.srcDisplay }}
                              >
                                {show(s15.c?.src)}
                              </span>
                            </div>{' '}
                          </div>{' '}
                        </Fragment>
                      );
                    })}{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px',
                        borderRadius: '12px',
                        boxShadow: 'inset 0 0 0 1px var(--rule)',
                      }}
                    >
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '999px',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                          flex: 'none',
                        }}
                      />
                      <span style={{ fontSize: '14px' }}>{show(v.t?.otherValue)}</span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ flex: '1', minWidth: '0', background: 'var(--bg-sunk)', display: 'flex', flexDirection: 'column' }}>
                    {' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        fontSize: '12px',
                        borderBottom: '1px solid var(--rule)',
                      }}
                    >
                      <DS.Icon name="file-text" size={14} />
                      <span style={{ fontWeight: '500' }}>Passport · 王志远.pdf</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{show(v.t?.page2)}</span>
                      <div style={{ flex: '1' }} />
                      <span style={{ fontWeight: '600', textDecoration: 'underline' }}>{show(v.t?.openFull)}</span>
                    </div>{' '}
                    <div style={{ flex: '1', display: 'grid', placeItems: 'center', padding: '20px' }}>
                      {' '}
                      <div
                        style={{
                          width: '520px',
                          height: '360px',
                          background: 'var(--paper)',
                          borderRadius: '6px',
                          boxShadow: '0 0 0 1px var(--rule-soft)',
                          padding: '28px',
                          boxSizing: 'border-box',
                          display: 'grid',
                          gridTemplateColumns: '130px 1fr',
                          gap: '20px',
                          color: '#111',
                        }}
                      >
                        {' '}
                        <div style={{ background: '#ECE9E3', borderRadius: '4px' }} />{' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <span style={{ fontSize: '10px', color: '#696969' }}>Surname / 姓</span>
                            <span>WANG</span>
                          </div>{' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <span style={{ fontSize: '10px', color: '#696969' }}>Given names / 名</span>
                            <span>ZHIYUAN</span>
                          </div>{' '}
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '3px',
                              padding: '4px 6px',
                              margin: '-4px -6px',
                              borderRadius: '4px',
                              background: '#FFE3A0',
                              boxShadow: '0 0 0 1.5px #111',
                            }}
                          >
                            <span style={{ fontSize: '10px', color: '#111' }}>Date of birth / 出生日期</span>
                            <span style={{ fontWeight: '600' }}>14 MAR 1983</span>
                          </div>{' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <span style={{ fontSize: '10px', color: '#696969' }}>Place of birth / 出生地点</span>
                            <span>SHANGHAI</span>
                          </div>{' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <span style={{ fontSize: '10px', color: '#696969' }}>Date of expiry / 有效期至</span>
                            <span>02 NOV 2031</span>
                          </div>{' '}
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', borderTop: '1px solid var(--rule)' }}
                >
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: '1' }}>{show(v.t?.splitFoot)}</span>
                  <DS.Button variant="ghost" ground={v.ground}>
                    {show(v.t?.skip)}
                  </DS.Button>
                  <DS.Button ground={v.ground}>{show(v.t?.confirmNext)}</DS.Button>
                </div>{' '}
              </div>{' '}
            </div>{' '}
            <div
              style={{
                width: '390px',
                height: '844px',
                borderRadius: '40px',
                overflow: 'hidden',
                background: 'var(--bg-page)',
                boxShadow: '0 0 0 1px var(--rule), 0 0 0 8px var(--bg-chrome)',
                display: 'flex',
                flexDirection: 'column',
                flex: 'none',
              }}
            >
              {' '}
              <div style={{ height: '47px', flex: 'none' }} />{' '}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 8px',
                  height: '52px',
                  flex: 'none',
                }}
              >
                <DS.Button variant="ghost" ground={v.ground} {...v.tall}>
                  {show(v.t?.close)}
                </DS.Button>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>4 / 12</span>
                <span style={{ width: '80px' }} />
              </div>{' '}
              <div style={{ flex: '1', padding: '4px 20px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
                {' '}
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.splitEyebrow)}</span>{' '}
                <span style={{ fontSize: '19px', fontWeight: '500', lineHeight: '1.35' }}>{show(v.t?.splitQ)}</span>{' '}
                {list(v.choices).map((c$, $i) => {
                  const s16 = { ...v, c: c$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '14px',
                          minHeight: '44px',
                          boxSizing: 'border-box',
                          borderRadius: '12px',
                          boxShadow: s16.c?.ring,
                          background: s16.c?.bg,
                        }}
                      >
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '999px',
                            boxShadow: s16.c?.radioRing,
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <span
                            style={{
                              width: '9px',
                              height: '9px',
                              borderRadius: '999px',
                              background: 'var(--text-primary)',
                              display: s16.c?.dot,
                            }}
                          />
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '15px', fontWeight: '500' }}>{show(s16.c?.value)}</span>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                padding: '3px 6px',
                                borderRadius: '5px',
                                background: 'var(--yellow-accent)',
                                color: 'var(--ink)',
                                display: s16.c?.recDisplay,
                              }}
                            >
                              {show(s16.t?.recommended)}
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>{show(s16.c?.why)}</span>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}{' '}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'var(--bg-sunk)',
                  }}
                >
                  <DS.Icon name="file-text" size={16} />
                  <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Passport · 王志远.pdf</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {show(v.t?.page2)}
                      {' · '}
                      {show(v.t?.showDoc)}
                    </span>
                  </div>
                  <DS.Icon name="chevron-down" size={16} />
                </div>{' '}
              </div>{' '}
              <div style={{ padding: '12px 16px 30px', borderTop: '1px solid var(--rule)', flex: 'none' }}>
                <div className="sc-host-x" style={{ width: '100%' }}>
                  <DS.Button ground={v.ground} size="lg" {...v.fullW}>
                    {show(v.t?.confirmNext)}
                  </DS.Button>
                </div>
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>
      </div>
    </>
  );
}
