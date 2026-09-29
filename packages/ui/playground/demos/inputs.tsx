import { FileText, FolderLock, Users } from 'lucide-react';
import { useState } from 'react';

import { AsyncSelect } from '../../src/components/AsyncSelect';
import { ChoiceCards } from '../../src/components/ChoiceCards';
import { CodeInput } from '../../src/components/CodeInput';
import { CopyField } from '../../src/components/CopyField';
import { DateInput, FuzzyDateInput } from '../../src/components/DateInput';
import { Field } from '../../src/components/Field';
import type { ListItem } from '../../src/components/inputs-listbox';
import { MentionInput } from '../../src/components/MentionInput';
import { RecipientsInput, type Recipient } from '../../src/components/RecipientsInput';
import { SearchField } from '../../src/components/SearchField';
import { SegmentedControl } from '../../src/components/SegmentedControl';
import { Row, Section } from './Row';

export const demo = { id: 'inputs', title: 'Advanced inputs — search, copy, segmented, choice cards, dates, code, async select, recipients, mentions', render: InputsDemo };

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('aborted', 'AbortError'));
    });
  });

function people(zh: boolean): ListItem[] {
  return [
    { value: 'hv', label: 'Harbour Ventures', meta: zh ? '客户 · 3 个项目' : 'Customer · 3 projects' },
    { value: 'hw', label: 'Hardwick Family Office', meta: zh ? '客户' : 'Customer' },
    { value: 'ha', label: 'Hana Abe', meta: 'hana@harbour.example' },
    { value: 'lw', label: 'Li Wei', meta: 'li.wei@halden.example' },
    { value: 'wz', label: '王志远', meta: 'wang@halden.example' },
  ];
}

