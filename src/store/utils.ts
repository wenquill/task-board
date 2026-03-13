import type { AppState, Column, Todo } from '../types';

/**
 * Returns a new columns map where each todo has been removed from its source
 * column. Todos that are already in the destination are left untouched.
 */
export function removeFromSourceColumns(
  columns: AppState['columns'],
  todosToMove: Todo[],
  destColumnId: string,
): AppState['columns'] {
  const result = { ...columns };

  for (const todo of todosToMove) {
    if (todo.columnId === destColumnId) continue;

    const sourceColumn = result[todo.columnId];
    if (!sourceColumn) continue;

    result[todo.columnId] = {
      ...sourceColumn,
      todoIds: sourceColumn.todoIds.filter((id) => id !== todo.id),
    };
  }

  return result;
}

/**
 * Returns a new todos map where every moved todo now points to destColumnId.
 */
export function reassignColumnId(
  todos: AppState['todos'],
  todosToMove: Todo[],
  destColumnId: string,
): AppState['todos'] {
  const updates = Object.fromEntries(
    todosToMove.map((todo) => [todo.id, { ...todo, columnId: destColumnId }]),
  );
  return { ...todos, ...updates };
}

/**
 * Moves a card to a different position within the same column.
 * Steps: remove from current spot → insert at new spot.
 */
export function reorderWithinColumn(
  state: AppState,
  todoId: string,
  column: Column,
  toIndex: number,
): AppState {
  const reordered = [...column.todoIds];
  const currentIndex = reordered.indexOf(todoId);
  if (currentIndex === -1) return state;

  reordered.splice(currentIndex, 1);
  const insertAt = Math.min(toIndex, reordered.length);
  reordered.splice(insertAt, 0, todoId);

  return {
    ...state,
    columns: {
      ...state.columns,
      [column.id]: { ...column, todoIds: reordered },
    },
  };
}

/**
 * Moves a card from one column to a different column.
 * Steps: remove from source → insert into destination → update the todo's columnId.
 */
export function moveBetweenColumns(
  state: AppState,
  todoId: string,
  todo: Todo,
  sourceColumn: Column,
  destColumn: Column,
  toIndex: number,
): AppState {
  const sourceIds = sourceColumn.todoIds.filter((id) => id !== todoId);
  const destIds = [...destColumn.todoIds];
  const insertAt = Math.min(toIndex, destIds.length);
  destIds.splice(insertAt, 0, todoId);

  return {
    ...state,
    todos: {
      ...state.todos,
      [todoId]: { ...todo, columnId: destColumn.id },
    },
    columns: {
      ...state.columns,
      [sourceColumn.id]: { ...sourceColumn, todoIds: sourceIds },
      [destColumn.id]: { ...destColumn, todoIds: destIds },
    },
  };
}
