import { useEffect, useRef, useState } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

export type ColumnDragState =
  | { type: 'idle' }
  | { type: 'dragging' }
  | { type: 'over-col'; closestEdge: Edge | null }
  | { type: 'over-list' };

/**
 * Attaches three drag-and-drop behaviours to a column:
 *   1. The whole column is draggable (via the header as the drag handle).
 *   2. The column is a drop target for other columns being reordered.
 *   3. The list area inside the column is a drop target for todo cards.
 *
 * Returns refs for the column root, header, and list — attach these to the
 * corresponding DOM elements in the Column component.
 */
export function useColumnDnd(columnId: string) {
  const columnRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<ColumnDragState>({ type: 'idle' });

  useEffect(() => {
    const colEl = columnRef.current;
    const headerEl = headerRef.current;
    const listEl = listRef.current;
    if (!colEl || !headerEl || !listEl) return;

    return combine(
      draggable({
        element: colEl,
        dragHandle: headerEl,
        getInitialData: () => ({ type: 'column', columnId }),
        onDragStart: () => setDragState({ type: 'dragging' }),
        onDrop: () => setDragState({ type: 'idle' }),
      }),

      dropTargetForElements({
        element: colEl,
        getData: ({ input, element }) =>
          attachClosestEdge(
            { type: 'column-target', columnId },
            { input, element, allowedEdges: ['left', 'right'] }
          ),
        canDrop: ({ source }) =>
          source.data.type === 'column' && source.data.columnId !== columnId,
        onDrag: ({ self }) =>
          setDragState({
            type: 'over-col',
            closestEdge: extractClosestEdge(self.data),
          }),
        onDragLeave: () => setDragState({ type: 'idle' }),
        onDrop: () => setDragState({ type: 'idle' }),
      }),

      dropTargetForElements({
        element: listEl,
        getData: () => ({ type: 'column-list', columnId }),
        canDrop: ({ source }) => source.data.type === 'todo',
        getIsSticky: () => true,
        onDragEnter: () => setDragState({ type: 'over-list' }),
        onDragLeave: () =>
          setDragState((prev) =>
            prev.type === 'over-list' ? { type: 'idle' } : prev
          ),
        onDrop: () => setDragState({ type: 'idle' }),
      })
    );
  }, [columnId]);

  return { columnRef, headerRef, listRef, dragState };
}
