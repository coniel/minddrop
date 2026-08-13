import { describe, expect, it } from 'vitest';
import { DesignFixtures } from '../../test-utils';
import { enablePagePanel } from '../enablePagePanel';
import { getPanelRegions, orderPanelRegions } from './getPanelRegions';

const { layout_page_1 } = DesignFixtures;

describe('getPanelRegions', () => {
  it('returns no regions for free-form roots', () => {
    expect(getPanelRegions(layout_page_1.tree)).toEqual({});
  });

  it('extracts the panel and content regions', () => {
    // Panel both sides of the page root
    const panelled = enablePagePanel(
      enablePagePanel(layout_page_1.tree, 'left'),
      'right',
    );

    const regions = getPanelRegions(panelled);

    expect(regions.left?.side).toBe('left');
    expect(regions.right?.side).toBe('right');
    expect(regions.content?.role).toBe('page-content');
  });
});

describe('orderPanelRegions', () => {
  it('orders regions left, content, right and omits absent ones', () => {
    const panelled = enablePagePanel(layout_page_1.tree, 'right');
    const regions = getPanelRegions(panelled);

    expect(orderPanelRegions(regions)).toEqual([
      regions.content,
      regions.right,
    ]);
  });
});
