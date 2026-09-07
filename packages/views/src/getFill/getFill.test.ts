import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SlotFillsStore } from '../SlotFillsStore';
import { registerFill } from '../registerFill';
import { SlotFill } from '../types';
import { getFill } from './getFill';

const fill: SlotFill = {
  id: 'test:sidebar:example',
  component: () => null,
};

describe('getFill', () => {
  beforeEach(() => {
    registerFill('sidebar', fill);
  });

  afterEach(() => SlotFillsStore.clear());

  it('returns the fill registered under the kind and id', () => {
    expect(getFill('sidebar', fill.id)).toEqual(fill);
  });

  it('returns null when no fill is registered under the id', () => {
    expect(getFill('sidebar', 'test:sidebar:missing')).toBeNull();
  });
});
