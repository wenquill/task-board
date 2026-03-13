import { createContext } from 'react';
import type { AppState, Action } from '../types';

export interface ContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const TodosContext = createContext<ContextValue | null>(null);
