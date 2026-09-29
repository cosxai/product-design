// The right-hand panel of every share image: a few real components on the
// yellow field, like the home page's hero card.
import { Badge, Button, Input } from '@cosxai/ui';

const swatches = ['#FEFDFB', '#F5F2EC', '#ECE9E3', '#FFE3A0', '#FFD166', '#111111'];

export default function Specimen() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[28px] bg-yellow p-9">
      <div className="flex w-full flex-col gap-5 rounded-[20px] bg-page p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-[10px] bg-yellow">
            <img src="/assets/logo-icon.svg" alt="" className="size-8" />
          </span>
          <div>
            <div className="text-[17px] font-medium text-fg">Harbour Series A</div>
            <div className="text-[13px] text-fg-secondary">Data room · 214 documents</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge status="attention">Awaiting you</Badge>
          <Badge status="progress" appearance="outline">In progress</Badge>
          <Badge status="complete" appearance="dot">Signed</Badge>
          <Badge status="error">Overdue</Badge>
        </div>
        <Input label="Recipient" defaultValue="anna.k@harbour.vc" readOnly />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button size="sm">Send invite</Button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {swatches.map((c) => (
            <span key={c} className="h-9 rounded-[8px] border border-rule" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}
