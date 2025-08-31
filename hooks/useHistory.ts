// Custom hook for undo/redo text history, persisted to localStorage
import { useCallback, useEffect, useReducer } from "react";

// State type for undo/redo history
type State = {
  past: string[];
  present: string;
  future: string[];
};

// Action types for reducer
type Action =
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET"; newPresent: string }
  | { type: "RESET"; initial: string };

// Reducer to manage undo/redo state
function historyReducer(state: State, action: Action): State {
  switch (action.type) {
    case "UNDO": {
      // Undo: move present to future, pop from past
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case "REDO": {
      // Redo: move present to past, shift from future
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }
    case "SET": {
      // Set new present, push current to past, clear future
      if (action.newPresent === state.present) return state;
      return {
        past: [...state.past, state.present],
        present: action.newPresent,
        future: [],
      };
    }
    case "RESET": {
      // Reset history to initial value
      return {
        past: [],
        present: action.initial,
        future: [],
      };
    }
    default:
      return state;
  }
}



const STORAGE_KEY = "tone-picker-history";


// Clear localStorage for this key on every page load (so history is always empty after reload)
if (typeof window !== "undefined") {
  window.localStorage.removeItem(STORAGE_KEY);
}


export function useHistory(initial: string) {
  // useReducer for undo/redo state
  const [state, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initial,
    future: [],
  });

  // Load from localStorage (disabled by clearing above, but kept for completeness)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed.present === "string" &&
          Array.isArray(parsed.past) &&
          Array.isArray(parsed.future)
        ) {
          dispatch({ type: "RESET", initial: parsed.present });
        }
      } catch {}
    }
    // eslint-disable-next-line
  }, []);

  // Save to localStorage on every state change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        past: state.past,
        present: state.present,
        future: state.future,
      })
    );
  }, [state]);

  // Expose state and actions
  const set = useCallback((newPresent: string) => {
    dispatch({ type: "SET", newPresent });
  }, []);
  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);
  const reset = useCallback((initial: string) => dispatch({ type: "RESET", initial }), []);

  return {
    value: state.present,
    set,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
