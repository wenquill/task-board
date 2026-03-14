export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  columnId: string;
}

export const COLUMN_COLORS = [
  'lavender',
  'orange',
  'mint',
  'rose',
  'sky',
] as const;
export type ColumnColor = (typeof COLUMN_COLORS)[number];

export interface Column {
  id: string;
  title: string;
  todoIds: string[];
  color: ColumnColor;
}

export type FilterStatus = 'all' | 'completed' | 'incomplete';

export interface AppState {
  todos: Record<string, Todo>;
  columns: Record<string, Column>;
  columnOrder: string[];
  filter: FilterStatus;
  searchQuery: string;
  selectedTodoIds: string[];
}

export type Action =
  | { type: 'ADD_TODO'; payload: { text: string; columnId: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'DELETE_SELECTED' }
  | { type: 'EDIT_TODO'; payload: { id: string; text: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'SET_COMPLETED_SELECTED'; payload: { completed: boolean } }
  | {
      type: 'MOVE_TODO';
      payload: { todoId: string; toColumnId: string; toIndex: number };
    }
  | { type: 'MOVE_SELECTED_TO_COLUMN'; payload: { columnId: string } }
  | { type: 'ADD_COLUMN'; payload: { title: string } }
  | { type: 'DELETE_COLUMN'; payload: { id: string } }
  | { type: 'RENAME_COLUMN'; payload: { id: string; title: string } }
  | { type: 'REORDER_COLUMN'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'TOGGLE_SELECT_TODO'; payload: { id: string } }
  | {
      type: 'SELECT_ALL_IN_COLUMN';
      payload: { columnId: string; todoIds: string[] };
    }
  | { type: 'DESELECT_ALL' }
  | { type: 'SET_FILTER'; payload: FilterStatus }
  | { type: 'SET_SEARCH'; payload: string };
