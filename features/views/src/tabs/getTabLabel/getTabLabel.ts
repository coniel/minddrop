import { TranslationKey } from '@minddrop/i18n';
import { SessionView, ViewSession, Views } from '@minddrop/views';

// Separates the two pane titles of a split tab's label
const SPLIT_SEPARATOR = ' | ';

/**
 * Returns the label of a tab: its view's title, or both pane titles
 * when its session is split.
 *
 * @param session - The session of the tab to label.
 * @param blankLabel - The label used for panes without a title.
 * @param translate - Translates the registered title of views with a fixed label.
 */
export function getTabLabel(
  session: ViewSession,
  blankLabel: string,
  translate: (key: TranslationKey) => string,
): string {
  // Label the main pane, falling back to the blank label
  const mainLabel = paneLabel(session.main, translate) ?? blankLabel;

  // Unsplit sessions are labelled by their main pane alone
  if (!session.split) {
    return mainLabel;
  }

  // Label the split pane, falling back to the blank label
  const splitLabel = paneLabel(session.split, translate) ?? blankLabel;

  // Combine both pane labels
  return `${mainLabel}${SPLIT_SEPARATOR}${splitLabel}`;
}

/**
 * Returns the label of a pane's view: the label or title of the
 * subview it shows, else its own title, else the translated title of
 * its registration. Undefined when the pane is empty or its view has
 * none of these.
 */
function paneLabel(
  view: SessionView | null,
  translate: (key: TranslationKey) => string,
): string | undefined {
  // Nothing to label
  if (!view) {
    return undefined;
  }

  // Views showing an entity within themselves are labelled by it,
  // or by the label it provides for the tab.
  const subviewLabel = view.subview?.label ?? view.subview?.title;

  if (subviewLabel) {
    return subviewLabel;
  }

  // Views opened for a specific entity carry its title
  if (view.title) {
    return view.title;
  }

  // Views with a fixed label provide it at registration
  const registered = Views.get(view.view);

  return registered?.title ? translate(registered.title) : undefined;
}
