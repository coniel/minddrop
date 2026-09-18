import { MaxHistoryLength } from '../../constants';
import { ViewAreaChangedEventData } from '../../events';
import { SessionView, ViewDescriptor } from '../../types';
import { generateBlankViewSession } from '../generateBlankViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { sameView } from '../sameView';
import { toHistoryEntry } from '../toHistoryEntry';
import { toSessionView } from '../toSessionView';
import { updateViewSessionSet } from '../updateViewSessionSet';

/**
 * Records a view area state onto the session it belongs to, pushing
 * the session's previous state onto its back history when the state
 * is a new navigation. State belonging to no session is recorded onto
 * the active one, creating it first when none exists.
 *
 * @param viewAreaId - The id of the view area.
 * @param state - The view area state to record.
 */
export function recordViewArea(
  viewAreaId: string,
  state: ViewAreaChangedEventData,
): void {
  const set = getViewSessionSet(viewAreaId);
  let sessions = set.sessions;
  let activeSessionId = set.activeSessionId;

  // State belonging to a session which is gone is not recorded: the
  // session it was announced for has since been closed.
  if (state.sessionId && !sessions.some(({ id }) => id === state.sessionId)) {
    return;
  }

  // The session the state belongs to, which is the active one for
  // state announced by a view area holding no session of its own.
  let targetSessionId = state.sessionId ?? activeSessionId;

  // Ensure there is a session to record onto
  if (
    !targetSessionId ||
    !sessions.some((session) => session.id === targetSessionId)
  ) {
    // Generate a blank session and make it the active one
    const session = generateBlankViewSession();

    sessions = [...sessions, session];
    targetSessionId = session.id;
    activeSessionId = session.id;
  }

  // Record the state onto the session it belongs to, leaving the
  // others untouched.
  const nextSessions = sessions.map((session) => {
    // Leave the other sessions untouched
    if (session.id !== targetSessionId) {
      return session;
    }

    // Whether each pane shows a different view than before, as opposed
    // to a replay of its current state (e.g. a session restore) or a
    // metadata/split ratio refresh.
    const mainNavigated = !sameView(session.main, state.main);
    const splitNavigated = !sameView(session.split, state.split);

    // Whether a pane's view shows a different entity within itself,
    // which is navigated to without the view itself changing
    const subviewChanged =
      !sameSubview(session.main, state.main) ||
      !sameSubview(session.split, state.split);

    // Replaying states (e.g. a view selecting a default) are recorded
    // without becoming history.
    const navigated =
      !state.replace && (mainNavigated || splitNavigated || subviewChanged);

    // Push the previous state onto the back history on navigation,
    // except when navigating away from a blank session
    const backHistory =
      navigated && session.main
        ? [...(session.backHistory ?? []), toHistoryEntry(session)].slice(
            -MaxHistoryLength,
          )
        : (session.backHistory ?? []);

    // Navigating clears the forward history, replays preserve it
    const forwardHistory = navigated ? [] : (session.forwardHistory ?? []);

    // Reset the transient state of panes that navigated to a different
    // view (their history snapshot was captured above), keeping the
    // state of panes that merely replayed or changed subview.
    const viewState =
      mainNavigated || splitNavigated
        ? {
            main: mainNavigated ? {} : session.viewState?.main,
            split: splitNavigated ? {} : session.viewState?.split,
          }
        : session.viewState;

    // Drop the slot state when the main pane navigates to a different
    // view (its history snapshot was captured above), so the new view
    // starts from the shell's defaults. A replay or a subview change
    // keeps it, as does a split pane opening or closing.
    const slots = mainNavigated ? {} : session.slots;

    // Keep the session as it is when the state merely replays what it
    // already shows, so subscribers and the persisted set are left
    // untouched.
    if (
      !navigated &&
      sameSessionView(session.main, toSessionView(state.main)) &&
      sameSessionView(session.split, toSessionView(state.split)) &&
      session.splitRatio === state.splitRatio
    ) {
      return session;
    }

    // Overwrite the session's views and split ratio with the state
    return {
      ...session,
      main: toSessionView(state.main),
      split: toSessionView(state.split),
      splitRatio: state.splitRatio,
      backHistory,
      forwardHistory,
      viewState,
      slots,
    };
  });

  // Whether the recording changed anything at all
  const changed =
    activeSessionId !== set.activeSessionId ||
    nextSessions.some((session, index) => set.sessions[index] !== session);

  // Nothing to store when every session was left as it was
  if (!changed) {
    return;
  }

  // Store the updated sessions and active session
  updateViewSessionSet(viewAreaId, {
    sessions: nextSessions,
    activeSessionId,
  });
}

/**
 * Whether two views show the same thing, down to the metadata they
 * and their subview are labelled by.
 */
function sameSessionView(
  a: SessionView | null,
  b: SessionView | null,
): boolean {
  return (
    sameView(a, b) &&
    sameSubview(a, b) &&
    a?.title === b?.title &&
    a?.contentIcon === b?.contentIcon &&
    a?.subview?.title === b?.subview?.title &&
    a?.subview?.label === b?.subview?.label &&
    a?.subview?.icon === b?.subview?.icon &&
    a?.subview?.contentIcon === b?.subview?.contentIcon
  );
}

/**
 * Whether two views show the same entity within themselves.
 */
function sameSubview(
  a: SessionView | ViewDescriptor | null,
  b: SessionView | ViewDescriptor | null,
): boolean {
  return a?.subview?.id === b?.subview?.id;
}
