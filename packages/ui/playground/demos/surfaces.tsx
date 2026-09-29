import { Download, FileText, FolderInput, MessageSquare, MousePointerSquareDashed, Plus, Share2, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

import {
  ActionBar,
  ActionBarProvider,
  useActionBarActivity,
  useActionBarItems,
  useActionBarMode,
  useActionBarSelection,
  type ActionBarAction,
  type ActionBarPresentation,
} from '../../src/components/ActionBar';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { CommandPalette, type CommandSource } from '../../src/components/CommandPalette';
import { ConfirmDialog, PromptDialog, StepUpDialog } from '../../src/components/ConfirmDialog';
import { Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuItem, MenuSeparator, MenuSub, MenuSubContent, MenuSubTrigger, MenuTrigger } from '../../src/components/Menu';
import { SidePanel, SidePanelProvider, SidePanelSlot, useSidePanel } from '../../src/components/SidePanel';
import { Row, Section } from './Row';

// ?c=surfaces&open=palette|confirm|prompt|stepup|menu|panel
const open = new URLSearchParams(location.search).get('open');
const noop = () => {};

function useT(zh: boolean) {
  return (en: string, cn: string) => (zh ? cn : en);
}

function Idle({ zh, presentation, activity }: { zh: boolean; presentation: ActionBarPresentation; activity?: string }) {
  const t = useT(zh);
  const actions: ActionBarAction[] = [
    { id: 'new', label: t('New', '新建'), icon: Plus, shortcut: 'n', onSelect: noop },
    { id: 'upload', label: t('Upload', '上传'), icon: Upload, shortcut: 'u', onSelect: noop },
    { id: 'select', label: t('Select', '选择'), icon: MousePointerSquareDashed, shortcut: 's', onSelect: noop },
    { id: 'comment', label: t('Comment', '评论'), icon: MessageSquare, shortcut: 'c', onSelect: noop, active: presentation === 'full' },
  ];
  useActionBarItems('demo', actions);
  useActionBarActivity('demo', activity ?? null);
  return <ActionBar inline presentation={presentation} />;
}

function Selected({ zh }: { zh: boolean }) {
  const t = useT(zh);
  useActionBarItems('demo', [{ id: 'new', label: 'New', onSelect: noop }]);
  useActionBarSelection('demo', {
    count: 3,
    countLabel: (n) => t(`${n} selected`, `已选 ${n} 项`),
    clearLabel: t('Cancel', '取消'),
    onClear: noop,
    actions: [
      { id: 'share', label: t('Share', '分享'), icon: Share2, onSelect: noop },
      { id: 'move', label: t('Move', '移动'), icon: FolderInput, onSelect: noop },
      { id: 'delete', label: t('Delete', '删除'), icon: Trash2, onSelect: noop },
    ],
  });
  return <ActionBar inline presentation="full" />;
}

function Mode({ zh }: { zh: boolean }) {
  const t = useT(zh);
  useActionBarItems('demo', [{ id: 'new', label: 'New', onSelect: noop }]);
  useActionBarMode('demo', {
    name: t('Comment', '评论'),
    doneLabel: t('Done', '完成'),
    onDone: noop,
    actions: [
      { id: 'prev', label: t('Previous', '上一条'), shortcut: 'k', onSelect: noop },
      { id: 'next', label: t('Next', '下一条'), shortcut: 'j', onSelect: noop },
      { id: 'resolve', label: t('Resolve all', '全部解决'), onSelect: noop },
    ],
  });
  return <ActionBar inline presentation="full" />;
}

function Overflow({ zh }: { zh: boolean }) {
  const t = useT(zh);
  const a = (id: string, en: string, cn: string, extra: Partial<ActionBarAction> = {}): ActionBarAction => ({ id, label: t(en, cn), onSelect: noop, ...extra });
  useActionBarItems('demo', [
    a('new', 'New', '新建', { icon: Plus }),
    a('upload', 'Upload', '上传', { icon: Upload }),
    a('pdf', 'PDF', 'PDF', { group: t('Export', '导出') }),
    a('word', 'Word', 'Word', { group: t('Export', '导出') }),
    a('csv', 'CSV', 'CSV', { group: t('Export', '导出') }),
    a('select', 'Select', '选择'),
    a('comment', 'Comment', '评论'),
    a('translate', 'Translate', '翻译'),
    a('present', 'Present', '演示', { disabledReason: t('Nothing to present yet', '暂无可演示内容') }),
  ]);
  return <ActionBar inline presentation="full" labels={{ more: t('More', '更多') }} />;
}

function PanelDemo({ zh }: { zh: boolean }) {
  const t = useT(zh);
  const { open: openPanel, openId } = useSidePanel();
  if (open === 'panel' && openId === null) queueMicrotask(() => openPanel('share'));
  return (
    <div className="flex h-[360px] overflow-hidden rounded-lg border border-rule">
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-6">
        <div className="text-title font-medium">Harbour data room</div>
        <div className="text-ui text-fg-secondary">{t('The page stays usable; the panel pushes it aside.', '页面仍可操作；面板把内容推开。')}</div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => openPanel('share')}>
            {t('Share', '分享')}
          </Button>
          <Button variant="secondary" onClick={() => openPanel('agent')}>
            Agent
          </Button>
        </div>
      </div>
      <SidePanelSlot />
      <SidePanel id="share" eyebrow={t('Share', '分享')} title="Cap table.xlsx" footer={<Button size="sm">{t('New share', '新建分享')}</Button>}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span>Anna Kowalski</span>
            <Badge status="attention">{t('Pending', '待接受')}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>王志远</span>
            <Badge status="complete">{t('Accepted', '已接受')}</Badge>
          </div>
        </div>
      </SidePanel>
      <SidePanel id="agent" title="Agent">
        …
      </SidePanel>
    </div>
  );
}

