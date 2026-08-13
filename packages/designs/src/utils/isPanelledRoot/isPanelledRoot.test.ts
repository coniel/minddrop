import { describe, expect, it } from 'vitest';
import { RootElement } from '../../design-element-configs';
import { DesignFixtures } from '../../test-utils';
import { enablePagePanel } from '../enablePagePanel';
import { isPanelledRoot } from './isPanelledRoot';

const { layout_page_1 } = DesignFixtures;

describe('isPanelledRoot', () => {
  it('returns false for free-form roots', () => {
    expect(isPanelledRoot(layout_page_1.tree)).toBe(false);
  });

  it('returns true for panelled roots', () => {
    const panelled: RootElement = enablePagePanel(layout_page_1.tree, 'left');

    expect(isPanelledRoot(panelled)).toBe(true);
  });
});
