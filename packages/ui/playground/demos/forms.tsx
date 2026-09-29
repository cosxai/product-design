import { Search } from 'lucide-react';
import { useState } from 'react';

import { Checkbox } from '../../src/components/Checkbox';
import { Field } from '../../src/components/Field';
import { Input } from '../../src/components/Input';
import { RadioGroup } from '../../src/components/Radio';
import { Select, type SelectOption } from '../../src/components/Select';
import { Switch } from '../../src/components/Switch';
import { Textarea } from '../../src/components/Textarea';
import { Row, Section } from './Row';

export const demo = { id: 'forms', title: 'Forms — field, input, textarea, select, checkbox, radio, switch', render: FormsDemo };

function customers(zh: boolean): SelectOption[] {
  return [
    { value: 'hv', label: 'Harbour Ventures', meta: zh ? '3 个项目' : '3 projects', group: zh ? '客户' : 'Customers' },
    { value: 'hw', label: 'Hardwick Family Office', group: zh ? '客户' : 'Customers' },
    { value: 'kb', label: 'Kowloon Bay', meta: zh ? '已归档' : 'Archived', group: zh ? '客户' : 'Customers', disabled: true },
    { value: 'lw', label: 'Li Wei', group: zh ? '员工' : 'Staff' },
    { value: 'wz', label: '王志远', group: zh ? '员工' : 'Staff' },
  ];
}

export function FormsDemo({ zh }: { zh: boolean }) {
  const t = (en: string, cn: string) => (zh ? cn : en);
  const [sel, setSel] = useState<string | undefined>('hv');
  const [doc, setDoc] = useState<string | undefined>(undefined);
  const [access, setAccess] = useState('comment');
  const [perm, setPerm] = useState({ comment: true, download: false });
  const [sw, setSw] = useState({ twoStep: true, organise: false });
  const docs = [t('Passport', '护照'), t('Visa', '签证'), 'BRP', t('Payslip', '工资单'), 'P60', t('Bank statement', '银行流水'), t('Tenancy', '租约'), t('Council tax', '市政税'), t('Utility bill', '水电账单')];

  return (
    <>
      <Section title={t('Input', '输入框')}>
        <div className="grid grid-cols-3 gap-6">
          <Input label={t('Email', '邮箱')} placeholder="li.wei@halden.co" hint={t('We send the code here.', '验证码会发到这里。')} />
          <Input label={t('Verification code', '验证码')} defaultValue="48213" error={t('That code has expired. Send a new one.', '验证码已过期，请重新发送。')} />
          <Input label={t('Commitment', '认缴金额')} prefix="£" suffix="GBP" defaultValue="1,250,000" />
          <Input label={t('Workspace', '工作区')} disabled defaultValue="Halden Capital" hint={t('Only admins can change this.', '只有管理员可以修改。')} />
          <Input label={t('Share link', '分享链接')} readOnly defaultValue="https://portal.halden.co/s/8fK2-q1Lm" />
          <Input aria-label={t('Search this folder', '搜索此文件夹')} placeholder={t('Search this folder', '搜索此文件夹')} prefix={<Search size={14} aria-hidden />} suffix={<kbd className="text-meta">/</kbd>} />
        </div>
        <Row label={t('Sizes · 32 · 38 · 44 · borderless', '尺寸 · 32 · 38 · 44 · 无边框')}>
          <div className="w-48">
            <Input aria-label="sm" size="sm" placeholder="32" />
          </div>
          <div className="w-48">
            <Input aria-label="md" placeholder="38" />
          </div>
          <div className="w-48">
            <Input aria-label="lg" size="lg" placeholder="44" />
          </div>
          <div className="w-56">
            <Input aria-label={t('Title', '标题')} variant="borderless" defaultValue={t('Harbour data room', 'Harbour 数据室')} />
          </div>
        </Row>
        <div className="max-w-[560px]">
          <Textarea label={t('Note', '备注')} placeholder={t('Say what changed and why.', '说明改了什么、为什么。')} hint={t('Visible to the customer.', '客户可见。')} />
        </div>
      </Section>

      <Section title={t('Select', '下拉选择')}>
        <div className="grid grid-cols-3 gap-6">
          <Field label={t('Customer', '客户')}>
            <Select options={customers(zh)} value={sel} onChange={setSel} />
          </Field>
          <Field label={t('Document type', '文档类型')} hint={t('Filter appears above 8 options.', '超过 8 项自动出现筛选框。')}>
            <Select options={docs} value={doc} onChange={setDoc} placeholder={t('Choose one', '请选择')} />
          </Field>
          <Field label={t('Owner', '负责人')} error={t('Choose who this is for.', '请选择负责人。')}>
            <Select options={customers(zh)} placeholder={t('Choose one', '请选择')} />
          </Field>
          <Field label={t('Region', '区域')} disabled hint={t('Set by the workspace.', '由工作区设定。')}>
            <Select options={['UK', 'EU']} value="UK" />
          </Field>
        </div>
      </Section>

      <Section title={t('Checkbox, radio, switch', '勾选、单选、开关')}>
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <div className="text-meta font-medium text-fg-secondary">{t('Checkbox · share permissions', '勾选 · 分享权限')}</div>
            <Checkbox label={t('Can comment', '可以评论')} description={t('Recipients can leave comments on documents', '收件人可以在文档上留言')} checked={perm.comment} onChange={(v) => setPerm((p) => ({ ...p, comment: v }))} />
            <Checkbox label={t('Can download originals', '可以下载原件')} description={t('Otherwise a watermarked PDF only', '否则只能下载带水印的 PDF')} checked={perm.download} onChange={(v) => setPerm((p) => ({ ...p, download: v }))} />
            <Checkbox label={t('Can forward', '可以转发')} description={t('Turned off by the upstream share', '上游分享已关闭此项')} disabled />
            <Checkbox label={t('All documents', '全部文档')} checked="indeterminate" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-meta font-medium text-fg-secondary">{t('Radio · access', '单选 · 权限')}</div>
            <RadioGroup
              aria-label={t('Access', '权限')}
              value={access}
              onChange={setAccess}
              options={[
                { value: 'view', label: t('View', '查看') },
                { value: 'comment', label: t('Comment', '评论'), description: t('View and leave comments', '查看并留言') },
                { value: 'edit', label: t('Edit', '编辑'), disabled: true, description: t('Not available on shared folders', '共享文件夹不可用') },
              ]}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-meta font-medium text-fg-secondary">{t('Switch · workspace settings', '开关 · 工作区设置')}</div>
            <Switch label={t('Require two-step verification', '要求两步验证')} description={t('Including customers', '包括客户')} checked={sw.twoStep} onChange={(v) => setSw((s) => ({ ...s, twoStep: v }))} />
            <Switch label={t('Organise new documents', '整理新文档')} description={t('Runs when new files arrive', '新文件到达时运行')} checked={sw.organise} onChange={(v) => setSw((s) => ({ ...s, organise: v }))} />
            <Switch label={t('Dropbox sync', 'Dropbox 同步')} description={t('Only admins can change this.', '只有管理员可以修改。')} disabled checked />
          </div>
        </div>
      </Section>

      <Section title={t('Select · open', '下拉选择 · 展开')}>
        <div className="h-[300px] w-72">
          <Field label={t('Customer', '客户')}>
            <Select options={customers(zh)} value="hv" defaultOpen />
          </Field>
        </div>
      </Section>
    </>
  );
}
