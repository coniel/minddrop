// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { ViewsStore } from '../ViewsStore';
import { View } from '../types';
import { registerView } from './registerView';

const view: View = {
  type: 'test:view:example',
  component: () => null,
};

describe('registerView', () => {
  afterEach(() => ViewsStore.clear());

  it('adds the view to the store', () => {
    registerView(view);

    expect(ViewsStore).toHaveItem(view.type, view);
  });
});
