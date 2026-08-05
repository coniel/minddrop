import { createObjectStore } from '@minddrop/stores';

export interface SpaceViewState {
  /**
   * The space ID this state belongs to.
   */
  spaceId: string;

  /**
   * Whether the space is in edit mode.
   */
  editing: boolean;
}

/**
 * Persisted object store that tracks per-space view state such
 * as whether the space is in edit mode.
 */
export const SpaceViewStateStore = createObjectStore<SpaceViewState>(
  'Spaces:ViewState',
  'spaceId',
  {
    persistTo: 'app-config',
    namespace: 'space-view-state',
  },
);

const defaultState: Omit<SpaceViewState, 'spaceId'> = {
  editing: false,
};

/**
 * Returns the persisted view state for a space, falling back to
 * defaults for missing fields.
 */
export function useSpaceViewState(spaceId: string): SpaceViewState {
  const stored = SpaceViewStateStore.useItem(spaceId);

  return {
    ...defaultState,
    spaceId,
    ...stored,
  };
}

/**
 * Updates a subset of the view state for a space, creating the
 * entry if it does not exist.
 */
export function setSpaceViewState(
  spaceId: string,
  updates: Partial<Omit<SpaceViewState, 'spaceId'>>,
): void {
  const existing = SpaceViewStateStore.get(spaceId);

  if (existing) {
    SpaceViewStateStore.update(spaceId, updates);
  } else {
    SpaceViewStateStore.set({
      ...defaultState,
      spaceId,
      ...updates,
    });
  }
}
