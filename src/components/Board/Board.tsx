import { useTodos } from '../../hooks/useTodos';
import { useBoardDnd } from '../../hooks/useBoardDnd';
import { Column } from '../Column/Column';
import { AddColumnForm } from '../AddColumnForm/AddColumnForm';
import styles from './Board.module.css';

/**
 * Main board view. Renders all columns in a responsive CSS grid and mounts
 * the global drag-and-drop monitor via `useBoardDnd`.
 */
export function Board() {
  const { state, dispatch } = useTodos();

  useBoardDnd(state, dispatch);

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.board}>
        {state.columnOrder.map((colId) => {
          const column = state.columns[colId];
          if (!column) return null;
          return <Column key={colId} column={column} />;
        })}

        <div className={styles.addColumnArea}>
          <AddColumnForm />
        </div>
      </div>
    </div>
  );
}
