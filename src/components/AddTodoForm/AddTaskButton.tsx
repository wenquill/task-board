import styles from './AddTodoForm.module.css';

interface AddTaskButtonProps {
  handleOpen: () => void;
}

export function AddTaskButton({ handleOpen }: AddTaskButtonProps) {
  return (
    <button
      className={styles.addButton}
      onClick={handleOpen}
      aria-label="Add new task"
    >
      <svg viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2v12M2 8h12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      Add task
    </button>
  );
}
