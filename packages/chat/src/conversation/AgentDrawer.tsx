import { SidePanel, type SidePanelProps } from '@cosxai/ui';
import type { ReactNode } from 'react';

import { AgentAvatar } from './parts';

export type AgentDrawerProps = Omit<SidePanelProps, 'id' | 'title' | 'eyebrow' | 'width' | 'footer'> & {
  /** The panel's id in the SidePanelProvider slot. @default "agent" */
  id?: string | undefined;
  /** @default "Agent" */
  title?: ReactNode;
  /** What it is working in (Wang family · Global Talent). */
  context?: ReactNode;
  /** The composer, pinned at the bottom — scoped "This project". */
  composer?: ReactNode;
};

/**
 * AgentDrawer — the Agent beside an Ops page: the right SidePanel at 480,
 * headed "Agent" and the project it is in, the conversation in the body
 * and a composer at the bottom. Open it with useSidePanel().open("agent").
 */
export function AgentDrawer({ id = 'agent', title = 'Agent', context, composer, children, ...rest }: AgentDrawerProps) {
  return (
    <SidePanel
      id={id}
      width="md"
      title={
        <span className="flex items-center gap-2.5">
          <AgentAvatar />
          <span className="min-w-0">
            <span className="block truncate">{title}</span>
            {context && <span className="block truncate text-meta font-normal text-fg-secondary">{context}</span>}
          </span>
        </span>
      }
      footer={composer}
      {...rest}
    >
      {children}
    </SidePanel>
  );
}
