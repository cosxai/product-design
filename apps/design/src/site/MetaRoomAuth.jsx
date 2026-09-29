// MetaRoomAuth — converted once from the Claude Design export (pages/MetaRoom Auth.dc.html); edit freely.
import { Fragment } from 'react';

import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';
import * as DS from '../dc/ds';

/* eslint-disable */
class Logic extends DCLogic {
  dict() {
    return {
      en: {
        docEyebrow: 'Sign in and sign up · MetaRoom default and customer domain',
        docTitle: 'Email first, then whichever method the workspace allows',
        docLede:
          'One flow for both products. The email decides what comes next: a code, a password, single sign-on or a social account. On a customer\u2019s own domain the pages carry only the customer\u2019s brand.',
        s1: 'Sign in · MetaRoom',
        s1n: 'Social accounts, email, passkey and single sign-on on one page.',
        s2: 'Accept an invitation · customer domain',
        s2n: 'portal.halden.co. The invitation fixes the email; only the methods Halden allows are shown.',
        s3: 'Steps and states',
        s3n: 'The same card on linen, used for every step after the first page.',
        s4: 'Phone',
        signInTitle: 'Sign in to MetaRoom',
        signInSub: 'Use your work email or an account you already have.',
        signInShort: 'Sign in',
        google: 'Continue with Google',
        microsoft: 'Continue with Microsoft',
        apple: 'Continue with Apple',
        or: 'or',
        email: 'Work email',
        emailPh: 'name@company.com',
        contEmail: 'Continue with email',
        passkey: 'Sign in with a passkey',
        sso: 'Single sign-on',
        newHere: 'New to MetaRoom?',
        create: 'Create an account',
        legal: 'By continuing you agree to the Terms of Service and Privacy Policy.',
        footer: 'Privacy · Terms · Status',
        panelA: 'Documents, tasks and conversations with your clients, ',
        panelB: 'in one private workspace.',
        invEyebrow: 'Invitation from Halden Capital',
        invTitle: 'Li Wei, set up your access',
        invSub: 'Sam Ortiz invited you to the Halden Capital investor portal.',
        name: 'Full name',
        nameVal: 'Li Wei',
        password: 'Password',
        show: 'Show',
        pwHint: 'At least 12 characters · strong',
        agree: 'I agree to the Halden Capital portal terms',
        accept: 'Accept and create account',
        orUse: 'or continue with',
        expires: 'This invitation expires on 8 October 2026.',
        footerHalden: 'Halden Capital · Privacy · Terms',
        waitTitle: 'Waiting for you after sign-up',
        codeTitle: 'Check your email',
        codeSub: 'We sent a 6-digit code to li.wei@halden.co. It expires in 10 minutes.',
        resend: 'Resend in 48 s',
        diffEmail: 'Use a different email',
        codeNote: 'Unregistered emails see this same screen, so the page never reveals whether an account exists.',
        twoTitle: 'Confirm it\u2019s you',
        twoSub: 'Two-step verification is on for this workspace.',
        usePasskey: 'Use passkey',
        useApp: 'Use authenticator code',
        trust: 'Trust this browser for 30 days',
        recovery: 'Use a recovery code',
        ssoTitle: 'harbour.vc uses single sign-on',
        ssoSub: 'Your organisation signs in through Okta. Passwords and social accounts are off for this domain.',
        change: 'Change',
        ssoBtn: 'Continue with Okta',
        ssoNote: 'Admins set this per email domain in workspace security settings.',
        wrongPw: 'Incorrect password. This was attempt 5.',
        lockSub: 'Sign-in with a password is paused for this email for 60 seconds.',
        tryIn: 'Try again in 58 s',
        forgot: 'Reset password instead',
        expTitle: 'This invitation has expired',
        expSub: 'Invitations last 14 days. Halden Capital can send a new one.',
        expBtn: 'Ask for a new invitation',
        haveAcc: 'Already have an account?',
        cCode: 'Email code',
        cTwo: 'Two-step verification',
        cSso: 'Single sign-on required',
        cLock: 'Too many attempts',
        cExp: 'Invitation expired',
      },
      zh: {
        docEyebrow: '登录与注册 · MetaRoom 默认与客户自有域名',
        docTitle: '先填邮箱，再用工作区允许的方式登录',
        docLede: '两个产品共用一套流程。邮箱决定下一步：验证码、密码、单点登录或社交账号。在客户自有域名下，页面只出现客户自己的品牌。',
        s1: '登录 · MetaRoom',
        s1n: '社交账号、邮箱、通行密钥、单点登录都在一页。',
        s2: '接受邀请 · 客户域名',
        s2n: 'portal.halden.co。邮箱由邀请确定，只显示 Halden 允许的登录方式。',
        s3: '后续步骤与状态',
        s3n: '第一页之后的每一步，都用亚麻底上的同一张卡片。',
        s4: '手机',
        signInTitle: '登录 MetaRoom',
        signInSub: '使用工作邮箱，或已有的账号。',
        signInShort: '登录',
        google: '使用 Google 继续',
        microsoft: '使用 Microsoft 继续',
        apple: '使用 Apple 继续',
        or: '或',
        email: '工作邮箱',
        emailPh: 'name@company.com',
        contEmail: '用邮箱继续',
        passkey: '使用通行密钥登录',
        sso: '单点登录',
        newHere: '还没有账号？',
        create: '创建账号',
        legal: '继续即表示你同意服务条款和隐私政策。',
        footer: '隐私 · 条款 · 服务状态',
        panelA: '和客户之间的文档、任务与对话，',
        panelB: '都在一个私密的工作区里。',
        invEyebrow: '来自 Halden Capital 的邀请',
        invTitle: '李维，设置你的访问',
        invSub: 'Sam Ortiz 邀请你加入 Halden Capital 投资人门户。',
        name: '姓名',
        nameVal: '李维',
        password: '密码',
        show: '显示',
        pwHint: '至少 12 个字符 · 强度高',
        agree: '我同意 Halden Capital 门户使用条款',
        accept: '接受邀请并创建账号',
        orUse: '或使用',
        expires: '此邀请于 2026 年 10 月 8 日失效。',
        footerHalden: 'Halden Capital · 隐私 · 条款',
        waitTitle: '注册后等你查看',
        codeTitle: '查看你的邮箱',
        codeSub: '我们已向 li.wei@halden.co 发送 6 位验证码，10 分钟内有效。',
        resend: '48 秒后可重新发送',
        diffEmail: '换一个邮箱',
        codeNote: '未注册的邮箱也会看到同样的页面，因此不会暴露账号是否存在。',
        twoTitle: '确认是你本人',
        twoSub: '这个工作区开启了两步验证。',
        usePasskey: '使用通行密钥',
        useApp: '使用验证器验证码',
        trust: '30 天内信任此浏览器',
        recovery: '使用恢复码',
        ssoTitle: 'harbour.vc 使用单点登录',
        ssoSub: '你的机构通过 Okta 登录。此域名已关闭密码和社交账号登录。',
        change: '更改',
        ssoBtn: '使用 Okta 继续',
        ssoNote: '管理员在工作区安全设置中按邮箱域名配置。',
        wrongPw: '密码错误。这是第 5 次尝试。',
        lockSub: '此邮箱的密码登录已暂停 60 秒。',
        tryIn: '58 秒后重试',
        forgot: '改为重置密码',
        expTitle: '此邀请已失效',
        expSub: '邀请有效期为 14 天。Halden Capital 可以重新发送。',
        expBtn: '申请新的邀请',
        haveAcc: '已有账号？',
        cCode: '邮箱验证码',
        cTwo: '两步验证',
        cSso: '需要单点登录',
        cLock: '尝试次数过多',
        cExp: '邀请已失效',
      },
    };
  }
  renderVals() {
    const zh = this.props.lang === 'zh';
    const t = this.dict()[zh ? 'zh' : 'en'];
    const p = (en, z) => (zh ? z : en);
    const dark = this.props.theme === 'dark';
    return {
      t,
      htmlLang: zh ? 'zh-CN' : 'en-GB',
      modeClass: dark ? 'ink-mode' : '',
      ground: dark ? 'ink' : 'paper',
      fullW: { style: { width: '100%', justifyContent: 'center' } },
      socials: [
        ['google', t.google],
        ['microsoft', t.microsoft],
        [dark ? 'apple-white' : 'apple', t.apple],
      ].map(([k, label]) => ({ src: '../assets/social-' + k + '.svg', label })),
      inviteSocials: [
        ['google', 'Google'],
        ['microsoft', 'Microsoft'],
      ].map(([k, short]) => ({ src: '../assets/social-' + k + '.svg', short })),
      waits: [
        ['briefcase', p('Harbour Series A data room', 'Harbour A 轮数据室'), p('18 documents', '18 个文档')],
        ['pen-line', p('Engagement letter to sign', '待签署的委托协议'), p('Kowloon Bay Fund II', '九龙湾基金 II')],
        ['inbox', p('2 shares to review', '2 个待查看的分享'), p('From Sam Ortiz', '来自 Sam Ortiz')],
      ].map(([icon, title, meta]) => ({ icon, title, meta })),
      otp: ['4', '8', '2', '', '', ''].map((v, i) => ({
        v,
        bg: i === 3 ? 'var(--bg-page)' : 'var(--bg-sunk)',
        ring: i === 3 ? 'inset 0 0 0 1.5px var(--text-primary)' : 'none',
      })),
      rules: [
        [
          p('Email first', '邮箱优先'),
          p(
            'The page asks for the email, then picks the method from the domain: single sign-on if required, otherwise a code or password. Social buttons skip this step.',
            '先问邮箱，再按域名决定方式：要求单点登录就走单点登录，否则用验证码或密码。社交账号按钮可以跳过这一步。',
          ),
        ],
        [
          p('The workspace decides', '工作区决定登录方式'),
          p(
            'Admins turn Google, Microsoft, Apple, passkey and password on or off. A customer domain shows only what is on.',
            '管理员逐项开关 Google、Microsoft、Apple、通行密钥和密码。客户域名下只显示已开启的方式。',
          ),
        ],
        [
          p('Nothing leaks', '不泄露账号信息'),
          p(
            'Unknown emails get the same “check your email” screen. Errors never say whether an account exists.',
            '未注册的邮箱同样显示“查看你的邮箱”。任何错误提示都不说明账号是否存在。',
          ),
        ],
        [
          p('Limits', '限制'),
          p(
            'Five failed attempts pause that email for 60 seconds. Codes last 10 minutes; reset links last 30 minutes and work once.',
            '连续失败 5 次后，此邮箱暂停 60 秒。验证码 10 分钟有效；重置链接 30 分钟有效且只能用一次。',
          ),
        ],
        [
          p('Brand', '品牌'),
          p(
            'On a customer domain: the customer tile, name and field colour, and no MetaRoom text. Legal links go to the customer\u2019s terms.',
            '客户域名下使用客户的品牌方块、名称和品牌色，不出现 MetaRoom 字样。法律链接指向客户自己的条款。',
          ),
        ],
        [
          p('Provider buttons', '第三方按钮'),
          p(
            'Official marks at 18px, full colour, on a neutral secondary button. Labels follow each provider\u2019s wording: Continue with Google, Sign in with Microsoft, Continue with Apple. Apple\u2019s mark switches to light on dark.',
            '官方标志 18px，保持原色，放在中性的次按钮上。文字按各家规范书写。深色主题下 Apple 标志换成浅色。',
          ),
        ],
      ].map(([k, v]) => ({ k, v })),
    };
  }
}

