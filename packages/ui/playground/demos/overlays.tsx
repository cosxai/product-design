import { useEffect, useState } from 'react';

import { Badge, Button } from '../../src';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../../src/components/Dialog';
import { Table, type TableSort } from '../../src/components/Table';
import { TabPanel, Tabs } from '../../src/components/Tabs';
import { Toaster, toast } from '../../src/components/Toast';
import { Tooltip } from '../../src/components/Tooltip';
import { Row, Section } from './Row';

export const demo = { id: 'overlays', title: 'Overlays — tabs, dialog, toast, tooltip, table (?open=dialog)', render: OverlaysDemo };

type TaskRow = { id: string; status?: 'attention' | 'error'; task: string; customer: string; docs: number; due: string; state: 'attention' | 'error' | 'progress' | 'complete' };

export function OverlaysDemo({ zh }: { zh: boolean }) {
  const t = (en: string, cn: string) => (zh ? cn : en);
  const params = new URLSearchParams(location.search);
  const [sort, setSort] = useState<TableSort>({ key: 'due', direction: 'asc' });

  useEffect(() => {
    if (params.get('open') === 'dialog') return;
    toast.reset();
    toast({ title: t('Link copied.', '链接已复制。') });
    toast({ title: t('3 files moved to Archive.', '3 个文件已移至归档。'), status: 'complete', action: { label: t('Undo', '撤销'), onClick: () => {} }, duration: 600_000 });
    toast({ title: t("Couldn't rename the folder.", '无法重命名文件夹。'), description: t('A folder with that name already exists.', '已有同名文件夹。'), status: 'error', action: { label: t('Retry', '重试'), onClick: () => {} }, duration: 600_000 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zh]);

  const rows: TaskRow[] = [
    { id: 'T-119', task: t('Translate the term sheet', '翻译条款清单'), customer: 'Harbour Ventures', docs: 1, due: '2026-09-22', state: 'complete' },
    { id: 'T-122', status: 'error', task: t('Prepare the data room index', '准备数据室索引'), customer: 'Kowloon Bay', docs: 20, due: '2026-09-25', state: 'error' },
    { id: 'T-131', status: 'attention', task: t('Sign the engagement letter', '签署委托书'), customer: 'Halden Capital', docs: 2, due: '2026-09-30', state: 'attention' },
    { id: 'T-128', task: t('Chase NDA signatures', '催签保密协议'), customer: 'Halden Capital', docs: 4, due: '2026-10-03', state: 'progress' },
  ];
  const stateLabel = { attention: t('Awaiting you', '等你处理'), error: t('Overdue', '已逾期'), progress: t('In progress', '处理中'), complete: t('Delivered', '已交付') };
  const sorted = [...rows].sort((a, b) => {
    const k = sort.key as keyof TaskRow;
    const r = String(a[k]).localeCompare(String(b[k]), undefined, { numeric: true });
    return sort.direction === 'asc' ? r : -r;
  });

  const tabItems = [
    { value: 'overview', label: t('Overview', '概览') },
    { value: 'documents', label: t('Documents', '文档'), count: 3 },
    { value: 'parties', label: t('Parties', '当事人') },
    { value: 'timeline', label: t('Timeline', '时间线'), count: 0 },
  ];

  return (
    <>
      <Section title={t('Tabs', '标签页')}>
        <Row label="Underline">
          <Tabs className="w-full" items={tabItems} defaultValue="documents" label={t('Project', '项目')}>
            <TabPanel value="documents" className="text-small text-fg-secondary">
              {t('44 documents, organised into folders.', '44 份文档，已按文件夹整理。')}
            </TabPanel>
          </Tabs>
        </Row>
        <Row label="Pills">
          <Tabs className="w-full" variant="pills" items={tabItems.slice(0, 3)} defaultValue="documents" label={t('Sections', '板块')} />
        </Row>
      </Section>

      <Section title={t('Table', '表格')}>
        <Table
          caption={t('Review queue', '审阅队列')}
          columns={[
            { key: 'task', label: t('Task', '任务'), sortable: true },
            { key: 'customer', label: t('Customer', '客户'), sortable: true },
            { key: 'state', label: t('Status', '状态'), render: (r: TaskRow) => <Badge status={r.state}>{stateLabel[r.state]}</Badge> },
            { key: 'docs', label: t('Docs', '文档'), align: 'right', sortable: true },
            { key: 'due', label: t('Due', '截止'), align: 'right', meta: true, sortable: true },
          ]}
          rows={sorted}
          sort={sort}
          onSortChange={setSort}
          rowHref={(r) => `#${r.id}`}
        />
        <Row label={t('Dense · loading', '紧凑 · 加载中')}>
          <Table className="w-full" dense loading columns={[{ key: 'task', label: t('Task', '任务') }, { key: 'due', label: t('Due', '截止'), align: 'right' }]} rows={[]} />
        </Row>
      </Section>

      <Section title={t('Tooltip', '提示')}>
        <Row label={t('Open on hover and on focus; flips to fit', '悬停或聚焦时打开；自动翻转')} className="pt-10">
          <Tooltip content={t('Downloads are off for this share', '此分享已关闭下载')} defaultOpen>
            <Button variant="secondary">{t('Download', '下载')}</Button>
          </Tooltip>
        </Row>
      </Section>

      <Section title={t('Dialog', '对话框')}>
        <Row label={t('Confirm · sm 400 · destructive', '确认 · 400 · 危险操作')}>
        <Dialog defaultOpen={params.get('open') === 'dialog'}>
          <DialogTrigger asChild>
            <Button variant="secondary">{t('Revoke share', '撤销分享')}</Button>
          </DialogTrigger>
          <DialogContent
            size="sm"
            eyebrow={t('Share · Cap table.xlsx', '分享 · 股权表.xlsx')}
            title={t('Revoke this share?', '撤销这个分享？')}
            description={t('Anna Kowalski loses access now. This can’t be undone.', 'Anna Kowalski 将立即失去访问权限，且无法恢复。')}
            closeLabel={t('Close', '关闭')}
            footer={
              <>
                <DialogClose asChild>
                  <Button variant="secondary">{t('Cancel', '取消')}</Button>
                </DialogClose>
                <Button variant="danger">{t('Revoke share', '撤销分享')}</Button>
              </>
            }
          />
        </Dialog>
        </Row>
      </Section>

      <Toaster labels={zh ? { neutral: '通知', complete: '完成', attention: '注意', error: '失败', progress: '进行中', dismiss: '关闭', region: '通知' } : undefined} />
    </>
  );
}
