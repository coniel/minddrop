import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { cleanup, setup } from '../test-utils';
import {
  DesignStudioStore,
  addPagePanel,
  removePagePanel,
} from './DesignStudioStore';

const { layout_page_1 } = DesignFixtures;

// Returns the active layout's flat elements as an array
function activeElements() {
  return Object.values(
    DesignStudioStore.getState().elementsByLayout[layout_page_1.id],
  );
}

describe('page panel actions', () => {
  beforeEach(() => {
    setup();
    DesignStudioStore.getState().setActiveLayout(layout_page_1.id);
  });

  afterEach(() => {
    cleanup();
  });

  it('adds a panel and wraps content into a content region', () => {
    addPagePanel('left');

    const elements = activeElements();

    expect(
      elements.some((el) => el.type === 'page-panel' && el.side === 'left'),
    ).toBe(true);
    expect(
      elements.some((el) => el.type === 'container' && el.role === 'content'),
    ).toBe(true);
  });

  it('removes the panel and unwraps back to a plain root', () => {
    addPagePanel('left');
    removePagePanel('left');

    const elements = activeElements();

    expect(elements.some((el) => el.type === 'page-panel')).toBe(false);
    expect(
      elements.some((el) => el.type === 'container' && el.role === 'content'),
    ).toBe(false);
  });
});
