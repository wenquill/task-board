import { useContext } from 'react';
import { TodosContext } from '../store/todosContext';

/**
 * Convenience accessor for the global todo context.
 * Throws a descriptive error when called outside of `TodosProvider` so
 * missing-provider bugs are caught immediately during development.
 */
export function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) throw new Error('useTodos must be used within TodosProvider');
  return ctx;
}
