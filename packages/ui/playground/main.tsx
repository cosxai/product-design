import './app.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { CoreDemo } from './demos/core';

// ?c=<page>&mode=ink&lang=zh
const params = new URLSearchParams(location.search);
if (params.get('mode') === 'ink') document.documentElement.setAttribute('data-mode', 'ink');
const zh = params.get('lang') === 'zh';
document.documentElement.lang = zh ? 'zh-CN' : 'en';

const pages: Record<string, () => React.JSX.Element> = { core: () => <CoreDemo zh={zh} /> };
const Page = pages[params.get('c') ?? 'core'] ?? pages.core!;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="mx-auto flex max-w-[1180px] flex-col gap-10 p-10">
      <Page />
    </main>
  </StrictMode>,
);
