import { useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { reducer, initialState } from './reducer';
import { loadState, saveState } from './persistence';
import { TodosContext } from './todosContext';

export function TodosProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    return loadState() ?? initialState;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  return <TodosContext.Provider value={{ state, dispatch }}>{children}</TodosContext.Provider>;
}
