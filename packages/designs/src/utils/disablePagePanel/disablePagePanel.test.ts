import { describe, expect, it } from 'vitest';
import { layout_page_1 } from '../../test-utils';
import { enablePagePanel } from '../enablePagePanel';
import { getPanelRegions } from '../getPanelRegions';
import { isPanelledRoot } from '../isPanelledRoot';
import { disablePagePanel } from './disablePagePanel';

const base = layout_page_1.tree;

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

  it('restores the root style from the content region on unwrap', () => {
    const root = enablePagePanel(base, 'left');

    const result = disablePagePanel(root, 'left');

    expect(result.style).toEqual(base.style);
  });

  it('returns the root unchanged when the side has no panel', () => {
    const root = enablePagePanel(base, 'left');

    expect(disablePagePanel(root, 'right')).toBe(root);
  });
});
