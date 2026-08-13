import { describe, expect, it } from 'vitest';
import { layout_page_1 } from '../../test-utils';
import { enablePagePanel } from '../enablePagePanel';
import { getPanelRegions } from '../getPanelRegions';
import { isPanelledRoot } from '../isPanelledRoot';
import { disablePagePanel } from './disablePagePanel';

const base = layout_page_1.tree;

// A page root with a background and padding
const styledBase = {
  ...base,
  style: {
    ...base.style,
    backgroundColor: 'red',
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
  },
};

describe('disablePagePanel', () => {
  it('removes the panel while keeping the other panel and content', () => {
    const root = enablePagePanel(enablePagePanel(base, 'left'), 'right');

    const result = disablePagePanel(root, 'left');
    const { left, content, right } = getPanelRegions(result);

    expect(left).toBeUndefined();
    expect(content?.role).toBe('content');
    expect(right?.side).toBe('right');
  });

  it('unwraps the content back into the root when removing the last panel', () => {
    const root = enablePagePanel(base, 'left');

    const result = disablePagePanel(root, 'left');

    expect(isPanelledRoot(result)).toBe(false);
    expect(result.children).toEqual(base.children);
  });

  it('restores the moved padding and column direction on unwrap', () => {
    const root = enablePagePanel(styledBase, 'left');

    const result = disablePagePanel(root, 'left');

    // Padding moved to the content region is restored to the root
    expect(result.style.paddingTop).toBe(16);
    // The root returns to a column layout
    expect(result.style.direction).toBe('column');
    // The page styling that stayed on the root is untouched
    expect(result.style.backgroundColor).toBe('red');
  });

  it('returns the root unchanged when the side has no panel', () => {
    const root = enablePagePanel(base, 'left');

    expect(disablePagePanel(root, 'right')).toBe(root);
  });
});
