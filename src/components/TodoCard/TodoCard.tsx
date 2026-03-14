import { useTodos } from '../../hooks/useTodos';
import { useIsFiltered } from '../../hooks/useFilteredTodos';
import { useTodoCardDnd } from '../../hooks/useTodoCardDnd';
import { useInlineEdit } from '../../hooks/useInlineEdit';
import { TodoCardView } from './TodoCardView';
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

  const handleToggleSelect = () => {
    dispatch({ type: 'TOGGLE_SELECT_TODO', payload: { id: todo.id } });
  };

  const handleDraftValueChange = (value: string) => {
    setDraftValue(value);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(e, true);
  };

  return (
    <TodoCardView
      todo={todo}
      cardRef={cardRef}
      cardClass={cardClass}
      isSelected={isSelected}
      isFiltered={isFiltered}
      isEditing={isEditing}
      draftValue={draftValue}
      inputRef={inputRef}
      onToggleSelect={handleToggleSelect}
      onDraftValueChange={handleDraftValueChange}
      onStartEdit={startEdit}
      onCommitEdit={commitEdit}
      onEditKeyDown={handleEditKeyDown}
    />
  );
}
