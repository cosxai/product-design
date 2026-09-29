/**
 * @cosxai/chat — the Agent conversation of the COSX Design System 3.0
 * (design.cosx.co/pattern-agent, Metaroom spec §14): messages, steps,
 * citations, result and confirmation cards, the composer, markdown.
 * Built on @cosxai/ui; the host maps its own agent events onto these parts.
 */
export { Markdown, type MarkdownLabels, type MarkdownProps } from './markdown/Markdown';
export { CodeBlock, InlineCode, type CodeBlockLabels, type CodeBlockProps } from './markdown/CodeBlock';
export { type LinkResolver } from './markdown/link-target';
export { remarkCitations, type RemarkCitationsOptions } from './markdown/remark-citations';
export { Citation, citationLocation, defaultCitationLabels, type CitationLabels, type CitationProps, type CitationSource, type Citations } from './Citation';
export { ScopeLine, SourcesList, type ScopeLineProps, type SourcesListProps } from './Sources';
export { AgentDrawer, type AgentDrawerProps } from './conversation';
export { AgentSteps, type AgentStep, type AgentStepState, type AgentStepsLabels, type AgentStepsProps } from './conversation';
export { Composer, type ComposerAttachment, type ComposerCommand, type ComposerLabels, type ComposerMessage, type ComposerProps, type ComposerScope } from './conversation';
export { ConfirmationCard, HandOver, type ConfirmationCardLabels, type ConfirmationCardProps, type ConfirmationState, type HandOverProps } from './conversation';
export { AgentMessage, Conversation, StaffMessage, UserMessage, type AgentMessageLabels, type AgentMessageProps, type AgentMessageState, type MessageAttachment, type StaffMessageProps, type UserMessageProps } from './conversation';
export { AgentAvatar, AttachmentChip, PersonAvatar, SystemLine, type AttachmentChipProps, type SystemLineProps } from './conversation';
export { DocumentResult, DraftResult, PeopleResult, ResultCard, TaskResult, type DocumentResultProps, type DraftResultProps, type PeopleResultProps, type ResultCardProps, type ResultPerson, type TaskResultProps } from './conversation';
