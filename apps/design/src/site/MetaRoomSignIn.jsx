// MetaroomSignIn — converted once from the Claude Design export (metaroom-auth/Metaroom Sign In.dc.html); edit freely.
import * as React from 'react';
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';

/* eslint-disable */
class Logic extends DCLogic {
  state = { screen: 'signin', email: '', kind: '', trust: true, wsName: 'Acme', bad: false, notes: false, mainW: 1200 };
  mainRef = React.createRef();
  componentDidMount() {
    this._mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (this._mq) {
      this._mqh = (e) => this.setState({ sysDark: e.matches });
      this.setState({ sysDark: this._mq.matches });
      this._mq.addEventListener('change', this._mqh);
    }
    undefined && undefined();
    const el = this.mainRef.current;
    if (el && window.ResizeObserver) {
      this._ro = new ResizeObserver((es) => {
        const w = Math.round(es[0].contentRect.width);
        if (Math.abs(w - this.state.mainW) > 4) this.setState({ mainW: w });
      });
      this._ro.observe(el);
    }
  }
  componentWillUnmount() {
    this._ro && this._ro.disconnect();
    this._mq && this._mq.removeEventListener('change', this._mqh);
  }
  route(email) {
    const e = (email || '').trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return this.setState({ bad: true });
    const kind = /@harbour\.vc$/.test(e) ? 'sso' : /^li\.wei@/.test(e) ? 'passkey' : /^sam@/.test(e) ? 'password' : 'new';
    this.setState({ email: e, kind, bad: false, screen: kind === 'new' ? 'emailcode' : kind });
  }
  renderVals() {
    const s = this.state,
      pref = s.theme ?? this.props.theme ?? 'auto',
      dark = pref === 'auto' ? !!s.sysDark : pref === 'dark';
    const go = {};
    [
      'signin',
      'branded',
      'sso',
      'passkey',
      'password',
      'mfa',
      'emailcode',
      'profile',
      'workspace',
      'enrol',
      'chooser',
      'done',
      'desktop',
      'desktopWait',
      'cbOk',
      'cbManual',
      'cbFail',
      'mcp',
      'mcpOk',
    ].forEach((k) => {
      go[k] = () => this.setState({ screen: k, bad: false });
    });
    const scr = s.screen === 'branded' ? 'signin' : s.screen;
    const is = {};
    [
      'signin',
      'sso',
      'passkey',
      'password',
      'mfa',
      'emailcode',
      'profile',
      'workspace',
      'enrol',
      'chooser',
      'done',
      'desktop',
      'desktopWait',
      'cbOk',
      'cbManual',
      'cbFail',
      'mcp',
      'mcpOk',
    ].forEach((k) => {
      is[k] = scr === k;
    });
    const branded = s.screen === 'branded';
    const cells = (digits, cur) =>
      Array.from({ length: 6 }, (_, i) => ({
        d: digits[i] || '',
        bg: i === cur ? 'var(--bg-page)' : 'var(--bg-sunk)',
        ring: i === cur ? 'inset 0 0 0 1.5px var(--text-primary)' : 'none',
      }));
    const email = s.email || (s.kind === 'password' ? 'sam@cosx.co' : 'jordan@acme.com');
    const slug =
      (s.wsName || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'your-team';
    const targets = {
      sso: ['Harbour Ventures', 'harbour.meta.cosx.dev'],
      passkey: ['COSX Advisory', 'cosx.meta.cosx.dev'],
      branded: ['Halden Capital', 'portal.halden.co'],
      new: [s.wsName || 'your workspace', slug + '.meta.cosx.dev'],
    };
    const tg = targets[branded ? 'branded' : s.kind] || targets.passkey;
    const G = [
      [
        '入口',
        [
          ['signin', '登录：只问邮箱'],
          ['branded', '从客户域名进入'],
        ],
      ],
      [
        '已有账号',
        [
          ['sso', '公司单点登录'],
          ['passkey', '通行密钥'],
          ['password', '密码'],
          ['mfa', '二次验证'],
        ],
      ],
      [
        '新用户',
        [
          ['emailcode', '验证邮箱'],
          ['profile', '创建账号'],
          ['workspace', '加入或创建工作区'],
          ['enrol', '保存通行密钥'],
        ],
      ],
      [
        '进入',
        [
          ['chooser', '选择工作区'],
          ['done', '进入工作区'],
        ],
      ],
      [
        '桌面端',
        [
          ['desktop', '桌面端登录'],
          ['desktopWait', '等待浏览器'],
          ['cbOk', '回调成功 · 自动返回'],
          ['cbManual', '回调成功 · 手动打开'],
          ['cbFail', '回调失败'],
        ],
      ],
      [
        'MCP 授权',
        [
          ['mcp', '授权并选择工作区（多选）'],
          ['mcpOk', '授权成功'],
        ],
      ],
    ];
    let n = 0;
    const map = G.map(([label, items]) => ({
      label,
      items: items.map(([k, l]) => {
        n++;
        const on = s.screen === k;
        return {
          label: l,
          n: String(n).padStart(2, '0'),
          go: go[k],
          bg: on ? '#FFE3A0' : 'transparent',
          fg: on ? '#111' : 'var(--text-primary)',
          nFg: on ? 'rgba(17,17,17,.7)' : 'var(--text-secondary)',
          w: on ? 500 : 400,
        };
      }),
    }));
    const N = {
      signin: [
        '01 · 入口',
        '一个入口，只问邮箱',
        [
          '不再让用户先输入工作区地址。输入邮箱后，系统按邮箱判断下一步：公司单点登录、通行密钥、密码，或者新用户注册。',
          '邮箱框开启通行密钥自动填充（autocomplete="webauthn"），有通行密钥的用户点一下输入框就能登录。',
          '注册没有单独入口：新邮箱会自动进入注册流程，所以页面上不需要“创建账号”链接。',
        ],
        '旧流程第一步就要求输入 workspace slug，用户不知道这是什么，也不知道该去哪注册。',
      ],
      branded: [
        '02 · 入口',
        '从客户域名进入时带着品牌',
        [
          '从 portal.halden.co 这类客户域名或邀请链接进入时，卡片顶部显示工作区品牌，标题写“登录 Halden Capital”。',
          '工作区已经确定，登录后直接进入，跳过选择工作区。',
          '页面上不出现 Metaroom 或 COSX。',
        ],
        '旧流程要先发现未登录，再带着工作区信息跳转 SSO，再跳回来。',
      ],
      sso: [
        '03 · 已有账号',
        '公司域名走单点登录',
        [
          '邮箱域名配置了 SSO（这里是 harbour.vc → Okta）时，直接说明原因并给一个按钮跳转。',
          '邮箱显示在标签里，可以改。',
          'SSO 回来后直接进入对应工作区；这类账号不显示密码和其他方式。',
        ],
        '旧流程由用户自己判断要不要点 SSO。',
      ],
      passkey: [
        '04 · 已有账号',
        '有通行密钥就先用通行密钥',
        [
          '账号有通行密钥时默认用它，并同时满足二次验证，不再要验证码。',
          '备用方式放在下面：密码、邮箱验证码。',
          '只有一个工作区的用户，验证后直接进入。',
        ],
        '旧流程通行密钥是“更快登录”里的一个选项，和密码并排，用户不知道选哪个。',
      ],
      password: [
        '05 · 已有账号',
        '密码是备用方式',
        ['只显示密码一个字段，邮箱已经确定。', '忘记密码时可以直接用邮箱验证码登录，不必先重置。'],
        '旧流程邮箱和密码同屏，还要先选工作区。',
      ],
      mfa: [
        '06 · 已有账号',
        '二次验证：通行密钥优先',
        [
          '工作区要求两步验证时出现。首选通行密钥，其次是验证器应用的 6 位码，最后是备用码。',
          '“信任此设备 30 天”默认勾选，减少重复验证。',
          '已用通行密钥登录的用户不会看到这一步。',
        ],
        '旧流程没有把二次验证和登录方式统一考虑。',
      ],
      emailcode: [
        '07 · 新用户',
        '先验证邮箱，再创建账号',
        [
          '新邮箱先收一个 6 位验证码，确认邮箱属于本人。',
          '粘贴 6 位数字会自动分格并提交；48 秒后可以重发。',
          '已有账号的用户选“邮箱验证码”时也走这一屏。',
        ],
        '旧流程新用户要先“创建工作区”，填 slug、显示名、国家，才能建账号。',
      ],
      profile: [
        '08 · 新用户',
        '创建账号只填姓名',
        ['邮箱已验证，只需要姓名和同意条款。', '不设密码：之后用通行密钥或邮箱验证码登录。需要密码的人可以在个人设置里添加。'],
        '旧流程账号和工作区一起创建，字段多，而且用技术词（tenant、foundation）。',
      ],
      workspace: [
        '09 · 新用户',
        '先看邀请，再决定是否新建',
        [
          '如果这个邮箱有待接受的邀请，放在最上面，一键加入。大多数新用户是被邀请来的。',
          '新建工作区只问公司或团队名称，地址自动生成，写在输入框下面，需要时可以改。',
          '国家 / 地区这类选填项挪到工作区设置里。',
        ],
        '旧流程把 slug 放在第一位，并写着 Provisions a new tenant on the foundation。',
      ],
      enrol: [
        '10 · 新用户',
        '顺手保存通行密钥',
        ['首次登录后提示保存通行密钥，写明好处：下次不用密码，也不用验证码。', '可以跳过；之后在个人设置的安全里随时添加。'],
        '旧流程没有引导用户设置通行密钥。',
      ],
      chooser: [
        '11 · 进入',
        '只有一个工作区时跳过这一步',
        [
          '有多个工作区时才出现。每一行写明角色和最近使用时间，点整行就进入，不需要再点 Continue。',
          '待接受的邀请用浅黄底单独列出，可以直接接受。',
          '创建工作区和退出放在底部，作为次要动作。',
        ],
        '旧流程要先选中卡片再点 Continue，并且显示 slug 地址而不是角色。',
      ],
      done: [
        '12 · 进入',
        '进入工作区',
        ['进入工作区地址，显示工作区名称。', '之后刷新或在新标签页打开都会直接进入，不再经过选择页。'],
        '—',
      ],
    };
    Object.assign(N, {
      desktop: [
        '13 · 桌面端',
        '桌面端只负责打开浏览器',
        [
          '登录在系统浏览器里完成，和网页端是同一套流程：邮箱优先、通行密钥、单点登录、二次验证都一样。',
          '按钮写明会发生什么：“在浏览器中继续”。',
          '只有一个工作区时，回来后直接进入；多个时显示和网页端相同的选择页，并写明角色。',
        ],
        '旧版只有一个 Sign In 按钮，多个工作区时列出一排纯文字按钮，看不出角色和品牌。',
      ],
      desktopWait: [
        '14 · 桌面端',
        '等待时告诉用户去哪里',
        [
          '说明浏览器已经打开新标签页，以及看到什么提示后回来。',
          '提供“再次打开浏览器”和“取消”；10 分钟后超时。',
          '浏览器无法跳回时，可以粘贴登录链接完成。',
        ],
        '旧版只把按钮文字换成 Waiting for browser…。',
      ],
      cbOk: [
        '15 · 桌面端',
        '回调页：成功后自动返回',
        [
          '浏览器页面显示“已登录”，并自动通过深链接打开 app。',
          '自动跳转失败时，保留一个“打开 Metaroom”按钮。',
          '同一模板用于各数据源的 OAuth 回调，只换标题和图标。',
        ],
        '旧版文案是 You’re all set，要用户自己关窗口回 app。',
      ],
      cbManual: [
        '16 · 桌面端',
        '浏览器拦截或没装 app',
        ['浏览器询问是否打开 app 时，说明应该点哪个选项。', '没装 app 时给下载链接，也可以直接在浏览器里继续。'],
        '旧版没有这个状态。',
      ],
      cbFail: [
        '17 · 桌面端',
        '失败要说原因和下一步',
        ['写明为什么失败（这里是 10 分钟超时），以及没有任何改动。', '主按钮回到 app 重试；附上参考编号，方便联系支持。'],
        '旧版只有红字 Authorization failed。',
      ],
      mcp: [
        '18 · MCP 授权',
        '授权时选一个工作区作为范围',
        [
          '写明是哪个应用在申请，以及当前登录的是哪个账号。',
          '工作区是多选列表：默认勾选当前工作区，可以全选；一个都没选时“允许”不可用并提示原因。按钮写明授权数量。',
          '拒绝和允许并排，允许是主按钮。',
        ],
        '仓库里没找到这个页面，这是按常见的 OAuth 同意页结构设计的。',
      ],
      mcpOk: ['19 · MCP 授权', '授权成功', ['写明连接到了哪个工作区，并告诉用户回到原应用继续。', '说明之后在哪里撤销授权。'], '—'],
    });
    const nt = N[s.screen];
    const newOrder = ['emailcode', 'profile', 'workspace', 'enrol'];
    const inNew = newOrder.includes(s.screen) && (s.kind === 'new' || !s.kind || s.screen !== 'emailcode');
    const curI = newOrder.indexOf(s.screen);
    const steps = [['Verify your email'], ['Create your account'], ['Join or create a workspace'], ['Save a passkey']].map(
      ([label], i) => ({
        n: i < curI ? '✓' : String(i + 1),
        label,
        bg: i < curI ? '#111' : i === curI ? '#FFD166' : 'transparent',
        fg: i < curI ? '#F5F2EC' : '#111',
        ring: i > curI ? 'inset 0 0 0 1.5px rgba(17,17,17,.25)' : 'none',
        w: i === curI ? 500 : 400,
        tfg: i > curI ? 'rgba(17,17,17,.55)' : '#111',
      }),
    );
    const P = {
      signin: [
        'Metaroom',
        'Documents, tasks and conversations with your clients, ',
        'in one private workspace.',
        'One sign-in for every workspace you belong to.',
      ],
      branded: [
        'Halden Capital · investor portal',
        'Documents and updates from Halden Capital, ',
        'shared only with you.',
        'Your access is set by Halden Capital. Questions go to Li Wei.',
      ],
      sso: [
        'Single sign-on',
        'Harbour Ventures checks who you are. ',
        'Metaroom never sees your password.',
        'After Okta signs you in, you come straight back here.',
      ],
      secure: [
        'Security',
        'A passkey is your password ',
        'and your second step.',
        'It stays on your device and can\u2019t be phished or reused.',
      ],
      fresh: [
        'Getting started',
        'Four short steps, ',
        'no password to remember.',
        'Most people join through an invitation and are in within a minute.',
      ],
      enter: [
        'Your workspaces',
        'Every workspace you belong to, ',
        'under one sign-in.',
        'Customers, colleagues and your own space, each with its own access.',
      ],
    };
    Object.assign(P, {
      desk: [
        'Desktop',
        'Sign in once in your browser, ',
        'stay signed in on this computer.',
        'Passkeys and single sign-on work the same as on the web.',
      ],
      cb: ['Browser', 'This tab has done its job. ', 'The app takes it from here.', 'Nothing else is needed in the browser.'],
      cbFail: [
        'Browser',
        'Nothing was changed. ',
        'Start again from the app.',
        'Sign-in requests expire after 10 minutes for your security.',
      ],
      mcpP: [
        'Connected apps',
        'You choose which workspace ',
        'an app can reach.',
        'One workspace per connection. Remove access at any time.',
      ],
    });
    const pk = ['desktop', 'desktopWait'].includes(s.screen)
      ? 'desk'
      : s.screen === 'cbFail'
        ? 'cbFail'
        : ['cbOk', 'cbManual'].includes(s.screen)
          ? 'cb'
          : ['mcp', 'mcpOk'].includes(s.screen)
            ? 'mcpP'
            : s.screen === 'branded'
              ? 'branded'
              : s.screen === 'signin'
                ? 'signin'
                : s.screen === 'sso'
                  ? 'sso'
                  : ['passkey', 'password', 'mfa'].includes(s.screen)
                    ? 'secure'
                    : newOrder.includes(s.screen)
                      ? 'fresh'
                      : 'enter';
    const pp = P[pk];
    const panel = {
      mark: pk === 'branded' ? '#8FBF9F' : '#FFD166',
      cosxD: pk === 'branded' ? 'none' : 'block',
      custD: pk === 'branded' ? 'flex' : 'none',
      ey: pp[0],
      a: pp[1],
      b: pp[2],
      sub: pp[3],
      bg: pk === 'branded' ? '#D6E4DA' : '#FFE3A0',
      steps,
      stepsD: pk === 'fresh' && inNew ? 'flex' : 'none',
    };
    return {
      themeOpts: [
        ['light', 'sun', 'Theme: light'],
        ['auto', 'monitor', 'Theme: match system'],
        ['dark', 'moon', 'Theme: dark'],
      ].map(([k, icon, label]) => ({
        icon,
        label,
        on: pref === k,
        pick: () => this.setState({ theme: k, themeOpen: false }),
        w: s.themeOpen || pref === k ? '30px' : '0px',
        op: s.themeOpen || pref === k ? 1 : 0,
        tab: s.themeOpen || pref === k ? 0 : -1,
        bg: pref === k ? 'var(--bg-page)' : 'transparent',
        fg: pref === k ? 'var(--text-primary)' : 'var(--text-secondary)',
      })),
      langOpts: [
        ['en-GB', 'English (UK)'],
        ['en-US', 'English (US)'],
        ['zh-CN', '简体中文'],
        ['zh-TW', '繁體中文'],
        ['ja', '日本語'],
        ['de', 'Deutsch'],
        ['fr', 'Français'],
        ['es', 'Español'],
      ].map(([value, label]) => ({ value, label })),
      langVal: s.uiLang || 'en-GB',
      setLang: (v) => this.setState({ uiLang: v }),
      velaOpen: !s.velaNo,
      velaDeclined: !!s.velaNo,
      declineVela: () => this.setState({ velaNo: true }),
      undoVela: () => this.setState({ velaNo: false }),
      halOpen: !s.halNo,
      halDeclined: !!s.halNo,
      declineHal: () => this.setState({ halNo: true }),
      undoHal: () => this.setState({ halNo: false }),
      themeEnter: () => this.setState({ themeOpen: true }),
      themeLeave: () => this.setState({ themeOpen: false }),
      themeBlur: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) this.setState({ themeOpen: false });
      },
      themeGap: s.themeOpen ? '2px' : '0px',
      ...(() => {
        const W = [
          ['cosx', 'C', 'COSX Advisory', 'Admin', '#FFE3A0'],
          ['halden', 'H', 'Halden Capital', 'Customer', '#D6E4DA'],
          ['personal', 'S', 'Sam Ortiz', 'Personal', '#ECE9E3'],
        ];
        const sel = s.mcpSel || ['cosx'];
        const toggle = (id) =>
          this.setState((st) => {
            const c = (st.mcpSel || ['cosx']).slice();
            const i = c.indexOf(id);
            if (i >= 0) c.splice(i, 1);
            else c.push(id);
            return { mcpSel: c };
          });
        const names = W.filter((w) => sel.includes(w[0])).map((w) => w[2]);
        const n = sel.length;
        return {
          mcpRows: W.map(([id, ini, name, role, tile], i) => ({
            ini,
            name,
            role,
            tile,
            on: sel.includes(id),
            toggle: () => toggle(id),
            bg: sel.includes(id) ? 'var(--bg-sunk)' : 'transparent',
            sep: i ? '1px solid var(--rule-soft)' : 'none',
          })),
          mcpAll: () => this.setState({ mcpSel: n === W.length ? [] : W.map((w) => w[0]) }),
          mcpAllLabel: n === W.length ? 'Clear all' : 'Select all',
          mcpNone: n === 0,
          mcpHint: n === 0 ? 'Choose at least one workspace.' : n + ' of ' + W.length + ' selected',
          mcpHintFg: n === 0 ? 'var(--status-error-text)' : 'var(--text-secondary)',
          mcpAllowLabel: n > 1 ? 'Allow for ' + n + ' workspaces' : 'Allow',
          mcpAllow: () => {
            if (n) this.setState({ screen: 'mcpOk' });
          },
          mcpName: n === 1 ? names[0] : n + ' workspaces',
          mcpList: names.join(', '),
        };
      })(),
      mcpCan: [
        ['file-text', 'Read documents and folders you can see'],
        ['search', 'Search across the workspace'],
        ['square-check', 'Create tasks and draft replies for you to review'],
      ].map(([icon, t]) => ({ icon, t })),
      panel,
      mainRef: this.mainRef,
      panelD: s.mainW >= 680 ? 'flex' : 'none',
      formPad: s.mainW >= 900 ? '48px' : '24px',
      panelPad: s.mainW >= 1000 ? '56px' : '36px',
      panelFs: s.mainW >= 1000 ? '36px' : '26px',
      appleD: dark ? 'none' : 'block',
      appleWD: dark ? 'block' : 'none',
      ssoHint: () => this.setState({ bad: false, ssoNote: true }),
      notesD: s.notes === false ? 'none' : 'flex',
      notesLabel: s.notes === false ? '显示说明' : '隐藏说明',
      toggleNotes: () => this.setState((st) => ({ notes: st.notes === false })),
      topRight: is.signin ? (branded ? 'portal.halden.co' : 'meta.cosx.dev') : 'Need help? help@cosx.co',
      modeClass: dark ? 'ink-mode' : '',
      ground: dark ? 'ink' : 'paper',
      full: { style: { width: '100%' } },
      samples: [
        ['li.wei@halden.co', '有通行密钥'],
        ['sam@cosx.co', '密码 + 二次验证 + 多个工作区'],
        ['anna@harbour.vc', '公司单点登录'],
        ['jordan@acme.com', '新用户'],
      ].map(([e, note]) => ({ email: e, note, use: () => this.route(e) })),
      restart: () => this.setState({ screen: 'signin', email: '', kind: '', bad: false }),
      map,
      go,
      is,
      email: s.email,
      setEmail: (ev) => this.setState({ email: ev && ev.target ? ev.target.value : ev, bad: false }),
      enterEmail: (ev) => {
        if (ev && ev.key === 'Enter') this.route(this.state.email);
      },
      submitEmail: () => this.route(this.state.email),
      emailBad: s.bad,
      emailHint: s.bad
        ? 'Enter a full email address, like name@company.com.'
        : s.ssoNote
          ? 'Enter your work email and we\u2019ll send you to your company\u2019s sign-in.'
          : undefined,
      emailShown: email,
      signinTitle: branded ? 'Sign in to Halden Capital' : 'Sign in to Metaroom',
      signinSub: branded ? 'Use the email your invitation was sent to.' : 'Use your work email or an account you already have.',
      brandTile: branded ? '#D6E4DA' : '#FFE3A0',
      logoD: branded ? 'none' : 'block',
      initialD: branded ? 'inline' : 'none',
      brandName: branded ? 'Halden Capital' : 'Metaroom',
      ssoLabel: 'Continue with Okta',
      ssoGo: go.done,
      passkeyBtn: 'Use passkey',
      afterPrimary: () => this.setState({ screen: s.kind === 'password' ? 'chooser' : 'done' }),
      afterCode: () => this.setState({ screen: s.kind === 'new' || !s.kind ? 'profile' : 'chooser' }),
      cellsMfa: cells('7304', 4),
      cellsEmail: cells('482', 3),
      trust: s.trust,
      setTrust: (v) => this.setState({ trust: typeof v === 'boolean' ? v : !this.state.trust }),
      wsName: s.wsName,
      setWs: (ev) => this.setState({ wsName: ev && ev.target ? ev.target.value : ev }),
      wsHint: 'Address: ' + slug + '.meta.cosx.dev · you can change this later',
      workspaces: [
        ['C', 'COSX Advisory', 'Admin · last used today', '#FFE3A0', ['COSX Advisory', 'cosx.meta.cosx.dev']],
        ['H', 'Halden Capital', 'Customer · last used 3 days ago', '#D6E4DA', ['Halden Capital', 'portal.halden.co']],
        ['S', 'Sam Ortiz', 'Personal', '#ECE9E3', ['Sam Ortiz', 'sam.meta.cosx.dev']],
      ].map(([ini, name, meta, tile, t]) => ({ ini, name, meta, tile, open: () => this.setState({ screen: 'done', pick: t }) })),
      target: s.screen === 'done' && s.pick ? s.pick[0] : tg[0],
      targetUrl: s.screen === 'done' && s.pick ? s.pick[1] : tg[1],
      footNote:
        is.signin || ['cbOk', 'cbManual', 'cbFail', 'mcpOk'].includes(s.screen)
          ? ''
          : is.chooser
            ? ''
            : 'Having trouble? Ask your workspace admin or email help@cosx.co.',
      note: { step: nt[0], title: nt[1], points: nt[2].map((t) => ({ t })), vs: nt[3] },
    };
  }
}

