import { useTodos } from '../../hooks/useTodos';
import { getHighlightSegments } from '../../utils/search';
import styles from './TodoCard.module.css';

interface HighlightedTextProps {
  text: string;
}

/**
 * Renders task text with any search-query matches visually highlighted.
 *
 * The active search query is read directly from global state so the parent
 * component does not need to pass it as a prop.
 */
export function HighlightedText({ text }: HighlightedTextProps) {
  const { state } = useTodos();
  const query = state.searchQuery;

  if (!query.trim()) return <>{text}</>;

  const segments = getHighlightSegments(text, query);

  return (
    <>
      {segments.map((seg, i) =>
        seg.highlighted ? (
          <mark key={i} className={styles.highlight}>
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}
