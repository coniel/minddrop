import { afterEach, describe, expect, it } from 'vitest';
import { MainContentViewsStore } from '../MainContentViewsStore';
import { MainContentView } from '../types';
import { registerMainContentView } from './registerMainContentView';

const mainContentView: MainContentView = {
  type: 'test:view:example',
  component: () => null,
};

describe('registerMainContentView', () => {
  afterEach(() => MainContentViewsStore.clear());

  it('adds the main content view to the store', () => {
    registerMainContentView(mainContentView);

    expect(MainContentViewsStore.get(mainContentView.type)).toEqual(
      mainContentView,
    );
  });
});
