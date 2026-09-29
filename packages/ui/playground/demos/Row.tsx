import type { ReactNode } from 'react';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 text-title font-medium">{title}</h2>
      {children}
    </section>
  );
}

export function Row({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-meta font-medium text-fg-secondary">{label}</div>
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>
    </div>
  );
}
