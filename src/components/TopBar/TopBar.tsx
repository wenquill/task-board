import { useTodos } from '../../hooks/useTodos';
import type { FilterStatus } from '../../types';
import { SearchBar } from '../SearchBar/SearchBar';
import styles from './TopBar.module.css';

export function TopBar() {
  const { state, dispatch } = useTodos();

  const tabs: { value: FilterStatus; label: string }[] = [
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

        <div
          className={styles.filterGroup}
          role="group"
          aria-label="Filter tasks"
        >
          {tabs.map((t) => (
            <button
              key={t.value}
              className={`${styles.filterBtn} ${state.filter === t.value ? styles.active : ''}`}
              onClick={() => dispatch({ type: 'SET_FILTER', payload: t.value })}
              aria-pressed={state.filter === t.value}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <SearchBar />
    </header>
  );
}
