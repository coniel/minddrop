import { describe, expect, it } from 'vitest';
import { layout_page_1 } from '../../test-utils';
import { enablePagePanel } from '../enablePagePanel';
import { getPanelRegions, orderPanelRegions } from './getPanelRegions';

const base = layout_page_1.tree;

describe('getPanelRegions', () => {
  it('returns no regions for a plain root', () => {
    expect(getPanelRegions(base)).toEqual({});
  });

  it('returns the panels and content region of a panelled root', () => {
    const root = enablePagePanel(enablePagePanel(base, 'left'), 'right');

    const { left, content, right } = getPanelRegions(root);

    expect(left?.side).toBe('left');
    expect(right?.side).toBe('right');
    expect(content?.role).toBe('content');
  });
});

describe('orderPanelRegions', () => {
  it('orders present regions as left, content, right', () => {
    const root = enablePagePanel(enablePagePanel(base, 'left'), 'right');
    const regions = getPanelRegions(root);

    expect(orderPanelRegions(regions)).toEqual([
      regions.left,
      regions.content,
      regions.right,
    ]);
  });

  it('omits absent regions', () => {
    const root = enablePagePanel(base, 'right');
    const regions = getPanelRegions(root);

    expect(orderPanelRegions(regions)).toEqual([
      regions.content,
      regions.right,
    ]);
  });
});
