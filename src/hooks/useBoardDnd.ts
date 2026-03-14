import { useEffect, useRef } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { handleTodoDrop, handleColumnDrop } from './dndHandlers';
import type { AppState, Action } from '../types';

/**
 * Registers a global drop monitor that listens for all drag-and-drop events on
 * the board and routes each drop to the correct handler based on drag type.
 *
 * `state` is stored in a ref so the `onDrop` callback always reads the latest
 * value without the effect needing to re-subscribe on every state change.
 * The monitor is registered once on mount and cleaned up on unmount.
 */
export function useBoardDnd(state: AppState, dispatch: React.Dispatch<Action>) {
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const targets = location.current.dropTargets;
        if (!targets.length) return;

        if (source.data.type === 'todo') {
          handleTodoDrop(source.data, targets, stateRef.current, dispatch);
        } else if (source.data.type === 'column') {
          handleColumnDrop(source.data, targets, stateRef.current, dispatch);
        }
      },
    });
  }, [dispatch]);
}
