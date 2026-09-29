import { useEffect, useMemo } from 'react';

import type { CitationLabels, Citations } from '../../src/Citation';
import { Markdown } from '../../src/markdown/Markdown';
import { ScopeLine, SourcesList } from '../../src/Sources';

// ?c=markdown · &cite=2 opens that citation's card (for screenshots).

const answerEn = `4 of the 24 invited investors haven't signed the NDA: Anna Kowalski, Wang Zhiyuan, James Park and Maria Rossi. [[1]]

Yes. Clause 7.2(c) allows transfers to a trust the shareholder controls, as long as the board is told within 10 business days. [[2]] The drag-along threshold is 75%. [[3]]

## Who still needs to sign

| Investor | Invited | Days waiting |
| --- | --- | ---: |
| Anna Kowalski | 12 Sep | 9 |
| Wang Zhiyuan | 12 Sep | 9 |
| James Park | 15 Sep | 6 |
| Maria Rossi | 19 Sep | 2 |

- [x] Checked NDA status
- [ ] Send reminders — *needs your confirmation*
- ~~Call Maria~~ hold until Friday

> A Permitted Transferee includes a trust of which the Shareholder is the settlor.

Pro-rata amount for a holder of \`1,200\` shares, at $2M–$4M round size:

$$
a_i = \\frac{s_i}{\\sum_j s_j} \\times R
$$

\`\`\`ts
const unsigned = investors.filter((i) => !i.ndaSignedAt);
await remind(unsigned, { template: 'nda' });
\`\`\`

See [the NDA template](cosx://document/nda-template) or [the data-room guide](https://design.cosx.co/pattern-agent). A number with no source stays text: [[9]].`;

const answerZh = `24 位受邀投资人中有 4 位还没签保密协议：Anna Kowalski、王志远、James Park、Maria Rossi。[[1]]

允许。第 7.2(c) 条允许转让给股东控制的信托，前提是 10 个工作日内通知董事会。[[2]] 领售权门槛为 75%。[[3]]

## 还需要签署的人

| 投资人 | 邀请日期 | 已等待（天） |
| --- | --- | ---: |
| Anna Kowalski | 9 月 12 日 | 9 |
| 王志远 | 9 月 12 日 | 9 |
| James Park | 9 月 15 日 | 6 |
| Maria Rossi | 9 月 19 日 | 2 |

- [x] 已核对保密协议状态
- [ ] 发送提醒——*需要你确认*
- ~~打电话给 Maria~~ 等到周五

> 许可受让人包括股东作为委托人设立的信托。

持有 \`1,200\` 股的投资人按比例可认购的金额（本轮 $2M–$4M）：

$$
a_i = \\frac{s_i}{\\sum_j s_j} \\times R
$$

\`\`\`ts
const unsigned = investors.filter((i) => !i.ndaSignedAt);
await remind(unsigned, { template: 'nda' });
\`\`\`

参见[保密协议模板](cosx://document/nda-template)或[数据室指南](https://design.cosx.co/pattern-agent)。没有来源的编号保持原样：[[9]]。`;

const labelsZh: CitationLabels = {
  source: (n) => `来源 ${n}`,
  page: (p) => `第 ${p} 页`,
  openAtPage: (p) => `在第 ${p} 页打开`,
  open: '打开来源',
};

function MarkdownDemo({ zh }: { zh: boolean }) {
  const citations = useMemo<Citations>(
    () => ({
      1: { title: zh ? '联系人' : 'Contacts', location: 'Harbour Series A', onOpen: () => console.log('open 1') },
      2: {
        title: zh ? '股东协议 v3' : 'Shareholder agreement v3',
        page: 14,
        excerpt: zh
          ? '……许可受让人包括股东作为委托人设立的信托，但须在十个工作日内通知董事会……'
          : '…a Permitted Transferee includes a trust of which the Shareholder is the settlor, provided that notice is given to the Board within ten Business Days…',
        onOpen: () => console.log('open 2'),
      },
      3: { title: zh ? '股东协议 v3' : 'Shareholder agreement v3', page: 15, onOpen: () => console.log('open 3') },
    }),
    [zh],
  );
  const labels = zh ? labelsZh : undefined;
  const resolveLink = useMemo(() => (href: string) => (href.startsWith('cosx://') ? () => console.log('in-app', href) : undefined), []);

  useEffect(() => {
    const n = new URLSearchParams(location.search).get('cite');
    if (n) document.querySelector<HTMLElement>(`[data-citation="${n}"]`)?.focus();
  }, []);

  return (
    <>
      <section className="flex max-w-[640px] flex-col gap-3">
        <h1 className="m-0 text-title font-medium tracking-heading">{zh ? 'Markdown 与引用' : 'Markdown and citations'}</h1>
        <p className="m-0 text-small text-fg-secondary">{zh ? '正文 15px（中文 16/1.8），Agent 回答。' : 'Body 15px (Chinese 16/1.8), an Agent answer.'}</p>
      </section>
      <article className="flex max-w-[640px] flex-col gap-3">
        <Markdown
          citations={citations}
          citationLabels={labels}
          resolveLink={resolveLink}
          labels={zh ? { copy: '复制代码', copied: '已复制', plainText: '纯文本', task: '任务' } : undefined}
        >
          {zh ? answerZh : answerEn}
        </Markdown>
        <SourcesList citations={citations} labels={labels} label={zh ? '来源' : 'Sources'} />
        <ScopeLine count={3} scope={zh ? '仅限 Harbour Series A' : 'Harbour Series A only'} sourcesLabel={zh ? (n) => `${n} 个来源` : undefined} />
      </article>
      <section className="flex max-w-[480px] flex-col gap-3 rounded-lg border border-rule p-5">
        <p className="m-0 text-meta font-medium text-fg-secondary">{zh ? '产品界面 14px（size="ui"）' : 'Product surface 14px (size="ui")'}</p>
        <Markdown size="ui" citations={citations} citationLabels={labels}>
          {zh
            ? '**Maria Rossi** 两天前才受邀，可以先不提醒她。[[1]]\n\n1. 发送 3 封提醒\n2. 周五再看 Maria'
            : '**Maria Rossi** was invited 2 days ago; you may want to leave her out. [[1]]\n\n1. Send 3 reminders\n2. Revisit Maria on Friday'}
        </Markdown>
      </section>
    </>
  );
}

export const demo = { id: 'markdown', title: 'Markdown and citations', render: MarkdownDemo };
