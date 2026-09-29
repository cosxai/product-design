// SpecSectionsEN — converted once from the Claude Design export (Spec Sections EN.dc.html); edit freely.
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
      rootLang: 'en-GB',
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
          title: 'Nothing matches “shareholder agreement”',
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
        ['Command palette', 'Exclusive; closes other overlays when open'],
        ['Dialog', 'Nests; one Esc closes one layer'],
        ['Popover · menu · tooltip', 'Anchored to the trigger; flips at edges'],
        ['Toast', 'Bottom right, clear of the action bar and zoom pill'],
        ['Mode state', 'Part of the action bar; a separate pill only on pages without one'],
        ['Action bar', 'Bottom centre; a left-edge handle on phones'],
        ['Zoom pill', 'Bottom right; gives way to the bottom tabs on phones'],
        ['Right slot', 'The Agent drawer or a side panel, one or the other'],
        ['Page', 'Content and inbox route overlays'],
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
        ['User message', 'A linen bubble, right-aligned, 75% wide at most. Attachments sit above it.'],
        ['Agent message', 'No bubble; set on the page with an ink tile avatar. Body 15/1.7, Chinese 16/1.8.'],
        ['Steps', 'Collapsed to one line of time and steps. While running the current step opens; failed steps stay open.'],
        [
          'Citations',
          'Numbered at the end of a sentence. Hover shows the source card; click opens the viewer at that page, highlighted. Every figure, date and clause must cite.',
        ],
        [
          'Confirmation card',
          'Anything that leaves the workspace or can’t be undone (send, share, sign, delete) is drafted by the Agent and runs only after the user confirms. Ink outline, distinct from result cards.',
        ],
        ['System line', 'Tasks created, handovers, permission changes. Centred grey text, no avatar.'],
        ['Staff message', 'Same side as the Agent, told apart by a real avatar and a COSX tag.'],
      ].map(([k, v], i) => ({ n: String(i + 1), k, v })),
      agentRules: [
        [
          'Visible scope',
          'A scope tag in the composer says what the Agent can see. In the portal it covers only what this customer can see; changing scope leaves a system line.',
        ],
        ['Never acts outside for the user', 'Anything that leaves the workspace or can’t be undone shows a confirmation card first.'],
        ['Always cite', 'Figures, dates and clauses need a source; without one the answer says so and gives no number.'],
        [
          'Interruptible',
          'Esc or Stop halts at any time; what’s written stays and can continue. You can type the next message while it writes.',
        ],
        ['Explain failures', 'Say which step failed and why, and offer a way on, not just Something went wrong.'],
        ['Hand over at any time', 'Every answer offers Hand to the team, which becomes a task; replies still appear in this conversation.'],
        [
          'Mobile',
          'Steps start collapsed; tapping a citation opens the source from the bottom; the composer sits on the keyboard and the scope tag moves into the + menu.',
        ],
      ].map(([k, v]) => ({ k, v })),
      panelTabs: ['Invite', 'Public link'],
      ctxKinds: [
        {
          kind: 'Module views',
          title: 'Views and a tree',
          body: 'The module’s fixed views on top, then a tree or project groups. Clicking a node changes only the content area.',
          where: 'Ops documents · portal documents',
        },
        {
          kind: 'List',
          title: 'The list in the column, detail in the content',
          body: 'For short lists you switch between often, the list lives in the context column and the content shows the selected item.',
          where: 'Portal conversation, tasks, content · Ops inbox',
        },
        {
          kind: 'Entity menu',
          title: 'Back row, switcher, menu, settings',
          body: 'Inside a project or site the whole column becomes its menu. Settings and members sit at the bottom.',
          where: 'Ops projects · Marketing sites',
        },
        {
          kind: 'Folded',
          title: 'Only the icon rail',
          body: 'The viewer, presenting and signing default to folded to free up width. Hovering a module icon shows the context column as a flyout. When folded the rail gets a 1px rule on its right; if the content ground is also linen, it steps to sunk-2.',
          where: 'Document viewer · signing',
        },
      ],
      shellBreaks: [
        { w: '≥ 1440', rule: 'Both columns open; the right-hand slot pushes the content.' },
        { w: '1280 – 1439', rule: 'Both columns open; the right-hand slot overlays the content.' },
        { w: '768 – 1279', rule: 'The context column starts folded and flies out on hover or click; a manual expand is remembered.' },
        {
          w: '< 768 · phones',
          rule: 'The rail becomes bottom tabs (five at most, the rest under More). The context column becomes the module’s home page or a Sections sheet under the header.',
        },
      ],
      shellRules: [
        {
          k: 'Two menu levels at most',
          v: 'One for the module, one for the entity. Anything deeper appears only in the breadcrumb, with the parent kept selected.',
        },
        { k: 'Entity switcher', v: 'At the top of the entity menu: recent items, searchable; switching keeps you on the same sub-module.' },
        {
          k: 'Where settings live',
          v: 'Project and site settings sit at the bottom of their menus; workspace settings live in the Admin module.',
        },
        {
          k: 'Breadcrumb',
          v: 'Starts at the module: Projects / Wang family / Review / Conflict 4. On a customer domain it starts at the brand.',
        },
        { k: 'Back', v: 'Browser Back matches the back row; returning to a list restores filters, sort and scroll.' },
      ],
      shellDiff: [
        {
          k: 'Modules',
          a: 'Conversation, My tasks, Documents, My clients, My content (as enabled)',
          b: 'Home, Inbox, Projects, Documents, Agreements, Customers, Matters, Marketing, Admin',
        },
        { k: 'Brand tile', a: 'The customer’s brand colour and initial', b: 'The COSX workspace' },
        { k: 'Agent', a: 'The Conversation module itself', b: 'Always at the bottom of the rail; opens the right-hand drawer' },
        { k: 'Entity menu', a: 'Not used; projects appear as groups in Documents and Clients', b: 'Projects, sites' },
        { k: 'Page actions', a: 'The floating action bar, by state', b: 'The floating action bar, by state' },
      ],
      phoneRows: [
        ['folder', 'Side letters', '4 documents', 'block'],
        ['file-text', 'Shareholder agreement v3.pdf', 'PDF · Signed · 2 h ago', 'none'],
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
          name: 'Chinese UI',
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
        [1, 'Financials', 'folder', '', 'drop'],
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
  'html, body { margin: 0; background: var(--linen); -webkit-font-smoothing: antialiased; }\n    a { color: var(--text-primary); text-underline-offset: 3px; }\n    a:hover { color: var(--text-secondary); }\n    @keyframes mr-spin { to { transform: rotate(360deg); } }\n    @keyframes mr-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }\n    @keyframes mr-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }\n    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }\n.h160:hover{background: #C4261F !important}';

export default function SpecSectionsEN(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="SpecSectionsEN" precedence="page">
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
                · MetaRoom component system · v1 draft · 24 September 2026
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
              {'One set of components for '}
              <span className="marker">the customer portal and the Ops workbench</span>
            </h1>{' '}
            <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
              Built on COSX Design System 3.0. Components follow sections 4–7 of the brief; each group gives types, a state matrix and usage
              rules. Sample UI copy is English (the product default); Chinese samples are in section 12. Use Tweaks for dark mode and
              customer brands.
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
                01 Foundations and injection
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
                02 Buttons
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
                03 Text input
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
                04 Selection
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
                05 Upload and progress
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
                06 Badges and sync
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
                07 Page states
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
                08 Feedback
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
                09 Overlays and action surfaces
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
                10 Data display
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
                11 Mobile
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
                12 Chinese and English
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
                13 Layout and navigation
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
                14 Agent conversation
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
                15 Avatars and members
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
                16 Sharing
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
                17 Board
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
                18 Editing and signing
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
                19 Form extensions
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
                20 Charts
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
                21 System
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
                22 Settings
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
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    01 / Foundations and injection
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    Product UI uses three materials: paper, ink and one brand colour
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    The workspace colour is injected through two variables and replaces the COSX yellow. Ink always carries contrast: the
                    primary button, body text and icons stay ink, so any customer colour keeps things readable. The brand colour is for
                    areas (selection, section grounds) and small marks (dots, progress, highlights), never for text.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Injection points</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{ width: '40px', height: '28px', borderRadius: '6px', background: 'var(--brand-field)', flex: 'none' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <code style={{ fontSize: '12px' }}>--brand-field</code>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Selected nav, selected tabs, section grounds
                          </span>
                        </div>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{ width: '40px', height: '28px', borderRadius: '6px', background: 'var(--brand-mark)', flex: 'none' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <code style={{ fontSize: '12px' }}>--brand-mark</code>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Dots, progress bars, highlights, attention fills
                          </span>
                        </div>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '28px', borderRadius: '6px', background: 'var(--ink)', flex: 'none' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <code style={{ fontSize: '12px' }}>--ink (not injectable)</code>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Primary button, body text, icons</span>
                        </div>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{ width: '40px', height: '28px', borderRadius: '6px', background: 'var(--status-error)', flex: 'none' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <code style={{ fontSize: '12px' }}>--status-error (not injectable)</code>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Errors, overdue, destructive actions</span>
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Workspace brand area · three forms</h3>{' '}
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
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>Icon and name</span>
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
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>Icon only (collapsed)</span>
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
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>Wordmark only</span>
                      </div>{' '}
                    </div>{' '}
                    <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      One logo for light and one for dark. On a customer domain no platform name appears, and the breadcrumb starts at the
                      workspace brand.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Product scale</h3>{' '}
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
                        <span>Page title</span>
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
                        <span>Section title</span>
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
                        <span>Body / rows</span>
                        <span style={{ color: 'var(--text-secondary)' }}>14 · Chinese 15</span>
                      </div>{' '}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid var(--rule-soft)',
                          paddingBottom: '8px',
                        }}
                      >
                        <span>Labels and metadata</span>
                        <span style={{ color: 'var(--text-secondary)' }}>12 / 500 grey</span>
                      </div>{' '}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid var(--rule-soft)',
                          paddingBottom: '8px',
                        }}
                      >
                        <span>Radius</span>
                        <span style={{ color: 'var(--text-secondary)' }}>4 · 6 · 8 · 16 · 24</span>
                      </div>{' '}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Control height</span>
                        <span style={{ color: 'var(--text-secondary)' }}>32 compact · 38 default · 44 mobile</span>
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
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                    Five semantic tones → the design system’s status materials
                  </h3>{' '}
                  <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', maxWidth: '52em' }}>
                    The brief asks for five tones. The design system gives product UI yellow, ink and one red, so shape does the work: a
                    fill needs a person, an outline is under way, a dot is a quiet known state. Wording is always there; colour is
                    redundant.
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>neutral</span>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Grey dot · unknown values fall back here</span>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>accent · in progress</span>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Ink outline · background work, converting, syncing
                      </span>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>success · complete</span>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ink dot · finished work steps back</span>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>warning · attention</span>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Brand fill · ink text</span>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>critical</span>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>The one red · white text</span>
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
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    02 / Buttons · P0 · brief 4.1
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    One button, six types, async results stay in the button
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    The library button and the inline quick button merge into one Button. Success and failure no longer all go to a toast:
                    the result appears in place and the width is locked. One primary per view.
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
                      Type
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
                      Default
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
                      Hover
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
                      With shortcut / count
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
                      Disabled (with reason)
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>One per view</span>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Side-by-side actions</span>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cancel, secondary links</span>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Delete forever, revoke</span>
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
                        className={'h160'}
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Needs an accessible label</span>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Hidden at zero</span>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Inline in rows · attention</span>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Confirm expands in place</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                      <DS.Button variant="yellow" size="sm" disabled={true}>
                        Confirm
                      </DS.Button>
                    </div>{' '}
                    <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Toggle</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Star · doesn’t trigger the row</span>
                    </div>{' '}
                    <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <DS.Icon name="star" size={16} />
                      <span style={{ fontSize: '12px' }}>Inactive · appears on row hover</span>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active · always shown</span>
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Async states · try them</h3>{' '}
                    <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      Default → busy (width locked, no repeat clicks) → success (confirmed for 1.6s, then resets) or failure (explained in
                      place, with Retry). Busy and disabled are different states.
                    </div>{' '}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
                      {' '}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                        {' '}
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Succeeds</span>{' '}
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
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Fails</span>{' '}
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Rules</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', lineHeight: '1.6' }}>
                      {' '}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ color: 'var(--text-secondary)', flex: 'none' }}>·</span>
                        <span>Copy is verb and object in sentence case: Publish register, not OK.</span>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ color: 'var(--text-secondary)', flex: 'none' }}>·</span>
                        <span>Inline quick actions that change data expand a confirmation in place; buttons in dialogs act directly.</span>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ color: 'var(--text-secondary)', flex: 'none' }}>·</span>
                        <span>Buttons and stars inside clickable cards or rows stop propagation and don’t open the item.</span>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ color: 'var(--text-secondary)', flex: 'none' }}>·</span>
                        <span>Shortcut hints sit at the end of the button; the width doesn’t change with state.</span>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ color: 'var(--text-secondary)', flex: 'none' }}>·</span>
                        <span>Hover deepens one step: no lift, no scale, no shadow. Focus is a 2px ink ring at 3px offset.</span>
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
                    03 / Text input · P0 · brief 4.2
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    Inputs sink to linen and take an ink edge on focus
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    All inputs share label, hint, error, prefix and suffix, read-only and borderless forms. Search and copy fields become
                    their own components, so pages stop writing their own debounce.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Single-line input · states</h3>{' '}
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Verification code · 6 digits</h3>{' '}
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
                        Pasting 6 digits fills the cells and submits · resend after 48 s
                      </span>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {' '}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Error</span>{' '}
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Search · four states</h3>{' '}
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
                      <span style={{ fontSize: '14px', flex: '1' }}>Quarterly report</span>
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
                      <span style={{ fontSize: '14px', flex: '1' }}>Quarterly report</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>14 results</span>
                      <DS.Icon name="x" size={15} />
                    </div>{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      250ms debounce built in; new input cancels the last request; a spinner shows while searching instead of “No results”;
                      / or ⌘K focuses it.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Copy field · clickable</h3>{' '}
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
                        If copying fails the text is selected and the hint says Press ⌘C to copy.
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
                    04 / Selection and dates · P0 / P1 · brief 4.3–4.4
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    The selected item always sits on the brand colour; typing and chosen look different
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Select · searchable</h3>{' '}
                    <DS.Select options={v.sortOptions} value={v.sortValue} onChange={v.setSort} />{' '}
                    <DS.Select options={v.docTypes} placeholder="Document type" searchable={true} />{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      The menu renders outside its container so dialogs don’t clip it, and opens upward without room; arrows, Home/End and
                      first-letter jumps; groups, disabled rows and descriptions.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Async search select · single</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {' '}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Typing</span>{' '}
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
                        Chosen · becomes a clearable card
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
                      <span>Loading · spinner</span>
                      <span>No results · Nothing matches “Hard”.</span>
                      <span>Error · Retry</span>
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Async search select · multiple · To style</h3>{' '}
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
                      <span>Invalid emails get a red outline and can be edited in place; unverified ones a dashed outline.</span>
                      <span>Backspace on an empty field removes the last; pasting several emails splits them.</span>
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Checkbox, radio, switch</h3>{' '}
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Segmented control · clickable</h3>{' '}
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
                      Single-choice semantics, arrow keys to move; the selected item sits on the brand colour and glides rather than blinks.
                      Disabled items explain why on hover (Map · Needs at least one party).
                    </div>{' '}
                    <h3 style={{ margin: '8px 0 0', fontSize: '16px', fontWeight: '500' }}>Choice cards</h3>{' '}
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Date · new · P1</h3>{' '}
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
                        Accepts 12/03/2019, 2019-03-12 and 12 Mar 2019. If it can’t parse, it shows the format and still lets you save.
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
                    05 / Upload and progress · P0 · brief 4.5
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    The whole window accepts drops; an upload card becomes the real card in place
                  </h2>{' '}
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Idle</span>{' '}
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
                      Dragging into the window · drop targets shown
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
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Hovering this zone</span>{' '}
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
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Compact · list view</span>{' '}
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Check before upload · folder</h3>{' '}
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
                        <span style={{ fontWeight: '500' }}>2026 Q3 due diligence</span>
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
                        <span>Financials</span>
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
                    <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '500' }}>Upload rows · four states</h3>{' '}
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
                            Shareholder agreement v3.pdf
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
                          <span>2026 Q3 due diligence</span>
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
                      Closing the page mid-upload asks first; batches survive a refresh. A folder card is a placeholder first, then tracks
                      “N / M · K failed”.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Progress bar · one component, three forms</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Determinate</span>
                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>1.2 of 3.4 MB</span>
                      </div>
                      <div style={{ height: '6px', borderRadius: '999px', background: 'var(--bg-well)', overflow: 'hidden' }}>
                        <div style={{ width: '36%', height: '100%', borderRadius: '999px', background: 'var(--text-primary)' }} />
                      </div>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Indeterminate</span>
                        <span>Preparing download</span>
                      </div>
                      {show(v.indeterminate)}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Segmented</span>
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
                      Finished segments are ink, the current one the brand colour, failed ones red. Progress text is always shown; screen
                      readers hear 25% steps.
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
                    06 / Badges, background work and sync · P0 · brief 5.3–5.4
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    One badge set, two densities: full wording, or a dot with a tooltip
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    When a row shows only the dot, the wording stays in the row for screen readers and appears on hover, so colour is never
                    the only signal. Attributes such as format, origin and permission are tags on linen, not status colours.
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
                    <span>Full density</span>
                    <span>Dot density (in rows)</span>
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Global sync status · dot and detail</h3>{' '}
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
                          <span>2026 Q3 due diligence · 41 files</span>
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Dropbox sync lines</h3>{' '}
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
                        Skipped items appear as dashed cards in the folder they belong to; click to see why.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Multi-stage progress · not a percentage</h3>{' '}
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
                      The Agent entry’s dot pulses slowly while it runs; with reduced motion it becomes a still brand dot.
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
                    07 / Page states · P0 · brief 5.2
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    One sentence and one action per state
                  </h2>{' '}
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
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Skeleton · list</span>{' '}
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
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Skeleton · cards</span>{' '}
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
                      Skeleton · viewer · copy changes on long waits
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
                    08 / Feedback · P0 · brief 5.1
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    Toasts report only what happened off the page; destructive actions confirm in a dialog
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    The separate error notifier merges into Toast. The same error shows once per 30 seconds; 4 seconds by default, 8 with an
                    action; stacked bottom right, three at most.
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
                      <DS.Input defaultValue="Financials" invalid={true} hint="Names can't contain /" />{' '}
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
                    09 / Overlays and action surfaces · P0 · brief 6
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    One action bar, one right-hand slot, one stacking order
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
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Floating action bar · click to switch modes</h3>{' '}
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
                      <span>On ink: the highest-contrast strip on any page; the brand colour lights only the active item.</span>{' '}
                      <span>
                        Pages register their actions and withdraw them on leave; with none the bar hides; forced hidden while signing or
                        presenting.
                      </span>{' '}
                      <span>
                        Drag by the left grip, double-click to reset; position and fold state are remembered and pulled back into view when
                        the window shrinks.
                      </span>{' '}
                      <span>More than two actions of a kind fold into a group; Esc or an outside click closes it.</span>{' '}
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Stacking order · top to bottom</h3>{' '}
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>One action bar whose contents change with state</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Shared by the portal and Ops</span>
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
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Idle</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        Standing actions the page registers
                      </span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        New, Upload, Select and so on, usually three or four. A global switch such as theme can sit first. Sparing: only the
                        page’s most used actions with no better home; per-item actions (star, rename) live on the item.
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
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Selection</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        Drag to select · ⇧ click · ⌘A
                      </span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        The bar switches to the count, Select all, Share, Move, Delete and Cancel. Only actions valid for every selected
                        item, folders included. Clearing the selection returns to idle.
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
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Mode</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        Comment · Present · Translate
                      </span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        A mode is a state of the bar: it shows the mode name, its actions and Done, with no extra pill. Presenting hides the
                        bar; Esc exits.
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
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Overflow</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>More than six</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        Actions of a kind fold into a group (More ▾) that still shows shortcuts; ⌘K finds every action in the bar.
                      </span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    Esc steps back one state at a time: mode → selection → idle. The header holds only the title and status, no action
                    buttons. Shortcuts work even when the bar is hidden. See portal pages 03 and 04a.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Action bar · responsive and folded</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Global component · shared by the portal and Ops
                    </span>
                  </div>{' '}
                  <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    As space shrinks it gives way in order: shortcuts first, then labels, then it folds into a handle on the left edge. The
                    actions stay the same; only the presentation changes.
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
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Full</span>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>Icon, label and shortcut.</span>
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
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>No shortcuts</span>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        Shortcuts still work and show in the tooltip.
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
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Icons only</span>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        Name and shortcut show on hover or focus. Every icon needs an accessible label.
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
                      <span style={{ fontSize: '13px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>
                        {'< 768 or folded by hand'}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Left-edge handle</span>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        The handle expands the full bar; on phones it opens a bottom strip.
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
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Idle · folded</span>
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
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Background work running · the handle carries a status dot
                          </span>
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
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Fold and unfold</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        Click « at the end of the bar or drag it to the left edge to fold; click the handle or press \ to unfold. Position
                        and fold state are remembered.
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Default</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        Expanded on first visit with a one-time hint that it can fold; after that it follows the user. The viewer, signing
                        and presenting default to folded.
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>On state change</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        Entering selection or a mode unfolds it; afterwards it returns to the user’s fold state.
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>While folded</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        Shortcuts still work; when background work or the Agent runs, the handle shows a status dot.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                      Menus · groups, shortcuts, nesting, destructive items
                    </h3>{' '}
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
                      Switching workspace groups by role: one person can be a customer in one place and a member in another, and switching
                      changes the product surface. The context menu (P2) matches the action bar.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Command palette · ⌘K</h3>{' '}
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
                          <span style={{ fontSize: '13px' }}>Cap table summary.pdf</span>
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
                      Title matches appear at once; full-text results follow with page numbers and excerpts. A spinner shows while
                      searching; no “No results” until every request returns.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Side panel · right-hand slot</h3>{' '}
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
                      Three widths: 360 / 480 / 640. No scrim, no focus trap; it pushes the content; Esc closes it. It shares one slot with
                      the Agent drawer, one at a time. On phones it pushes in full screen.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Dialogs · sizes and three mobile forms</h3>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40%', height: '14px', borderRadius: '4px', background: 'var(--bg-well)' }} />
                        <span style={{ fontSize: '12px' }}>S · 400 · confirm</span>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '56%', height: '14px', borderRadius: '4px', background: 'var(--bg-well)' }} />
                        <span style={{ fontSize: '12px' }}>M · 560 · form</span>
                      </div>{' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '80%', height: '14px', borderRadius: '4px', background: 'var(--bg-well)' }} />
                        <span style={{ fontSize: '12px' }}>L · 800 · wizard</span>
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
                        <span style={{ fontSize: '12px' }}>Centred · confirm</span>
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
                        <span style={{ fontSize: '12px' }}>Full-screen push · long form</span>
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
                        <span style={{ fontSize: '12px' }}>Bottom sheet · light choice</span>
                      </div>{' '}
                    </div>{' '}
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      A focus trap, initial focus on open and focus returned on close are required. Nested confirmations close one layer per
                      Esc. The click that closes a dialog never reopens the row beneath.
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
                    10 / Data display · P0 · brief 7
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    Library cards, rows, the tree and the toolbar are shared by every list
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    Checkboxes, stars, quick buttons and drag gestures inside a card never open it. In selection mode the whole card is the
                    checkbox.
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
                        Shareholder agreement v3
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>List toolbar and rows</h3>{' '}
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
                          Shareholder agreement v3.pdf
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
                      Infinite scroll triggers 200px early · thousands of items use virtual scrolling
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
                    <h3 style={{ margin: '0 8px 4px', fontSize: '16px', fontWeight: '500' }}>Folder tree</h3>{' '}
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
                      The arrow and the name are separate targets; opening a folder expands its ancestors; nodes become drop targets while
                      dragging; lazy loading, partial ticks.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                      Breadcrumb · folds the middle beyond four segments
                    </h3>{' '}
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
                    <h3 style={{ margin: '8px 0 0', fontSize: '16px', fontWeight: '500' }}>Page header card · seven in one</h3>{' '}
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
                      Configurable: eyebrow, title, status, figures, a note line and actions. Figures hide on phones.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Steps · four states</h3>{' '}
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Activity timeline · grouped by time</h3>{' '}
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Table · desktop and phone cards</h3>{' '}
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
                      On phones each row becomes a card: the first column as the title, the rest as one line of metadata.
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
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>11 / Mobile · brief 10.2</div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    On phones: one layer, bottom tabs, targets of 44px or more
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    Deep folders step in one level at a time with a path bar to go back. Every drag has an alternative: Move to… for files,
                    a picker for board stages. Bottom stacking, bottom up: tabs → mode pill → toast; the action bar folds to the left-edge
                    handle.
                  </p>{' '}
                </div>{' '}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                  {' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      Stepping into folders · portal tabs
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
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Bottom sheet · More</span>{' '}
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
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      Full-screen push · long form
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
                    12 / Chinese, English and truncation · brief 10.4
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    One component, in English and Chinese
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '40em' }}>
                    The Chinese UI uses Noto Sans SC at 400/500, tracking 0, body text 1px larger with 1.8 leading. Latin and digits stay in
                    Geist with an automatic quarter space. Buttons are never bilingual; they follow the page language.
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
                      Truncation · the full text is always reachable (tooltip or expand)
                    </span>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Path · folds the middle</span>
                      <span style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                        Harbour data room / … / 2026 Q3 due diligence / Financials
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Title · truncates at the end</span>
                      <span
                        style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px' }}
                      >
                        Hong Kong Island East commercial complex feasibility study (third revised edition).pdf
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Card title · clamps after two lines</span>
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
                        Hong Kong Island East commercial complex feasibility study (third revised edition) v3
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Graph labels · wrap, three lines at most</span>
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
                        Spouse
                        <br />
                        2014 – present
                        <br />6 facts
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Numbers and dates</span>
                      <span style={{ fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}>
                        6,831 items · 24 Sep 2026 · 5 minutes ago
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
                    13 / Layout and navigation · decided 1a + 2a · brief 3.4
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    Two columns on the left: the icon rail for modules, the context column for the current level
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '44em' }}>
                    The customer portal and the Ops workbench share one shell; they differ only in which modules the rail holds and what the
                    context column shows. Components:<code style={{ fontSize: '13px' }}>Portal Rail</code>、
                    <code style={{ fontSize: '13px' }}>Ops Rail</code>
                    {'. Page examples: '}
                    <a href="../pages/MetaRoom Customer Portal.dc.html">the customer portal</a>
                    {' and '}
                    <a href="../pages/MetaRoom Ops Workbench.dc.html">the Ops workbench</a>
                    {'; options compared in '}
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
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Shell structure</h3>{' '}
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
                      <span style={{ fontWeight: '600' }}>Context column · 248</span>
                      <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        The current module’s views, list or entity menu. Collapsible; when collapsed, hovering an icon shows it.
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
                        <span style={{ fontWeight: '600' }}>Top bar · 52</span>
                        <span style={{ color: 'var(--text-secondary)' }}>Breadcrumb · inbox · page actions</span>
                      </div>{' '}
                      <div style={{ flex: '1', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontWeight: '600' }}>Content</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Width set by the page: lists fill it, reading pages centre at 760.
                        </span>
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
                      <span style={{ fontWeight: '600' }}>Right-hand slot · 360 / 480 / 640</span>
                      <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        The Agent drawer or a side panel, one at a time.
                      </span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Icon rail · 64</span>
                      {' Brand tile, modules, the Agent and the avatar at the bottom'}
                    </span>
                    <span>312px for both columns</span>
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Rail items · states</h3>{' '}
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
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Default</span>
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
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Hover</span>
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
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Current</span>
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
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Attention</span>
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
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Count</span>
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
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Focus</span>
                      </div>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', lineHeight: '1.6' }}>
                      {' '}
                      <span>· Every icon has a tooltip with the module’s full name; ↑↓ to move, Enter to open.</span>{' '}
                      <span>· A dot means something is waiting for you; numbers appear only on the inbox.</span>{' '}
                      <span>· Unavailable modules don’t show; enabled-but-off modules show to admins only.</span>{' '}
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
                    <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '500' }}>Context column items · types</h3>{' '}
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
                      All projects<span style={{ marginLeft: 'auto', fontSize: '11px' }}>Back row</span>
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
                        <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Entity switcher</span>
                      </div>
                      <DS.Icon name="chevrons-up-down" size={14} />
                    </div>{' '}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', padding: '8px 10px 0' }}>
                      Group heading
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
                      Parties<span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-secondary)' }}>Default</span>
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
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Two-line · list</span>
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
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-secondary)' }}>Bottom · entity settings</span>
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Level rules</h3>{' '}
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
                      <span>the customer portal</span>
                      <span>the Ops workbench</span>
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
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    14 / Agent conversation · P0
                  </div>{' '}
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    Agent answers show what it did and what it relied on; people confirm anything that leaves
                  </h2>{' '}
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '44em' }}>
                    The portal’s Conversation and the Ops Agent drawer share these parts: messages, steps, citations, result cards,
                    confirmation cards and the composer.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>A full conversation · click to expand the steps</h3>{' '}
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
                          4 of the 24 invited investors haven't signed the NDA: Anna Kowalski, Wang Zhiyuan, James Park and Maria Rossi.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Anatomy</h3>
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
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Message states</h3>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Thinking</span>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Writing</span>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Stopped</span>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Failed</span>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Out of scope</span>
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
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                    Result cards · results sit inside the answer; open one to go to its page
                  </h3>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Task</span>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Document</span>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>People list</span>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Draft</span>
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
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Composer</h3>
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
                        Idle · the scope tag says what the Agent can see
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>With attachments</span>
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        Writing · Send becomes Stop
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
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>/ commands</span>
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
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Ops · right drawer 480</span>
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
                            One: Wang Zhiyuan's date of birth. The passport says 14 March 1983 and the birth certificate says 13 March.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Rules</h3>
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
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>15 / Avatars and members · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    People, organisations, the Agent and staff at a glance
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Avatar types</h3>{' '}
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
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Person</span>
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
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Organisation</span>
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
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Staff</span>
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
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>External guest</span>
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
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Viewing now</span>
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
                      Without a photo, initials; for Chinese names, the surname. Colour doesn’t identify people; only the Agent uses ink.
                      Guests get an outline; people viewing the same document get a brand-colour ring.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Avatar group</h3>{' '}
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
                      Up to four stacked, the rest as +N. Hover lists everyone; people viewing now come first, with the page they’re on.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Member row and role picker</h3>{' '}
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
                      Each role says what it can do. Options you can’t pick stay visible with the reason. Customer workspaces have only
                      Customer admin and Customer member.
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
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>16 / Share dialog · P0</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    When sharing, say it once: who, what they can do, until when
                  </h2>
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '44em' }}>
                    One dialog handles email invitations and public links. Forwarded shares stay bound by the upstream permissions:
                    capabilities can only narrow, never widen.
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
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>People with access</h3>
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
                        People further down a forward chain show where they came from. When the upstream is revoked, everything downstream
                        stops too, with a notice here.
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
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>17 / Board · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    A board and a list are two views of the same data
                  </h2>
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '44em' }}>
                    For the Ops inbox board and stages in My clients. Every drag has a keyboard and picker alternative.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Change stage · without dragging</h3>
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
                      The card menu, ⇧M and a long press on phones all open this picker.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Rules</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Dragging</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        A picked-up card takes an ink outline and shifts slightly right; the target column shows a dashed brand-colour drop
                        slot. No rotation, no shadow.
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Gates</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        When a stage has an entry condition (such as signing the NDA first) that isn’t met, no slot appears and hovering
                        explains why.
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Count</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        Column heads show counts; columns fold into a strip and stay folded.
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Attention</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        The brand dot at the top right of a card matches Attention in the list view.
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
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    18 / Editing · versions · signing · P1
                  </div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    The editor, version compare and signature fields
                  </h2>
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
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Rich-text toolbar</h3>
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
                      Selecting text shows an ink floating bar with only formatting, comment and Agent rewrite. Hovering left of a paragraph
                      shows + and a drag handle; typing / inserts a block. The toolbar sticks while scrolling.
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
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Version compare</h3>
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
                      Additions are a pale yellow wash with an ink underline, deletions a grey strikethrough; no red and green. Image and
                      table changes carry a Replaced tag.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Signature fields and signing</h3>{' '}
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
                      Signing mode hides the shell and the action bar, keeping only progress and Next. Sign by typing, drawing or uploading;
                      adopting requires ticking This is my legal signature.
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
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>19 / Form extensions · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    Wizards, money, date ranges, tags and brand colour
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Multi-step wizard</h3>{' '}
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
                      Each step saves a draft. Finished steps can be revisited; Review lists every answer, each editable.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Money and numbers</h3>{' '}
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
                      Numbers right-aligned and tabular. Thousands separators on blur; accepts 1.25m and 1,250k.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Date range</h3>{' '}
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Tag input</h3>{' '}
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
                      Enter or a comma confirms; existing tags come first; Create shows before a new one. Tags are attributes on linen, not
                      status colours.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Brand colour · workspace settings</h3>{' '}
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
                      Takes one light area colour; the mark colour is derived by darkening it. If ink text drops below 7:1, saving is
                      refused with the reason.
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
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>20 / Charts · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    Ink is the base; only the finding takes the brand colour
                  </h2>
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '44em' }}>
                    For marketing site analytics, the My clients funnel and workspace usage. Two colours per chart at most; beyond that, a
                    lightness ladder from linen to ink.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Columns · weekly views</h3>
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
                      6px corners, gaps instead of gridlines. The current item takes the brand colour; hover shows the value.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Line · open rate compared</h3>
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
                      The comparison is a grey dashed line, with no second colour.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Composition · traffic sources</h3>
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Funnel</h3>
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
                      The same component as My clients. The step with the biggest drop takes the brand colour.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Empty, loading, error</h3>
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
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>21 / System · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    Notifications, shortcuts, the preview banner, error pages and onboarding
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
                  The Previewing as customer banner is fixed to the top, full width, and can’t be dismissed, only exited. Offline, the same
                  spot reads Offline · changes will sync when you reconnect.
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
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Notification centre</h3>
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
                      The bell gathers only what concerns you; each item jumps to its place. Email alerts are switched per type in
                      notification settings.
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
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Shortcut panel</h3>
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
                      Press ? to open it; it’s also in the avatar menu. Shortcuts are filtered by page; unavailable ones don’t show.
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
                      <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Onboarding checklist</h3>
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
                      Admins only, at the top of Home; finished or dismissed, it moves into the Help menu.
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
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>22 / Settings template · P1</div>
                  <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.3' }}>
                    Settings: a grouped menu on the left, description and control on the right
                  </h2>
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', maxWidth: '44em' }}>
                    Workspace settings, preferences and security all use this template. The example is security, matching the sign-in rules.
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>Rules</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Two columns</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        260 on the left for the title and one line, controls on the right; one setting per row, never several unrelated
                        ones.
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Saving</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        Switches apply at once with a toast; form edits raise a save bar at the bottom and warn before leaving.
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Danger zone</span>
                      <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        Deleting the workspace and transferring ownership sit in a separate Danger zone card at the bottom, confirmed by
                        typing the name.
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
