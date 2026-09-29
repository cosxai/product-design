// MetaroomCustomerPortal — converted once from the Claude Design export (pages/Metaroom Customer Portal.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';
import PortalRail from './PortalRail';
import PortalTabs from './PortalTabs';

/* eslint-disable */
class Logic extends DCLogic {
  dict() {
    return {
      en: {
        docEyebrow: 'Customer Portal · key pages · navigation 1a + 2a · Halden Capital as the demo workspace',
        docTitle: 'Conversation first, then tasks, documents, clients and content',
        docLede:
          'Each page at 1440 desktop and 390 phone. The customer sees five entries and no internal structure. Switch language, theme and brand in Tweaks.',
        navAgent: 'Conversation',
        navTasks: 'My tasks',
        navDocs: 'Documents',
        navClients: 'My clients',
        navContent: 'My content',
        s1Title: 'Home · conversation and my tasks',
        s1Note:
          'The Agent opens with what changed and what needs you. Results arrive inline as task, document and client cards. Handing over a task turns straight into a ticket.',
        today: 'Today · 24 September',
        agentSummary: 'Since Monday, 3 investors opened the Harbour data room and 1 signed the NDA. Two things are waiting for you.',
        agentSummaryShort: 'Since Monday, 3 investors opened the data room. One thing is waiting for you.',
        bAwaiting: 'Awaiting you',
        bProgress: 'In progress',
        bWithUs: 'With us',
        bDelivered: 'Delivered',
        bDraft: 'Draft',
        userMsg: "Chase the investors who haven't signed the NDA yet.",
        agentReply:
          "4 investors in Harbour Series A are invited but haven't signed the NDA. I've handed this to Sam Ortiz at COSX as a task, and you'll see each reply here.",
        agentReplyShort: "4 investors haven't signed the NDA. I've handed this to Sam Ortiz as a task.",
        nda4: 'Invited · NDA not signed · 4',
        openClients: 'Open in My clients',
        taskCreated: 'Task created · T-128',
        t128: 'Chase NDA signatures · 4 investors',
        t128Meta: 'With us · Sam Ortiz · started just now',
        openTask: 'Open task',
        composer: 'Ask a question or hand over a task…',
        composerShort: 'Ask or hand over a task…',
        asTask: 'As a task',
        newTask: 'New task',
        phAwaiting: 'Awaiting you · 2',
        phProgress: 'In progress · 3',
        a1: 'Sign the engagement letter',
        a1Meta: 'Kowloon Bay Fund II · 2 pages',
        sign: 'Sign',
        s2Title: 'Task detail · a lightweight ticket',
        s2Note:
          'Process and result on one page: who is handling it, how far along, who it is waiting on, and the deliverables. No internal fields.',
        kindContent: 'Content',
        t124: 'Turn the Q3 report into a website article and send it to subscribers',
        waitingYou: 'Waiting on you',
        waitingYouBody:
          'Draft v3 of the article is ready for your approval. The subscriber email goes out only after you approve it separately.',
        reviewDraft: 'Review draft',
        request: 'Request',
        requestBody:
          '“Turn this quarterly report into a website article and send it to subscribers. Keep the NAV figure from page 4 and the new fund photo.”',
        requestMeta: 'From the conversation · 23 September 2026 · Q3 report 2026.pdf attached',
        deliverables: 'Deliverables',
        d1: 'Q3 2026 investor update',
        d1Meta: 'Website article · v3',
        d2: 'Subscriber email',
        d2Meta: '1,284 recipients · not sent',
        activity: 'Activity',
        askAgent: 'Ask the Agent about this task',
        sideNote: 'Replies from Sam and the Agent also appear in your conversation.',
        comment: 'Write a comment…',
        kStatus: 'Status',
        kHandled: 'Handled by',
        kWaiting: 'Waiting on',
        kRequested: 'Requested',
        kDue: 'Due',
        kProject: 'Project',
        kFrom: 'From',
        vYou: 'You',
        vConv: 'Conversation',
        newFolder: 'New folder',
        idleLabel: 'Idle state',
        idleHint:
          'Drag across cards, ⇧-click for a range or ⌘A. Folders can be selected with files, so the bar only offers actions that work for both. Star sits on the card, top right.',
        selectOn: 'Selecting',
        nSelected: '2 selected',
        selectAll: 'Select all 26',
        s3Title: 'Documents · what was shared with me and what I uploaded',
        s3Note:
          'Views and the folder tree sit in the second column. All documents groups files by project, and locked parts of a project show as cards saying what unlocks them. The action bar switches with state; the frame shows two files selected.',
        upload: 'Upload',
        sharesWaiting: '2 shares are waiting for your response',
        sharesWaitingMeta: 'From Sam Ortiz and Harbour Ventures · one needs an NDA',
        review: 'Review',
        searchDocs: 'Search documents',
        allProjects: 'All projects',
        lastUpdated: 'Last updated',
        docStats: '26 documents',
        projHarbour: 'Harbour Series A',
        signed: 'Signed',
        s4Title: 'Viewer · one action bar, mode as a state',
        s4Note:
          'Shown in comment mode. Idle, the bar holds Download, Share, Comment, Present and More; in comment mode the same bar shows the mode and Done. Watermark and pins sit on the page; the zoom pill sits bottom right.',
        comment2: 'Comment',
        download: 'Download',
        share: 'Share',
        pageOf: 'Page 3 / 18',
        you: 'You',
        pinText: 'Does 7.2 cover transfers to a family trust?',
        pinReply: 'Yes, under 7.2(c). I have marked the clause for you.',
        reply: 'Reply…',
        resolve: 'Resolve',
        commentMode: 'Comment mode · click to place a pin',
        showResolved: 'Show resolved',
        done: 'Done',
        fitPage: 'Fit page',
        comments: 'Comments',
        open: 'Open',
        resolved: 'Resolved',
        jump: 'Jump to pin',
        ownThreads: 'You see your own threads and replies to them. Other investors cannot see your comments.',
        phoneViewer: 'Phone · comments as a bottom sheet',
        swipe: 'Swipe down to close',
        addComment: 'Add comment',
        cmpA: '4a · floating action bar',
        cmpABody:
          'One bar that changes with state: resident actions when idle, selection actions after a drag or ⇧-click, mode actions in comment or present. Shortcuts shown on every item; Esc steps back one state.',
        cmpB: '4b · in-page buttons',
        cmpBBody:
          'Clean while there are three or four actions. Past that everything slides into More, selection has nowhere to go, and shortcuts are no longer visible.',
        s5Title: 'My clients · funnel, follow-ups and one contact',
        s5Note:
          'Answers three questions: how many are at each stage, who needs a follow-up, and what one contact has done. Any follow-up becomes a task for us or the Agent.',
        addProspect: 'Add a prospect',
        declined: 'Declined · 3',
        revoked: 'Revoked · 1',
        followUp: 'Needs your follow-up',
        cContact: 'Contact',
        cStage: 'Stage',
        cLast: 'Last activity',
        cEng: 'Data room time',
        cNext: 'Next step',
        stDD: 'Due diligence',
        nextGate: 'To reach Term sheet: nothing missing. You can move Anna on.',
        filesViewed: 'Files viewed · this project',
        history: 'History',
        askFollow: 'Ask us to follow up with Anna',
        scope: 'Access data covers this project\u2019s data room only. Contacts never see each other, your notes, or this page.',
        s6Title: 'My content · approve what we wrote',
        s6Note:
          'One piece of content, not collections or fields. See what changed since the last version, who changed it, then approve or send back. Sending to subscribers is a separate, confirmed step.',
        v3vs2: 'Version 3 · compared with version 2',
        showChanges: 'Show changes',
        clean: 'Clean',
        artKicker: 'Insights · 24 September 2026',
        artTitle: 'Q3 2026: the fund returned 4.1% on a quiet quarter',
        imgReplaced: 'Image replaced',
        artP1a: 'Net asset value closed the quarter at',
        artOld: '£182.4m',
        artNew: '£184.9m',
        artP1b: 'after two new commitments from family offices in Hong Kong.',
        artP2: 'Deployment stayed measured: three positions were added and one was exited.',
        artP2add: 'The exit returned 2.3 times invested capital.',
        artComment: 'Sam: figure taken from page 4 of the Q3 report.',
        bApproval: 'Waiting for your approval',
        d1Where: 'Website article · Insights · portal.halden.co',
        whatChanged: 'What changed since v2',
        whoChanged: 'Who changed it',
        approve: 'Approve and publish',
        sendBack: 'Send back with a note',
        emailNote:
          'Goes to 1,284 subscribers after the article is published. Sending can\u2019t be undone, so it has its own confirmation.',
        sendTo: 'Send to 1,284 subscribers',
        seeFull: 'See the full preview',
        cmpRec: 'Recommendation',
        cmpRecBody:
          '4a for both the Customer Portal and Ops, so the two surfaces share one action model. The header keeps only the title and document state.',
      },
      zh: {
        docEyebrow: '客户门户 · 关键页面 · 导航方案 1a + 2a · 演示工作区 Halden Capital',
        docTitle: '先对话，再看任务、文档、客户和内容',
        docLede: '每个页面给出 1440 桌面与 390 手机两种尺寸。客户只看到五个入口，看不到任何内部结构。语言、主题、品牌可在 Tweaks 中切换。',
        navAgent: '对话',
        navTasks: '我的任务',
        navDocs: '文档',
        navClients: '我的客户',
        navContent: '我的内容',
        s1Title: '首页 · 对话与我的任务',
        s1Note: 'Agent 开场先说有什么变化、什么需要你处理。结果以任务、文档、客户卡片内嵌出现。交代一件事，就直接变成一张工单。',
        today: '今天 · 9 月 24 日',
        agentSummary: '周一以来，有 3 位投资人打开了 Harbour 数据室，1 位签了保密协议。有两件事等你处理。',
        agentSummaryShort: '周一以来，有 3 位投资人打开了数据室。有一件事等你处理。',
        bAwaiting: '等你处理',
        bProgress: '进行中',
        bWithUs: '我们处理中',
        bDelivered: '已交付',
        bDraft: '草稿',
        userMsg: '帮我催一下还没签保密协议的投资人。',
        agentReply:
          'Harbour A 轮中有 4 位投资人已受邀但还没签保密协议。我已把这件事作为任务交给 COSX 的 Sam Ortiz，每条回复都会出现在这里。',
        agentReplyShort: '有 4 位投资人还没签保密协议。我已作为任务交给 Sam Ortiz。',
        nda4: '已邀请 · 未签保密协议 · 4 位',
        openClients: '在“我的客户”中打开',
        taskCreated: '已创建任务 · T-128',
        t128: '催签保密协议 · 4 位投资人',
        t128Meta: '我们处理中 · Sam Ortiz · 刚刚开始',
        openTask: '打开任务',
        composer: '提个问题，或交代一件事…',
        composerShort: '提问或交代任务…',
        asTask: '作为任务',
        newTask: '新建任务',
        phAwaiting: '等你处理 · 2',
        phProgress: '进行中 · 3',
        a1: '签署委托协议',
        a1Meta: '九龙湾基金 II · 2 页',
        sign: '签署',
        s2Title: '任务详情 · 轻量工单',
        s2Note: '过程和结果在同一页：谁在处理、进展到哪、在等谁、交付了什么。不暴露任何内部字段。',
        kindContent: '内容',
        t124: '把第三季度报告改成网站文章，并发送给订阅者',
        waitingYou: '在等你',
        waitingYouBody: '文章第 3 版已可审批。订阅邮件需要你单独确认后才会发出。',
        reviewDraft: '查看草稿',
        request: '需求',
        requestBody: '“把这份季度报告改成网站文章，发给订阅者。保留第 4 页的净值数字和新的基金照片。”',
        requestMeta: '来自对话 · 2026 年 9 月 23 日 · 附件 Q3 report 2026.pdf',
        deliverables: '交付物',
        d1: '2026 年第三季度投资人简报',
        d1Meta: '网站文章 · 第 3 版',
        d2: '订阅邮件',
        d2Meta: '1,284 位收件人 · 未发送',
        activity: '动态',
        askAgent: '就这个任务问 Agent',
        sideNote: 'Sam 和 Agent 的回复也会出现在你的对话里。',
        comment: '写评论…',
        kStatus: '状态',
        kHandled: '处理人',
        kWaiting: '在等',
        kRequested: '提出于',
        kDue: '截止',
        kProject: '项目',
        kFrom: '来源',
        vYou: '你',
        vConv: '对话',
        newFolder: '新建文件夹',
        idleLabel: '空闲状态',
        idleHint: '拖拽框选、⇧ 点击选一段、⌘A 全选。文件夹可以和文件一起选中，所以栏里只放两者都适用的动作。星标放在卡片右上角。',
        selectOn: '选择中',
        nSelected: '已选 2 项',
        selectAll: '全选 26 项',
        s3Title: '文档 · 分享给我的和我上传的',
        s3Note:
          '第二栏是视图和文件夹树。“全部文档”按项目分组，项目中尚未开放的部分显示为锁定卡片，并说明怎样解锁。操作栏随状态切换内容，图中为选中两项。',
        upload: '上传',
        sharesWaiting: '有 2 个分享等你回应',
        sharesWaitingMeta: '来自 Sam Ortiz 和 Harbour Ventures · 其中一个需要签保密协议',
        review: '查看',
        searchDocs: '搜索文档',
        allProjects: '全部项目',
        lastUpdated: '最近更新',
        docStats: '26 个文档',
        projHarbour: 'Harbour A 轮',
        signed: '已签署',
        s4Title: '查看器 · 一条操作栏，模式是它的一个状态',
        s4Note:
          '图中为评论模式。空闲时栏里是下载、分享、评论、演示、更多；进入评论后，同一条栏换成模式说明和“完成”。水印和评论钉在页面上，缩放胶囊在右下角。',
        comment2: '评论',
        download: '下载',
        share: '分享',
        pageOf: '第 3 / 18 页',
        you: '你',
        pinText: '7.2 条是否包括转让给家族信托？',
        pinReply: '包括，见 7.2(c)。我已为你标出该条款。',
        reply: '回复…',
        resolve: '解决',
        commentMode: '评论模式 · 点击放置评论钉',
        showResolved: '显示已解决',
        done: '完成',
        fitPage: '适合页面',
        comments: '评论',
        open: '未解决',
        resolved: '已解决',
        jump: '跳到位置',
        ownThreads: '你只看到自己发起的讨论及其回复。其他投资人看不到你的评论。',
        phoneViewer: '手机 · 评论为底部抽屉',
        swipe: '下滑关闭',
        addComment: '添加评论',
        cmpA: '4a · 浮动操作栏',
        cmpABody:
          '一条栏按状态换内容：空闲时是常驻动作，拖拽或 ⇧ 点击选中后是选择动作，评论和演示时是模式动作。每项都显示快捷键，Esc 退回上一个状态。',
        cmpB: '4b · 页内按钮',
        cmpBBody: '只有三四个动作时很干净。再多就全部挤进“更多”，选中后的动作没有地方放，快捷键也看不到了。',
        s5Title: '我的客户 · 漏斗、跟进与单个联系人',
        s5Note: '回答三个问题：各阶段有多少人、谁需要跟进、某个联系人做过什么。任何跟进都可以直接变成交给我们或 Agent 的任务。',
        addProspect: '添加潜在客户',
        declined: '已拒绝 · 3',
        revoked: '已撤回 · 1',
        followUp: '需要你跟进',
        cContact: '联系人',
        cStage: '阶段',
        cLast: '最近动态',
        cEng: '数据室时长',
        cNext: '下一步',
        stDD: '尽职调查',
        nextGate: '进入“条款清单”阶段：条件已满足，可以推进 Anna。',
        filesViewed: '查看过的文件 · 本项目',
        history: '历程',
        askFollow: '请我们跟进 Anna',
        scope: '访问数据只包括本项目数据室。联系人之间互相不可见，也看不到你的备注和本页面。',
        s6Title: '我的内容 · 审批我们写好的内容',
        s6Note: '只呈现“一篇内容”，不暴露集合或字段。先看与上一版的差异和修改人，再批准或退回。发送给订阅者是单独确认的一步。',
        v3vs2: '第 3 版 · 对比第 2 版',
        showChanges: '显示修改',
        clean: '纯净视图',
        artKicker: '洞察 · 2026 年 9 月 24 日',
        artTitle: '2026 年第三季度：平稳季度中基金回报 4.1%',
        imgReplaced: '图片已替换',
        artP1a: '季度末基金净值为',
        artOld: '1.824 亿英镑',
        artNew: '1.849 亿英镑',
        artP1b: '，新增两笔来自香港家族办公室的认缴。',
        artP2: '投资节奏保持稳健：新增三项持仓，退出一项。',
        artP2add: '该退出实现 2.3 倍投资回报。',
        artComment: 'Sam：数字取自第三季度报告第 4 页。',
        bApproval: '等你审批',
        d1Where: '网站文章 · 洞察 · portal.halden.co',
        whatChanged: '相比第 2 版的修改',
        whoChanged: '修改人',
        approve: '批准并发布',
        sendBack: '附说明退回',
        emailNote: '文章发布后发送给 1,284 位订阅者。发送不可撤回，因此需要单独确认。',
        sendTo: '发送给 1,284 位订阅者',
        seeFull: '查看完整预览',
        cmpRec: '建议',
        cmpRecBody: '客户门户和 Ops 都用 4a，两边共用同一套动作模型。页头只放标题和文档状态。',
      },
    };
  }
  card(kind, title, fmt, meta, icon, thumbText) {
    const page = kind === 'page';
    return {
      title,
      fmt,
      meta,
      icon: icon || 'file',
      thumbText: thumbText || '',
      pageDisplay: page ? 'flex' : 'none',
      iconDisplay: page ? 'none' : 'flex',
      thumbBg: kind === 'lock' ? 'var(--bg-well)' : kind === 'proc' ? 'var(--bg-sunk)' : 'var(--bg-sunk)',
      thumbFg: kind === 'lock' || kind === 'proc' ? 'var(--text-secondary)' : 'var(--text-primary)',
      border: kind === 'lock' ? '1px dashed var(--rule)' : '1px solid var(--rule)',
      cbDisplay: kind === 'lock' ? 'none' : 'grid',
      cbBg: 'var(--bg-page)',
      cbRing: 'inset 0 0 0 1.5px var(--rule)',
      cbFg: 'transparent',
      selRing: 'none',
      starDisplay: 'none',
    };
  }
  star(c) {
    return { ...c, starDisplay: 'grid' };
  }
  sel(c) {
    return {
      ...c,
      cbBg: 'var(--text-primary)',
      cbRing: 'none',
      cbFg: 'var(--bg-page)',
      selRing: '0 0 0 1.5px var(--text-primary)',
      border: '1px solid var(--text-primary)',
    };
  }
  contacts(pick) {
    const rows = [
      [
        'AK',
        'Anna Kowalski',
        'Harbour Ventures',
        pick('Due diligence', '尽职调查'),
        pick('38 min ago', '38 分钟前'),
        '1 h 52',
        100,
        pick('Ready for Term sheet', '可进入条款清单'),
        'att',
        1,
      ],
      [
        '王',
        '王志远',
        '远川资本',
        pick('Invited', '已邀请'),
        pick('9 days ago', '9 天前'),
        '—',
        0,
        pick('NDA not signed', '未签保密协议'),
        'att',
        0,
      ],
      [
        'JP',
        'James Park',
        'Northgate LP',
        pick('Invited', '已邀请'),
        pick('6 days ago', '6 天前'),
        '—',
        0,
        pick('NDA not signed', '未签保密协议'),
        'att',
        0,
      ],
      [
        'CL',
        'Chen Lu',
        'Meridian Partners',
        pick('Opened data room', '打开数据室'),
        pick('16 days ago', '16 天前'),
        '12 min',
        11,
        pick('Gone quiet', '沉寂'),
        'quiet',
        0,
      ],
      [
        'DH',
        'David Hale',
        'Hale Family Office',
        pick('Due diligence', '尽职调查'),
        pick('Yesterday', '昨天'),
        '48 min',
        42,
        pick('Waiting on Q3 figures', '等待第三季度数据'),
        'prog',
        0,
      ],
      [
        'SN',
        'Sofia Novak',
        'Brightwater',
        pick('Term sheet', '条款清单'),
        pick('2 days ago', '2 天前'),
        '2 h 10',
        100,
        pick('Reviewing terms', '审阅条款中'),
        'prog',
        0,
      ],
      [
        'MR',
        'Maria Rossi',
        'Vela Family Office',
        pick('Invited', '已邀请'),
        pick('2 days ago', '2 天前'),
        '—',
        0,
        pick('Invitation pending', '邀请待接受'),
        'quiet',
        0,
      ],
    ];
    return rows.map(([ini, name, org, stage, last, eng, e, next, k, on]) => ({
      ini,
      name,
      org,
      stage,
      last,
      eng,
      engW: e + '%',
      next,
      dot: k === 'att' ? 'var(--brand-mark)' : k === 'prog' ? 'var(--text-primary)' : 'var(--grey)',
      bg: on ? 'var(--row-wash)' : 'transparent',
      radius: on ? '8px' : '0',
    }));
  }
  renderVals() {
    const lang = this.props.lang ?? 'en';
    const zh = lang === 'zh';
    const t = this.dict()[zh ? 'zh' : 'en'];
    const dark = this.props.theme === 'dark';
    const brand = this.props.brand ?? 'metaroom';
    const halden = brand === 'halden';
    const pick = (en, z) => (zh ? z : en);
    const badge = (kind) =>
      kind === 'att'
        ? { bBg: 'var(--brand-mark)', bFg: 'var(--ink)', bRing: 'none', bPad: '4px 7px', bDot: 'none' }
        : kind === 'prog'
          ? { bBg: 'transparent', bFg: 'var(--text-primary)', bRing: 'inset 0 0 0 1px var(--text-primary)', bPad: '3px 6px', bDot: 'none' }
          : { bBg: 'transparent', bFg: 'var(--text-secondary)', bRing: 'none', bPad: '3px 0', bDot: 'inline-block' };
    const task = (title, meta, status, kind) => ({
      title,
      meta,
      status,
      ...badge(kind),
      bg: kind === 'att' ? 'var(--row-wash)' : 'var(--bg-sunk)',
    });
    const sam = { ini: 'SO', avBg: 'var(--bg-well)', avFg: 'var(--text-primary)' };
    const agent = { ini: 'AI', avBg: 'var(--ink)', avFg: 'var(--brand-mark)' };
    const you = { ini: 'LW', avBg: 'var(--bg-chrome)', avFg: 'var(--text-primary)' };
    const activity = [
      {
        ...sam,
        who: 'Sam Ortiz · COSX',
        when: pick('10:12 today', '今天 10:12'),
        text: pick(
          'Draft v3 is ready. I used the NAV figure from page 4 and swapped in the new fund photo.',
          '第 3 版已完成。用了第 4 页的净值数字，换上了新的基金照片。',
        ),
      },
      {
        ...agent,
        who: 'Agent',
        when: pick('Yesterday 16:40', '昨天 16:40'),
        text: pick(
          'Drafted v1 from Q3 report 2026.pdf. 6 figures cited to their pages.',
          '根据 Q3 report 2026.pdf 起草第 1 版，6 个数字均标注出处页码。',
        ),
      },
      {
        ...you,
        who: pick('You', '你'),
        when: pick('23 Sep', '9 月 23 日'),
        text: pick('Created this task from the conversation.', '从对话中创建了这个任务。'),
      },
    ];
    return {
      sx: { b0: { style: { minHeight: '40px' } }, b1: { style: { width: '100%' } }, b2: { style: { flex: '1', minHeight: '44px' } } },
      t,
      lang,
      brand,
      htmlLang: zh ? 'zh-CN' : 'en-GB',
      modeClass: dark ? 'ink-mode' : '',
      ground: dark ? 'ink' : 'paper',
      rowWash: dark ? '#26231A' : 'var(--yellow-12)',
      brandField: halden ? '#D6E4DA' : 'var(--yellow)',
      brandMark: halden ? '#8FBF9F' : 'var(--yellow-accent)',
      brandName: halden ? 'Halden Capital' : 'Metaroom',
      brandInitial: halden ? 'H' : 'M',
      logoDisplay: halden ? 'none' : 'block',
      initialDisplay: halden ? 'inline' : 'none',
      awaiting: [
        {
          skip: 1,
          icon: 'pen-line',
          title: t.a1,
          meta: pick('Kowloon Bay Fund II · 2 pages · sent by Sam Ortiz', '九龙湾基金 II · 2 页 · Sam Ortiz 发送'),
          action: t.sign,
        },
        {
          icon: 'upload',
          title: pick('Upload 2025 bank statements', '上传 2025 年银行流水'),
          meta: pick('Harbour Series A · requested for due diligence', 'Harbour A 轮 · 尽调所需'),
          action: pick('Upload', '上传'),
        },
      ].filter((x) => !x.skip),
      ndaPeople: [
        ['AK', 'Anna Kowalski', 'Harbour Ventures', pick('Invited 9 days ago', '9 天前邀请')],
        ['王', '王志远', '远川资本', pick('Invited 9 days ago', '9 天前邀请')],
        ['JP', 'James Park', 'Northgate LP', pick('Invited 6 days ago', '6 天前邀请')],
        ['MR', 'Maria Rossi', 'Vela Family Office', pick('Invited 2 days ago', '2 天前邀请')],
      ]
        .slice(0, 3)
        .map(([ini, name, org, meta]) => ({ ini, name, org, meta })),
      suggestions: [
        pick('What changed this week?', '这周有什么变化？'),
        pick('Find the latest cap table', '找最新的股权结构表'),
        pick('Send the factsheet to everyone in due diligence', '把简介发给所有尽调中的投资人'),
      ].map((label) => ({ label })),
      taskGroups: [
        {
          label: pick('Awaiting you · 2', '等你处理 · 2'),
          items: [
            task(t.a1, 'T-131 · ' + pick('due Friday', '周五截止'), t.bAwaiting, 'att'),
            task(pick('Approve the Q3 investor update', '审批第三季度投资人简报'), 'T-124 · Sam Ortiz', t.bAwaiting, 'att'),
          ],
        },
        {
          label: pick('In progress · 3', '进行中 · 3'),
          items: [
            task(t.t128, 'T-128 · Sam Ortiz · ' + pick('just now', '刚刚'), t.bWithUs, 'prog'),
            task(
              pick('Prepare the Series A data room index', '整理 A 轮数据室目录'),
              'T-122 · Agent · ' + pick('14 of 20 folders', '20 个文件夹完成 14 个'),
              t.bProgress,
              'prog',
            ),
          ],
        },
        {
          label: pick('Delivered this week · 2', '本周已交付 · 2'),
          items: [
            task(
              pick('Translate the term sheet into Chinese', '把条款清单译成中文'),
              'T-119 · ' + pick('Tuesday', '周二'),
              t.bDelivered,
              'done',
            ),
          ],
        },
      ],
      steps: [
        [pick('Received', '已接收'), pick('23 Sep', '9 月 23 日'), 'done'],
        [pick('In progress', '处理中'), pick('Sam Ortiz', 'Sam Ortiz'), 'done'],
        [pick('Awaiting your approval', '等你审批'), pick('Since 10:12', '10:12 起'), 'cur'],
        [pick('Delivered', '已交付'), '', 'todo'],
      ].map(([label, meta, s]) => ({
        label,
        meta,
        bar: s === 'done' ? 'var(--text-primary)' : s === 'cur' ? 'var(--brand-mark)' : 'var(--bg-well)',
        w: s === 'todo' ? 400 : 500,
        fg: s === 'todo' ? 'var(--text-secondary)' : 'var(--text-primary)',
      })),
      activity,
      activityShort: activity.slice(0, 2),
      props: [
        [t.kStatus, t.bAwaiting, 500],
        [t.kHandled, 'Sam Ortiz · COSX', 400],
        [t.kWaiting, t.vYou, 500],
        [t.kRequested, pick('23 Sep 2026', '2026 年 9 月 23 日'), 400],
        [t.kDue, pick('30 Sep 2026', '2026 年 9 月 30 日'), 400],
        [t.kProject, pick('Kowloon Bay Fund II', '九龙湾基金 II'), 400],
        [t.kFrom, t.vConv, 400],
      ].map(([k, v, w]) => ({ k, v, w })),
      idleActions: [
        ['plus', pick('New', '新建'), 'N'],
        ['upload', pick('Upload', '上传'), 'U'],
        ['square-check', pick('Select', '选择'), 'S'],
      ].map(([icon, label, key]) => ({ icon, label, key })),
      selActions: [
        ['share-2', pick('Share', '分享'), 'S'],
        ['folder-input', pick('Move', '移动'), 'M'],
        ['trash-2', pick('Delete', '删除'), '⌫'],
        ['x', pick('Cancel', '取消'), 'Esc'],
      ].map(([icon, label, key]) => ({ icon, label, key, fg: icon === 'trash-2' ? '#FF8A84' : 'var(--linen)' })),
      viewerMore: [
        ['presentation', pick('Present', '演示'), 'P'],
        ['languages', pick('Translate', '翻译'), 'T'],
        ['printer', pick('Print', '打印'), '⌘P'],
        ['history', pick('Version history', '版本历史'), ''],
        ['info', pick('Document details', '文档详情'), 'I'],
        ['flag', pick('Report a problem', '报告问题'), ''],
      ].map(([icon, label, key], i) => ({
        icon,
        label,
        key,
        bg: i === 0 ? 'var(--hover)' : 'transparent',
        sep: i === 5 ? '1px solid var(--rule-soft)' : 'none',
      })),
      docTabs: [pick('All', '全部'), pick('Shared with me', '分享给我'), pick('My uploads', '我上传的'), pick('Signed', '已签署')],
      docTabValue: pick('All', '全部'),
      docGroups: [
        {
          name: t.projHarbour,
          meta: pick('Data room · 18 documents', '数据室 · 18 个文档'),
          cards: [
            this.sel(this.card('page', 'Shareholder agreement 股东协议 v3', 'PDF', pick('Signed · 2 h ago', '已签署 · 2 小时前'))),
            this.star(
              this.card(
                'page',
                pick('Investor factsheet Q3', '第三季度投资人简介'),
                'PDF',
                pick('From Sam Ortiz · yesterday', 'Sam Ortiz 分享 · 昨天'),
              ),
            ),
            this.sel(this.card('icon', 'Cap table.xlsx', 'Excel', pick('4 comments · Tuesday', '4 条评论 · 周二'), 'file-spreadsheet', '')),
            this.card(
              'proc',
              pick('2025 bank statements', '2025 年银行流水'),
              'PDF',
              pick('Uploaded by you · just now', '你上传 · 刚刚'),
              'loader',
              pick('Checking for viruses', '正在安全检查'),
            ),
            this.card(
              'lock',
              pick('Financial model', '财务模型'),
              '—',
              pick('Opens after you sign the NDA', '签署保密协议后开放'),
              'lock',
              pick('Locked', '未开放'),
            ),
          ],
        },
        {
          name: pick('Kowloon Bay Fund II', '九龙湾基金 II'),
          meta: pick('Shared with me · 8 documents', '分享给我 · 8 个文档'),
          cards: [
            this.star(this.card('page', pick('Engagement letter', '委托协议'), 'PDF', pick('Awaiting your signature', '等待你签署'))),
            this.card('page', pick('Fund overview 基金概览', 'Fund overview 基金概览'), 'PDF', '12 Sep'),
            this.card('icon', 'Re: Subscription documents.eml', pick('Email', '邮件'), pick('3 attachments', '3 个附件'), 'mail', ''),
            this.card('page', pick('Subscription agreement', '认购协议'), 'Word', '8 Sep'),
            this.card('page', pick('KYC checklist', '客户尽调清单'), 'PDF', '2 Sep'),
          ],
        },
      ],
      phoneDocTabs: [pick('All', '全部'), pick('Shared with me', '分享给我'), pick('My uploads', '我上传的'), pick('Signed', '已签署')].map(
        (label, i) => ({
          label,
          bg: i === 0 ? 'var(--brand-field)' : 'var(--bg-sunk)',
          fg: i === 0 ? 'var(--ink)' : 'var(--text-primary)',
        }),
      ),
      phoneDocs: [
        ['file-text', 'Shareholder agreement 股东协议 v3', pick('Harbour Series A · Signed · 2 h ago', 'Harbour A 轮 · 已签署 · 2 小时前')],
        ['file-text', pick('Investor factsheet Q3', '第三季度投资人简介'), pick('Harbour Series A · yesterday', 'Harbour A 轮 · 昨天')],
        ['file-spreadsheet', 'Cap table.xlsx', pick('Harbour Series A · 4 comments', 'Harbour A 轮 · 4 条评论')],
        ['loader', pick('2025 bank statements', '2025 年银行流水'), pick('Checking for viruses', '正在安全检查')],
        ['lock', pick('Financial model', '财务模型'), pick('Opens after you sign the NDA', '签署保密协议后开放')],
        ['file-text', pick('Engagement letter', '委托协议'), pick('Kowloon Bay Fund II · awaiting signature', '九龙湾基金 II · 等待签署')],
      ].map(([icon, title, meta]) => ({ icon, title, meta })),
      viewerVariants: [
        {
          id: '4a',
          name: pick('Floating action bar', '浮动操作栏'),
          note: pick('Confirmed', '已确定'),
          floating: true,
          inPage: false,
          pillBottom: '80px',
          pillDisplay: 'none',
        },
      ],
      railIcons: [
        ['message-circle', 0],
        ['square-check', 0],
        ['file-text', 1],
        ['users', 0],
        ['newspaper', 0],
      ].map(([icon, on]) => ({ icon, bg: on ? 'var(--brand-field)' : 'transparent', fg: on ? 'var(--ink)' : 'var(--text-primary)' })),
      pageLines: [
        96, 100, 92, 98, 60, 0, 100, 94, 97, 88, 100, 40, 0, 99, 95, 100, 91, 70, 0, 100, 93, 97, 85, 100, 55, 0, 98, 94, 100, 62,
      ].map((w) => ({ w: w ? w + '%' : '0', mt: w ? '0' : '8px' })),
      pageLinesShort: [96, 100, 92, 98, 60, 0, 100, 94, 97, 88, 100, 40, 0, 99, 95, 100, 91, 70, 0, 100, 93, 97].map((w) => ({
        w: w ? w + '%' : '0',
        mt: w ? '0' : '6px',
      })),
      wm: Array.from({ length: 14 }, () => ({})),
      viewerActions: [
        ['message-square', pick('Comment mode', '评论模式'), '', 1],
        ['crosshair', pick('Click the page to pin', '点击页面放置评论钉'), '', 0],
        ['eye', pick('Show resolved', '显示已解决'), 'R', 0],
        ['check', pick('Done', '完成'), 'Esc', 0],
      ].map(([icon, label, key, on]) => ({
        icon,
        label,
        key,
        bg: on ? 'var(--brand-mark)' : 'transparent',
        fg: on ? 'var(--ink)' : 'var(--linen)',
        keyFg: on ? 'rgba(17,17,17,.6)' : 'var(--grey-inverse)',
      })),
      threads: [
        {
          n: '1',
          meta: pick('You · p. 3 · 2 replies', '你 · 第 3 页 · 2 条回复'),
          text: t.pinText,
          pinBg: 'var(--brand-mark)',
          pinFg: 'var(--ink)',
          bg: 'var(--row-wash)',
          op: 1,
        },
        {
          n: '2',
          meta: pick('You · p. 3', '你 · 第 3 页'),
          text: pick('Please confirm the drag-along threshold is 75%.', '请确认领售门槛是 75%。'),
          pinBg: 'var(--ink)',
          pinFg: 'var(--linen)',
          bg: 'transparent',
          op: 1,
        },
        {
          n: '3',
          meta: pick('You · p. 3 · resolved', '你 · 第 3 页 · 已解决'),
          text: pick('Typo in 7.4 fixed in v3.', '7.4 的笔误已在第 3 版修正。'),
          pinBg: 'var(--sunk-3)',
          pinFg: '#696969',
          bg: 'transparent',
          op: 0.6,
        },
      ],
      projSeg: [t.projHarbour, pick('Kowloon Bay Fund II', '九龙湾基金 II'), pick('All projects', '全部项目')].map((label, i) => ({
        label,
        bg: i === 0 ? 'var(--brand-field)' : 'transparent',
        fg: i === 0 ? 'var(--ink)' : 'var(--text-primary)',
      })),
      funnel: [
        [pick('Invited', '已邀请'), pick('Invited', '邀请'), 24, '+6'],
        [pick('NDA signed', '已签保密协议'), pick('NDA', '保密'), 15, '+1'],
        [pick('Opened data room', '打开数据室'), pick('Opened', '已打开'), 11, '+3'],
        [t.stDD, pick('DD', '尽调'), 6, '+1'],
        [pick('Term sheet', '条款清单'), pick('Terms', '条款'), 2, ''],
      ].map(([label, short, n, delta], i) => ({
        label,
        short,
        n: String(n),
        delta: delta || '',
        h: Math.round((n / 24) * 100) + '%',
        bar: i === 1 ? 'var(--brand-mark)' : 'var(--text-primary)',
      })),
      followUps: [
        {
          n: '4',
          label: pick('Stuck at the NDA', '卡在保密协议'),
          meta: pick('Invited more than 5 days ago, not signed', '邀请超过 5 天仍未签署'),
          action: pick('Ask us to chase · T-128 open', '请我们催 · T-128 进行中'),
        },
        {
          n: '2',
          label: pick('Gone quiet', '沉寂'),
          meta: pick('No data room activity for 14 days', '14 天没有数据室动态'),
          action: pick('Ask us to check in', '请我们问候'),
        },
        {
          n: '1',
          label: pick('Very active today', '今天很活跃'),
          meta: pick('Anna Kowalski · 38 min on the financial model', 'Anna Kowalski · 财务模型 38 分钟'),
          action: pick('Suggest a call', '建议约通话'),
        },
      ],
      contacts: this.contacts(pick),
      contactsShort: this.contacts(pick).slice(0, 4),
      annaStats: [
        ['14', pick('Opens', '打开次数')],
        ['1 h 52', pick('Time in room', '停留时长')],
        ['9', pick('Files viewed', '查看文件')],
      ].map(([v, k]) => ({ v, k })),
      annaFiles: [
        [pick('Financial model.xlsx', '财务模型.xlsx'), '52 min', 100, 1],
        [pick('Investor factsheet Q3', '第三季度投资人简介'), '24 min', 46, 0],
        ['Shareholder agreement v3', '18 min', 35, 0],
        ['Cap table.xlsx', '9 min', 17, 0],
      ].map(([name, time, w, hot]) => ({ name, time, w: w + '%', bar: hot ? 'var(--brand-mark)' : 'var(--text-primary)' })),
      annaHistory: [
        [pick('Moved to Due diligence by you', '你推进到“尽职调查”'), pick('20 Sep', '9 月 20 日')],
        [pick('Opened the data room', '打开数据室'), pick('16 Sep', '9 月 16 日')],
        [pick('Signed the NDA', '签署保密协议'), pick('15 Sep', '9 月 15 日')],
        [pick('Accepted the invitation', '接受邀请'), pick('15 Sep', '9 月 15 日')],
      ].map(([text, when]) => ({ text, when })),
      contentGroups: [
        {
          label: pick('Waiting for me · 1', '等我处理 · 1'),
          items: [{ title: t.d1, meta: pick('Article · v3 · Sam Ortiz', '文章 · 第 3 版 · Sam Ortiz'), on: 1 }],
        },
        {
          label: pick('Drafts · 2', '草稿 · 2'),
          items: [
            { title: pick('Team page', '团队页面'), meta: pick('Page · edited by you · Tuesday', '页面 · 你编辑 · 周二') },
            { title: pick('Fund II launch note', '二期基金发布说明'), meta: pick('Article · Agent drafting', '文章 · Agent 起草中') },
          ],
        },
        {
          label: pick('Published · 6', '已发布 · 6'),
          items: [
            {
              title: pick('Q2 2026 investor update', '2026 年第二季度投资人简报'),
              meta: pick('2,340 views · sent to 1,251', '2,340 次浏览 · 已发 1,251 人'),
            },
            { title: pick('Our approach to deployment', '我们的投资节奏'), meta: pick('Page · 812 views', '页面 · 812 次浏览') },
          ],
        },
      ].map((g) => ({
        label: g.label,
        items: g.items.map((i) => ({
          ...i,
          bg: i.on ? 'var(--brand-field)' : 'transparent',
          fg: i.on ? 'var(--ink)' : 'var(--text-primary)',
          metaFg: i.on ? 'rgba(17,17,17,.7)' : 'var(--text-secondary)',
        })),
      })),
      changes: [
        [pick('Text edits', '文字修改'), '3'],
        [pick('Figures updated', '更新数字'), '1'],
        [pick('Images replaced', '替换图片'), '1'],
        [pick('Open comments', '未解决评论'), '1'],
      ].map(([k, v]) => ({ k, v })),
      versions: [
        { ...sam, text: pick('Sam Ortiz edited v3', 'Sam Ortiz 修改第 3 版'), when: '10:12' },
        { ...sam, text: pick('Sam Ortiz edited v2', 'Sam Ortiz 修改第 2 版'), when: pick('Yesterday', '昨天') },
        { ...agent, text: pick('Agent drafted v1', 'Agent 起草第 1 版'), when: pick('Yesterday', '昨天') },
      ],
      propsShort: [
        [t.kHandled, 'Sam Ortiz'],
        [t.kWaiting, t.vYou],
        [t.kDue, pick('30 Sep', '9 月 30 日')],
      ].map(([k, v]) => ({ k, v })),
    };
  }
}

