import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { getActiveDrag } from '../getActiveDrag';
import { subscribeToActiveDrag } from '../subscribeToActiveDrag';
import { DragFixtures, cleanup, setup } from '../test-utils';
import { ActiveDrag } from '../types';
import { DragStore, useActiveDrag, useIsDragging } from './DragStore';

const { activeDrag_1: drag } = DragFixtures;

describe('DragStore', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('has no drag to begin with', () => {
    expect(getActiveDrag()).toBeNull();
    expect(renderHook(() => useIsDragging()).result.current).toBe(false);
  });

  it('has the active drag', () => {
    DragStore.getState().setActive(drag);

    expect(getActiveDrag()).toEqual(drag);
    expect(renderHook(() => useActiveDrag()).result.current).toEqual(drag);
    expect(renderHook(() => useIsDragging()).result.current).toBe(true);
  });

  it('clears the active drag', () => {
    DragStore.getState().setActive(drag);
    DragStore.getState().clear();

    expect(getActiveDrag()).toBeNull();
  });

  it('notifies subscribers when the active drag starts and ends', () => {
    const seen: (ActiveDrag | null)[] = [];
    const unsubscribe = subscribeToActiveDrag((active) => seen.push(active));

    DragStore.getState().setActive(drag);
    DragStore.getState().clear();
    unsubscribe();
    DragStore.getState().setActive(drag);

    expect(seen).toEqual([drag, null]);
  });
});
