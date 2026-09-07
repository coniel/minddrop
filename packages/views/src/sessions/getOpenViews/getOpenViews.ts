import { SessionView } from '../../types';
import { ViewSessionsStore } from '../ViewSessionsStore';

/**
 * Returns the views open across every view area's sessions, including
 * both main and split panes.
 *
 * @param view - Filters the results to the given view type.
 * @returns The open session views.
 */
export function getOpenViews(view?: string): SessionView[] {
  // Collect the main/split views from every session in every view
  // area, guarding against hydrated sets without sessions.
  const views = ViewSessionsStore.getAllArray().flatMap((set) =>
    (set.sessions ?? []).flatMap((session) => [session.main, session.split]),
  );

  // Drop empty panes
  const openViews = views.filter((sessionView): sessionView is SessionView =>
    Boolean(sessionView),
  );

  // Filter by view type if given
  if (view) {
    return openViews.filter((sessionView) => sessionView.view === view);
  }

  return openViews;
}
