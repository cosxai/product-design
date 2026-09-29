import { Share2, Star, Upload } from 'lucide-react';

import { Badge, Button, Card, Figure, Icon, IconButton, Logo, Marker, MetaLabel, Tag } from '../../src';
import { Row, Section } from './Row';

const T = (zh: boolean, en: string, cn: string) => (zh ? cn : en);

export function CoreDemo({ zh }: { zh: boolean }) {
  const t = (en: string, cn: string) => T(zh, en, cn);
  return (
    <>
      <Section title={t('Button', '按钮')}>
        <div className="grid grid-cols-3 gap-4">
          <Card className="flex items-center gap-3 p-8">
            <Button>{t('Publish', '发布')}</Button>
            <Button variant="secondary">{t('Preview', '预览')}</Button>
            <Button variant="ghost">{t('Cancel', '取消')}</Button>
          </Card>
          <Card ground="field" className="flex items-center gap-3 p-8">
            <Button ground="yellow">{t('Publish', '发布')}</Button>
            <Button ground="yellow" variant="secondary">
              {t('Preview', '预览')}
            </Button>
            <Button ground="yellow" variant="ghost">
              {t('Cancel', '取消')}
            </Button>
          </Card>
          <Card ground="ink" className="flex items-center gap-3 p-8">
            <Button ground="ink">{t('Publish', '发布')}</Button>
            <Button ground="ink" variant="secondary">
              {t('Preview', '预览')}
            </Button>
            <Button ground="ink" variant="ghost">
              {t('Cancel', '取消')}
            </Button>
          </Card>
        </div>
        <Row label={t('Sizes · 32 · 38 · 44', '尺寸 · 32 · 38 · 44')}>
          <Button size="sm">{t('Share', '分享')}</Button>
          <Button>{t('Share', '分享')}</Button>
          <Button size="lg">{t('Share', '分享')}</Button>
        </Row>
        <Row label={t('Types', '类型')}>
          <Button shortcut="⇧S" iconLeft={<Icon icon={Share2} />}>
            {t('Share', '分享')}
          </Button>
          <Button variant="secondary" count={12}>
            {t('Comments', '评论')}
          </Button>
          <Button variant="ghost" shortcut="Esc">
            {t('Close', '关闭')}
          </Button>
          <Button variant="danger">{t('Delete forever', '永久删除')}</Button>
          <Button variant="yellow">{t('Confirm', '确认')}</Button>
          <Button variant="ink">{t('Upload', '上传')}</Button>
        </Row>
        <Row label={t('States', '状态')}>
          <Button disabled disabledReason={t('Downloads are off for this share', '此分享已关闭下载')}>
            {t('Share', '分享')}
          </Button>
          <Button state="busy">{t('Publish', '发布')}</Button>
          <Button state="done" doneLabel={t('Published', '已发布')}>
            {t('Publish', '发布')}
          </Button>
        </Row>
      </Section>

      <Section title={t('Icon button', '图标按钮')}>
        <Row label="outline · ghost · solid · count">
          <IconButton icon={Share2} label={t('Share', '分享')} variant="outline" />
          <IconButton icon={Star} label={t('Star', '收藏')} />
          <IconButton icon={Upload} label={t('Upload', '上传')} variant="solid" />
          <IconButton icon={Share2} label={t('Comments', '评论')} variant="outline" count={140} />
        </Row>
      </Section>

      <Section title={t('Badge', '状态徽章')}>
        <div className="grid grid-cols-[140px_repeat(4,1fr)] items-center gap-y-3 text-meta text-fg-secondary">
          <span />
          <span>Default</span>
          <span>Fill</span>
          <span>Outline</span>
          <span>Dot</span>
          {(
            [
              ['attention', t('Awaiting you', '等你处理')],
              ['error', t('Overdue', '已逾期')],
              ['progress', t('In progress', '处理中')],
              ['complete', t('Delivered', '已交付')],
              ['neutral', t('Draft', '草稿')],
            ] as const
          ).flatMap(([s, w]) => [
            <span key={s}>{s}</span>,
            <span key={s + 'd'}>
              <Badge status={s}>{w}</Badge>
            </span>,
            <span key={s + 'f'}>
              <Badge status={s} appearance="fill">
                {w}
              </Badge>
            </span>,
            <span key={s + 'o'}>
              <Badge status={s} appearance="outline">
                {w}
              </Badge>
            </span>,
            <span key={s + 'dot'}>
              <Badge status={s} appearance="dot">
                {w}
              </Badge>
            </span>,
          ])}
        </div>
      </Section>

      <Section title={t('Tag, card, figure, marker, label, logo', '标签、卡片、数字、标记、标签文字、标志')}>
        <Row label="Tag">
          <Tag>PDF</Tag>
          <Tag onRemove={() => {}}>{t('Customer', '客户')}</Tag>
        </Row>
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-6">page</Card>
          <Card ground="sunk" className="p-6">
            sunk
          </Card>
          <Card ground="field" className="p-6">
            field
          </Card>
          <Card ground="ink" className="p-6">
            ink
          </Card>
        </div>
        <div className="flex items-end gap-16">
          <Figure value="117" label={t('Organisations', '家机构')} source={t('Verified September 2026', '2026 年 9 月核实')} />
          <h2 className="m-0 max-w-[16ch] text-h2 leading-[1.1] font-medium tracking-heading">
            {t('Of 47 organisations, ', '47 家机构中，')}
            <Marker>{t('20 name no regulator', '20 家未列明监管机构')}</Marker>
          </h2>
        </div>
        <Row label="MetaLabel · Logo">
          <MetaLabel rule="yellow">{t('03 / Who we serve', '03 / 我们服务谁')}</MetaLabel>
          <Logo />
          <Logo rule />
          <Logo variant="icon" />
          <Logo variant="tile" height={40} />
        </Row>
      </Section>
    </>
  );
}
