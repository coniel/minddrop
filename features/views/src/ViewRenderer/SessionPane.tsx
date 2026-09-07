import { FC } from 'react';
import { ViewDescriptor, ViewPane, Views } from '@minddrop/views';
import { SessionViewStateProvider } from '../SessionViewStateProvider';
import { RegisteredView } from './RegisteredView';

interface SessionPaneProps {
  /**
   * The id of the view area the pane belongs to.
   */
  viewAreaId: string;

  /**
   * The id of the session the pane shows, or null when the view area
   * has no active session.
   */
  sessionId: string | null;

  /**
   * The pane the view is rendered in.
   */
  pane: ViewPane;

  /**
   * The view to render in the pane.
   */
  descriptor: ViewDescriptor;
}

/**
 * Renders a pane's view within its session and pane contexts, so
 * that session-scoped state written by the view lands on its own
 * session.
 */
export const SessionPane: FC<SessionPaneProps> = ({
  viewAreaId,
  sessionId,
  pane,
  descriptor,
}) => {
  const content = (
    <Views.PaneProvider viewAreaId={viewAreaId} pane={pane}>
      <SessionViewStateProvider>
        <RegisteredView
          descriptor={descriptor}
          viewAreaId={viewAreaId}
          pane={pane}
        />
      </SessionViewStateProvider>
    </Views.PaneProvider>
  );

  // Render the view outside of a session when the view area has none
  if (!sessionId) {
    return content;
  }

  return (
    <Views.SessionProvider sessionId={sessionId}>
      {content}
    </Views.SessionProvider>
  );
};
