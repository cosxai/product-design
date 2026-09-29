import { FileSpreadsheet, FolderSync, Inbox, Lock, Mail, Users } from 'lucide-react';
import { useState, type MouseEvent } from 'react';

import { ActivityTimeline } from '../../src/components/ActivityTimeline';
import { Badge } from '../../src/components/Badge';
import { Breadcrumb } from '../../src/components/Breadcrumb';
import { Card } from '../../src/components/Card';
import { FileCard } from '../../src/components/FileCard';
import { FileList, FileRow } from '../../src/components/FileRow';
import { FolderTree, type TreeNode } from '../../src/components/FolderTree';
import { ListToolbar, type ListView, type SearchScope } from '../../src/components/ListToolbar';
import { Logo } from '../../src/components/Logo';
import { PageHeader } from '../../src/components/PageHeader';
import { Steps } from '../../src/components/Steps';
import { TabList, Tabs, Tab } from '../../src/components/Tabs';
import { useSelection } from '../../src/components/useSelection';
import { Section } from './Row';

export const demo = { id: 'data', title: 'Data display — cards, rows, toolbar, tree, breadcrumb, header, steps, timeline', render: DataDemo };

function Doc() {
  return (
    <div className="h-[144px] w-[148px] self-end rounded-t-md border border-b-0 border-rule bg-page p-3">
      <div className="mb-2 h-1 w-3/5 rounded-pill bg-well" />
      <div className="mb-1.5 h-0.5 w-full rounded-pill bg-well" />
      <div className="mb-1.5 h-0.5 w-full rounded-pill bg-well" />
      <div className="h-0.5 w-4/5 rounded-pill bg-well" />
    </div>
  );
}

