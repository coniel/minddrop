import { describe, expect, it } from 'vitest';
import { resolveViewPaneKey } from './resolveViewPaneKey';

describe('resolveViewPaneKey', () => {
  it('joins the view area ID and the pane', () => {
    expect(resolveViewPaneKey('area', 'split')).toBe('area:split');
  });

  it('resolves different keys for the panes of one view area', () => {
    expect(resolveViewPaneKey('area', 'main')).not.toBe(
      resolveViewPaneKey('area', 'split'),
    );
  });
});
