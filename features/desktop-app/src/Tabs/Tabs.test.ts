import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetMainContentEventData } from '@minddrop/events';
import { TabsStore } from '../TabsStore';
import {
  closeTab,
  closeTabsForView,
  newTab,
  recordMainContent,
  setActiveTab,
  setTabOrder,
  updateTabsForView,
} from './Tabs';

function resetStore() {
  TabsStore.set('tabs', []);
  TabsStore.set('activeTabId', null);
}

function state(
  main: SetMainContentEventData['main'],
  split: SetMainContentEventData['split'] = null,
  splitRatio = 50,
): SetMainContentEventData {
  return { main, split, splitRatio };
}

describe('Tabs', () => {
  beforeEach(resetStore);

  afterEach(resetStore);

  describe('newTab', () => {
    it('appends a blank tab and makes it active', () => {
      newTab();

      const tabs = TabsStore.get('tabs');

      expect(tabs).toHaveLength(1);
      expect(tabs[0].main).toBeNull();
      expect(TabsStore.get('activeTabId')).toBe(tabs[0].id);
    });
  });

  describe('recordMainContent', () => {
    it('records the main view onto the active tab', () => {
      newTab();

      recordMainContent(state({ view: 'designs:view:studio' }));

      expect(TabsStore.get('tabs')[0].main?.view).toBe('designs:view:studio');
    });

    it('clears the split when recording a state without one', () => {
      newTab();
      recordMainContent(state({ view: 'a' }, { view: 'b' }, 60));
      recordMainContent(state({ view: 'a' }));

      expect(TabsStore.get('tabs')[0].split).toBeNull();
    });

    it('creates an active tab when none exists', () => {
      recordMainContent(state({ view: 'a' }));

      expect(TabsStore.get('tabs')).toHaveLength(1);
      expect(TabsStore.get('activeTabId')).not.toBeNull();
    });
  });

  describe('closeTab', () => {
    it('removes the tab and activates a neighbour', () => {
      newTab();
      const first = TabsStore.get('activeTabId');
      newTab();
      const second = TabsStore.get('activeTabId')!;

      closeTab(second);

      const tabs = TabsStore.get('tabs');

      expect(tabs).toHaveLength(1);
      expect(tabs[0].id).toBe(first);
      expect(TabsStore.get('activeTabId')).toBe(first);
    });

    it('can close the last tab, leaving none active', () => {
      newTab();

      closeTab(TabsStore.get('activeTabId')!);

      expect(TabsStore.get('tabs')).toHaveLength(0);
      expect(TabsStore.get('activeTabId')).toBeNull();
    });
  });

  describe('setActiveTab', () => {
    it('activates the given tab', () => {
      newTab();
      const first = TabsStore.get('activeTabId')!;
      newTab();

      setActiveTab(first);

      expect(TabsStore.get('activeTabId')).toBe(first);
    });
  });

  describe('setTabOrder', () => {
    it('reorders the tabs to match the given ids', () => {
      newTab();
      const first = TabsStore.get('tabs')[0].id;
      newTab();
      const second = TabsStore.get('tabs')[1].id;

      setTabOrder([second, first]);

      const tabs = TabsStore.get('tabs');

      expect(tabs[0].id).toBe(second);
      expect(tabs[1].id).toBe(first);
    });
  });

  describe('updateTabsForView', () => {
    it('updates the id, props, title and icon of the matching view', () => {
      newTab();
      recordMainContent(
        state({
          view: 'db:view',
          id: 'db:a',
          props: { databaseId: 'a' },
          title: 'A',
          icon: 'icon-a',
        }),
      );

      updateTabsForView('db:a', {
        id: 'db:b',
        props: { databaseId: 'b' },
        title: 'B',
        icon: 'icon-b',
      });

      const main = TabsStore.get('tabs')[0].main;

      expect(main?.id).toBe('db:b');
      expect(main?.props).toEqual({ databaseId: 'b' });
      expect(main?.title).toBe('B');
      expect(main?.icon).toBe('icon-b');
    });

    it('leaves non-matching views unchanged', () => {
      newTab();
      recordMainContent(state({ view: 'db:view', id: 'db:a', title: 'A' }));

      updateTabsForView('db:other', { title: 'X' });

      expect(TabsStore.get('tabs')[0].main?.title).toBe('A');
    });
  });

  describe('closeTabsForView', () => {
    it('closes the tab whose main view id matches', () => {
      newTab();
      recordMainContent(state({ view: 'db:view', id: 'db:a' }));
      const closedId = TabsStore.get('activeTabId');
      newTab();
      recordMainContent(state({ view: 'db:view', id: 'db:b' }));

      closeTabsForView('db:a');

      const tabs = TabsStore.get('tabs');

      expect(tabs).toHaveLength(1);
      expect(tabs.some((tab) => tab.id === closedId)).toBe(false);
    });

    it('clears the split when only the split view id matches', () => {
      newTab();
      recordMainContent(
        state(
          { view: 'db:view', id: 'db:main' },
          { view: 'db:view', id: 'db:split' },
          60,
        ),
      );

      closeTabsForView('db:split');

      const tab = TabsStore.get('tabs')[0];

      expect(tab.split).toBeNull();
      expect(tab.main?.id).toBe('db:main');
    });
  });
});
