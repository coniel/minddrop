import { describe, expect, it } from 'vitest';
import { RootElement } from '../../design-element-configs';
import { DesignFixtures } from '../../test-utils';
import { getPanelRegions } from '../getPanelRegions';
import { enablePagePanel } from './enablePagePanel';

const { layout_page_1 } = DesignFixtures;

// A free-form page root with padding and content
const root: RootElement = {
  ...layout_page_1.tree,
  style: { paddingTop: '4', paddingLeft: '4' },
};

describe('enablePagePanel', () => {
  it('wraps existing children into a content region on first enable', () => {
    const panelled = enablePagePanel(root, 'left');
    const regions = getPanelRegions(panelled);

    // The original children move into the content region
    expect(regions.content?.children).toEqual(root.children);

    // The root switches to a panel row with its padding moved to
    // the content region
    expect(panelled.style.direction).toBe('row');
    expect(panelled.style.paddingTop).toBeUndefined();
    expect(regions.content?.style.paddingTop).toBe('4');
  });

  it('adds a panel on the given side', () => {
    const panelled = enablePagePanel(root, 'right');

    expect(getPanelRegions(panelled).right?.side).toBe('right');
  });

  it('returns the root unchanged when the side already has a panel', () => {
    const panelled = enablePagePanel(root, 'left');

    expect(enablePagePanel(panelled, 'left')).toBe(panelled);
  });

  it('keeps the existing content region when adding a second panel', () => {
    const oneSide = enablePagePanel(root, 'left');
    const bothSides = enablePagePanel(oneSide, 'right');

    expect(getPanelRegions(bothSides).content).toEqual(
      getPanelRegions(oneSide).content,
    );
  });
});
