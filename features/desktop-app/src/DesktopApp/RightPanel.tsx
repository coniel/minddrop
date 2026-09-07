import React, { useEffect, useState } from 'react';
import { Events } from '@minddrop/events';
import { OpenViewEventData, Views } from '@minddrop/views';

/**
 * The shell's right panel, rendering the view last sent to it until
 * it is closed.
 */
export const RightPanel: React.FC = () => {
  const [view, setView] = useState<OpenViewEventData | null>(null);

  useEffect(() => {
    // Show the view sent to the right panel
    Events.addListener(Events.events.OpenRightPanel, 'desktop-app', (data) => {
      setView(data);
    });

    // Clear the right panel
    Events.addListener(Events.events.CloseRightPanel, 'desktop-app', () => {
      setView(null);
    });

    return () => {
      Events.removeListener(Events.events.OpenRightPanel, 'desktop-app');
      Events.removeListener(Events.events.CloseRightPanel, 'desktop-app');
    };
  }, []);

  // Render nothing when the right panel is empty
  if (!view) {
    return null;
  }

  return (
    <div className="right-panel">
      <RegisteredView view={view} />
    </div>
  );
};

interface RegisteredViewProps {
  /**
   * The view to resolve and render, along with its props.
   */
  view: OpenViewEventData;
}

/**
 * Resolves a registered view by id and renders it with its props.
 */
const RegisteredView: React.FC<RegisteredViewProps> = ({ view }) => {
  const registered = Views.use(view.view);

  if (!registered) {
    return null;
  }

  const ViewComponent = registered.component;

  return <ViewComponent {...view.props} />;
};
