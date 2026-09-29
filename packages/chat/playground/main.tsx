import './app.css';

import { StrictMode, type JSX } from 'react';
import { createRoot } from 'react-dom/client';

// ?c=<demo id>&mode=ink&lang=zh
// Every playground/demos/*.tsx exporting `demo = { id, title, render }` is
// picked up here — adding a demo never touches this file.
type Demo = { id: string; title: string; render: (props: { zh: boolean }) => JSX.Element };
const modules = import.meta.glob<{ demo?: Demo }>('./demos/*.tsx', { eager: true });
const demos = Object.values(modules)
  .map((m) => m.demo)
  .filter((d): d is Demo => Boolean(d));

const params = new URLSearchParams(location.search);
if (params.get('mode') === 'ink') document.documentElement.setAttribute('data-mode', 'ink');
const zh = params.get('lang') === 'zh';
document.documentElement.lang = zh ? 'zh-CN' : 'en';

const id = params.get('c');
const current = demos.find((d) => d.id === id);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="mx-auto flex max-w-[1180px] flex-col gap-10 p-10">
      {current ? (
        <current.render zh={zh} />
      ) : (
        <nav className="flex flex-col gap-2">
          {demos.map((d) => (
            <a key={d.id} href={`?c=${d.id}`} className="text-fg">
              {d.title}
            </a>
          ))}
        </nav>
      )}
    </main>
  </StrictMode>,
);