export function InputsDemo({ zh }: { zh: boolean }) {
  const t = (en: string, cn: string) => (zh ? cn : en);
  // One control holds focus: #mention shows the mention list open instead of the others.
  const mentionShot = location.hash === '#mention';
  const list = people(zh);
  const search = async (q: string, signal: AbortSignal) => {
    await wait(500, signal);
    return list.filter((p) => p.label.toLowerCase().includes(q.toLowerCase()));
  };
  const [view, setView] = useState('list');
  const [plan, setPlan] = useState('team');
  const [date, setDate] = useState<string | null>('2019-03-12');
  const [chosen, setChosen] = useState<ListItem | null>(list[0] ?? null);
  const [to, setTo] = useState<Recipient[]>([
    { email: 'hana@harbour.example', name: 'Hana Abe', status: 'valid' },
    { email: 'ops@newco.example', status: 'unverified' },
    { email: 'li.wei@halden', status: 'invalid' },
  ]);

  return (
    <>
      <Section title={t('Search field', '搜索框')}>
        <div className="grid grid-cols-2 gap-6">
          <SearchField
            shortcut
            aria-label={t('Search this folder', '搜索此文件夹')}
            placeholder={t('Search this folder', '搜索此文件夹')}
            onSearch={async (q, signal) => {
              await wait(600, signal);
              return q.length * 3;
            }}
            formatCount={(n) => (zh ? `${n} 个结果` : `${n} results`)}
          />
          <SearchField aria-label={t('Search', '搜索')} defaultValue="passport" onSearch={async () => 12} formatCount={(n) => (zh ? `${n} 个结果` : `${n} results`)} />
        </div>
      </Section>

      <Section title={t('Copy field', '复制框')}>
        <div className="grid grid-cols-2 gap-6">
          <CopyField label={t('Share link', '分享链接')} value="https://portal.halden.example/s/8fK2-q1Lm" hint={t('Anyone with the link can view.', '拿到链接的人都能查看。')} {...(zh ? { copyLabel: '复制', copiedLabel: '已复制', manualHint: '按 ⌘C 复制' } : {})} />
          <CopyField label={t('API token', 'API 令牌')} value="cx_live_2mQ9…a7Lk" size="sm" {...(zh ? { copyLabel: '复制', copiedLabel: '已复制', manualHint: '按 ⌘C 复制' } : {})} />
        </div>
      </Section>

      <Section title={t('Segmented control', '分段控件')}>
        <Row label={t('md · a disabled segment says why', 'md · 禁用项说明原因')}>
          <SegmentedControl
            aria-label={t('View', '视图')}
            value={view}
            onChange={setView}
            segments={[
              { value: 'list', label: t('List', '列表') },
              { value: 'board', label: t('Board', '看板') },
              { value: 'timeline', label: t('Timeline', '时间线') },
              { value: 'map', label: t('Map', '地图'), disabled: true, reason: t('Needs addresses on the records', '需要记录里有地址') },
            ]}
          />
          <SegmentedControl
            aria-label={t('Range', '范围')}
            size="sm"
            defaultValue="30"
            segments={[
              { value: '7', label: t('7 days', '7 天') },
              { value: '30', label: t('30 days', '30 天') },
              { value: 'all', label: t('All', '全部') },
            ]}
          />
        </Row>
      </Section>

      <Section title={t('Choice cards', '选项卡片')}>
        <div className="max-w-[720px]">
          <ChoiceCards
            aria-label={t('Who can open it', '谁能打开')}
            columns={3}
            value={plan}
            onChange={setPlan}
            choices={[
              { value: 'private', title: t('Only me', '仅自己'), description: t('Nobody else sees it.', '其他人看不到。'), icon: <FolderLock size={16} aria-hidden /> },
              { value: 'team', title: t('The team', '团队'), description: t('Everyone in this workspace.', '工作区里的所有人。'), icon: <Users size={16} aria-hidden /> },
              { value: 'link', title: t('Anyone with the link', '拿到链接的人'), description: t('Turned off by an admin.', '已被管理员关闭。'), icon: <FileText size={16} aria-hidden />, disabled: true },
            ]}
          />
        </div>
      </Section>

      <Section title={t('Dates', '日期')}>
        <div className="grid grid-cols-3 gap-6">
          <DateInput label={t('Date of birth', '出生日期')} value={date} onChange={setDate} hint={t('12/03/2019, 2019-03-12 or 12 Mar 2019', '12/03/2019、2019-03-12 或 2019年3月12日')} />
          <DateInput label={t('Visa expiry', '签证到期')} error={t('Use a date like 12 Mar 2019 or 2019-03-12.', '请按 2019-03-12 或 2019年3月12日 的格式填写。')} />
          <FuzzyDateInput label={t('Date of entry', '入境日期')} defaultValue="2019-03" hint={t('Year required; day and month if known.', '年份必填，知道的话再填月和日。')} {...(zh ? { labels: { day: '日', month: '月', year: '年', precision: '精度' } } : {})} />
        </div>
        <Row label={t('Calendar · open', '日历 · 展开')}>
          <div className="h-[360px] w-72">
            <DateInput label={t('Start date', '开始日期')} defaultValue="2026-09-29" defaultOpen={!mentionShot} />
          </div>
        </Row>
      </Section>

      <Section title={t('Verification code', '验证码')}>
        <div className="flex flex-wrap gap-12">
          <Field label={t('Code from your email', '邮件里的验证码')} hint={t('Six digits. It lasts 10 minutes.', '六位数字，10 分钟内有效。')}>
            <CodeInput resendIn={42} onResend={() => undefined} {...(zh ? { resendLabel: '重新发送', formatCountdown: (s: number) => `${s} 秒后可重发` } : {})} />
          </Field>
          <Field label={t('Code', '验证码')} error={t('That code is wrong. Check the latest email.', '验证码不对，请看最新一封邮件。')}>
            <CodeInput value="482" invalid />
          </Field>
        </div>
      </Section>

      <Section title={t('Async select · recipients', '异步选择 · 收件人')}>
        <div className="grid grid-cols-2 gap-6">
          <Field label={t('Customer', '客户')}>
            <AsyncSelect search={search} value={chosen} onChange={setChosen} onCreate={(q) => ({ value: q, label: q })} />
          </Field>
          <Field label={t('Send to', '发送给')} hint={t('Paste a list; commas and new lines split it.', '可粘贴列表，逗号和换行会分开。')}>
            <RecipientsInput value={to} onChange={setTo} search={search} prefix={t('To', '收件人')} />
          </Field>
        </div>
        <Row label={t('Searching → results, create row', '搜索中 → 结果、新建行')}>
          <div className="h-[300px] w-80">
            <Field label={t('Customer', '客户')}>
              <AsyncSelect search={search} onCreate={(q) => ({ value: q, label: q })} defaultQuery={mentionShot ? '' : 'Ha'} />
            </Field>
          </div>
        </Row>
      </Section>

      <Section title={t('Mentions', '提及')}>
        <div className="h-[320px] max-w-[560px]">
          <Field label={t('Comment', '评论')}>
            <MentionInput
              people={list}
              defaultValue={t('Can you confirm the passport date, @H', '能确认一下护照日期吗，@H')}
              onSubmit={() => undefined}
              autoFocus={mentionShot}
              {...(zh ? { submitLabel: '发送', submitHint: '⌘Enter 发送' } : {})}
            />
          </Field>
        </div>
      </Section>
    </>
  );
}
