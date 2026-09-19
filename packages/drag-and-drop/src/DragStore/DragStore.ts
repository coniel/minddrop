import { create } from 'zustand';
import { ActiveDrag } from '../types';

interface DragStore {
  /**
   * The drag in progress, or null while nothing is being dragged.
   */
  active: ActiveDrag | null;

  /**
   * Sets the drag in progress.
   */
  setActive(drag: ActiveDrag | null): void;

  /**
   * Clears the state, resetting it to the initial value.
   */
  clear(): void;
}

export const DragStore = create<DragStore>()((set) => ({
  active: null,

  setActive: (active) => set({ active }),

  clear: () => set({ active: null }),
}));

/**
 * Returns whether a drag is in progress.
 */
export function useIsDragging(): boolean {
  return DragStore((state) => state.active !== null);
}

/**
 * Returns the drag in progress, or null while nothing is being
 * dragged.
 */
export function useActiveDrag(): ActiveDrag | null {
  return DragStore((state) => state.active);
}
