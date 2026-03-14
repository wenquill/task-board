import { useRef, useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import styles from './AddColumnForm.module.css';

/**
 * Toggle-able inline form that creates a new column.
 * Rendered in the last cell of the board grid. Collapsed by default;
 * Enter submits the new column name, Escape cancels.
 */
export function AddColumnForm() {
  const { dispatch } = useTodos();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const open = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    dispatch({ type: 'ADD_COLUMN', payload: { title: trimmed } });
    setTitle('');
    setIsOpen(false);
  };

  const cancel = () => {
    setTitle('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') cancel();
  };

  if (!isOpen) {
    return (
      <button
        className={styles.addColumnBtn}
        onClick={open}
        aria-label="Add new column"
      >
        <svg viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2v16M2 10h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Add column
      </button>
    );
  }

  return (
    <div className={styles.addColumnForm}>
      <input
        ref={inputRef}
        className={styles.addColumnInput}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Column name..."
        aria-label="New column name"
        maxLength={50}
      />
      <div className={styles.addColumnActions}>
        <button
          className={styles.addColSubmit}
          onClick={submit}
          disabled={!title.trim()}
        >
          Add
        </button>
        <button className={styles.addColCancel} onClick={cancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