export const pageCss =
  'html, body { margin: 0; background: #F5F2EC; -webkit-font-smoothing: antialiased; }\n    a { color: var(--text-primary); text-underline-offset: 3px; }\n    a:hover { color: var(--text-secondary); }\n    @keyframes mr-spin { to { transform: rotate(360deg); } }\n.h160:hover{background: var(--hover) !important}';

export default function MetaroomSignIn(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="MetaroomSignIn" precedence="page">
        {pageCss}
      </style>
      <div
        className={v.modeClass}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-sunk)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans-cjk)',
          fontSize: '14px',
        }}
      >
        {' '}
        <header
          style={{
            minHeight: '56px',
            flex: 'none',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px 12px',
            padding: '10px 24px',
            boxSizing: 'border-box',
            background: 'var(--bg-page)',
            borderBottom: '1px solid var(--rule)',
          }}
        >
          {' '}
          <span style={{ fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap' }}>Metaroom 登录与注册 · v2 原型</span>{' '}
          <div style={{ flex: '1' }} />{' '}
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>试试这些邮箱</span>{' '}
          {list(v.samples).map((s$, $i) => {
            const s1 = { ...v, s: s$, $index: $i };
            return (
              <Fragment key={$i}>
                {' '}
                <button
                  type="button"
                  onClick={s1.s?.use}
                  title={s1.s?.note}
                  style={{
                    height: '30px',
                    padding: '0 10px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'var(--bg-sunk)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >
                  {show(s1.s?.email)}
                </button>{' '}
              </Fragment>
            );
          })}{' '}
          <button
            type="button"
            onClick={v.toggleNotes}
            style={{
              height: '30px',
              padding: '0 10px',
              border: '1px solid var(--rule)',
              borderRadius: '8px',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans-cjk)',
              fontSize: '12px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {show(v.notesLabel)}
          </button>{' '}
          <button
            type="button"
            onClick={v.restart}
            style={{
              height: '30px',
              padding: '0 10px',
              border: '1px solid var(--rule)',
              borderRadius: '8px',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans-cjk)',
              fontSize: '12px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            重新开始
          </button>{' '}
        </header>{' '}
        <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
          {' '}
          <nav
            style={{
              width: '220px',
              flex: 'none',
              padding: '20px 14px',
              boxSizing: 'border-box',
              borderRight: '1px solid var(--rule)',
              background: 'var(--bg-page)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              overflowY: 'auto',
            }}
          >
            {' '}
            {list(v.map).map((g$, $i) => {
              const s2 = { ...v, g: g$, $index: $i };
              return (
                <Fragment key={$i}>
                  {' '}
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', padding: '14px 10px 6px' }}>
                    {show(s2.g?.label)}
                  </span>{' '}
                  {list(s2.g?.items).map((i$, $i) => {
                    const s3 = { ...s2, i: i$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        {' '}
                        <button
                          type="button"
                          onClick={s3.i?.go}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            minHeight: '34px',
                            padding: '0 10px',
                            border: 'none',
                            borderRadius: '8px',
                            background: s3.i?.bg,
                            color: s3.i?.fg,
                            fontFamily: 'var(--font-sans-cjk)',
                            fontSize: '13px',
                            fontWeight: s3.i?.w,
                            textAlign: 'left',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ fontSize: '11px', fontVariantNumeric: 'tabular-nums', color: s3.i?.nFg, width: '18px' }}>
                            {show(s3.i?.n)}
                          </span>
                          {show(s3.i?.label)}
                        </button>{' '}
                      </Fragment>
                    );
                  })}{' '}
                </Fragment>
              );
            })}{' '}
          </nav>{' '}
          <main
            lang="en-GB"
            ref={v.mainRef}
            style={{ flex: '1', minWidth: '0', display: 'flex', background: 'var(--bg-page)', overflow: 'hidden' }}
          >
            {' '}
            <div
              style={{
                flex: '1 1 520px',
                minWidth: '340px',
                display: 'flex',
                flexDirection: 'column',
                padding: `32px ${v.formPad ?? ''} 28px`,
                boxSizing: 'border-box',
                overflowY: 'auto',
              }}
            >
              {' '}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                {' '}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {' '}
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '7px',
                      background: v.brandTile,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#111',
                    }}
                  >
                    <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: v.logoD }} />
                    <span style={{ display: v.initialD }}>H</span>
                  </span>{' '}
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>{show(v.brandName)}</span>{' '}
                </div>{' '}
                <div
                  role="radiogroup"
                  aria-label="Theme"
                  onMouseEnter={v.themeEnter}
                  onMouseLeave={v.themeLeave}
                  onFocus={v.themeEnter}
                  onBlur={v.themeBlur}
                  style={{
                    display: 'inline-flex',
                    flex: 'none',
                    gap: v.themeGap,
                    padding: '3px',
                    transition: 'gap 180ms cubic-bezier(.2,0,.2,1)',
                    borderRadius: '10px',
                    background: 'var(--bg-sunk)',
                  }}
                >
                  {list(v.themeOpts).map((o$, $i) => {
                    const s4 = { ...v, o: o$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={s4.o?.on}
                          aria-label={s4.o?.label}
                          title={s4.o?.label}
                          onClick={s4.o?.pick}
                          tabIndex={s4.o?.tab}
                          style={{
                            width: s4.o?.w,
                            opacity: s4.o?.op,
                            padding: '0',
                            overflow: 'hidden',
                            height: '28px',
                            border: 'none',
                            borderRadius: '8px',
                            display: 'grid',
                            placeItems: 'center',
                            background: s4.o?.bg,
                            color: s4.o?.fg,
                            cursor: 'pointer',
                            transition: 'width 180ms cubic-bezier(.2,0,.2,1), opacity 180ms cubic-bezier(.2,0,.2,1)',
                          }}
                        >
                          <DS.Icon name={s4.o?.icon} size={15} />
                        </button>
                      </Fragment>
                    );
                  })}
                </div>{' '}
              </div>{' '}
              <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
                {' '}
                <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {' '}
                    {v.is?.signin ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              {show(v.signinTitle)}
                            </span>
                            <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.signinSub)}</span>
                          </div>{' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className="sc-host-x" style={{ width: '100%' }}>
                              <DS.Button variant="secondary" size="lg" ground={v.ground} onClick={v.go?.done} {...v.full}>
                                <img
                                  src="../assets/social-google.svg"
                                  alt=""
                                  style={{ width: '18px', height: '18px', display: 'block', objectFit: 'contain' }}
                                />
                                Continue with Google
                              </DS.Button>
                            </div>
                            <div className="sc-host-x" style={{ width: '100%' }}>
                              <DS.Button variant="secondary" size="lg" ground={v.ground} onClick={v.go?.done} {...v.full}>
                                <img
                                  src="../assets/social-microsoft.svg"
                                  alt=""
                                  style={{ width: '18px', height: '18px', display: 'block', objectFit: 'contain' }}
                                />
                                Sign in with Microsoft
                              </DS.Button>
                            </div>
                            <div className="sc-host-x" style={{ width: '100%' }}>
                              <DS.Button variant="secondary" size="lg" ground={v.ground} onClick={v.go?.done} {...v.full}>
                                <img
                                  src="../assets/social-apple.svg"
                                  alt=""
                                  style={{ width: '18px', height: '18px', display: v.appleD, objectFit: 'contain' }}
                                />
                                <img
                                  src="../assets/social-apple-white.svg"
                                  alt=""
                                  style={{ width: '18px', height: '18px', display: v.appleWD, objectFit: 'contain' }}
                                />
                                Continue with Apple
                              </DS.Button>
                            </div>
                          </div>{' '}
                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}
                          >
                            <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                            or
                            <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                          </div>{' '}
                          <DS.Input
                            label="Work email"
                            type="email"
                            autocomplete="username webauthn"
                            placeholder="name@company.com"
                            value={v.email}
                            onChange={v.setEmail}
                            onKeyDown={v.enterEmail}
                            invalid={v.emailBad}
                            hint={v.emailHint}
                          />{' '}
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button size="lg" ground={v.ground} onClick={v.submitEmail} {...v.full}>
                              Continue with email
                            </DS.Button>
                          </div>{' '}
                          <div
                            style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '13px', fontWeight: '500' }}
                          >
                            <button
                              type="button"
                              onClick={v.go?.passkey}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                border: 'none',
                                background: 'none',
                                padding: '0',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer',
                              }}
                            >
                              <DS.Icon name="fingerprint" size={15} />
                              Sign in with a passkey
                            </button>
                            <button
                              type="button"
                              onClick={v.ssoHint}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                border: 'none',
                                background: 'none',
                                padding: '0',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer',
                              }}
                            >
                              <DS.Icon name="building-2" size={15} />
                              Single sign-on
                            </button>
                          </div>{' '}
                          <div style={{ height: '1px', background: 'var(--rule-soft)' }} />{' '}
                          <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            New to Metaroom? Enter your email above and we'll set up your account.
                          </span>{' '}
                          <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            By continuing you agree to the Terms of Service and Privacy Policy.
                          </span>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.sso ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {' '}
                          <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                            Harbour Ventures uses single sign-on
                          </span>{' '}
                          <button
                            type="button"
                            onClick={v.go?.signin}
                            style={{
                              alignSelf: 'flex-start',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              height: '30px',
                              padding: '0 10px',
                              border: 'none',
                              borderRadius: '999px',
                              background: 'var(--bg-sunk)',
                              color: 'var(--text-primary)',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '13px',
                              cursor: 'pointer',
                            }}
                          >
                            {show(v.emailShown)}
                            <span style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>Change</span>
                          </button>{' '}
                          <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            Your company signs you in through Okta. You'll come straight back to Metaroom afterwards.
                          </span>{' '}
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button size="lg" ground={v.ground} onClick={v.ssoGo} {...v.full}>
                              {show(v.ssoLabel)}
                            </DS.Button>
                          </div>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.passkey ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'stretch' }}>
                          {' '}
                          <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                            Use your passkey
                          </span>{' '}
                          <button
                            type="button"
                            onClick={v.go?.signin}
                            style={{
                              alignSelf: 'flex-start',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              height: '30px',
                              padding: '0 10px',
                              border: 'none',
                              borderRadius: '999px',
                              background: 'var(--bg-sunk)',
                              color: 'var(--text-primary)',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '13px',
                              cursor: 'pointer',
                            }}
                          >
                            {show(v.emailShown)}
                            <span style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>Change</span>
                          </button>{' '}
                          <div style={{ display: 'grid', placeItems: 'center', padding: '20px 0' }}>
                            <span
                              style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '20px',
                                background: 'var(--bg-sunk)',
                                display: 'grid',
                                placeItems: 'center',
                              }}
                            >
                              <DS.Icon name="fingerprint" size={34} />
                            </span>
                          </div>{' '}
                          <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', textAlign: 'center' }}>
                            Confirm with Touch ID, Face ID, Windows Hello or your security key.
                          </span>{' '}
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button size="lg" ground={v.ground} onClick={v.afterPrimary} {...v.full}>
                              {show(v.passkeyBtn)}
                            </DS.Button>
                          </div>{' '}
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '13px' }}>
                            <button
                              type="button"
                              onClick={v.go?.password}
                              style={{
                                border: 'none',
                                background: 'none',
                                padding: '0',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                fontWeight: '500',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                            >
                              Use password
                            </button>
                            <button
                              type="button"
                              onClick={v.go?.emailcode}
                              style={{
                                border: 'none',
                                background: 'none',
                                padding: '0',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                fontWeight: '500',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                            >
                              Email me a code
                            </button>
                          </div>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.password ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {' '}
                          <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                            Enter your password
                          </span>{' '}
                          <button
                            type="button"
                            onClick={v.go?.signin}
                            style={{
                              alignSelf: 'flex-start',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              height: '30px',
                              padding: '0 10px',
                              border: 'none',
                              borderRadius: '999px',
                              background: 'var(--bg-sunk)',
                              color: 'var(--text-primary)',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '13px',
                              cursor: 'pointer',
                            }}
                          >
                            {show(v.emailShown)}
                            <span style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>Change</span>
                          </button>{' '}
                          <DS.Input label="Password" type="password" autocomplete="current-password" defaultValue="correct-horse-battery" />{' '}
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button size="lg" ground={v.ground} onClick={v.go?.mfa} {...v.full}>
                              Sign in
                            </DS.Button>
                          </div>{' '}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <button
                              type="button"
                              onClick={v.go?.emailcode}
                              style={{
                                border: 'none',
                                background: 'none',
                                padding: '0',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                fontWeight: '500',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                            >
                              Email me a code instead
                            </button>
                            <span style={{ color: 'var(--text-secondary)' }}>Forgot password?</span>
                          </div>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.mfa ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              Confirm it's you
                            </span>
                            <span style={{ fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                              COSX Advisory requires two-step verification.
                            </span>
                          </div>{' '}
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button size="lg" ground={v.ground} onClick={v.go?.chooser} {...v.full}>
                              Use passkey
                            </DS.Button>
                          </div>{' '}
                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}
                          >
                            <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                            or enter the code from your authenticator app
                            <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                          </div>{' '}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {list(v.cellsMfa).map((c$, $i) => {
                              const s5 = { ...v, c: c$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  <span
                                    style={{
                                      flex: '1',
                                      height: '50px',
                                      borderRadius: '8px',
                                      background: s5.c?.bg,
                                      boxShadow: s5.c?.ring,
                                      display: 'grid',
                                      placeItems: 'center',
                                      fontSize: '20px',
                                      fontWeight: '500',
                                      fontVariantNumeric: 'tabular-nums',
                                    }}
                                  >
                                    {show(s5.c?.d)}
                                  </span>
                                </Fragment>
                              );
                            })}
                          </div>{' '}
                          <DS.Checkbox checked={v.trust} onChange={v.setTrust} label="Trust this device for 30 days" />{' '}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ fontWeight: '500', textDecoration: 'underline' }}>Use a backup code</span>
                            <button
                              type="button"
                              onClick={v.go?.chooser}
                              style={{
                                border: 'none',
                                background: 'none',
                                padding: '0',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              Verify
                            </button>
                          </div>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.emailcode ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              Check your email
                            </span>
                            <span style={{ fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                              {'We sent a 6-digit code to '}
                              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{show(v.emailShown)}</span>. It expires in
                              10 minutes.
                            </span>
                          </div>{' '}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {list(v.cellsEmail).map((c$, $i) => {
                              const s6 = { ...v, c: c$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  <span
                                    style={{
                                      flex: '1',
                                      height: '50px',
                                      borderRadius: '8px',
                                      background: s6.c?.bg,
                                      boxShadow: s6.c?.ring,
                                      display: 'grid',
                                      placeItems: 'center',
                                      fontSize: '20px',
                                      fontWeight: '500',
                                      fontVariantNumeric: 'tabular-nums',
                                    }}
                                  >
                                    {show(s6.c?.d)}
                                  </span>
                                </Fragment>
                              );
                            })}
                          </div>{' '}
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button size="lg" ground={v.ground} onClick={v.afterCode} {...v.full}>
                              Continue
                            </DS.Button>
                          </div>{' '}
                          <div
                            style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}
                          >
                            <span>Resend in 48 s</span>
                            <button
                              type="button"
                              onClick={v.go?.signin}
                              style={{
                                border: 'none',
                                background: 'none',
                                padding: '0',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                fontWeight: '500',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                            >
                              Wrong email?
                            </button>
                          </div>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.profile ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              Create your account
                            </span>
                            <span style={{ fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{show(v.emailShown)}</span>
                              {' is verified. One more step.'}
                            </span>
                          </div>{' '}
                          <DS.Input label="Your name" defaultValue="Jordan Lee" autocomplete="name" />{' '}
                          <DS.Checkbox checked={true} label="I agree to the Terms and Privacy notice" />{' '}
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button size="lg" ground={v.ground} onClick={v.go?.workspace} {...v.full}>
                              Create account
                            </DS.Button>
                          </div>{' '}
                          <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            No password needed. You'll sign in with a passkey or an email code.
                          </span>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.workspace ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              Join or create a workspace
                            </span>
                            <span style={{ fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                              A workspace is where your team's projects and documents live.
                            </span>
                          </div>{' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {' '}
                            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                              {'Invitations for '}
                              {show(v.emailShown)}
                            </span>{' '}
                            {v.halOpen ? (
                              <>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 14px',
                                    borderRadius: '12px',
                                    boxShadow: 'inset 0 0 0 1px var(--rule)',
                                  }}
                                >
                                  <span
                                    style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '8px',
                                      background: '#D6E4DA',
                                      color: '#111',
                                      display: 'grid',
                                      placeItems: 'center',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      flex: 'none',
                                    }}
                                  >
                                    H
                                  </span>
                                  <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.35' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Halden Capital</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Invited by Li Wei · 2 days ago</span>
                                  </div>
                                  <DS.Button variant="ghost" size="sm" ground={v.ground} onClick={v.declineHal}>
                                    Decline
                                  </DS.Button>
                                  <DS.Button size="sm" ground={v.ground} onClick={v.go?.enrol}>
                                    Join
                                  </DS.Button>
                                </div>
                              </>
                            ) : null}
                            {v.halDeclined ? (
                              <>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    background: 'var(--bg-sunk)',
                                    fontSize: '13px',
                                  }}
                                >
                                  <span style={{ flex: '1', color: 'var(--text-secondary)' }}>
                                    Invitation from Halden Capital declined.
                                  </span>
                                  <button
                                    type="button"
                                    onClick={v.undoHal}
                                    style={{
                                      border: 'none',
                                      background: 'none',
                                      padding: '0',
                                      color: 'var(--text-primary)',
                                      fontFamily: 'var(--font-sans)',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      textDecoration: 'underline',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Undo
                                  </button>
                                </div>
                              </>
                            ) : null}{' '}
                          </div>{' '}
                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}
                          >
                            <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                            or start your own
                            <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                          </div>{' '}
                          <DS.Input label="Company or team name" value={v.wsName} onChange={v.setWs} hint={v.wsHint} />{' '}
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button variant="secondary" size="lg" ground={v.ground} onClick={v.go?.enrol} {...v.full}>
                              Create workspace
                            </DS.Button>
                          </div>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.enrol ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {' '}
                          <div style={{ display: 'grid', placeItems: 'center', padding: '8px 0' }}>
                            <span
                              style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '18px',
                                background: '#FFE3A0',
                                color: '#111',
                                display: 'grid',
                                placeItems: 'center',
                              }}
                            >
                              <DS.Icon name="key-round" size={28} />
                            </span>
                          </div>{' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'center' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              Sign in faster next time
                            </span>
                            <span style={{ fontSize: '14px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                              Save a passkey on this device. It also counts as your second step, so you won't need a code.
                            </span>
                          </div>{' '}
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button size="lg" ground={v.ground} onClick={v.go?.done} {...v.full}>
                              Create a passkey
                            </DS.Button>
                          </div>{' '}
                          <button
                            type="button"
                            onClick={v.go?.done}
                            style={{
                              alignSelf: 'center',
                              border: 'none',
                              background: 'none',
                              padding: '0',
                              color: 'var(--text-primary)',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '13px',
                              fontWeight: '500',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                          >
                            Not now
                          </button>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.chooser ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              Choose a workspace
                            </span>
                            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                              {'Signed in as '}
                              {show(v.emailShown)}
                            </span>
                          </div>{' '}
                          {list(v.workspaces).map((w$, $i) => {
                            const s7 = { ...v, w: w$, $index: $i };
                            return (
                              <Fragment key={$i}>
                                {' '}
                                <button
                                  type="button"
                                  onClick={s7.w?.open}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 14px',
                                    border: 'none',
                                    borderRadius: '12px',
                                    background: 'var(--bg-page)',
                                    boxShadow: 'inset 0 0 0 1px var(--rule)',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-sans)',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                  }}
                                  className={'h160'}
                                >
                                  <span
                                    style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '8px',
                                      background: s7.w?.tile,
                                      color: '#111',
                                      display: 'grid',
                                      placeItems: 'center',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      flex: 'none',
                                    }}
                                  >
                                    {show(s7.w?.ini)}
                                  </span>
                                  <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.35' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(s7.w?.name)}</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s7.w?.meta)}</span>
                                  </div>
                                  <DS.Icon name="chevron-right" size={16} />
                                </button>{' '}
                              </Fragment>
                            );
                          })}{' '}
                          {v.velaOpen ? (
                            <>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  padding: '12px 14px',
                                  borderRadius: '12px',
                                  background: '#FFF1D6',
                                  color: '#111',
                                }}
                              >
                                <span
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: '#E6DDF0',
                                    display: 'grid',
                                    placeItems: 'center',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    flex: 'none',
                                  }}
                                >
                                  V
                                </span>
                                <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.35' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Vela Family Office</span>
                                  <span style={{ fontSize: '12px', color: 'rgba(17,17,17,.7)' }}>Invitation · Customer</span>
                                </div>
                                <DS.Button variant="ghost" size="sm" ground="yellow" onClick={v.declineVela}>
                                  Decline
                                </DS.Button>
                                <DS.Button size="sm" ground="yellow" onClick={v.go?.done}>
                                  Accept
                                </DS.Button>
                              </div>
                            </>
                          ) : null}
                          {v.velaDeclined ? (
                            <>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '10px 14px',
                                  borderRadius: '12px',
                                  background: 'var(--bg-sunk)',
                                  fontSize: '13px',
                                }}
                              >
                                <span style={{ flex: '1', color: 'var(--text-secondary)' }}>
                                  Invitation from Vela Family Office declined. They won't be notified.
                                </span>
                                <button
                                  type="button"
                                  onClick={v.undoVela}
                                  style={{
                                    border: 'none',
                                    background: 'none',
                                    padding: '0',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Undo
                                </button>
                              </div>
                            </>
                          ) : null}{' '}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '4px' }}>
                            <button
                              type="button"
                              onClick={v.go?.workspace}
                              style={{
                                border: 'none',
                                background: 'none',
                                padding: '0',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                fontWeight: '500',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                            >
                              Create a workspace
                            </button>
                            <button
                              type="button"
                              onClick={v.restart}
                              style={{
                                border: 'none',
                                background: 'none',
                                padding: '0',
                                color: 'var(--text-secondary)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                cursor: 'pointer',
                              }}
                            >
                              Sign out
                            </button>
                          </div>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.desktop ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <span
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '14px',
                              background: 'var(--bg-sunk)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="monitor" size={26} />
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              Sign in to Metaroom
                            </span>
                            <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                              Your browser opens to finish signing in, then brings you back here.
                            </span>
                          </div>
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button size="lg" ground={v.ground} onClick={v.go?.desktopWait} {...v.full}>
                              Continue in browser
                            </DS.Button>
                          </div>
                          <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            Same account as the web app. Passkeys and single sign-on work the same way.
                          </span>
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.desktopWait ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <span
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '999px',
                              border: '2px solid var(--text-primary)',
                              borderRightColor: 'transparent',
                              boxSizing: 'border-box',
                              animation: 'mr-spin .8s linear infinite',
                            }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              Finish signing in in your browser
                            </span>
                            <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                              We opened a new tab. Come back here once you see “You’re signed in”.
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <DS.Button variant="secondary" size="lg" ground={v.ground} onClick={v.go?.cbOk}>
                              Open browser again
                            </DS.Button>
                            <DS.Button variant="ghost" size="lg" ground={v.ground} onClick={v.go?.desktop}>
                              Cancel
                            </DS.Button>
                          </div>
                          <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            Waiting up to 10 minutes. You can also paste the sign-in link from your browser.
                          </span>
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.cbOk ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <span
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '14px',
                              background: '#FFE3A0',
                              color: '#111',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="check" size={26} />
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              You’re signed in
                            </span>
                            <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                              Returning you to the Metaroom app. You can close this tab.
                            </span>
                          </div>
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button size="lg" ground={v.ground} onClick={v.go?.chooser} {...v.full}>
                              Open Metaroom
                            </DS.Button>
                          </div>
                          <button
                            type="button"
                            onClick={v.go?.cbManual}
                            style={{
                              alignSelf: 'flex-start',
                              border: 'none',
                              background: 'none',
                              padding: '0',
                              color: 'var(--text-primary)',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '13px',
                              fontWeight: '500',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                          >
                            Didn’t open? Try again
                          </button>
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.cbManual ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <span
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '14px',
                              background: 'var(--bg-sunk)',
                              color: 'var(--text-primary)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="app-window" size={26} />
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              Open the Metaroom app
                            </span>
                            <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                              Your browser asked before opening the app. Choose Open Metaroom in the prompt, or use the button below.
                            </span>
                          </div>
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button size="lg" ground={v.ground} onClick={v.go?.chooser} {...v.full}>
                              Open Metaroom
                            </DS.Button>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              padding: '14px 16px',
                              borderRadius: '12px',
                              background: 'var(--bg-sunk)',
                            }}
                          >
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>Don’t have the app on this computer?</span>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                              Download it, or keep working in the browser.
                            </span>
                            <div style={{ display: 'flex', gap: '16px', paddingTop: '4px' }}>
                              <button
                                type="button"
                                onClick={v.go?.cbManual}
                                style={{
                                  alignSelf: 'flex-start',
                                  border: 'none',
                                  background: 'none',
                                  padding: '0',
                                  color: 'var(--text-primary)',
                                  fontFamily: 'var(--font-sans)',
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                              >
                                Download for macOS
                              </button>
                              <button
                                type="button"
                                onClick={v.go?.chooser}
                                style={{
                                  alignSelf: 'flex-start',
                                  border: 'none',
                                  background: 'none',
                                  padding: '0',
                                  color: 'var(--text-primary)',
                                  fontFamily: 'var(--font-sans)',
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                              >
                                Continue in browser
                              </button>
                            </div>
                          </div>
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.cbFail ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <span
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '14px',
                              background: 'var(--status-error-wash)',
                              color: 'var(--status-error-text)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="x" size={26} />
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              Sign-in didn’t finish
                            </span>
                            <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                              The request expired after 10 minutes, so nothing was changed.
                            </span>
                          </div>
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button size="lg" ground={v.ground} onClick={v.go?.desktop} {...v.full}>
                              Try again in the app
                            </DS.Button>
                          </div>
                          <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            Still stuck? Email help@cosx.co with reference 7F2K-91.
                          </span>
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.mcp ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                          {' '}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '10px',
                                background: 'var(--bg-sunk)',
                                display: 'grid',
                                placeItems: 'center',
                              }}
                            >
                              <DS.Icon name="bot" size={22} />
                            </span>
                            <DS.Icon name="arrow-right" size={16} />
                            <span
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '10px',
                                background: '#FFE3A0',
                                display: 'grid',
                                placeItems: 'center',
                              }}
                            >
                              <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%' }} />
                            </span>
                          </div>{' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              Claude wants to use Metaroom
                            </span>
                            <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                              {'Signed in as sam@cosx.co · '}
                              <span style={{ textDecoration: 'underline' }}>Not you?</span>
                            </span>
                          </div>{' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                                Workspaces Claude can use
                              </span>
                              <button
                                type="button"
                                onClick={v.mcpAll}
                                style={{
                                  border: 'none',
                                  background: 'none',
                                  padding: '0',
                                  color: 'var(--text-primary)',
                                  fontFamily: 'var(--font-sans)',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                              >
                                {show(v.mcpAllLabel)}
                              </button>
                            </div>
                            <div
                              role="group"
                              aria-label="Workspaces"
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '12px',
                                boxShadow: 'inset 0 0 0 1px var(--rule)',
                                overflow: 'hidden',
                              }}
                            >
                              {list(v.mcpRows).map((w$, $i) => {
                                const s8 = { ...v, w: w$, $index: $i };
                                return (
                                  <Fragment key={$i}>
                                    <label
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        minHeight: '56px',
                                        padding: '0 14px',
                                        borderTop: s8.w?.sep,
                                        background: s8.w?.bg,
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <span
                                        style={{
                                          width: '32px',
                                          height: '32px',
                                          borderRadius: '7px',
                                          background: s8.w?.tile,
                                          color: '#111',
                                          display: 'grid',
                                          placeItems: 'center',
                                          fontSize: '12px',
                                          fontWeight: '600',
                                          flex: 'none',
                                        }}
                                      >
                                        {show(s8.w?.ini)}
                                      </span>
                                      <span
                                        style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.35' }}
                                      >
                                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(s8.w?.name)}</span>
                                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s8.w?.role)}</span>
                                      </span>
                                      <DS.Checkbox checked={s8.w?.on} onChange={s8.w?.toggle} aria-label={s8.w?.name} />
                                    </label>
                                  </Fragment>
                                );
                              })}
                            </div>
                            <span style={{ fontSize: '12px', color: v.mcpHintFg }}>{show(v.mcpHint)}</span>
                          </div>{' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                              In each selected workspace, Claude will be able to
                            </span>
                            {list(v.mcpCan).map((p$, $i) => {
                              const s9 = { ...v, p: p$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  <div style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: '1.5' }}>
                                    <span style={{ flex: 'none', display: 'inline-flex', paddingTop: '2px' }}>
                                      <DS.Icon name={s9.p?.icon} size={16} />
                                    </span>
                                    {show(s9.p?.t)}
                                  </div>
                                </Fragment>
                              );
                            })}
                          </div>{' '}
                          <div
                            style={{
                              padding: '12px 14px',
                              borderRadius: '12px',
                              background: 'var(--bg-sunk)',
                              fontSize: '13px',
                              lineHeight: '1.6',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            It can’t delete or share files, send messages for you, or see workspaces you didn’t select.
                          </div>{' '}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <DS.Button variant="secondary" size="lg" ground={v.ground} onClick={v.go?.signin} {...v.full}>
                              Deny
                            </DS.Button>
                            <DS.Button size="lg" ground={v.ground} onClick={v.mcpAllow} disabled={v.mcpNone} {...v.full}>
                              {show(v.mcpAllowLabel)}
                            </DS.Button>
                          </div>{' '}
                          <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            Remove access any time in Settings → Connected apps.
                          </span>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.mcpOk ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <span
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '14px',
                              background: '#FFE3A0',
                              color: '#111',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="check" size={26} />
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-.015em', lineHeight: '1.2' }}>
                              {'Claude is connected to '}
                              {show(v.mcpName)}
                            </span>
                            <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                              {show(v.mcpList)}. Go back to Claude to continue; you can close this tab.
                            </span>
                          </div>
                          <div className="sc-host-x" style={{ width: '100%' }}>
                            <DS.Button variant="secondary" size="lg" ground={v.ground} onClick={v.go?.mcp} {...v.full}>
                              Close tab
                            </DS.Button>
                          </div>
                          <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            Connected apps can be removed in Settings → Connected apps.
                          </span>
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.is?.done ? (
                      <>
                        {' '}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px',
                            alignItems: 'center',
                            padding: '24px 0',
                            textAlign: 'center',
                          }}
                        >
                          {' '}
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '999px',
                              border: '2px solid var(--text-primary)',
                              borderRightColor: 'transparent',
                              boxSizing: 'border-box',
                              animation: 'mr-spin .8s linear infinite',
                            }}
                          />{' '}
                          <span style={{ fontSize: '20px', fontWeight: '500' }}>
                            {'Opening '}
                            {show(v.target)}
                          </span>{' '}
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{show(v.targetUrl)}</span>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                  </div>{' '}
                  <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.footNote)}</span>{' '}
                </div>{' '}
              </div>{' '}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px 16px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Privacy · Terms · Status</span>
                <div style={{ width: '180px' }}>
                  <DS.Select options={v.langOpts} value={v.langVal} onChange={v.setLang} aria-label="Language" />
                </div>
              </div>{' '}
            </div>{' '}
            <div style={{ flex: '0 1 560px', minWidth: '300px', padding: '24px', boxSizing: 'border-box', display: v.panelD }}>
              {' '}
              <div
                style={{
                  '--panel-mark': v.panel?.mark,
                  flex: '1',
                  borderRadius: '24px',
                  background: v.panel?.bg,
                  color: '#111',
                  padding: v.panelPad,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '32px',
                  overflow: 'hidden',
                }}
              >
                {' '}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="../assets/logo-wordmark.svg" alt="COSX" style={{ height: '22px', display: v.panel?.cosxD }} />
                  <span style={{ display: v.panel?.custD, alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '7px',
                        background: '#111',
                        color: '#D6E4DA',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      H
                    </span>
                    <span style={{ fontSize: '17px', fontWeight: '600', letterSpacing: '.06em' }}>HALDEN</span>
                  </span>
                </div>{' '}
                <div style={{ display: v.panel?.stepsD, flexDirection: 'column', gap: '4px' }}>
                  {' '}
                  {list(v.panel?.steps).map((p$, $i) => {
                    const s10 = { ...v, p: p$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            minHeight: '48px',
                            borderBottom: '1px solid rgba(17,17,17,.1)',
                          }}
                        >
                          <span
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '999px',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: s10.p?.bg,
                              color: s10.p?.fg,
                              boxShadow: s10.p?.ring,
                              flex: 'none',
                            }}
                          >
                            {show(s10.p?.n)}
                          </span>
                          <span style={{ fontSize: '16px', fontWeight: s10.p?.w, color: s10.p?.tfg }}>{show(s10.p?.label)}</span>
                        </div>
                      </Fragment>
                    );
                  })}{' '}
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {' '}
                  <span style={{ fontSize: v.panelFs, fontWeight: '500', lineHeight: '1.22', letterSpacing: '-.02em', textWrap: 'pretty' }}>
                    {show(v.panel?.a)}
                    <span
                      style={{
                        background: 'linear-gradient(transparent 40%, var(--panel-mark) 40%, var(--panel-mark) 94%, transparent 94%)',
                        WebkitBoxDecorationBreak: 'clone',
                        boxDecorationBreak: 'clone',
                        padding: '0 .08em',
                        margin: '0 -.08em',
                      }}
                    >
                      {show(v.panel?.b)}
                    </span>
                  </span>{' '}
                  <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'rgba(17,17,17,.7)', maxWidth: '30em' }}>
                    {show(v.panel?.sub)}
                  </span>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </main>{' '}
          <aside
            lang="zh-CN"
            style={{
              display: v.notesD,
              width: '300px',
              flex: 'none',
              padding: '28px 24px',
              boxSizing: 'border-box',
              borderLeft: '1px solid var(--rule)',
              background: 'var(--bg-page)',
              flexDirection: 'column',
              gap: '16px',
              overflowY: 'auto',
            }}
          >
            {' '}
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.note?.step)}</span>{' '}
            <span style={{ fontSize: '18px', fontWeight: '500', lineHeight: '1.4' }}>{show(v.note?.title)}</span>{' '}
            {list(v.note?.points).map((p$, $i) => {
              const s11 = { ...v, p: p$, $index: $i };
              return (
                <Fragment key={$i}>
                  {' '}
                  <div style={{ display: 'flex', gap: '10px', fontSize: '13px', lineHeight: '1.65' }}>
                    <span
                      style={{ width: '6px', height: '6px', borderRadius: '999px', background: '#FFD166', marginTop: '8px', flex: 'none' }}
                    />
                    <span>{show(s11.p?.t)}</span>
                  </div>{' '}
                </Fragment>
              );
            })}{' '}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '16px', borderTop: '1px solid var(--rule-soft)' }}
            >
              {' '}
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>和旧流程相比</span>{' '}
              <span style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-secondary)' }}>{show(v.note?.vs)}</span>{' '}
            </div>{' '}
          </aside>{' '}
        </div>
      </div>
    </>
  );
}
