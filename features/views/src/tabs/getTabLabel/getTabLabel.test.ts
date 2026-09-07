import { afterEach, describe, expect, it } from 'vitest';
import { TranslationKey } from '@minddrop/i18n';
import { ViewSession, ViewSessionId, Views } from '@minddrop/views';
import { getTabLabel } from './getTabLabel';

const BLANK_LABEL = 'New Tab';

const RegisteredViewType = 'test:view:fixed-label';
const RegisteredTitle = 'search.open' as TranslationKey;

const mainView = {
  view: 'test:view',
  contentIcon: 'test-icon',
  title: 'Main view',
};

const splitView = {
  view: 'test:view',
  contentIcon: 'test-icon',
  title: 'Split view',
};

// Stands in for the i18n translate function
function translate(key: TranslationKey): string {
  return `translated:${key}`;
}

describe('getTabLabel', () => {
  afterEach(() => {
    Views.Store.clear();
  });

  it('labels a tab by its main view title', () => {
    const tab: ViewSession = { ...blankSession(), main: mainView };

    expect(getTabLabel(tab, BLANK_LABEL, translate)).toBe('Main view');
  });

  it('combines both pane titles when the tab is split', () => {
    const tab: ViewSession = {
      ...blankSession(),
      main: mainView,
      split: splitView,
    };

    expect(getTabLabel(tab, BLANK_LABEL, translate)).toBe(
      'Main view | Split view',
    );
  });

  it("labels a pane by its view's registered title", () => {
    Views.register({
      type: RegisteredViewType,
      component: () => null,
      title: RegisteredTitle,
    });

    const tab: ViewSession = {
      ...blankSession(),
      main: { view: RegisteredViewType },
    };

    expect(getTabLabel(tab, BLANK_LABEL, translate)).toBe(
      `translated:${RegisteredTitle}`,
    );
  });

  it('prefers the pane title over the registered title', () => {
    Views.register({
      type: RegisteredViewType,
      component: () => null,
      title: RegisteredTitle,
    });

    const tab: ViewSession = {
      ...blankSession(),
      main: { view: RegisteredViewType, title: 'Entity title' },
    };

    expect(getTabLabel(tab, BLANK_LABEL, translate)).toBe('Entity title');
  });

  it('labels a pane by its subview title', () => {
    const tab: ViewSession = {
      ...blankSession(),
      main: { ...mainView, subview: { id: 'entity', title: 'Entity' } },
    };

    expect(getTabLabel(tab, BLANK_LABEL, translate)).toBe('Entity');
  });

  it('prefers the subview label over its title', () => {
    const tab: ViewSession = {
      ...blankSession(),
      main: {
        ...mainView,
        subview: { id: 'entity', title: 'Entity', label: 'Selected item' },
      },
    };

    expect(getTabLabel(tab, BLANK_LABEL, translate)).toBe('Selected item');
  });

  it('falls back to the blank label for panes without a title', () => {
    const tab: ViewSession = {
      ...blankSession(),
      main: null,
      split: { view: 'test:view', contentIcon: 'test-icon' },
    };

    expect(getTabLabel(tab, BLANK_LABEL, translate)).toBe('New Tab | New Tab');
  });
});

/**
 * Returns a blank session to build tabs from.
 */
function blankSession(): ViewSession {
  return {
    id: 'session_1' as ViewSessionId,
    main: null,
    split: null,
    splitRatio: 50,
  };
}
