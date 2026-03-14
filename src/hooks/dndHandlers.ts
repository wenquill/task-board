import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { AppState, Action } from '../types';

export type DragData = Record<string | symbol, unknown>;

/**
 * Processes a todo-card drop event and fires the appropriate `MOVE_TODO` action.
 *
 * Two drop targets are possible:
 * - **card target** — dropped on top of another card; uses edge detection to
 *   decide whether to insert before or after that card.
 * - **list target** — dropped on the empty area of a column; appends to the end.
 */
export function handleTodoDrop(
  src: DragData,
  targets: Array<{ data: DragData }>,
  state: AppState,
  dispatch: React.Dispatch<Action>
): void {
  const todoId = src.todoId as string;
  const fromColumnId = src.columnId as string;

  const cardTarget = targets.find((t) => t.data.type === 'todo-target');
  const listTarget = targets.find((t) => t.data.type === 'column-list');

  if (cardTarget) {
    const targetTodoId = cardTarget.data.todoId as string;
    const toColumnId = cardTarget.data.columnId as string;

    if (targetTodoId === todoId) return;

    const column = state.columns[toColumnId];
    if (!column) return;

    const targetIndex = column.todoIds.indexOf(targetTodoId);
    if (targetIndex === -1) return;

    const edge = extractClosestEdge(cardTarget.data);
    const rawInsertAt = edge === 'top' ? targetIndex : targetIndex + 1;

    const toIndex =
      fromColumnId === toColumnId
        ? insertIndexAfterRemoval(column.todoIds.indexOf(todoId), rawInsertAt)
        : rawInsertAt;

    if (toIndex === null) return;

    dispatch({ type: 'MOVE_TODO', payload: { todoId, toColumnId, toIndex } });
  }

  if (listTarget) {
    const toColumnId = listTarget.data.columnId as string;
    if (fromColumnId === toColumnId) return;

    const column = state.columns[toColumnId];
    if (!column) return;

    dispatch({
      type: 'MOVE_TODO',
      payload: { todoId, toColumnId, toIndex: column.todoIds.length },
    });
  }
}

/**
 * Processes a column-header drop event and fires a `REORDER_COLUMN` action.
 * Uses edge detection to decide whether to place the column before or after the target.
 */
export function handleColumnDrop(
  src: DragData,
  targets: Array<{ data: DragData }>,
  state: AppState,
  dispatch: React.Dispatch<Action>
): void {
  const colTarget = targets.find((t) => t.data.type === 'column-target');
  if (!colTarget) return;

  const sourceId = src.columnId as string;
  const targetId = colTarget.data.columnId as string;
  if (sourceId === targetId) return;

  const fromIndex = state.columnOrder.indexOf(sourceId);
  const targetIndex = state.columnOrder.indexOf(targetId);
  if (fromIndex === -1 || targetIndex === -1) return;

  const edge = extractClosestEdge(colTarget.data);
  const rawInsertAt = edge === 'left' ? targetIndex : targetIndex + 1;
  const toIndex = insertIndexAfterRemoval(fromIndex, rawInsertAt);

  if (toIndex === null) return;

  dispatch({ type: 'REORDER_COLUMN', payload: { fromIndex, toIndex } });
}

/**
 * The drag-and-drop "move" is implemented as: remove from current position,
 * then insert at the new position. But removing an item first shifts every
 * item that came after it one place to the left — which throws off the index
 * we computed from the drop target.
 *
 * This helper compensates for that shift.
 * Returns `null` when the item would end up exactly where it already is (no-op).
 *
 * Example — move A to after C in [A, B, C, D]:
 *   drop edge 'bottom' on C  →  rawInsertAt = 3  (C is at index 2, +1)
 *   remove A                 →  [B, C, D]         (C is now at index 1)
 *   insert at 3              →  [B, C, D, A]  ← wrong, A skipped over D
 *   subtract 1 (0 < 3)       →  insert at 2  →  [B, C, A, D]  ✓
 */
export function insertIndexAfterRemoval(
  fromIndex: number,
  rawInsertAt: number
): number | null {
  const adjusted = fromIndex < rawInsertAt ? rawInsertAt - 1 : rawInsertAt;
  return adjusted === fromIndex ? null : adjusted;
}
