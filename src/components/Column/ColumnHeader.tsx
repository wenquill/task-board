import { useTodos } from '../../hooks/useTodos';
import { Checkbox } from '../ui/Checkbox';
import { ColumnTitle } from './ColumnTitle';
import { DeleteColumnButton } from './DeleteColumnButton';
import type { Column } from '../../types';
import styles from './Column.module.css';

interface ColumnHeaderProps {
  column: Column;
  filteredTodoIds: string[];
}

/**
 * Column header bar: editable title with task-count badge on the left, and a
 * select-all checkbox + delete button on the right.
 *
 * The checkbox switches between unchecked, indeterminate (some selected), and
 * checked (all visible tasks selected).
 */
export function ColumnHeader({ column, filteredTodoIds }: ColumnHeaderProps) {
  const { state, dispatch } = useTodos();

  const selectedInColumn = filteredTodoIds.filter((id) => state.selectedTodoIds.includes(id));
  const allSelected = filteredTodoIds.length > 0 && selectedInColumn.length === filteredTodoIds.length;
  const someSelected = selectedInColumn.length > 0 && !allSelected;

  return (
    <>
      <ColumnTitle column={column} taskCount={filteredTodoIds.length} />

      <div className={styles.headerRight}>
        {filteredTodoIds.length > 0 && (
          <Checkbox
            size="sm"
            checked={allSelected}
            indeterminate={someSelected}
            onChange={() =>
              dispatch({
                type: 'SELECT_ALL_IN_COLUMN',
                payload: { columnId: column.id, todoIds: filteredTodoIds },
              })
            }
          />
        )}

        <DeleteColumnButton columnId={column.id} />
      </div>
    </>
  );
}
