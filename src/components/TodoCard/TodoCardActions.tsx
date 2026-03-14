import { useTodos } from '../../hooks/useTodos';
import type { Todo } from '../../types';
import styles from './TodoCard.module.css';

interface TodoCardActionsProps {
  todo: Todo;
  isEditing: boolean;
  onEdit: () => void;
}

/**
 * Icon button row for a single task: edit, toggle-complete, and delete.
 * Hidden by default and revealed on card hover (or always visible on touch devices).
 */
export function TodoCardActions({
  todo,
  isEditing,
  onEdit,
}: TodoCardActionsProps) {
  const { dispatch } = useTodos();

  return (
    <div className={styles.actions}>
      {!isEditing && (
        <button
          className={styles.actionBtn}
          onClick={onEdit}
          aria-label="Edit task"
          title="Edit"
        >
          <svg viewBox="0 0 14 14" fill="none">
            <path
              d="M2 10.5L4 12l7-7-2-2-7 7zM10 3l1-1 2 2-1 1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <button
        className={`${styles.actionBtn} ${styles.complete}`}
        onClick={() =>
          dispatch({ type: 'TOGGLE_TODO', payload: { id: todo.id } })
        }
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed ? (
          <svg viewBox="0 0 14 14" fill="none">
            <circle
              cx="7"
              cy="7"
              r="5.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <polyline
              points="4,7 6,9 10,5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 14 14" fill="none">
            <circle
              cx="7"
              cy="7"
              r="5.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        )}
      </button>

      <button
        className={`${styles.actionBtn} ${styles.delete}`}
        onClick={() =>
          dispatch({ type: 'DELETE_TODO', payload: { id: todo.id } })
        }
        aria-label="Delete task"
        title="Delete"
      >
        <svg viewBox="0 0 14 14" fill="none">
          <path
            d="M2 3.5h10M5.5 3.5V2h3v1.5M4.5 3.5l.4 8h4.2l.4-8"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