export function DataDemo({ zh }: { zh: boolean }) {
  const t = (en: string, cn: string) => (zh ? cn : en);
  const cards = ['sha', 'minutes', 'site', 'mirror', 'cap', 'link'];
  const sel = useSelection({ ids: cards, defaultSelected: ['cap'] });
  const [starred, setStarred] = useState(true);
  const [query, setQuery] = useState('agreement');
  const [scope, setScope] = useState<SearchScope>('deep');
  const [view, setView] = useState<ListView>('list');
  const [sort, setSort] = useState('updated');
  const [checked, setChecked] = useState<string[]>([]);
  const [folder, setFolder] = useState('sha');

  const tree: TreeNode[] = [
    {
      id: 'room',
      label: t('Harbour data room', 'Harbour 数据室'),
      children: [
        {
          id: 'legal',
          label: t('Legal', '法务'),
          children: [
            { id: 'sha', label: t('Shareholder agreements', '股东协议'), meta: 12 },
            { id: 'side', label: t('Side letters', '附函'), meta: 4, hasChildren: true },
          ],
        },
        { id: 'fin', label: t('Financials', '财务'), hasChildren: true },
        { id: 'dropbox', label: t('Dropbox · Harbour mirror', 'Dropbox · Harbour 镜像'), icon: FolderSync, meta: '1,204', hasChildren: true },
        { id: 'inbox', label: t('Inbox · deals@halden.co', '收件箱 · deals@halden.co'), icon: Mail, hasChildren: true },
        { id: 'signed', label: t('Signed copies', '已签副本'), icon: Lock, meta: t('System', '系统') },
        { id: 'shared', label: t('Shared with me', '与我共享'), icon: Users, meta: 3, hasChildren: true },
      ],
    },
  ];

  const press = (id: string) => (e: MouseEvent<HTMLButtonElement>) => {
    if (!sel.handleClick(id, e)) sel.toggle(id);
  };

  return (
    <>
      <Section title={t('Cards', '卡片')}>
        <div className="grid grid-cols-4 gap-4" onKeyDown={sel.onKeyDown}>
          <FileCard
            title={t('Shareholder agreement v3', '股东协议 v3')}
            preview={<Doc />}
            type="PDF"
            statusLabel={t('Signed', '已签署')}
            status="complete"
            comments={4}
            meta={t('Updated 2 hours ago', '2 小时前更新')}
            starred={starred}
            onStarredChange={setStarred}
            selected={sel.isSelected('sha')}
            selectionMode={sel.selectionMode}
            onSelectedChange={() => sel.toggle('sha')}
            onPress={press('sha')}
          />
          <FileCard
            title={t('Board minutes 2025', '2025 董事会纪要')}
            state="converting"
            stateLabel={t('Converting to PDF', '正在转换为 PDF')}
            type="Word"
            statusLabel={t('Converting', '转换中')}
            status="progress"
            meta={t('Added just now', '刚刚添加')}
            onSelectedChange={() => sel.toggle('minutes')}
            selected={sel.isSelected('minutes')}
            selectionMode={sel.selectionMode}
            onPress={press('minutes')}
          />
          <FileCard
            title="Site plan.dwg"
            state="failed"
            stateLabel={t('Render failed', '渲染失败')}
            onRerender={() => {}}
            rerenderLabel={t('Re-render', '重新渲染')}
            statusLabel={t('Render failed', '渲染失败')}
            status="error"
            meta={t('in Harbour / Site / 2026', '位于 Harbour / Site / 2026')}
            onSelectedChange={() => sel.toggle('site')}
            selected={sel.isSelected('site')}
            selectionMode={sel.selectionMode}
            onPress={press('site')}
          />
          <FileCard
            kind="folder"
            icon={FolderSync}
            title={t('Harbour mirror', 'Harbour 镜像')}
            source="Dropbox"
            meta={t('1,204 folders · syncing', '1,204 个文件夹 · 同步中')}
            onSelectedChange={() => sel.toggle('mirror')}
            selected={sel.isSelected('mirror')}
            selectionMode={sel.selectionMode}
            onPress={press('mirror')}
          />
          <FileCard
            title="Cap table.xlsx"
            icon={FileSpreadsheet}
            meta={t('Selected · whole card toggles', '已选中 · 整张卡片可切换')}
            onSelectedChange={() => sel.toggle('cap')}
            selected={sel.isSelected('cap')}
            selectionMode={sel.selectionMode}
            onPress={press('cap')}
          />
          <FileCard kind="link" title={t('Link · Term sheet', '链接 · 投资条款')} meta={t('Points to Legal / 2026', '指向 法务 / 2026')} onRemoveLink={() => {}} removeLinkLabel={t('Remove link', '移除链接')} />
        </div>
      </Section>

      <div className="grid grid-cols-[3fr_2fr] gap-4">
        <Card className="flex flex-col gap-4 p-6">
          <h3 className="m-0 text-h3 font-medium">{t('List toolbar and rows', '列表工具栏与行')}</h3>
          <ListToolbar
            query={query}
            onQueryChange={setQuery}
            scope={scope}
            onScopeChange={setScope}
            sortOptions={[
              { value: 'updated', label: t('Last updated', '最近更新') },
              { value: 'name', label: t('Name', '名称') },
            ]}
            sort={sort}
            onSortChange={setSort}
            filters={[{ id: 'signed', label: t('Signed', '已签署') }]}
            onFilterRemove={() => {}}
            view={view}
            onViewChange={setView}
            counts={t('2 folders · 14 documents · more below', '2 个文件夹 · 14 份文档 · 下方还有')}
            labels={
              zh
                ? {
                    search: '搜索此文件夹',
                    scopeDeep: '正在搜索此文件夹及其子文件夹',
                    scopeFolder: '仅搜索此文件夹',
                    switchToFolder: '仅此文件夹',
                    switchToDeep: '包含子文件夹',
                    removeFilter: (l) => `移除筛选 ${l}`,
                  }
                : undefined
            }
          />
          <FileList label={t('Documents', '文档')} columns={{ name: t('Name', '名称'), state: t('State', '状态'), updated: t('Updated', '更新') }}>
            <FileRow name="Shareholder agreement v3.pdf" statusLabel={t('Signed', '已签署')} status="complete" updated={t('2 hours ago', '2 小时前')} onStarredChange={() => {}} starred />
            <FileRow name="Loan agreement.pdf" icon={Lock} statusLabel={t('Password', '有密码')} status="attention" tone="attention" updated={t('in Legal / 2026', '位于 法务 / 2026')} onStarredChange={() => {}} />
            <FileRow name="Re: Side letter comments from Harbour Ventures legal team.eml" icon={Mail} statusLabel={t('Indexing', '索引中')} status="progress" updated={t('5 minutes ago', '5 分钟前')} onStarredChange={() => {}} />
            <FileRow name="Overdue KYC pack.zip" icon={Inbox} statusLabel={t('Overdue', '已逾期')} status="error" tone="error" updated={t('3 days ago', '3 天前')} />
          </FileList>
        </Card>
        <Card className="flex flex-col gap-3 p-6">
          <h3 className="m-0 text-h3 font-medium">{t('Folder tree', '文件夹树')}</h3>
          <FolderTree
            label={t('Folders', '文件夹')}
            nodes={tree}
            defaultExpandedIds={['room', 'legal']}
            selectedId={folder}
            onSelect={setFolder}
            loadChildren={(id) => new Promise((r) => setTimeout(() => r([{ id: `${id}-2026`, label: '2026' }]), 800))}
            onDropItems={() => {}}
          />
          <h3 className="m-0 mt-3 text-h3 font-medium">{t('Checkbox tree', '勾选树')}</h3>
          <FolderTree label={t('Choose folders', '选择文件夹')} nodes={tree.slice(0, 1)} defaultExpandedIds={['room', 'legal']} checkedIds={checked.length ? checked : ['sha']} onCheckedChange={setChecked} />
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col gap-4 p-6">
          <h3 className="m-0 text-h3 font-medium">{t('Breadcrumb · folds beyond four', '面包屑 · 超过四段折叠')}</h3>
          <Breadcrumb
            root={
              <span className="flex items-center gap-2 font-medium text-fg">
                <Logo variant="tile" height={20} alt="" />
                Metaroom
              </span>
            }
            items={[{ label: t('Harbour data room', 'Harbour 数据室'), href: '#' }, { label: 'Series A', href: '#' }, { label: t('Legal', '法务'), href: '#' }, { label: t('Shareholder agreement v3', '股东协议 v3'), tag: 'PDF' }]}
            status={<Badge status="complete">{t('Signed', '已签署')}</Badge>}
            foldLabel={t('Show hidden folders', '显示隐藏的文件夹')}
          />
          <h3 className="m-0 text-h3 font-medium">{t('Page header · seven in one', '页头卡片 · 七合一')}</h3>
          <PageHeader
            level={2}
            eyebrow={t('Project · Series A', '项目 · A 轮')}
            title={t('Harbour data room', 'Harbour 数据室')}
            status={<Badge status="progress">{t('Due diligence', '尽职调查')}</Badge>}
            note={t('Syncing · 6,831 items · ~5,209 left', '同步中 · 6,831 项 · 约剩 5,209')}
            noteDot
            figures={[
              { value: '214', label: t('Documents', '文档') },
              { value: '38', label: t('Folders', '文件夹') },
              { value: '12', label: t('Viewers', '查看者') },
            ]}
          />
        </Card>
        <Card className="flex flex-col gap-4 p-6">
          <h3 className="m-0 text-h3 font-medium">{t('Steps · four states', '步骤 · 四种状态')}</h3>
          <Steps
            steps={[
              { title: t('Fill in investor form', '填写投资人表格'), state: 'done', detail: t('Done 22 Sep', '9 月 22 日完成') },
              { title: t('Sign the NDA', '签署保密协议'), state: 'current', detail: t('Current step', '当前步骤') },
              { title: t('Open the data room', '打开数据室'), state: 'upcoming' },
              { title: t('Financial model', '财务模型'), state: 'blocked', detail: t('Blocked · opens at the Term sheet stage', '未开放 · 投资条款阶段开放') },
            ]}
          />
          <h3 className="m-0 mt-2 text-h3 font-medium">{t('Activity timeline', '动态时间线')}</h3>
          <ActivityTimeline
            scope={
              <Tabs variant="pills" defaultValue="share">
                <TabList aria-label={t('Scope', '范围')}>
                  <Tab value="share">{t('This share', '本次分享')}</Tab>
                  <Tab value="chain">{t('Whole chain', '整条链')}</Tab>
                </TabList>
              </Tabs>
            }
            groups={[
              {
                label: t('Today', '今天'),
                events: [
                  { id: '1', actor: { name: 'Anna Kowalski' }, action: t('viewed Cap table.xlsx for 6 min', '查看了 Cap table.xlsx 6 分钟'), time: '14:02', detail: t('pages 2–4 most', '第 2–4 页最多') },
                  { id: '2', actor: { name: 'Anna Kowalski' }, action: t('forwarded to 4 people', '转发给了 4 人'), time: '11:40' },
                ],
              },
              { label: t('Yesterday', '昨天'), events: [{ id: '3', actor: { name: '王志远' }, action: t('signed the NDA', '签署了保密协议'), time: '17:15' }] },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
