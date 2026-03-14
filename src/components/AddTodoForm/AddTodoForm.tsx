import { useCallback, useState, useRef } from 'react';
import { useTodos } from '../../hooks/useTodos';
import styles from './AddTodoForm.module.css';
import { AddTaskButton } from './AddTaskButton';

interface AddTodoFormProps {
  columnId: string;
}

/**
 * Toggle-able inline form at the bottom of each column for adding a new task.
 * Collapsed by default — pressing "Add task" expands a textarea.
 * Enter submits; Shift+Enter inserts a newline; Escape cancels.
 */
export function AddTodoForm({ columnId }: AddTodoFormProps) {
  const { dispatch } = useTodos();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({ type: 'ADD_TODO', payload: { text: trimmed, columnId } });
    setText('');
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setText('');
      setOpen(false);
    }
  };

  return !open ? <AddTaskButton handleOpen={handleOpen}/> : (
    <div className={styles.form}>
      <textarea
        ref={inputRef}
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        rows={2}
        aria-label="New task text"
      />
      <div className={styles.formActions}>
        <button className={styles.submitBtn} onClick={handleSubmit} disabled={!text.trim()}>
          Add task
        </button>
        <button
          className={styles.cancelBtn}
          onClick={() => {
            setText('');
            setOpen(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
