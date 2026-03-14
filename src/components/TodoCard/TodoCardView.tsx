import type { Ref } from 'react';
import { Checkbox } from '../ui/Checkbox';
import { TodoCardActions } from './TodoCardActions';
import { HighlightedText } from './HighlightedText';
import type { Todo } from '../../types';
import styles from './TodoCard.module.css';

interface TodoCardViewProps {
  todo: Todo;
  cardRef: Ref<HTMLDivElement>;
  cardClass: string;
  isSelected: boolean;
  isFiltered: boolean;
  isEditing: boolean;
  draftValue: string;
  inputRef: Ref<HTMLTextAreaElement>;
  onToggleSelect: () => void;
  onDraftValueChange: (value: string) => void;
  onStartEdit: () => void;
  onCommitEdit: () => void;
  onEditKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

/**
 * Pure view for a task card.
 * Receives all UI state and handlers from the container component.
 */
export function TodoCardView({
  todo,
  cardRef,
  cardClass,
  isSelected,
  isFiltered,
  isEditing,
  draftValue,
  inputRef,
  onToggleSelect,
  onDraftValueChange,
  onStartEdit,
  onCommitEdit,
  onEditKeyDown,
}: TodoCardViewProps) {
  return (
    <div ref={cardRef} className={cardClass} data-todo-id={todo.id}>
      <div className={styles.header}>
        <Checkbox size="sm" checked={isSelected} onChange={onToggleSelect} />

        {isEditing ? (
          <textarea
            ref={inputRef}
            className={styles.editInput}
            value={draftValue}
            onChange={(e) => onDraftValueChange(e.target.value)}
            onBlur={onCommitEdit}
            onKeyDown={onEditKeyDown}
            rows={2}
            aria-label="Edit task"
          />
        ) : (
          <span
            className={styles.text}
            onDoubleClick={onStartEdit}
            title="Double-click to edit"
          >
            <HighlightedText text={todo.text} />
          </span>
        )}

        <TodoCardActions todo={todo} isEditing={isEditing} onEdit={onStartEdit} />
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
