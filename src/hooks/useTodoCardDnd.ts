import { useEffect, useRef, useState } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import type { Todo } from '../types';

export type CardDragState =
  | { type: 'idle' }
  | { type: 'dragging' }
  | { type: 'over'; closestEdge: Edge | null };

/**
 * Attaches draggable + drop-target behaviour to a todo card element.
 * Returns a ref to attach to the card div and the current drag state.
 *
 * Drag is disabled when filters/search are active (isFiltered = true)
 * because the visual order doesn't match the stored order in that case.
 */
export function useTodoCardDnd(todo: Todo, isFiltered: boolean) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<CardDragState>({ type: 'idle' });

  useEffect(() => {
    const el = cardRef.current;
    if (!el || isFiltered) return;

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({
          type: 'todo',
          todoId: todo.id,
          columnId: todo.columnId,
        }),
        onDragStart: () => setDragState({ type: 'dragging' }),
        onDrop: () => setDragState({ type: 'idle' }),
      }),

      dropTargetForElements({
        element: el,
        getData: ({ input, element }) =>
          attachClosestEdge(
            { type: 'todo-target', todoId: todo.id, columnId: todo.columnId },
            { input, element, allowedEdges: ['top', 'bottom'] },
          ),
        canDrop: ({ source }) =>
          source.data.type === 'todo' && source.data.todoId !== todo.id,
        onDrag: ({ self }) =>
          setDragState({ type: 'over', closestEdge: extractClosestEdge(self.data) }),
        onDragLeave: () => setDragState({ type: 'idle' }),
        onDrop: () => setDragState({ type: 'idle' }),
      }),
    );
  }, [todo.id, todo.columnId, isFiltered]);

  return { cardRef, dragState };
}
