import { describe, expect, it } from 'vitest';
import { Tab } from '../TabSetsStore';
import { createBlankTab } from '../createBlankTab';
import { getTabLabel } from './getTabLabel';

const BLANK_LABEL = 'New Tab';

const mainView = {
  view: 'test:view',
  icon: 'test-icon',
  title: 'Main view',
};

const splitView = {
  view: 'test:view',
  icon: 'test-icon',
  title: 'Split view',
};

describe('getTabLabel', () => {
  it('labels a tab by its main view title', () => {
    const tab: Tab = { ...createBlankTab(), main: mainView };

    expect(getTabLabel(tab, BLANK_LABEL)).toBe('Main view');
  });

  it('combines both pane titles when the tab is split', () => {
    const tab: Tab = { ...createBlankTab(), main: mainView, split: splitView };

    expect(getTabLabel(tab, BLANK_LABEL)).toBe('Main view | Split view');
  });

  it('falls back to the blank label for panes without a title', () => {
    const tab: Tab = {
      ...createBlankTab(),
      split: { view: 'test:view', icon: 'test-icon' },
    };

    expect(getTabLabel(tab, BLANK_LABEL)).toBe('New Tab | New Tab');
  });
});
