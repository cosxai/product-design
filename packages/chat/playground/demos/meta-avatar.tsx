import { useState, type CSSProperties } from 'react';

import { MetaAvatar, type MetaAvatarState } from '../../src';

const STATES: MetaAvatarState[] = ['idle', 'listening', 'thinking', 'talking', 'done', 'error', 'sleeping'];

export const demo = { id: 'meta-avatar', title: 'MetaAvatar — seven states, three forms, brand colour', render: MetaAvatarDemo };

export function MetaAvatarDemo() {
  const [brand, setBrand] = useState(false);
  return (
    <div className="flex flex-col gap-8" style={brand ? ({ '--brand-field': '#D6E4DA' } as CSSProperties) : undefined}>
      <button type="button" className="self-start" onClick={() => setBrand(!brand)}>
        {brand ? 'COSX yellow' : 'Workspace brand (green)'}
      </button>
      <div className="flex flex-wrap gap-6">
        {STATES.map((s) => (
          <div key={s} className="flex flex-col items-center gap-2 text-meta text-fg-secondary">
            <MetaAvatar state={s} size={96} />
            {s}
          </div>
        ))}
      </div>
      {[72, 32, 20].map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-4">
          <span className="w-10 text-meta text-fg-secondary">{size}</span>
          {STATES.map((s) => (
            <MetaAvatar key={s} state={s} size={size} track={false} />
          ))}
        </div>
      ))}
    </div>
  );
}