export const pageCss =
  'html, body { margin: 0; background: var(--sunk-2); -webkit-font-smoothing: antialiased; }\n    a { color: var(--text-primary); text-underline-offset: 3px; }\n    a:hover { color: var(--text-secondary); }';

export default function MetaroomCustomerPortal(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="MetaroomCustomerPortal" precedence="page">
        {pageCss}
      </style>
      <div
        lang={v.htmlLang}
        className={v.modeClass}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '96px',
          padding: '72px',
          width: 'max-content',
          fontFamily: 'var(--font-sans-cjk)',
          fontSize: '14px',
          color: 'var(--text-primary)',
          background: 'var(--bg-well)',
          '--brand-field': v.brandField,
          '--brand-mark': v.brandMark,
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
        <div id="home" data-screen-label="01 Home" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '720px' }}>{show(v.t?.s1Note)}</span>
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
                <PortalRail active="agent" lang={v.lang} brand={v.brand} />
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
                    padding: '0 24px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{show(v.brandName)}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>/</span>
                  <span>{show(v.t?.navAgent)}</span>
                  <div style={{ flex: '1' }} />
                  <span
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      width: '36px',
                      height: '36px',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DS.Icon name="bell" size={18} />
                    <span
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '7px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '999px',
                        background: 'var(--brand-mark)',
                      }}
                    />
                  </span>
                </div>{' '}
                <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
                  {' '}
                  <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {' '}
                    <div
                      style={{
                        flex: '1',
                        width: '100%',
                        maxWidth: '760px',
                        padding: '32px 40px 0',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        gap: '20px',
                        overflow: 'hidden',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span style={{ flex: '1', height: '1px', background: 'var(--rule-soft)' }} />
                        {show(v.t?.today)}
                        <span style={{ flex: '1', height: '1px', background: 'var(--rule-soft)' }} />
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '14px' }}>
                        {' '}
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
                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {' '}
                          <span style={{ fontSize: '15px', lineHeight: '1.7' }}>{show(v.t?.agentSummary)}</span>{' '}
                          {list(v.awaiting).map((k$, $i) => {
                            const s1 = { ...v, k: k$, $index: $i };
                            return (
                              <Fragment key={$i}>
                                {' '}
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    padding: '14px 16px',
                                    borderRadius: '16px',
                                    border: '1px solid var(--rule)',
                                    background: 'var(--bg-page)',
                                  }}
                                >
                                  <span
                                    style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '10px',
                                      background: 'var(--bg-sunk)',
                                      display: 'grid',
                                      placeItems: 'center',
                                      flex: 'none',
                                    }}
                                  >
                                    <DS.Icon name={s1.k?.icon} size={16} />
                                  </span>
                                  <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(s1.k?.title)}</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s1.k?.meta)}</span>
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
                                    {show(s1.t?.bAwaiting)}
                                  </span>
                                  <DS.Button size="sm" ground={s1.ground}>
                                    {show(s1.k?.action)}
                                  </DS.Button>
                                </div>{' '}
                              </Fragment>
                            );
                          })}{' '}
                        </div>{' '}
                      </div>{' '}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span
                          style={{
                            maxWidth: '460px',
                            padding: '12px 16px',
                            borderRadius: '16px 16px 4px 16px',
                            background: 'var(--bg-sunk)',
                            fontSize: '15px',
                            lineHeight: '1.6',
                          }}
                        >
                          {show(v.t?.userMsg)}
                        </span>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '14px' }}>
                        {' '}
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
                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {' '}
                          <span style={{ fontSize: '15px', lineHeight: '1.7' }}>{show(v.t?.agentReply)}</span>{' '}
                          <div
                            style={{
                              borderRadius: '16px',
                              border: '1px solid var(--rule)',
                              background: 'var(--bg-page)',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            {' '}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 16px',
                                borderBottom: '1px solid var(--rule-soft)',
                              }}
                            >
                              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.nda4)}</span>
                              <span style={{ fontSize: '12px', fontWeight: '500', textDecoration: 'underline' }}>
                                {show(v.t?.openClients)}
                              </span>
                            </div>{' '}
                            {list(v.ndaPeople).map((p$, $i) => {
                              const s2 = { ...v, p: p$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px' }}>
                                    <span
                                      style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '999px',
                                        background: 'var(--bg-well)',
                                        display: 'grid',
                                        placeItems: 'center',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        flex: 'none',
                                      }}
                                    >
                                      {show(s2.p?.ini)}
                                    </span>
                                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{show(s2.p?.name)}</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s2.p?.org)}</span>
                                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                      {show(s2.p?.meta)}
                                    </span>
                                  </div>
                                </Fragment>
                              );
                            })}{' '}
                          </div>{' '}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '14px 16px',
                              borderRadius: '16px',
                              background: 'var(--brand-field)',
                              color: 'var(--ink)',
                            }}
                          >
                            <span
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'var(--paper)',
                                display: 'grid',
                                placeItems: 'center',
                                flex: 'none',
                              }}
                            >
                              <DS.Icon name="square-check" size={16} />
                            </span>
                            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(17,17,17,.7)' }}>
                                {show(v.t?.taskCreated)}
                              </span>
                              <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(v.t?.t128)}</span>
                              <span style={{ fontSize: '12px', color: 'rgba(17,17,17,.7)' }}>{show(v.t?.t128Meta)}</span>
                            </div>
                            <DS.Button size="sm" ground="yellow">
                              {show(v.t?.openTask)}
                            </DS.Button>
                          </div>{' '}
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '760px',
                        padding: '16px 40px 28px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {list(v.suggestions).map((s$, $i) => {
                          const s3 = { ...v, s: s$, $index: $i };
                          return (
                            <Fragment key={$i}>
                              <span
                                style={{
                                  height: '32px',
                                  padding: '0 12px',
                                  borderRadius: '8px',
                                  boxShadow: 'inset 0 0 0 1px var(--rule)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  fontSize: '13px',
                                }}
                              >
                                {show(s3.s?.label)}
                              </span>
                            </Fragment>
                          );
                        })}
                      </div>{' '}
                      <div
                        style={{
                          borderRadius: '16px',
                          background: 'var(--bg-sunk)',
                          padding: '14px 14px 10px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                        }}
                      >
                        {' '}
                        <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>{show(v.t?.composer)}</span>{' '}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <DS.IconButton name="paperclip" label="Attach" variant="ghost" size={32} />
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '30px',
                              padding: '0 10px',
                              borderRadius: '8px',
                              background: 'var(--bg-page)',
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            <DS.Icon name="square-check" size={13} />
                            {show(v.t?.asTask)}
                          </span>
                          <div style={{ flex: '1' }} />
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>⌘Enter</span>
                          <DS.IconButton name="arrow-up" label="Send" variant="solid" size={32} />
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      width: '320px',
                      flex: 'none',
                      borderLeft: '1px solid var(--rule)',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '24px 20px',
                      gap: '18px',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '16px', fontWeight: '500' }}>{show(v.t?.navTasks)}</span>
                      <DS.Button variant="secondary" size="sm" ground={v.ground}>
                        {show(v.t?.newTask)}
                      </DS.Button>
                    </div>{' '}
                    {list(v.taskGroups).map((g$, $i) => {
                      const s4 = { ...v, g: g$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {' '}
                            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', paddingBottom: '4px' }}>
                              {show(s4.g?.label)}
                            </span>{' '}
                            {list(s4.g?.items).map((i$, $i) => {
                              const s5 = { ...s4, i: i$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  {' '}
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '6px',
                                      padding: '12px',
                                      borderRadius: '12px',
                                      background: s5.i?.bg,
                                    }}
                                  >
                                    {' '}
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '13.5px', fontWeight: '500', lineHeight: '1.45', flex: '1' }}>
                                        {show(s5.i?.title)}
                                      </span>
                                    </div>{' '}
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
                                          whiteSpace: 'nowrap',
                                          padding: s5.i?.bPad,
                                          borderRadius: '6px',
                                          background: s5.i?.bBg,
                                          color: s5.i?.bFg,
                                          boxShadow: s5.i?.bRing,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                        }}
                                      >
                                        <span
                                          style={{
                                            width: '7px',
                                            height: '7px',
                                            borderRadius: '999px',
                                            background: 'var(--text-primary)',
                                            display: s5.i?.bDot,
                                          }}
                                        />
                                        {show(s5.i?.status)}
                                      </span>
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {show(s5.i?.meta)}
                                      </span>
                                    </div>{' '}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', height: '52px', flex: 'none' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    background: 'var(--brand-field)',
                    color: 'var(--ink)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: v.logoDisplay }} />
                  <span style={{ display: v.initialDisplay }}>{show(v.brandInitial)}</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '500' }}>{show(v.brandName)}</span>
                <div style={{ flex: '1' }} />
                <span style={{ position: 'relative', width: '44px', height: '44px', display: 'grid', placeItems: 'center' }}>
                  <DS.Icon name="bell" size={20} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '11px',
                      width: '7px',
                      height: '7px',
                      borderRadius: '999px',
                      background: 'var(--brand-mark)',
                    }}
                  />
                </span>
              </div>{' '}
              <div style={{ display: 'flex', gap: '8px', padding: '4px 16px 12px', overflow: 'hidden', flex: 'none' }}>
                <span
                  style={{
                    flex: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '36px',
                    padding: '0 12px',
                    borderRadius: '10px',
                    background: 'var(--brand-field)',
                    color: 'var(--ink)',
                    fontSize: '13px',
                    fontWeight: '500',
                  }}
                >
                  {show(v.t?.phAwaiting)}
                </span>
                <span
                  style={{
                    flex: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '36px',
                    padding: '0 12px',
                    borderRadius: '10px',
                    background: 'var(--bg-sunk)',
                    fontSize: '13px',
                    fontWeight: '500',
                  }}
                >
                  {show(v.t?.phProgress)}
                </span>
              </div>{' '}
              <div style={{ flex: '1', padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '18px', overflow: 'hidden' }}>
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '15px', lineHeight: '1.7' }}>{show(v.t?.agentSummaryShort)}</span>{' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: '1px solid var(--rule)',
                    }}
                  >
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(v.t?.a1)}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.a1Meta)}</span>
                    </div>
                    <DS.Button size="sm" ground={v.ground} {...v.sx?.b0}>
                      {show(v.t?.sign)}
                    </DS.Button>
                  </div>
                </div>{' '}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span
                    style={{
                      maxWidth: '280px',
                      padding: '12px 14px',
                      borderRadius: '16px 16px 4px 16px',
                      background: 'var(--bg-sunk)',
                      fontSize: '15px',
                      lineHeight: '1.6',
                    }}
                  >
                    {show(v.t?.userMsg)}
                  </span>
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '15px', lineHeight: '1.7' }}>{show(v.t?.agentReplyShort)}</span>{' '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      background: 'var(--brand-field)',
                      color: 'var(--ink)',
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(17,17,17,.7)' }}>{show(v.t?.taskCreated)}</span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(v.t?.t128)}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(17,17,17,.7)' }}>{show(v.t?.t128Meta)}</span>
                  </div>
                </div>{' '}
              </div>{' '}
              <div style={{ padding: '8px 12px 10px', flex: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    minHeight: '48px',
                    padding: '4px 4px 4px 14px',
                    borderRadius: '14px',
                    background: 'var(--bg-sunk)',
                    boxSizing: 'border-box',
                  }}
                >
                  <span style={{ flex: '1', fontSize: '15px', color: 'var(--text-secondary)' }}>{show(v.t?.composerShort)}</span>
                  <DS.IconButton name="arrow-up" label="Send" variant="solid" size={40} />
                </div>
              </div>{' '}
              <div className="sc-host">
                <PortalTabs active="agent" lang={v.lang} />
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div id="task" data-screen-label="02 Task detail" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '720px' }}>{show(v.t?.s2Note)}</span>
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
                <PortalRail active="tasks" lang={v.lang} brand={v.brand} />
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
                    padding: '0 24px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{show(v.brandName)}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>/</span>
                  <span>{show(v.t?.navTasks)}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>/</span>
                  <span style={{ fontWeight: '500' }}>T-124</span>
                  <div style={{ flex: '1' }} />
                  <DS.Icon name="bell" size={18} />
                </div>{' '}
                <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
                  {' '}
                  <div
                    style={{
                      flex: '1',
                      minWidth: '0',
                      padding: '36px 56px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '28px',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '760px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        {'T-124 · '}
                        {show(v.t?.kindContent)}
                      </span>
                      <span style={{ fontSize: '26px', fontWeight: '500', lineHeight: '1.3' }}>{show(v.t?.t124)}</span>
                    </div>{' '}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '6px', maxWidth: '760px' }}>
                      {' '}
                      {list(v.steps).map((st$, $i) => {
                        const s6 = { ...v, st: st$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ height: '4px', borderRadius: '999px', background: s6.st?.bar }} />
                              <span style={{ fontSize: '12px', fontWeight: s6.st?.w, color: s6.st?.fg }}>{show(s6.st?.label)}</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{show(s6.st?.meta)}</span>
                            </div>
                          </Fragment>
                        );
                      })}{' '}
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        background: 'var(--brand-field)',
                        color: 'var(--ink)',
                        maxWidth: '760px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '500' }}>{show(v.t?.waitingYou)}</span>
                        <span style={{ fontSize: '13px', color: 'rgba(17,17,17,.7)' }}>{show(v.t?.waitingYouBody)}</span>
                      </div>
                      <DS.Button ground="yellow">{show(v.t?.reviewDraft)}</DS.Button>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '760px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.request)}</span>
                      <span style={{ fontSize: '15px', lineHeight: '1.7' }}>{show(v.t?.requestBody)}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.requestMeta)}</span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '760px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.deliverables)}</span>{' '}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {' '}
                        <div
                          style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '16px', border: '1px solid var(--rule)' }}
                        >
                          <span
                            style={{
                              width: '40px',
                              height: '48px',
                              borderRadius: '6px',
                              background: 'var(--bg-sunk)',
                              flex: 'none',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="newspaper" size={16} />
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: '500' }}>{show(v.t?.d1)}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.d1Meta)}</span>
                            <span
                              style={{
                                alignSelf: 'flex-start',
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '4px 7px',
                                borderRadius: '6px',
                                background: 'var(--brand-mark)',
                                color: 'var(--ink)',
                              }}
                            >
                              {show(v.t?.bAwaiting)}
                            </span>
                          </div>
                        </div>{' '}
                        <div
                          style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '16px', border: '1px solid var(--rule)' }}
                        >
                          <span
                            style={{
                              width: '40px',
                              height: '48px',
                              borderRadius: '6px',
                              background: 'var(--bg-sunk)',
                              flex: 'none',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <DS.Icon name="mail" size={16} />
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: '500' }}>{show(v.t?.d2)}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.d2Meta)}</span>
                            <span
                              style={{
                                alignSelf: 'flex-start',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              <span style={{ width: '7px', height: '7px', borderRadius: '999px', background: 'var(--grey)' }} />
                              {show(v.t?.bDraft)}
                            </span>
                          </div>
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '760px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.activity)}</span>{' '}
                      {list(v.activity).map((a$, $i) => {
                        const s7 = { ...v, a: a$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <span
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '999px',
                                  background: s7.a?.avBg,
                                  color: s7.a?.avFg,
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                  flex: 'none',
                                }}
                              >
                                {show(s7.a?.ini)}
                              </span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '13px' }}>
                                  <span style={{ fontWeight: '500' }}>{show(s7.a?.who)}</span>{' '}
                                  <span style={{ color: 'var(--text-secondary)' }}>
                                    {'· '}
                                    {show(s7.a?.when)}
                                  </span>
                                </span>
                                <span style={{ fontSize: '14px', lineHeight: '1.6' }}>{show(s7.a?.text)}</span>
                              </div>
                            </div>
                          </Fragment>
                        );
                      })}{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      width: '320px',
                      flex: 'none',
                      borderLeft: '1px solid var(--rule)',
                      padding: '32px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {' '}
                    {list(v.props).map((p$, $i) => {
                      const s8 = { ...v, p: p$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '96px minmax(0, 1fr)',
                              gap: '12px',
                              alignItems: 'center',
                              minHeight: '40px',
                              borderBottom: '1px solid var(--rule-soft)',
                            }}
                          >
                            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(s8.p?.k)}</span>
                            <span style={{ fontSize: '13px', fontWeight: s8.p?.w }}>{show(s8.p?.v)}</span>
                          </div>
                        </Fragment>
                      );
                    })}{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '20px' }}>
                      <div className="sc-host-x" style={{ width: '100%' }}>
                        <DS.Button variant="secondary" ground={v.ground} {...v.sx?.b1}>
                          {show(v.t?.askAgent)}
                        </DS.Button>
                      </div>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.t?.sideNote)}</span>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px', height: '52px', flex: 'none' }}>
                <DS.IconButton name="chevron-left" label="Back" variant="ghost" size={44} />
                <span style={{ fontSize: '15px', fontWeight: '500' }}>T-124</span>
                <div style={{ flex: '1' }} />
                <DS.IconButton name="more-horizontal" label="More" variant="ghost" size={44} />
              </div>{' '}
              <div style={{ flex: '1', padding: '8px 20px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
                {' '}
                <span style={{ fontSize: '21px', fontWeight: '500', lineHeight: '1.35' }}>{show(v.t?.t124)}</span>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                  {list(v.steps).map((st$, $i) => {
                    const s9 = { ...v, st: st$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div style={{ height: '4px', borderRadius: '999px', background: s9.st?.bar }} />
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
                    background: 'var(--brand-field)',
                    color: 'var(--ink)',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>{show(v.t?.waitingYou)}</span>
                  <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(17,17,17,.7)' }}>{show(v.t?.waitingYouBody)}</span>
                  <div className="sc-host-x" style={{ width: '100%' }}>
                    <DS.Button ground="yellow" size="lg" {...v.sx?.b1}>
                      {show(v.t?.reviewDraft)}
                    </DS.Button>
                  </div>
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {list(v.propsShort).map((p$, $i) => {
                    const s10 = { ...v, p: p$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            minHeight: '40px',
                            alignItems: 'center',
                            borderBottom: '1px solid var(--rule-soft)',
                            fontSize: '14px',
                          }}
                        >
                          <span style={{ color: 'var(--text-secondary)' }}>{show(s10.p?.k)}</span>
                          <span style={{ fontWeight: '500' }}>{show(s10.p?.v)}</span>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.activity)}</span>
                  {list(v.activityShort).map((a$, $i) => {
                    const s11 = { ...v, a: a$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <span
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '999px',
                              background: s11.a?.avBg,
                              color: s11.a?.avFg,
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '10px',
                              fontWeight: '600',
                              flex: 'none',
                            }}
                          >
                            {show(s11.a?.ini)}
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>
                              {show(s11.a?.who)}{' '}
                              <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>
                                {'· '}
                                {show(s11.a?.when)}
                              </span>
                            </span>
                            <span style={{ fontSize: '14px', lineHeight: '1.55' }}>{show(s11.a?.text)}</span>
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>{' '}
              </div>{' '}
              <div style={{ padding: '8px 12px 30px', flex: 'none', borderTop: '1px solid var(--rule)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    minHeight: '48px',
                    padding: '4px 4px 4px 14px',
                    borderRadius: '14px',
                    background: 'var(--bg-sunk)',
                    boxSizing: 'border-box',
                  }}
                >
                  <span style={{ flex: '1', fontSize: '15px', color: 'var(--text-secondary)' }}>{show(v.t?.comment)}</span>
                  <DS.IconButton name="arrow-up" label="Send" variant="solid" size={40} />
                </div>
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div id="docs" data-screen-label="03 Documents" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '720px' }}>{show(v.t?.s3Note)}</span>
          </div>{' '}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.idleLabel)}</span>
            <div
              style={{
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
              <span style={{ width: '14px', height: '34px', display: 'grid', placeItems: 'center', color: 'var(--grey-inverse)' }}>
                <DS.Icon name="grip-vertical" size={14} />
              </span>
              {list(v.idleActions).map((a$, $i) => {
                const s12 = { ...v, a: a$, $index: $i };
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
                      <DS.Icon name={s12.a?.icon} size={15} />
                      {show(s12.a?.label)}
                      <span style={{ fontSize: '11px', color: 'var(--grey-inverse)' }}>{show(s12.a?.key)}</span>
                    </span>
                  </Fragment>
                );
              })}
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.idleHint)}</span>
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
              <div
                style={{
                  position: 'absolute',
                  zIndex: '3',
                  left: 'calc(312px + (100% - 312px) / 2)',
                  bottom: '24px',
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
                <span style={{ width: '14px', height: '34px', display: 'grid', placeItems: 'center', color: 'var(--grey-inverse)' }}>
                  <DS.Icon name="grip-vertical" size={14} />
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: '34px',
                    padding: '0 10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--brand-mark)',
                  }}
                >
                  {show(v.t?.nSelected)}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: '34px',
                    padding: '0 10px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--grey-inverse)',
                    textDecoration: 'underline',
                  }}
                >
                  {show(v.t?.selectAll)}
                </span>
                <span style={{ width: '1px', height: '20px', background: 'var(--rule-inverse)', margin: '0 4px' }} />
                {list(v.selActions).map((a$, $i) => {
                  const s13 = { ...v, a: a$, $index: $i };
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
                          color: s13.a?.fg,
                        }}
                      >
                        <DS.Icon name={s13.a?.icon} size={15} />
                        {show(s13.a?.label)}
                        <span style={{ fontSize: '11px', color: 'var(--grey-inverse)' }}>{show(s13.a?.key)}</span>
                      </span>
                    </Fragment>
                  );
                })}
              </div>{' '}
              <div className="sc-host">
                <PortalRail active="docs" lang={v.lang} brand={v.brand} />
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
                    padding: '0 24px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{show(v.brandName)}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>/</span>
                  <span>{show(v.t?.navDocs)}</span>
                  <div style={{ flex: '1' }} />
                  <DS.Icon name="bell" size={18} />
                </div>{' '}
                <div style={{ flex: '1', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '26px', fontWeight: '500' }}>{show(v.t?.navDocs)}</span>
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      background: 'var(--brand-field)',
                      color: 'var(--ink)',
                    }}
                  >
                    <DS.Icon name="inbox" size={18} />
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(v.t?.sharesWaiting)}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(17,17,17,.7)' }}>{show(v.t?.sharesWaitingMeta)}</span>
                    </div>
                    <DS.Button ground="yellow" size="sm">
                      {show(v.t?.review)}
                    </DS.Button>
                  </div>{' '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {' '}
                    <div
                      style={{
                        width: '320px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        height: '36px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        background: 'var(--bg-sunk)',
                        color: 'var(--text-secondary)',
                        fontSize: '13px',
                      }}
                    >
                      <DS.Icon name="search" size={15} />
                      {show(v.t?.searchDocs)}
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
                      {show(v.t?.allProjects)}
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
                        boxShadow: 'inset 0 0 0 1px var(--rule)',
                        fontSize: '13px',
                        fontWeight: '500',
                      }}
                    >
                      {show(v.t?.lastUpdated)}
                      <DS.Icon name="chevron-down" size={14} />
                    </span>{' '}
                    <div style={{ flex: '1' }} />{' '}
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.docStats)}</span>{' '}
                    <div style={{ display: 'inline-flex', gap: '2px', padding: '3px', borderRadius: '10px', background: 'var(--bg-sunk)' }}>
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
                        <DS.Icon name="layout-grid" size={14} />
                      </span>
                      <span style={{ width: '30px', height: '30px', display: 'grid', placeItems: 'center', borderRadius: '8px' }}>
                        <DS.Icon name="list" size={14} />
                      </span>
                    </div>{' '}
                  </div>{' '}
                  {list(v.docGroups).map((g$, $i) => {
                    const s14 = { ...v, g: g$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {' '}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(s14.g?.name)}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s14.g?.meta)}</span>
                          </div>{' '}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '14px' }}>
                            {' '}
                            {list(s14.g?.cards).map((c$, $i) => {
                              const s15 = { ...s14, c: c$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  {' '}
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      borderRadius: '16px',
                                      border: s15.c?.border,
                                      background: 'var(--bg-page)',
                                      overflow: 'hidden',
                                      boxShadow: s15.c?.selRing,
                                    }}
                                  >
                                    {' '}
                                    <div
                                      style={{
                                        height: '128px',
                                        background: s15.c?.thumbBg,
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        color: s15.c?.thumbFg,
                                      }}
                                    >
                                      <span
                                        style={{
                                          position: 'absolute',
                                          left: '10px',
                                          top: '10px',
                                          zIndex: '1',
                                          width: '20px',
                                          height: '20px',
                                          borderRadius: '4px',
                                          background: s15.c?.cbBg,
                                          boxShadow: s15.c?.cbRing,
                                          color: s15.c?.cbFg,
                                          display: s15.c?.cbDisplay,
                                          placeItems: 'center',
                                        }}
                                      >
                                        <DS.Icon name="check" size={13} />
                                      </span>
                                      <span
                                        style={{
                                          position: 'absolute',
                                          right: '10px',
                                          top: '10px',
                                          zIndex: '1',
                                          width: '26px',
                                          height: '26px',
                                          borderRadius: '999px',
                                          background: 'var(--brand-mark)',
                                          color: 'var(--ink)',
                                          display: s15.c?.starDisplay,
                                          placeItems: 'center',
                                        }}
                                      >
                                        <DS.Icon name="star" size={14} />
                                      </span>{' '}
                                      <div
                                        style={{
                                          width: '58%',
                                          height: '104px',
                                          background: 'var(--paper)',
                                          borderRadius: '4px 4px 0 0',
                                          boxShadow: '0 0 0 1px var(--rule-soft)',
                                          display: s15.c?.pageDisplay,
                                          flexDirection: 'column',
                                          gap: '5px',
                                          padding: '12px',
                                          boxSizing: 'border-box',
                                        }}
                                      >
                                        <div style={{ height: '5px', width: '60%', background: '#D9D6D0', borderRadius: '2px' }} />
                                        <div style={{ height: '3px', background: '#E8E5DF', borderRadius: '2px' }} />
                                        <div style={{ height: '3px', background: '#E8E5DF', borderRadius: '2px' }} />
                                        <div style={{ height: '3px', width: '70%', background: '#E8E5DF', borderRadius: '2px' }} />
                                      </div>{' '}
                                      <div
                                        style={{
                                          position: 'absolute',
                                          inset: '0',
                                          display: s15.c?.iconDisplay,
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: '6px',
                                        }}
                                      >
                                        <DS.Icon name={s15.c?.icon} size={22} />
                                        <span style={{ fontSize: '12px', fontWeight: '500' }}>{show(s15.c?.thumbText)}</span>
                                      </div>{' '}
                                    </div>{' '}
                                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      {' '}
                                      <span
                                        style={{
                                          fontSize: '13px',
                                          fontWeight: '500',
                                          lineHeight: '1.4',
                                          display: '-webkit-box',
                                          WebkitLineClamp: '2',
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          minHeight: '36px',
                                        }}
                                      >
                                        {show(s15.c?.title)}
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
                                            padding: '2px 5px',
                                            borderRadius: '4px',
                                            background: 'var(--bg-sunk)',
                                            color: 'var(--text-primary)',
                                          }}
                                        >
                                          {show(s15.c?.fmt)}
                                        </span>
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                          {show(s15.c?.meta)}
                                        </span>
                                      </div>{' '}
                                    </div>{' '}
                                  </div>{' '}
                                </Fragment>
                              );
                            })}{' '}
                          </div>{' '}
                        </div>{' '}
                      </Fragment>
                    );
                  })}{' '}
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
                <span style={{ fontSize: '24px', fontWeight: '500', flex: '1' }}>{show(v.t?.navDocs)}</span>
                <DS.IconButton name="upload" label="Upload" variant="ghost" size={44} />
              </div>{' '}
              <div style={{ padding: '4px 16px 12px', flex: 'none' }}>
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
                    fontSize: '15px',
                  }}
                >
                  <DS.Icon name="search" size={16} />
                  {show(v.t?.searchDocs)}
                </div>
              </div>{' '}
              <div style={{ display: 'flex', gap: '6px', padding: '0 16px 12px', flex: 'none', overflow: 'hidden' }}>
                {list(v.phoneDocTabs).map((p$, $i) => {
                  const s16 = { ...v, p: p$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <span
                        style={{
                          flex: 'none',
                          height: '36px',
                          padding: '0 12px',
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: '500',
                          background: s16.p?.bg,
                          color: s16.p?.fg,
                        }}
                      >
                        {show(s16.p?.label)}
                      </span>
                    </Fragment>
                  );
                })}
              </div>{' '}
              <div
                style={{
                  margin: '0 16px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: 'var(--brand-field)',
                  color: 'var(--ink)',
                  flex: 'none',
                }}
              >
                <span style={{ flex: '1', fontSize: '14px', fontWeight: '500' }}>{show(v.t?.sharesWaiting)}</span>
                <DS.Icon name="chevron-right" size={16} />
              </div>{' '}
              <div style={{ flex: '1', padding: '0 16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {' '}
                {list(v.phoneDocs).map((r$, $i) => {
                  const s17 = { ...v, r: r$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          minHeight: '62px',
                          borderBottom: '1px solid var(--rule-soft)',
                        }}
                      >
                        <span
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            background: 'var(--bg-sunk)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <DS.Icon name={s17.r?.icon} size={16} />
                        </span>
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {show(s17.r?.title)}
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
                            {show(s17.r?.meta)}
                          </span>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}{' '}
              </div>{' '}
              <div className="sc-host">
                <PortalTabs active="docs" lang={v.lang} />
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div id="viewer" data-screen-label="04 Viewer" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              04
            </span>
            <span style={{ fontSize: '22px', fontWeight: '500', whiteSpace: 'nowrap' }}>{show(v.t?.s4Title)}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '760px' }}>{show(v.t?.s4Note)}</span>
          </div>{' '}
          <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
            {' '}
            {list(v.viewerVariants).map((V$, $i) => {
              const s18 = { ...v, V: V$, $index: $i };
              return (
                <Fragment key={$i}>
                  {' '}
                  <div id={s18.V?.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 'none' }}>
                    {' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                        {show(s18.V?.id)}
                      </span>
                      <span style={{ fontSize: '16px', fontWeight: '500' }}>{show(s18.V?.name)}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{show(s18.V?.note)}</span>
                    </div>{' '}
                    <div
                      style={{
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
                      <div
                        style={{
                          width: '64px',
                          flex: 'none',
                          background: 'var(--bg-sunk)',
                          borderRight: '1px solid var(--rule)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '16px 0',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '7px',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                            marginBottom: '14px',
                          }}
                        >
                          <img src="../assets/logo-icon.svg" alt="" style={{ width: '78%', height: '78%', display: s18.logoDisplay }} />
                          <span style={{ display: s18.initialDisplay }}>{show(s18.brandInitial)}</span>
                        </div>
                        {list(s18.railIcons).map((r$, $i) => {
                          const s19 = { ...s18, r: r$, $index: $i };
                          return (
                            <Fragment key={$i}>
                              <span
                                style={{
                                  width: '40px',
                                  height: '38px',
                                  borderRadius: '8px',
                                  display: 'grid',
                                  placeItems: 'center',
                                  background: s19.r?.bg,
                                  color: s19.r?.fg,
                                }}
                              >
                                <DS.Icon name={s19.r?.icon} size={17} />
                              </span>
                            </Fragment>
                          );
                        })}
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
                            padding: '0 16px 0 20px',
                            fontSize: '13px',
                          }}
                        >
                          {' '}
                          <span style={{ fontWeight: '500' }}>{show(s18.brandName)}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>/</span>
                          <span>{show(s18.t?.navDocs)}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>/</span>
                          <span>{show(s18.t?.projHarbour)}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>/</span>
                          <span style={{ fontWeight: '500' }}>Shareholder agreement 股东协议 v3</span>{' '}
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
                            {show(s18.t?.signed)}
                          </span>{' '}
                          <div style={{ flex: '1' }} />{' '}
                          {s18.V?.inPage ? (
                            <>
                              {' '}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {' '}
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    height: '34px',
                                    padding: '0 12px',
                                    borderRadius: '8px',
                                    background: 'var(--brand-field)',
                                    color: 'var(--ink)',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                  }}
                                >
                                  <DS.Icon name="message-square" size={15} />
                                  {show(s18.t?.comment2)}
                                  <span style={{ fontSize: '11px', fontWeight: '500' }}>C</span>
                                </span>{' '}
                                <DS.Button variant="secondary" size="sm" ground={s18.ground}>
                                  <DS.Icon name="download" size={14} />
                                  {show(s18.t?.download)}
                                </DS.Button>{' '}
                                <DS.Button size="sm" ground={s18.ground}>
                                  <DS.Icon name="share-2" size={14} />
                                  {show(s18.t?.share)}
                                </DS.Button>{' '}
                                <DS.IconButton name="more-horizontal" label="More" size={34} />{' '}
                              </div>{' '}
                            </>
                          ) : null}{' '}
                          {s18.V?.floating ? (
                            <>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '12px',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                <DS.Icon name="star" size={15} />
                              </span>
                            </>
                          ) : null}{' '}
                        </div>{' '}
                        {s18.V?.inPage ? (
                          <>
                            <div
                              style={{
                                position: 'absolute',
                                zIndex: '3',
                                right: '16px',
                                top: '52px',
                                width: '240px',
                                background: 'var(--bg-page)',
                                border: '1px solid var(--rule)',
                                borderRadius: '12px',
                                padding: '6px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1px',
                              }}
                            >
                              {list(s18.viewerMore).map((m$, $i) => {
                                const s20 = { ...s18, m: m$, $index: $i };
                                return (
                                  <Fragment key={$i}>
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        height: '34px',
                                        padding: '0 8px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        background: s20.m?.bg,
                                        borderTop: s20.m?.sep,
                                      }}
                                    >
                                      <DS.Icon name={s20.m?.icon} size={15} />
                                      {show(s20.m?.label)}
                                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                        {show(s20.m?.key)}
                                      </span>
                                    </div>
                                  </Fragment>
                                );
                              })}
                            </div>
                          </>
                        ) : null}{' '}
                        <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
                          {' '}
                          <div
                            style={{
                              flex: '1',
                              background: 'var(--bg-well)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              paddingTop: '24px',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            {' '}
                            <div
                              style={{
                                width: '640px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                                paddingBottom: '8px',
                              }}
                            >
                              <span>{show(s18.t?.pageOf)}</span>
                              <span>A4 · 2.4 MB</span>
                            </div>{' '}
                            <div
                              style={{
                                width: '640px',
                                height: '905px',
                                background: 'var(--paper)',
                                boxShadow: '0 0 0 1px var(--rule-soft)',
                                position: 'relative',
                                padding: '64px 72px',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                color: '#111',
                              }}
                            >
                              {' '}
                              <span style={{ fontSize: '16px', fontWeight: '500' }}>7. Transfer of shares</span>{' '}
                              {list(s18.pageLines).map((l$, $i) => {
                                const s21 = { ...s18, l: l$, $index: $i };
                                return (
                                  <Fragment key={$i}>
                                    <div
                                      style={{
                                        height: '7px',
                                        borderRadius: '3px',
                                        background: '#E3E0DA',
                                        width: s21.l?.w,
                                        marginTop: s21.l?.mt,
                                      }}
                                    />
                                  </Fragment>
                                );
                              })}{' '}
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: '0',
                                  overflow: 'hidden',
                                  pointerEvents: 'none',
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  alignContent: 'flex-start',
                                  gap: '90px 60px',
                                  padding: '40px',
                                  transform: 'rotate(-24deg) scale(1.3)',
                                  opacity: '.07',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#111',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {list(s18.wm).map((w$, $i) => {
                                  const s22 = { ...s18, w: w$, $index: $i };
                                  return (
                                    <Fragment key={$i}>
                                      <span>CONFIDENTIAL · Li Wei · 24 Sep 2026</span>
                                    </Fragment>
                                  );
                                })}
                              </div>{' '}
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '380px',
                                  top: '212px',
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '999px 999px 999px 4px',
                                  background: 'var(--brand-mark)',
                                  color: 'var(--ink)',
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  boxShadow: '0 0 0 2px var(--paper)',
                                }}
                              >
                                1
                              </span>{' '}
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '180px',
                                  top: '420px',
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '999px 999px 999px 4px',
                                  background: 'var(--ink)',
                                  color: 'var(--linen)',
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  boxShadow: '0 0 0 2px var(--paper)',
                                }}
                              >
                                2
                              </span>{' '}
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '470px',
                                  top: '560px',
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '999px 999px 999px 4px',
                                  background: 'var(--sunk-3)',
                                  color: '#696969',
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  boxShadow: '0 0 0 2px var(--paper)',
                                }}
                              >
                                3
                              </span>{' '}
                              <div
                                style={{
                                  position: 'absolute',
                                  left: '412px',
                                  top: '200px',
                                  width: '280px',
                                  background: 'var(--bg-page)',
                                  color: 'var(--text-primary)',
                                  border: '1px solid var(--rule)',
                                  borderRadius: '16px',
                                  padding: '14px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '10px',
                                }}
                              >
                                {' '}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <span
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '999px',
                                      background: 'var(--bg-chrome)',
                                      display: 'grid',
                                      placeItems: 'center',
                                      fontSize: '9px',
                                      fontWeight: '600',
                                      flex: 'none',
                                    }}
                                  >
                                    LW
                                  </span>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '500' }}>
                                      {show(s18.t?.you)} <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>· 09:40</span>
                                    </span>
                                    <span style={{ fontSize: '13px', lineHeight: '1.5' }}>{show(s18.t?.pinText)}</span>
                                  </div>
                                </div>{' '}
                                <div style={{ display: 'flex', gap: '8px' }}>
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
                                    SO
                                  </span>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '500' }}>
                                      {'Sam Ortiz '}
                                      <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>· 10:05</span>
                                    </span>
                                    <span style={{ fontSize: '13px', lineHeight: '1.5' }}>{show(s18.t?.pinReply)}</span>
                                  </div>
                                </div>{' '}
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    height: '34px',
                                    padding: '0 4px 0 10px',
                                    borderRadius: '8px',
                                    background: 'var(--bg-sunk)',
                                    fontSize: '13px',
                                    color: 'var(--text-secondary)',
                                  }}
                                >
                                  <span style={{ flex: '1' }}>{show(s18.t?.reply)}</span>
                                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', padding: '0 8px' }}>
                                    {show(s18.t?.resolve)}
                                  </span>
                                </div>{' '}
                              </div>{' '}
                            </div>{' '}
                            <div
                              style={{
                                position: 'absolute',
                                left: '50%',
                                bottom: s18.V?.pillBottom,
                                transform: 'translateX(-50%)',
                                display: s18.V?.pillDisplay,
                                alignItems: 'center',
                                gap: '10px',
                                height: '40px',
                                padding: '0 6px 0 14px',
                                borderRadius: '999px',
                                background: 'var(--brand-field)',
                                color: 'var(--ink)',
                                fontSize: '13px',
                                fontWeight: '500',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <DS.Icon name="crosshair" size={15} />
                              {show(s18.t?.commentMode)}
                              <span style={{ fontSize: '12px', color: 'rgba(17,17,17,.7)' }}>{show(s18.t?.showResolved)}</span>
                              <span
                                style={{
                                  height: '30px',
                                  padding: '0 12px',
                                  borderRadius: '999px',
                                  background: 'var(--ink)',
                                  color: 'var(--linen)',
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                }}
                              >
                                {show(s18.t?.done)}
                              </span>
                            </div>{' '}
                            {s18.V?.floating ? (
                              <>
                                {' '}
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: '50%',
                                    bottom: '24px',
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
                                  <span
                                    style={{
                                      width: '14px',
                                      height: '32px',
                                      display: 'grid',
                                      placeItems: 'center',
                                      color: 'var(--grey-inverse)',
                                    }}
                                  >
                                    <DS.Icon name="grip-vertical" size={14} />
                                  </span>{' '}
                                  {list(s18.viewerActions).map((a$, $i) => {
                                    const s23 = { ...s18, a: a$, $index: $i };
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
                                            background: s23.a?.bg,
                                            color: s23.a?.fg,
                                          }}
                                        >
                                          <DS.Icon name={s23.a?.icon} size={15} />
                                          {show(s23.a?.label)}
                                          <span style={{ fontSize: '11px', color: s23.a?.keyFg }}>{show(s23.a?.key)}</span>
                                        </span>
                                      </Fragment>
                                    );
                                  })}{' '}
                                </div>{' '}
                              </>
                            ) : null}{' '}
                            <div
                              style={{
                                position: 'absolute',
                                right: '20px',
                                bottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                height: '40px',
                                padding: '0 4px',
                                borderRadius: '999px',
                                background: 'var(--bg-page)',
                                boxShadow: '0 0 0 1px var(--rule)',
                                fontSize: '13px',
                                fontWeight: '500',
                              }}
                            >
                              <span style={{ width: '32px', height: '32px', display: 'grid', placeItems: 'center' }}>
                                <DS.Icon name="minus" size={14} />
                              </span>
                              <span style={{ minWidth: '48px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>100%</span>
                              <span style={{ width: '32px', height: '32px', display: 'grid', placeItems: 'center' }}>
                                <DS.Icon name="plus" size={14} />
                              </span>
                              <span style={{ width: '1px', height: '18px', background: 'var(--rule)' }} />
                              <span style={{ padding: '0 10px', fontSize: '12px' }}>{show(s18.t?.fitPage)}</span>
                            </div>{' '}
                          </div>{' '}
                          <div
                            style={{
                              width: '340px',
                              flex: 'none',
                              borderLeft: '1px solid var(--rule)',
                              display: 'flex',
                              flexDirection: 'column',
                              background: 'var(--bg-page)',
                            }}
                          >
                            {' '}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 16px 12px' }}>
                              <span style={{ fontSize: '15px', fontWeight: '500', flex: '1' }}>{show(s18.t?.comments)}</span>
                              <div
                                style={{
                                  display: 'inline-flex',
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
                                    whiteSpace: 'nowrap',
                                    borderRadius: '8px',
                                    background: 'var(--brand-field)',
                                    color: 'var(--ink)',
                                  }}
                                >
                                  {show(s18.t?.open)}
                                  {' · 2'}
                                </span>
                                <span
                                  style={{
                                    height: '26px',
                                    padding: '0 10px',
                                    display: 'grid',
                                    placeItems: 'center',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {show(s18.t?.resolved)}
                                  {' · 1'}
                                </span>
                              </div>
                            </div>{' '}
                            {list(s18.threads).map((th$, $i) => {
                              const s24 = { ...s18, th: th$, $index: $i };
                              return (
                                <Fragment key={$i}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      gap: '10px',
                                      padding: '14px 16px',
                                      borderTop: '1px solid var(--rule-soft)',
                                      background: s24.th?.bg,
                                      opacity: s24.th?.op,
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '22px',
                                        height: '22px',
                                        borderRadius: '999px 999px 999px 4px',
                                        background: s24.th?.pinBg,
                                        color: s24.th?.pinFg,
                                        display: 'grid',
                                        placeItems: 'center',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        flex: 'none',
                                      }}
                                    >
                                      {show(s24.th?.n)}
                                    </span>
                                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s24.th?.meta)}</span>
                                      <span style={{ fontSize: '13px', lineHeight: '1.5' }}>{show(s24.th?.text)}</span>
                                      <span style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>
                                        {show(s24.t?.jump)}
                                      </span>
                                    </div>
                                  </div>
                                </Fragment>
                              );
                            })}{' '}
                            <div style={{ flex: '1' }} />{' '}
                            <div
                              style={{
                                padding: '14px 16px',
                                fontSize: '12px',
                                lineHeight: '1.6',
                                color: 'var(--text-secondary)',
                                borderTop: '1px solid var(--rule-soft)',
                              }}
                            >
                              {show(s18.t?.ownThreads)}
                            </div>{' '}
                          </div>{' '}
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                </Fragment>
              );
            })}{' '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 'none' }}>
              {' '}
              <span style={{ fontSize: '16px', fontWeight: '500', lineHeight: '26px' }}>{show(v.t?.phoneViewer)}</span>{' '}
              <div
                style={{
                  width: '390px',
                  height: '844px',
                  borderRadius: '40px',
                  overflow: 'hidden',
                  background: 'var(--bg-sunk)',
                  boxShadow: '0 0 0 1px var(--rule), 0 0 0 8px var(--bg-chrome)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {' '}
                <div style={{ height: '47px', flex: 'none', background: 'var(--bg-page)' }} />{' '}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0 8px',
                    height: '52px',
                    flex: 'none',
                    background: 'var(--bg-page)',
                    borderBottom: '1px solid var(--rule)',
                  }}
                >
                  <DS.IconButton name="chevron-left" label="Back" variant="ghost" size={44} />
                  <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '1.25' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {show(v.t?.projHarbour)}
                      {' · PDF · '}
                      {show(v.t?.signed)}
                    </span>
                    <span
                      style={{ fontSize: '15px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      Shareholder agreement 股东协议 v3
                    </span>
                  </div>
                  <DS.IconButton name="share-2" label="Share" variant="ghost" size={44} />
                </div>{' '}
                <div style={{ flex: '1', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden' }}>
                  {' '}
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{show(v.t?.pageOf)}</span>{' '}
                  <div
                    style={{
                      height: '500px',
                      background: 'var(--paper)',
                      boxShadow: '0 0 0 1px var(--rule-soft)',
                      padding: '32px 28px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      position: 'relative',
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#111' }}>7. Transfer of shares</span>
                    {list(v.pageLinesShort).map((l$, $i) => {
                      const s25 = { ...v, l: l$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <div
                            style={{ height: '5px', borderRadius: '3px', background: '#E3E0DA', width: s25.l?.w, marginTop: s25.l?.mt }}
                          />
                        </Fragment>
                      );
                    })}
                    <span
                      style={{
                        position: 'absolute',
                        left: '200px',
                        top: '110px',
                        width: '26px',
                        height: '26px',
                        borderRadius: '999px 999px 999px 4px',
                        background: 'var(--brand-mark)',
                        color: 'var(--ink)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      1
                    </span>
                  </div>{' '}
                </div>{' '}
                <div
                  style={{
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    background: 'var(--bg-page)',
                    borderRadius: '20px 20px 0 0',
                    boxShadow: '0 0 0 1px var(--rule)',
                    padding: '8px 16px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {' '}
                  <div
                    style={{ width: '36px', height: '4px', borderRadius: '999px', background: 'var(--rule)', alignSelf: 'center' }}
                  />{' '}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '15px', fontWeight: '500', whiteSpace: 'nowrap' }}>
                      {show(v.t?.comments)}
                      {' · 2'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.swipe)}</span>
                  </div>{' '}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '999px 999px 999px 4px',
                        background: 'var(--brand-mark)',
                        color: 'var(--ink)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '10px',
                        fontWeight: '600',
                        flex: 'none',
                      }}
                    >
                      1
                    </span>
                    <span style={{ fontSize: '14px', lineHeight: '1.5' }}>{show(v.t?.pinText)}</span>
                  </div>{' '}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <DS.Button variant="secondary" ground={v.ground} {...v.sx?.b2}>
                      {show(v.t?.download)}
                    </DS.Button>
                    <DS.Button ground={v.ground} {...v.sx?.b2}>
                      {show(v.t?.addComment)}
                    </DS.Button>
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div id="clients" data-screen-label="05 My clients" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              05
            </span>
            <span style={{ fontSize: '22px', fontWeight: '500', whiteSpace: 'nowrap' }}>{show(v.t?.s5Title)}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '760px' }}>{show(v.t?.s5Note)}</span>
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
                <PortalRail active="clients" lang={v.lang} brand={v.brand} />
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
                    padding: '0 24px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{show(v.brandName)}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>/</span>
                  <span>{show(v.t?.navClients)}</span>
                  <div style={{ flex: '1' }} />
                  <DS.Icon name="bell" size={18} />
                </div>{' '}
                <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
                  {' '}
                  <div
                    style={{
                      flex: '1',
                      minWidth: '0',
                      padding: '28px 32px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '18px',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '26px', fontWeight: '500' }}>{show(v.t?.navClients)}</span>
                      <div style={{ flex: '1' }} />
                      <DS.Button variant="secondary" size="sm" ground={v.ground}>
                        <DS.Icon name="user-plus" size={14} />
                        {show(v.t?.addProspect)}
                      </DS.Button>
                    </div>{' '}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, minmax(0, 1fr)) 150px',
                        gap: '8px',
                        alignItems: 'end',
                        padding: '18px 20px',
                        borderRadius: '16px',
                        border: '1px solid var(--rule)',
                      }}
                    >
                      {' '}
                      {list(v.funnel).map((f$, $i) => {
                        const s26 = { ...v, f: f$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            {' '}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ height: '44px', display: 'flex', alignItems: 'flex-end' }}>
                                <div style={{ width: '100%', height: s26.f?.h, borderRadius: '8px', background: s26.f?.bar }} />
                              </div>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '24px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>
                                  {show(s26.f?.n)}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s26.f?.delta)}</span>
                              </div>
                              <span style={{ fontSize: '12px', fontWeight: '500' }}>{show(s26.f?.label)}</span>
                            </div>{' '}
                          </Fragment>
                        );
                      })}{' '}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          paddingLeft: '16px',
                          borderLeft: '1px solid var(--rule-soft)',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span>{show(v.t?.declined)}</span>
                        <span>{show(v.t?.revoked)}</span>
                      </div>{' '}
                    </div>{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '16px',
                        borderRadius: '16px',
                        background: 'var(--brand-field)',
                        color: 'var(--ink)',
                      }}
                    >
                      {' '}
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(v.t?.followUp)}</span>{' '}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
                        {' '}
                        {list(v.followUps).map((f$, $i) => {
                          const s27 = { ...v, f: f$, $index: $i };
                          return (
                            <Fragment key={$i}>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '6px',
                                  padding: '12px 14px',
                                  borderRadius: '12px',
                                  background: 'var(--paper)',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                  <span style={{ fontSize: '20px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>
                                    {show(s27.f?.n)}
                                  </span>
                                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{show(s27.f?.label)}</span>
                                </div>
                                <span style={{ fontSize: '12px', color: 'rgba(17,17,17,.7)' }}>{show(s27.f?.meta)}</span>
                                <span style={{ fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>
                                  {show(s27.f?.action)}
                                </span>
                              </div>
                            </Fragment>
                          );
                        })}{' '}
                      </div>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {' '}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0, 1.4fr) 130px 120px 130px minmax(0, 1fr)',
                          gap: '12px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'var(--text-secondary)',
                          borderBottom: '1px solid var(--rule)',
                        }}
                      >
                        <span>{show(v.t?.cContact)}</span>
                        <span>{show(v.t?.cStage)}</span>
                        <span>{show(v.t?.cLast)}</span>
                        <span>{show(v.t?.cEng)}</span>
                        <span>{show(v.t?.cNext)}</span>
                      </div>{' '}
                      {list(v.contacts).map((c$, $i) => {
                        const s28 = { ...v, c: c$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            {' '}
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'minmax(0, 1.4fr) 130px 120px 130px minmax(0, 1fr)',
                                gap: '12px',
                                alignItems: 'center',
                                padding: '9px 12px',
                                borderBottom: '1px solid var(--rule-soft)',
                                fontSize: '13px',
                                background: s28.c?.bg,
                                borderRadius: s28.c?.radius,
                              }}
                            >
                              {' '}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '0' }}>
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
                                  {show(s28.c?.ini)}
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '0', lineHeight: '1.3' }}>
                                  <span style={{ fontWeight: '500' }}>{show(s28.c?.name)}</span>
                                  <span
                                    style={{
                                      fontSize: '12px',
                                      color: 'var(--text-secondary)',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {show(s28.c?.org)}
                                  </span>
                                </div>
                              </div>{' '}
                              <span
                                style={{
                                  justifySelf: 'start',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  padding: '4px 7px',
                                  borderRadius: '6px',
                                  background: 'var(--bg-sunk)',
                                }}
                              >
                                {show(s28.c?.stage)}
                              </span>{' '}
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s28.c?.last)}</span>{' '}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div
                                  style={{
                                    width: '48px',
                                    height: '4px',
                                    borderRadius: '999px',
                                    background: 'var(--bg-well)',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div style={{ height: '100%', width: s28.c?.engW, background: 'var(--text-primary)' }} />
                                </div>
                                <span style={{ fontSize: '12px', fontVariantNumeric: 'tabular-nums' }}>{show(s28.c?.eng)}</span>
                              </div>{' '}
                              <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', minWidth: '0' }}>
                                <span
                                  style={{ width: '7px', height: '7px', borderRadius: '999px', background: s28.c?.dot, flex: 'none' }}
                                />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {show(s28.c?.next)}
                                </span>
                              </span>{' '}
                            </div>{' '}
                          </Fragment>
                        );
                      })}{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      width: '380px',
                      flex: 'none',
                      borderLeft: '1px solid var(--rule)',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '18px',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '999px',
                          background: 'var(--bg-well)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        AK
                      </span>
                      <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '17px', fontWeight: '500' }}>Anna Kowalski</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Harbour Ventures · Partner</span>
                      </div>
                      <DS.IconButton name="x" label="Close" variant="ghost" size={30} />
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.cStage)}</span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          height: '38px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-sunk)',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        {show(v.t?.stDD)}
                        <DS.Icon name="chevron-down" size={14} />
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.nextGate)}</span>
                    </div>{' '}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {list(v.annaStats).map((s$, $i) => {
                        const s29 = { ...v, s: s$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                padding: '10px 12px',
                                borderRadius: '12px',
                                background: 'var(--bg-sunk)',
                              }}
                            >
                              <span style={{ fontSize: '18px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>
                                {show(s29.s?.v)}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{show(s29.s?.k)}</span>
                            </div>
                          </Fragment>
                        );
                      })}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.filesViewed)}</span>
                      {list(v.annaFiles).map((f$, $i) => {
                        const s30 = { ...v, f: f$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {show(s30.f?.name)}
                                </span>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    color: 'var(--text-secondary)',
                                    flex: 'none',
                                    paddingLeft: '8px',
                                    fontVariantNumeric: 'tabular-nums',
                                  }}
                                >
                                  {show(s30.f?.time)}
                                </span>
                              </div>
                              <div style={{ height: '4px', borderRadius: '999px', background: 'var(--bg-well)' }}>
                                <div style={{ height: '100%', width: s30.f?.w, borderRadius: '999px', background: s30.f?.bar }} />
                              </div>
                            </div>
                          </Fragment>
                        );
                      })}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.history)}</span>
                      {list(v.annaHistory).map((h$, $i) => {
                        const s31 = { ...v, h: h$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                              <span
                                style={{
                                  width: '7px',
                                  height: '7px',
                                  borderRadius: '999px',
                                  background: 'var(--text-primary)',
                                  marginTop: '7px',
                                  flex: 'none',
                                }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>{show(s31.h?.text)}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s31.h?.when)}</span>
                              </div>
                            </div>
                          </Fragment>
                        );
                      })}
                    </div>{' '}
                    <div style={{ flex: '1' }} />{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="sc-host-x" style={{ width: '100%' }}>
                        <DS.Button ground={v.ground} {...v.sx?.b1}>
                          {show(v.t?.askFollow)}
                        </DS.Button>
                      </div>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.t?.scope)}</span>
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
                <span style={{ fontSize: '24px', fontWeight: '500', flex: '1' }}>{show(v.t?.navClients)}</span>
                <DS.IconButton name="user-plus" label="Add" variant="ghost" size={44} />
              </div>{' '}
              <div style={{ padding: '0 16px 12px', flex: 'none' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    height: '36px',
                    padding: '0 12px',
                    borderRadius: '10px',
                    background: 'var(--bg-sunk)',
                    fontSize: '13px',
                    fontWeight: '500',
                  }}
                >
                  {show(v.t?.projHarbour)}
                  <DS.Icon name="chevron-down" size={14} />
                </span>
              </div>{' '}
              <div
                style={{
                  margin: '0 16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '4px',
                  padding: '12px',
                  borderRadius: '14px',
                  border: '1px solid var(--rule)',
                  flex: 'none',
                }}
              >
                {list(v.funnel).map((f$, $i) => {
                  const s32 = { ...v, f: f$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ height: '28px', display: 'flex', alignItems: 'flex-end' }}>
                          <div style={{ width: '100%', height: s32.f?.h, borderRadius: '5px', background: s32.f?.bar }} />
                        </div>
                        <span style={{ fontSize: '17px', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>{show(s32.f?.n)}</span>
                        <span style={{ fontSize: '10px', lineHeight: '1.25', color: 'var(--text-secondary)' }}>{show(s32.f?.short)}</span>
                      </div>
                    </Fragment>
                  );
                })}
              </div>{' '}
              <div
                style={{
                  margin: '12px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'var(--brand-field)',
                  color: 'var(--ink)',
                  flex: 'none',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(v.t?.followUp)}</span>
                {list(v.followUps).map((f$, $i) => {
                  const s33 = { ...v, f: f$, $index: $i };
                  return (
                    <Fragment key={$i}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '36px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '500', width: '24px', fontVariantNumeric: 'tabular-nums' }}>
                          {show(s33.f?.n)}
                        </span>
                        <span style={{ flex: '1', fontSize: '13px' }}>{show(s33.f?.label)}</span>
                        <DS.Icon name="chevron-right" size={15} />
                      </div>
                    </Fragment>
                  );
                })}
              </div>{' '}
              <div style={{ flex: '1', padding: '0 16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {' '}
                {list(v.contactsShort).map((c$, $i) => {
                  const s34 = { ...v, c: c$, $index: $i };
                  return (
                    <Fragment key={$i}>
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
                            borderRadius: '999px',
                            background: 'var(--bg-well)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '11px',
                            fontWeight: '600',
                            flex: 'none',
                          }}
                        >
                          {show(s34.c?.ini)}
                        </span>
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '15px', fontWeight: '500' }}>{show(s34.c?.name)}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {show(s34.c?.stage)}
                            {' · '}
                            {show(s34.c?.last)}
                          </span>
                        </div>
                        <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: s34.c?.dot }} />
                      </div>
                    </Fragment>
                  );
                })}{' '}
              </div>{' '}
              <div className="sc-host">
                <PortalTabs active="clients" lang={v.lang} />
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div id="content" data-screen-label="06 My content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              06
            </span>
            <span style={{ fontSize: '22px', fontWeight: '500', whiteSpace: 'nowrap' }}>{show(v.t?.s6Title)}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '760px' }}>{show(v.t?.s6Note)}</span>
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
                <PortalRail active="content" lang={v.lang} brand={v.brand} />
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
                    padding: '0 24px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{show(v.brandName)}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>/</span>
                  <span>{show(v.t?.navContent)}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>/</span>
                  <span style={{ fontWeight: '500' }}>{show(v.t?.d1)}</span>
                  <div style={{ flex: '1' }} />
                  <DS.Icon name="bell" size={18} />
                </div>{' '}
                <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
                  {' '}
                  <div
                    style={{
                      flex: '1',
                      minWidth: '0',
                      background: 'var(--bg-sunk)',
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
                        gap: '10px',
                        padding: '14px 24px',
                        borderBottom: '1px solid var(--rule)',
                        background: 'var(--bg-page)',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap' }}>{show(v.t?.v3vs2)}</span>
                      <div
                        style={{ display: 'inline-flex', gap: '2px', padding: '3px', borderRadius: '10px', background: 'var(--bg-sunk)' }}
                      >
                        <span
                          style={{
                            height: '26px',
                            padding: '0 10px',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '12px',
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            borderRadius: '8px',
                            background: 'var(--brand-field)',
                            color: 'var(--ink)',
                          }}
                        >
                          {show(v.t?.showChanges)}
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
                          {show(v.t?.clean)}
                        </span>
                      </div>
                      <div style={{ flex: '1' }} />
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          minWidth: '0',
                        }}
                      >
                        portal.halden.co/insights/q3-2026
                      </span>
                      <DS.Icon name="monitor-smartphone" size={16} />
                    </div>{' '}
                    <div style={{ flex: '1', padding: '28px', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                      {' '}
                      <div
                        style={{
                          width: '620px',
                          background: 'var(--paper)',
                          borderRadius: '12px',
                          boxShadow: '0 0 0 1px var(--rule-soft)',
                          padding: '40px 48px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                          color: '#111',
                          boxSizing: 'border-box',
                        }}
                      >
                        {' '}
                        <span style={{ fontSize: '12px', fontWeight: '500', color: '#696969' }}>{show(v.t?.artKicker)}</span>{' '}
                        <span style={{ fontSize: '28px', fontWeight: '500', lineHeight: '1.25' }}>{show(v.t?.artTitle)}</span>{' '}
                        <div
                          style={{
                            height: '180px',
                            borderRadius: '10px',
                            background: '#ECE9E3',
                            display: 'flex',
                            alignItems: 'flex-end',
                            padding: '10px',
                            boxSizing: 'border-box',
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{ fontSize: '11px', fontWeight: '600', padding: '3px 6px', borderRadius: '4px', background: '#FFF1D6' }}
                          >
                            {show(v.t?.imgReplaced)}
                          </span>
                        </div>{' '}
                        <span style={{ fontSize: '15px', lineHeight: '1.75' }}>
                          {show(v.t?.artP1a)} <span style={{ textDecoration: 'line-through', color: '#696969' }}>{show(v.t?.artOld)}</span>{' '}
                          <span style={{ background: '#FFF1D6', boxShadow: 'inset 0 -2px 0 #111' }}>{show(v.t?.artNew)}</span>{' '}
                          {show(v.t?.artP1b)}
                        </span>{' '}
                        <span style={{ fontSize: '15px', lineHeight: '1.75' }}>
                          {show(v.t?.artP2)}{' '}
                          <span style={{ background: '#FFF1D6', boxShadow: 'inset 0 -2px 0 #111' }}>{show(v.t?.artP2add)}</span>
                        </span>{' '}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '999px 999px 999px 4px',
                              background: 'var(--ink)',
                              color: 'var(--linen)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '11px',
                              fontWeight: '600',
                            }}
                          >
                            1
                          </span>
                          <span style={{ fontSize: '13px', color: '#696969', paddingTop: '4px' }}>{show(v.t?.artComment)}</span>
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div
                    style={{
                      width: '360px',
                      flex: 'none',
                      borderLeft: '1px solid var(--rule)',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '18px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span
                        style={{
                          alignSelf: 'flex-start',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          background: 'var(--brand-mark)',
                          color: 'var(--ink)',
                        }}
                      >
                        {show(v.t?.bApproval)}
                      </span>
                      <span style={{ fontSize: '18px', fontWeight: '500', lineHeight: '1.35' }}>{show(v.t?.d1)}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.d1Where)}</span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.whatChanged)}</span>
                      {list(v.changes).map((c$, $i) => {
                        const s35 = { ...v, c: c$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '13px',
                                minHeight: '30px',
                                borderBottom: '1px solid var(--rule-soft)',
                              }}
                            >
                              <span>{show(s35.c?.k)}</span>
                              <span style={{ fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>{show(s35.c?.v)}</span>
                            </div>
                          </Fragment>
                        );
                      })}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.whoChanged)}</span>
                      {list(v.versions).map((v$, $i) => {
                        const s36 = { ...v, v: v$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                              <span
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '999px',
                                  background: s36.v?.avBg,
                                  color: s36.v?.avFg,
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontSize: '9px',
                                  fontWeight: '600',
                                  flex: 'none',
                                }}
                              >
                                {show(s36.v?.ini)}
                              </span>
                              <span style={{ flex: '1' }}>{show(s36.v?.text)}</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(s36.v?.when)}</span>
                            </div>
                          </Fragment>
                        );
                      })}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="sc-host-x" style={{ width: '100%' }}>
                        <DS.Button ground={v.ground} {...v.sx?.b1}>
                          {show(v.t?.approve)}
                        </DS.Button>
                      </div>
                      <div className="sc-host-x" style={{ width: '100%' }}>
                        <DS.Button variant="secondary" ground={v.ground} {...v.sx?.b1}>
                          {show(v.t?.sendBack)}
                        </DS.Button>
                      </div>
                    </div>{' '}
                    <div style={{ flex: '1' }} />{' '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '16px',
                        borderRadius: '16px',
                        background: 'var(--bg-sunk)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DS.Icon name="mail" size={15} />
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{show(v.t?.d2)}</span>
                      </div>
                      <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.t?.emailNote)}</span>
                      <DS.Button variant="secondary" size="sm" ground={v.ground} disabled={true}>
                        {show(v.t?.sendTo)}
                      </DS.Button>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px', height: '52px', flex: 'none' }}>
                <DS.IconButton name="chevron-left" label="Back" variant="ghost" size={44} />
                <span style={{ fontSize: '15px', fontWeight: '500', flex: '1' }}>{show(v.t?.navContent)}</span>
              </div>{' '}
              <div style={{ flex: '1', padding: '4px 20px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span
                    style={{
                      alignSelf: 'flex-start',
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: 'var(--brand-mark)',
                      color: 'var(--ink)',
                    }}
                  >
                    {show(v.t?.bApproval)}
                  </span>
                  <span style={{ fontSize: '21px', fontWeight: '500', lineHeight: '1.35' }}>{show(v.t?.d1)}</span>
                </div>{' '}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'var(--bg-sunk)',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.v3vs2)}</span>
                  <span style={{ fontSize: '15px', lineHeight: '1.7' }}>
                    {show(v.t?.artP1a)}{' '}
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)' }}>{show(v.t?.artOld)}</span>{' '}
                    <span style={{ background: 'var(--yellow-light)', color: 'var(--ink)', boxShadow: 'inset 0 -2px 0 var(--ink)' }}>
                      {show(v.t?.artNew)}
                    </span>{' '}
                    {show(v.t?.artP1b)}
                  </span>
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {list(v.changes).map((c$, $i) => {
                    const s37 = { ...v, c: c$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            minHeight: '40px',
                            alignItems: 'center',
                            borderBottom: '1px solid var(--rule-soft)',
                            fontSize: '14px',
                          }}
                        >
                          <span>{show(s37.c?.k)}</span>
                          <span style={{ fontWeight: '500' }}>{show(s37.c?.v)}</span>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>{' '}
                <span style={{ fontSize: '13px', textDecoration: 'underline', fontWeight: '500' }}>{show(v.t?.seeFull)}</span>{' '}
              </div>{' '}
              <div
                style={{
                  padding: '12px 16px 30px',
                  flex: 'none',
                  borderTop: '1px solid var(--rule)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div className="sc-host-x" style={{ width: '100%' }}>
                  <DS.Button ground={v.ground} size="lg" {...v.sx?.b1}>
                    {show(v.t?.approve)}
                  </DS.Button>
                </div>
                <div className="sc-host-x" style={{ width: '100%' }}>
                  <DS.Button variant="secondary" ground={v.ground} size="lg" {...v.sx?.b1}>
                    {show(v.t?.sendBack)}
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
