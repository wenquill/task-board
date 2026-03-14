import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Generic inline-edit hook.
 * Manages editing state, draft value, commit/cancel logic, and keyboard handling.
 * The component is responsible for rendering either display or input mode.
 *
 * @param currentValue  The current "saved" value (read from state/props)
 * @param onCommit      Called with the new trimmed value when the user confirms
 */
export function useInlineEdit<T extends HTMLInputElement | HTMLTextAreaElement>(
  currentValue: string,
  onCommit: (value: string) => void
) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(currentValue);
  const inputRef = useRef<T>(null);

  useEffect(() => {
    if (isEditing) {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.select();
    }
  }, [isEditing]);

  const startEdit = useCallback(() => {
    setDraftValue(currentValue);
    setIsEditing(true);
  }, [currentValue]);

  const commitEdit = () => {
    const trimmed = draftValue.trim();
    if (trimmed && trimmed !== currentValue) {
      onCommit(trimmed);
    } else {
      setDraftValue(currentValue);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setDraftValue(currentValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, multiline = false) => {
    if (e.key === 'Enter' && (!multiline || !e.shiftKey)) {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === 'Escape') cancelEdit();
  };

  return {
    isEditing,
    draftValue,
    setDraftValue,
    inputRef,
    startEdit,
    commitEdit,
    cancelEdit,
    handleKeyDown,
  };
}
