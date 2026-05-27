import { useState } from "react";
import {
  Button,
  Card,
  Tag,
  CountBadge,
  Kbd,
  Avatar,
  Input,
  Textarea,
  Checkbox,
  ToggleSwitch,
} from "@cosxai/ui";

// One scrollable page documenting all foundation primitives. Each
// section: one-line description + live demo. Keeps the kit's surface
// area scannable in a single tab without a separate page per
// component (the Phase 3 primitives are small enough that
// per-component pages would be more noise than signal).

export function PrimitivesPage() {
  const [checked, setChecked] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [text, setText] = useState("");

  return (
    <>
      <h1>Foundation primitives</h1>
      <p className="docs-summary">
        The small building blocks. Each backs onto the same token
        palette, so a single accent override or chrome flip cascades
        through everything below.
      </p>

      <h2>Button</h2>
      <Demo>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="icon" aria-label="icon">☆</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </Demo>

      <h2>Card</h2>
      <Demo column>
        <Card
          header={<span className="ck-eyebrow">Card · header eyebrow</span>}
          headerActions={<Button variant="ghost">Action</Button>}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">Save</Button>
            </div>
          }
        >
          <p style={{ margin: 0 }}>
            Card body with the default 20 px padding. Footer bar
            tones down in seamless chrome to a transparent backdrop.
          </p>
        </Card>
      </Demo>

      <h2>Tag</h2>
      <Demo>
        <Tag>Neutral</Tag>
        <Tag tone="accent">Active</Tag>
        <Tag tone="success">Accepted</Tag>
        <Tag tone="warning">Pending</Tag>
        <Tag tone="critical">Revoked</Tag>
        <Tag tone="accent" filled>
          Filled accent
        </Tag>
        <Tag tone="critical" filled>
          Filled critical
        </Tag>
      </Demo>

      <h2>CountBadge</h2>
      <Demo>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          Inbox <CountBadge count={3} />
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          Alerts <CountBadge count={142} tone="critical" />
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          Tags <CountBadge count={12} tone="neutral" />
        </span>
        <span style={{ color: "var(--ck-text-tertiary)" }}>
          Empty <CountBadge count={0} /> (renders nothing)
        </span>
      </Demo>

      <h2>Kbd</h2>
      <Demo>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Kbd>Mod</Kbd>
          <Kbd>K</Kbd>
          <span style={{ color: "var(--ck-text-tertiary)", fontSize: 12 }}>
            Open command palette
          </span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Kbd>Shift</Kbd>
          <Kbd>Enter</Kbd>
          <span style={{ color: "var(--ck-text-tertiary)", fontSize: 12 }}>
            New line in composer
          </span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <span style={{ color: "var(--ck-text-tertiary)", fontSize: 12 }}>
            Navigate list
          </span>
        </span>
      </Demo>
      <p style={{ fontSize: 13, color: "var(--ck-text-tertiary)" }}>
        "Mod" auto-translates to ⌘ on Mac, Ctrl elsewhere. Pass any
        other string verbatim.
      </p>

      <h2>Avatar</h2>
      <Demo>
        <Avatar name="Ben Z" />
        <Avatar name="Ada Lovelace" size={48} />
        <Avatar
          name="Image avatar"
          src="https://avatars.githubusercontent.com/u/1?v=4"
          size={48}
        />
      </Demo>

      <h2>Input + Textarea</h2>
      <Demo column>
        <Input
          label="Display name"
          placeholder="e.g. Ben Z"
          helper="Shown on every comment you post."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Input
          label="Email"
          placeholder="you@cosx.co"
          error="That's not a valid address."
        />
        <Textarea
          label="Note"
          placeholder="What changed?"
          helper="Markdown supported."
        />
      </Demo>

      <h2>Checkbox + ToggleSwitch</h2>
      <Demo column>
        <Checkbox checked={checked} onChange={setChecked} label="Include closed" />
        <Checkbox checked onChange={() => {}} disabled label="Disabled (checked)" />
        <ToggleSwitch
          checked={toggle}
          onChange={setToggle}
          label="Enable notifications"
        />
        <ToggleSwitch checked onChange={() => {}} disabled label="Disabled toggle" />
      </Demo>
      <p style={{ fontSize: 13, color: "var(--ck-text-tertiary)" }}>
        Both replace the native control — accent-bordered check / iOS-
        style switch. Off-state contrast holds up against both light
        and dark backgrounds (lesson from the parent project's QA pass).
      </p>
    </>
  );
}

function Demo({
  children,
  column,
}: {
  children: React.ReactNode;
  column?: boolean;
}) {
  return (
    <div
      style={{
        padding: 16,
        background: "var(--ck-bg-surface)",
        border: "1px solid var(--ck-border-subtle)",
        borderRadius: "var(--ck-radius-md)",
        marginBottom: 24,
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        flexDirection: column ? "column" : "row",
        alignItems: column ? "stretch" : "center",
      }}
    >
      {children}
    </div>
  );
}
