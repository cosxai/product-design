import { Breadcrumb } from "@cosxai/ui";

export function BreadcrumbPage() {
  return (
    <>
      <h1>Breadcrumb</h1>
      <p className="docs-summary">
        Mono-uppercase crumb chain — what you see in the topbar of
        every docs page. Items are plain labels or{" "}
        <code>CrumbItem</code> objects with click handlers / custom
        render. Router-agnostic — wrap segments in your own router's
        link primitive when you want navigation.
      </p>

      <h2>Strings</h2>
      <div
        style={{
          padding: "12px 16px",
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
          borderRadius: "var(--ck-radius-md)",
          marginBottom: 16,
        }}
      >
        <Breadcrumb items={["Metaroom", "Shares", "Sent by me"]} />
      </div>

      <h2>With click handlers</h2>
      <div
        style={{
          padding: "12px 16px",
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
          borderRadius: "var(--ck-radius-md)",
          marginBottom: 16,
        }}
      >
        <Breadcrumb
          items={[
            { label: "Documents", onClick: () => alert("Documents") },
            { label: "Sales", onClick: () => alert("Sales") },
            { label: "MSA-TS-RAYMOND" },
          ]}
        />
      </div>

      <h2>Source</h2>
      <pre><code>{`<Breadcrumb
  items={[
    { label: "Documents", onClick: () => navigate("/documents") },
    { label: "Sales", onClick: () => navigate("/documents/sales") },
    { label: "MSA-TS-RAYMOND" },        // last = current = no link
  ]}
  accessory={<DocMetaPopoverButton />}  // optional right-side slot
/>`}</code></pre>
    </>
  );
}
