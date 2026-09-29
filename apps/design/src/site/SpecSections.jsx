// SpecSections — converted once from the Claude Design export (Spec Sections.dc.html); edit freely.
import * as React from 'react';
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';

/* eslint-disable */
class Logic extends DCLogic {
  state = { a: 'idle', b: 'idle', copied: false, sort: 'updated', chips: null, cb1: true, sw1: true, seg: 'cards', choice: 'person' };
  timers = [];
  componentWillUnmount() {
    this.timers.forEach(clearTimeout);
  }
  later(fn, ms) {
    this.timers.push(setTimeout(fn, ms));
  }
  run(key, outcome) {
    if (this.state[key] !== 'idle') return;
    this.setState({ [key]: 'busy' });
    this.later(() => {
      this.setState({ [key]: outcome });
      if (outcome === 'done') this.later(() => this.setState({ [key]: 'idle' }), 1600);
    }, 1400);
  }
  baseChips() {
    return [
      { id: 1, label: 'li.wei@halden.co', state: 'ok' },
      { id: 2, label: 'anna.k@harbour.vc', state: 'pending' },
      { id: 3, label: 'mark@harbour', state: 'invalid' },
      { id: 4, label: '王志远', state: 'ok' },
    ];
  }
  badgeGroups() {
    const K = {
      att: { bg: 'var(--brand-mark)', fg: 'var(--ink)', ring: 'none', pad: '5px 8px', dot: 'var(--brand-mark)', dotDisplay: 'none' },
      err: { bg: 'var(--status-error)', fg: '#fff', ring: 'none', pad: '5px 8px', dot: 'var(--status-error)', dotDisplay: 'none' },
      prog: {
        bg: 'transparent',
        fg: 'var(--text-primary)',
        ring: 'inset 0 0 0 1px var(--text-primary)',
        pad: '4px 7px',
        dot: 'transparent',
        dotDisplay: 'none',
      },
      done: {
        bg: 'transparent',
        fg: 'var(--text-secondary)',
        ring: 'none',
        pad: '4px 0',
        dot: 'var(--text-primary)',
        dotDisplay: 'inline-block',
      },
      neu: { bg: 'transparent', fg: 'var(--text-secondary)', ring: 'none', pad: '4px 0', dot: 'var(--grey)', dotDisplay: 'inline-block' },
      tag: { bg: 'var(--bg-sunk)', fg: 'var(--text-primary)', ring: 'none', pad: '5px 8px', dot: 'transparent', dotDisplay: 'none' },
    };
    const dotOf = (k) =>
      k === 'prog'
        ? { dot: 'transparent', ring: 'inset 0 0 0 1.5px var(--text-primary)' }
        : { dot: K[k].dot === 'transparent' ? 'var(--grey)' : K[k].dot, ring: 'none' };
    const g = (name, where, items) => ({
      name,
      where,
      items: items.map(([label, k]) => ({ label, ...K[k] })),
      dots: items
        .filter(([, k]) => k !== 'tag')
        .slice(0, 5)
        .map(([label, k]) => ({ label, ...dotOf(k) })),
    });
    return [
      g('File processing', 'Cards · rows show the dot', [
        ['Scanning', 'prog'],
        ['Indexing', 'prog'],
        ['OCR in progress', 'prog'],
        ['Converting', 'prog'],
        ['Password protected', 'att'],
        ['Quarantined', 'err'],
        ['Scan failed', 'err'],
        ['Damaged', 'err'],
        ['Render failed', 'err'],
        ['Ready', 'done'],
      ]),
      g('Format · origin', 'Cards, rows, viewer title', [
        ['PDF', 'tag'],
        ['Word', 'tag'],
        ['Excel', 'tag'],
        ['Email', 'tag'],
        ['Archive', 'tag'],
        ['Dropbox', 'tag'],
        ['Via link', 'tag'],
        ['System-managed', 'tag'],
        ['Signed', 'done'],
      ]),
      g('Share lifecycle', 'Share list and detail', [
        ['Pending', 'att'],
        ['Accepted', 'done'],
        ['Declined', 'neu'],
        ['Revoked', 'neu'],
        ['Expired', 'neu'],
      ]),
      g('Share capabilities', 'Share list and detail', [
        ['Can view', 'tag'],
        ['Can comment', 'tag'],
        ['Can download', 'tag'],
        ['Can forward', 'tag'],
      ]),
      g('Draft state', 'Block docs, forms, Profile', [
        ['Unpublished changes', 'att'],
        ['Viewing draft', 'prog'],
        ['Published', 'done'],
      ]),
      g('Check result', 'Application checklist', [
        ['Met', 'done'],
        ['Missing facts', 'att'],
        ['Missing evidence', 'att'],
        ['Indeterminate', 'prog'],
        ['Not met', 'err'],
        ['Recommended', 'tag'],
        ['Stale', 'neu'],
      ]),
      g('Task · ticket', 'Customer portal', [
        ['Awaiting you', 'att'],
        ['In progress', 'prog'],
        ['With us', 'prog'],
        ['Delivered', 'done'],
        ['Overdue', 'err'],
        ['Closed', 'neu'],
      ]),
      g('Trash · security', 'Trash cards, settings', [
        ['Deleted in 3 days', 'att'],
        ['Deleted in 26 days', 'neu'],
        ['Two-factor on', 'done'],
        ['Two-factor off', 'att'],
      ]),
    ];
  }
  renderVals() {
    const s = this.state;
    const dark = this.props.theme === 'dark';
    const halden = (this.props.brand ?? 'metaroom') === 'halden';
    const spinner = React.createElement('span', {
      style: {
        width: 12,
        height: 12,
        borderRadius: 999,
        border: '1.5px solid currentColor',
        borderRightColor: 'transparent',
        display: 'inline-block',
        boxSizing: 'border-box',
        animation: 'mr-spin .8s linear infinite',
        flex: 'none',
      },
    });
    const chips = (s.chips || this.baseChips()).map((c) => ({
      label: c.label,
      bg: c.state === 'invalid' ? 'var(--status-error-wash)' : 'var(--bg-page)',
      fg: c.state === 'invalid' ? 'var(--ink)' : 'var(--text-primary)',
      ring:
        c.state === 'invalid'
          ? 'inset 0 0 0 1px var(--status-error)'
          : c.state === 'pending'
            ? 'inset 0 0 0 1px var(--text-secondary)'
            : 'inset 0 0 0 1px var(--rule)',
      remove: () => this.setState((st) => ({ chips: (st.chips || this.baseChips()).filter((x) => x.id !== c.id) })),
    }));
    const segDefs = [
      { v: 'cards', label: 'Cards', icon: 'layout-grid' },
      { v: 'list', label: 'List', icon: 'list' },
      { v: 'map', label: 'Map', icon: 'git-fork', disabled: true, title: 'Needs at least one party' },
    ];
    const segs = segDefs.map((d) => ({
      label: d.label,
      icon: d.icon,
      disabled: !!d.disabled,
      title: d.title || '',
      bg: s.seg === d.v ? 'var(--brand-field)' : 'transparent',
      fg: d.disabled ? 'var(--text-secondary)' : s.seg === d.v ? 'var(--ink)' : 'var(--text-primary)',
      pick: () => !d.disabled && this.setState({ seg: d.v }),
    }));
    const calDays = [];
    for (let i = 0; i < 3; i++) calDays.push({ n: '', bg: 'transparent', fg: 'inherit', w: 400 });
    for (let d = 1; d <= 31; d++) {
      const sel = d === 31,
        today = d === 24 - 20 + 20 && false;
      calDays.push({
        n: String(d),
        bg: sel ? 'var(--ink)' : 'transparent',
        fg: sel ? 'var(--linen)' : d < 1 ? 'var(--text-secondary)' : 'var(--text-primary)',
        w: sel ? 600 : 400,
      });
    }
    const brd = (on) => (on ? '1px solid var(--text-primary)' : '1px solid var(--rule)');
    const only = (this.props.only || '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
    const emb = only.length > 0;
    const vis = {};
    [
      's01',
      's02',
      's03',
      's04',
      's05',
      's06',
      's07',
      's08',
      's09',
      's10',
      's11',
      's12',
      's13',
      's14',
      's15',
      's16',
      's17',
      's18',
      's19',
      's20',
      's21',
      's22',
    ].forEach((id) => {
      vis[id] = !emb || only.includes(id) ? 'flex' : 'none';
    });
    const show = {};
    Object.keys(vis).forEach((k) => {
      show[k] = vis[k] === 'flex';
    });
    return {
      show,
      vis,
      rootLang: this.props.lang === 'en' ? 'en-GB' : 'zh-CN',
      headD: emb ? 'none' : 'flex',
      rootMinH: emb ? '0' : '100vh',
      rootBg: emb ? 'transparent' : 'var(--bg-sunk)',
      innerMax: emb ? 'none' : '1240px',
      innerPad: emb ? '0' : '0 48px 96px',
      sx: {
        b0: { style: { background: 'var(--brand-mark)' } },
        b1: { style: { minWidth: '132px' } },
        b2: { style: { minWidth: '132px', cursor: 'progress' } },
        b3: { style: { minWidth: '132px', borderColor: 'var(--status-error)' } },
        b4: { style: { width: '100%' } },
        b5: { style: { minHeight: '44px' } },
      },
      hoverPrimaryP: { style: dark ? { background: 'var(--yellow-accent-hover)' } : { background: 'var(--ink-raised)' } },
      hoverSecondaryP: { style: { borderColor: dark ? 'var(--linen)' : 'var(--ink)' } },
      hoverGhostP: { style: { background: dark ? 'var(--ink-raised)' : 'rgba(17,17,17,.05)' } },
      modeClass: dark ? 'ink-mode' : '',
      ground: dark ? 'ink' : 'paper',
      brandField: halden ? '#D6E4DA' : 'var(--yellow)',
      brandMark: halden ? '#8FBF9F' : 'var(--yellow-accent)',
      brandName: halden ? 'Halden Capital' : 'MetaRoom',
      brandInitial: halden ? 'H' : 'M',
      logoDisplay: halden ? 'none' : 'block',
      initialDisplay: halden ? 'inline' : 'none',
      brandWordmark: halden ? 'HALDEN' : 'METAROOM',
      hoverPrimary: dark ? { background: 'var(--yellow-accent-hover)' } : { background: 'var(--ink-raised)' },
      hoverSecondary: { borderColor: dark ? 'var(--linen)' : 'var(--ink)' },
      hoverGhost: { background: dark ? 'var(--ink-raised)' : 'rgba(17,17,17,.05)' },
      spinner,
      aIdle: s.a === 'idle',
      aBusy: s.a === 'busy',
      aDone: s.a === 'done',
      bIdle: s.b === 'idle',
      bBusy: s.b === 'busy',
      bFail: s.b === 'fail',
      runA: () => this.run('a', 'done'),
      runB: () => this.run('b', 'fail'),
      retryB: () => this.setState({ b: 'idle' }, () => this.run('b', 'fail')),
      copy: () => {
        this.setState({ copied: true });
        this.later(() => this.setState({ copied: false }), 1600);
      },
      copyIcon: s.copied ? 'check' : 'copy',
      copyLabel: s.copied ? 'Copied' : 'Copy',
      sortOptions: [
        { value: 'updated', label: 'Last updated', group: 'Sort' },
        { value: 'name', label: 'Name A–Z', group: 'Sort' },
        { value: 'size', label: 'Size', group: 'Sort' },
        { value: 'created', label: 'Date added', group: 'Sort', meta: 'Soon', disabled: true },
      ],
      sortValue: s.sort,
      setSort: (v) => this.setState({ sort: v }),
      docTypes: [
        'Passport',
        'Bank statement',
        'Employment contract',
        'Tenancy agreement',
        'Tax return',
        'Payslip',
        'Utility bill',
        'Birth certificate',
        'Marriage certificate',
        'Degree certificate',
      ].map((l) => ({ value: l, label: l })),
      chips,
      chipsReset: !!s.chips,
      resetChips: () => this.setState({ chips: null }),
      cb1: s.cb1,
      setCb1: (v) => this.setState({ cb1: v }),
      sw1: s.sw1,
      setSw1: (v) => this.setState({ sw1: v }),
      segs,
      pickPerson: () => this.setState({ choice: 'person' }),
      pickOrg: () => this.setState({ choice: 'org' }),
      personBorder: brd(s.choice === 'person'),
      orgBorder: brd(s.choice === 'org'),
      personBg: s.choice === 'person' ? 'var(--hover)' : 'var(--bg-page)',
      orgBg: s.choice === 'org' ? 'var(--hover)' : 'var(--bg-page)',
      calDays,
      indeterminate: React.createElement(
        'div',
        { style: { height: 6, borderRadius: 999, background: 'var(--bg-well)', overflow: 'hidden' } },
        React.createElement('div', {
          style: {
            width: '40%',
            height: '100%',
            borderRadius: 999,
            background: 'var(--text-primary)',
            animation: 'mr-slide 1.4s cubic-bezier(.16,1,.3,1) infinite',
          },
        }),
      ),
      pulseDot: React.createElement('span', {
        style: {
          width: 8,
          height: 8,
          borderRadius: 999,
          background: 'var(--brand-mark)',
          display: 'inline-block',
          flex: 'none',
          animation: 'mr-pulse 1.6s ease-in-out infinite',
        },
      }),
      badgeGroups: this.badgeGroups(),
      skel: [{ w: '70%' }, { w: '55%' }, { w: '80%' }, { w: '45%' }],
      empties: [
        {
          kind: 'Nothing here yet',
          title: 'No documents yet',
          body: 'Files shared with you and files you upload appear here.',
          action: 'Upload files',
          primary: true,
        },
        {
          kind: 'No search results',
          title: 'Nothing matches “股东协议”',
          body: 'Searched this folder and its subfolders.',
          action: 'Search all documents',
        },
        {
          kind: 'Filters exclude everything',
          title: 'No documents match these filters',
          body: '2 filters are on: Signed, Last 7 days.',
          action: 'Clear filters',
        },
        {
          kind: 'Not found · no access',
          title: "This page isn't available",
          body: 'It may have been moved, or you may not have access. Ask the person who sent you the link.',
          action: 'Go to my documents',
        },
        {
          kind: 'Feature not enabled · admin',
          title: 'Dropbox sync is off',
          body: 'Mirror a Dropbox folder into this workspace. Members see this note without the button.',
          action: 'Turn it on',
          primary: true,
        },
        {
          kind: 'Locked · complete first',
          title: 'Sign the NDA to open the data room',
          body: 'Step 2 of 2. The form is done.',
          action: 'Review and sign',
          primary: true,
        },
      ].map((e) => ({
        ...e,
        btnBg: e.primary ? (dark ? 'var(--yellow-accent)' : 'var(--ink)') : 'transparent',
        btnFg: e.primary ? (dark ? 'var(--ink)' : 'var(--linen)') : 'var(--text-primary)',
        btnRing: e.primary ? 'none' : 'inset 0 0 0 1px var(--rule)',
      })),
      abNormal: () => this.setState({ ab: 'normal' }),
      abSelect: () => this.setState({ ab: 'select' }),
      abAdmin: () => this.setState({ ab: 'admin' }),
      abNormalBg: (s.ab || 'normal') === 'normal' ? 'var(--brand-field)' : 'transparent',
      abSelectBg: s.ab === 'select' ? 'var(--brand-field)' : 'transparent',
      abAdminBg: s.ab === 'admin' ? 'var(--brand-field)' : 'transparent',
      abIsAdmin: s.ab === 'admin',
      abIsSelect: s.ab === 'select',
      abItems: (s.ab === 'select'
        ? [
            ['share-2', 'Share', 'H'],
            ['folder-input', 'Move', 'M'],
            ['trash-2', 'Delete', 'D'],
            ['x', 'Cancel', 'Esc'],
          ]
        : s.ab === 'admin'
          ? [
              ['plus', 'New', 'N'],
              ['upload', 'Upload', 'U'],
              ['message-square', 'Comment', 'C'],
              ['shield', 'Admin', ''],
            ]
          : [
              ['plus', 'New', 'N'],
              ['upload', 'Upload', 'U'],
              ['square-check', 'Select', 'S'],
              ['message-square', 'Comment', 'C'],
            ]
      ).map(([icon, label, key]) => ({
        icon,
        label,
        key,
        bg: label === 'Admin' || (label === 'Delete' && false) ? 'var(--yellow-accent)' : 'transparent',
        fg: label === 'Admin' ? 'var(--ink)' : label === 'Delete' ? '#FF8A84' : 'var(--linen)',
      })),
      layers: [
        ['Command palette', '独占，打开时关闭其他浮层'],
        ['Dialog', '可嵌套，一次 Esc 关一层'],
        ['Popover · menu · tooltip', '锚定触发点，越界翻转'],
        ['Toast', '右下，避开操作栏与缩放胶囊'],
        ['Mode state', '并入操作栏；没有操作栏的页面才单独显示胶囊'],
        ['Action bar', '底部居中；手机为左缘把手'],
        ['Zoom pill', '右下；手机时让出底部标签'],
        ['Right slot', 'Agent 抽屉或侧面板，二选一'],
        ['Page', '内容与收件箱路由浮层'],
      ].map(([name, rule], i) => ({ n: String(9 - i).padStart(2, '0'), name, rule, bg: i === 0 ? 'var(--bg-sunk)' : 'transparent' })),
      agentSteps: [
        ['Searched contacts in Harbour Series A', '24 found'],
        ['Checked NDA status', '4 not signed'],
        ['Searched documents for “family trust”', '3 matches'],
        ['Read Shareholder agreement v3', 'pages 14–15'],
      ].map(([what, result]) => ({ what, result })),
      stepsOpen: s.stepsOpen !== false,
      stepsRot: s.stepsOpen !== false ? 'rotate(90deg)' : 'none',
      toggleSteps: () => this.setState((st) => ({ stepsOpen: st.stepsOpen === false })),
      agentSources: [
        ['1', 'Contacts · Harbour Series A'],
        ['2', 'Shareholder agreement v3 · p. 14'],
        ['3', 'Shareholder agreement v3 · p. 15'],
      ].map(([n, label]) => ({ n, label })),
      agentPeople: [
        ['AK', 'Anna Kowalski', '9 days'],
        ['王', '王志远', '9 days'],
        ['JP', 'James Park', '6 days'],
      ].map(([ini, name, meta]) => ({ ini, name, meta })),
      slashCmds: [
        ['/task', 'Hand over as a task'],
        ['/summarise', 'Summarise a document'],
        ['/find', 'Find documents'],
        ['/translate', 'Translate a document'],
      ].map(([cmd, desc], i) => ({
        cmd,
        desc,
        bg: i === 0 ? 'var(--brand-field)' : 'transparent',
        fg: i === 0 ? 'var(--ink)' : 'var(--text-primary)',
      })),
      agentAnatomy: [
        ['用户消息', '亚麻底气泡，右对齐，最宽 75%。附件显示在气泡上方。'],
        ['Agent 消息', '不加气泡，直接排在纸面上，左侧是墨色方块头像。正文 15/1.7，中文 16/1.8。'],
        ['执行步骤', '默认收起成一行“用时 · 步数”。运行中自动展开当前步骤；失败的步骤保持展开。'],
        ['引用', '句末编号。悬停显示出处卡片，点击在查看器里打开到对应页并高亮。凡是数字、日期、条款，都必须带引用。'],
        ['确认卡片', '发送、分享、签署、删除这类对外或不可撤销的动作，Agent 只能起草，由用户确认后才执行。墨色描边，与普通结果卡片区分。'],
        ['系统行', '创建任务、转交、权限变化。居中灰字，不带头像。'],
        ['员工消息', '和 Agent 在同一侧，用真人头像和“COSX”标签区分。'],
      ].map(([k, v], i) => ({ n: String(i + 1), k, v })),
      agentRules: [
        [
          '范围可见',
          '输入框左下的范围标签说明 Agent 能看到哪些资料。客户门户里只包含这位客户能看到的内容；切换范围会在对话里留一条系统行。',
        ],
        ['不替用户对外行动', '任何会离开工作区或不可撤销的动作，都先给出确认卡片。'],
        ['引用必带', '回答里的数字、日期、条款都要有出处；找不到出处时直接说明，不给数字。'],
        ['可以打断', 'Esc 或停止按钮随时停止，已输出的内容保留，可以“继续”。输出时可以先写下一条。'],
        ['失败要说原因', '写清楚哪一步、为什么失败，并给出可以继续的下一步，不只说“出错了”。'],
        ['随时转人工', '每条回答下都有“交给团队处理”，会转成一张任务，回复仍出现在这段对话里。'],
        ['手机', '步骤默认收起；点引用编号从底部弹出出处；输入框贴着键盘，范围标签收进“+”菜单。'],
      ].map(([k, v]) => ({ k, v })),
      panelTabs: ['Invite', 'Public link'],
      ctxKinds: [
        {
          kind: '模块视图',
          title: '视图 + 树',
          body: '模块的固定视图在上，下面是层级树或项目分组。点树节点只改变内容区。',
          where: 'Ops 文档 · 客户门户文档',
        },
        {
          kind: '列表',
          title: '列表在栏里，详情在内容区',
          body: '条目少、需要来回切换时，列表直接放在上下文栏，内容区只显示选中项。',
          where: '客户门户对话、任务、内容 · Ops 收件箱',
        },
        {
          kind: '实体菜单',
          title: '返回行 + 切换器 + 菜单 + 设置',
          body: '进入项目或站点后，整栏换成它的菜单。设置和成员放在底部。',
          where: 'Ops 项目 · Marketing 站点',
        },
        {
          kind: '收起',
          title: '只剩图标栏',
          body: '查看器、演示、签署默认收起，腾出宽度。悬停模块图标时上下文栏以浮层弹出。收起后图标栏右侧加 1px 分隔线；内容区底色若同为亚麻色，改用深一级的 sunk-2。',
          where: '文档查看器 · 签署',
        },
      ],
      shellBreaks: [
        { w: '≥ 1440', rule: '两列都展开；右侧槽位打开时推开内容。' },
        { w: '1280 – 1439', rule: '两列展开；右侧槽位改为覆盖在内容上。' },
        { w: '768 – 1279', rule: '上下文栏默认收起，悬停或点图标时弹出；用户手动展开后记住选择。' },
        { w: '< 768 · 手机', rule: '图标栏变为底部标签（最多 5 个，其余进 More）。上下文栏变为模块首页，或页头下的“章节”底部抽屉。' },
      ],
      shellRules: [
        { k: '最多两层菜单', v: '模块一层，实体一层。更深的层级只出现在面包屑里，菜单保持父项选中。' },
        { k: '实体切换器', v: '放在实体菜单顶部，列出最近访问的，可以搜索；切换后停在同一个子模块。' },
        { k: '设置归属', v: '项目、站点的设置放在各自菜单底部；工作区设置在 Admin 模块。' },
        { k: '面包屑', v: '从模块开始：Projects / Wang family / Review / Conflict 4。客户在自有域名下从品牌名开始。' },
        { k: '返回', v: '浏览器返回与返回行效果一致，回到列表时恢复筛选、排序和滚动位置。' },
      ],
      shellDiff: [
        {
          k: '模块',
          a: '对话、我的任务、文档、我的客户、我的内容（按开通情况显示）',
          b: '首页、收件箱、项目、文档、协议、客户、案件、营销、管理',
        },
        { k: '品牌方块', a: '客户工作区品牌色与首字母', b: 'COSX 工作区' },
        { k: 'Agent', a: '就是“对话”模块本身', b: '图标栏底部常驻，打开右侧抽屉' },
        { k: '实体菜单', a: '不使用，项目以分组出现在文档和客户里', b: '项目、站点' },
        { k: '页面操作', a: '浮动操作栏，按状态切换', b: '浮动操作栏，按状态切换' },
      ],
      phoneRows: [
        ['folder', 'Side letters', '4 documents', 'block'],
        ['file-text', 'Shareholder agreement 股东协议 v3.pdf', 'PDF · Signed · 2 h ago', 'none'],
        ['file-spreadsheet', 'Cap table.xlsx', 'Excel · 184 KB · yesterday', 'none'],
        ['file-lock', 'Loan agreement.pdf', 'Password protected', 'none'],
        ['mail', 'Re: Side letter comments.eml', 'Email · Indexing', 'none'],
        ['file-text', 'Board minutes 2025.docx', 'Word · 3 days ago', 'none'],
      ].map(([icon, name, meta, chev]) => ({ icon, name, meta, chev })),
      phoneTabs: [
        ['message-circle', 'Agent'],
        ['square-check', 'Tasks'],
        ['file-text', 'Documents'],
        ['users', 'Clients'],
        ['menu', 'More'],
      ].map(([icon, label]) => ({
        icon,
        label,
        bg: label === 'Documents' ? 'var(--brand-field)' : 'transparent',
        fg: label === 'Documents' ? 'var(--ink)' : 'var(--text-primary)',
      })),
      sheetItems: [
        ['share-2', 'Share'],
        ['download', 'Download'],
        ['message-square', 'Comment'],
        ['folder-input', 'Move to…'],
        ['pencil', 'Rename'],
        ['trash-2', 'Delete'],
      ].map(([icon, label]) => ({ icon, label, fg: label === 'Delete' ? 'var(--status-error-text)' : 'var(--text-primary)' })),
      langs: [
        {
          lang: 'en-GB',
          name: 'English UI',
          eyebrow: 'Project · Series A',
          title: 'Harbour data room',
          primary: 'Share',
          secondary: 'Download',
          b1: 'Awaiting you',
          b2: 'In progress',
          b3: 'Delivered',
          emptyTitle: 'No documents yet',
          emptyBody: 'Files shared with you and files you upload appear here.',
        },
        {
          lang: 'zh-CN',
          name: '中文界面',
          eyebrow: '项目 · A 轮',
          title: 'Harbour 数据室',
          primary: '分享',
          secondary: '下载',
          b1: '等你处理',
          b2: '进行中',
          b3: '已交付',
          emptyTitle: '还没有文档',
          emptyBody: '别人分享给你的文件和你上传的文件会出现在这里。',
        },
      ],
      tree: [
        [0, 'Harbour data room', 'folder-open', '', 'open'],
        [1, 'Legal', 'folder-open', '', 'open'],
        [2, 'Shareholder agreements', 'folder', '12', 'active'],
        [2, 'Side letters', 'folder', '4', ''],
        [1, 'Financials 财务报表', 'folder', '', 'drop'],
        [1, 'Dropbox · Harbour mirror', 'folder-sync', '1,204', ''],
        [1, 'Inbox · deals@halden.co', 'mail', '', ''],
        [1, 'Signed copies', 'folder-lock', 'System', 'leaf'],
        [0, 'Shared with me', 'users', '3', ''],
      ].map(([d, label, icon, meta, st]) => ({
        label,
        icon,
        meta,
        indent: 4 + d * 18 + 'px',
        bg: st === 'active' ? 'var(--brand-field)' : st === 'drop' ? 'var(--yellow-12)' : 'transparent',
        ring: st === 'drop' ? 'inset 0 0 0 1.5px var(--text-primary)' : 'none',
        fg: st === 'active' ? 'var(--ink)' : 'var(--text-primary)',
        metaFg: st === 'active' ? 'rgba(17,17,17,.7)' : 'var(--text-secondary)',
        weight: st === 'active' ? 500 : 400,
        chevOpacity: st === 'leaf' || st === 'active' ? 0 : 1,
        chevRot: st === 'open' ? 'rotate(90deg)' : 'none',
      })),
      undoAction: React.createElement(
        'button',
        {
          type: 'button',
          style: {
            border: 'none',
            background: 'none',
            color: 'var(--yellow-accent)',
            font: '600 13px var(--font-sans)',
            cursor: 'pointer',
            padding: 0,
          },
        },
        'Undo',
      ),
      retryAction: React.createElement(
        'button',
        {
          type: 'button',
          style: {
            border: 'none',
            background: 'none',
            color: 'var(--yellow-accent)',
            font: '600 13px var(--font-sans)',
            cursor: 'pointer',
            padding: 0,
          },
        },
        'Retry',
      ),
    };
  }
}

export const pageCss =
  'html, body { margin: 0; background: var(--linen); -webkit-font-smoothing: antialiased; }\n    a { color: var(--text-primary); text-underline-offset: 3px; }\n    a:hover { color: var(--text-secondary); }\n    @keyframes mr-spin { to { transform: rotate(360deg); } }\n    @keyframes mr-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }\n    @keyframes mr-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }\n    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }\n.h130:hover{background: #C4261F !important}';

export default function SpecSections(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="SpecSections" precedence="page">
        {pageCss}
      </style>
      <div
        lang={v.rootLang}
        className={v.modeClass}
        style={{
          minHeight: v.rootMinH,
          background: v.rootBg,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans-cjk)',
          fontSize: '14px',
          '--brand-field': v.brandField,
          '--brand-mark': v.brandMark,
        }}
      >
        <div style={{ maxWidth: v.innerMax, margin: '0 auto', padding: v.innerPad, boxSizing: 'border-box' }}>
          {' '}
          <header style={{ display: v.headD, flexDirection: 'column', gap: '20px', padding: '72px 0 56px' }}>
            {' '}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {' '}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--brand-field)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--ink)',
                }}
              >
                <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: v.logoDisplay }} />
                <span style={{ display: v.initialDisplay }}>{show(v.brandInitial)}</span>
              </div>{' '}
              <div style={{ fontSize: '13px', fontWeight: '500' }}>{show(v.brandName)}</div>{' '}
              <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                · MetaRoom 组件系统 · v1 草案 · 2026 年 9 月 24 日
              </div>{' '}
            </div>{' '}
            <h1
              style={{
                margin: '0',
                fontSize: '46px',
                fontWeight: '500',
                lineHeight: '1.25',
                letterSpacing: '0',
                maxWidth: '18em',
                textWrap: 'pretty',
              }}
            >
              {'一套组件，服务 '}
              <span className="marker">客户门户与 Ops 工作台</span>
              {' 两个产品面'}
            </h1>{' '}
            <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
              基于 COSX Design System 3.0。组件按需求文档第 4–7
              节分组，每组给出类型、状态矩阵与用法规则。样例界面文案为英文（产品默认），中文样例见第 12 节。右上角 Tweaks
              可切换深色主题与客户品牌。
            </p>{' '}
            <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '8px' }}>
              {' '}
              <a
                href="#s01"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                01 基础与注入点
              </a>{' '}
              <a
                href="#s02"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                02 按钮
              </a>{' '}
              <a
                href="#s03"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                03 文本输入
              </a>{' '}
              <a
                href="#s04"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                04 选择控件
              </a>{' '}
              <a
                href="#s05"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                05 上传与进度
              </a>{' '}
              <a
                href="#s06"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                06 徽章与同步
              </a>{' '}
              <a
                href="#s07"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                07 页面状态
              </a>{' '}
              <a
                href="#s08"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                08 即时反馈
              </a>{' '}
              <a
                href="#s09"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                09 浮层与操作面
              </a>{' '}
              <a
                href="#s10"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                10 数据展示
              </a>{' '}
              <a
                href="#s11"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                11 手机端
              </a>{' '}
              <a
                href="#s12"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                12 中英文
              </a>{' '}
              <a
                href="#s13"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--brand-field)',
                  color: 'var(--ink)',
                  textDecoration: 'none',
                }}
              >
                13 布局与导航
              </a>{' '}
              <a
                href="#s14"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--brand-field)',
                  color: 'var(--ink)',
                  textDecoration: 'none',
                }}
              >
                14 Agent 对话
              </a>{' '}
              <a
                href="#s15"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                15 头像与成员
              </a>{' '}
              <a
                href="#s16"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                16 分享
              </a>{' '}
              <a
                href="#s17"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                17 看板
              </a>{' '}
              <a
                href="#s18"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                18 编辑与签署
              </a>{' '}
              <a
                href="#s19"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                19 表单扩展
              </a>{' '}
              <a
                href="#s20"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                20 图表
              </a>{' '}
              <a
                href="#s21"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                21 系统级
              </a>{' '}
              <a
                href="#s22"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-page)',
                  border: '1px solid var(--rule)',
                  textDecoration: 'none',
                }}
              >
                22 设置页
              </a>{' '}
            </nav>{' '}
          </header>{' '}
          {v.show?.s01 ? (
            <>
              <section
                id="s01"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>01 / 基础与注入点</div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    产品界面只用三种材料：纸、墨、一种品牌色
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    工作区品牌色通过两个变量注入，替换 COSX
                    的黄色。对比度始终由墨色承担：主按钮、正文、图标永远是墨色，所以换成任何客户品牌色都不会破坏可读性。品牌色只用于面积（选中项、区块底色）和小标记（圆点、进度、高亮），不写文字。
                  </p>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>品牌注入点</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{ width: '40px', height: '28px', borderRadius: '6px', background: 'var(--brand-field)', flex: 'none' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <code style={{ fontSize: '12px' }}>--brand-field</code>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>选中导航、选中标签、区块底色</span>
                        </div>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{ width: '40px', height: '28px', borderRadius: '6px', background: 'var(--brand-mark)', flex: 'none' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <code style={{ fontSize: '12px' }}>--brand-mark</code>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>圆点、进度条、高亮、需关注填充</span>
                        </div>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '28px', borderRadius: '6px', background: 'var(--ink)', flex: 'none' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <code style={{ fontSize: '12px' }}>--ink（不可注入）</code>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>主按钮、正文、图标</span>
                        </div>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{ width: '40px', height: '28px', borderRadius: '6px', background: 'var(--status-error)', flex: 'none' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <code style={{ fontSize: '12px' }}>--status-error（不可注入）</code>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>错误、逾期、危险操作</span>
                        </div>
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>工作区品牌区 · 三种显示方式</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            background: 'var(--brand-field)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'var(--ink)',
                          }}
                        >
                          <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: v.logoDisplay }} />
                          <span style={{ display: v.initialDisplay }}>{show(v.brandInitial)}</span>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(v.brandName)}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>图标 + 名称</span>
                      </div>{' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            background: 'var(--brand-field)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'var(--ink)',
                          }}
                        >
                          <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: v.logoDisplay }} />
                          <span style={{ display: v.initialDisplay }}>{show(v.brandInitial)}</span>
                        </div>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>仅图标（收起时）</span>
                      </div>{' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                        }}
                      >
                        <span style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '.08em' }}>{show(v.brandWordmark)}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>仅字标</span>
                      </div>{' '}
                    </div>{' '}
                    <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      浅色与深色各一份 logo。客户在自有域名访问时，不出现任何平台名称，面包屑从工作区品牌开始。
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>产品尺度</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                      {' '}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid var(--rule-soft)',
                          paddingBottom: '8px',
                        }}
                      >
                        <span>页面标题</span>
                        <span style={{ color: 'var(--text-secondary)' }}>22 / 500</span>
                      </div>{' '}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid var(--rule-soft)',
                          paddingBottom: '8px',
                        }}
                      >
                        <span>区块标题</span>
                        <span style={{ color: 'var(--text-secondary)' }}>16 / 500</span>
                      </div>{' '}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid var(--rule-soft)',
                          paddingBottom: '8px',
                        }}
                      >
                        <span>正文 / 行</span>
                        <span style={{ color: 'var(--text-secondary)' }}>14 · 中文 15</span>
                      </div>{' '}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid var(--rule-soft)',
                          paddingBottom: '8px',
                        }}
                      >
                        <span>标签与元信息</span>
                        <span style={{ color: 'var(--text-secondary)' }}>12 / 500 灰</span>
                      </div>{' '}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid var(--rule-soft)',
                          paddingBottom: '8px',
                        }}
                      >
                        <span>圆角</span>
                        <span style={{ color: 'var(--text-secondary)' }}>4 · 6 · 8 · 16 · 24</span>
                      </div>{' '}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>控件高度</span>
                        <span style={{ color: 'var(--text-secondary)' }}>32 紧凑 · 38 默认 · 44 手机</span>
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
                <div
                  style={{
                    background: 'var(--bg-page)',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {' '}
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>五种语义色调 → 设计系统的状态材料</h3>{' '}
                  <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', maxWidth: '52em' }}>
                    需求要求五种色调。设计系统只给产品界面黄、墨、一种红，所以差别由形状承担：填充 = 需要人处理，描边 = 正在进行，圆点 =
                    安静的已知状态。文字总是在场，颜色只是冗余。
                  </div>{' '}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>neutral 中性</span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span style={{ width: '9px', height: '9px', borderRadius: '999px', background: 'var(--grey)' }} />
                        Draft
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>灰点 · 未知值回落到这里</span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>accent 进行中</span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignSelf: 'flex-start',
                          alignItems: 'center',
                          gap: '7px',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '4px 7px',
                          border: '1px solid var(--text-primary)',
                          borderRadius: '6px',
                        }}
                      >
                        Indexing
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>墨色描边 · 后台处理、转换、同步</span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>success 完成</span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span style={{ width: '9px', height: '9px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                        Signed
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>墨点 · 完成的事退后，不抢眼</span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>warning 需关注</span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignSelf: 'flex-start',
                          alignItems: 'center',
                          gap: '7px',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '5px 8px',
                          background: 'var(--brand-mark)',
                          color: 'var(--ink)',
                          borderRadius: '6px',
                        }}
                      >
                        Awaiting you
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>品牌色填充 · 墨字</span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>critical 严重</span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignSelf: 'flex-start',
                          alignItems: 'center',
                          gap: '7px',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '5px 8px',
                          background: 'var(--status-error)',
                          color: '#fff',
                          borderRadius: '6px',
                        }}
                      >
                        Quarantined
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>唯一的红 · 白字</span>
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s02 ? (
            <>
              <section
                id="s02"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>02 / 按钮 · P0 · 需求 4.1</div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    一个按钮组件，六种类型，异步结果留在按钮里
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    现有的库按钮与行内快捷按钮合并为一个 Button。成功和失败不再全部交给
                    toast：结果先在按钮原位出现，宽度锁定不跳动。每个视图只有一个主按钮。
                  </p>{' '}
                </div>{' '}
                <div
                  style={{
                    background: 'var(--bg-page)',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    padding: '8px 24px',
                    overflowX: 'auto',
                  }}
                >
                  {' '}
                  <div style={{ display: 'grid', gridTemplateColumns: '150px repeat(4, minmax(150px, 1fr))', minWidth: '780px' }}>
                    {' '}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--text-secondary)',
                        padding: '14px 0',
                        borderBottom: '1px solid var(--rule)',
                      }}
                    >
                      类型
                    </div>{' '}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--text-secondary)',
                        padding: '14px 0',
                        borderBottom: '1px solid var(--rule)',
                      }}
                    >
                      默认
                    </div>{' '}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--text-secondary)',
                        padding: '14px 0',
                        borderBottom: '1px solid var(--rule)',
                      }}
                    >
                      悬停
                    </div>{' '}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--text-secondary)',
                        padding: '14px 0',
                        borderBottom: '1px solid var(--rule)',
                      }}
                    >
                      带快捷键 / 计数
                    </div>{' '}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--text-secondary)',
                        padding: '14px 0',
                        borderBottom: '1px solid var(--rule)',
                      }}
                    >
                      不可用（带原因）
                    </div>{' '}
                    <div
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Primary</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>每视图一个</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button ground={v.ground}>Share</DS.Button>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button ground={v.ground} {...v.hoverPrimaryP}>
                        Share
                      </DS.Button>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button ground={v.ground}>
                        Share
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '500',
                            padding: '2px 5px',
                            borderRadius: '4px',
                            background: 'rgba(245,242,236,.16)',
                          }}
                        >
                          ⇧S
                        </span>
                      </DS.Button>
                    </div>{' '}
                    <div
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <DS.Button ground={v.ground} disabled={true}>
                        Share
                      </DS.Button>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Downloads are off for this share</span>
                    </div>{' '}
                    <div
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Secondary</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>并列操作</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button variant="secondary" ground={v.ground}>
                        Download
                      </DS.Button>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button variant="secondary" ground={v.ground} {...v.hoverSecondaryP}>
                        Download
                      </DS.Button>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button variant="secondary" ground={v.ground}>
                        Comments
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            minWidth: '18px',
                            padding: '2px 5px',
                            borderRadius: '999px',
                            background: 'var(--brand-mark)',
                            color: 'var(--ink)',
                            boxSizing: 'border-box',
                          }}
                        >
                          12
                        </span>
                      </DS.Button>
                    </div>{' '}
                    <div
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <DS.Button variant="secondary" ground={v.ground} disabled={true}>
                        Download
                      </DS.Button>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Still converting to PDF</span>
                    </div>{' '}
                    <div
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Subtle</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>取消、次要链接</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button variant="ghost" ground={v.ground}>
                        Cancel
                      </DS.Button>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button variant="ghost" ground={v.ground} {...v.hoverGhostP}>
                        Cancel
                      </DS.Button>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button variant="ghost" ground={v.ground}>
                        Close
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '500',
                            padding: '2px 5px',
                            borderRadius: '4px',
                            border: '1px solid var(--rule)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Esc
                        </span>
                      </DS.Button>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button variant="ghost" ground={v.ground} disabled={true}>
                        Cancel
                      </DS.Button>
                    </div>{' '}
                    <div
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Destructive</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>永久删除、撤销</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <button
                        type="button"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '11px 18px',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '14px',
                          fontWeight: '600',
                          lineHeight: '1',
                          borderRadius: '8px',
                          border: '1px solid transparent',
                          background: 'var(--status-error)',
                          color: '#fff',
                          cursor: 'pointer',
                        }}
                        className={'h130'}
                      >
                        Delete forever
                      </button>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <button
                        type="button"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '11px 18px',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '14px',
                          fontWeight: '600',
                          lineHeight: '1',
                          borderRadius: '8px',
                          border: '1px solid transparent',
                          background: '#C4261F',
                          color: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        Delete forever
                      </button>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <button
                        type="button"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 14px',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '14px',
                          fontWeight: '600',
                          lineHeight: '1',
                          borderRadius: '8px',
                          border: '1px solid var(--rule)',
                          background: 'transparent',
                          color: 'var(--status-error-text)',
                          cursor: 'pointer',
                        }}
                      >
                        Revoke share
                      </button>
                    </div>{' '}
                    <div
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <button
                        type="button"
                        disabled=""
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '11px 18px',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '14px',
                          fontWeight: '600',
                          lineHeight: '1',
                          borderRadius: '8px',
                          border: '1px solid transparent',
                          background: 'var(--bg-well)',
                          color: 'var(--text-secondary)',
                          cursor: 'not-allowed',
                        }}
                      >
                        Delete forever
                      </button>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>System-managed folder</span>
                    </div>{' '}
                    <div
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Icon only</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>必须有无障碍标签</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)', display: 'flex', gap: '8px' }}>
                      <DS.IconButton name="more-horizontal" label="More" />
                      <DS.IconButton name="x" label="Close" variant="ghost" />
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)', display: 'flex', gap: '8px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: '1px solid var(--text-primary)',
                          display: 'grid',
                          placeItems: 'center',
                          background: 'var(--hover)',
                        }}
                      >
                        <DS.Icon name="more-horizontal" size={16} />
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: '1px solid var(--rule)',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <DS.Icon name="inbox" size={16} />
                        <span
                          style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-6px',
                            fontSize: '10px',
                            fontWeight: '600',
                            padding: '2px 5px',
                            borderRadius: '999px',
                            background: 'var(--brand-mark)',
                            color: 'var(--ink)',
                            lineHeight: '1.2',
                          }}
                        >
                          99+
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>0 时隐藏</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.IconButton name="trash-2" label="Delete" disabled={true} />
                    </div>{' '}
                    <div
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Quick action</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>列表行内 · 需关注强调</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button variant="yellow" size="sm" {...v.sx?.b0}>
                        Confirm
                      </DS.Button>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button variant="secondary" size="sm" ground={v.ground}>
                        Resolve
                      </DS.Button>
                    </div>{' '}
                    <div
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px',
                          borderRadius: '10px',
                          background: 'var(--bg-sunk)',
                          maxWidth: '140px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span style={{ fontSize: '12px', padding: '0 4px', whiteSpace: 'nowrap' }}>Confirm?</span>
                        <DS.Button size="sm" ground={v.ground}>
                          Yes
                        </DS.Button>
                        <DS.Button variant="ghost" size="sm" ground={v.ground}>
                          No
                        </DS.Button>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>二次确认原位展开</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button variant="yellow" size="sm" disabled={true}>
                        Confirm
                      </DS.Button>
                    </div>{' '}
                    <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Toggle</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>星标 · 不触发外层</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <DS.Icon name="star" size={16} />
                      <span style={{ fontSize: '12px' }}>未激活 · 行悬停时出现</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          display: 'grid',
                          placeItems: 'center',
                          background: 'var(--hover)',
                        }}
                      >
                        <DS.Icon name="star" size={16} />
                      </div>
                    </div>{' '}
                    <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                        <DS.Icon name="star" size={16} color="var(--brand-mark)" />
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>已激活 · 常显</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0' }} />{' '}
                  </div>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
                  {' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>异步状态 · 可点击试用</h3>{' '}
                    <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      默认 → 进行中（锁宽、不可重复点击）→ 成功（1.6 秒确认后复原）或失败（原位说明 + 重试）。“进行中”与“不可用”是两种状态。
                    </div>{' '}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
                      {' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                        {' '}
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>会成功</span>{' '}
                        {v.aIdle ? (
                          <>
                            <DS.Button ground={v.ground} onClick={v.runA} {...v.sx?.b1}>
                              Publish
                            </DS.Button>
                          </>
                        ) : null}{' '}
                        {v.aBusy ? (
                          <>
                            <DS.Button ground={v.ground} {...v.sx?.b2}>
                              {show(v.spinner)}Publishing
                            </DS.Button>
                          </>
                        ) : null}{' '}
                        {v.aDone ? (
                          <>
                            <DS.Button variant="secondary" ground={v.ground} {...v.sx?.b1}>
                              <DS.Icon name="check" size={15} />
                              Published
                            </DS.Button>
                          </>
                        ) : null}{' '}
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                        {' '}
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>会失败</span>{' '}
                        {v.bIdle ? (
                          <>
                            <DS.Button variant="secondary" ground={v.ground} onClick={v.runB} {...v.sx?.b1}>
                              Send invite
                            </DS.Button>
                          </>
                        ) : null}{' '}
                        {v.bBusy ? (
                          <>
                            <DS.Button variant="secondary" ground={v.ground} {...v.sx?.b2}>
                              {show(v.spinner)}Sending
                            </DS.Button>
                          </>
                        ) : null}{' '}
                        {v.bFail ? (
                          <>
                            {' '}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                              {' '}
                              <DS.Button variant="secondary" ground={v.ground} onClick={v.retryB} {...v.sx?.b3}>
                                <DS.Icon name="rotate-ccw" size={15} />
                                Retry
                              </DS.Button>{' '}
                              <span style={{ fontSize: '12px', color: 'var(--status-error-text)' }}>
                                Couldn't reach the mail server.
                              </span>{' '}
                            </div>{' '}
                          </>
                        ) : null}{' '}
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>规则</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', lineHeight: '1.6' }}>
                      {' '}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ color: 'var(--text-secondary)', flex: 'none' }}>·</span>
                        <span>文案为动词 + 宾语，句首大写：Publish register，不用 OK。</span>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ color: 'var(--text-secondary)', flex: 'none' }}>·</span>
                        <span>行内快捷操作凡是改数据，都原位展开二次确认；对话框里的按钮直接生效。</span>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ color: 'var(--text-secondary)', flex: 'none' }}>·</span>
                        <span>嵌在可点击卡片或行里的按钮、星标，阻止事件冒泡，不触发“打开”。</span>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ color: 'var(--text-secondary)', flex: 'none' }}>·</span>
                        <span>快捷键提示放在按钮尾部；按钮宽度不因状态切换而变化。</span>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ color: 'var(--text-secondary)', flex: 'none' }}>·</span>
                        <span>悬停只加深一级，不上浮、不放大、没有阴影。焦点是 2px 墨色环，偏移 3px。</span>
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s03 ? (
            <>
              <section
                id="s03"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    03 / 文本输入 · P0 · 需求 4.2
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    输入框下沉到亚麻底色，聚焦时出现墨色边
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    所有输入共享标签、说明、错误、前后缀、只读和无边框形态。搜索框与复制框升级为独立组件，页面不再各自实现防抖。
                  </p>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
                  {' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>单行输入 · 状态</h3>{' '}
                    <DS.Input label="Folder name" placeholder="e.g. Due diligence" hint="Shown to everyone with access." />{' '}
                    <DS.Input label="Custom domain" defaultValue="portal.halden" suffix=".co" />{' '}
                    <DS.Input label="Recipient email" defaultValue="anna.k@harbour" invalid={true} hint="Add the domain, e.g. harbour.vc" />{' '}
                    <DS.Input label="Workspace ID" defaultValue="ws_7Hq2mR" readOnly={true} hint="Read-only" />{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>验证码 · 6 位</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {' '}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        Enter the code sent to li.wei@halden.co
                      </span>{' '}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {' '}
                        <div
                          style={{
                            width: '44px',
                            height: '52px',
                            borderRadius: '8px',
                            background: 'var(--bg-sunk)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '22px',
                            fontWeight: '500',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          4
                        </div>{' '}
                        <div
                          style={{
                            width: '44px',
                            height: '52px',
                            borderRadius: '8px',
                            background: 'var(--bg-sunk)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '22px',
                            fontWeight: '500',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          8
                        </div>{' '}
                        <div
                          style={{
                            width: '44px',
                            height: '52px',
                            borderRadius: '8px',
                            background: 'var(--bg-sunk)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '22px',
                            fontWeight: '500',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          2
                        </div>{' '}
                        <div
                          style={{
                            width: '44px',
                            height: '52px',
                            borderRadius: '8px',
                            background: 'var(--bg-page)',
                            boxShadow: 'inset 0 0 0 1.5px var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '22px',
                            fontWeight: '500',
                          }}
                        >
                          <span style={{ width: '1.5px', height: '22px', background: 'var(--text-primary)' }} />
                        </div>{' '}
                        <div style={{ width: '44px', height: '52px', borderRadius: '8px', background: 'var(--bg-sunk)' }} />{' '}
                        <div style={{ width: '44px', height: '52px', borderRadius: '8px', background: 'var(--bg-sunk)' }} />{' '}
                      </div>{' '}
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        粘贴 6 位自动分格并提交 · 可 48 秒后重新发送
                      </span>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {' '}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>错误</span>{' '}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {' '}
                        <div
                          style={{
                            width: '44px',
                            height: '52px',
                            borderRadius: '8px',
                            background: 'var(--status-error-wash)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '22px',
                            fontWeight: '500',
                            color: 'var(--ink)',
                          }}
                        >
                          1
                        </div>{' '}
                        <div
                          style={{
                            width: '44px',
                            height: '52px',
                            borderRadius: '8px',
                            background: 'var(--status-error-wash)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '22px',
                            fontWeight: '500',
                            color: 'var(--ink)',
                          }}
                        >
                          0
                        </div>{' '}
                        <div
                          style={{
                            width: '44px',
                            height: '52px',
                            borderRadius: '8px',
                            background: 'var(--status-error-wash)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '22px',
                            fontWeight: '500',
                            color: 'var(--ink)',
                          }}
                        >
                          9
                        </div>{' '}
                        <div
                          style={{
                            width: '44px',
                            height: '52px',
                            borderRadius: '8px',
                            background: 'var(--status-error-wash)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '22px',
                            fontWeight: '500',
                            color: 'var(--ink)',
                          }}
                        >
                          3
                        </div>{' '}
                        <div
                          style={{
                            width: '44px',
                            height: '52px',
                            borderRadius: '8px',
                            background: 'var(--status-error-wash)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '22px',
                            fontWeight: '500',
                            color: 'var(--ink)',
                          }}
                        >
                          3
                        </div>{' '}
                        <div
                          style={{
                            width: '44px',
                            height: '52px',
                            borderRadius: '8px',
                            background: 'var(--status-error-wash)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '22px',
                            fontWeight: '500',
                            color: 'var(--ink)',
                          }}
                        >
                          1
                        </div>{' '}
                      </div>{' '}
                      <span style={{ fontSize: '12px', color: 'var(--status-error-text)' }}>
                        That code has expired. Send a new one.
                      </span>{' '}
                    </div>{' '}
                    <DS.Input label="Password" type="password" defaultValue="correct-horse" suffix="Show" />{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>搜索框 · 四个状态</h3>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        background: 'var(--bg-sunk)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <DS.Icon name="search" size={15} />
                      <span style={{ fontSize: '14px', flex: '1' }}>Search this folder</span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '500',
                          padding: '2px 5px',
                          borderRadius: '4px',
                          border: '1px solid var(--rule)',
                        }}
                      >
                        /
                      </span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        background: 'var(--bg-page)',
                        boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="search" size={15} />
                      <span style={{ fontSize: '14px', flex: '1' }}>季度报告</span>
                      <span style={{ display: 'inline-flex', color: 'var(--text-secondary)' }}>{show(v.spinner)}</span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        background: 'var(--bg-page)',
                        boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="search" size={15} />
                      <span style={{ fontSize: '14px', flex: '1' }}>季度报告</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>14 results</span>
                      <DS.Icon name="x" size={15} />
                    </div>{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      内置 250ms 防抖；新输入取消上一次请求；搜索中显示转圈而非“无结果”；快捷键 / 或 ⌘K 聚焦。
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>复制框 · 可点击</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {' '}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Share link</span>{' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '38px',
                          padding: '0 4px 0 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                        }}
                      >
                        {' '}
                        <span
                          style={{
                            fontSize: '13px',
                            flex: '1',
                            minWidth: '0',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          https://portal.halden.co/s/8fK2-q1Lm-ZpR7
                        </span>{' '}
                        <button
                          type="button"
                          onClick={v.copy}
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
                            fontFamily: 'var(--font-sans)',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            minWidth: '78px',
                            justifyContent: 'center',
                          }}
                        >
                          <DS.Icon name={v.copyIcon} size={14} />
                          {show(v.copyLabel)}
                        </button>{' '}
                      </div>{' '}
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        复制失败时自动选中文本，提示 Press ⌘C to copy。
                      </span>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {' '}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        @mention input · Comments
                      </span>{' '}
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          padding: '12px',
                          borderRadius: '8px',
                          background: 'var(--bg-page)',
                          boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                        }}
                      >
                        {' '}
                        <span style={{ fontSize: '14px', lineHeight: '1.6' }}>
                          {'Can you confirm page 4 before Friday, '}
                          <span
                            style={{
                              fontWeight: '500',
                              padding: '0 2px',
                              borderRadius: '4px',
                              background: 'var(--yellow-light)',
                              color: 'var(--ink)',
                            }}
                          >
                            @Wei
                          </span>
                          |
                        </span>{' '}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>⌘Enter to send</span>
                          <DS.Button size="sm" ground={v.ground}>
                            Send
                          </DS.Button>
                        </div>{' '}
                        <div
                          style={{
                            position: 'absolute',
                            left: '60px',
                            top: '40px',
                            width: '240px',
                            background: 'var(--bg-page)',
                            border: '1px solid var(--rule)',
                            borderRadius: '12px',
                            padding: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            zIndex: '2',
                          }}
                        >
                          {' '}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '7px 8px',
                              borderRadius: '8px',
                              background: 'var(--brand-field)',
                              color: 'var(--ink)',
                            }}
                          >
                            <span
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '999px',
                                background: 'var(--ink)',
                                color: 'var(--linen)',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: '10px',
                                fontWeight: '600',
                              }}
                            >
                              WL
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>Wei Li</span>
                            <span style={{ marginLeft: 'auto', fontSize: '11px' }}>Member</span>
                          </div>{' '}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 8px', borderRadius: '8px' }}>
                            <span
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '999px',
                                background: 'var(--bg-well)',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: '10px',
                                fontWeight: '600',
                              }}
                            >
                              WZ
                            </span>
                            <span style={{ fontSize: '13px' }}>王志远</span>
                            <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-secondary)' }}>Customer</span>
                          </div>{' '}
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s04 ? (
            <>
              <section
                id="s04"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    04 / 选择控件与日期 · P0 / P1 · 需求 4.3–4.4
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    选中项永远是品牌色底，“正在输入”与“已选定”外观不同
                  </h2>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
                  {' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>下拉选择 · 可搜索</h3>{' '}
                    <DS.Select options={v.sortOptions} value={v.sortValue} onChange={v.setSort} />{' '}
                    <DS.Select options={v.docTypes} placeholder="Document type" searchable={true} />{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      弹层脱离容器渲染，不被对话框裁切；空间不足向上展开；方向键、Home/End、首字母跳转；支持分组、禁用项、描述文字。
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>异步搜索选择 · 单选</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {' '}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>正在输入</span>{' '}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'var(--bg-page)',
                          border: '1px solid var(--rule)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        {' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            height: '38px',
                            padding: '0 12px',
                            borderBottom: '1px solid var(--rule)',
                          }}
                        >
                          <DS.Icon name="search" size={15} />
                          <span style={{ fontSize: '14px' }}>Hard</span>
                        </div>{' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 12px',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                          }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>Harbour Ventures</span>
                          <span style={{ marginLeft: 'auto', fontSize: '12px' }}>Customer · 3 projects</span>
                        </div>{' '}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px' }}>
                          <span style={{ fontSize: '13px' }}>Hardwick Family Office</span>
                          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>Customer</span>
                        </div>{' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderTop: '1px solid var(--rule-soft)',
                          }}
                        >
                          <DS.Icon name="plus" size={14} />
                          <span style={{ fontSize: '13px' }}>Create “Hard”</span>
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {' '}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        已选定 · 变为可清除卡片
                      </span>{' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 8px 8px 10px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                        }}
                      >
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: 'var(--ink)',
                            color: 'var(--linen)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          HV
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.3' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>Harbour Ventures</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Customer · 3 projects</span>
                        </div>
                        <span style={{ marginLeft: 'auto' }}>
                          <DS.IconButton name="x" label="Clear" variant="ghost" size={28} />
                        </span>
                      </div>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span>加载中 · 转圈</span>
                      <span>无结果 · Nothing matches “Hard”.</span>
                      <span>错误 · Retry</span>
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>异步搜索选择 · 多选 · To 样式</h3>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '6px',
                        minHeight: '38px',
                        padding: '5px 8px',
                        borderRadius: '8px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      {' '}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', paddingRight: '4px' }}>
                        To
                      </span>{' '}
                      {list(v.chips).map((c$, $i) => {
                        const s1 = { ...v, c: c$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            {' '}
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                height: '26px',
                                padding: '0 4px 0 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: s1.c?.bg,
                                color: s1.c?.fg,
                                boxShadow: s1.c?.ring,
                              }}
                            >
                              {show(s1.c?.label)}
                              <button
                                type="button"
                                onClick={s1.c?.remove}
                                aria-label="Remove"
                                style={{
                                  display: 'grid',
                                  placeItems: 'center',
                                  width: '18px',
                                  height: '18px',
                                  border: 'none',
                                  borderRadius: '4px',
                                  background: 'transparent',
                                  color: 'inherit',
                                  cursor: 'pointer',
                                  padding: '0',
                                }}
                              >
                                <DS.Icon name="x" size={12} />
                              </button>
                            </span>{' '}
                          </Fragment>
                        );
                      })}{' '}
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '4px' }}>
                        Add people or paste emails
                      </span>{' '}
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        fontSize: '12px',
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span>无效邮箱为红色描边，点击可原地修改；待验证为虚线描边。</span>
                      <span>空输入时 Backspace 删除最后一个；粘贴多个邮箱自动拆分。</span>
                    </div>{' '}
                    {v.chipsReset ? (
                      <>
                        <button
                          type="button"
                          onClick={v.resetChips}
                          style={{
                            alignSelf: 'flex-start',
                            border: 'none',
                            background: 'none',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: 'var(--text-primary)',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            padding: '0',
                          }}
                        >
                          Reset example
                        </button>
                      </>
                    ) : null}{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>勾选、单选、开关</h3>{' '}
                    <DS.Checkbox
                      checked={v.cb1}
                      onChange={v.setCb1}
                      label="Can download"
                      description="Recipients can save originals without a watermark."
                    />{' '}
                    <DS.Checkbox checked={false} disabled={true} label="Can forward" description="Turned off by the upstream share." />{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        paddingTop: '4px',
                        borderTop: '1px solid var(--rule-soft)',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Auto trigger</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Run when new documents arrive. Updates optimistically, rolls back on failure.
                        </span>
                      </div>
                      <DS.Switch checked={v.sw1} onChange={v.setSw1} />
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Dropbox sync</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Only admins can change this.</span>
                      </div>
                      <DS.Switch checked={false} disabled={true} />
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>分段控件 · 可点击</h3>{' '}
                    <div
                      role="radiogroup"
                      style={{
                        display: 'inline-flex',
                        alignSelf: 'flex-start',
                        gap: '2px',
                        padding: '3px',
                        borderRadius: '10px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      {' '}
                      {list(v.segs).map((s$, $i) => {
                        const s2 = { ...v, s: s$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            {' '}
                            <button
                              type="button"
                              role="radio"
                              onClick={s2.s?.pick}
                              disabled={s2.s?.disabled}
                              title={s2.s?.title}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                height: '30px',
                                padding: '0 12px',
                                border: 'none',
                                borderRadius: '8px',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                background: s2.s?.bg,
                                color: s2.s?.fg,
                              }}
                            >
                              <DS.Icon name={s2.s?.icon} size={14} />
                              {show(s2.s?.label)}
                            </button>{' '}
                          </Fragment>
                        );
                      })}{' '}
                    </div>{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      单选语义，方向键切换；选中项为品牌色底，选中项滑动而非闪现。禁用项悬停显示原因（Map · Needs at least one party）。
                    </div>{' '}
                    <h3 style={{ margin: '8px 0 0', fontSize: '16px', fontWeight: '500' }}>选择卡片</h3>{' '}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {' '}
                      <button
                        type="button"
                        onClick={v.pickPerson}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          textAlign: 'left',
                          padding: '14px',
                          borderRadius: '12px',
                          fontFamily: 'var(--font-sans-cjk)',
                          cursor: 'pointer',
                          border: v.personBorder,
                          background: v.personBg,
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Add a person</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>An applicant, dependant or signatory.</span>
                      </button>{' '}
                      <button
                        type="button"
                        onClick={v.pickOrg}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          textAlign: 'left',
                          padding: '14px',
                          borderRadius: '12px',
                          fontFamily: 'var(--font-sans-cjk)',
                          cursor: 'pointer',
                          border: v.orgBorder,
                          background: v.orgBg,
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Add an organisation</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>An employer, sponsor or fund.</span>
                      </button>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>日期 · 新增 · P1</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Share expires</span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '38px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-page)',
                          boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                        }}
                      >
                        <span style={{ fontSize: '14px', flex: '1', fontVariantNumeric: 'tabular-nums' }}>31 Oct 2026</span>
                        <DS.Icon name="calendar" size={15} />
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        background: 'var(--bg-page)',
                        border: '1px solid var(--rule)',
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>October 2026</span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          <DS.IconButton name="chevron-left" label="Previous month" variant="ghost" size={26} />
                          <DS.IconButton name="chevron-right" label="Next month" variant="ghost" size={26} />
                        </div>
                      </div>{' '}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(7, 1fr)',
                          gap: '2px',
                          textAlign: 'center',
                          fontSize: '12px',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {' '}
                        {list(v.calDays).map((d$, $i) => {
                          const s3 = { ...v, d: d$, $index: $i };
                          return (
                            <Fragment key={$i}>
                              <span
                                style={{
                                  height: '28px',
                                  display: 'grid',
                                  placeItems: 'center',
                                  borderRadius: '6px',
                                  background: s3.d?.bg,
                                  color: s3.d?.fg,
                                  fontWeight: s3.d?.w,
                                }}
                              >
                                {show(s3.d?.n)}
                              </span>
                            </Fragment>
                          );
                        })}{' '}
                      </div>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Date of entry · fuzzy</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <div
                          style={{
                            flex: '1',
                            height: '38px',
                            padding: '0 12px',
                            borderRadius: '8px',
                            background: 'var(--bg-sunk)',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '14px',
                          }}
                        >
                          2019-03
                        </div>
                        <div
                          style={{ display: 'inline-flex', gap: '2px', padding: '3px', borderRadius: '10px', background: 'var(--bg-sunk)' }}
                        >
                          <span
                            style={{
                              padding: '0 8px',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            Day
                          </span>
                          <span
                            style={{
                              padding: '0 8px',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '12px',
                              fontWeight: '500',
                              borderRadius: '8px',
                              background: 'var(--brand-field)',
                              color: 'var(--ink)',
                            }}
                          >
                            Month
                          </span>
                          <span
                            style={{
                              padding: '0 8px',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            Year
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        可键入 12/03/2019、2019-03-12、12 Mar 2019。无法解析时提示格式，不阻止保存。
                      </span>
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s05 ? (
            <>
              <section
                id="s05"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    05 / 上传与进度 · P0 · 需求 4.5
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    整个窗口都是落点，上传卡片完成后原位变成真实卡片
                  </h2>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>空闲</span>{' '}
                    <div
                      style={{
                        height: '150px',
                        borderRadius: '16px',
                        border: '1.5px dashed var(--rule)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'var(--bg-page)',
                      }}
                    >
                      <DS.Icon name="upload" size={20} />
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>Drop files or folders</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {'or '}
                        <span style={{ textDecoration: 'underline' }}>choose files</span>
                        {' · up to 2 GB each'}
                      </span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      拖入窗口 · 显示可落区域
                    </span>{' '}
                    <div
                      style={{
                        height: '150px',
                        borderRadius: '16px',
                        border: '1.5px dashed var(--text-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'var(--yellow-12)',
                      }}
                    >
                      <DS.Icon name="upload" size={20} />
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>Drop here</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Folders in the tree also accept files</span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>悬停在此区域</span>{' '}
                    <div
                      style={{
                        height: '150px',
                        borderRadius: '16px',
                        border: '1.5px solid var(--ink)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'var(--brand-field)',
                        color: 'var(--ink)',
                      }}
                    >
                      <DS.Icon name="arrow-down-to-line" size={20} />
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>Release to upload to Due diligence</span>
                      <span style={{ fontSize: '12px', color: 'rgba(17,17,17,.7)' }}>3 files · 1 folder</span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>紧凑 · 列表视图</span>{' '}
                    <div
                      style={{
                        height: '44px',
                        borderRadius: '8px',
                        border: '1.5px dashed var(--rule)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'var(--bg-page)',
                      }}
                    >
                      <DS.Icon name="upload" size={15} />
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Drop files or choose</span>
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
                  {' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>上传前检查 · 文件夹</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '13px' }}>
                      {' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                        <span
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            background: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <span style={{ width: '8px', height: '2px', background: 'var(--bg-page)' }} />
                        </span>
                        <DS.Icon name="folder" size={15} />
                        <span style={{ fontWeight: '500' }}>2026 Q3 尽调材料</span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>41 of 44</span>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0 6px 24px' }}>
                        <span
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            background: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            color: 'var(--bg-page)',
                          }}
                        >
                          <DS.Icon name="check" size={12} />
                        </span>
                        <DS.Icon name="folder" size={15} />
                        <span>财务报表 Financials</span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>18</span>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0 6px 24px' }}>
                        <span style={{ width: '16px', height: '16px', borderRadius: '4px', boxShadow: 'inset 0 0 0 1px var(--rule)' }} />
                        <DS.Icon name="folder" size={15} />
                        <span style={{ color: 'var(--text-secondary)' }}>.cache</span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>unticked</span>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0 6px 24px' }}>
                        <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--bg-well)' }} />
                        <DS.Icon name="file-x" size={15} />
                        <span style={{ color: 'var(--text-secondary)' }}>installer.exe</span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--status-error-text)' }}>Unsupported type</span>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0 6px 24px' }}>
                        <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--bg-well)' }} />
                        <DS.Icon name="folder" size={15} />
                        <span style={{ color: 'var(--text-secondary)' }}>a / b / c / d / e / f / g</span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--status-error-text)' }}>Nested too deep</span>
                      </div>{' '}
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--rule-soft)',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>41 files · 318 MB · 3 won't upload</span>
                      <DS.Button size="sm" ground={v.ground}>
                        Upload 41 files
                      </DS.Button>
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '500' }}>上传行 · 四种状态</h3>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <DS.Icon name="file-text" size={16} />
                      <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Shareholder agreement 股东协议 v3.pdf
                          </span>
                          <span
                            style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', flex: 'none', paddingLeft: '8px' }}
                          >
                            62%
                          </span>
                        </div>
                        <div style={{ height: '4px', borderRadius: '999px', background: 'var(--bg-well)', overflow: 'hidden' }}>
                          <div style={{ width: '62%', height: '100%', background: 'var(--text-primary)' }} />
                        </div>
                      </div>
                      <DS.IconButton name="x" label="Cancel upload" variant="ghost" size={28} />
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <DS.Icon name="file-spreadsheet" size={16} />
                      <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span>Cap table.xlsx</span>
                          <span style={{ color: 'var(--text-secondary)' }}>Retrying in 5 s</span>
                        </div>
                        <div style={{ height: '4px', borderRadius: '999px', background: 'var(--bg-well)', overflow: 'hidden' }}>
                          <div style={{ width: '30%', height: '100%', background: 'var(--text-secondary)' }} />
                        </div>
                      </div>
                      <DS.IconButton name="x" label="Cancel upload" variant="ghost" size={28} />
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        margin: '4px -12px',
                        borderRadius: '8px',
                        background: 'var(--status-error-wash)',
                        color: 'var(--ink)',
                      }}
                    >
                      <DS.Icon name="file-warning" size={16} />
                      <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px' }}>Board minutes 2025.docx</span>
                        <span style={{ fontSize: '12px' }}>Upload failed. The connection dropped.</span>
                      </div>
                      <DS.Button variant="secondary" size="sm">
                        Retry
                      </DS.Button>
                      <DS.Button variant="ghost" size="sm">
                        Dismiss
                      </DS.Button>
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
                      <DS.Icon name="folder-up" size={16} />
                      <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span>2026 Q3 尽调材料</span>
                          <span style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>28 / 41 · 1 failed</span>
                        </div>
                        <div style={{ display: 'flex', gap: '3px', height: '4px' }}>
                          <div style={{ flex: '28', borderRadius: '999px', background: 'var(--text-primary)' }} />
                          <div style={{ flex: '1', borderRadius: '999px', background: 'var(--status-error)' }} />
                          <div style={{ flex: '12', borderRadius: '999px', background: 'var(--bg-well)' }} />
                        </div>
                      </div>
                    </div>{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)', paddingTop: '8px' }}>
                      上传中关闭页面会提示离开；刷新后批次仍在。文件夹卡片先是不可点击的占位，再进入“N / M · K failed”跟踪阶段。
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '18px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>进度条 · 一个组件三种形态</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>确定 · Determinate</span>
                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>1.2 of 3.4 MB</span>
                      </div>
                      <div style={{ height: '6px', borderRadius: '999px', background: 'var(--bg-well)', overflow: 'hidden' }}>
                        <div style={{ width: '36%', height: '100%', borderRadius: '999px', background: 'var(--text-primary)' }} />
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>不确定 · Indeterminate</span>
                        <span>Preparing download</span>
                      </div>
                      {show(v.indeterminate)}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>分段 · Segmented</span>
                        <span>Batch 3 of 5</span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', height: '6px' }}>
                        <div style={{ flex: '1', borderRadius: '999px', background: 'var(--text-primary)' }} />
                        <div style={{ flex: '1', borderRadius: '999px', background: 'var(--text-primary)' }} />
                        <div style={{ flex: '1', borderRadius: '999px', background: 'var(--brand-mark)' }} />
                        <div style={{ flex: '1', borderRadius: '999px', background: 'var(--bg-well)' }} />
                        <div style={{ flex: '1', borderRadius: '999px', background: 'var(--bg-well)' }} />
                      </div>
                    </div>{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      已完成为墨色，当前段为品牌色，失败段为红。进度文字总在，屏幕阅读器按 25% 步进播报。
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s06 ? (
            <>
              <section
                id="s06"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    06 / 徽章、后台任务与同步 · P0 · 需求 5.3–5.4
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    一套徽章，两种密度：完整文字，或圆点 + 悬停说明
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    列表行只显示圆点时，行内仍保留状态文字给屏幕阅读器，并在悬停时显示原文，避免只靠颜色传达状态。格式、来源、权限这类属性用标签（亚麻底），不用状态色。
                  </p>{' '}
                </div>{' '}
                <div style={{ background: 'var(--bg-page)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '8px 24px' }}>
                  {' '}
                  {list(v.badgeGroups).map((g$, $i) => {
                    const s4 = { ...v, g: g$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        {' '}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '180px minmax(0, 1fr) 150px',
                            gap: '16px',
                            alignItems: 'center',
                            padding: '14px 0',
                            borderBottom: '1px solid var(--rule-soft)',
                          }}
                        >
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>{show(s4.g?.name)}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s4.g?.where)}</span>
                          </div>{' '}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {' '}
                            {list(s4.g?.items).map((b$, $i) => {
                              const s5 = { ...s4, b: b$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  {' '}
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      lineHeight: '1',
                                      whiteSpace: 'nowrap',
                                      padding: s5.b?.pad,
                                      borderRadius: '6px',
                                      background: s5.b?.bg,
                                      color: s5.b?.fg,
                                      boxShadow: s5.b?.ring,
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '999px',
                                        background: s5.b?.dot,
                                        display: s5.b?.dotDisplay,
                                      }}
                                    />
                                    {show(s5.b?.label)}
                                  </span>{' '}
                                </Fragment>
                              );
                            })}{' '}
                          </div>{' '}
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {' '}
                            {list(s4.g?.dots).map((d$, $i) => {
                              const s6 = { ...s4, d: d$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  <span
                                    title={s6.d?.label}
                                    style={{
                                      width: '9px',
                                      height: '9px',
                                      borderRadius: '999px',
                                      background: s6.d?.dot,
                                      boxShadow: s6.d?.ring,
                                    }}
                                  />
                                </Fragment>
                              );
                            })}{' '}
                          </div>{' '}
                        </div>{' '}
                      </Fragment>
                    );
                  })}{' '}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '180px minmax(0, 1fr) 150px',
                      gap: '16px',
                      padding: '12px 0',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span />
                    <span>完整密度</span>
                    <span>圆点密度（行内）</span>
                  </div>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
                  {' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>全局同步状态 · 圆点 + 详情</h3>{' '}
                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', fontWeight: '500' }}>
                      {' '}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                        In sync
                      </span>{' '}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>{show(v.pulseDot)}Syncing</span>{' '}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--status-error)' }} />
                        Sync error
                      </span>{' '}
                    </div>{' '}
                    <div
                      style={{
                        border: '1px solid var(--rule)',
                        borderRadius: '16px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        background: 'var(--bg-page)',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Importing 2 batches</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Updated just now</span>
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span>2026 Q3 尽调材料 · 41 files</span>
                          <span style={{ color: 'var(--text-secondary)' }}>OCR</span>
                        </div>{' '}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                          <div style={{ height: '4px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                          <div style={{ height: '4px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                          <div style={{ height: '4px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                          <div style={{ height: '4px', borderRadius: '999px', background: 'var(--brand-mark)' }} />
                          <div style={{ height: '4px', borderRadius: '999px', background: 'var(--bg-well)' }} />
                        </div>{' '}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: '4px',
                            fontSize: '11px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <span>Upload</span>
                          <span>Scan</span>
                          <span>Index</span>
                          <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>OCR</span>
                          <span>Ready</span>
                        </div>
                      </div>{' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: 'var(--status-error-wash)',
                          color: 'var(--ink)',
                          fontSize: '12px',
                        }}
                      >
                        <span style={{ flex: '1' }}>Dropbox · Harbour mirror stopped after an error.</span>
                        <DS.Button variant="secondary" size="sm">
                          Retry
                        </DS.Button>
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Dropbox 同步说明行</h3>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      {show(v.pulseDot)}
                      <span>Syncing · 6,831 items · ~5,209 left · 90 skipped</span>
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--status-error)' }} />
                      <span>Retrying after an error · attempt 3</span>
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '999px', boxShadow: 'inset 0 0 0 1.5px var(--grey)' }} />
                      <span>Paused by Wei Li</span>
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--grey)' }} />
                      <span>Unlinked · the files stay, sync has stopped</span>
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                      <span>Last synced 4 minutes ago</span>
                    </div>{' '}
                    <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--rule-soft)' }}>
                      {' '}
                      <div
                        style={{
                          width: '150px',
                          height: '110px',
                          borderRadius: '12px',
                          border: '1.5px dashed var(--rule)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          gap: '4px',
                          padding: '12px',
                          boxSizing: 'border-box',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <DS.Icon name="cloud-off" size={16} />
                        <span
                          style={{
                            fontSize: '13px',
                            lineHeight: '1.4',
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 'none',
                          }}
                        >
                          Site video.mov
                        </span>
                        <span style={{ fontSize: '12px' }}>Not synced · too large</span>
                      </div>{' '}
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)', alignSelf: 'flex-end' }}>
                        跳过的条目以虚线卡片出现在它本该在的文件夹里，点击查看原因。
                      </span>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>多阶段任务进度 · 不是百分比</h3>{' '}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '6px' }}>
                      {' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ height: '4px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>Documents</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Done</span>
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ height: '4px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>People</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Done</span>
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ height: '4px', borderRadius: '999px', background: 'var(--brand-mark)' }} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>Facts</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Batch 2 of 4</span>
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ height: '4px', borderRadius: '999px', background: 'var(--bg-well)' }} />
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Assessment</span>
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ height: '4px', borderRadius: '999px', background: 'var(--bg-well)' }} />
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Report</span>
                      </div>{' '}
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'var(--ink)',
                          color: 'var(--yellow-accent)',
                        }}
                      >
                        <DS.Icon name="sparkles" size={14} />
                      </span>
                      <span style={{ fontSize: '13px', flex: '1' }}>Agent · running</span>
                      {show(v.pulseDot)}
                    </div>{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      Agent 入口在运行时圆点缓慢明暗变化；开启“减少动态效果”时改为静止的品牌色点。
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s07 ? (
            <>
              <section
                id="s07"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    07 / 页面级状态 · P0 · 需求 5.2
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>每个状态一句话 + 一个动作</h2>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>骨架 · 列表</span>{' '}
                    {list(v.skel).map((k$, $i) => {
                      const s7 = { ...v, k: k$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--bg-well)' }} />
                            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ height: '10px', borderRadius: '4px', background: 'var(--bg-well)', width: s7.k?.w }} />
                              <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-sunk)', width: '40%' }} />
                            </div>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>骨架 · 卡片</span>{' '}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ aspectRatio: '4 / 3', borderRadius: '10px', background: 'var(--bg-well)' }} />
                        <div style={{ height: '10px', width: '80%', borderRadius: '4px', background: 'var(--bg-well)' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ aspectRatio: '4 / 3', borderRadius: '10px', background: 'var(--bg-well)' }} />
                        <div style={{ height: '10px', width: '60%', borderRadius: '4px', background: 'var(--bg-well)' }} />
                      </div>
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      骨架 · 查看器 · 长等待换文案
                    </span>{' '}
                    <div
                      style={{
                        flex: '1',
                        minHeight: '110px',
                        borderRadius: '10px',
                        background: 'var(--bg-sunk)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <div style={{ width: '70px', height: '90px', borderRadius: '4px', background: 'var(--bg-page)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Opening… → Rendering page 1…</span>
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {' '}
                  {list(v.empties).map((e$, $i) => {
                    const s8 = { ...v, e: e$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        {' '}
                        <div
                          style={{
                            background: 'var(--bg-page)',
                            border: '1px solid var(--rule)',
                            borderRadius: '16px',
                            padding: '28px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            alignItems: 'flex-start',
                          }}
                        >
                          {' '}
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                            {show(s8.e?.kind)}
                          </span>{' '}
                          <span style={{ fontSize: '16px', fontWeight: '500', paddingTop: '8px' }}>{show(s8.e?.title)}</span>{' '}
                          <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(s8.e?.body)}</span>{' '}
                          <span
                            style={{
                              marginTop: '8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              height: '32px',
                              padding: '0 12px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '600',
                              background: s8.e?.btnBg,
                              color: s8.e?.btnFg,
                              boxShadow: s8.e?.btnRing,
                            }}
                          >
                            {show(s8.e?.action)}
                          </span>{' '}
                        </div>{' '}
                      </Fragment>
                    );
                  })}{' '}
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      background: 'var(--brand-field)',
                      color: 'var(--ink)',
                    }}
                  >
                    <span style={{ display: 'inline-flex', color: 'var(--ink)' }}>{show(v.spinner)}</span>
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>Organising documents · 18 of 41 ready</span>
                      <span style={{ fontSize: '12px', color: 'rgba(17,17,17,.7)' }}>
                        Edits made now may be overwritten when this finishes.
                      </span>
                    </div>
                    <div
                      style={{ width: '160px', height: '4px', borderRadius: '999px', background: 'rgba(17,17,17,.12)', overflow: 'hidden' }}
                    >
                      <div style={{ width: '44%', height: '100%', background: 'var(--ink)' }} />
                    </div>
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 18px',
                      borderRadius: '16px',
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                    }}
                  >
                    <DS.Icon name="info" size={16} />
                    <span style={{ fontSize: '13px', flex: '1' }}>
                      This document has 1,240 pages. Only the first 500 were processed for search and the Agent.
                    </span>
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 18px',
                      borderRadius: '16px',
                      background: 'var(--status-error-wash)',
                      color: 'var(--ink)',
                    }}
                  >
                    <DS.Icon name="refresh-cw" size={16} />
                    <span style={{ fontSize: '13px', flex: '1' }}>MetaRoom has been updated. Refresh to load this page.</span>
                    <DS.Button variant="ink" size="sm">
                      Refresh
                    </DS.Button>
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s08 ? (
            <>
              <section
                id="s08"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    08 / 即时反馈 · P0 · 需求 5.1
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    Toast 只报告页面之外的结果；危险操作用对话框确认
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    原来的独立错误通知器并入 Toast。同一错误 30 秒内只出现一次；默认 4 秒，带动作时 8 秒；右下角堆叠，最多 3 条。
                  </p>{' '}
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  {' '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      padding: '24px',
                      borderRadius: '16px',
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                    }}
                  >
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      Toast · info / success / error
                    </span>{' '}
                    <DS.Toast status="neutral" title="Link copied." />{' '}
                    <DS.Toast status="complete" title="3 files moved to Archive." action={v.undoAction} />{' '}
                    <DS.Toast status="error" title="Couldn't rename the folder." action={v.retryAction}>
                      A file with that name already exists.
                    </DS.Toast>{' '}
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      padding: '24px',
                      borderRadius: '16px',
                      background: 'var(--scrim)',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        background: 'var(--bg-page)',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                      }}
                    >
                      {' '}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        Type to confirm · revoke a forwarded share
                      </span>{' '}
                      <span style={{ fontSize: '18px', fontWeight: '500' }}>Revoke this share and 4 forwards?</span>{' '}
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        Anna Kowalski and the 4 people she forwarded it to lose access now. This can't be undone.
                      </span>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                          {'Type '}
                          <span style={{ color: 'var(--text-primary)' }}>revoke</span>
                          {' to confirm'}
                        </span>
                        <div
                          style={{
                            height: '38px',
                            borderRadius: '8px',
                            background: 'var(--bg-page)',
                            boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 12px',
                            fontSize: '14px',
                          }}
                        >
                          revo|
                        </div>
                      </div>{' '}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <DS.Button variant="ghost" size="sm" ground={v.ground}>
                          Cancel
                        </DS.Button>
                        <button
                          type="button"
                          disabled=""
                          style={{
                            height: '32px',
                            padding: '0 14px',
                            border: 'none',
                            borderRadius: '8px',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '13px',
                            fontWeight: '600',
                            background: 'var(--bg-well)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Revoke share
                        </button>
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      padding: '24px',
                      borderRadius: '16px',
                      background: 'var(--scrim)',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        background: 'var(--bg-page)',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                      }}
                    >
                      {' '}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Step-up verification</span>{' '}
                      <span style={{ fontSize: '18px', fontWeight: '500' }}>Confirm it's you</span>{' '}
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        Deleting a workspace needs a fresh check.
                      </span>{' '}
                      <div className="sc-host-x" style={{ width: '100%' }}>
                        <DS.Button ground={v.ground} {...v.sx?.b4}>
                          <DS.Icon name="fingerprint" size={16} />
                          Use passkey
                        </DS.Button>
                      </div>{' '}
                      <button
                        type="button"
                        style={{
                          alignSelf: 'center',
                          border: 'none',
                          background: 'none',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: 'var(--text-primary)',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        Use authenticator code instead
                      </button>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      padding: '24px',
                      borderRadius: '16px',
                      background: 'var(--scrim)',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        background: 'var(--bg-page)',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                      }}
                    >
                      {' '}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        Prompt dialog · rename
                      </span>{' '}
                      <span style={{ fontSize: '18px', fontWeight: '500' }}>Rename folder</span>{' '}
                      <DS.Input defaultValue="Financials / 财务" invalid={true} hint="Names can't contain /" />{' '}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <DS.Button variant="ghost" size="sm" ground={v.ground}>
                          Cancel
                        </DS.Button>
                        <DS.Button size="sm" ground={v.ground} disabled={true}>
                          Rename
                        </DS.Button>
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s09 ? (
            <>
              <section
                id="s09"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    09 / 浮层与操作面 · P0 · 需求 6
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    一个操作栏，一个右侧槽位，一套叠放顺序
                  </h2>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(540px, 1fr))', gap: '16px' }}>
                  {' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>浮动操作栏 · 点击切换模式</h3>{' '}
                      <div
                        style={{ display: 'inline-flex', gap: '2px', padding: '3px', borderRadius: '10px', background: 'var(--bg-sunk)' }}
                      >
                        <button
                          type="button"
                          onClick={v.abNormal}
                          style={{
                            height: '28px',
                            padding: '0 10px',
                            border: 'none',
                            borderRadius: '8px',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            background: v.abNormalBg,
                            color: 'var(--text-primary)',
                          }}
                        >
                          Nothing selected
                        </button>
                        <button
                          type="button"
                          onClick={v.abSelect}
                          style={{
                            height: '28px',
                            padding: '0 10px',
                            border: 'none',
                            borderRadius: '8px',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            background: v.abSelectBg,
                            color: 'var(--text-primary)',
                          }}
                        >
                          3 selected
                        </button>
                        <button
                          type="button"
                          onClick={v.abAdmin}
                          style={{
                            height: '28px',
                            padding: '0 10px',
                            border: 'none',
                            borderRadius: '8px',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            background: v.abAdminBg,
                            color: 'var(--text-primary)',
                          }}
                        >
                          Admin on
                        </button>
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        height: '200px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: '20px',
                        boxSizing: 'border-box',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        {' '}
                        {v.abIsAdmin ? (
                          <>
                            <div
                              style={{
                                display: 'flex',
                                gap: '2px',
                                padding: '4px',
                                borderRadius: '12px',
                                background: 'var(--ink-raised)',
                                color: 'var(--linen)',
                              }}
                            >
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  height: '32px',
                                  padding: '0 10px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                Access
                              </span>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  height: '32px',
                                  padding: '0 10px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                Activity
                              </span>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  height: '32px',
                                  padding: '0 10px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                History
                              </span>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  height: '32px',
                                  padding: '0 10px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                Update document
                              </span>
                            </div>
                          </>
                        ) : null}{' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            padding: '5px',
                            borderRadius: '14px',
                            background: 'var(--ink)',
                            color: 'var(--linen)',
                          }}
                        >
                          {' '}
                          <span
                            style={{
                              width: '14px',
                              height: '32px',
                              display: 'grid',
                              placeItems: 'center',
                              color: 'var(--grey-inverse)',
                              cursor: 'grab',
                            }}
                          >
                            <DS.Icon name="grip-vertical" size={14} />
                          </span>{' '}
                          {v.abIsSelect ? (
                            <>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  height: '32px',
                                  padding: '0 10px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: 'var(--yellow-accent)',
                                }}
                              >
                                3 selected
                              </span>
                            </>
                          ) : null}{' '}
                          {list(v.abItems).map((a$, $i) => {
                            const s9 = { ...v, a: a$, $index: $i };
                            return (
                              <Fragment key={$i}>
                                {' '}
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '7px',
                                    height: '32px',
                                    padding: '0 10px',
                                    borderRadius: '9px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    background: s9.a?.bg,
                                    color: s9.a?.fg,
                                  }}
                                >
                                  <DS.Icon name={s9.a?.icon} size={15} />
                                  {show(s9.a?.label)}
                                  <span style={{ fontSize: '11px', color: 'var(--grey-inverse)' }}>{show(s9.a?.key)}</span>
                                </span>{' '}
                              </Fragment>
                            );
                          })}{' '}
                          <span style={{ width: '1px', height: '20px', background: 'var(--rule-inverse)', margin: '0 4px' }} />{' '}
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                            }}
                          >
                            {show(v.pulseDot)}
                          </span>{' '}
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px 20px',
                        fontSize: '12px',
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {' '}
                      <span>墨底：在任何页面上都是最高对比的一条，品牌色只点亮激活项。</span>{' '}
                      <span>页面注册动作、离开页面自动撤回；无动作时不显示；签署和演示时强制隐藏。</span>{' '}
                      <span>左侧抓手拖动，双击复位；位置与折叠状态记住，窗口缩小时拉回视口内。</span>{' '}
                      <span>两个以上同类动作折叠为组；Esc 或外部点击关闭组。</span>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>叠放顺序 · 从上到下</h3>{' '}
                    {list(v.layers).map((l$, $i) => {
                      const s10 = { ...v, l: l$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          {' '}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: s10.l?.bg,
                            }}
                          >
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                width: '18px',
                                fontVariantNumeric: 'tabular-nums',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {show(s10.l?.n)}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '13px', fontWeight: '500' }}>{show(s10.l?.name)}</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s10.l?.rule)}</span>
                            </div>
                          </div>{' '}
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                </div>{' '}
                <div
                  style={{
                    background: 'var(--bg-page)',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>一条操作栏，按状态切换内容</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>客户门户与 Ops 共用</span>
                  </div>{' '}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                    {' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '18px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '999px',
                            background: 'var(--text-primary)',
                            color: 'var(--bg-page)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          1
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>空闲</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>页面注册的常驻动作</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        新建、上传、选择等，通常 3–4
                        项。全局开关（如主题）可以作为首项常驻。克制：只放这一页最常用、且没有更好位置的动作；属于单个条目的（星标、重命名）放在条目上。
                      </span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '18px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '999px',
                            background: 'var(--text-primary)',
                            color: 'var(--bg-page)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          2
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>选择</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>拖拽框选 · ⇧ 点击 · ⌘A</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        栏内换成已选数量、全选、分享、移动、删除、取消。只放对所有已选条目（包括文件夹）都成立的动作。选择清空后自动回到空闲。
                      </span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '18px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '999px',
                            background: 'var(--text-primary)',
                            color: 'var(--bg-page)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          3
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>模式</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>评论 · 演示 · 翻译</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        模式就是栏的一个状态：栏内换成模式名称、这个模式的动作和“完成”，不再另叠一条胶囊。演示时栏隐藏，Esc 退出。
                      </span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '18px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '999px',
                            background: 'var(--text-primary)',
                            color: 'var(--bg-page)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          4
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>溢出</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>超过 6 项</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        同类动作折成一组（如 更多 ▾），组内仍显示快捷键；⌘K 能搜到栏里的每个动作。
                      </span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    Esc 每次退回一个状态：模式 → 选择 → 空闲。页头只放标题与状态，不放动作按钮。快捷键在栏隐藏时也有效。示例见客户门户
                    03、04a。
                  </div>{' '}
                </div>{' '}
                <div
                  style={{
                    background: 'var(--bg-page)',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>操作栏 · 响应式与收起</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>全局组件 · 客户门户与 Ops 共用</span>
                  </div>{' '}
                  <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    空间变小时按顺序退让：先去掉快捷键，再去掉文字，最后收成左缘把手。栏里始终是同一组动作，只是呈现方式在变。
                  </span>{' '}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '220px minmax(0, 1fr)',
                      gap: '24px',
                      alignItems: 'center',
                      padding: '20px 0',
                      borderBottom: '1px solid var(--rule-soft)',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>≥ 1280</span>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>完整</span>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>图标 + 文字 + 快捷键。</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: '72px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                        boxSizing: 'border-box',
                        paddingTop: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          padding: '5px',
                          borderRadius: '14px',
                          background: 'var(--ink)',
                          color: 'var(--linen)',
                          whiteSpace: 'nowrap',
                          position: 'relative',
                        }}
                      >
                        <span
                          style={{ width: '14px', height: '32px', display: 'grid', placeItems: 'center', color: 'var(--grey-inverse)' }}
                        >
                          <DS.Icon name="grip-vertical" size={14} />
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            height: '32px',
                            padding: '0 11px',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          <DS.Icon name="plus" size={15} />
                          New<span style={{ fontSize: '11px', color: 'var(--grey-inverse)' }}>N</span>
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            height: '32px',
                            padding: '0 11px',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          <DS.Icon name="upload" size={15} />
                          Upload<span style={{ fontSize: '11px', color: 'var(--grey-inverse)' }}>U</span>
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            height: '32px',
                            padding: '0 11px',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          <DS.Icon name="square-check" size={15} />
                          Select<span style={{ fontSize: '11px', color: 'var(--grey-inverse)' }}>S</span>
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            height: '32px',
                            padding: '0 11px',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          <DS.Icon name="message-square" size={15} />
                          Comment<span style={{ fontSize: '11px', color: 'var(--grey-inverse)' }}>C</span>
                        </span>
                        <span style={{ width: '1px', height: '20px', background: 'var(--rule-inverse)', margin: '0 4px' }} />
                        <span
                          title="Collapse"
                          style={{ width: '30px', height: '32px', display: 'grid', placeItems: 'center', color: 'var(--grey-inverse)' }}
                        >
                          <DS.Icon name="chevrons-left" size={15} />
                        </span>
                      </div>
                    </div>
                  </div>{' '}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '220px minmax(0, 1fr)',
                      gap: '24px',
                      alignItems: 'center',
                      padding: '20px 0',
                      borderBottom: '1px solid var(--rule-soft)',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>1024 – 1279</span>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>去掉快捷键</span>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        快捷键仍然有效，悬停时在提示里显示。
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: '72px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                        boxSizing: 'border-box',
                        paddingTop: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          padding: '5px',
                          borderRadius: '14px',
                          background: 'var(--ink)',
                          color: 'var(--linen)',
                          whiteSpace: 'nowrap',
                          position: 'relative',
                        }}
                      >
                        <span
                          style={{ width: '14px', height: '32px', display: 'grid', placeItems: 'center', color: 'var(--grey-inverse)' }}
                        >
                          <DS.Icon name="grip-vertical" size={14} />
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            height: '32px',
                            padding: '0 10px',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          <DS.Icon name="plus" size={15} />
                          New
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            height: '32px',
                            padding: '0 10px',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          <DS.Icon name="upload" size={15} />
                          Upload
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            height: '32px',
                            padding: '0 10px',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          <DS.Icon name="square-check" size={15} />
                          Select
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            height: '32px',
                            padding: '0 10px',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          <DS.Icon name="message-square" size={15} />
                          Comment
                        </span>
                        <span style={{ width: '1px', height: '20px', background: 'var(--rule-inverse)', margin: '0 4px' }} />
                        <span
                          title="Collapse"
                          style={{ width: '30px', height: '32px', display: 'grid', placeItems: 'center', color: 'var(--grey-inverse)' }}
                        >
                          <DS.Icon name="chevrons-left" size={15} />
                        </span>
                      </div>
                    </div>
                  </div>{' '}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '220px minmax(0, 1fr)',
                      gap: '24px',
                      alignItems: 'center',
                      padding: '20px 0',
                      borderBottom: '1px solid var(--rule-soft)',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>768 – 1023</span>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>只留图标</span>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        悬停或聚焦时显示名称和快捷键。图标必须有无障碍标签。
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: '72px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                        boxSizing: 'border-box',
                        paddingTop: '44px',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          padding: '5px',
                          borderRadius: '14px',
                          background: 'var(--ink)',
                          color: 'var(--linen)',
                          whiteSpace: 'nowrap',
                          position: 'relative',
                        }}
                      >
                        <span
                          style={{ width: '14px', height: '32px', display: 'grid', placeItems: 'center', color: 'var(--grey-inverse)' }}
                        >
                          <DS.Icon name="grip-vertical" size={14} />
                        </span>
                        <span
                          style={{
                            position: 'relative',
                            width: '36px',
                            height: '32px',
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '9px',
                            background: 'transparent',
                          }}
                        >
                          <DS.Icon name="plus" size={15} />
                        </span>
                        <span
                          style={{
                            position: 'relative',
                            width: '36px',
                            height: '32px',
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '9px',
                            background: 'var(--ink-raised)',
                          }}
                        >
                          <DS.Icon name="upload" size={15} />
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '42px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              background: 'var(--bg-page)',
                              color: 'var(--text-primary)',
                              boxShadow: '0 0 0 1px var(--rule)',
                              fontSize: '12px',
                              fontWeight: '500',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Upload · U
                          </span>
                        </span>
                        <span
                          style={{
                            position: 'relative',
                            width: '36px',
                            height: '32px',
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '9px',
                            background: 'transparent',
                          }}
                        >
                          <DS.Icon name="square-check" size={15} />
                        </span>
                        <span
                          style={{
                            position: 'relative',
                            width: '36px',
                            height: '32px',
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '9px',
                            background: 'transparent',
                          }}
                        >
                          <DS.Icon name="message-square" size={15} />
                        </span>
                        <span style={{ width: '1px', height: '20px', background: 'var(--rule-inverse)', margin: '0 4px' }} />
                        <span
                          title="Collapse"
                          style={{ width: '30px', height: '32px', display: 'grid', placeItems: 'center', color: 'var(--grey-inverse)' }}
                        >
                          <DS.Icon name="chevrons-left" size={15} />
                        </span>
                      </div>
                    </div>
                  </div>{' '}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '220px minmax(0, 1fr)',
                      gap: '24px',
                      alignItems: 'center',
                      padding: '20px 0',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>{'< 768 或手动收起'}</span>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>左缘把手</span>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        点把手展开为完整栏；手机上展开为底部横条。
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: '72px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                        boxSizing: 'border-box',
                        paddingTop: '12px',
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div
                            style={{
                              position: 'relative',
                              height: '96px',
                              borderRadius: '12px',
                              background: 'var(--bg-page)',
                              boxShadow: 'inset 0 0 0 1px var(--rule-soft)',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                left: '0',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '24px',
                                height: '56px',
                                borderRadius: '0 12px 12px 0',
                                background: 'var(--ink)',
                                color: 'var(--grey-inverse)',
                                display: 'grid',
                                placeItems: 'center',
                              }}
                            >
                              <DS.Icon name="chevron-right" size={14} />
                            </div>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>空闲 · 收起</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div
                            style={{
                              position: 'relative',
                              height: '96px',
                              borderRadius: '12px',
                              background: 'var(--bg-page)',
                              boxShadow: 'inset 0 0 0 1px var(--rule-soft)',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                left: '0',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '24px',
                                height: '56px',
                                borderRadius: '0 12px 12px 0',
                                background: 'var(--ink)',
                                color: 'var(--grey-inverse)',
                                display: 'grid',
                                placeItems: 'center',
                              }}
                            >
                              <DS.Icon name="chevron-right" size={14} />
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '-4px',
                                  right: '-6px',
                                  width: '9px',
                                  height: '9px',
                                  borderRadius: '999px',
                                  background: 'var(--brand-mark)',
                                  boxShadow: '0 0 0 2px var(--bg-page)',
                                }}
                              />
                            </div>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>后台任务运行中 · 把手带状态点</span>
                        </div>
                      </div>
                    </div>
                  </div>{' '}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '16px 24px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--rule)',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>收起与展开</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        点栏尾的 « 或把栏拖到左缘即收起；点把手或按 \ 展开。拖动位置和收起状态都会记住。
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>默认状态</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        第一次进入时展开，并提示一次可以收起；之后按用户的选择。查看器、签署、演示默认收起。
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>状态切换时</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        进入选择或模式状态时自动展开；结束后回到用户原来的收起或展开状态。
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>收起时</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        快捷键照常可用；有后台任务或 Agent 运行时，把手上显示状态点。
                      </span>
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  {' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>下拉菜单 · 分组、快捷键、嵌套、危险项</h3>{' '}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      {' '}
                      <div
                        style={{
                          width: '230px',
                          background: 'var(--bg-page)',
                          border: '1px solid var(--rule)',
                          borderRadius: '12px',
                          padding: '6px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1px',
                        }}
                      >
                        {' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px',
                            borderRadius: '8px',
                            fontSize: '13px',
                          }}
                        >
                          <DS.Icon name="user" size={15} />
                          Preferences<span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-secondary)' }}>⌘,</span>
                        </div>{' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            background: 'var(--hover)',
                          }}
                        >
                          <DS.Icon name="repeat" size={15} />
                          Switch workspace
                          <span style={{ marginLeft: 'auto', display: 'inline-flex' }}>
                            <DS.Icon name="chevron-right" size={14} />
                          </span>
                        </div>{' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <DS.Icon name="settings" size={15} />
                          Workspace admin<span style={{ marginLeft: 'auto', fontSize: '11px' }}>Admins only</span>
                        </div>{' '}
                        <div style={{ height: '1px', background: 'var(--rule-soft)', margin: '4px 0' }} />{' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            color: 'var(--status-error-text)',
                          }}
                        >
                          <DS.Icon name="log-out" size={15} />
                          Sign out
                        </div>{' '}
                      </div>{' '}
                      <div
                        style={{
                          width: '210px',
                          marginTop: '44px',
                          background: 'var(--bg-page)',
                          border: '1px solid var(--rule)',
                          borderRadius: '12px',
                          padding: '6px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1px',
                        }}
                      >
                        {' '}
                        <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', padding: '6px 8px 4px' }}>
                          Customer
                        </div>{' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '7px 8px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                          }}
                        >
                          <span
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '5px',
                              background: 'var(--ink)',
                              color: 'var(--linen)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '10px',
                              fontWeight: '600',
                            }}
                          >
                            H
                          </span>
                          Halden Capital
                        </div>{' '}
                        <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', padding: '8px 8px 4px' }}>
                          Member
                        </div>{' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '7px 8px',
                            borderRadius: '8px',
                            fontSize: '13px',
                          }}
                        >
                          <span
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '5px',
                              background: 'var(--bg-well)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '10px',
                              fontWeight: '600',
                            }}
                          >
                            C
                          </span>
                          COSX Advisory
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      切换工作区时按身份分组：同一个人在一处是客户、在另一处是成员，切换即切换产品面。右键菜单（P2）与操作栏内容一致。
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>命令面板 · ⌘K</h3>{' '}
                    <div
                      style={{ border: '1px solid var(--rule)', borderRadius: '16px', overflow: 'hidden', background: 'var(--bg-page)' }}
                    >
                      {' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          height: '48px',
                          padding: '0 16px',
                          borderBottom: '1px solid var(--rule)',
                        }}
                      >
                        <DS.Icon name="search" size={16} />
                        <span style={{ fontSize: '15px', flex: '1' }}>cap table</span>
                        <span style={{ display: 'inline-flex', color: 'var(--text-secondary)' }}>{show(v.spinner)}</span>
                      </div>{' '}
                      <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        {' '}
                        <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', padding: '6px 10px 4px' }}>
                          Documents · titles
                        </div>{' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                          }}
                        >
                          <DS.Icon name="file-spreadsheet" size={15} />
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>Cap table.xlsx</span>
                          <span style={{ marginLeft: 'auto', fontSize: '12px' }}>Series A / Legal</span>
                        </div>{' '}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px' }}>
                          <DS.Icon name="file-text" size={15} />
                          <span style={{ fontSize: '13px' }}>Cap table summary 股权结构.pdf</span>
                        </div>{' '}
                        <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', padding: '8px 10px 4px' }}>
                          Full text · arriving
                        </div>{' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '8px 10px', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                            <span>Shareholder agreement v3.pdf</span>
                            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>p. 14</span>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {'…the '}
                            <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>cap table</span>
                            {' attached as Schedule 2 reflects…'}
                          </span>
                        </div>{' '}
                        <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', padding: '8px 10px 4px' }}>
                          Actions
                        </div>{' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '13px',
                          }}
                        >
                          <DS.Icon name="sparkles" size={15} />
                          Ask the Agent about “cap table”
                          <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-secondary)' }}>I</span>
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      标题匹配即时出现，全文结果随后到达并带页码与摘录。搜索中显示转圈，全部请求返回前不显示“无结果”。
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>侧面板 · 右侧槽位</h3>{' '}
                    <div
                      style={{
                        border: '1px solid var(--rule)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'var(--bg-page)',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 16px 0' }}>
                        <span style={{ fontSize: '15px', fontWeight: '500', flex: '1' }}>Share · Cap table.xlsx</span>
                        <DS.IconButton name="x" label="Close" variant="ghost" size={28} />
                      </div>{' '}
                      <div style={{ padding: '0 16px' }}>
                        <DS.Tabs items={v.panelTabs} value="Invite" />
                      </div>{' '}
                      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {' '}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                            }}
                          >
                            AK
                          </span>
                          <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '13px' }}>Anna Kowalski</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>View · comment</span>
                          </div>
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              background: 'var(--brand-mark)',
                              color: 'var(--ink)',
                            }}
                          >
                            Pending
                          </span>
                        </div>{' '}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                            }}
                          >
                            王
                          </span>
                          <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '13px' }}>王志远</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>View · download</span>
                          </div>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                            Accepted
                          </span>
                        </div>{' '}
                      </div>{' '}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: '8px',
                          padding: '12px 16px',
                          borderTop: '1px solid var(--rule)',
                        }}
                      >
                        <DS.Button size="sm" ground={v.ground}>
                          New share
                        </DS.Button>
                      </div>{' '}
                    </div>{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      宽度三档：360 / 480 / 640。无遮罩、不锁焦点，推开内容；Esc 关闭。与 Agent
                      抽屉共用一个槽位，同时只开一个。手机上变为全屏推入页。
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>对话框 · 尺寸与手机三种呈现</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40%', height: '14px', borderRadius: '4px', background: 'var(--bg-well)' }} />
                        <span style={{ fontSize: '12px' }}>S · 400 · 确认</span>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '56%', height: '14px', borderRadius: '4px', background: 'var(--bg-well)' }} />
                        <span style={{ fontSize: '12px' }}>M · 560 · 表单</span>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '80%', height: '14px', borderRadius: '4px', background: 'var(--bg-well)' }} />
                        <span style={{ fontSize: '12px' }}>L · 800 · 向导</span>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '100%', height: '14px', borderRadius: '4px', background: 'var(--bg-well)', display: 'flex' }}>
                          <div style={{ width: '40%', height: '100%', borderRadius: '4px', background: 'var(--text-secondary)' }} />
                        </div>
                        <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Split · 1120</span>
                      </div>{' '}
                    </div>{' '}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', paddingTop: '6px' }}>
                      {' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '72px',
                            height: '136px',
                            borderRadius: '12px',
                            background: 'var(--scrim)',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px',
                            boxSizing: 'border-box',
                          }}
                        >
                          <div style={{ width: '100%', height: '44px', borderRadius: '6px', background: 'var(--bg-page)' }} />
                        </div>
                        <span style={{ fontSize: '12px' }}>居中 · 确认</span>
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '72px',
                            height: '136px',
                            borderRadius: '12px',
                            background: 'var(--bg-page)',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '8px',
                            boxSizing: 'border-box',
                          }}
                        >
                          <div style={{ height: '6px', width: '50%', borderRadius: '2px', background: 'var(--text-secondary)' }} />
                          <div style={{ height: '12px', borderRadius: '3px', background: 'var(--bg-well)' }} />
                          <div style={{ height: '12px', borderRadius: '3px', background: 'var(--bg-well)' }} />
                          <div style={{ flex: '1' }} />
                          <div style={{ height: '12px', borderRadius: '3px', background: 'var(--text-primary)' }} />
                        </div>
                        <span style={{ fontSize: '12px' }}>全屏推入 · 长表单</span>
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '72px',
                            height: '136px',
                            borderRadius: '12px',
                            background: 'var(--scrim)',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            display: 'flex',
                            alignItems: 'flex-end',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: '60px',
                              borderRadius: '10px 10px 0 0',
                              background: 'var(--bg-page)',
                              display: 'flex',
                              justifyContent: 'center',
                              paddingTop: '5px',
                              boxSizing: 'border-box',
                            }}
                          >
                            <div style={{ width: '20px', height: '3px', borderRadius: '999px', background: 'var(--rule)' }} />
                          </div>
                        </div>
                        <span style={{ fontSize: '12px' }}>底部抽屉 · 轻选择</span>
                      </div>{' '}
                    </div>{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      必须有焦点陷阱、打开时初始焦点、关闭后焦点归还。嵌套确认按一次 Esc
                      只关自己。关闭对话框的点击不会被外层行当作“再次打开”。
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s10 ? (
            <>
              <section
                id="s10"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    10 / 数据展示 · P0 · 需求 7
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    文档库的卡片、行、树和工具栏，是所有列表的公共件
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    卡片内的复选框、星标、快捷按钮与拖拽手势都不会触发“打开”。选择模式下整张卡片就是复选框。
                  </p>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                  {' '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      border: '1px solid var(--rule)',
                      background: 'var(--bg-page)',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        aspectRatio: '4 / 3',
                        background: 'var(--bg-sunk)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingTop: '16px',
                        boxSizing: 'border-box',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          width: '62%',
                          height: '88%',
                          background: 'var(--paper)',
                          borderRadius: '4px 4px 0 0',
                          boxShadow: '0 0 0 1px var(--rule-soft)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '5px',
                          padding: '12px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div style={{ height: '5px', width: '60%', background: '#D9D6D0', borderRadius: '2px' }} />
                        <div style={{ height: '3px', background: '#E8E5DF', borderRadius: '2px' }} />
                        <div style={{ height: '3px', background: '#E8E5DF', borderRadius: '2px' }} />
                        <div style={{ height: '3px', width: '80%', background: '#E8E5DF', borderRadius: '2px' }} />
                      </div>
                      <span style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--text-primary)' }}>
                        <DS.Icon name="star" size={15} />
                      </span>
                    </div>{' '}
                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          display: '-webkit-box',
                          WebkitLineClamp: '2',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        Shareholder agreement 股东协议 v3
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span
                          style={{
                            fontWeight: '600',
                            padding: '2px 5px',
                            borderRadius: '4px',
                            background: 'var(--bg-sunk)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          PDF
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                          Signed
                        </span>
                        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <DS.Icon name="message-square" size={12} />4
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Updated 2 hours ago</span>
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      border: '1px solid var(--rule)',
                      background: 'var(--bg-page)',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        aspectRatio: '4 / 3',
                        background: 'var(--bg-sunk)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span style={{ display: 'inline-flex' }}>{show(v.spinner)}</span>
                      <span style={{ fontSize: '12px' }}>Converting to PDF</span>
                    </div>{' '}
                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Board minutes 2025</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                        <span style={{ fontWeight: '600', padding: '2px 5px', borderRadius: '4px', background: 'var(--bg-sunk)' }}>
                          Word
                        </span>
                        <span
                          style={{
                            fontWeight: '600',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                          }}
                        >
                          Converting
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Added just now</span>
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      border: '1px solid var(--rule)',
                      background: 'var(--bg-page)',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        aspectRatio: '4 / 3',
                        background: 'var(--status-error-wash)',
                        color: 'var(--ink)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <DS.Icon name="file-x" size={20} />
                      <span style={{ fontSize: '12px', fontWeight: '500' }}>Render failed</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>Re-render</span>
                    </div>{' '}
                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Site plan.dwg</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                        <span
                          style={{
                            fontWeight: '600',
                            padding: '2px 5px',
                            borderRadius: '4px',
                            background: 'var(--status-error)',
                            color: '#fff',
                          }}
                        >
                          Render failed
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>in Harbour / Site / 2026</span>
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      border: '1px solid var(--rule)',
                      background: 'var(--bg-page)',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        aspectRatio: '4 / 3',
                        background: 'var(--bg-sunk)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <DS.Icon name="folder-sync" size={36} />
                      <span
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '3px 6px',
                          borderRadius: '5px',
                          background: 'var(--bg-page)',
                        }}
                      >
                        {show(v.pulseDot)}Dropbox
                      </span>
                    </div>{' '}
                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Harbour mirror</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>1,204 folders · syncing</span>
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      background: 'var(--bg-page)',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 0 0 2px var(--text-primary)',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        aspectRatio: '4 / 3',
                        background: 'var(--brand-field)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        color: 'var(--ink)',
                      }}
                    >
                      <DS.Icon name="file-spreadsheet" size={36} />
                      <span
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '10px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          background: 'var(--ink)',
                          color: 'var(--linen)',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <DS.Icon name="check" size={13} />
                      </span>
                    </div>{' '}
                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Cap table.xlsx</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Selected · whole card toggles</span>
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      border: '1px dashed var(--rule)',
                      background: 'var(--bg-page)',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        aspectRatio: '4 / 3',
                        background: 'var(--bg-page)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DS.Icon name="link-2" size={28} />
                    </div>{' '}
                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Link · Term sheet</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Points to Legal / 2026 · Remove link</span>
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: '16px' }}>
                  {' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '20px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>列表工具栏 + 行</h3>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {' '}
                      <div
                        style={{
                          flex: '1',
                          minWidth: '200px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '36px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-page)',
                          boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                        }}
                      >
                        <DS.Icon name="search" size={15} />
                        <span style={{ fontSize: '13px' }}>agreement</span>
                      </div>{' '}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '36px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        Last updated
                        <DS.Icon name="chevron-down" size={14} />
                      </span>{' '}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '36px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          background: 'var(--brand-field)',
                          color: 'var(--ink)',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        Signed
                        <DS.Icon name="x" size={13} />
                      </span>{' '}
                      <div
                        style={{ display: 'inline-flex', gap: '2px', padding: '3px', borderRadius: '10px', background: 'var(--bg-sunk)' }}
                      >
                        <span style={{ width: '30px', height: '30px', display: 'grid', placeItems: 'center', borderRadius: '8px' }}>
                          <DS.Icon name="layout-grid" size={14} />
                        </span>
                        <span
                          style={{
                            width: '30px',
                            height: '30px',
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '8px',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                          }}
                        >
                          <DS.Icon name="list" size={14} />
                        </span>
                      </div>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span>
                        {'Searching this folder and its subfolders · '}
                        <span style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>This folder only</span>
                      </span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>2 folders · 14 documents · more below</span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {' '}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '24px minmax(0, 1fr) 110px 120px 60px',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '8px 8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'var(--text-secondary)',
                          borderBottom: '1px solid var(--rule)',
                        }}
                      >
                        <span />
                        <span>Name</span>
                        <span>State</span>
                        <span>Updated</span>
                        <span />
                      </div>{' '}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '24px minmax(0, 1fr) 110px 120px 60px',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '10px 8px',
                          borderBottom: '1px solid var(--rule-soft)',
                          fontSize: '13px',
                        }}
                      >
                        <DS.Icon name="file-text" size={16} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Shareholder agreement 股东协议 v3.pdf
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                          Signed
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>2 hours ago</span>
                        <span style={{ display: 'inline-flex', gap: '8px', color: 'var(--text-secondary)', justifyContent: 'flex-end' }}>
                          <DS.Icon name="star" size={14} />
                        </span>
                      </div>{' '}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '24px minmax(0, 1fr) 110px 120px 60px',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '10px 8px',
                          borderBottom: '1px solid var(--rule-soft)',
                          fontSize: '13px',
                          background: 'var(--yellow-12)',
                        }}
                      >
                        <DS.Icon name="file-lock" size={16} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Loan agreement.pdf</span>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: '4px 7px',
                            borderRadius: '6px',
                            background: 'var(--brand-mark)',
                            color: 'var(--ink)',
                            justifySelf: 'start',
                          }}
                        >
                          Password
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>in Legal / 2026</span>
                        <span style={{ display: 'inline-flex', justifyContent: 'flex-end' }}>
                          <DS.IconButton name="more-horizontal" label="More" variant="ghost" size={26} />
                        </span>
                      </div>{' '}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '24px minmax(0, 1fr) 110px 120px 60px',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '10px 8px',
                          fontSize: '13px',
                        }}
                      >
                        <DS.Icon name="mail" size={16} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Re: Side letter comments from Harbour Ventures legal team.eml
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '999px',
                              boxShadow: 'inset 0 0 0 1.5px var(--text-primary)',
                            }}
                          />
                          Indexing
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>5 minutes ago</span>
                        <span />
                      </div>{' '}
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '4px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      无限滚动提前 200px 触发 · 千级条目启用虚拟滚动
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '20px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0 8px 4px', fontSize: '16px', fontWeight: '500' }}>文件夹树</h3>{' '}
                    {list(v.tree).map((n$, $i) => {
                      const s11 = { ...v, n: n$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          {' '}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              height: '32px',
                              paddingLeft: s11.n?.indent,
                              paddingRight: '8px',
                              borderRadius: '8px',
                              background: s11.n?.bg,
                              boxShadow: s11.n?.ring,
                              color: s11.n?.fg,
                            }}
                          >
                            {' '}
                            <span
                              style={{
                                width: '20px',
                                height: '20px',
                                display: 'grid',
                                placeItems: 'center',
                                opacity: s11.n?.chevOpacity,
                                transform: s11.n?.chevRot,
                              }}
                            >
                              <DS.Icon name="chevron-right" size={13} />
                            </span>{' '}
                            <DS.Icon name={s11.n?.icon} size={15} />{' '}
                            <span
                              style={{
                                fontSize: '13px',
                                fontWeight: s11.n?.weight,
                                paddingLeft: '6px',
                                flex: '1',
                                minWidth: '0',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {show(s11.n?.label)}
                            </span>{' '}
                            <span style={{ fontSize: '11px', color: s11.n?.metaFg }}>{show(s11.n?.meta)}</span>{' '}
                          </div>{' '}
                        </Fragment>
                      );
                    })}{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)', padding: '6px 8px 0' }}>
                      箭头与名称分开点击；进入文件夹自动展开祖先链；拖入时节点变为落点；懒加载，支持部分勾选。
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  {' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>面包屑 · 超过 4 段中间折叠</h3>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '5px',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '10px',
                            fontWeight: '600',
                          }}
                        >
                          <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: v.logoDisplay }} />
                          <span style={{ display: v.initialDisplay }}>{show(v.brandInitial)}</span>
                        </span>
                        {show(v.brandName)}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>/</span>
                      <span style={{ padding: '1px 6px', borderRadius: '5px', background: 'var(--hover)' }}>…</span>
                      <span style={{ color: 'var(--text-secondary)' }}>/</span>
                      <span>Legal</span>
                      <span style={{ color: 'var(--text-secondary)' }}>/</span>
                      <span style={{ fontWeight: '500' }}>Shareholder agreement v3</span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '2px 5px',
                          borderRadius: '4px',
                          background: 'var(--bg-sunk)',
                        }}
                      >
                        PDF
                      </span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span style={{ width: '7px', height: '7px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                        Signed
                      </span>
                    </div>{' '}
                    <h3 style={{ margin: '8px 0 0', fontSize: '16px', fontWeight: '500' }}>页面头部卡片 · 7 合 1</h3>{' '}
                    <div
                      style={{
                        borderRadius: '16px',
                        background: 'var(--bg-sunk)',
                        padding: '20px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        alignItems: 'flex-end',
                      }}
                    >
                      {' '}
                      <div style={{ flex: '1', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Project · Series A</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '22px', fontWeight: '500' }}>Harbour data room</span>
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              padding: '4px 7px',
                              borderRadius: '6px',
                              boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                            }}
                          >
                            Due diligence
                          </span>
                        </div>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {show(v.pulseDot)}Syncing · 6,831 items · ~5,209 left
                        </span>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '22px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>214</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Documents</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '22px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>38</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Folders</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '22px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>12</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Viewers</span>
                        </div>
                      </div>{' '}
                    </div>{' '}
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      可配置：眉题、标题、状态、统计、说明行、右侧动作。手机上隐藏统计。
                    </span>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>步骤指示 · 四种状态</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {' '}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '999px',
                              background: 'var(--text-primary)',
                              color: 'var(--bg-page)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="check" size={12} />
                          </span>
                          <span style={{ width: '1px', flex: '1', minHeight: '18px', background: 'var(--rule)' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '14px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>Fill in investor form</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Done 22 Sep</span>
                        </div>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '999px',
                              background: 'var(--brand-mark)',
                              color: 'var(--ink)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '11px',
                              fontWeight: '600',
                            }}
                          >
                            2
                          </span>
                          <span style={{ width: '1px', flex: '1', minHeight: '18px', background: 'var(--rule)' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '14px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>Sign the NDA</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Current step</span>
                        </div>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '999px',
                              boxShadow: 'inset 0 0 0 1px var(--rule)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '11px',
                              fontWeight: '600',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            3
                          </span>
                          <span style={{ width: '1px', flex: '1', minHeight: '18px', background: 'var(--rule)' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '14px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Open the data room</span>
                        </div>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              display: 'grid',
                              placeItems: 'center',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            <DS.Icon name="lock" size={11} />
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Financial model</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Blocked · opens at the Term sheet stage</span>
                        </div>
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>活动时间线 · 按时间分组</h3>{' '}
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
                          height: '26px',
                          padding: '0 10px',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '12px',
                          fontWeight: '500',
                          borderRadius: '8px',
                          background: 'var(--brand-field)',
                          color: 'var(--ink)',
                        }}
                      >
                        This share
                      </span>
                      <span
                        style={{
                          height: '26px',
                          padding: '0 10px',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        Whole chain
                      </span>
                    </div>{' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Today</span>{' '}
                    <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '999px',
                          background: 'var(--bg-well)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '10px',
                          fontWeight: '600',
                          flex: 'none',
                        }}
                      >
                        AK
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>
                          <span style={{ fontWeight: '500' }}>Anna Kowalski</span>
                          {' viewed Cap table.xlsx for 6 min'}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>14:02 · pages 2–4 most</span>
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '999px',
                          background: 'var(--bg-well)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '10px',
                          fontWeight: '600',
                          flex: 'none',
                        }}
                      >
                        AK
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>
                          <span style={{ fontWeight: '500' }}>Anna Kowalski</span>
                          {' forwarded to 4 people'}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>11:40</span>
                      </div>
                    </div>{' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Yesterday</span>{' '}
                    <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '999px',
                          background: 'var(--bg-well)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '10px',
                          fontWeight: '600',
                          flex: 'none',
                        }}
                      >
                        王
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>
                          <span style={{ fontWeight: '500' }}>王志远</span>
                          {' signed the NDA'}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>17:15</span>
                      </div>
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>表格 · 桌面与手机卡片</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px' }}>
                      {' '}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0, 1fr) 90px 90px 28px',
                          gap: '10px',
                          padding: '8px 0',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'var(--text-secondary)',
                          borderBottom: '1px solid var(--rule)',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)' }}>
                          Member
                          <DS.Icon name="arrow-down" size={12} />
                        </span>
                        <span>Role</span>
                        <span>Last active</span>
                        <span />
                      </div>{' '}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0, 1fr) 90px 90px 28px',
                          gap: '10px',
                          padding: '10px 0',
                          borderBottom: '1px solid var(--rule-soft)',
                          alignItems: 'center',
                        }}
                      >
                        <span>Wei Li</span>
                        <span>Admin</span>
                        <span style={{ color: 'var(--text-secondary)' }}>Now</span>
                        <DS.Icon name="more-horizontal" size={14} />
                      </div>{' '}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0, 1fr) 90px 90px 28px',
                          gap: '10px',
                          padding: '10px 0',
                          alignItems: 'center',
                        }}
                      >
                        <span>Sam Ortiz</span>
                        <span>Member</span>
                        <span style={{ color: 'var(--text-secondary)' }}>3 days ago</span>
                        <DS.Icon name="more-horizontal" size={14} />
                      </div>{' '}
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                        maxWidth: '280px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Wei Li</span>
                        <DS.Icon name="more-horizontal" size={14} />
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Admin · Active now</span>
                    </div>{' '}
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      手机上每行变为一张卡片：首列为标题，其余列合并为一行元信息。
                    </span>{' '}
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s11 ? (
            <>
              <section
                id="s11"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>11 / 手机端 · 需求 10.2</div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    手机上：一层内容，底部标签，触控目标不小于 44px
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    深层文件夹用逐级进入 + 顶部路径条返回。拖拽全部有替代：移动文件走 Move to…，看板换阶段走选择器。底部叠放从下到上：标签栏
                    → 模式胶囊 → Toast；操作栏收为左缘把手。
                  </p>{' '}
                </div>{' '}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                  {' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      文件夹逐级进入 · 客户门户标签
                    </span>{' '}
                    <div
                      style={{
                        width: '360px',
                        height: '740px',
                        borderRadius: '36px',
                        background: 'var(--bg-page)',
                        boxShadow: '0 0 0 1px var(--rule), 0 0 0 8px var(--bg-well)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                      }}
                    >
                      {' '}
                      <div style={{ height: '44px', flex: 'none' }} />{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px', height: '48px' }}>
                        <DS.IconButton name="chevron-left" label="Back" variant="ghost" size={44} />
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.25' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              color: 'var(--text-secondary)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Harbour data room / … / Legal
                          </span>
                          <span style={{ fontSize: '16px', fontWeight: '500' }}>Shareholder agreements</span>
                        </div>
                        <DS.IconButton name="more-horizontal" label="More" variant="ghost" size={44} />
                      </div>{' '}
                      <div style={{ padding: '4px 16px 10px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            height: '44px',
                            padding: '0 14px',
                            borderRadius: '10px',
                            background: 'var(--bg-sunk)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <DS.Icon name="search" size={16} />
                          <span style={{ fontSize: '15px' }}>Search this folder</span>
                        </div>
                      </div>{' '}
                      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '0 16px' }}>
                        {' '}
                        {list(v.phoneRows).map((r$, $i) => {
                          const s12 = { ...v, r: r$, $index: $i };
                          return (
                            <Fragment key={$i}>
                              {' '}
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  minHeight: '60px',
                                  borderBottom: '1px solid var(--rule-soft)',
                                }}
                              >
                                <span
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: 'var(--bg-sunk)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    flex: 'none',
                                  }}
                                >
                                  <DS.Icon name={s12.r?.icon} size={16} />
                                </span>
                                <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {show(s12.r?.name)}
                                  </span>
                                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s12.r?.meta)}</span>
                                </div>
                                <span style={{ color: 'var(--text-secondary)', display: s12.r?.chev }}>
                                  <DS.Icon name="chevron-right" size={16} />
                                </span>
                              </div>{' '}
                            </Fragment>
                          );
                        })}{' '}
                      </div>{' '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '0',
                          bottom: '110px',
                          width: '22px',
                          height: '56px',
                          borderRadius: '0 12px 12px 0',
                          background: 'var(--ink)',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'var(--grey-inverse)',
                        }}
                      >
                        <DS.Icon name="chevron-right" size={14} />
                      </div>{' '}
                      <div
                        style={{
                          flex: 'none',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(5, 1fr)',
                          padding: '6px 8px 26px',
                          borderTop: '1px solid var(--rule)',
                          background: 'var(--bg-page)',
                        }}
                      >
                        {' '}
                        {list(v.phoneTabs).map((t$, $i) => {
                          const s13 = { ...v, t: t$, $index: $i };
                          return (
                            <Fragment key={$i}>
                              {' '}
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
                                    width: '44px',
                                    height: '28px',
                                    borderRadius: '999px',
                                    display: 'grid',
                                    placeItems: 'center',
                                    background: s13.t?.bg,
                                    color: s13.t?.fg,
                                  }}
                                >
                                  <DS.Icon name={s13.t?.icon} size={18} />
                                </span>
                                <span style={{ fontSize: '11px', fontWeight: '500' }}>{show(s13.t?.label)}</span>
                              </div>{' '}
                            </Fragment>
                          );
                        })}{' '}
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>底部抽屉 · 更多</span>{' '}
                    <div
                      style={{
                        width: '360px',
                        height: '740px',
                        borderRadius: '36px',
                        background: 'var(--scrim)',
                        boxShadow: '0 0 0 1px var(--rule), 0 0 0 8px var(--bg-well)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {' '}
                      <div
                        style={{
                          background: 'var(--bg-page)',
                          borderRadius: '20px 20px 0 0',
                          padding: '8px 8px 30px',
                          display: 'flex',
                          flexDirection: 'column',
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
                        <div style={{ padding: '4px 12px 10px', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '16px', fontWeight: '500' }}>Cap table.xlsx</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Excel · 184 KB</span>
                        </div>{' '}
                        {list(v.sheetItems).map((i$, $i) => {
                          const s14 = { ...v, i: i$, $index: $i };
                          return (
                            <Fragment key={$i}>
                              {' '}
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '14px',
                                  minHeight: '52px',
                                  padding: '0 12px',
                                  borderRadius: '10px',
                                  fontSize: '15px',
                                  color: s14.i?.fg,
                                }}
                              >
                                <DS.Icon name={s14.i?.icon} size={18} />
                                {show(s14.i?.label)}
                              </div>{' '}
                            </Fragment>
                          );
                        })}{' '}
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>全屏推入 · 长表单</span>{' '}
                    <div
                      style={{
                        width: '360px',
                        height: '740px',
                        borderRadius: '36px',
                        background: 'var(--bg-page)',
                        boxShadow: '0 0 0 1px var(--rule), 0 0 0 8px var(--bg-well)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {' '}
                      <div style={{ height: '44px', flex: 'none' }} />{' '}
                      <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', height: '48px' }}
                      >
                        <DS.Button variant="ghost" ground={v.ground} {...v.sx?.b5}>
                          Cancel
                        </DS.Button>
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>Share 3 files</span>
                        <span style={{ width: '80px' }} />
                      </div>{' '}
                      <div style={{ flex: '1', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {' '}
                        <div
                          role="radiogroup"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '2px',
                            padding: '3px',
                            borderRadius: '12px',
                            background: 'var(--bg-sunk)',
                          }}
                        >
                          <span
                            style={{
                              height: '40px',
                              display: 'grid',
                              placeItems: 'center',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontWeight: '500',
                              background: 'var(--brand-field)',
                              color: 'var(--ink)',
                            }}
                          >
                            Invite by email
                          </span>
                          <span
                            style={{
                              height: '40px',
                              display: 'grid',
                              placeItems: 'center',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontWeight: '500',
                            }}
                          >
                            Public link
                          </span>
                        </div>{' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>To</span>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '6px',
                              minHeight: '44px',
                              padding: '8px',
                              borderRadius: '10px',
                              background: 'var(--bg-sunk)',
                              boxSizing: 'border-box',
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                height: '28px',
                                padding: '0 10px',
                                borderRadius: '6px',
                                background: 'var(--bg-page)',
                                boxShadow: 'inset 0 0 0 1px var(--rule)',
                                fontSize: '13px',
                              }}
                            >
                              anna.k@harbour.vc
                            </span>
                          </div>
                        </div>{' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {' '}
                          <DS.Checkbox checked={true} label="Can comment" /> <DS.Checkbox checked={false} label="Can download" />{' '}
                          <DS.Checkbox checked={true} label="Require NDA" description="Standard mutual NDA" />{' '}
                        </div>{' '}
                      </div>{' '}
                      <div style={{ padding: '12px 20px 30px', borderTop: '1px solid var(--rule)' }}>
                        <div className="sc-host-x" style={{ width: '100%' }}>
                          <DS.Button ground={v.ground} size="lg" {...v.sx?.b4}>
                            Send invite
                          </DS.Button>
                        </div>
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s12 ? (
            <>
              <section
                id="s12"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    12 / 中英文与截断 · 需求 10.4
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>同一组件，英文与中文界面各一份</h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    中文界面用 Noto Sans SC，字重 400/500，字距 0，正文字号 +1px、行高 1.8。拉丁字母与数字保持
                    Geist，自动加四分之一空格。按钮不做双语，按页面语言择一。
                  </p>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
                  {' '}
                  {list(v.langs).map((L$, $i) => {
                    const s15 = { ...v, L: L$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        {' '}
                        <div
                          lang={s15.L?.lang}
                          style={{
                            background: 'var(--bg-page)',
                            border: '1px solid var(--rule)',
                            borderRadius: '16px',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                          }}
                        >
                          {' '}
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                            {show(s15.L?.name)}
                          </span>{' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                              {show(s15.L?.eyebrow)}
                            </span>
                            <span style={{ fontSize: '22px', fontWeight: '500' }}>{show(s15.L?.title)}</span>
                          </div>{' '}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <DS.Button ground={s15.ground} size="sm">
                              {show(s15.L?.primary)}
                            </DS.Button>
                            <DS.Button variant="secondary" ground={s15.ground} size="sm">
                              {show(s15.L?.secondary)}
                            </DS.Button>
                          </div>{' '}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '5px 8px',
                                borderRadius: '6px',
                                background: 'var(--brand-mark)',
                                color: 'var(--ink)',
                              }}
                            >
                              {show(s15.L?.b1)}
                            </span>
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '4px 7px',
                                borderRadius: '6px',
                                boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                              }}
                            >
                              {show(s15.L?.b2)}
                            </span>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                              {show(s15.L?.b3)}
                            </span>
                          </div>{' '}
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              padding: '16px',
                              borderRadius: '12px',
                              background: 'var(--bg-sunk)',
                            }}
                          >
                            <span style={{ fontSize: '15px', fontWeight: '500' }}>{show(s15.L?.emptyTitle)}</span>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{show(s15.L?.emptyBody)}</span>
                          </div>{' '}
                        </div>{' '}
                      </Fragment>
                    );
                  })}{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      截断规则 · 截断后全文始终可达（悬停提示或展开）
                    </span>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>路径 · 中间折叠</span>
                      <span style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>Harbour data room / … / 2026 Q3 尽调材料 / 财务报表</span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>标题 · 尾部截断</span>
                      <span
                        style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px' }}
                      >
                        港岛东区商业综合体项目可行性研究报告（第三版修订稿）.pdf
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>卡片标题 · 两行后截断</span>
                      <span
                        style={{
                          fontSize: '13px',
                          display: '-webkit-box',
                          WebkitLineClamp: '2',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          maxWidth: '220px',
                        }}
                      >
                        港岛东区商业综合体项目可行性研究报告（第三版修订稿）Feasibility study v3
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>关系图标签 · 换行，最多三行</span>
                      <span
                        style={{
                          fontSize: '12px',
                          lineHeight: '1.4',
                          maxWidth: '120px',
                          textAlign: 'center',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          background: 'var(--bg-sunk)',
                        }}
                      >
                        配偶 Spouse
                        <br />
                        2014 – 至今
                        <br />6 facts
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>数字与日期</span>
                      <span style={{ fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}>
                        6,831 items · 24 Sep 2026 · 2026 年 9 月 24 日 · 5 minutes ago · 5 分钟前
                      </span>
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s13 ? (
            <>
              <section
                id="s13"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    13 / 布局与导航 · 已确定 1a + 2a · 需求 3.4
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    左边两列：图标栏放模块，上下文栏放当前这一层
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '44em' }}>
                    客户门户和 Ops 工作台用同一个外壳，差别只在图标栏里有哪些模块，以及上下文栏里放什么。组件：
                    <code style={{ fontSize: '13px' }}>Portal Rail</code>、<code style={{ fontSize: '13px' }}>Ops Rail</code>
                    {'。页面示例见 '}
                    <a href="../pages/MetaRoom Customer Portal.dc.html">客户门户</a>
                    {' 和 '}
                    <a href="../pages/MetaRoom Ops Workbench.dc.html">Ops 工作台</a>
                    {'，方案对比见 '}
                    <a href="MetaRoom Navigation.dc.html">Navigation</a>。
                  </p>{' '}
                </div>{' '}
                <div
                  style={{
                    background: 'var(--bg-page)',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {' '}
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>外壳结构</h3>{' '}
                  <div
                    style={{
                      display: 'flex',
                      height: '340px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 0 0 1px var(--rule)',
                      fontSize: '12px',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        width: '64px',
                        flex: 'none',
                        background: 'var(--bg-sunk)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '12px 0',
                        boxSizing: 'border-box',
                      }}
                    >
                      <span style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'var(--brand-field)' }} />
                      <span
                        style={{ width: '32px', height: '28px', borderRadius: '7px', background: 'var(--brand-field)', marginTop: '8px' }}
                      />
                      <span style={{ width: '32px', height: '28px', borderRadius: '7px', background: 'var(--bg-well)' }} />
                      <span style={{ width: '32px', height: '28px', borderRadius: '7px', background: 'var(--bg-well)' }} />
                      <span style={{ width: '32px', height: '28px', borderRadius: '7px', background: 'var(--bg-well)' }} />
                    </div>{' '}
                    <div
                      style={{
                        width: '220px',
                        flex: 'none',
                        borderRight: '1px solid var(--rule)',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <span style={{ fontWeight: '600' }}>上下文栏 · 248</span>
                      <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        当前模块的视图、列表或实体菜单。可收起，收起后悬停图标弹出。
                      </span>
                      <span style={{ height: '22px', borderRadius: '6px', background: 'var(--brand-field)', marginTop: '8px' }} />
                      <span style={{ height: '22px', borderRadius: '6px', background: 'var(--bg-sunk)' }} />
                      <span style={{ height: '22px', borderRadius: '6px', background: 'var(--bg-sunk)' }} />
                    </div>{' '}
                    <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                      {' '}
                      <div
                        style={{
                          height: '44px',
                          flex: 'none',
                          borderBottom: '1px solid var(--rule)',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 14px',
                          gap: '8px',
                        }}
                      >
                        <span style={{ fontWeight: '600' }}>顶栏 · 52</span>
                        <span style={{ color: 'var(--text-secondary)' }}>面包屑 · 收件箱 · 页面动作</span>
                      </div>{' '}
                      <div style={{ flex: '1', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontWeight: '600' }}>内容</span>
                        <span style={{ color: 'var(--text-secondary)' }}>最大宽度由页面决定；列表页铺满，阅读页 760 居中。</span>
                      </div>{' '}
                    </div>{' '}
                    <div
                      style={{
                        width: '200px',
                        flex: 'none',
                        borderLeft: '1.5px dashed var(--rule)',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        boxSizing: 'border-box',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <span style={{ fontWeight: '600' }}>右侧槽位 · 360 / 480 / 640</span>
                      <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>Agent 抽屉或侧面板，同时只开一个。</span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>图标栏 · 64</span>
                      {' 品牌方块、模块、底部 Agent 与头像'}
                    </span>
                    <span>两列合计 312px</span>
                  </div>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {' '}
                  {list(v.ctxKinds).map((k$, $i) => {
                    const s16 = { ...v, k: k$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        {' '}
                        <div
                          style={{
                            background: 'var(--bg-page)',
                            border: '1px solid var(--rule)',
                            borderRadius: '16px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                          }}
                        >
                          {' '}
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                            {'上下文栏 · '}
                            {show(s16.k?.kind)}
                          </span>{' '}
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(s16.k?.title)}</span>{' '}
                          <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(s16.k?.body)}</span>{' '}
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'var(--text-secondary)',
                              paddingTop: '8px',
                              borderTop: '1px solid var(--rule-soft)',
                            }}
                          >
                            {show(s16.k?.where)}
                          </span>{' '}
                        </div>{' '}
                      </Fragment>
                    );
                  })}{' '}
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  {' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>图标栏项 · 状态</h3>{' '}
                    <div
                      style={{
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'flex-end',
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '44px', height: '40px', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                          <DS.Icon name="file-text" size={18} />
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>默认</span>
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            width: '44px',
                            height: '40px',
                            borderRadius: '8px',
                            display: 'grid',
                            placeItems: 'center',
                            background: 'var(--hover)',
                          }}
                        >
                          <DS.Icon name="file-text" size={18} />
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>悬停</span>
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            width: '44px',
                            height: '40px',
                            borderRadius: '8px',
                            display: 'grid',
                            placeItems: 'center',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                          }}
                        >
                          <DS.Icon name="file-text" size={18} />
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>当前</span>
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '44px',
                            height: '40px',
                            borderRadius: '8px',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <DS.Icon name="square-check" size={18} />
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
                            }}
                          />
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>需关注</span>
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '44px',
                            height: '40px',
                            borderRadius: '8px',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <DS.Icon name="inbox" size={18} />
                          <span
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '0',
                              fontSize: '10px',
                              fontWeight: '600',
                              padding: '1px 5px',
                              borderRadius: '999px',
                              background: 'var(--brand-mark)',
                              color: 'var(--ink)',
                              boxShadow: '0 0 0 2px var(--bg-sunk)',
                            }}
                          >
                            12
                          </span>
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>计数</span>
                      </div>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '44px',
                            height: '40px',
                            borderRadius: '8px',
                            display: 'grid',
                            placeItems: 'center',
                            boxShadow: '0 0 0 2px var(--text-primary)',
                          }}
                        >
                          <DS.Icon name="file-text" size={18} />
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>焦点</span>
                      </div>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', lineHeight: '1.6' }}>
                      {' '}
                      <span>· 每个图标都有悬停提示，写模块全名；键盘 ↑↓ 移动，Enter 进入。</span>{' '}
                      <span>· 圆点表示里面有等你处理的事，数字只用在收件箱。</span>{' '}
                      <span>· 模块不可用就不显示；已开通但未启用的模块只有管理员看得到。</span>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '500' }}>上下文栏项 · 类型</h3>{' '}
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
                      All projects<span style={{ marginLeft: 'auto', fontSize: '11px' }}>返回行</span>
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
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>Wang family · Global Talent</span>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>实体切换器</span>
                      </div>
                      <DS.Icon name="chevrons-up-down" size={14} />
                    </div>{' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', padding: '8px 10px 0' }}>
                      分组标题
                    </span>{' '}
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
                      <DS.Icon name="users" size={15} />
                      Parties<span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-secondary)' }}>默认</span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        background: 'var(--brand-field)',
                        color: 'var(--ink)',
                      }}
                    >
                      <DS.Icon name="list-checks" size={15} />
                      Review
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '1px 6px',
                          borderRadius: '999px',
                          background: 'var(--paper)',
                        }}
                      >
                        12
                      </span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        minHeight: '46px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--brand-mark)', flex: 'none' }} />
                      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', lineHeight: '1.35' }}>
                        <span style={{ fontSize: '13px' }}>Sign the engagement letter</span>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>T-131 · due Friday</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>两行 · 列表</span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        borderTop: '1px solid var(--rule-soft)',
                        borderRadius: '0',
                        marginTop: '4px',
                        paddingTop: '6px',
                      }}
                    >
                      <DS.Icon name="settings" size={15} />
                      Project settings
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-secondary)' }}>底部 · 实体设置</span>
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  {' '}
                  <div style={{ background: 'var(--bg-page)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '8px 24px' }}>
                    {' '}
                    {list(v.shellBreaks).map((b$, $i) => {
                      const s17 = { ...v, b: b$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '120px minmax(0, 1fr)',
                              gap: '16px',
                              padding: '14px 0',
                              borderBottom: '1px solid var(--rule-soft)',
                            }}
                          >
                            <span style={{ fontSize: '13px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>
                              {show(s17.b?.w)}
                            </span>
                            <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(s17.b?.rule)}</span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {' '}
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>层级规则</h3>{' '}
                    {list(v.shellRules).map((r$, $i) => {
                      const s18 = { ...v, r: r$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>{show(s18.r?.k)}</span>
                            <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(s18.r?.v)}</span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                  <div style={{ background: 'var(--bg-page)', border: '1px solid var(--rule)', borderRadius: '16px', padding: '8px 24px' }}>
                    {' '}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '110px minmax(0, 1fr) minmax(0, 1fr)',
                        gap: '12px',
                        padding: '14px 0',
                        borderBottom: '1px solid var(--rule)',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span />
                      <span>客户门户</span>
                      <span>Ops 工作台</span>
                    </div>{' '}
                    {list(v.shellDiff).map((d$, $i) => {
                      const s19 = { ...v, d: d$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '110px minmax(0, 1fr) minmax(0, 1fr)',
                              gap: '12px',
                              padding: '12px 0',
                              borderBottom: '1px solid var(--rule-soft)',
                              fontSize: '13px',
                              lineHeight: '1.5',
                            }}
                          >
                            <span style={{ fontWeight: '500' }}>{show(s19.d?.k)}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{show(s19.d?.a)}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{show(s19.d?.b)}</span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s14 ? (
            <>
              <section
                id="s14"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {' '}
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>14 / Agent 对话 · P0</div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    Agent 回答要能看出做了什么、依据什么，对外动作由人确认
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '44em' }}>
                    客户门户的“对话”模块和 Ops 的右侧 Agent 抽屉共用这组组件：消息、执行步骤、引用、结果卡片、确认卡片、输入框。
                  </p>{' '}
                </div>{' '}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      flex: '1.5',
                      minWidth: '0',
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>一段完整对话 · 可点击展开步骤</h3>{' '}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <span
                        style={{
                          maxWidth: '75%',
                          padding: '12px 16px',
                          borderRadius: '16px 16px 4px 16px',
                          background: 'var(--bg-sunk)',
                          fontSize: '15px',
                          lineHeight: '1.6',
                        }}
                      >
                        Which investors haven't signed the NDA, and does the agreement allow transfers to a family trust?
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'var(--ink)',
                          color: 'var(--brand-mark)',
                          display: 'grid',
                          placeItems: 'center',
                          flex: 'none',
                        }}
                      >
                        <DS.Icon name="sparkles" size={14} />
                      </span>{' '}
                      <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {' '}
                        <button
                          type="button"
                          onClick={v.toggleSteps}
                          style={{
                            alignSelf: 'flex-start',
                            flex: 'none',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            height: '30px',
                            padding: '0 10px 0 6px',
                            border: 'none',
                            borderRadius: '8px',
                            background: 'var(--bg-sunk)',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ display: 'inline-flex', transform: v.stepsRot }}>
                            <DS.Icon name="chevron-right" size={14} />
                          </span>
                          Worked for 14 s · 4 steps
                        </button>{' '}
                        {v.stepsOpen ? (
                          <>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                paddingLeft: '12px',
                                borderLeft: '1px solid var(--rule)',
                              }}
                            >
                              {list(v.agentSteps).map((s$, $i) => {
                                const s20 = { ...v, s: s$, $index: $i };
                                return (
                                  <Fragment key={$i}>
                                    <div
                                      style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '28px', fontSize: '13px' }}
                                    >
                                      <span
                                        style={{
                                          width: '16px',
                                          height: '16px',
                                          borderRadius: '999px',
                                          background: 'var(--text-primary)',
                                          color: 'var(--bg-page)',
                                          display: 'grid',
                                          placeItems: 'center',
                                          flex: 'none',
                                        }}
                                      >
                                        <DS.Icon name="check" size={10} />
                                      </span>
                                      <span>{show(s20.s?.what)}</span>
                                      <span style={{ color: 'var(--text-secondary)' }}>{show(s20.s?.result)}</span>
                                    </div>
                                  </Fragment>
                                );
                              })}
                            </div>
                          </>
                        ) : null}{' '}
                        <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.7' }}>
                          4 of the 24 invited investors haven't signed the NDA: Anna Kowalski, 王志远, James Park and Maria Rossi.
                          <span
                            style={{
                              display: 'inline-grid',
                              placeItems: 'center',
                              minWidth: '18px',
                              height: '18px',
                              padding: '0 4px',
                              margin: '0 2px',
                              borderRadius: '5px',
                              background: 'var(--bg-sunk)',
                              color: 'var(--text-primary)',
                              fontSize: '11px',
                              fontWeight: '600',
                              verticalAlign: '2px',
                              boxSizing: 'border-box',
                              lineHeight: '1',
                            }}
                          >
                            1
                          </span>
                        </p>{' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.7' }}>
                            Yes. Clause 7.2(c) allows transfers to a trust the shareholder controls, as long as the board is told within 10
                            business days.
                            <span
                              style={{
                                display: 'inline-grid',
                                placeItems: 'center',
                                minWidth: '18px',
                                height: '18px',
                                padding: '0 4px',
                                margin: '0 2px',
                                borderRadius: '5px',
                                background: 'var(--brand-field)',
                                color: 'var(--ink)',
                                fontSize: '11px',
                                fontWeight: '600',
                                verticalAlign: '2px',
                                boxSizing: 'border-box',
                                lineHeight: '1',
                              }}
                            >
                              2
                            </span>
                            {' The drag-along threshold is 75%.'}
                            <span
                              style={{
                                display: 'inline-grid',
                                placeItems: 'center',
                                minWidth: '18px',
                                height: '18px',
                                padding: '0 4px',
                                margin: '0 2px',
                                borderRadius: '5px',
                                background: 'var(--bg-sunk)',
                                color: 'var(--text-primary)',
                                fontSize: '11px',
                                fontWeight: '600',
                                verticalAlign: '2px',
                                boxSizing: 'border-box',
                                lineHeight: '1',
                              }}
                            >
                              3
                            </span>
                          </p>{' '}
                          <div
                            style={{
                              maxWidth: '320px',
                              marginLeft: '24px',
                              background: 'var(--bg-page)',
                              border: '1px solid var(--rule)',
                              borderRadius: '12px',
                              padding: '14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <DS.Icon name="file-text" size={14} />
                              <span style={{ fontSize: '13px', fontWeight: '500' }}>Shareholder agreement v3</span>
                              <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>p. 14</span>
                            </div>
                            <span style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                              “…a Permitted Transferee includes a trust of which the Shareholder is the settlor, provided that notice is
                              given to the Board within ten Business Days…”
                            </span>
                            <span style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>Open at page 14</span>
                          </div>{' '}
                        </div>{' '}
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', paddingRight: '4px' }}>
                            Sources
                          </span>
                          {list(v.agentSources).map((s$, $i) => {
                            const s21 = { ...v, s: s$, $index: $i };
                            return (
                              <Fragment key={$i}>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    height: '26px',
                                    padding: '0 8px 0 4px',
                                    borderRadius: '6px',
                                    background: 'var(--bg-sunk)',
                                    fontSize: '12px',
                                  }}
                                >
                                  <span
                                    style={{
                                      minWidth: '16px',
                                      height: '16px',
                                      borderRadius: '4px',
                                      background: 'var(--bg-page)',
                                      display: 'grid',
                                      placeItems: 'center',
                                      fontSize: '10px',
                                      fontWeight: '600',
                                    }}
                                  >
                                    {show(s21.s?.n)}
                                  </span>
                                  {show(s21.s?.label)}
                                </span>
                              </Fragment>
                            );
                          })}
                        </div>{' '}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            padding: '16px',
                            borderRadius: '16px',
                            border: '1px solid var(--text-primary)',
                          }}
                        >
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                              Needs your confirmation
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: '500' }}>Send NDA reminders to 4 investors?</span>
                            <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                              A short note from Halden Capital with the NDA link. Maria Rossi was invited 2 days ago; you may want to leave
                              her out.
                            </span>
                          </div>{' '}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <DS.Button size="sm" ground={v.ground}>
                              Send 4 reminders
                            </DS.Button>
                            <DS.Button variant="secondary" size="sm" ground={v.ground}>
                              Review drafts
                            </DS.Button>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Nothing is sent until you confirm.</span>
                          </div>{' '}
                        </div>{' '}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                          <DS.IconButton name="copy" label="Copy" variant="ghost" size={28} />
                          <DS.IconButton name="rotate-ccw" label="Retry" variant="ghost" size={28} />
                          <DS.IconButton name="user-round" label="Hand to the team" variant="ghost" size={28} />
                          <DS.IconButton name="flag" label="Report" variant="ghost" size={28} />
                          <span style={{ marginLeft: '8px', fontSize: '12px' }}>3 sources · Harbour Series A only</span>
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span style={{ flex: '1', height: '1px', background: 'var(--rule-soft)' }} />
                      <DS.Icon name="square-check" size={13} />
                      Task T-128 created · handed to Sam Ortiz
                      <span style={{ flex: '1', height: '1px', background: 'var(--rule-soft)' }} />
                    </div>{' '}
                    <div style={{ display: 'flex', gap: '14px' }}>
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
                        SO
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px' }}>
                          <span style={{ fontWeight: '500' }}>Sam Ortiz</span>{' '}
                          <span
                            style={{
                              fontWeight: '600',
                              padding: '2px 5px',
                              borderRadius: '4px',
                              background: 'var(--bg-sunk)',
                              fontSize: '11px',
                            }}
                          >
                            COSX
                          </span>{' '}
                          <span style={{ color: 'var(--text-secondary)' }}>· 10:12</span>
                        </span>
                        <span style={{ fontSize: '15px', lineHeight: '1.7' }}>I'll send three today and hold Maria's until Friday.</span>
                      </div>
                    </div>
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
                      flex: '1',
                      minWidth: '300px',
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>构成</h3>
                    {list(v.agentAnatomy).map((a$, $i) => {
                      const s22 = { ...v, a: a$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <span
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '999px',
                                background: 'var(--text-primary)',
                                color: 'var(--bg-page)',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: '11px',
                                fontWeight: '600',
                                flex: 'none',
                              }}
                            >
                              {show(s22.a?.n)}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontSize: '13px', fontWeight: '500' }}>{show(s22.a?.k)}</span>
                              <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(s22.a?.v)}</span>
                            </div>
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>消息状态</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    {' '}
                    <div
                      style={{
                        background: 'var(--bg-page)',
                        border: '1px solid var(--rule)',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        padding: '20px',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>思考中</span>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'var(--ink)',
                            color: 'var(--brand-mark)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="sparkles" size={14} />
                        </span>
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500' }}>
                            {show(v.pulseDot)}Reading 3 documents…
                          </div>
                          <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                            Searching “family trust” in Harbour Series A
                          </span>
                        </div>
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        background: 'var(--bg-page)',
                        border: '1px solid var(--rule)',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        padding: '20px',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>输出中</span>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'var(--ink)',
                            color: 'var(--brand-mark)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="sparkles" size={14} />
                        </span>
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <span style={{ fontSize: '14px', lineHeight: '1.65' }}>
                            Clause 7.2(c) allows transfers to a trust the shareholder controls, as long as
                            <span
                              style={{
                                display: 'inline-block',
                                width: '2px',
                                height: '17px',
                                background: 'var(--text-primary)',
                                verticalAlign: '-3px',
                                marginLeft: '2px',
                              }}
                            />
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Esc to stop</span>
                        </div>
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        background: 'var(--bg-page)',
                        border: '1px solid var(--rule)',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        padding: '20px',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>已停止</span>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'var(--ink)',
                            color: 'var(--brand-mark)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="sparkles" size={14} />
                        </span>
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <span style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                            Clause 7.2(c) allows transfers to a trust the shareholder controls…
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Stopped by you</span>
                            <span style={{ fontWeight: '600', textDecoration: 'underline' }}>Continue</span>
                          </div>
                        </div>
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        background: 'var(--bg-page)',
                        border: '1px solid var(--rule)',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        padding: '20px',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>失败</span>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'var(--ink)',
                            color: 'var(--brand-mark)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="sparkles" size={14} />
                        </span>
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div
                            style={{
                              padding: '10px 12px',
                              borderRadius: '8px',
                              background: 'var(--status-error-wash)',
                              color: 'var(--ink)',
                              fontSize: '13px',
                              lineHeight: '1.5',
                            }}
                          >
                            Couldn't read Cap table.xlsx: the file is password protected.
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <DS.Button variant="secondary" size="sm" ground={v.ground}>
                              Retry
                            </DS.Button>
                            <DS.Button variant="ghost" size="sm" ground={v.ground}>
                              Continue without it
                            </DS.Button>
                          </div>
                        </div>
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        background: 'var(--bg-page)',
                        border: '1px solid var(--rule)',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        padding: '20px',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>超出范围</span>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'var(--ink)',
                            color: 'var(--brand-mark)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="sparkles" size={14} />
                        </span>
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <span style={{ fontSize: '14px', lineHeight: '1.65' }}>
                            I can only see documents shared with you in Harbour Series A. The Kowloon Bay files aren't in that set.
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>Ask the team instead</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>结果卡片 · 结果以卡片内嵌在回答里，点开进入对应页面</h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '16px',
                      alignItems: 'start',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>任务</span>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          padding: '14px 16px',
                          borderRadius: '16px',
                          background: 'var(--brand-field)',
                          color: 'var(--ink)',
                          border: '1px solid transparent',
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(17,17,17,.7)' }}>Task created · T-128</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Chase NDA signatures · 4 investors</span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', color: 'rgba(17,17,17,.7)' }}>With us · Sam Ortiz</span>
                          <DS.Button size="sm" ground="yellow">
                            Open
                          </DS.Button>
                        </div>
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>文档</span>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          padding: '14px 16px',
                          borderRadius: '16px',
                          background: 'var(--bg-page)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--rule)',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <span
                            style={{
                              width: '40px',
                              height: '50px',
                              borderRadius: '6px',
                              background: 'var(--bg-sunk)',
                              display: 'grid',
                              placeItems: 'center',
                              flex: 'none',
                            }}
                          >
                            <DS.Icon name="file-text" size={16} />
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '0' }}>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>Q3 report 2026.pdf</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>18 pages · Kowloon Bay Fund II</span>
                            <span style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>Open</span>
                          </div>
                        </div>
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>人员列表</span>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          padding: '14px 16px',
                          borderRadius: '16px',
                          background: 'var(--bg-page)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--rule)',
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                          Invited · NDA not signed · 4
                        </span>
                        {list(v.agentPeople).map((p$, $i) => {
                          const s23 = { ...v, p: p$, $index: $i };
                          return (
                            <Fragment key={$i}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                                <span
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '999px',
                                    background: 'var(--bg-well)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    fontSize: '9px',
                                    fontWeight: '600',
                                    flex: 'none',
                                  }}
                                >
                                  {show(s23.p?.ini)}
                                </span>
                                <span style={{ fontWeight: '500' }}>{show(s23.p?.name)}</span>
                                <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                  {show(s23.p?.meta)}
                                </span>
                              </div>
                            </Fragment>
                          );
                        })}
                        <span style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>Show all 4</span>
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>草稿</span>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          padding: '14px 16px',
                          borderRadius: '16px',
                          background: 'var(--bg-page)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--rule)',
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                          Draft email · to 4 investors
                        </span>
                        <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                          Dear Anna, a reminder that the Harbour Series A NDA is ready to sign. It takes about two minutes…
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <DS.Button variant="secondary" size="sm" ground={v.ground}>
                            Edit
                          </DS.Button>
                          <DS.Button variant="ghost" size="sm" ground={v.ground}>
                            Copy
                          </DS.Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '12px' }}>
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>输入框</h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                      gap: '16px',
                      alignItems: 'end',
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      borderRadius: '16px',
                      padding: '24px',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        空闲 · 范围标签说明 Agent 能看到什么
                      </span>
                      <div
                        style={{
                          borderRadius: '16px',
                          background: 'var(--bg-sunk)',
                          padding: '12px 12px 10px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Ask a question or hand over a task…</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '28px',
                              padding: '0 8px',
                              borderRadius: '8px',
                              background: 'var(--bg-page)',
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            <DS.Icon name="briefcase" size={13} />
                            Harbour Series A<DS.Icon name="chevron-down" size={12} />
                          </span>
                          <DS.IconButton name="paperclip" label="Attach" variant="ghost" size={30} />
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '28px',
                              padding: '0 8px',
                              borderRadius: '8px',
                              boxShadow: 'inset 0 0 0 1px var(--rule)',
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            <DS.Icon name="square-check" size={13} />
                            As a task
                          </span>
                          <div style={{ flex: '1' }} />
                          <span
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-secondary)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="arrow-up" size={16} />
                          </span>
                        </div>
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>带附件</span>
                      <div
                        style={{
                          borderRadius: '16px',
                          background: 'var(--bg-sunk)',
                          padding: '12px 12px 10px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '30px',
                              padding: '0 8px',
                              borderRadius: '8px',
                              background: 'var(--bg-page)',
                              fontSize: '12px',
                            }}
                          >
                            <DS.Icon name="file-text" size={13} />
                            Q3 report 2026.pdf<span style={{ color: 'var(--text-secondary)' }}>2.4 MB</span>
                            <DS.Icon name="x" size={12} />
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              height: '30px',
                              padding: '0 8px',
                              borderRadius: '8px',
                              background: 'var(--bg-page)',
                              fontSize: '12px',
                            }}
                          >
                            <DS.Icon name="file-text" size={13} />
                            Board minutes.docx
                            <span
                              style={{
                                width: '40px',
                                height: '3px',
                                borderRadius: '999px',
                                background: 'var(--bg-well)',
                                overflow: 'hidden',
                                display: 'inline-block',
                              }}
                            >
                              <span style={{ display: 'block', width: '62%', height: '100%', background: 'var(--text-primary)' }} />
                            </span>
                          </span>
                        </div>
                        <span style={{ fontSize: '15px' }}>Turn this into a website article for subscribers</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '28px',
                              padding: '0 8px',
                              borderRadius: '8px',
                              background: 'var(--bg-page)',
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            <DS.Icon name="briefcase" size={13} />
                            Harbour Series A<DS.Icon name="chevron-down" size={12} />
                          </span>
                          <DS.IconButton name="paperclip" label="Attach" variant="ghost" size={30} />
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '28px',
                              padding: '0 8px',
                              borderRadius: '8px',
                              boxShadow: 'inset 0 0 0 1px var(--rule)',
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            <DS.Icon name="square-check" size={13} />
                            As a task
                          </span>
                          <div style={{ flex: '1' }} />
                          <DS.IconButton name="arrow-up" label="Send" variant="solid" size={32} />
                        </div>
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>输出中 · 发送变为停止</span>
                      <div
                        style={{
                          borderRadius: '16px',
                          background: 'var(--bg-sunk)',
                          padding: '12px 12px 10px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                          Agent is answering · you can type the next message
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '28px',
                              padding: '0 8px',
                              borderRadius: '8px',
                              background: 'var(--bg-page)',
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            <DS.Icon name="briefcase" size={13} />
                            Harbour Series A<DS.Icon name="chevron-down" size={12} />
                          </span>
                          <DS.IconButton name="paperclip" label="Attach" variant="ghost" size={30} />
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '28px',
                              padding: '0 8px',
                              borderRadius: '8px',
                              boxShadow: 'inset 0 0 0 1px var(--rule)',
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            <DS.Icon name="square-check" size={13} />
                            As a task
                          </span>
                          <div style={{ flex: '1' }} />
                          <span
                            title="Stop · Esc"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'var(--text-primary)',
                              color: 'var(--bg-page)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--bg-page)' }} />
                          </span>
                        </div>
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>/ 命令</span>
                      <div
                        style={{
                          width: '300px',
                          maxWidth: '100%',
                          boxSizing: 'border-box',
                          background: 'var(--bg-page)',
                          border: '1px solid var(--rule)',
                          borderRadius: '12px',
                          padding: '6px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1px',
                        }}
                      >
                        {list(v.slashCmds).map((m$, $i) => {
                          const s24 = { ...v, m: m$, $index: $i };
                          return (
                            <Fragment key={$i}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '7px 8px',
                                  borderRadius: '8px',
                                  background: s24.m?.bg,
                                  color: s24.m?.fg,
                                }}
                              >
                                <span style={{ fontSize: '13px', fontWeight: '600', width: '84px' }}>{show(s24.m?.cmd)}</span>
                                <span style={{ fontSize: '12px' }}>{show(s24.m?.desc)}</span>
                              </div>
                            </Fragment>
                          );
                        })}
                      </div>
                      <div
                        style={{
                          borderRadius: '16px',
                          background: 'var(--bg-sunk)',
                          padding: '12px 12px 10px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <span style={{ fontSize: '15px' }}>/</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '28px',
                              padding: '0 8px',
                              borderRadius: '8px',
                              background: 'var(--bg-page)',
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            <DS.Icon name="briefcase" size={13} />
                            Harbour Series A<DS.Icon name="chevron-down" size={12} />
                          </span>
                          <DS.IconButton name="paperclip" label="Attach" variant="ghost" size={30} />
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '28px',
                              padding: '0 8px',
                              borderRadius: '8px',
                              boxShadow: 'inset 0 0 0 1px var(--rule)',
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            <DS.Icon name="square-check" size={13} />
                            As a task
                          </span>
                          <div style={{ flex: '1' }} />
                          <span
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-secondary)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="arrow-up" size={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Ops · 右侧抽屉 480</span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '480px',
                        height: '460px',
                        borderRadius: '16px',
                        border: '1px solid var(--rule)',
                        background: 'var(--bg-page)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '14px 16px',
                          borderBottom: '1px solid var(--rule)',
                        }}
                      >
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'var(--ink)',
                            color: 'var(--brand-mark)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="sparkles" size={14} />
                        </span>
                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', lineHeight: '1.3' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>Agent</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Wang family · Global Talent</span>
                        </div>
                        <DS.IconButton name="x" label="Close" variant="ghost" size={28} />
                      </div>
                      <div
                        style={{ flex: '1', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <span
                            style={{
                              maxWidth: '80%',
                              padding: '10px 14px',
                              borderRadius: '14px 14px 4px 14px',
                              background: 'var(--bg-sunk)',
                              fontSize: '14px',
                            }}
                          >
                            Which facts are still in conflict?
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span
                            style={{
                              alignSelf: 'flex-start',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '26px',
                              padding: '0 8px',
                              borderRadius: '7px',
                              background: 'var(--bg-sunk)',
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            <DS.Icon name="chevron-right" size={13} />
                            Worked for 6 s · 2 steps
                          </span>
                          <span style={{ fontSize: '14px', lineHeight: '1.65' }}>
                            One: 王志远's date of birth. The passport says 14 March 1983 and the birth certificate says 13 March.
                            <span
                              style={{
                                display: 'inline-grid',
                                placeItems: 'center',
                                minWidth: '18px',
                                height: '18px',
                                padding: '0 4px',
                                margin: '0 2px',
                                borderRadius: '5px',
                                background: 'var(--bg-sunk)',
                                color: 'var(--text-primary)',
                                fontSize: '11px',
                                fontWeight: '600',
                                verticalAlign: '2px',
                                boxSizing: 'border-box',
                                lineHeight: '1',
                              }}
                            >
                              1
                            </span>
                          </span>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              borderRadius: '12px',
                              background: 'var(--bg-sunk)',
                            }}
                          >
                            <span style={{ flex: '1', fontSize: '13px' }}>Open the conflict in Review</span>
                            <DS.Icon name="arrow-right" size={14} />
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '12px' }}>
                        <div
                          style={{
                            borderRadius: '14px',
                            background: 'var(--bg-sunk)',
                            padding: '10px 10px 8px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                          }}
                        >
                          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Ask about this project…</span>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                height: '26px',
                                padding: '0 8px',
                                borderRadius: '7px',
                                background: 'var(--bg-page)',
                                fontSize: '12px',
                                fontWeight: '500',
                              }}
                            >
                              <DS.Icon name="briefcase" size={12} />
                              This project
                            </span>
                            <div style={{ flex: '1' }} />
                            <span
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'var(--bg-well)',
                                color: 'var(--text-secondary)',
                                display: 'grid',
                                placeItems: 'center',
                              }}
                            >
                              <DS.Icon name="arrow-up" size={16} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>规则</h3>
                    {list(v.agentRules).map((r$, $i) => {
                      const s25 = { ...v, r: r$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>{show(s25.r?.k)}</span>
                            <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(s25.r?.v)}</span>
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s15 ? (
            <>
              <section
                id="s15"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>15 / 头像与成员 · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    人、机构、Agent 和员工，一眼分得清
                  </h2>
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  {' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>头像类型</h3>{' '}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end' }}>
                      {' '}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '36px',
                            height: '36px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '13px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          LW
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>人</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: 'var(--ink)',
                            color: 'var(--linen)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '13px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          HV
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>机构</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: 'var(--ink)',
                            color: 'var(--brand-mark)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name="sparkles" size={18} />
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Agent</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '36px',
                              height: '36px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '13px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: 'none',
                            }}
                          >
                            SO
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '600',
                              padding: '2px 5px',
                              borderRadius: '4px',
                              background: 'var(--bg-sunk)',
                            }}
                          >
                            COSX
                          </span>
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>员工</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '36px',
                            height: '36px',
                            borderRadius: '999px',
                            background: 'var(--bg-page)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '13px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'inset 0 0 0 1.5px var(--text-secondary)',
                          }}
                        >
                          AK
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>外部访客</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '36px',
                            height: '36px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '13px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: '0 0 0 2px var(--bg-page), 0 0 0 4px var(--brand-mark)',
                          }}
                        >
                          王
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>正在查看</span>
                      </div>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '20px',
                            height: '20px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '9px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          LW
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>20</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '24px',
                            height: '24px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '9px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          LW
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>24</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '28px',
                            height: '28px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '10px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          LW
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>28</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '36px',
                            height: '36px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '13px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          LW
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>36</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '44px',
                            height: '44px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '16px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          LW
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>44</span>
                      </div>
                    </div>{' '}
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      没有照片时用首字母，中文取姓。颜色不区分个人，只有 Agent 用墨色。外部访客用描边，正在查看同一文档的人加品牌色外圈。
                    </span>
                  </div>{' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>头像组</h3>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex' }}>
                        <span style={{ marginLeft: '0px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '28px',
                              height: '28px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '10px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: '0 0 0 2px var(--bg-page)',
                            }}
                          >
                            AK
                          </span>
                        </span>
                        <span style={{ marginLeft: '-8px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '28px',
                              height: '28px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '10px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: '0 0 0 2px var(--bg-page)',
                            }}
                          >
                            王
                          </span>
                        </span>
                        <span style={{ marginLeft: '-8px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '28px',
                              height: '28px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '10px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: '0 0 0 2px var(--bg-page)',
                            }}
                          >
                            JP
                          </span>
                        </span>
                        <span style={{ marginLeft: '-8px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '28px',
                              height: '28px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '10px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: '0 0 0 2px var(--bg-page)',
                            }}
                          >
                            MR
                          </span>
                        </span>
                        <span style={{ marginLeft: '-8px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '28px',
                              height: '28px',
                              borderRadius: '999px',
                              background: 'var(--bg-sunk)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '10px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: '0 0 0 2px var(--bg-page)',
                            }}
                          >
                            +5
                          </span>
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>9 people have access</span>
                    </div>{' '}
                    <div
                      style={{
                        width: '260px',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        background: 'var(--bg-page)',
                        border: '1px solid var(--rule)',
                        borderRadius: '12px',
                        padding: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1px',
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', padding: '6px 8px 4px' }}>
                        Viewing now · 2
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '24px',
                            height: '24px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '9px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          王
                          <span
                            style={{
                              position: 'absolute',
                              right: '-1px',
                              bottom: '-1px',
                              width: '7px',
                              height: '7px',
                              borderRadius: '999px',
                              background: 'var(--brand-mark)',
                              boxShadow: '0 0 0 2px var(--bg-page)',
                            }}
                          />
                        </span>
                        <span style={{ fontSize: '13px' }}>王志远</span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>p. 3</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '24px',
                            height: '24px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '9px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          AK
                          <span
                            style={{
                              position: 'absolute',
                              right: '-1px',
                              bottom: '-1px',
                              width: '7px',
                              height: '7px',
                              borderRadius: '999px',
                              background: 'var(--brand-mark)',
                              boxShadow: '0 0 0 2px var(--bg-page)',
                            }}
                          />
                        </span>
                        <span style={{ fontSize: '13px' }}>Anna Kowalski</span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>p. 14</span>
                      </div>
                    </div>{' '}
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      最多叠 4 个，其余合成“+N”。悬停展开名单；正在查看的人排在前面，并写明看到第几页。
                    </span>
                  </div>{' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>成员行 + 角色选择</h3>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <span
                        style={{
                          position: 'relative',
                          width: '32px',
                          height: '32px',
                          borderRadius: '999px',
                          background: 'var(--bg-well)',
                          color: 'var(--text-primary)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '12px',
                          fontWeight: '600',
                          flex: 'none',
                          boxShadow: 'none',
                        }}
                      >
                        LW
                      </span>
                      <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Li Wei</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>li.wei@halden.co</span>
                      </div>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '32px',
                          padding: '0 10px',
                          borderRadius: '8px',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        Customer admin
                        <DS.Icon name="chevron-down" size={13} />
                      </span>
                      <DS.IconButton name="more-horizontal" label="More" variant="ghost" size={28} />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <span
                        style={{
                          position: 'relative',
                          width: '32px',
                          height: '32px',
                          borderRadius: '999px',
                          background: 'var(--bg-well)',
                          color: 'var(--text-primary)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '12px',
                          fontWeight: '600',
                          flex: 'none',
                          boxShadow: 'none',
                        }}
                      >
                        SO
                      </span>
                      <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Sam Ortiz</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>sam@cosx.co</span>
                      </div>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '32px',
                          padding: '0 10px',
                          borderRadius: '8px',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        Admin
                        <DS.Icon name="chevron-down" size={13} />
                      </span>
                      <DS.IconButton name="more-horizontal" label="More" variant="ghost" size={28} />
                    </div>{' '}
                    <div
                      style={{
                        width: '320px',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        background: 'var(--bg-page)',
                        border: '1px solid var(--rule)',
                        borderRadius: '12px',
                        padding: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          padding: '8px',
                          borderRadius: '8px',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span style={{ width: '16px', flex: 'none', paddingTop: '1px', display: 'inline-flex' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>Owner · transfer ownership instead</span>
                          <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                            Everything, including billing and deleting the workspace.
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          padding: '8px',
                          borderRadius: '8px',
                          background: 'var(--brand-field)',
                          color: 'var(--ink)',
                        }}
                      >
                        <span style={{ width: '16px', flex: 'none', paddingTop: '1px', display: 'inline-flex' }}>
                          <DS.Icon name="check" size={14} />
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>Admin</span>
                          <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'rgba(17,17,17,.7)' }}>
                            Manage members, security and integrations.
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          padding: '8px',
                          borderRadius: '8px',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ width: '16px', flex: 'none', paddingTop: '1px', display: 'inline-flex' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>Member</span>
                          <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                            Work on projects they are added to.
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          padding: '8px',
                          borderRadius: '8px',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ width: '16px', flex: 'none', paddingTop: '1px', display: 'inline-flex' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>Viewer</span>
                          <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                            Read only. Can comment.
                          </span>
                        </div>
                      </div>
                    </div>{' '}
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      每个角色都写明能做什么。不能直接选的项保持可见并说明原因。客户工作区只有 Customer admin 和 Customer member 两种。
                    </span>
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s16 ? (
            <>
              <section
                id="s16"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>16 / 分享对话框 · P0</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    分享时一次说清：给谁、能做什么、到什么时候
                  </h2>
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '44em' }}>
                    同一个对话框处理邮件邀请和公开链接。转发出去的分享仍受上游权限约束，能力只能收窄不能放大。
                  </p>
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  {' '}
                  <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--scrim)' }}>
                    <div
                      style={{
                        background: 'var(--bg-page)',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 24px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '18px', fontWeight: '500', flex: '1' }}>Share 3 files · Harbour Series A</span>
                          <DS.IconButton name="x" label="Close" variant="ghost" size={28} />
                        </div>
                        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--rule)' }}>
                          <span
                            style={{
                              height: '38px',
                              padding: '0 10px',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '13px',
                              fontWeight: '500',
                              color: 'var(--text-primary)',
                              boxShadow: 'inset 0 -2px 0 var(--text-primary)',
                            }}
                          >
                            Invite people
                          </span>
                          <span
                            style={{
                              height: '38px',
                              padding: '0 10px',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '13px',
                              fontWeight: '500',
                              color: 'var(--text-secondary)',
                              boxShadow: 'none',
                            }}
                          >
                            Public link
                          </span>
                        </div>
                      </div>{' '}
                      <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>To</span>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'center',
                              gap: '6px',
                              minHeight: '38px',
                              padding: '5px 8px',
                              borderRadius: '8px',
                              background: 'var(--bg-page)',
                              boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                height: '26px',
                                padding: '0 4px 0 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: 'var(--bg-page)',
                                boxShadow: 'inset 0 0 0 1px var(--rule)',
                              }}
                            >
                              anna.k@harbour.vc
                              <DS.Icon name="x" size={12} />
                            </span>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                height: '26px',
                                padding: '0 4px 0 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: 'var(--bg-page)',
                                boxShadow: 'inset 0 0 0 1px var(--rule)',
                              }}
                            >
                              James Park
                              <DS.Icon name="x" size={12} />
                            </span>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Add people…</span>
                          </div>
                        </div>{' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>They can</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <DS.Checkbox checked={true} label="View" />
                            <DS.Checkbox checked={true} label="Comment" />
                            <DS.Checkbox checked={false} label="Download originals" description="Otherwise PDF with watermark" />
                            <DS.Checkbox checked={false} label="Forward to others" />
                          </div>
                        </div>{' '}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Expires</span>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                height: '38px',
                                padding: '0 12px',
                                borderRadius: '8px',
                                background: 'var(--bg-sunk)',
                                boxShadow: 'none',
                                fontSize: '14px',
                              }}
                            >
                              31 Oct 2026
                              <span style={{ marginLeft: 'auto', display: 'inline-flex' }}>
                                <DS.Icon name="calendar" size={14} />
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Before opening</span>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                height: '38px',
                                padding: '0 12px',
                                borderRadius: '8px',
                                background: 'var(--bg-sunk)',
                                boxShadow: 'none',
                                fontSize: '14px',
                              }}
                            >
                              Sign NDA · mutual
                              <span style={{ marginLeft: 'auto', display: 'inline-flex' }}>
                                <DS.Icon name="chevron-down" size={14} />
                              </span>
                            </div>
                          </div>
                        </div>{' '}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>Watermark</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Name, email and date on every page</span>
                          </div>
                          <DS.Switch checked={true} />
                        </div>{' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Message</span>
                          <div
                            style={{
                              minHeight: '60px',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              background: 'var(--bg-sunk)',
                              fontSize: '13px',
                              lineHeight: '1.5',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            Optional. Shown in the invitation email.
                          </div>
                        </div>{' '}
                      </div>{' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '14px 24px',
                          borderTop: '1px solid var(--rule)',
                        }}
                      >
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: '1' }}>
                          2 people · 3 files · until 31 Oct
                        </span>
                        <DS.Button variant="ghost" size="sm" ground={v.ground}>
                          Cancel
                        </DS.Button>
                        <DS.Button size="sm" ground={v.ground}>
                          Send invites
                        </DS.Button>
                      </div>
                    </div>
                  </div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {' '}
                    <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--scrim)' }}>
                      <div
                        style={{
                          background: 'var(--bg-page)',
                          borderRadius: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 24px 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '500', flex: '1' }}>Share 3 files · Harbour Series A</span>
                            <DS.IconButton name="x" label="Close" variant="ghost" size={28} />
                          </div>
                          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--rule)' }}>
                            <span
                              style={{
                                height: '38px',
                                padding: '0 10px',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: '13px',
                                fontWeight: '500',
                                color: 'var(--text-secondary)',
                                boxShadow: 'none',
                              }}
                            >
                              Invite people
                            </span>
                            <span
                              style={{
                                height: '38px',
                                padding: '0 10px',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: '13px',
                                fontWeight: '500',
                                color: 'var(--text-primary)',
                                boxShadow: 'inset 0 -2px 0 var(--text-primary)',
                              }}
                            >
                              Public link
                            </span>
                          </div>
                        </div>{' '}
                        <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {' '}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              height: '38px',
                              padding: '0 4px 0 12px',
                              borderRadius: '8px',
                              background: 'var(--bg-sunk)',
                            }}
                          >
                            <span
                              style={{ flex: '1', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                              https://portal.halden.co/s/8fK2-q1Lm
                            </span>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                height: '30px',
                                padding: '0 10px',
                                borderRadius: '6px',
                                background: 'var(--bg-page)',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              <DS.Icon name="copy" size={13} />
                              Copy
                            </span>
                          </div>{' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Who can open it</span>
                            <div
                              style={{
                                display: 'inline-flex',
                                gap: '2px',
                                padding: '3px',
                                borderRadius: '10px',
                                background: 'var(--bg-sunk)',
                                alignSelf: 'flex-start',
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
                                  whiteSpace: 'nowrap',
                                  background: 'transparent',
                                  color: 'var(--text-primary)',
                                }}
                              >
                                Anyone with the link
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
                                  whiteSpace: 'nowrap',
                                  background: 'var(--brand-field)',
                                  color: 'var(--ink)',
                                }}
                              >
                                People who sign the NDA
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
                                  whiteSpace: 'nowrap',
                                  background: 'transparent',
                                  color: 'var(--text-primary)',
                                }}
                              >
                                Workspace members
                              </span>
                            </div>
                          </div>{' '}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontSize: '13px', fontWeight: '500' }}>Password</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Share it separately</span>
                            </div>
                            <DS.Switch checked={false} />
                          </div>{' '}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontSize: '13px', fontWeight: '500' }}>Expires</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>14 days · 8 Oct 2026</span>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '500', textDecoration: 'underline' }}>Change</span>
                          </div>{' '}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              background: 'var(--bg-sunk)',
                              fontSize: '12px',
                            }}
                          >
                            <span style={{ flex: '1' }}>Opened 14 times by 6 people · last 2 h ago</span>
                            <span style={{ fontWeight: '600', textDecoration: 'underline' }}>Activity</span>
                          </div>{' '}
                        </div>{' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '14px 24px',
                            borderTop: '1px solid var(--rule)',
                          }}
                        >
                          <button
                            type="button"
                            style={{
                              height: '32px',
                              padding: '0 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--rule)',
                              background: 'transparent',
                              color: 'var(--status-error-text)',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '13px',
                              fontWeight: '600',
                            }}
                          >
                            Turn off link
                          </button>
                          <div style={{ flex: '1' }} />
                          <DS.Button size="sm" ground={v.ground}>
                            Done
                          </DS.Button>
                        </div>
                      </div>
                    </div>{' '}
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
                      }}
                    >
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>已有访问的人</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '28px',
                            height: '28px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '10px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          LW
                        </span>
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.35' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>Li Wei · you</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Owner of these files</span>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500' }}>
                          Owner
                          <DS.Icon name="chevron-down" size={12} />
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '28px',
                            height: '28px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '10px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          AK
                        </span>
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.35' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>Anna Kowalski</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Harbour Ventures · via your share</span>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500' }}>
                          Can comment
                          <DS.Icon name="chevron-down" size={12} />
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '28px',
                            height: '28px',
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '10px',
                            fontWeight: '600',
                            flex: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          王
                        </span>
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.35' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>王志远</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Forwarded by Anna · 2 days ago</span>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500' }}>
                          Can view
                          <DS.Icon name="chevron-down" size={12} />
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        转发链上的人显示来源。上游撤销时，下游一并失效，并在这里提示。
                      </span>
                    </div>{' '}
                  </div>
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s17 ? (
            <>
              <section
                id="s17"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>17 / 看板 · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>看板和列表是同一份数据的两种视图</h2>
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '44em' }}>
                    用于 Ops 收件箱的看板视图和“我的客户”的阶段管理。拖拽之外总有键盘和选择器替代。
                  </p>
                </div>{' '}
                <div
                  style={{
                    background: 'var(--bg-page)',
                    border: '1px solid var(--rule)',
                    borderRadius: '16px',
                    padding: '20px',
                    overflowX: 'auto',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', minWidth: 'max-content' }}>
                    {' '}
                    <div
                      style={{
                        width: '230px',
                        flex: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '10px',
                        borderRadius: '16px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 4px 4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>Invited</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>24</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)', display: 'inline-flex' }}>
                          <DS.Icon name="more-horizontal" size={14} />
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'var(--bg-page)',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '24px',
                              height: '24px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '9px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: 'none',
                            }}
                          >
                            王
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              flex: '1',
                              minWidth: '0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            王志远
                          </span>
                          <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--brand-mark)' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span>远川资本</span>
                          <span>9 d</span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'var(--bg-page)',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '24px',
                              height: '24px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '9px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: 'none',
                            }}
                          >
                            JP
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              flex: '1',
                              minWidth: '0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            James Park
                          </span>
                          <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--brand-mark)' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span>Northgate LP</span>
                          <span>6 d</span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'var(--bg-page)',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '24px',
                              height: '24px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '9px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: 'none',
                            }}
                          >
                            MR
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              flex: '1',
                              minWidth: '0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Maria Rossi
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span>Vela FO</span>
                          <span>2 d</span>
                        </div>
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        width: '230px',
                        flex: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '10px',
                        borderRadius: '16px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 4px 4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>NDA signed</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>15</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)', display: 'inline-flex' }}>
                          <DS.Icon name="more-horizontal" size={14} />
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'var(--bg-page)',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '24px',
                              height: '24px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '9px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: 'none',
                            }}
                          >
                            CL
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              flex: '1',
                              minWidth: '0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Chen Lu
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span>Meridian</span>
                          <span>16 d</span>
                        </div>
                      </div>
                      <div
                        style={{
                          height: '64px',
                          borderRadius: '12px',
                          border: '1.5px dashed var(--text-primary)',
                          background: 'var(--brand-field)',
                        }}
                      />
                    </div>{' '}
                    <div
                      style={{
                        width: '230px',
                        flex: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '10px',
                        borderRadius: '16px',
                        background: 'var(--bg-sunk)',
                        boxShadow: 'inset 0 0 0 1.5px var(--rule)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 4px 4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>Due diligence</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>6</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)', display: 'inline-flex' }}>
                          <DS.Icon name="more-horizontal" size={14} />
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'var(--bg-page)',
                          boxShadow: '0 0 0 1.5px var(--text-primary)',
                          transform: 'translateX(10px)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '24px',
                              height: '24px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '9px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: 'none',
                            }}
                          >
                            AK
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              flex: '1',
                              minWidth: '0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Anna Kowalski
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span>Harbour Ventures</span>
                          <span>4 d</span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'var(--bg-page)',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '24px',
                              height: '24px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '9px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: 'none',
                            }}
                          >
                            DH
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              flex: '1',
                              minWidth: '0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            David Hale
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span>Hale FO</span>
                          <span>1 d</span>
                        </div>
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        width: '230px',
                        flex: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '10px',
                        borderRadius: '16px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 4px 4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>Term sheet</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>2</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)', display: 'inline-flex' }}>
                          <DS.Icon name="more-horizontal" size={14} />
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'var(--bg-page)',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              position: 'relative',
                              width: '24px',
                              height: '24px',
                              borderRadius: '999px',
                              background: 'var(--bg-well)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '9px',
                              fontWeight: '600',
                              flex: 'none',
                              boxShadow: 'none',
                            }}
                          >
                            SN
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              flex: '1',
                              minWidth: '0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Sofia Novak
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span>Brightwater</span>
                          <span>2 d</span>
                        </div>
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        width: '44px',
                        flex: 'none',
                        alignSelf: 'stretch',
                        borderRadius: '16px',
                        background: 'var(--bg-sunk)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 0',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>3</span>
                      <span style={{ writingMode: 'vertical-rl', fontSize: '13px', fontWeight: '500' }}>Declined</span>
                    </div>{' '}
                  </div>
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  {' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>换阶段 · 不拖拽</h3>
                    <div
                      style={{
                        width: '280px',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        background: 'var(--bg-page)',
                        border: '1px solid var(--rule)',
                        borderRadius: '12px',
                        padding: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1px',
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', padding: '6px 8px 4px' }}>
                        Move Anna Kowalski to
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '7px 8px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ width: '14px' }} />
                        Invited
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '7px 8px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ width: '14px' }} />
                        NDA signed
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '7px 8px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <DS.Icon name="check" size={14} />
                        Due diligence<span style={{ marginLeft: 'auto', fontSize: '11px' }}>Current</span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '7px 8px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: 'var(--brand-field)',
                          color: 'var(--ink)',
                        }}
                      >
                        <span style={{ width: '14px' }} />
                        Term sheet
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '7px 8px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span style={{ width: '14px' }} />
                        Declined
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      卡片菜单、⇧M 快捷键和手机上的长按都打开这个选择器。
                    </span>
                  </div>{' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>规则</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>拖拽</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        卡片被拿起时墨色描边并稍微右移，目标列出现品牌色虚线落点；不旋转、不加阴影。
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>门槛</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        有进入条件的阶段（如需先签保密协议）不满足时，落点不出现，悬停显示原因。
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>计数</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        列头显示数量；列可以收起成竖条，收起状态会记住。
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>需关注</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        卡片右上角的品牌色点和列表视图的“需关注”一致。
                      </span>
                    </div>
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s18 ? (
            <>
              <section
                id="s18"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>18 / 编辑 · 版本 · 签署 · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>编辑器、版本对比和签名字段</h2>
                </div>{' '}
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
                  }}
                >
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>富文本工具栏</h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      padding: '4px',
                      borderRadius: '10px',
                      background: 'var(--bg-page)',
                      boxShadow: 'inset 0 0 0 1px var(--rule)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '30px',
                        padding: '0 8px',
                        fontSize: '13px',
                        fontWeight: '500',
                      }}
                    >
                      Paragraph
                      <DS.Icon name="chevron-down" size={12} />
                    </span>
                    <span style={{ width: '1px', height: '18px', background: 'var(--rule)', margin: '0 4px' }} />
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'var(--brand-field)',
                        color: 'var(--ink)',
                      }}
                    >
                      <DS.Icon name="bold" size={15} />
                    </span>
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="italic" size={15} />
                    </span>
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="underline" size={15} />
                    </span>
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="link" size={15} />
                    </span>
                    <span style={{ width: '1px', height: '18px', background: 'var(--rule)', margin: '0 4px' }} />
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="list" size={15} />
                    </span>
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="list-ordered" size={15} />
                    </span>
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="quote" size={15} />
                    </span>
                    <span style={{ width: '1px', height: '18px', background: 'var(--rule)', margin: '0 4px' }} />
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="image" size={15} />
                    </span>
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="table" size={15} />
                    </span>
                    <span style={{ width: '1px', height: '18px', background: 'var(--rule)', margin: '0 4px' }} />
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '30px',
                        padding: '0 10px',
                        borderRadius: '7px',
                        background: 'var(--ink)',
                        color: 'var(--linen)',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      <span style={{ color: 'var(--brand-mark)', display: 'inline-flex' }}>
                        <DS.Icon name="sparkles" size={13} />
                      </span>
                      Ask Agent
                    </span>
                    <div style={{ flex: '1' }} />
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="message-square" size={15} />
                    </span>
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <DS.Icon name="history" size={15} />
                    </span>
                  </div>{' '}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '24px', alignItems: 'start' }}>
                    {' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', paddingLeft: '36px' }}>
                      {' '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '0',
                          top: '2px',
                          display: 'inline-flex',
                          gap: '2px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <DS.Icon name="plus" size={14} />
                        <DS.Icon name="grip-vertical" size={14} />
                      </span>{' '}
                      <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.75' }}>
                        {'Net asset value closed the quarter at '}
                        <span style={{ background: 'var(--yellow-light)', color: 'var(--ink)', boxShadow: 'inset 0 -2px 0 var(--ink)' }}>
                          £184.9m after two new commitments
                        </span>
                        {' from family offices in Hong Kong.'}
                      </p>{' '}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignSelf: 'flex-start',
                          alignItems: 'center',
                          gap: '2px',
                          padding: '4px',
                          borderRadius: '10px',
                          background: 'var(--ink)',
                          color: 'var(--linen)',
                        }}
                      >
                        <span style={{ width: '28px', height: '28px', display: 'grid', placeItems: 'center' }}>
                          <DS.Icon name="bold" size={14} />
                        </span>
                        <span style={{ width: '28px', height: '28px', display: 'grid', placeItems: 'center' }}>
                          <DS.Icon name="italic" size={14} />
                        </span>
                        <span style={{ width: '28px', height: '28px', display: 'grid', placeItems: 'center' }}>
                          <DS.Icon name="link" size={14} />
                        </span>
                        <span style={{ width: '1px', height: '16px', background: 'var(--rule-inverse)', margin: '0 3px' }} />
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            height: '28px',
                            padding: '0 8px',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          <DS.Icon name="message-square" size={13} />
                          Comment
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            height: '28px',
                            padding: '0 8px',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          <span style={{ color: 'var(--brand-mark)', display: 'inline-flex' }}>
                            <DS.Icon name="sparkles" size={13} />
                          </span>
                          Rewrite
                        </span>
                      </div>{' '}
                    </div>{' '}
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      选中文字后出现墨色浮动条，只放格式、评论和 Agent 改写。段落左侧悬停出现 +
                      和拖动柄；输入“/”插入块。工具栏在滚动时吸顶。
                    </span>{' '}
                  </div>
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  {' '}
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
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>版本对比</h3>
                      <div style={{ flex: '1' }} />
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '30px',
                          padding: '0 10px',
                          borderRadius: '8px',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        v3 · today
                        <DS.Icon name="chevron-down" size={12} />
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>vs</span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '30px',
                          padding: '0 10px',
                          borderRadius: '8px',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        v2 · yesterday
                        <DS.Icon name="chevron-down" size={12} />
                      </span>
                    </div>{' '}
                    <div
                      style={{
                        display: 'inline-flex',
                        gap: '2px',
                        padding: '3px',
                        borderRadius: '10px',
                        background: 'var(--bg-sunk)',
                        alignSelf: 'flex-start',
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
                          whiteSpace: 'nowrap',
                          background: 'var(--brand-field)',
                          color: 'var(--ink)',
                        }}
                      >
                        Inline
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
                          whiteSpace: 'nowrap',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        Side by side
                      </span>
                    </div>{' '}
                    <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.75' }}>
                      {'Net asset value closed the quarter at '}
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)' }}>£182.4m</span>{' '}
                      <span style={{ background: 'var(--yellow-light)', color: 'var(--ink)', boxShadow: 'inset 0 -2px 0 var(--ink)' }}>
                        £184.9m
                      </span>
                      {'. Deployment stayed measured. '}
                      <span style={{ background: 'var(--yellow-light)', color: 'var(--ink)', boxShadow: 'inset 0 -2px 0 var(--ink)' }}>
                        The exit returned 2.3 times invested capital.
                      </span>
                    </p>{' '}
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            width: '14px',
                            height: '10px',
                            background: 'var(--yellow-light)',
                            boxShadow: 'inset 0 -2px 0 var(--ink)',
                          }}
                        />
                        Added
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ textDecoration: 'line-through' }}>abc</span>Removed
                      </span>
                      <span>2 changes · 1 image replaced</span>
                    </div>{' '}
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      新增为浅黄底加墨色下划线，删除为灰色删除线；不用红绿。图片和表格的变化以“已替换”标签标出。
                    </span>
                  </div>{' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>签名字段与签署</h3>{' '}
                    <div style={{ position: 'relative', padding: '20px', borderRadius: '12px', background: 'var(--bg-sunk)' }}>
                      <div
                        style={{
                          background: 'var(--paper)',
                          borderRadius: '6px',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                          color: '#111',
                        }}
                      >
                        {' '}
                        <div style={{ height: '5px', width: '80%', borderRadius: '3px', background: '#E3E0DA' }} />
                        <div style={{ height: '5px', width: '60%', borderRadius: '3px', background: '#E3E0DA' }} />{' '}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
                          {' '}
                          <div
                            style={{
                              position: 'relative',
                              height: '56px',
                              borderRadius: '6px',
                              border: '1.5px dashed #111',
                              background: '#FFE3A0',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '13px',
                              fontWeight: '600',
                            }}
                          >
                            Sign here
                            <span
                              style={{
                                position: 'absolute',
                                left: '-10px',
                                top: '-10px',
                                fontSize: '10px',
                                fontWeight: '600',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: '#111',
                                color: '#FFD166',
                              }}
                            >
                              Required
                            </span>
                          </div>{' '}
                          <div
                            style={{
                              height: '56px',
                              borderRadius: '6px',
                              border: '1px solid rgba(17,17,17,.1)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              padding: '0 10px',
                            }}
                          >
                            <span style={{ fontSize: '10px', color: '#696969' }}>Date</span>
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>24 Sep 2026</span>
                          </div>{' '}
                        </div>{' '}
                        <div
                          style={{
                            height: '56px',
                            borderRadius: '6px',
                            borderBottom: '1px solid #111',
                            display: 'flex',
                            alignItems: 'flex-end',
                            padding: '0 4px 6px',
                            gap: '10px',
                          }}
                        >
                          <span style={{ fontSize: '22px', fontWeight: '500', letterSpacing: '-.01em' }}>Li Wei</span>
                          <span style={{ fontSize: '10px', color: '#696969', paddingBottom: '4px' }}>
                            Signed 24 Sep 2026 · 10:42 · IP logged
                          </span>
                        </div>{' '}
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', flex: '1' }}>2 of 3 fields · Next: Initials, page 4</span>
                      <DS.Button variant="secondary" size="sm" ground={v.ground}>
                        Next field
                      </DS.Button>
                      <DS.Button size="sm" ground={v.ground}>
                        Finish
                      </DS.Button>
                    </div>{' '}
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      签署模式隐藏外壳和操作栏，只保留进度与“下一处”。签名方式：输入、手写、上传；采用前需勾选“这是我的法律签名”。
                    </span>
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s19 ? (
            <>
              <section
                id="s19"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>19 / 表单扩展 · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    多步表单、金额、日期范围、标签和品牌色
                  </h2>
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  {' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>多步向导</h3>{' '}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '6px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ height: '4px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)' }}>1 Details</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ height: '4px', borderRadius: '999px', background: 'var(--brand-mark)' }} />
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)' }}>2 People</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ height: '4px', borderRadius: '999px', background: 'var(--bg-well)' }} />
                        <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-secondary)' }}>3 Documents</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ height: '4px', borderRadius: '999px', background: 'var(--bg-well)' }} />
                        <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-secondary)' }}>4 Review</span>
                      </div>
                    </div>{' '}
                    <span style={{ fontSize: '18px', fontWeight: '500' }}>Who is involved?</span>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Main applicant</span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '38px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                          boxShadow: 'none',
                          fontSize: '14px',
                        }}
                      >
                        王志远
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Dependants</span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '38px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                          boxShadow: 'none',
                          fontSize: '14px',
                        }}
                      >
                        <span style={{ color: 'var(--text-secondary)' }}>Add a person…</span>
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--rule-soft)',
                      }}
                    >
                      <DS.Button variant="ghost" size="sm" ground={v.ground}>
                        Back
                      </DS.Button>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: '1' }}>Saved as draft · 10:41</span>
                      <DS.Button size="sm" ground={v.ground}>
                        Continue
                      </DS.Button>
                    </div>{' '}
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      每步自动存草稿。已完成的步骤可以点回去修改；“Review”列出全部答案，每项可编辑。
                    </span>
                  </div>{' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>金额与数字</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Commitment</span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '38px',
                          borderRadius: '8px',
                          background: 'var(--bg-page)',
                          boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                          overflow: 'hidden',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            height: '100%',
                            padding: '0 10px',
                            background: 'var(--bg-sunk)',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          GBP
                          <DS.Icon name="chevron-down" size={12} />
                        </span>
                        <span
                          style={{ flex: '1', padding: '0 12px', fontSize: '14px', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}
                        >
                          1,250,000.00
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        £1.25m · typed 1.25m is accepted
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Drag-along threshold</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <DS.IconButton name="minus" label="Decrease" variant="secondary" size={38} />
                        <div
                          style={{
                            width: '90px',
                            height: '38px',
                            borderRadius: '8px',
                            background: 'var(--bg-sunk)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            fontSize: '14px',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          75<span style={{ color: 'var(--text-secondary)' }}>%</span>
                        </div>
                        <DS.IconButton name="plus" label="Increase" variant="secondary" size={38} />
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Valuation</span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '38px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          background: 'var(--status-error-wash)',
                          fontSize: '14px',
                          color: 'var(--ink)',
                        }}
                      >
                        £ 12,5OO,000
                      </div>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--status-error-text)' }}>Use digits only: the O in 5OO is a letter.</span>
                      </span>
                    </div>{' '}
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      数字右对齐、等宽。失焦时补千分位；接受 1.25m、1,250k 这类写法。
                    </span>
                  </div>{' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>日期范围</h3>{' '}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: 'var(--bg-sunk)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        Last 7 days
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
                          background: 'var(--bg-sunk)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        This month
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
                          background: 'var(--bg-sunk)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        This quarter
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
                          background: 'var(--brand-field)',
                          color: 'var(--ink)',
                        }}
                      >
                        Custom
                      </span>
                    </div>{' '}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '38px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-page)',
                          boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                          fontSize: '14px',
                        }}
                      >
                        6 Oct 2026
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '38px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                          boxShadow: 'none',
                          fontSize: '14px',
                        }}
                      >
                        17 Oct 2026
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid var(--rule)',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>October 2026</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '2px' }}>
                        <span />
                        <span />
                        <span />
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          1
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          2
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          3
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          4
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          5
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '6px',
                            background: 'var(--ink)',
                            color: 'var(--linen)',
                            fontWeight: '600',
                          }}
                        >
                          6
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                            fontWeight: '400',
                          }}
                        >
                          7
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                            fontWeight: '400',
                          }}
                        >
                          8
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                            fontWeight: '400',
                          }}
                        >
                          9
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                            fontWeight: '400',
                          }}
                        >
                          10
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                            fontWeight: '400',
                          }}
                        >
                          11
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                            fontWeight: '400',
                          }}
                        >
                          12
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                            fontWeight: '400',
                          }}
                        >
                          13
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                            fontWeight: '400',
                          }}
                        >
                          14
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                            fontWeight: '400',
                          }}
                        >
                          15
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                            fontWeight: '400',
                          }}
                        >
                          16
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '6px',
                            background: 'var(--ink)',
                            color: 'var(--linen)',
                            fontWeight: '600',
                          }}
                        >
                          17
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          18
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          19
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          20
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          21
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          22
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          23
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          24
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          25
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          26
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          27
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          28
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          29
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          30
                        </span>
                        <span
                          style={{
                            height: '28px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: '0',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: '400',
                          }}
                        >
                          31
                        </span>
                      </div>
                    </div>
                  </div>{' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>标签输入</h3>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '6px',
                        minHeight: '38px',
                        padding: '5px 8px',
                        borderRadius: '8px',
                        background: 'var(--bg-page)',
                        boxShadow: 'inset 0 0 0 1px var(--text-primary)',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '26px',
                          padding: '0 4px 0 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: 'var(--bg-sunk)',
                          boxShadow: 'none',
                        }}
                      >
                        Series A<DS.Icon name="x" size={12} />
                      </span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '26px',
                          padding: '0 4px 0 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: 'var(--bg-sunk)',
                          boxShadow: 'none',
                        }}
                      >
                        Legal
                        <DS.Icon name="x" size={12} />
                      </span>
                      <span style={{ fontSize: '13px' }}>due dil|</span>
                    </div>{' '}
                    <div
                      style={{
                        width: '280px',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        background: 'var(--bg-page)',
                        border: '1px solid var(--rule)',
                        borderRadius: '12px',
                        padding: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1px',
                      }}
                    >
                      <div
                        style={{
                          padding: '7px 8px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: 'var(--brand-field)',
                          color: 'var(--ink)',
                        }}
                      >
                        {'Due diligence '}
                        <span style={{ fontSize: '12px' }}>· 14 documents</span>
                      </div>
                      <div style={{ padding: '7px 8px', fontSize: '13px' }}>Due diligence 2025</div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '7px 8px',
                          fontSize: '13px',
                          borderTop: '1px solid var(--rule-soft)',
                        }}
                      >
                        <DS.Icon name="plus" size={13} />
                        Create “due dil”
                      </div>
                    </div>{' '}
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      Enter 或逗号确认；已有标签优先；新建前显示“创建”。标签只是属性，用亚麻底，不用状态色。
                    </span>
                  </div>{' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>品牌色 · 工作区设置</h3>{' '}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#D6E4DA',
                          boxShadow: '0 0 0 2px var(--bg-page), 0 0 0 4px var(--text-primary)',
                        }}
                      />
                      <span
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#E6DDF0',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                        }}
                      />
                      <span
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#DCE6F0',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                        }}
                      />
                      <span
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#F0E0D6',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                        }}
                      />
                      <span
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#FFE3A0',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                        }}
                      />
                      <span
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <DS.Icon name="plus" size={14} />
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Field colour</span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '38px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                          boxShadow: 'none',
                          fontSize: '14px',
                        }}
                      >
                        <span style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#D6E4DA' }} />
                        #D6E4DA
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '14px',
                        borderRadius: '12px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Derived</span>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span
                          style={{
                            height: '30px',
                            padding: '0 12px',
                            borderRadius: '8px',
                            background: '#D6E4DA',
                            color: 'var(--ink)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          Selected
                        </span>
                        <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#8FBF9F' }} />
                        <span style={{ fontSize: '12px' }}>Mark #8FBF9F</span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: '500' }}>Ink on field 13.1 : 1 ✓</span>
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'var(--status-error-wash)',
                        color: 'var(--ink)',
                        fontSize: '12px',
                      }}
                    >
                      <span style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#2F4B8C', flex: 'none' }} />
                      #2F4B8C is too dark for a field. Ink text would drop to 2.6 : 1.
                    </div>{' '}
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      只收一个浅色“面积色”，标记色由它自动加深得到。墨色文字对比低于 7:1 时拒绝保存并说明原因。
                    </span>
                  </div>
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s20 ? (
            <>
              <section
                id="s20"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>20 / 产品图表 · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    图表以墨色为底，只有要看的那一项用品牌色
                  </h2>
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '44em' }}>
                    用于营销站点的运营数据、我的客户漏斗和工作区用量。每张图最多两类颜色，超过两类用亚麻到墨的明度阶梯。
                  </p>
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'var(--bg-sunk)',
                    }}
                  >
                    <span style={{ fontSize: '28px', fontWeight: '500', fontVariantNumeric: 'tabular-nums', letterSpacing: '-.01em' }}>
                      2,340
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '500' }}>Article views</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>+12% on last month</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'var(--bg-sunk)',
                    }}
                  >
                    <span style={{ fontSize: '28px', fontWeight: '500', fontVariantNumeric: 'tabular-nums', letterSpacing: '-.01em' }}>
                      1,284
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '500' }}>Subscribers</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>+31 this week</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'var(--bg-sunk)',
                    }}
                  >
                    <span style={{ fontSize: '28px', fontWeight: '500', fontVariantNumeric: 'tabular-nums', letterSpacing: '-.01em' }}>
                      48%
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '500' }}>Email open rate</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Median 44% across sites</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'var(--bg-sunk)',
                    }}
                  >
                    <span style={{ fontSize: '28px', fontWeight: '500', fontVariantNumeric: 'tabular-nums', letterSpacing: '-.01em' }}>
                      —
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '500' }}>Replies</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>No data yet</span>
                  </div>
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  {' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>柱状图 · 每周浏览</h3>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '6px',
                        height: '160px',
                        paddingTop: '30px',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <div style={{ width: '100%', height: '38%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      </div>
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <div style={{ width: '100%', height: '44%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      </div>
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <div style={{ width: '100%', height: '41%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      </div>
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <div style={{ width: '100%', height: '52%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      </div>
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <div style={{ width: '100%', height: '49%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      </div>
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <div style={{ width: '100%', height: '61%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      </div>
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <div style={{ width: '100%', height: '58%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      </div>
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <div style={{ width: '100%', height: '66%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      </div>
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <div style={{ width: '100%', height: '63%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      </div>
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <div style={{ width: '100%', height: '72%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      </div>
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <div style={{ width: '100%', height: '70%', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      </div>
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          height: '100%',
                          justifyContent: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: '-28px',
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: '3px 6px',
                            borderRadius: '6px',
                            background: 'var(--ink)',
                            color: 'var(--linen)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          2,340
                        </span>
                        <div style={{ width: '100%', height: '86%', borderRadius: '6px', background: 'var(--brand-mark)' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span style={{ flex: '1', textAlign: 'center' }}>W28</span>
                      <span style={{ flex: '1', textAlign: 'center' }} />
                      <span style={{ flex: '1', textAlign: 'center' }} />
                      <span style={{ flex: '1', textAlign: 'center' }}>W31</span>
                      <span style={{ flex: '1', textAlign: 'center' }} />
                      <span style={{ flex: '1', textAlign: 'center' }} />
                      <span style={{ flex: '1', textAlign: 'center' }}>W34</span>
                      <span style={{ flex: '1', textAlign: 'center' }} />
                      <span style={{ flex: '1', textAlign: 'center' }} />
                      <span style={{ flex: '1', textAlign: 'center' }}>W37</span>
                      <span style={{ flex: '1', textAlign: 'center' }} />
                      <span style={{ flex: '1', textAlign: 'center' }} />
                    </div>
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      圆角 6px，靠间距分隔，不画网格线。当前一项用品牌色，悬停显示数值。
                    </span>
                  </div>{' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>折线 · 打开率对比</h3>
                    <div style={{ color: 'var(--text-primary)' }}>
                      <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: '100%', height: '120px', display: 'block' }}>
                        <polyline
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          vectorEffect="non-scaling-stroke"
                          points="0.00,32.00 9.09,29.60 18.18,31.40 27.27,24.80 36.36,26.00 45.45,21.20 54.55,22.40 63.64,17.00 72.73,14.00 81.82,15.20 90.91,9.20 100.00,5.60"
                        />
                        <polyline
                          fill="none"
                          stroke="var(--grey)"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                          vectorEffect="non-scaling-stroke"
                          points="0.00,33.20 9.09,31.28 18.18,32.72 27.27,27.44 36.36,28.40 45.45,24.56 54.55,25.52 63.64,21.20 72.73,18.80 81.82,19.76 90.91,14.96 100.00,12.08"
                        />
                      </svg>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '14px', height: '2px', background: 'var(--text-primary)' }} />
                        This site
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <span style={{ width: '14px', borderTop: '1px dashed var(--grey)' }} />
                        All sites median
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      对比项用虚线灰色，不引入第二种颜色。
                    </span>
                  </div>{' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>构成 · 流量来源</h3>
                    <div style={{ display: 'flex', height: '28px', gap: '3px' }}>
                      <div style={{ flex: '46', borderRadius: '6px', background: 'var(--text-primary)' }} />
                      <div style={{ flex: '28', borderRadius: '6px', background: 'var(--grey)' }} />
                      <div style={{ flex: '16', borderRadius: '6px', background: 'var(--sunk-3)' }} />
                      <div style={{ flex: '10', borderRadius: '6px', background: 'var(--sunk-2)' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '3px',
                            background: 'var(--text-primary)',
                            boxShadow: 'inset 0 0 0 1px var(--rule-soft)',
                          }}
                        />
                        Email<span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', fontWeight: '500' }}>46%</span>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '3px',
                            background: 'var(--grey)',
                            boxShadow: 'inset 0 0 0 1px var(--rule-soft)',
                          }}
                        />
                        Direct<span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', fontWeight: '500' }}>28%</span>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '3px',
                            background: 'var(--sunk-3)',
                            boxShadow: 'inset 0 0 0 1px var(--rule-soft)',
                          }}
                        />
                        LinkedIn<span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', fontWeight: '500' }}>16%</span>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '3px',
                            background: 'var(--sunk-2)',
                            boxShadow: 'inset 0 0 0 1px var(--rule-soft)',
                          }}
                        />
                        Search<span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', fontWeight: '500' }}>10%</span>
                      </span>
                    </div>
                  </div>{' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>漏斗</h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px minmax(0, 1fr) 32px',
                        gap: '10px',
                        alignItems: 'center',
                        fontSize: '12px',
                      }}
                    >
                      <span>Invited</span>
                      <div style={{ height: '18px', borderRadius: '5px', background: 'var(--bg-sunk)' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '5px', background: 'var(--text-primary)' }} />
                      </div>
                      <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '500' }}>24</span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px minmax(0, 1fr) 32px',
                        gap: '10px',
                        alignItems: 'center',
                        fontSize: '12px',
                      }}
                    >
                      <span>NDA signed</span>
                      <div style={{ height: '18px', borderRadius: '5px', background: 'var(--bg-sunk)' }}>
                        <div style={{ width: '62%', height: '100%', borderRadius: '5px', background: 'var(--brand-mark)' }} />
                      </div>
                      <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '500' }}>15</span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px minmax(0, 1fr) 32px',
                        gap: '10px',
                        alignItems: 'center',
                        fontSize: '12px',
                      }}
                    >
                      <span>Opened data room</span>
                      <div style={{ height: '18px', borderRadius: '5px', background: 'var(--bg-sunk)' }}>
                        <div style={{ width: '46%', height: '100%', borderRadius: '5px', background: 'var(--text-primary)' }} />
                      </div>
                      <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '500' }}>11</span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px minmax(0, 1fr) 32px',
                        gap: '10px',
                        alignItems: 'center',
                        fontSize: '12px',
                      }}
                    >
                      <span>Due diligence</span>
                      <div style={{ height: '18px', borderRadius: '5px', background: 'var(--bg-sunk)' }}>
                        <div style={{ width: '25%', height: '100%', borderRadius: '5px', background: 'var(--text-primary)' }} />
                      </div>
                      <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '500' }}>6</span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px minmax(0, 1fr) 32px',
                        gap: '10px',
                        alignItems: 'center',
                        fontSize: '12px',
                      }}
                    >
                      <span>Term sheet</span>
                      <div style={{ height: '18px', borderRadius: '5px', background: 'var(--bg-sunk)' }}>
                        <div style={{ width: '8%', height: '100%', borderRadius: '5px', background: 'var(--text-primary)' }} />
                      </div>
                      <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '500' }}>2</span>
                    </div>
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      和“我的客户”页同一组件。流失最大的一步用品牌色。
                    </span>
                  </div>{' '}
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>空、加载、出错</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      <div
                        style={{
                          height: '90px',
                          borderRadius: '10px',
                          background: 'var(--bg-sunk)',
                          display: 'grid',
                          placeItems: 'center',
                          textAlign: 'center',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          padding: '8px',
                        }}
                      >
                        No views yet · appears after the first visit
                      </div>
                      <div
                        style={{
                          height: '90px',
                          borderRadius: '10px',
                          background: 'var(--bg-sunk)',
                          display: 'flex',
                          alignItems: 'flex-end',
                          gap: '4px',
                          padding: '12px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div style={{ flex: '1', height: '40%', borderRadius: '4px', background: 'var(--bg-well)' }} />
                        <div style={{ flex: '1', height: '60%', borderRadius: '4px', background: 'var(--bg-well)' }} />
                        <div style={{ flex: '1', height: '50%', borderRadius: '4px', background: 'var(--bg-well)' }} />
                        <div style={{ flex: '1', height: '70%', borderRadius: '4px', background: 'var(--bg-well)' }} />
                        <div style={{ flex: '1', height: '55%', borderRadius: '4px', background: 'var(--bg-well)' }} />
                      </div>
                      <div
                        style={{
                          height: '90px',
                          borderRadius: '10px',
                          background: 'var(--status-error-wash)',
                          color: 'var(--ink)',
                          display: 'grid',
                          placeItems: 'center',
                          textAlign: 'center',
                          fontSize: '12px',
                          padding: '8px',
                        }}
                      >
                        Couldn't load · Retry
                      </div>
                    </div>
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s21 ? (
            <>
              <section
                id="s21"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>21 / 系统级 · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    通知、快捷键、预览横幅、错误页和上手引导
                  </h2>
                </div>{' '}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: 'var(--ink)',
                    color: 'var(--linen)',
                  }}
                >
                  <DS.Icon name="eye" size={15} />
                  <span style={{ fontSize: '13px', flex: '1' }}>
                    <span style={{ fontWeight: '600', color: 'var(--yellow-accent)' }}>Previewing as Li Wei</span>
                    {' · Halden Capital · read-only. Actions are disabled and nothing is recorded.'}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '600', textDecoration: 'underline' }}>Exit preview</span>
                </div>{' '}
                <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                  “以客户身份预览”横幅固定在页顶，占据整行，不可关闭，只能退出。离线时同一位置显示“Offline · changes will sync when you
                  reconnect”。
                </span>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
                  {' '}
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
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>通知中心</h3>
                      <div style={{ flex: '1' }} />
                      <span style={{ fontSize: '12px', fontWeight: '500', textDecoration: 'underline' }}>Mark all read</span>
                      <DS.IconButton name="settings" label="Settings" variant="ghost" size={28} />
                    </div>
                    <div
                      style={{
                        display: 'inline-flex',
                        gap: '2px',
                        padding: '3px',
                        borderRadius: '10px',
                        background: 'var(--bg-sunk)',
                        alignSelf: 'flex-start',
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
                          whiteSpace: 'nowrap',
                          background: 'var(--brand-field)',
                          color: 'var(--ink)',
                        }}
                      >
                        All
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
                          whiteSpace: 'nowrap',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        Mentions · 1
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
                          whiteSpace: 'nowrap',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        Tasks
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Today</span>
                    <div style={{ display: 'flex', gap: '10px', padding: '10px 8px', borderRadius: '8px', background: 'var(--yellow-12)' }}>
                      <span
                        style={{
                          position: 'relative',
                          width: '28px',
                          height: '28px',
                          borderRadius: '999px',
                          background: 'var(--bg-well)',
                          color: 'var(--text-primary)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '10px',
                          fontWeight: '600',
                          flex: 'none',
                          boxShadow: 'none',
                        }}
                      >
                        AK
                      </span>
                      <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '13px', lineHeight: '1.45' }}>
                          <b style={{ fontWeight: '500' }}>Anna Kowalski</b>
                          {' commented on Cap table.xlsx'}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>14:02 · Harbour Series A</span>
                      </div>
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '999px',
                          background: 'var(--brand-mark)',
                          marginTop: '6px',
                          flex: 'none',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', padding: '10px 8px', borderRadius: '8px', background: 'var(--yellow-12)' }}>
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'var(--ink)',
                          color: 'var(--brand-mark)',
                          display: 'grid',
                          placeItems: 'center',
                          flex: 'none',
                        }}
                      >
                        <DS.Icon name="sparkles" size={14} />
                      </span>
                      <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '13px', lineHeight: '1.45' }}>
                          {'Agent finished '}
                          <b style={{ fontWeight: '500' }}>Series A data room index</b>
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>11:30 · T-122</span>
                      </div>
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '999px',
                          background: 'var(--brand-mark)',
                          marginTop: '6px',
                          flex: 'none',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Earlier</span>
                    <div style={{ display: 'flex', gap: '10px', padding: '10px 8px', borderRadius: '8px', background: 'transparent' }}>
                      <span
                        style={{
                          position: 'relative',
                          width: '28px',
                          height: '28px',
                          borderRadius: '999px',
                          background: 'var(--bg-well)',
                          color: 'var(--text-primary)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '10px',
                          fontWeight: '600',
                          flex: 'none',
                          boxShadow: 'none',
                        }}
                      >
                        SO
                      </span>
                      <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '13px', lineHeight: '1.45' }}>
                          <b style={{ fontWeight: '500' }}>Sam Ortiz</b>
                          {' needs your approval on Q3 investor update'}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Yesterday · T-124</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      铃铛只汇总“与你有关”的事；每条都能直接跳到位置。通知设置里按类型开关邮件提醒。
                    </span>
                  </div>{' '}
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
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>快捷键面板</h3>
                      <div style={{ flex: '1' }} />
                      <span
                        style={{
                          display: 'inline-grid',
                          placeItems: 'center',
                          minWidth: '22px',
                          height: '22px',
                          padding: '0 5px',
                          borderRadius: '5px',
                          boxShadow: 'inset 0 0 0 1px var(--rule)',
                          fontSize: '11px',
                          fontWeight: '600',
                          boxSizing: 'border-box',
                        }}
                      >
                        ?
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Navigate</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', minHeight: '26px' }}>
                        <span style={{ flex: '1' }}>Search</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          ⌘
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>then</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          K
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', minHeight: '26px' }}>
                        <span style={{ flex: '1' }}>Go to documents</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          G
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>then</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          D
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', minHeight: '26px' }}>
                        <span style={{ flex: '1' }}>Go to inbox</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          G
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>then</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          I
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Act</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', minHeight: '26px' }}>
                        <span style={{ flex: '1' }}>New</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          N
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', minHeight: '26px' }}>
                        <span style={{ flex: '1' }}>Upload</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          U
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', minHeight: '26px' }}>
                        <span style={{ flex: '1' }}>Select</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          S
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', minHeight: '26px' }}>
                        <span style={{ flex: '1' }}>Comment</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          C
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Viewer</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', minHeight: '26px' }}>
                        <span style={{ flex: '1' }}>Zoom in / out</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          +
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>then</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          −
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', minHeight: '26px' }}>
                        <span style={{ flex: '1' }}>Present</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          P
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', minHeight: '26px' }}>
                        <span style={{ flex: '1' }}>Next page</span>
                        <span
                          style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            minWidth: '22px',
                            height: '22px',
                            padding: '0 5px',
                            borderRadius: '5px',
                            boxShadow: 'inset 0 0 0 1px var(--rule)',
                            fontSize: '11px',
                            fontWeight: '600',
                            boxSizing: 'border-box',
                          }}
                        >
                          J
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      按 ? 打开，也在头像菜单里。快捷键按当前页面过滤，不可用的不显示。
                    </span>
                  </div>{' '}
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
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>上手清单</h3>
                      <div style={{ flex: '1' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>3 of 5</span>
                    </div>
                    <div style={{ height: '4px', borderRadius: '999px', background: 'var(--bg-well)' }}>
                      <div style={{ width: '60%', height: '100%', borderRadius: '999px', background: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '32px', fontSize: '13px' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '999px',
                          background: 'var(--text-primary)',
                          boxShadow: 'none',
                          color: 'var(--bg-page)',
                          display: 'grid',
                          placeItems: 'center',
                          flex: 'none',
                        }}
                      >
                        <DS.Icon name="check" size={11} />
                      </span>
                      <span style={{ flex: '1', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>Add your logo</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '32px', fontSize: '13px' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '999px',
                          background: 'var(--text-primary)',
                          boxShadow: 'none',
                          color: 'var(--bg-page)',
                          display: 'grid',
                          placeItems: 'center',
                          flex: 'none',
                        }}
                      >
                        <DS.Icon name="check" size={11} />
                      </span>
                      <span style={{ flex: '1', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>Invite a colleague</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '32px', fontSize: '13px' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '999px',
                          background: 'var(--text-primary)',
                          boxShadow: 'none',
                          color: 'var(--bg-page)',
                          display: 'grid',
                          placeItems: 'center',
                          flex: 'none',
                        }}
                      >
                        <DS.Icon name="check" size={11} />
                      </span>
                      <span style={{ flex: '1', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>Create a project</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '32px', fontSize: '13px' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '999px',
                          background: 'transparent',
                          boxShadow: 'inset 0 0 0 1.5px var(--rule)',
                          color: 'var(--bg-page)',
                          display: 'grid',
                          placeItems: 'center',
                          flex: 'none',
                        }}
                      />
                      <span style={{ flex: '1', color: 'var(--text-primary)', textDecoration: 'none' }}>Connect Dropbox</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>Start</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '32px', fontSize: '13px' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '999px',
                          background: 'transparent',
                          boxShadow: 'inset 0 0 0 1.5px var(--rule)',
                          color: 'var(--bg-page)',
                          display: 'grid',
                          placeItems: 'center',
                          flex: 'none',
                        }}
                      />
                      <span style={{ flex: '1', color: 'var(--text-primary)', textDecoration: 'none' }}>Turn on two-step verification</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>Start</span>
                    </div>
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      只给管理员看，放在首页顶部；完成或关闭后收进帮助菜单。
                    </span>
                  </div>{' '}
                </div>{' '}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {' '}
                  <div
                    style={{
                      flex: '1',
                      minWidth: '220px',
                      height: '240px',
                      borderRadius: '16px',
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '28px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>404</span>
                    <span style={{ fontSize: '20px', fontWeight: '500' }}>This page isn’t available</span>
                    <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      It may have moved, or you may not have access. Ask the person who sent you the link.
                    </span>
                    <div>
                      <DS.Button variant="secondary" size="sm" ground={v.ground}>
                        Go to my documents
                      </DS.Button>
                    </div>
                  </div>{' '}
                  <div
                    style={{
                      flex: '1',
                      minWidth: '220px',
                      height: '240px',
                      borderRadius: '16px',
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '28px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>403 · No access</span>
                    <span style={{ fontSize: '20px', fontWeight: '500' }}>You need access to Harbour Series A</span>
                    <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      Your request goes to Li Wei. You’ll get an email when it’s approved.
                    </span>
                    <div>
                      <DS.Button size="sm" ground={v.ground}>
                        Request access
                      </DS.Button>
                    </div>
                  </div>{' '}
                  <div
                    style={{
                      flex: '1',
                      minWidth: '220px',
                      height: '240px',
                      borderRadius: '16px',
                      background: 'var(--bg-page)',
                      border: '1px solid var(--rule)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '28px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>500</span>
                    <span style={{ fontSize: '20px', fontWeight: '500' }}>Something failed on our side</span>
                    <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      Your work is saved. Try again, or check the status page. Reference 7F2K-91.
                    </span>
                    <div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <DS.Button size="sm" ground={v.ground}>
                          Try again
                        </DS.Button>
                        <DS.Button variant="ghost" size="sm" ground={v.ground}>
                          Status
                        </DS.Button>
                      </div>
                    </div>
                  </div>{' '}
                </div>{' '}
              </section>
            </>
          ) : null}{' '}
          {v.show?.s22 ? (
            <>
              <section
                id="s22"
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '56px 0', borderTop: '1px solid var(--rule)' }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>22 / 设置页模板 · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    设置页：左边分组菜单，右边“说明 + 控件”两列
                  </h2>
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '44em' }}>
                    工作区设置、个人偏好、安全设置都用这个模板。示例为安全设置，对应登录页的规则。
                  </p>
                </div>{' '}
                <div
                  style={{
                    height: '780px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--bg-page)',
                    boxShadow: '0 0 0 1px var(--rule)',
                    display: 'flex',
                    position: 'relative',
                  }}
                >
                  {' '}
                  <div style={{ width: '64px', flex: 'none', background: 'var(--bg-sunk)', borderRight: '1px solid var(--rule)' }} />{' '}
                  <div
                    style={{
                      width: '200px',
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
                      Back to workspace
                    </div>{' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'block', padding: '12px 10px 4px' }}>Workspace</span>
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '400',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        gap: '10px',
                      }}
                    >
                      <DS.Icon name="sliders-horizontal" size={15} />
                      General
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '400',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        gap: '10px',
                      }}
                    >
                      <DS.Icon name="palette" size={15} />
                      Brand
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '400',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        gap: '10px',
                      }}
                    >
                      <DS.Icon name="globe" size={15} />
                      Domain
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '400',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        gap: '10px',
                      }}
                    >
                      <DS.Icon name="users" size={15} />
                      Members
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        background: 'var(--brand-field)',
                        color: 'var(--ink)',
                        gap: '10px',
                      }}
                    >
                      <DS.Icon name="shield" size={15} />
                      Security
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '400',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        gap: '10px',
                      }}
                    >
                      <DS.Icon name="plug" size={15} />
                      Integrations
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '400',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        gap: '10px',
                      }}
                    >
                      <DS.Icon name="credit-card" size={15} />
                      Billing
                    </div>{' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'block', padding: '12px 10px 4px' }}>You</span>
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '400',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        gap: '10px',
                      }}
                    >
                      <DS.Icon name="user" size={15} />
                      Profile
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '400',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        gap: '10px',
                      }}
                    >
                      <DS.Icon name="bell" size={15} />
                      Notifications
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '400',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        gap: '10px',
                      }}
                    >
                      <DS.Icon name="languages" size={15} />
                      Language and region
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      flex: '1',
                      minWidth: '0',
                      padding: '32px 32px 80px',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'auto',
                    }}
                  >
                    {' '}
                    <span style={{ fontSize: '24px', fontWeight: '500' }}>Security</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '6px 0 12px' }}>
                      Who can sign in to COSX Advisory, and how.
                    </span>{' '}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '12px 32px',
                        padding: '18px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Sign-in methods</span>
                        <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                          Shown on the sign-in page and on customer domains. At least one must stay on.
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '32px' }}>
                          <span style={{ fontSize: '13px', flex: '1' }}>Google</span>
                          <DS.Switch checked={true} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '32px' }}>
                          <span style={{ fontSize: '13px', flex: '1' }}>Microsoft</span>
                          <DS.Switch checked={true} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '32px' }}>
                          <span style={{ fontSize: '13px', flex: '1' }}>Apple</span>
                          <DS.Switch checked={false} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '32px' }}>
                          <span style={{ fontSize: '13px', flex: '1' }}>Email and password</span>
                          <DS.Switch checked={true} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '32px' }}>
                          <span style={{ fontSize: '13px', flex: '1' }}>Passkey</span>
                          <DS.Switch checked={true} />
                        </div>
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '12px 32px',
                        padding: '18px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Single sign-on domains</span>
                        <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                          Emails on these domains must use SSO. Other methods are hidden for them.
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', borderRadius: '12px', border: '1px solid var(--rule)' }}>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) auto 28px',
                              gap: '10px',
                              alignItems: 'center',
                              padding: '10px 12px',
                              fontSize: '13px',
                            }}
                          >
                            <span style={{ fontWeight: '500' }}>harbour.vc</span>
                            <span style={{ color: 'var(--text-secondary)' }}>Okta</span>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              <span style={{ width: '7px', height: '7px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                              Required
                            </span>
                            <DS.Icon name="more-horizontal" size={14} />
                          </div>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) auto 28px',
                              gap: '10px',
                              alignItems: 'center',
                              padding: '10px 12px',
                              borderTop: '1px solid var(--rule-soft)',
                              fontSize: '13px',
                            }}
                          >
                            <span style={{ fontWeight: '500' }}>cosx.co</span>
                            <span style={{ color: 'var(--text-secondary)' }}>Google Workspace</span>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              <span style={{ width: '7px', height: '7px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                              Required
                            </span>
                            <DS.Icon name="more-horizontal" size={14} />
                          </div>
                        </div>
                        <div>
                          <DS.Button variant="secondary" size="sm" ground={v.ground}>
                            Add domain
                          </DS.Button>
                        </div>
                      </div>
                    </div>{' '}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '12px 32px',
                        padding: '18px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Two-step verification</span>
                        <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                          Required for everyone in this workspace, including customers.
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '32px' }}>
                          <span style={{ fontSize: '13px', flex: '1' }}>
                            {'Require two-step verification '}
                            <span style={{ color: 'var(--text-secondary)' }}>· 2 members not set up</span>
                          </span>
                          <DS.Switch checked={true} />
                        </div>
                      </div>
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      position: 'absolute',
                      left: '264px',
                      right: '0',
                      bottom: '0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 40px',
                      borderTop: '1px solid var(--rule)',
                      background: 'var(--bg-page)',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--brand-mark)' }} />
                    <span style={{ fontSize: '13px', flex: '1' }}>Unsaved changes · Apple sign-in turned off</span>
                    <DS.Button variant="ghost" size="sm" ground={v.ground}>
                      Discard
                    </DS.Button>
                    <DS.Button size="sm" ground={v.ground}>
                      Save changes
                    </DS.Button>
                  </div>{' '}
                </div>{' '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', alignItems: 'start' }}
                >
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>规则</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>两列</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        左列 260 写标题和一句说明，右列放控件；一行一个设置，不在一行里塞多个无关项。
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>保存</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        开关类立即生效并出 toast；表单类修改后底部出现保存条，离开前提示。
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>危险区</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        删除工作区、转移所有权放在页面底部单独的“Danger zone”卡片，二次确认要输入名称。
                      </span>
                    </div>
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
                    }}
                  >
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Danger zone</h3>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '14px',
                        borderRadius: '12px',
                        boxShadow: 'inset 0 0 0 1px var(--status-error)',
                      }}
                    >
                      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Delete this workspace</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Removes all projects, documents and shares for 38 people.
                        </span>
                      </div>
                      <button
                        type="button"
                        style={{
                          height: '32px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'var(--status-error)',
                          color: '#fff',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        Delete…
                      </button>
                    </div>
                  </div>
                </div>{' '}
              </section>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
