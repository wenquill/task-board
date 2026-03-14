import { useTodos } from '../../hooks/useTodos';
import { useFilteredTodos, useIsFiltered } from '../../hooks/useFilteredTodos';
import { useColumnDnd } from '../../hooks/useColumnDnd';
import { TodoCard } from '../TodoCard/TodoCard';
import { AddTodoForm } from '../AddTodoForm/AddTodoForm';
import { ColumnHeader } from './ColumnHeader';
import { ColumnEmptyState } from './ColumnEmptyState';
import type { Column as ColumnType } from '../../types';
import styles from './Column.module.css';

interface ColumnProps {
  column: ColumnType;
}

/**
 * Column shell. Orchestrates drag-and-drop registration, applies
 * filtered/searched task list, and composes the header, task list, and
 * add-task footer.
 */
export function Column({ column }: ColumnProps) {
  const { state } = useTodos();
  const filteredTodoIds = useFilteredTodos(column.id);
  const isFiltered = useIsFiltered();

  const { columnRef, headerRef, listRef, dragState } = useColumnDnd(column.id);

  const colClass = [
    styles.column,
    styles[column.color],
    dragState.type === 'dragging' ? styles.dragging : '',
    dragState.type === 'over-col' && dragState.closestEdge === 'left'
      ? styles.overLeft
      : '',
    dragState.type === 'over-col' && dragState.closestEdge === 'right'
      ? styles.overRight
      : '',
    dragState.type === 'over-list' ? styles.overList : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={columnRef} className={colClass} data-column-id={column.id}>
      <div ref={headerRef} className={styles.header}>
        <ColumnHeader column={column} filteredTodoIds={filteredTodoIds} />
      </div>

      <div
        ref={listRef}
        className={`${styles.list} ${filteredTodoIds.length === 0 ? styles.empty : ''}`}
        role="list"
        aria-label={`${column.title} tasks`}
      >
        {filteredTodoIds.length === 0 ? (
          <ColumnEmptyState isFiltered={isFiltered} />
        ) : (
          filteredTodoIds.map((id) => {
            const todo = state.todos[id];
            if (!todo) return null;
            return <TodoCard key={id} todo={todo} />;
          })
        )}
      </div>

      <div className={styles.footer}>
        <AddTodoForm columnId={column.id} />
      </div>
    </div>
  );
}
