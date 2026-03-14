export interface TextSegment {
  text: string;
  highlighted: boolean;
}

/**
 * Returns true when every word in `query` appears as a substring of `text`
 * (case-insensitive). Multi-word queries use AND logic — "buy milk" only
 * matches tasks that contain both words.
 */
export function matchesSearch(text: string, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  const lower = text.toLowerCase();
  return q.toLowerCase().split(/\s+/).every((word) => lower.includes(word));
}

/**
 * Splits `text` into plain and highlighted segments for React rendering.
 * Any substring that matches a word from `query` becomes a highlighted segment.
 * Overlapping matches are merged so no character appears twice.
 */
export function getHighlightSegments(text: string, query: string): TextSegment[] {
  const q = query.trim();
  if (!q) return [{ text, highlighted: false }];

  const lower = text.toLowerCase();
  const words = q.toLowerCase().split(/\s+/);

  const ranges: [number, number][] = [];
  for (const word of words) {
    let i = 0;
    while ((i = lower.indexOf(word, i)) !== -1) {
      ranges.push([i, i + word.length]);
      i += 1;
    }
  }

  if (ranges.length === 0) return [{ text, highlighted: false }];

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [start, end] of ranges) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  const segments: TextSegment[] = [];
  let pos = 0;
  for (const [start, end] of merged) {
    if (pos < start) segments.push({ text: text.slice(pos, start), highlighted: false });
    segments.push({ text: text.slice(start, end), highlighted: true });
    pos = end;
  }
  if (pos < text.length) segments.push({ text: text.slice(pos), highlighted: false });

  return segments;
}
