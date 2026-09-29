# Changelog

## 1.0.0-alpha.1 (2026-09-29)

- Builds without DOM.Iterable (Citation Tab order); needs @cosxai/ui
  1.0.0-alpha.5.

## 1.0.0-alpha.0 (2026-09-29)

First release: the Agent conversation of the COSX Design System 3.0
(design.cosx.co/pattern-agent), on @cosxai/ui.

- Markdown: GFM tables, maths (KaTeX), code blocks with lazy Shiki
  highlighting and copy, safe element set, link resolver; `markdown.css`.
- Citations: `[[n]]` / `[^n]` become numbered chips; hover or focus shows
  the source card (title, location, quote, "Open at page 14"), rendered
  on top of the page so drawers never clip it. ScopeLine, SourcesList.
- Conversation: user, Agent and staff messages (writing, stopped,
  failed), AgentSteps, result cards (documents, people, task, draft),
  ConfirmationCard and HandOver, Composer (attachments, scope, commands,
  send as a task), AgentDrawer.
