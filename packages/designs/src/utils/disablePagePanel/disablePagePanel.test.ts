import { describe, expect, it } from 'vitest';
import { RootElement } from '../../design-element-configs';
import { DesignFixtures } from '../../test-utils';
import { enablePagePanel } from '../enablePagePanel';
import { getPanelRegions } from '../getPanelRegions';
import { isPanelledRoot } from '../isPanelledRoot';
import { disablePagePanel } from './disablePagePanel';

const { layout_page_1 } = DesignFixtures;

// A free-form page root with padding and content
const root: RootElement = {
  ...layout_page_1.tree,
  style: { paddingTop: '4' },
};

describe('disablePagePanel', () => {
  it('returns the root unchanged when the side has no panel', () => {
    expect(disablePagePanel(root, 'left')).toBe(root);
  });

  it('unwraps the content region when removing the last panel', () => {
    const panelled = enablePagePanel(root, 'left');
    const restored = disablePagePanel(panelled, 'left');

    // The content moves back into the root with its padding restored
    expect(isPanelledRoot(restored)).toBe(false);
    expect(restored.children).toEqual(root.children);
    expect(restored.style.direction).toBe('column');
    expect(restored.style.paddingTop).toBe('4');
  });

  it('keeps the panel row while another panel remains', () => {
    const bothSides = enablePagePanel(enablePagePanel(root, 'left'), 'right');
    const oneSide = disablePagePanel(bothSides, 'left');
    const regions = getPanelRegions(oneSide);

    expect(regions.left).toBeUndefined();
    expect(regions.right?.side).toBe('right');
    expect(regions.content).toBeDefined();
  });
});
