import { memo } from 'react';
import type { Column } from '../../types';
import styles from './BulkActionBar.module.css';

interface MoveToMenuProps {
  columns: Column[];
  onSelect: (columnId: string) => void;
}

/** Dropdown list of columns the user can bulk-move selected tasks into. */
export const MoveToMenu = memo(function MoveToMenu({ columns, onSelect }: MoveToMenuProps) {
  return (
    <ul className={styles.moveMenu} role="listbox">
      {columns.map((col) => (
        <li
          key={col.id}
          role="option"
          className={styles.moveOption}
          onClick={() => onSelect(col.id)}
        >
          <span className={`${styles.colorDot} ${styles[col.color]}`} />
          {col.title}
        </li>
      ))}
    </ul>
  );
});
