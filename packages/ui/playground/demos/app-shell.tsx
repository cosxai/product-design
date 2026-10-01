import { FileText, MessageCircle, Newspaper, SquareCheck, Users } from 'lucide-react';
import { useState, type CSSProperties } from 'react';

import { AppRail, AppRailSlot, Avatar, BottomSheet, BottomTabs, Button, Popover, PopoverContent, PopoverTrigger, WorkspaceMark, type AppRailItem, type BottomTabItem } from '../../src';
import { Row, Section } from './Row';

export const demo = { id: 'app-shell', title: 'App shell — AppRail, BottomTabs, BottomSheet, Popover, Avatar', render: AppShellDemo };

export function AppShellDemo({ zh }: { zh: boolean }) {
  const t = (en: string, cn: string) => (zh ? cn : en);
  const soon = t('Coming soon', '即将推出');
  const [mod, setMod] = useState('agent');
  const [tab, setTab] = useState('agent');
  const [ws, setWs] = useState(false);
  const [me, setMe] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [brand, setBrand] = useState(false);
  const rail: AppRailItem[] = [
    { key: 'agent', icon: MessageCircle, label: 'Agent', dot: true },
    ...(
      [
        ['tasks', SquareCheck, t('My tasks', '我的任务')],
        ['docs', FileText, t('Documents', '文档')],
        ['clients', Users, t('My clients', '我的客户')],
        ['content', Newspaper, t('My content', '我的内容')],
      ] as const
    ).map(([key, icon, label]) => ({ key, icon, label, disabled: true, disabledHint: `${label} · ${soon}` })),
  ];
  const tabs: BottomTabItem[] = [
    { key: 'agent', icon: MessageCircle, label: 'Agent' },
    { key: 'tasks', icon: SquareCheck, label: t('Tasks', '任务'), count: 2, disabled: true },
    { key: 'docs', icon: FileText, label: t('Docs', '文档'), disabled: true },
    { key: 'clients', icon: Users, label: t('Clients', '客户'), disabled: true },
    { key: 'me', label: t('Me', '我'), count: 3, avatar: <Avatar name="Li Wei" size={24} /> },
  ];
  return (
    <div className="flex flex-col gap-10" style={brand ? ({ '--brand-field': '#D6E4DA', '--brand-mark': '#7FB08E' } as CSSProperties) : undefined}>
      <Button variant="secondary" size="sm" onClick={() => setBrand(!brand)}>
        {brand ? 'COSX yellow' : 'Workspace brand (green)'}
      </Button>
      <Section title="AppRail">
        <div className="flex h-[520px] overflow-hidden rounded-[16px] border border-rule">
          <AppRail
            label={t('Modules', '模块')}
            items={rail}
            value={mod}
            onChange={setMod}
            workspace={
              <Popover open={ws} onOpenChange={setWs}>
                <PopoverTrigger asChild>
                  <AppRailSlot label={t('Switch workspace', '切换工作区')} active={ws}>
                    <WorkspaceMark name="Halden Capital" />
                  </AppRailSlot>
                </PopoverTrigger>
                <PopoverContent side="right" aria-label={t('Workspaces', '工作区')}>
                  <div className="p-2 text-small">Halden Capital · Vela Legal</div>
                </PopoverContent>
              </Popover>
            }
            account={
              <Popover open={me} onOpenChange={setMe}>
                <PopoverTrigger asChild>
                  <AppRailSlot label={t('Account', '账号')} shape="round" active={me}>
                    <Avatar name="Li Wei" />
                  </AppRailSlot>
                </PopoverTrigger>
                <PopoverContent side="right" align="end" aria-label={t('Account', '账号')}>
                  <div className="flex items-center gap-3 p-2">
                    <Avatar name="Li Wei" size={40} />
                    <span className="text-ui font-medium">Li Wei</span>
                  </div>
                </PopoverContent>
              </Popover>
            }
          />
          <div className="flex-1 bg-page" />
        </div>
      </Section>
      <Section title="Avatar">
        <Row label="20 · 24 · 28 · 32 · 36 · 40 · 52">
          {([20, 24, 28, 32, 36, 40, 52] as const).map((s) => (
            <Avatar key={s} name="Li Wei" size={s} />
          ))}
          <Avatar name="王志远" size={40} />
          <Avatar name="Li Wei" size={40} tone="brand" />
          <Avatar name="Li Wei" size={40} ring />
        </Row>
      </Section>
      <Section title="BottomTabs + BottomSheet (phone)">
        <div className="relative flex h-[640px] w-[390px] flex-col overflow-hidden rounded-[36px] border border-rule bg-page">
          <div className="flex flex-1 items-center justify-center">
            <Button onClick={() => setSheet(true)}>{t('Switch workspace', '切换工作区')}</Button>
          </div>
          <BottomTabs label={t('Modules', '模块')} items={tabs} value={tab} onChange={(k) => (k === 'me' ? (setTab(k), setSheet(true)) : setTab(k))} />
        </div>
        <BottomSheet title={t('Switch workspace', '切换工作区')} open={sheet} onOpenChange={setSheet}>
          {['Halden Capital', 'Vela Legal'].map((n) => (
            <button key={n} type="button" className="flex min-h-14 items-center gap-3 rounded-[12px] border-0 bg-transparent px-3 text-left text-body text-fg hover:bg-hover">
              <WorkspaceMark name={n} size={32} />
              {n}
            </button>
          ))}
        </BottomSheet>
      </Section>
    </div>
  );
}
