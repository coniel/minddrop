import { getView } from '../../getView';
import {
  Breadcrumb,
  BreadcrumbLevel,
  SessionView,
  SubviewDescriptor,
  ViewPane,
  ViewSession,
} from '../../types';
import { sameView } from '../sameView';

/**
 * Returns the breadcrumb trail of a session pane's current view: the run
 * of previously shown views it was reached through, ordered root
 * first, each followed by the entity it showed. The run ends where
 * the hierarchy breaks, so navigating sideways or upwards starts a
 * new trail.
 *
 * The current view is trailed by its own crumb when it shows an
 * entity within itself, since the entity is what titles the view.
 *
 * @param session - The session whose history the trail is read from.
 * @param pane - The pane the trail belongs to.
 * @returns The crumbs leading to the pane's current view, ordered root first.
 */
export function resolveBreadcrumbTrail(
  session: ViewSession | null,
  pane: ViewPane,
): Breadcrumb[] {
  // Nothing to trail without a session
  if (!session) {
    return [];
  }

  const history = session.backHistory ?? [];
  const current = pane === 'split' ? session.split : session.main;
  const ancestors: SessionView[] = [];

  // The view each candidate ancestor is checked against, walking
  // backwards from the pane's current view.
  let target = current;

  // Walk the history from the most recent entry backwards, collecting
  // ancestors until the hierarchy breaks.
  for (let index = history.length - 1; index >= 0; index -= 1) {
    const candidate = history[index][pane];

    // The pane was empty at this point in the history, ending the trail
    if (!candidate || !target) {
      break;
    }

    // The view is already in the trail, showing a different entity or
    // left unchanged while the other pane navigated. Its nearest state
    // is the one trailed.
    if (sameView(candidate, target)) {
      continue;
    }

    // The trail ends where navigation was not a step down the hierarchy
    if (!extendsTrail(candidate, target)) {
      break;
    }

    ancestors.unshift(candidate);

    // Ancestors are checked against the view they led to
    target = candidate;
  }

  // Each ancestor contributes a crumb for itself, and one for the
  // entity it showed, both navigating back to it.
  const trail = ancestors.flatMap((ancestor, index) =>
    toCrumbs(
      ancestor,
      ancestors.length - index,
      ancestors[index + 1] ?? current,
    ),
  );

  // The current view's own crumb precedes the entity titling it
  if (current?.subview) {
    trail.push(toViewCrumb(current));
  }

  return trail;
}

/**
 * Returns the crumbs of a view in the history: the view itself, and
 * the entity it showed within itself.
 *
 * @param sessionView - The view to crumb.
 * @param steps - How many entries back in the history the view sits.
 * @param ledTo - The view navigated to from it.
 */
function toCrumbs(
  sessionView: SessionView,
  steps: number,
  ledTo: SessionView | null | undefined,
): Breadcrumb[] {
  const viewCrumb = { ...toViewCrumb(sessionView), steps };

  // The view showed no entity within itself, or the entity it showed
  // is the view it led to (e.g. a selection opened in a view of its
  // own), which the trail continues with.
  if (!sessionView.subview || showsSame(sessionView.subview, ledTo)) {
    return [viewCrumb];
  }

  return [
    viewCrumb,
    {
      view: sessionView.view,
      viewId: sessionView.id,
      title: sessionView.subview.title,
      icon: sessionView.subview.icon,
      contentIcon: sessionView.subview.contentIcon,
      steps,
    },
  ];
}

/**
 * Whether a view shows the same entity as a subview, which it does
 * when opened from it.
 */
function showsSame(
  subview: SubviewDescriptor,
  sessionView: SessionView | null | undefined,
): boolean {
  return (
    subview.title === sessionView?.title &&
    subview.contentIcon === sessionView?.contentIcon
  );
}

/**
 * Returns the crumb of a view itself. Views with a fixed label carry
 * no title of their own and are labelled from their registration.
 */
function toViewCrumb(sessionView: SessionView): Breadcrumb {
  return {
    view: sessionView.view,
    viewId: sessionView.id,
    title: sessionView.title,
    contentIcon: sessionView.contentIcon,
  };
}

/**
 * Whether navigating from one view to another is a step down the
 * hierarchy, which extends the trail rather than starting a new one.
 */
function extendsTrail(source: SessionView, target: SessionView): boolean {
  // Views opened from outside a view area (e.g. the app sidebar) are
  // navigated to rather than reached through the current view.
  if (target.startsTrail) {
    return false;
  }

  const targetLevel = breadcrumbLevel(target);

  // Views passed through rather than navigated to are neither trailed
  // nor trailing.
  if (breadcrumbLevel(source) === 'none' || targetLevel === 'none') {
    return false;
  }

  // Roots always start a new trail
  if (targetLevel === 'root') {
    return false;
  }

  // Leaves stack onto whatever they were opened from
  if (targetLevel === 'leaf') {
    return true;
  }

  // Branches only extend the trail of a root
  return breadcrumbLevel(source) === 'root';
}

/**
 * Returns a view's registered breadcrumb level, defaulting to `root`
 * for views which do not declare one.
 */
function breadcrumbLevel(sessionView: SessionView): BreadcrumbLevel {
  return getView(sessionView.view)?.breadcrumbLevel ?? 'root';
}
