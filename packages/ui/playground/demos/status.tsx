import { Button } from '../../src/components/Button';
import { Dropzone } from '../../src/components/Dropzone';
import { PageNotice, PageState } from '../../src/components/PageState';
import { Progress } from '../../src/components/Progress';
import { PulseDot } from '../../src/components/PulseDot';
import { SkeletonCards, SkeletonList, SkeletonViewer } from '../../src/components/Skeleton';
import { StageProgress } from '../../src/components/StageProgress';
import type { DroppedFile } from '../../src/components/status-files';
import { SyncStatus } from '../../src/components/SyncStatus';
import { UploadCheck } from '../../src/components/UploadCheck';
import { UploadFolderRow, UploadList, UploadRow } from '../../src/components/UploadList';
import { WindowDrop } from '../../src/components/WindowDrop';
import { Row, Section } from './Row';

export const demo = { id: 'status', title: 'Upload, progress and page states', render: StatusDemo };

const f = (path: string, type = 'application/pdf'): DroppedFile => ({ file: new File([new Uint8Array(1)], path.split('/').pop()!, { type }), path });
const sized = (d: DroppedFile, size: number): DroppedFile => ({ path: d.path, file: Object.defineProperty(d.file, 'size', { value: size }) });

function StatusDemo({ zh }: { zh: boolean }) {
  const t = (en: string, cn: string) => (zh ? cn : en);
  const openDrop = new URLSearchParams(location.search).get('drop') === '1';
  const zoneLabels = zh
    ? { idle: '拖入文件或文件夹', limit: () => '每个不超过 2 GB', dragging: '拖到这里', release: (x: string) => `松开上传到 ${x}`, choose: '选择文件', chooseFolder: '选择文件夹', compact: '拖入文件或选择', refused: () => '不支持 .exe 文件' }
    : undefined;
  const folder = [
    sized(f('2026 Q3 due diligence/Financials/model.xlsx'), 18_000_000),
    sized(f('2026 Q3 due diligence/Financials/budget.xlsx'), 4_000_000),
    sized(f('2026 Q3 due diligence/Legal/nda.pdf'), 900_000),
    sized(f('2026 Q3 due diligence/.cache/x.tmp'), 1000),
    sized(f('2026 Q3 due diligence/installer.exe', 'application/x-msdownload'), 50_000_000),
    sized(f('2026 Q3 due diligence/a/b/c/d/e/f/g/deep.pdf'), 1000),
  ];
  return (
    <WindowDrop target={t('Due diligence', '尽调')} onDrop={() => {}} open={openDrop || undefined} labels={zh ? { release: (x) => `松开上传到 ${x}` } : undefined}>
      <Section title={t('Drop zone', '拖放区')}>
        <Dropzone directory target={t('Due diligence', '尽调')} onFiles={() => {}} labels={zoneLabels} />
        <div className="grid grid-cols-4 gap-3">
          {(['idle', 'dragging', 'over', 'refused'] as const).map((s) => (
            <div
              key={s}
              data-state={s}
              className={
                'flex min-h-24 flex-col items-center justify-center rounded-lg border p-4 text-center text-ui font-medium ' +
                (s === 'idle'
                  ? 'border-dashed border-rule'
                  : s === 'dragging'
                    ? 'border-dashed border-fg bg-yellow-wash-20 ink:bg-sunk'
                    : s === 'over'
                      ? 'border-ink bg-brand-field text-ink'
                      : 'border-dashed border-error bg-error-wash text-error-text ink:bg-error/20 ink:text-fg')
              }
            >
              {s === 'idle' ? t('Drop files or folders', '拖入文件或文件夹') : s === 'dragging' ? t('Drop here', '拖到这里') : s === 'over' ? t('Release to upload to Due diligence', '松开上传到 尽调') : t('.exe files aren’t supported', '不支持 .exe 文件')}
            </div>
          ))}
        </div>
        <Dropzone compact onFiles={() => {}} labels={zoneLabels} />
      </Section>

      <Section title={t('Check before upload', '上传前检查')}>
        <div className="max-w-[560px]">
          <UploadCheck
            folder="2026 Q3 due diligence"
            items={folder}
            accept=".pdf,.xlsx,.tmp"
            onConfirm={() => {}}
            onCancel={() => {}}
            labels={zh ? { looseFiles: '此文件夹中的文件', wontUpload: (n) => `${n} 个无法上传`, upload: (n) => `上传 ${n} 个文件`, cancel: '取消', refused: (r) => ({ type: '不支持的类型', size: '文件过大', depth: '嵌套过深' })[r.reason], summary: (n, s) => `${n} 个文件 · ${s}`, of: (a, b) => `${a} / ${b}` } : undefined}
          />
        </div>
      </Section>

      <Section title={t('Upload rows', '上传行')}>
        <div className="max-w-[560px]">
          <UploadList>
            <UploadRow item={{ id: '1', name: 'Shareholder agreement v3.pdf', state: 'uploading', progress: 62, size: 3_400_000 }} onCancel={() => {}} labels={zh ? { sizeOf: (a, b) => `${a} / ${b}` } : undefined} />
            <UploadRow item={{ id: '2', name: 'Cap table.xlsx', state: 'retrying', retryAt: Date.now() + 5000 }} onCancel={() => {}} labels={zh ? { retryingIn: (s) => (s > 0 ? `${s} 秒后重试` : '正在重试…') } : undefined} />
            <UploadRow
              item={{ id: '3', name: 'Board minutes 2025.docx', state: 'failed', error: t('The connection dropped.', '连接中断。') }}
              onRetry={() => {}}
              onDismiss={() => {}}
              labels={zh ? { failed: '上传失败。', retry: '重试', dismiss: '忽略' } : undefined}
            />
            <UploadRow item={{ id: '4', name: 'Term sheet.pdf', state: 'done' }} labels={zh ? { done: '已上传' } : undefined} />
            <UploadFolderRow name="2026 Q3 due diligence" done={28} total={41} failed={1} labels={zh ? { failed: (n) => `${n} 个失败` } : undefined} />
          </UploadList>
        </div>
      </Section>

      <Section title={t('Progress', '进度')}>
        <div className="grid max-w-[720px] grid-cols-3 gap-6">
          <Progress label="Download" value={35} text={t('1.2 of 3.4 MB', '1.2 / 3.4 MB')} />
          <Progress label="Preparing" text={t('Preparing download', '正在准备下载')} />
          <Progress label="Batches" segments={['done', 'done', 'current', 'failed', 'todo']} text={t('Batch 3 of 5', '第 3 批，共 5 批')} />
        </div>
        <StageProgress
          stages={[
            { label: t('Documents', '文档'), state: 'done', detail: t('Done', '完成') },
            { label: t('People', '当事人'), state: 'done', detail: t('Done', '完成') },
            { label: t('Facts', '事实'), state: 'current', detail: t('Batch 2 of 4', '第 2 批，共 4 批') },
            { label: t('Assessment', '评估'), state: 'todo' },
            { label: t('Report', '报告'), state: 'todo' },
          ]}
        />
      </Section>

      <Section title={t('Sync', '同步')}>
        <Row label={t('Global', '全局')}>
          <SyncStatus state="synced">{t('In sync', '已同步')}</SyncStatus>
          <SyncStatus state="error" action={<Button size="sm" variant="secondary">{t('Retry', '重试')}</Button>}>
            {t('Sync error', '同步出错')}
          </SyncStatus>
          <SyncStatus state="syncing" detail={t('Updated just now', '刚刚更新')}>
            {t('Importing 2 batches', '正在导入 2 批')}
          </SyncStatus>
          <SyncStatus state="synced" compact>
            {t('In sync', '已同步')}
          </SyncStatus>
        </Row>
        <div className="flex flex-col gap-2">
          <SyncStatus state="syncing" detail={t('attempt 3', '第 3 次')}>
            {t('Retrying after an error', '出错后重试中')}
          </SyncStatus>
          <SyncStatus state="paused">{t('Paused by Wei Li', '已由 Wei Li 暂停')}</SyncStatus>
          <SyncStatus state="off">{t('Unlinked · the files stay, sync has stopped', '已断开 · 文件保留，同步已停止')}</SyncStatus>
          <SyncStatus state="synced">{t('Last synced 4 minutes ago', '4 分钟前同步')}</SyncStatus>
          <SyncStatus state="error">{t('video.mov · not synced · too large', 'video.mov · 未同步 · 文件过大')}</SyncStatus>
        </div>
        <Row label={t('Agent running', 'Agent 运行中')}>
          <PulseDot label={t('Agent running', 'Agent 运行中')} />
        </Row>
      </Section>

      <Section title={t('Page states', '页面状态')}>
        <div className="grid grid-cols-2 gap-4">
          <PageState compact kind="empty" title={t('No documents yet', '还没有文档')} action={<Button>{t('Upload files', '上传文件')}</Button>} />
          <PageState compact kind="no-results" title={t('Nothing matches “shareholder”', '没有与“股东”匹配的内容')} action={<Button variant="secondary">{t('Search all documents', '搜索全部文档')}</Button>} />
          <PageState compact kind="forbidden" title={t('This page isn’t available', '此页面不可用')} action={<Button variant="secondary">{t('Go to my documents', '前往我的文档')}</Button>} />
          <PageState compact kind="error" title={t('Couldn’t load; your work is saved', '加载失败；你的内容已保存')} action={<Button variant="secondary">{t('Try again', '重试')}</Button>} />
        </div>
        <PageNotice>{t('This document has 1,240 pages. Only the first 500 were processed for search and the Agent.', '此文档共 1,240 页，只有前 500 页已处理，可供搜索和 Agent 使用。')}</PageNotice>
        <PageNotice tone="update" action={<Button size="sm" ground="yellow">{t('Refresh', '刷新')}</Button>}>
          {t('Metaroom has been updated. Refresh to load this page.', 'Metaroom 已更新，刷新以加载此页面。')}
        </PageNotice>
      </Section>

      <Section title={t('Skeletons', '骨架屏')}>
        <div className="grid grid-cols-2 gap-6">
          <SkeletonList rows={3} />
          <SkeletonViewer className="max-h-[260px]" />
        </div>
        <SkeletonCards count={4} />
      </Section>
    </WindowDrop>
  );
}