export const pageCss =
  'html, body { margin: 0; background: var(--sunk-2); -webkit-font-smoothing: antialiased; }\n    a { color: var(--text-primary); text-underline-offset: 3px; }\n    a:hover { color: var(--text-secondary); }';

export default function MetaRoomAuth(props) {
  const v = useLogic(Logic, props);
  return (
    <>
      <style href="MetaRoomAuth" precedence="page">
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
        }}
      >
        {' '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '900px' }}>
          {' '}
          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.docEyebrow)}</span>{' '}
          <h1 style={{ margin: '0', fontSize: '40px', fontWeight: '500', lineHeight: '1.25' }}>{show(v.t?.docTitle)}</h1>{' '}
          <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>{show(v.t?.docLede)}</p>{' '}
        </div>{' '}
        <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
          {' '}
          <div id="signin" data-screen-label="01 Sign in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              <span style={{ fontSize: '22px', fontWeight: '500', whiteSpace: 'nowrap' }}>{show(v.t?.s1)}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{show(v.t?.s1n)}</span>
            </div>{' '}
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
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '40px 56px', boxSizing: 'border-box' }}>
                {' '}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
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
                    }}
                  >
                    <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>MetaRoom</span>
                </div>{' '}
                <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {' '}
                  <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.25' }}>{show(v.t?.signInTitle)}</h2>
                      <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.t?.signInSub)}</span>
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {' '}
                      {list(v.socials).map((s$, $i) => {
                        const s1 = { ...v, s: s$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <div className="sc-host-x" style={{ width: '100%' }}>
                              <DS.Button variant="secondary" size="lg" ground={s1.ground} {...s1.fullW}>
                                <img
                                  src={s1.s?.src}
                                  alt=""
                                  style={{ width: '18px', height: '18px', display: 'block', objectFit: 'contain' }}
                                />
                                {show(s1.s?.label)}
                              </DS.Button>
                            </div>
                          </Fragment>
                        );
                      })}{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                      {show(v.t?.or)}
                      <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                    </div>{' '}
                    <DS.Input label={v.t?.email} placeholder={v.t?.emailPh} type="email" />{' '}
                    <div className="sc-host-x" style={{ width: '100%' }}>
                      <DS.Button size="lg" ground={v.ground} {...v.fullW}>
                        {show(v.t?.contEmail)}
                      </DS.Button>
                    </div>{' '}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '500' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <DS.Icon name="fingerprint" size={15} />
                        {show(v.t?.passkey)}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <DS.Icon name="building-2" size={15} />
                        {show(v.t?.sso)}
                      </span>
                    </div>{' '}
                    <div style={{ height: '1px', background: 'var(--rule-soft)' }} />{' '}
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {show(v.t?.newHere)}{' '}
                      <span style={{ color: 'var(--text-primary)', fontWeight: '500', textDecoration: 'underline' }}>
                        {show(v.t?.create)}
                      </span>
                    </span>{' '}
                    <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.t?.legal)}</span>{' '}
                  </div>{' '}
                </div>{' '}
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.footer)}</span>{' '}
              </div>{' '}
              <div style={{ width: '640px', flex: 'none', padding: '24px', boxSizing: 'border-box' }}>
                {' '}
                <div
                  style={{
                    height: '100%',
                    borderRadius: '24px',
                    background: 'var(--yellow)',
                    color: 'var(--ink)',
                    padding: '56px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    gap: '16px',
                  }}
                >
                  {' '}
                  <span style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(17,17,17,.7)' }}>MetaRoom</span>{' '}
                  <span style={{ fontSize: '38px', fontWeight: '500', lineHeight: '1.25' }}>
                    {show(v.t?.panelA)}
                    <span style={{ boxShadow: 'inset 0 -3px 0 var(--ink)' }}>{show(v.t?.panelB)}</span>
                  </span>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          <div id="invite" data-screen-label="02 Invitation" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              <span style={{ fontSize: '22px', fontWeight: '500', whiteSpace: 'nowrap' }}>{show(v.t?.s2)}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{show(v.t?.s2n)}</span>
            </div>{' '}
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
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '40px 56px', boxSizing: 'border-box' }}>
                {' '}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#D6E4DA',
                      color: 'var(--ink)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    H
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>Halden Capital</span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>portal.halden.co</span>
                </div>{' '}
                <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {' '}
                  <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.invEyebrow)}</span>
                      <h2 style={{ margin: '0', fontSize: '30px', fontWeight: '500', lineHeight: '1.25' }}>{show(v.t?.invTitle)}</h2>
                      <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.t?.invSub)}</span>
                    </div>{' '}
                    <DS.Input label={v.t?.email} defaultValue="li.wei@halden.co" readOnly={true} />{' '}
                    <DS.Input label={v.t?.name} defaultValue={v.t?.nameVal} />{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {' '}
                      <DS.Input label={v.t?.password} type="password" defaultValue="harbour-quarterly-2026" suffix={v.t?.show} />{' '}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                        <span style={{ height: '4px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                        <span style={{ height: '4px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                        <span style={{ height: '4px', borderRadius: '999px', background: 'var(--text-primary)' }} />
                        <span style={{ height: '4px', borderRadius: '999px', background: 'var(--bg-well)' }} />
                      </div>{' '}
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.pwHint)}</span>{' '}
                    </div>{' '}
                    <DS.Checkbox checked={true} label={v.t?.agree} />{' '}
                    <div className="sc-host-x" style={{ width: '100%' }}>
                      <DS.Button size="lg" ground={v.ground} {...v.fullW}>
                        {show(v.t?.accept)}
                      </DS.Button>
                    </div>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                      {show(v.t?.orUse)}
                      <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                    </div>{' '}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {list(v.inviteSocials).map((s$, $i) => {
                        const s2 = { ...v, s: s$, $index: $i };
                        return (
                          <Fragment key={$i}>
                            <div className="sc-host-x" style={{ width: '100%' }}>
                              <DS.Button variant="secondary" ground={s2.ground} {...s2.fullW}>
                                <img
                                  src={s2.s?.src}
                                  alt=""
                                  style={{ width: '16px', height: '16px', display: 'block', objectFit: 'contain' }}
                                />
                                {show(s2.s?.short)}
                              </DS.Button>
                            </div>
                          </Fragment>
                        );
                      })}
                    </div>{' '}
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.expires)}</span>{' '}
                  </div>{' '}
                </div>{' '}
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{show(v.t?.footerHalden)}</span>{' '}
              </div>{' '}
              <div style={{ width: '640px', flex: 'none', padding: '24px', boxSizing: 'border-box' }}>
                {' '}
                <div
                  style={{
                    height: '100%',
                    borderRadius: '24px',
                    background: '#D6E4DA',
                    color: 'var(--ink)',
                    padding: '56px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    gap: '20px',
                  }}
                >
                  {' '}
                  <span style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(17,17,17,.7)' }}>{show(v.t?.waitTitle)}</span>{' '}
                  {list(v.waits).map((w$, $i) => {
                    const s3 = { ...v, w: w$, $index: $i };
                    return (
                      <Fragment key={$i}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '16px 18px',
                            borderRadius: '16px',
                            background: 'var(--paper)',
                          }}
                        >
                          <span
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: '#D6E4DA',
                              display: 'grid',
                              placeItems: 'center',
                              flex: 'none',
                            }}
                          >
                            <DS.Icon name={s3.w?.icon} size={16} />
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '15px', fontWeight: '500' }}>{show(s3.w?.title)}</span>
                            <span style={{ fontSize: '12px', color: 'rgba(17,17,17,.7)' }}>{show(s3.w?.meta)}</span>
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div id="states" data-screen-label="03 States" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <span style={{ fontSize: '22px', fontWeight: '500', whiteSpace: 'nowrap' }}>{show(v.t?.s3)}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{show(v.t?.s3n)}</span>
          </div>{' '}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            {' '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.cCode)}</span>{' '}
              <div
                style={{
                  flex: 'none',
                  width: '460px',
                  height: '580px',
                  borderRadius: '16px',
                  background: 'var(--bg-sunk)',
                  boxShadow: '0 0 0 1px var(--rule)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '24px',
                  boxSizing: 'border-box',
                }}
              >
                {' '}
                <div
                  style={{
                    width: '100%',
                    background: 'var(--bg-page)',
                    borderRadius: '16px',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    boxSizing: 'border-box',
                  }}
                >
                  {' '}
                  <DS.Icon name="mail" size={22} />{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '500' }}>{show(v.t?.codeTitle)}</span>
                    <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.t?.codeSub)}</span>
                  </div>{' '}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {list(v.otp).map((d$, $i) => {
                      const s4 = { ...v, d: d$, $index: $i };
                      return (
                        <Fragment key={$i}>
                          <span
                            style={{
                              width: '48px',
                              height: '56px',
                              borderRadius: '8px',
                              background: s4.d?.bg,
                              boxShadow: s4.d?.ring,
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '22px',
                              fontWeight: '500',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {show(s4.d?.v)}
                          </span>
                        </Fragment>
                      );
                    })}
                  </div>{' '}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{show(v.t?.resend)}</span>
                    <span style={{ fontWeight: '500', textDecoration: 'underline' }}>{show(v.t?.diffEmail)}</span>
                  </div>{' '}
                  <span
                    style={{
                      fontSize: '12px',
                      lineHeight: '1.6',
                      color: 'var(--text-secondary)',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--rule-soft)',
                    }}
                  >
                    {show(v.t?.codeNote)}
                  </span>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.cTwo)}</span>{' '}
              <div
                style={{
                  flex: 'none',
                  width: '460px',
                  height: '580px',
                  borderRadius: '16px',
                  background: 'var(--bg-sunk)',
                  boxShadow: '0 0 0 1px var(--rule)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '24px',
                  boxSizing: 'border-box',
                }}
              >
                {' '}
                <div
                  style={{
                    width: '100%',
                    background: 'var(--bg-page)',
                    borderRadius: '16px',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    boxSizing: 'border-box',
                  }}
                >
                  {' '}
                  <DS.Icon name="shield-check" size={22} />{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '500' }}>{show(v.t?.twoTitle)}</span>
                    <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.t?.twoSub)}</span>
                  </div>{' '}
                  <div className="sc-host-x" style={{ width: '100%' }}>
                    <DS.Button size="lg" ground={v.ground} {...v.fullW}>
                      <DS.Icon name="fingerprint" size={16} />
                      {show(v.t?.usePasskey)}
                    </DS.Button>
                  </div>{' '}
                  <div className="sc-host-x" style={{ width: '100%' }}>
                    <DS.Button variant="secondary" size="lg" ground={v.ground} {...v.fullW}>
                      {show(v.t?.useApp)}
                    </DS.Button>
                  </div>{' '}
                  <DS.Checkbox checked={false} label={v.t?.trust} />{' '}
                  <span style={{ fontSize: '13px', fontWeight: '500', textDecoration: 'underline' }}>{show(v.t?.recovery)}</span>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.cSso)}</span>{' '}
              <div
                style={{
                  flex: 'none',
                  width: '460px',
                  height: '580px',
                  borderRadius: '16px',
                  background: 'var(--bg-sunk)',
                  boxShadow: '0 0 0 1px var(--rule)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '24px',
                  boxSizing: 'border-box',
                }}
              >
                {' '}
                <div
                  style={{
                    width: '100%',
                    background: 'var(--bg-page)',
                    borderRadius: '16px',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    boxSizing: 'border-box',
                  }}
                >
                  {' '}
                  <DS.Icon name="building-2" size={22} />{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '500', lineHeight: '1.3' }}>{show(v.t?.ssoTitle)}</span>
                    <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.t?.ssoSub)}</span>
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-sunk)',
                      fontSize: '14px',
                    }}
                  >
                    <span style={{ flex: '1' }}>anna.k@harbour.vc</span>
                    <span style={{ fontSize: '12px', fontWeight: '500', textDecoration: 'underline' }}>{show(v.t?.change)}</span>
                  </div>{' '}
                  <div className="sc-host-x" style={{ width: '100%' }}>
                    <DS.Button size="lg" ground={v.ground} {...v.fullW}>
                      {show(v.t?.ssoBtn)}
                    </DS.Button>
                  </div>{' '}
                  <span style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.t?.ssoNote)}</span>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.cLock)}</span>{' '}
              <div
                style={{
                  flex: 'none',
                  width: '460px',
                  height: '580px',
                  borderRadius: '16px',
                  background: 'var(--bg-sunk)',
                  boxShadow: '0 0 0 1px var(--rule)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '24px',
                  boxSizing: 'border-box',
                }}
              >
                {' '}
                <div
                  style={{
                    width: '100%',
                    background: 'var(--bg-page)',
                    borderRadius: '16px',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    boxSizing: 'border-box',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '500' }}>{show(v.t?.signInShort)}</span>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>li.wei@halden.co</span>
                  </div>{' '}
                  <DS.Input label={v.t?.password} type="password" defaultValue="harbour-2025" invalid={true} hint={v.t?.wrongPw} />{' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'var(--status-error-wash)',
                      color: 'var(--ink)',
                    }}
                  >
                    <DS.Icon name="timer" size={16} />
                    <span style={{ flex: '1', fontSize: '13px', lineHeight: '1.5' }}>{show(v.t?.lockSub)}</span>
                  </div>{' '}
                  <div className="sc-host-x" style={{ width: '100%' }}>
                    <DS.Button size="lg" ground={v.ground} disabled={true} {...v.fullW}>
                      {show(v.t?.tryIn)}
                    </DS.Button>
                  </div>{' '}
                  <span style={{ fontSize: '13px', fontWeight: '500', textDecoration: 'underline' }}>{show(v.t?.forgot)}</span>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{show(v.t?.cExp)}</span>{' '}
              <div
                style={{
                  flex: 'none',
                  width: '460px',
                  height: '580px',
                  borderRadius: '16px',
                  background: 'var(--bg-sunk)',
                  boxShadow: '0 0 0 1px var(--rule)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '24px',
                  boxSizing: 'border-box',
                }}
              >
                {' '}
                <div
                  style={{
                    width: '100%',
                    background: 'var(--bg-page)',
                    borderRadius: '16px',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    boxSizing: 'border-box',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        background: '#D6E4DA',
                        color: 'var(--ink)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      H
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Halden Capital</span>
                  </div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '500' }}>{show(v.t?.expTitle)}</span>
                    <span style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.t?.expSub)}</span>
                  </div>{' '}
                  <div className="sc-host-x" style={{ width: '100%' }}>
                    <DS.Button size="lg" ground={v.ground} {...v.fullW}>
                      {show(v.t?.expBtn)}
                    </DS.Button>
                  </div>{' '}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {show(v.t?.haveAcc)}{' '}
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500', textDecoration: 'underline' }}>
                      {show(v.t?.signInShort)}
                    </span>
                  </span>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div id="phone" data-screen-label="04 Phone and rules" style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              <span style={{ fontSize: '22px', fontWeight: '500', whiteSpace: 'nowrap' }}>{show(v.t?.s4)}</span>
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
                padding: '64px 24px 36px',
                boxSizing: 'border-box',
                gap: '18px',
              }}
            >
              {' '}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
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
                  }}
                >
                  <img src="../assets/logo-icon.svg" alt="COSX" style={{ width: '78%', height: '78%', display: 'block' }} />
                </span>
                <span style={{ fontSize: '15px', fontWeight: '500' }}>MetaRoom</span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '24px' }}>
                <span style={{ fontSize: '26px', fontWeight: '500', lineHeight: '1.25' }}>{show(v.t?.signInTitle)}</span>
                <span style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(v.t?.signInSub)}</span>
              </div>{' '}
              {list(v.socials).map((s$, $i) => {
                const s5 = { ...v, s: s$, $index: $i };
                return (
                  <Fragment key={$i}>
                    <div className="sc-host-x" style={{ width: '100%' }}>
                      <DS.Button variant="secondary" size="lg" ground={s5.ground} {...s5.fullW}>
                        <img src={s5.s?.src} alt="" style={{ width: '18px', height: '18px', display: 'block', objectFit: 'contain' }} />
                        {show(s5.s?.label)}
                      </DS.Button>
                    </div>
                  </Fragment>
                );
              })}{' '}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
                {show(v.t?.or)}
                <span style={{ flex: '1', height: '1px', background: 'var(--rule)' }} />
              </div>{' '}
              <DS.Input label={v.t?.email} placeholder={v.t?.emailPh} type="email" />{' '}
              <div className="sc-host-x" style={{ width: '100%' }}>
                <DS.Button size="lg" ground={v.ground} {...v.fullW}>
                  {show(v.t?.contEmail)}
                </DS.Button>
              </div>{' '}
              <div style={{ flex: '1' }} />{' '}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '500' }}>
                <span>{show(v.t?.passkey)}</span>
                <span>{show(v.t?.sso)}</span>
              </div>{' '}
            </div>{' '}
          </div>{' '}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 380px)', gap: '16px', paddingTop: '56px' }}>
            {' '}
            {list(v.rules).map((r$, $i) => {
              const s6 = { ...v, r: r$, $index: $i };
              return (
                <Fragment key={$i}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '20px',
                      borderRadius: '16px',
                      background: 'var(--bg-page)',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{show(s6.r?.k)}</span>
                    <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{show(s6.r?.v)}</span>
                  </div>
                </Fragment>
              );
            })}{' '}
          </div>{' '}
        </div>
      </div>
    </>
  );
}
