import { useTodos } from '../../hooks/useTodos';
import type { FilterStatus } from '../../types';
import styles from './TopBar.module.css';

/**
 * Sticky application header containing the brand, filter tabs (All / Open / Closed),
 * and a smart search input that filters tasks across all columns.
 */
export function TopBar() {
  const { state, dispatch } = useTodos();

  const filters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'incomplete', label: 'Open' },
    { value: 'completed', label: 'Closed' },
  ];

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <h1 className={styles.title}>TaskBoard</h1>
        </div>

        <div className={styles.filterGroup} role="group" aria-label="Filter tasks">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${state.filter === f.value ? styles.active : ''}`}
              onClick={() => dispatch({ type: 'SET_FILTER', payload: f.value })}
              aria-pressed={state.filter === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.searchWrapper}>
        <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15 15l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search tasks..."
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          aria-label="Search tasks"
        />
        {state.searchQuery && (
          <button
            className={styles.clearSearch}
            onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </header>
  );
}
