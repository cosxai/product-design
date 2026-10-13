import type { SyntheticEvent } from 'react';

const stop = (e: SyntheticEvent) => e.stopPropagation();

/**
 * Spread onto a portalled list that keeps focus outside it (a combobox's
 * results, a non-modal popover) so it scrolls with the wheel and on touch
 * inside a modal Dialog. The Dialog's scroll lock (react-remove-scroll)
 * cancels every wheel and touchmove that reaches the document from outside
 * the dialog — and a portal on <body> is outside it. Stopped here, the event
 * never reaches the lock and the list scrolls natively. A list that takes
 * focus (Select) opens modal instead and brings a lock of its own.
 */
export const scrollsInDialog = { onWheel: stop, onTouchMove: stop };
