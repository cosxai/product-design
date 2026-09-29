import { IconButton, SidePanelProvider, SidePanelSlot, useSidePanel } from '@cosxai/ui';
import { Copy, Flag, RotateCcw, UserRound } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

import {
  AgentDrawer,
  AgentMessage,
  AgentSteps,
  Composer,
  ConfirmationCard,
  Conversation,
  DocumentResult,
  DraftResult,
  HandOver,
  PeopleResult,
  StaffMessage,
  TaskResult,
  UserMessage,
  type AgentStep,
  type ComposerAttachment,
  type ConfirmationState,
} from '../../src/conversation';
import { Citation, type Citations } from '../../src/Citation';
import { Markdown } from '../../src/markdown/Markdown';

// Fictional demo data only (Harbour Series A, Halden Capital …).

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 text-h3 font-medium text-fg">{title}</h2>
      {children}
    </section>
  );
}

function Panel({ label, children, className }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-4 rounded-lg border border-rule bg-page p-5 ${className ?? ''}`}>
      {label && <div className="text-meta text-fg-secondary">{label}</div>}
      {children}
    </div>
  );
}

const sources = (zh: boolean): Citations => ({
  1: { title: zh ? '联系人 · Harbour A 轮' : 'Contacts · Harbour Series A', location: zh ? '筛选：NDA 未签' : 'Filter: NDA not signed', onOpen: () => {} },
  2: {
    title: zh ? '股东协议 v3' : 'Shareholder agreement v3',
    page: 14,
    location: zh ? '第 7.2(c) 条' : 'Clause 7.2(c)',
    excerpt: zh ? '……许可受让人包括由股东控制的家族信托，但须在 10 个工作日内书面通知董事会。' : '…a Permitted Transferee includes a family trust controlled by the Shareholder, provided the Board is notified in writing within 10 Business Days.',
    onOpen: () => {},
  },
  3: { title: zh ? '王志远 · 护照' : 'Wang Zhiyuan · Passport', page: 2, onOpen: () => {} },
});

export const demo = {
  id: 'conversation',
  title: 'Conversation',
  render: function ConversationDemo({ zh }: { zh: boolean }) {
    const t = (en: string, cn: string) => (zh ? cn : en);
    const scope = t('Harbour Series A', 'Harbour A 轮');

    const stepLabels = {
      worked: (s: number | undefined, n: number) => (zh ? `用时 ${s ?? 0} 秒 · ${n} 步` : `Worked for ${s} s · ${n} ${n === 1 ? 'step' : 'steps'}`),
      working: (s: number | undefined, n: number) => (zh ? `进行中 ${s ?? 0} 秒 · ${n} 步` : `Working for ${s} s · ${n} steps`),
      states: zh ? { done: '完成', running: '进行中', failed: '失败', pending: '等待' } : { done: 'Done', running: 'Running', failed: 'Failed', pending: 'Waiting' },
    };
    const agentLabels = zh
      ? { escToStop: '按 Esc 停止', stopped: '已由你停止', continue: '继续', retry: '重试', skip: '跳过它继续', askTeam: '改为询问团队', agent: 'Agent' }
      : undefined;
    const composerLabels = zh
      ? {
          placeholder: '提问，或把任务交出去…',
          writingPlaceholder: 'Agent 正在回答 · 你可以先输入下一条',
          message: '消息',
          asTask: '作为任务',
          attach: '添加文件',
          remove: '移除',
          send: '发送',
          stop: '停止',
          scope: '范围',
          commands: '命令',
        }
      : undefined;

    const steps: AgentStep[] = [
      { id: '1', label: t('Searched contacts in Harbour Series A', '在 Harbour A 轮中搜索联系人'), detail: t('24 found', '找到 24 位') },
      { id: '2', label: t('Checked NDA status', '检查 NDA 状态'), detail: t('4 not signed', '4 位未签') },
      { id: '3', label: t('Searched documents for “family trust”', '搜索文档中的“家族信托”'), detail: t('3 matches', '3 处') },
      { id: '4', label: t('Read Shareholder agreement v3', '阅读股东协议 v3'), detail: t('pages 14–15', '第 14–15 页') },
    ];

    const [confirm, setConfirm] = useState<ConfirmationState>('pending');
    const [handed, setHanded] = useState<'idle' | 'busy' | 'done'>('done');
    const [writing, setWriting] = useState(true);
    const [files, setFiles] = useState<ComposerAttachment[]>([
      { id: 'q3', name: 'Q3 report 2026.pdf', size: 2_400_000 },
      { id: 'bm', name: 'Board minutes.docx', progress: 0.6 },
    ]);

    const commands = [
      { cmd: '/task', description: t('Hand over as a task', '作为任务交给团队') },
      { cmd: '/summarise', description: t('Summarise a document', '总结文档') },
      { cmd: '/find', description: t('Find documents', '查找文档') },
      { cmd: '/translate', description: t('Translate a document', '翻译文档') },
    ];

    const confirmationCard = (
      <ConfirmationCard
        title={t('Send NDA reminders to 4 investors?', '给 4 位投资人发送 NDA 提醒？')}
        state={confirm}
        confirmLabel={t('Send 4 reminders', '发送 4 条提醒')}
        onConfirm={() => {
          setConfirm('confirming');
          setTimeout(() => setConfirm('done'), 1200);
        }}
        secondaryLabel={t('Review drafts', '查看草稿')}
        onSecondary={() => {}}
        doneText={t('4 reminders sent', '已发送 4 条提醒')}
        labels={zh ? { needs: '需要你确认', footnote: '确认之前不会发出任何内容。', done: '完成', dismissed: '未发送', dismiss: '关闭' } : undefined}
      >
        {t(
          'A short note from Halden Capital with the NDA link. Maria Rossi was invited 2 days ago; you may want to leave her out.',
          '以 Halden Capital 名义发一段简短提醒，附 NDA 链接。Maria Rossi 两天前才受邀，可以先不发给她。',
        )}
      </ConfirmationCard>
    );

    return (
      <div className="flex flex-col gap-12">
        <Section title={t('A full conversation · click to expand the steps', '完整对话 · 点击展开步骤')}>
          <Panel className="max-w-[580px]">
            <Conversation aria-label={t('Conversation', '对话')}>
              <UserMessage>
                {t('Which investors haven’t signed the NDA, and does the agreement allow transfers to a family trust?', '哪些投资人还没签 NDA？协议允许转让给家族信托吗？')}
              </UserMessage>
              <AgentMessage
                labels={agentLabels}
                steps={<AgentSteps steps={steps} seconds={14} labels={stepLabels} />}
                footer={
                  <div className="flex flex-col gap-3">
                    {confirmationCard}
                    <div className="flex items-center gap-0.5 text-meta text-fg-secondary">
                      <IconButton icon={Copy} label={t('Copy', '复制')} size="sm" />
                      <IconButton icon={RotateCcw} label={t('Retry', '重试')} size="sm" />
                      <IconButton icon={UserRound} label={t('Hand to the team', '交给团队')} size="sm" />
                      <IconButton icon={Flag} label={t('Report', '反馈')} size="sm" />
                      <span className="ml-2">{t('3 sources · Harbour Series A only', '3 个来源 · 仅 Harbour A 轮')}</span>
                    </div>
                  </div>
                }
              >
                <Markdown size="ui" citations={sources(zh)} citationLabels={zh ? { source: (n) => `来源 ${n}`, page: (p) => `第 ${p} 页`, openAtPage: (p) => `打开第 ${p} 页` } : undefined}>
                  {t(
                    '4 of the 24 invited investors haven’t signed the NDA: **Anna Kowalski, Wang Zhiyuan, James Park** and **Maria Rossi**. [[1]]\n\nYes. Clause 7.2(c) allows transfers to a trust the shareholder controls, as long as the board is told within 10 business days. [[2]]',
                    '24 位受邀投资人中有 4 位未签 NDA：**Anna Kowalski、王志远、James Park** 和 **Maria Rossi**。[[1]]\n\n可以。第 7.2(c) 条允许转让给股东控制的信托，只要在 10 个工作日内通知董事会。[[2]]',
                  )}
                </Markdown>
              </AgentMessage>
              <HandOver
                state={handed}
                taskId="T-128"
                assignee="Sam Ortiz"
                onHandOver={() => {
                  setHanded('busy');
                  setTimeout(() => setHanded('done'), 900);
                }}
                labels={zh ? { handOver: '交给团队', handed: (id, who) => `已创建任务 ${id} · 交给 ${who}` } : undefined}
              />
              <StaffMessage name="Sam Ortiz" org="COSX" time="10:12">
                {t('I’ll send three today and hold Maria’s until Friday.', '今天先发三条，Maria 的等到周五。')}
              </StaffMessage>
            </Conversation>
          </Panel>
        </Section>

        <Section title={t('Message states', '消息状态')}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Panel label={t('Thinking', '思考中')}>
              <AgentMessage
                labels={agentLabels}
                state="thinking"
                activity={t('Reading 3 documents…', '正在读 3 份文档…')}
                activityDetail={t('Searching “family trust” in Harbour Series A', '在 Harbour A 轮中搜索“家族信托”')}
              />
            </Panel>
            <Panel label={t('Writing', '输出中')}>
              <AgentMessage labels={agentLabels} state={writing ? 'writing' : 'stopped'} onStop={() => setWriting(false)} onContinue={() => setWriting(true)}>
                {t('Clause 7.2(c) allows transfers to a trust the shareholder controls, as long as', '第 7.2(c) 条允许转让给股东控制的信托，只要')}
              </AgentMessage>
            </Panel>
            <Panel label={t('Stopped', '已停止')}>
              <AgentMessage labels={agentLabels} state="stopped" onContinue={() => {}}>
                {t('Clause 7.2(c) allows transfers to a trust the shareholder controls…', '第 7.2(c) 条允许转让给股东控制的信托…')}
              </AgentMessage>
            </Panel>
            <Panel label={t('Failed', '失败')}>
              <AgentMessage
                labels={agentLabels}
                state="failed"
                error={t('Couldn’t read Cap table.xlsx: the file is password protected.', '读不了 Cap table.xlsx：文件有密码保护。')}
                onRetry={() => {}}
                onSkip={() => {}}
              />
            </Panel>
            <Panel label={t('Out of scope', '超出范围')}>
              <AgentMessage labels={agentLabels} state="out-of-scope" onAskTeam={() => {}}>
                {t(
                  'I can only see documents shared with you in Harbour Series A. The Kowloon Bay files aren’t in that set.',
                  '我只能看到 Harbour A 轮里与你共享的文档，Kowloon Bay 的文件不在其中。',
                )}
              </AgentMessage>
            </Panel>
            <Panel label={t('Steps · running, one failed', '步骤 · 进行中，一步失败')} className="sm:col-span-2">
              <AgentMessage
                labels={agentLabels}
                steps={
                  <AgentSteps
                    labels={stepLabels}
                    seconds={9}
                    steps={[
                      steps[0]!,
                      { id: 'f', label: t('Read Cap table.xlsx', '读取 Cap table.xlsx'), state: 'failed', error: t('The file is password protected.', '文件有密码保护。') },
                      { id: 'r', label: t('Checking NDA status', '检查 NDA 状态'), state: 'running' },
                      { id: 'p', label: t('Draft the reminders', '起草提醒'), state: 'pending' },
                    ]}
                  />
                }
              />
            </Panel>
          </div>
        </Section>

        <Section title={t('Result cards · open one to go to its page', '结果卡片 · 点开进入对应页面')}>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
            <TaskResult
              taskId="T-128"
              title={t('Chase NDA signatures · 4 investors', '催签 NDA · 4 位投资人')}
              assignee="Sam Ortiz"
              onOpen={() => {}}
              labels={zh ? { created: (id) => `已创建任务 · ${id}`, withUs: (n) => `由我们处理 · ${n}`, open: '打开' } : undefined}
            />
            <DocumentResult
              name="Q3 report 2026.pdf"
              pages={18}
              project="Kowloon Bay Fund II"
              onOpen={() => {}}
              labels={zh ? { pages: (n) => `${n} 页`, open: '打开' } : undefined}
            />
            <PeopleResult
              eyebrow={t('Invited · NDA not signed', '已邀请 · 未签 NDA')}
              total={4}
              people={[
                { id: 'a', name: 'Anna Kowalski', meta: t('9 days', '9 天') },
                { id: 'w', name: '王志远', meta: t('9 days', '9 天') },
                { id: 'j', name: 'James Park', meta: t('6 days', '6 天') },
              ]}
              onShowAll={() => {}}
              labels={zh ? { showAll: (n) => `查看全部 ${n} 位` } : undefined}
            />
            <DraftResult
              eyebrow={t('Draft email · to 4 investors', '邮件草稿 · 发给 4 位投资人')}
              onEdit={() => {}}
              onCopy={() => {}}
              labels={zh ? { edit: '编辑', copy: '复制', copied: '已复制' } : undefined}
            >
              {t(
                'Dear Anna, a reminder that the Harbour Series A NDA is ready to sign. It takes about two minutes…',
                'Anna 您好，提醒一下 Harbour A 轮的 NDA 已可签署，大约只需两分钟…',
              )}
            </DraftResult>
          </div>
        </Section>

        <Section title={t('Confirmation card', '确认卡片')}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              {confirmationCard}
              <button type="button" className="w-fit cursor-pointer text-meta text-fg-secondary underline" onClick={() => setConfirm('pending')}>
                {t('Reset', '重置')}
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <ConfirmationCard title={t('Send NDA reminders to 4 investors?', '给 4 位投资人发送 NDA 提醒？')} state="confirming" confirmLabel={t('Send 4 reminders', '发送 4 条提醒')} onConfirm={() => {}} secondaryLabel={t('Review drafts', '查看草稿')} />
              <ConfirmationCard title={t('Send NDA reminders to 4 investors?', '给 4 位投资人发送 NDA 提醒？')} state="done" doneText={t('4 reminders sent', '已发送 4 条提醒')} confirmLabel="" onConfirm={() => {}} />
              <ConfirmationCard
                title={t('Share Cap table.xlsx with Anna Kowalski', '把 Cap table.xlsx 分享给 Anna Kowalski')}
                state="dismissed"
                confirmLabel=""
                onConfirm={() => {}}
                labels={zh ? { dismissed: '未发送' } : undefined}
              />
            </div>
          </div>
        </Section>

        <Section title={t('Composer', '输入框')}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <Panel label={t('Idle · the scope tag says what the Agent can see', '空闲 · 范围标签说明 Agent 能看到什么')}>
              <Composer scope={scope} scopes={[{ id: 'h', label: scope }, { id: 'k', label: 'Kowloon Bay Fund II' }]} onScopeChange={() => {}} onAddFiles={() => {}} commands={commands} labels={composerLabels} />
            </Panel>
            <Panel label={t('With attachments', '带附件')}>
              <Composer
                scope={scope}
                defaultValue={t('Turn this into a website article for subscribers', '把这个改写成给订阅者看的网站文章')}
                attachments={files}
                onAddFiles={(fs) => setFiles((cur) => [...cur, ...fs.map((f) => ({ id: `${f.name}-${f.size}`, name: f.name, size: f.size }))])}
                onRemoveAttachment={(id) => setFiles((cur) => cur.filter((f) => f.id !== id))}
                labels={composerLabels}
              />
            </Panel>
            <Panel label={t('Writing · Send becomes Stop', '输出中 · 发送变为停止')}>
              <Composer scope={scope} writing onStop={() => {}} onAddFiles={() => {}} labels={composerLabels} />
            </Panel>
            <Panel label={t('/ commands', '/ 命令')} className="pt-[196px]">
              <Composer scope={scope} defaultValue="/" commands={commands} onAddFiles={() => {}} labels={composerLabels} />
            </Panel>
            <Panel label={t('Read-only', '只读')}>
              <Composer scope={scope} readOnly defaultValue={t('Only the case team can ask here.', '只有案件团队可以在这里提问。')} labels={composerLabels} />
            </Panel>
            <Panel label={t('Disabled', '不可用')}>
              <Composer scope={scope} disabled labels={composerLabels} />
            </Panel>
          </div>
        </Section>

        <Section title={t('Ops · right drawer 480', 'Ops · 右侧抽屉 480')}>
          <DrawerDemo zh={zh} stepLabels={stepLabels} composerLabels={composerLabels} />
        </Section>
      </div>
    );
  },
};

function OpenOnMount() {
  const { open } = useSidePanel();
  useEffect(() => open('agent'), [open]);
  return null;
}

function DrawerDemo({
  zh,
  stepLabels,
  composerLabels,
}: {
  zh: boolean;
  stepLabels: Parameters<typeof AgentSteps>[0]['labels'];
  composerLabels: Parameters<typeof Composer>[0]['labels'];
}) {
  const t = (en: string, cn: string) => (zh ? cn : en);
  return (
    <SidePanelProvider>
      <OpenOnMount />
      <ReopenButton label={t('Open the Agent', '打开 Agent')} />
      <div className="flex h-[560px] overflow-hidden rounded-lg border border-rule">
        <div className="flex-1 bg-sunk p-6 text-meta text-fg-secondary">{t('Ops page', 'Ops 页面')}</div>
        <SidePanelSlot />
      </div>
      <AgentDrawer
        context={t('Wang family · Global Talent', '王氏家庭 · 全球人才签证')}
        closeLabel={t('Close', '关闭')}
        composer={<Composer scope={t('This project', '本项目')} showAsTask={false} labels={{ ...composerLabels, placeholder: t('Ask about this project…', '问问这个项目…') }} />}
      >
        <Conversation aria-label={t('Conversation', '对话')}>
          <UserMessage>{t('Which facts are still in conflict?', '还有哪些事实有冲突？')}</UserMessage>
          <AgentMessage
            steps={
              <AgentSteps
                labels={stepLabels}
                seconds={6}
                steps={[
                  { id: '1', label: t('Checked facts in conflict', '检查冲突事实'), detail: t('1 open', '1 条未决') },
                  { id: '2', label: t('Read the passport and birth certificate', '阅读护照和出生证明'), detail: t('2 documents', '2 份文档') },
                ]}
              />
            }
            footer={
              <button type="button" className="flex h-9 w-full cursor-pointer items-center justify-between rounded-md bg-sunk px-3 text-small text-fg hover:bg-well">
                {t('Open the conflict in Review', '在审阅中打开这条冲突')}
                <span aria-hidden>→</span>
              </button>
            }
          >
            {t(
              'One: Wang Zhiyuan’s date of birth. The passport says 14 March 1983 and the birth certificate says 13 March.',
              '一条：王志远的出生日期。护照写 1983 年 3 月 14 日，出生证明写 3 月 13 日。',
            )}
            <Citation n={3} source={sources(zh)[3]!} labels={zh ? { source: (n) => `来源 ${n}`, page: (p) => `第 ${p} 页`, openAtPage: (p) => `打开第 ${p} 页` } : undefined} />
          </AgentMessage>
        </Conversation>
      </AgentDrawer>
    </SidePanelProvider>
  );
}

function ReopenButton({ label }: { label: string }) {
  const { openId, open } = useSidePanel();
  if (openId) return null;
  return (
    <button type="button" className="mb-3 w-fit cursor-pointer text-meta text-fg underline" onClick={() => open('agent')}>
      {label}
    </button>
  );
}
