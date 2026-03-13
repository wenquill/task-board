import type { AppState } from '../types';
import { COLUMN_COLORS } from '../types';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createInitialState(): AppState {
  const col1Id = generateId();
  const col2Id = generateId();
  const col3Id = generateId();

  return {
    todos: {},
    columns: {
      [col1Id]: { id: col1Id, title: 'To Do', todoIds: [], color: COLUMN_COLORS[0] },
      [col2Id]: { id: col2Id, title: 'In Progress', todoIds: [], color: COLUMN_COLORS[1] },
      [col3Id]: { id: col3Id, title: 'Done', todoIds: [], color: COLUMN_COLORS[2] },
    },
    columnOrder: [col1Id, col2Id, col3Id],
    filter: 'all',
    searchQuery: '',
    selectedTodoIds: [],
  };
}

export const initialState: AppState = createInitialState();
