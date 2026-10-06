import { FileText, MessageCircle, Settings, SquareCheck, Users } from 'lucide-react';
import { useRef, useState } from 'react';

import { AppRail, Avatar, BottomTabs, FolderTree, GlideIndicator, SegmentedControl, cn, useGlide, type AppRailItem, type BottomTabItem } from '../../src';
import { Row, Section } from './Row';

export const demo = { id: 'glide', title: 'Glide — the selected block moves (Motion §07c)', render: GlideDemo };

function ScrollList() {
  const [sel, setSel] = useState('c3');
  const ref = useRef<HTMLDivElement>(null);
  const glide = useGlide(ref, sel, { axis: 'y' });
  const rows = Array.from({ length: 30 }, (_, i) => `c${i}`);
  return (
    <div ref={ref} data-testid="scroll-list" className="flex h-[260px] w-[280px] flex-col gap-0.5 overflow-y-auto rounded-[12px] border border-rule bg-page p-1.5">
      <GlideIndicator glide={glide} />
      {rows.map((r) => (
        <button
          key={r}
          type="button"
          data-glide-key={r}
          onClick={() => setSel(r)}
          className={cn('h-9 shrink-0 rounded-md border-0 bg-transparent px-2.5 text-left text-[14px] text-fg', r === sel ? cn('text-ink', !glide.active && 'bg-brand-field') : 'hover:bg-hover')}
        >
          Conversation {r.slice(1)}
        </button>
      ))}
    </div>
  );
}

function Sidebar() {
  const [sel, setSel] = useState('recent');
  const ref = useRef<HTMLDivElement>(null);
  const glide = useGlide(ref, sel, { axis: 'y' });
  const nodes = [
    { id: 'room', label: 'Harbour data room', children: [
      { id: 'legal', label: 'Legal', children: [{ id: 'sha', label: 'Shareholder agreements' }, { id: 'side', label: 'Side letters' }] },
      { id: 'fin', label: 'Financials' },
    ] },
  ];
  return (
    <div ref={ref} data-testid="sidebar" className="flex h-[300px] w-[280px] flex-col gap-0.5 overflow-y-auto rounded-[12px] border border-rule bg-page p-1.5">
      <GlideIndicator glide={glide} />
      {['recent', 'starred', 'all'].map((k) => (
        <button key={k} type="button" data-glide-key={k} onClick={() => setSel(k)}
          className={cn('flex h-9 shrink-0 items-center rounded-lg border-0 bg-transparent px-2.5 text-left text-[14px] text-fg', k === sel ? cn('font-medium text-ink', !glide.active && 'bg-brand-field') : 'hover:bg-hover')}>
          {k}
        </button>
      ))}
      <FolderTree label="Folders" nodes={nodes} defaultExpandedIds={['room', 'legal']} selectedId={sel} onSelect={setSel} glide={glide} />
    </div>
  );
}

export function GlideDemo({ zh }: { zh: boolean }) {
  const t = (en: string, cn: string) => (zh ? cn : en);
  const [mod, setMod] = useState('agent');
  const [tab, setTab] = useState('agent');
  const [seg, setSeg] = useState('recent');
  const rail: AppRailItem[] = [
    { key: 'agent', icon: MessageCircle, label: 'Agent' },
    { key: 'tasks', icon: SquareCheck, label: t('Tasks', '任务') },
    { key: 'docs', icon: FileText, label: t('Documents', '文档') },
    { key: 'clients', icon: Users, label: t('Clients', '客户') },
    { key: 'settings', icon: Settings, label: t('Settings', '设置') },
  ];
  const tabs: BottomTabItem[] = [
    { key: 'agent', icon: MessageCircle, label: 'Agent' },
    { key: 'docs', icon: FileText, label: t('Documents', '文档') },
    { key: 'me', label: t('Me', '我'), avatar: <Avatar name="Li Wei" size={24} /> },
  ];
  const segments = [
    { value: 'recent', label: t('Recent', '最近') },
    { value: 'starred', label: t('Starred', '星标') },
    { value: 'all', label: t('All', '全部') },
  ];
  return (
    <div className="flex flex-col gap-10">
      <Section title="AppRail · BottomTabs">
        <Row label={t('Vertical rail, horizontal tabs', '竖向图标栏，横向标签栏')}>
          <div className="flex h-[300px] overflow-hidden rounded-[16px] border border-rule">
            <AppRail data-testid="rail" label="Modules" items={rail} value={mod} onChange={setMod} />
          </div>
          <div className="w-[390px] overflow-hidden rounded-[16px] border border-rule">
            <BottomTabs data-testid="tabs" label="Modules" items={tabs} value={tab} onChange={setTab} />
          </div>
        </Row>
      </Section>
      <Section title="SegmentedControl">
        <Row label="md 44 · compact 34 · sm 32">
          <div className="flex w-[358px] flex-col gap-3">
            <SegmentedControl aria-label="Show" value={seg} onChange={setSeg} segments={segments} className="w-full" />
            <SegmentedControl aria-label="Show" size="compact" value={seg} onChange={setSeg} segments={segments} className="w-full" />
            <SegmentedControl aria-label="Show" size="sm" value={seg} onChange={setSeg} segments={segments} />
          </div>
        </Row>
      </Section>
      <Section title={t('A scrolling list (useGlide)', '可滚动列表（useGlide）')}>
        <ScrollList />
      </Section>
      <Section title={t('Nav buttons + FolderTree, one block', '导航按钮 + 文件夹树，一个色块')}>
        <Sidebar />
      </Section>
    </div>
  );
}
