import { createKeyValueStore } from '@minddrop/stores';

export interface TabView {
  /**
   * Identifier for the view type, following the convention
   * `[package]:view:[name]`.
   */
  view: string;

  /**
   * Unique id for this view instance, used to match the view for
   * updates or closing.
   */
  id?: string;

  /**
   * Props passed to the view component.
   */
  props?: unknown;

  /**
   * The tab's display title, when it is a literal string
   * (e.g. a database or entry name). Views with a static label
   * (e.g. the design studio) leave this unset and are labelled by
   * the tab component.
   */
  title?: string;

  /**
   * The tab's icon as a serializable icon string.
   */
  icon: string;
}

export interface Tab {
  /**
   * Unique identifier for the tab.
   */
  id: string;

  /**
   * The view shown in the main (left) pane, or null when the tab
   * is blank.
   */
  main: TabView | null;

  /**
   * The view shown in the split (right) pane, or null when the
   * tab has no split.
   */
  split: TabView | null;

  /**
   * The width of the main (left) pane as a percentage (0-100).
   */
  splitRatio: number;
}

export interface TabsState {
  /**
   * The ordered list of open tabs.
   */
  tabs: Tab[];

  /**
   * The id of the currently active tab, or null when there are
   * no tabs.
   */
  activeTabId: string | null;
}

const defaultState: TabsState = {
  tabs: [],
  activeTabId: null,
};

export const TabsStore = createKeyValueStore<TabsState>(
  'App:Tabs',
  defaultState,
  {
    persistTo: 'workspace-config',
    namespace: 'tabs',
  },
);
