import { afterEach, describe, expect, it } from 'vitest';
import { SlotFillsStore } from '../SlotFillsStore';
import { SlotFill } from '../types';
import { registerFill } from './registerFill';

const fill: SlotFill = {
  id: 'test:sidebar:example',
  component: () => null,
};

describe('registerFill', () => {
  afterEach(() => SlotFillsStore.clear());

  it('adds the fill to the store under its kind', () => {
    registerFill('sidebar', fill);

    expect(SlotFillsStore.get(`sidebar:${fill.id}`)).toEqual({
      key: `sidebar:${fill.id}`,
      kind: 'sidebar',
      fill,
    });
  });
});