const sources = (zh: boolean): CommandSource[] => [
  {
    id: 'titles',
    label: zh ? '文档 · 标题' : 'Documents · titles',
    search: async () => [
      { id: 'cap', title: 'Cap table.xlsx', subtitle: 'Series A / Legal', icon: <FileText size={16} />, onSelect: noop },
      { id: 'sum', title: 'Cap table summary.pdf', icon: <FileText size={16} />, onSelect: noop },
    ],
  },
  { id: 'full', label: zh ? '全文' : 'Full text', search: () => new Promise(() => {}) },
];

export const demo = { id: 'surfaces', title: 'Surfaces — action bar, menu, command palette, side panel, dialogs', render: SurfacesDemo };

export function SurfacesDemo({ zh }: { zh: boolean }) {
  const t = useT(zh);
  const [dialog, setDialog] = useState(open);
  const bars: [string, ActionBarPresentation][] = [
    ['≥ 1280 · full', 'full'],
    ['1024–1279 · no shortcuts', 'labels'],
    ['768–1023 · icons only', 'icons'],
  ];
  return (
    <>
      <Section title={t('Action bar', '操作栏')}>
        {bars.map(([label, p]) => (
          <Row key={p} label={label}>
            <ActionBarProvider storageKey={null}>
              <Idle zh={zh} presentation={p} />
            </ActionBarProvider>
          </Row>
        ))}
        <Row label={t('Folded · background work running', '已折叠 · 后台任务进行中')}>
          <ActionBarProvider storageKey={null}>
            <Idle zh={zh} presentation="folded" activity={t('Importing 2 batches', '正在导入 2 批')} />
          </ActionBarProvider>
        </Row>
        <Row label={t('Selection', '选中')}>
          <ActionBarProvider storageKey={null}>
            <Selected zh={zh} />
          </ActionBarProvider>
        </Row>
        <Row label={t('Mode', '模式')}>
          <ActionBarProvider storageKey={null}>
            <Mode zh={zh} />
          </ActionBarProvider>
        </Row>
        <Row label={t('A group of three folds; past six the rest go under More', '同类超过两个折叠成组；超过六个其余收进“更多”')}>
          <ActionBarProvider storageKey={null}>
            <Overflow zh={zh} />
          </ActionBarProvider>
        </Row>
      </Section>

      <Section title={t('Menu', '菜单')}>
        <Row label={t('Groups, shortcuts, nesting, destructive', '分组、快捷键、嵌套、危险项')}>
          <Menu defaultOpen={open === 'menu'} modal={false}>
            <MenuTrigger asChild>
              <Button variant="secondary">{t('Account', '账户')}</Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem shortcut="⌘,">{t('Preferences', '偏好设置')}</MenuItem>
              <MenuSub>
                <MenuSubTrigger>{t('Switch workspace', '切换工作区')}</MenuSubTrigger>
                <MenuSubContent>
                  <MenuGroup label={t('Customer', '客户')}>
                    <MenuItem>Halden Capital</MenuItem>
                  </MenuGroup>
                  <MenuGroup label={t('Member', '成员')}>
                    <MenuItem>COSX Advisory</MenuItem>
                  </MenuGroup>
                </MenuSubContent>
              </MenuSub>
              <MenuItem disabledReason={t('Admins only', '仅管理员')}>{t('Workspace admin', '工作区管理')}</MenuItem>
              <MenuCheckboxItem checked>{t('Show hidden files', '显示隐藏文件')}</MenuCheckboxItem>
              <MenuSeparator />
              <MenuItem destructive>{t('Sign out', '退出登录')}</MenuItem>
            </MenuContent>
          </Menu>
          <Button variant="secondary" onClick={() => setDialog('palette')}>
            {t('Command palette', '命令面板')} ⌘K
          </Button>
          <Button variant="secondary" onClick={() => setDialog('confirm')}>
            {t('Type to confirm', '输入确认')}
          </Button>
          <Button variant="secondary" onClick={() => setDialog('prompt')}>
            {t('Rename', '重命名')}
          </Button>
          <Button variant="secondary" onClick={() => setDialog('stepup')}>
            {t('Step-up', '二次验证')}
          </Button>
        </Row>
      </Section>

      <Section title={t('Side panel', '侧边面板')}>
        <SidePanelProvider>
          <PanelDemo zh={zh} />
        </SidePanelProvider>
      </Section>

      <CommandPalette
        open={dialog === 'palette'}
        onOpenChange={(o) => setDialog(o ? 'palette' : null)}
        sources={sources(zh)}
        labels={{ placeholder: t('Search or run an action', '搜索或执行操作'), arriving: t('arriving', '加载中') }}
        actions={(q) => [{ id: 'ask', title: t(`Ask the Agent about “${q}”`, `问 Agent 关于“${q}”`), meta: 'I', icon: <Download size={16} />, onSelect: noop }]}
      />
      <ConfirmDialog
        open={dialog === 'confirm'}
        onOpenChange={(o) => setDialog(o ? 'confirm' : null)}
        title={t('Revoke this share and 4 forwards?', '撤销此分享及 4 次转发？')}
        description={t("Anna Kowalski and the 4 people she forwarded it to lose access now. This can't be undone.", 'Anna Kowalski 及她转发的 4 人将立即失去访问权限。此操作无法撤销。')}
        confirmLabel={t('Revoke share', '撤销分享')}
        cancelLabel={t('Cancel', '取消')}
        destructive
        confirmWord={t('revoke', '撤销')}
        confirmWordLabel={t('Type revoke to confirm', '输入“撤销”以确认')}
        onConfirm={() => new Promise((r) => setTimeout(r, 800))}
      />
      <PromptDialog
        open={dialog === 'prompt'}
        onOpenChange={(o) => setDialog(o ? 'prompt' : null)}
        title={t('Rename folder', '重命名文件夹')}
        label={t('Folder name', '文件夹名称')}
        defaultValue="Legal"
        confirmLabel={t('Rename', '重命名')}
        cancelLabel={t('Cancel', '取消')}
        onSubmit={() => new Promise((r) => setTimeout(r, 800))}
      />
      <StepUpDialog
        open={dialog === 'stepup'}
        onOpenChange={(o) => setDialog(o ? 'stepup' : null)}
        title={t("Confirm it's you", '确认是你本人')}
        description={t('Deleting a workspace needs a fresh check.', '删除工作区需要重新验证身份。')}
        passkeyLabel={t('Use passkey', '使用通行密钥')}
        codeLabel={t('Use authenticator code instead', '改用验证器验证码')}
        cancelLabel={t('Cancel', '取消')}
        onPasskey={() => new Promise((r) => setTimeout(r, 800))}
        onCode={() => new Promise((r) => setTimeout(r, 800))}
      />
    </>
  );
}
