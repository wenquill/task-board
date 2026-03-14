import type { AppState, Action } from '../types';
import { COLUMN_COLORS } from '../types';
import { generateId } from './initialState';
import {
  moveBetweenColumns,
  reassignColumnId,
  removeFromSourceColumns,
  reorderWithinColumn,
} from './utils';

export { initialState } from './initialState';

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TODO': {
      const { text, columnId } = action.payload;
      const id = generateId();
      const todo = {
        id,
        text,
        completed: false,
        createdAt: Date.now(),
        columnId,
      };
      const column = state.columns[columnId];
      if (!column) return state;

      return {
        ...state,
        todos: { ...state.todos, [id]: todo },
        columns: {
          ...state.columns,
          [columnId]: { ...column, todoIds: [...column.todoIds, id] },
        },
      };
    }

    case 'DELETE_TODO': {
      const { id } = action.payload;
      const todo = state.todos[id];
      if (!todo) return state;
      const remainingTodos = Object.fromEntries(
        Object.entries(state.todos).filter(([tid]) => tid !== id)
      );
      const column = state.columns[todo.columnId];

      return {
        ...state,
        todos: remainingTodos,
        columns: column
          ? {
              ...state.columns,
              [todo.columnId]: {
                ...column,
                todoIds: column.todoIds.filter((tid) => tid !== id),
              },
            }
          : state.columns,
        selectedTodoIds: state.selectedTodoIds.filter((sid) => sid !== id),
      };
    }

    case 'DELETE_SELECTED': {
      const idsToDelete = new Set(state.selectedTodoIds);
      const remainingTodos = Object.fromEntries(
        Object.entries(state.todos).filter(([id]) => !idsToDelete.has(id))
      );
      const updatedColumns = Object.fromEntries(
        Object.entries(state.columns).map(([colId, col]) => [
          colId,
          { ...col, todoIds: col.todoIds.filter((id) => !idsToDelete.has(id)) },
        ])
      );

      return {
        ...state,
        todos: remainingTodos,
        columns: updatedColumns,
        selectedTodoIds: [],
      };
    }

    case 'EDIT_TODO': {
      const { id, text } = action.payload;
      const todo = state.todos[id];
      if (!todo) return state;

      return { ...state, todos: { ...state.todos, [id]: { ...todo, text } } };
    }

    case 'TOGGLE_TODO': {
      const { id } = action.payload;
      const todo = state.todos[id];
      if (!todo) return state;

      return {
        ...state,
        todos: {
          ...state.todos,
          [id]: { ...todo, completed: !todo.completed },
        },
      };
    }

    case 'SET_COMPLETED_SELECTED': {
      const { completed } = action.payload;
      const updatedTodos = { ...state.todos };
      state.selectedTodoIds.forEach((id) => {
        if (updatedTodos[id]) {
          updatedTodos[id] = { ...updatedTodos[id], completed };
        }
      });

      return { ...state, todos: updatedTodos, selectedTodoIds: [] };
    }

    case 'MOVE_TODO': {
      const { todoId, toColumnId, toIndex } = action.payload;
      const todo = state.todos[todoId];
      if (!todo) return state;

      const sourceColumn = state.columns[todo.columnId];
      const destColumn = state.columns[toColumnId];
      if (!sourceColumn || !destColumn) return state;

      const isSameColumn = todo.columnId === toColumnId;

      return isSameColumn
        ? reorderWithinColumn(state, todoId, sourceColumn, toIndex)
        : moveBetweenColumns(
            state,
            todoId,
            todo,
            sourceColumn,
            destColumn,
            toIndex
          );
    }

    case 'MOVE_SELECTED_TO_COLUMN': {
      const { columnId: destColumnId } = action.payload;
      if (!state.columns[destColumnId]) return state;

      const todosToMove = state.selectedTodoIds
        .filter((id) => state.todos[id])
        .map((id) => state.todos[id]);

      const columnsAfterRemoval = removeFromSourceColumns(
        state.columns,
        todosToMove,
        destColumnId
      );
      const updatedTodos = reassignColumnId(
        state.todos,
        todosToMove,
        destColumnId
      );

      const todosArrivingFromElsewhere = todosToMove.filter(
        (t) => t.columnId !== destColumnId
      );
      const arrivingIds = todosArrivingFromElsewhere.map((t) => t.id);
      const destColumn = columnsAfterRemoval[destColumnId];
      const updatedColumns = {
        ...columnsAfterRemoval,
        [destColumnId]: {
          ...destColumn,
          todoIds: [...destColumn.todoIds, ...arrivingIds],
        },
      };

      return {
        ...state,
        todos: updatedTodos,
        columns: updatedColumns,
        selectedTodoIds: [],
      };
    }

    case 'ADD_COLUMN': {
      const { title } = action.payload;
      const id = generateId();
      const colorIndex = state.columnOrder.length % COLUMN_COLORS.length;

      return {
        ...state,
        columns: {
          ...state.columns,
          [id]: { id, title, todoIds: [], color: COLUMN_COLORS[colorIndex] },
        },
        columnOrder: [...state.columnOrder, id],
      };
    }

    case 'DELETE_COLUMN': {
      const { id } = action.payload;
      const column = state.columns[id];
      if (!column) return state;
      const remainingTodos = Object.fromEntries(
        Object.entries(state.todos).filter(
          ([tid]) => !column.todoIds.includes(tid)
        )
      );
      const remainingColumns = Object.fromEntries(
        Object.entries(state.columns).filter(([colId]) => colId !== id)
      );

      return {
        ...state,
        todos: remainingTodos,
        columns: remainingColumns,
        columnOrder: state.columnOrder.filter((cid) => cid !== id),
        selectedTodoIds: state.selectedTodoIds.filter(
          (sid) => !column.todoIds.includes(sid)
        ),
      };
    }

    case 'RENAME_COLUMN': {
      const { id, title } = action.payload;
      const column = state.columns[id];
      if (!column) return state;

      return {
        ...state,
        columns: { ...state.columns, [id]: { ...column, title } },
      };
    }

    case 'REORDER_COLUMN': {
      const { fromIndex, toIndex } = action.payload;
      const newOrder = [...state.columnOrder];
      const [moved] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, moved);

      return { ...state, columnOrder: newOrder };
    }

    case 'TOGGLE_SELECT_TODO': {
      const { id } = action.payload;
      const isSelected = state.selectedTodoIds.includes(id);

      return {
        ...state,
        selectedTodoIds: isSelected
          ? state.selectedTodoIds.filter((sid) => sid !== id)
          : [...state.selectedTodoIds, id],
      };
    }

    case 'SELECT_ALL_IN_COLUMN': {
      const { todoIds } = action.payload;
      const currentSet = new Set(state.selectedTodoIds);
      const allAlreadySelected =
        todoIds.length > 0 && todoIds.every((id) => currentSet.has(id));

      if (allAlreadySelected) {
        return {
          ...state,
          selectedTodoIds: state.selectedTodoIds.filter(
            (id) => !todoIds.includes(id)
          ),
        };
      }

      const newSelected = [...state.selectedTodoIds];
      todoIds.forEach((id) => {
        if (!currentSet.has(id)) newSelected.push(id);
      });

      return { ...state, selectedTodoIds: newSelected };
    }

    case 'DESELECT_ALL':
      return { ...state, selectedTodoIds: [] };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    default:
      return state;
  }
}
