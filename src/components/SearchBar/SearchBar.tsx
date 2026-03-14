import { useTodos } from '../../hooks/useTodos';
import styles from './SearchBar.module.css';

export const SearchBar = () => {
  const { state, dispatch } = useTodos();

  return (
    <div className={styles.searchWrapper}>
      <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none">
        <circle
          cx="8.5"
          cy="8.5"
          r="5.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M15 15l-3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <input
        id="task-search"
        name="task-search"
        className={styles.searchInput}
        type="search"
        placeholder="Search tasks..."
        value={state.searchQuery}
        onChange={(e) =>
          dispatch({ type: 'SET_SEARCH', payload: e.target.value })
        }
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
  );
};
