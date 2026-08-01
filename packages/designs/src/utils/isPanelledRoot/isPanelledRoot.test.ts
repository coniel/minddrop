import { describe, expect, it } from 'vitest';
import { layout_page_1 } from '../../test-utils';
import { enablePagePanel } from '../enablePagePanel';
import { isPanelledRoot } from './isPanelledRoot';

const base = layout_page_1.tree;

describe('isPanelledRoot', () => {
  it('returns false for a root with free-form children', () => {
    expect(isPanelledRoot(base)).toBe(false);
  });

  it('returns true once a panel is enabled', () => {
    expect(isPanelledRoot(enablePagePanel(base, 'left'))).toBe(true);
  });
});
