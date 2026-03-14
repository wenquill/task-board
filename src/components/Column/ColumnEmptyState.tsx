import styles from './Column.module.css';

interface ColumnEmptyStateProps {
  isFiltered: boolean;
}

/**
 * Placeholder shown inside a column when there are no visible tasks.
 * Renders a different illustration and message depending on whether the
 * empty state is caused by a filter/search or simply no tasks existing yet.
 */
export function ColumnEmptyState({ isFiltered }: ColumnEmptyStateProps) {
  if (isFiltered) {
    return (
      <div className={styles.emptyState}>
        <svg viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
          <path
            d="M14 20h12M17 16l3-3 3 3M23 24l-3 3-3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <p>No matching tasks</p>
      </div>
    );
  }

  return (
    <div className={styles.emptyState}>
      <svg viewBox="0 0 40 40" fill="none">
        <rect x="8" y="12" width="24" height="4" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
        <rect x="8" y="20" width="18" height="4" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
      </svg>
      <p>No tasks yet</p>
    </div>
  );
}
