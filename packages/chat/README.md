# @cosxai/chat

The Agent conversation of the COSX Design System 3.0 — the parts shared by
the portal's Conversation and the Ops Agent drawer: messages, steps,
citations, result cards, confirmation cards, the composer and markdown.
Design: [design.cosx.co/pattern-agent](https://design.cosx.co/pattern-agent).

Presentation only: the host maps its agent's events (tool calls, streamed
text, approvals) onto these components.

```css
@import "tailwindcss";
@import "@cosxai/ui/theme.css";
@import "@cosxai/ui/styles.css";
@import "@cosxai/chat/markdown.css";
@source "../node_modules/@cosxai/ui/src";
@source "../node_modules/@cosxai/chat/src";
```

Published under the `next` dist-tag during 1.0 alphas. See NOTICE for the
Apache-2.0 code adapted from Craft Agents.
