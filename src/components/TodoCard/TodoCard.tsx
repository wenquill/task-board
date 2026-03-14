import { useTodos } from '../../hooks/useTodos';
import { useIsFiltered } from '../../hooks/useFilteredTodos';
import { useTodoCardDnd } from '../../hooks/useTodoCardDnd';
import { useInlineEdit } from '../../hooks/useInlineEdit';
import { Checkbox } from '../ui/Checkbox';
import { TodoCardActions } from './TodoCardActions';
import { HighlightedText } from './HighlightedText';
import type { Todo } from '../../types';
import styles from './TodoCard.module.css';

interface TodoCardProps {
  todo: Todo;
}

/**
 * Draggable task card. Composes drag-and-drop registration, inline text
 * editing, selection checkbox, and action buttons. Visual state (dragging,
 * selected, completed, drop-over indicator) is reflected through CSS classes.
 */
export function TodoCard({ todo }: TodoCardProps) {
  const { state, dispatch } = useTodos();
  const isFiltered = useIsFiltered();
  const isSelected = state.selectedTodoIds.includes(todo.id);

  const { cardRef, dragState } = useTodoCardDnd(todo, isFiltered);

  const {
    isEditing,
    draftValue,
    setDraftValue,
    inputRef,
    startEdit,
    commitEdit,
    handleKeyDown,
  } = useInlineEdit<HTMLTextAreaElement>(todo.text, (newText) =>
    dispatch({ type: 'EDIT_TODO', payload: { id: todo.id, text: newText } })
  );

  const cardClass = [
    styles.card,
    todo.completed ? styles.completed : '',
    isSelected ? styles.selected : '',
    dragState.type === 'dragging' ? styles.dragging : '',
    dragState.type === 'over' && dragState.closestEdge === 'top'
      ? styles.overTop
      : '',
    dragState.type === 'over' && dragState.closestEdge === 'bottom'
      ? styles.overBottom
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={cardRef} className={cardClass} data-todo-id={todo.id}>
      <div className={styles.header}>
        <Checkbox
          size="sm"
          checked={isSelected}
          onChange={() =>
            dispatch({ type: 'TOGGLE_SELECT_TODO', payload: { id: todo.id } })
          }
        />

        {isEditing ? (
          <textarea
            ref={inputRef}
            className={styles.editInput}
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => handleKeyDown(e, true)}
            rows={2}
            aria-label="Edit task"
          />
        ) : (
          <span
            className={styles.text}
            onDoubleClick={startEdit}
            title="Double-click to edit"
          >
            <HighlightedText text={todo.text} />
          </span>
        )}

        <TodoCardActions todo={todo} isEditing={isEditing} onEdit={startEdit} />
      </div>

      {!isFiltered && (
        <div className={styles.dragHandle} aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none">
            <circle cx="5" cy="4" r="1.2" fill="currentColor" />
            <circle cx="5" cy="8" r="1.2" fill="currentColor" />
            <circle cx="5" cy="12" r="1.2" fill="currentColor" />
            <circle cx="11" cy="4" r="1.2" fill="currentColor" />
            <circle cx="11" cy="8" r="1.2" fill="currentColor" />
            <circle cx="11" cy="12" r="1.2" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}
