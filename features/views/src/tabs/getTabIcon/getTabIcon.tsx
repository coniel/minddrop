import { ContentIcon, IconProp } from '@minddrop/ui-primitives';
import { ViewSession, Views } from '@minddrop/views';
import { DEFAULT_ICON } from '../tabsConstants';

/**
 * Returns the icon of a tab: the content icon of the entity shown in
 * its session's main pane, falling back to that view's registered
 * icon and then to the default tab icon.
 *
 * @param session - The session of the tab to icon.
 */
export function getTabIcon(session: ViewSession): IconProp {
  // Views showing an entity within themselves are iconed by it
  if (session.main?.subview?.icon) {
    return <ContentIcon icon={session.main.subview.icon} />;
  }

  // Views opened for a specific entity carry its content icon, which
  // the user can change.
  if (session.main?.contentIcon) {
    return <ContentIcon icon={session.main.contentIcon} />;
  }

  // Views with a fixed icon provide it at registration
  const registered = session.main ? Views.get(session.main.view) : null;

  return registered?.icon ?? DEFAULT_ICON;
}
