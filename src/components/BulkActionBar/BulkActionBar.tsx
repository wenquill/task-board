import { useCallback, useMemo, useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { MoveToMenu } from './MoveToMenu';
import styles from './BulkActionBar.module.css';

/** Floating toolbar that appears when one or more tasks are selected. */
export function BulkActionBar() {
  const { state, dispatch } = useTodos();
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const count = state.selectedTodoIds.length;

  // Memoised so MoveToMenu receives a stable array reference between renders.
  const columns = useMemo(
    () => state.columnOrder.map((id) => state.columns[id]).filter(Boolean),
    [state.columnOrder, state.columns],
  );

  // Stable callback so MoveToMenu can skip re-renders when the menu is closed.
  const handleMoveSelect = useCallback(
    (columnId: string) => {
      dispatch({ type: 'MOVE_SELECTED_TO_COLUMN', payload: { columnId } });
      setMoveMenuOpen(false);
    },
    [dispatch],
  );

  if (count === 0) return null;

  return (
    <div className={styles.bar} role="toolbar" aria-label="Bulk actions">
      <div className={styles.inner}>
        <span className={styles.count}>
          <strong>{count}</strong> {count === 1 ? 'task' : 'tasks'} selected
        </span>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.success}`}
            onClick={() => dispatch({ type: 'SET_COMPLETED_SELECTED', payload: { completed: true } })}
            title="Mark as complete"
          >
            <svg viewBox="0 0 16 16" fill="none">
              <polyline points="2,8 6,12 14,4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.btnLabel}>Complete</span>
          </button>

          <button
            className={`${styles.btn} ${styles.neutral}`}
            onClick={() => dispatch({ type: 'SET_COMPLETED_SELECTED', payload: { completed: false } })}
            title="Mark as incomplete"
          >
            <svg viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className={styles.btnLabel}>Incomplete</span>
          </button>

          <div className={styles.moveWrapper}>
            <button
              className={`${styles.btn} ${styles.primary}`}
              onClick={() => setMoveMenuOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={moveMenuOpen}
            >
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={styles.btnLabel}>Move to</span>
              <svg className={styles.chevron} viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            {moveMenuOpen && <MoveToMenu columns={columns} onSelect={handleMoveSelect} />}
          </div>

          <button
            className={`${styles.btn} ${styles.danger}`}
            onClick={() => dispatch({ type: 'DELETE_SELECTED' })}
            title="Delete selected"
          >
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.btnLabel}>Delete</span>
          </button>

          <button
            className={styles.dismiss}
            onClick={() => dispatch({ type: 'DESELECT_ALL' })}
            aria-label="Clear selection"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
