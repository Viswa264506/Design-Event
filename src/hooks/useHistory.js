import { useState, useCallback } from 'react';

export const useHistory = (initialPresent) => {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initialPresent);
  const [future, setFuture] = useState([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setFuture([present, ...future]);
    setPresent(previous);
    return previous;
  }, [canUndo, past, present, future]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast([...past, present]);
    setFuture(newFuture);
    setPresent(next);
    return next;
  }, [canRedo, future, past, present]);

  const updateState = useCallback((newPresent) => {
    // Avoid double entries for identical state
    if (JSON.stringify(newPresent) === JSON.stringify(present)) return;

    setPast([...past, present]);
    setPresent(newPresent);
    setFuture([]);
  }, [past, present]);

  const resetHistory = useCallback((newPresent) => {
    setPast([]);
    setPresent(newPresent);
    setFuture([]);
  }, []);

  return {
    state: present,
    setState: updateState,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory
  };
};
