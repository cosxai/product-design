import { X } from 'lucide-react';
import { useState } from 'react';

import { AuthIconTile, AuthLayout, AuthPanel, AuthStepHead, Button, Logo, Select, ThemeSwitch, WorkspaceRow, type ThemeMode } from '../../src';

const T = (zh: boolean, en: string, cn: string) => (zh ? cn : en);

export const demo = { id: 'auth', title: 'Sign-in — AuthLayout, AuthPanel, AuthStepHead, ThemeSwitch, WorkspaceRow', render: AuthDemo };

export function AuthDemo({ zh }: { zh: boolean }) {
  const t = (en: string, cn: string) => T(zh, en, cn);
  const [mode, setMode] = useState<ThemeMode>('system');
  const [busy, setBusy] = useState<string>();
  const brand = (
    <>
      <Logo variant="tile" height={32} alt="" />
      COSX
    </>
  );
  const footer = (
    <>
      <span>{t('Privacy · Status', '隐私 · 服务状态')}</span>
      <div className="w-[180px]">
        <Select size="sm" aria-label={t('Language', '语言')} value={zh ? 'zh' : 'en'} options={[{ value: 'en', label: 'English' }, { value: 'zh', label: '简体中文' }]} />
      </div>
    </>
  );
  return (
    <>
      <div className="h-[720px] overflow-hidden rounded-[16px] border border-rule">
        <AuthLayout
          brand={brand}
          headerEnd={<ThemeSwitch value={mode} onChange={setMode} />}
          footer={footer}
          panel={<AuthPanel eyebrow={t('Your workspaces', '你的工作区')} lead={t('Every workspace you belong to, ', '你所在的每个工作区，')} mark={t('under one sign-in.', '一次登录。')} sub={t('Customers, colleagues and your own space, each with its own access.', '客户、同事和你自己的空间，各有各的权限。')} />}
        >
          <div className="flex flex-col gap-6">
            <AuthStepHead title={t('Choose a workspace', '选择工作区')}>{t('Signed in as sam@example.com', '已登录为 sam@example.com')}</AuthStepHead>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {['Halden Capital', 'Vela Legal', 'Northwind'].map((name) => (
                <li key={name}>
                  <WorkspaceRow name={name} detail={name.split(' ')[0]!.toLowerCase()} busy={busy === name} disabled={busy !== undefined} onClick={() => setBusy(name)} />
                </li>
              ))}
            </ul>
          </div>
        </AuthLayout>
      </div>
      <div className="h-[560px] overflow-hidden rounded-[16px] border border-rule">
        <AuthLayout brand={brand} headerEnd={<ThemeSwitch value={mode} onChange={setMode} />} help={t('Having trouble? Ask your workspace admin or email support@cosx.co.', '遇到问题？请联系工作区管理员，或发邮件至 support@cosx.co。')} footer={footer}>
          <div className="flex flex-col gap-5">
            <AuthStepHead icon={<AuthIconTile tone="error"><X size={26} strokeWidth={1.75} /></AuthIconTile>} title={t('Sign-in didn’t finish', '登录没有完成')}>
              {t('Nothing was changed. Start again from the app.', '没有任何更改。请回到应用重新开始。')}
            </AuthStepHead>
            <Button size="lg" className="w-full">{t('Try again', '重试')}</Button>
          </div>
        </AuthLayout>
      </div>
    </>
  );
}
