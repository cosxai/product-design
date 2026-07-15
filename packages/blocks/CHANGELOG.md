# Changelog

## 0.7.1 (2026-07-15)

- **fix**: defensive array guards throughout every renderer that walks a schema-declared list (`bullet-list.items`, `card-grid.cards`, `stat-grid.stats`, `timeline.steps`, `table.columns` + `.rows`, `doc-field-table.rows`, `two-column.left`/`.right` via `BlockList`, `doc-field-table.rows[].valueBlocks` via `BlockList`). Schema-drifted content — missing fields, agent-generated blocks that dropped a shape, hand-edited JSON that put a string where an array should be — now collapses the affected sub-region to empty instead of crashing the entire page render with `Cannot read properties of undefined (reading 'map')` / `d.map is not a function`. QA-reported 2026-07-15.
- **fix**: `overflow-wrap: anywhere` + `word-break: break-word` on every text-carrying block (prose, all heading levels, footer-note). Long unbroken text — checksums, URLs, storage keys — now wraps mid-string as a last resort instead of horizontally overflowing the artboard and getting clipped. Normal prose with spaces still wraps on word boundaries. QA-reported 2026-07-15.
