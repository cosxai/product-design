import { Button } from "@cosxai/ui";

export function ButtonPage() {
  return (
    <>
      <h1>Button</h1>
      <p className="docs-summary">
        Four variants — primary, secondary, ghost, icon. Backed by{" "}
        <code>.ck-btn</code> styles that read the token palette so a
        button looks correct under any theme + chrome combo.
      </p>

      <h2>Variants</h2>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="icon" aria-label="icon">
          ☆
        </Button>
      </div>

      <h2>Disabled</h2>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button variant="primary" disabled>Primary</Button>
        <Button variant="secondary" disabled>Secondary</Button>
        <Button variant="ghost" disabled>Ghost</Button>
      </div>
    </>
  );
}
