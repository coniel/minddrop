import { TranslationKey } from '@minddrop/i18n';
import { Views } from '@minddrop/views';
import { Tab, TabView } from '../TabSetsStore';

// Separates the two pane titles of a split tab's label
const SPLIT_SEPARATOR = ' | ';

/**
 * Returns the label of a tab: its view's title, or both pane titles
 * when the tab is split.
 *
 * @param tab - The tab to label.
 * @param blankLabel - The label used for panes without a title.
 * @param translate - Translates the registered title of views with a fixed label.
 */
export function getTabLabel(
  tab: Tab,
  blankLabel: string,
  translate: (key: TranslationKey) => string,
): string {
  // Label the main pane, falling back to the blank label
  const mainLabel = paneLabel(tab.main, translate) ?? blankLabel;

  // Unsplit tabs are labelled by their main pane alone
  if (!tab.split) {
    return mainLabel;
  }

  // Label the split pane, falling back to the blank label
  const splitLabel = paneLabel(tab.split, translate) ?? blankLabel;

  // Combine both pane labels
  return `${mainLabel}${SPLIT_SEPARATOR}${splitLabel}`;
}

/**
 * Returns the label of a pane's view, which is its own title or the
 * translated title of its registration. Undefined when the pane is
 * empty or its view has neither.
 */
function paneLabel(
  view: TabView | null,
  translate: (key: TranslationKey) => string,
): string | undefined {
  // Nothing to label
  if (!view) {
    return undefined;
  }

  // Views showing an entity within themselves are labelled by it
  if (view.subview?.title) {
    return view.subview.title;
  }

  // Views opened for a specific entity carry its title
  if (view.title) {
    return view.title;
  }

  // Views with a fixed label provide it at registration
  const registered = Views.get(view.view);

  return registered?.title ? translate(registered.title) : undefined;
}
