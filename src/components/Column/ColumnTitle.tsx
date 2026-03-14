import { useTodos } from '../../hooks/useTodos';
import { useInlineEdit } from '../../hooks/useInlineEdit';
import type { Column } from '../../types';
import styles from './Column.module.css';

interface ColumnTitleProps {
  column: Column;
  taskCount: number;
}

/**
 * Inline-editable column title with a task-count badge and a pencil button.
 * Double-clicking the title or pressing the pencil icon activates edit mode.
 * Committing saves the new name; Escape cancels.
 */
export function ColumnTitle({ column, taskCount }: ColumnTitleProps) {
  const { dispatch } = useTodos();

  const {
    isEditing,
    draftValue,
    setDraftValue,
    inputRef,
    startEdit,
    commitEdit,
    handleKeyDown,
  } = useInlineEdit<HTMLInputElement>(column.title, (newTitle) =>
    dispatch({
      type: 'RENAME_COLUMN',
      payload: { id: column.id, title: newTitle },
    })
  );

  return (
    <div className={styles.headerLeft}>
      <div className={`${styles.colorBar} ${styles[column.color]}`} />

      {isEditing ? (
        <input
          ref={inputRef}
          className={styles.titleInput}
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => handleKeyDown(e)}
          aria-label="Column title"
        />
      ) : (
        <h2
          className={styles.title}
          onDoubleClick={startEdit}
          title="Double-click to rename"
        >
          {column.title}
        </h2>
      )}

      <span className={styles.badge}>{taskCount}</span>

      <button
        className={styles.editTitleBtn}
        onClick={startEdit}
        aria-label="Rename column"
        title="Rename"
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
    </div>
  );
}
