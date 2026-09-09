// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
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

    expect(SlotFillsStore).toHaveItem(`sidebar:${fill.id}`, {
      key: `sidebar:${fill.id}`,
      kind: 'sidebar',
      fill,
    });
  });
});
