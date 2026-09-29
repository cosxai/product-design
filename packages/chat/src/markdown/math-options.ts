/*
 * Adapted from Craft Agents (https://github.com/craft-ai-agents/craft-agents-oss),
 * packages/ui/src/components/markdown/math-options.ts.
 * Copyright 2026 Craft Docs Ltd. Licensed under the Apache License 2.0.
 * Modified by COSINE X LTD, 2026: unchanged apart from this header.
 */

/**
 * Shared remark-math configuration for markdown rendering.
 *
 * We intentionally disable single-dollar inline math so currency strings
 * (e.g. $100, $2M–$4M) remain plain text.
 */
export const MARKDOWN_MATH_OPTIONS = {
  singleDollarTextMath: false,
} as const;
