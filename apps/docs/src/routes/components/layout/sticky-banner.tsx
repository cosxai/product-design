import { Button, StickyBanner } from "@cosxai/ui";

export function StickyBannerPage() {
  return (
    <>
      <h1>StickyBanner</h1>
      <p className="docs-summary">
        Eyebrow + title + actions, sticky at top of an in-page
        region. Four tones — info / warning / success / critical —
        and tunable top offset so it can sit directly under a
        topbar.
      </p>

      <StickyBanner
        tone="info"
        eyebrow="Reviewing as guest"
        title="Read-only — sign in to leave comments."
        actions={<Button variant="primary">Sign in</Button>}
        topOffset={0}
      />
      <div style={{ height: 24 }} />
      <StickyBanner
        tone="warning"
        eyebrow="Unsaved changes"
        title="You have 3 unsaved edits in this document."
        actions={
          <>
            <Button variant="ghost">Discard</Button>
            <Button variant="primary">Save</Button>
          </>
        }
        topOffset={0}
      />
      <div style={{ height: 24 }} />
      <StickyBanner
        tone="success"
        eyebrow="Signed"
        title="Both parties have signed. PDF + audit log are in your archive."
        topOffset={0}
      />
      <div style={{ height: 24 }} />
      <StickyBanner
        tone="critical"
        eyebrow="Revoked"
        title="This share was revoked by the sender."
        topOffset={0}
      />
    </>
  );
}
