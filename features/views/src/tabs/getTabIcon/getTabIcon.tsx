import { ContentIcon, IconProp } from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { Tab } from '../TabSetsStore';
import { DEFAULT_ICON } from '../tabsConstants';

/**
 * Returns the icon of a tab: the content icon of the entity shown in
 * its main pane, falling back to that view's registered icon and then
 * to the default tab icon.
 *
 * @param tab - The tab to icon.
 */
export function getTabIcon(tab: Tab): IconProp {
  // Views opened for a specific entity carry its content icon, which
  // the user can change
  if (tab.main?.icon) {
    return <ContentIcon icon={tab.main.icon} />;
  }

  // Views with a fixed icon provide it at registration
  const registered = tab.main ? Views.get(tab.main.view) : null;

  return registered?.icon ?? DEFAULT_ICON;
}
