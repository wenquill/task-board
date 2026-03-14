import { useMemo } from 'react';
import { useTodos } from './useTodos';
import { matchesSearch } from '../utils/search';

/**
 * Returns the ordered list of todo IDs that should be visible in a given
 * column after applying the active filter (all / completed / incomplete)
 * and the search query.
 *
 * The search uses `matchesSearch` which supports:
 *   - Multi-word AND queries  ("buy milk" requires both words)
 *   - Case-insensitive substring matching
 *   - Fuzzy tolerance for typos in longer words
 *
 * The result is memoised and only recomputed when the column's todo list,
 * the todos themselves, the search query, or the filter status changes.
 */
export function useFilteredTodos(columnId: string): string[] {
  const { state } = useTodos();
  const column = state.columns[columnId];

  return useMemo(() => {
    if (!column) return [];

    return column.todoIds.filter((id) => {
      const todo = state.todos[id];
      if (!todo) return false;

      const passesSearch = matchesSearch(todo.text, state.searchQuery);

      const passesFilter =
        state.filter === 'all' ||
        (state.filter === 'completed' && todo.completed) ||
        (state.filter === 'incomplete' && !todo.completed);

      return passesSearch && passesFilter;
    });
  }, [column, state.todos, state.searchQuery, state.filter]);
}

/**
 * Returns true when any filter or search query is currently active.
 * Used by columns to show an "empty because filtered" state instead of
 * the regular "no tasks yet" illustration.
 */
export function useIsFiltered(): boolean {
  const { state } = useTodos();
  return state.filter !== 'all' || state.searchQuery !== '';
}
