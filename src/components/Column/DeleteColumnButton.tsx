import { useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import styles from './Column.module.css';

interface DeleteColumnButtonProps {
  columnId: string;
}

/**
 * Two-step column deletion control.
 * A single click reveals an inline "Delete? Yes / No" confirmation so the
 * user cannot accidentally remove a column and all its tasks.
 */
export function DeleteColumnButton({ columnId }: DeleteColumnButtonProps) {
  const { dispatch } = useTodos();
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className={styles.deleteConfirm}>
        <span>Delete?</span>
        <button
          className={styles.confirmYes}
          onClick={() =>
            dispatch({ type: 'DELETE_COLUMN', payload: { id: columnId } })
          }
        >
          Yes
        </button>
        <button
          className={styles.confirmNo}
          onClick={() => setShowConfirm(false)}
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      className={styles.deleteBtn}
      onClick={() => setShowConfirm(true)}
      aria-label="Delete column"
      title="Delete column"
    >
      <svg viewBox="0 0 14 14" fill="none">
        <path
          d="M2.5 2.5l9 9M11.5 2.5l-9 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
