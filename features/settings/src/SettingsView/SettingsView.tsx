import { useEffect } from 'react';
import { Events } from '@minddrop/events';
import { SettingsViews } from '@minddrop/settings';
import {
  Group,
  Heading,
  Stack,
  Text,
  VerticalScrollArea,
} from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { SettingsSidebar } from '../SettingsSidebar';
import { SettingsViewProps } from '../events';
import './SettingsView.css';

/**
 * Renders the app settings view: the settings sidebar in place of
 * the app sidebar, with the open settings view's content.
 */
export const SettingsView: React.FC<SettingsViewProps> = ({ view }) => {
  // The registered settings views, in registration order
  const settingsViews = SettingsViews.useAll();
  // The open settings view, falling back to the first registered
  const activeView =
    settingsViews.find((registered) => registered.id === view) ??
    settingsViews[0];

  // Swap the app sidebar for the settings sidebar
  useEffect(() => {
    Events.dispatch(Events.events.CloseAppSidebar);

    return () => {
      Events.dispatch(Events.events.OpenAppSidebar);
      Events.dispatch(Events.events.SetNavToolbarWidth, { width: 0 });
    };
  }, []);

  // While the settings view is open, the app's nav back button
  // exits it instead of navigating the tab history
  useEffect(() => {
    // Register the back action on the nav toolbar and listen for
    // its presses
    Events.dispatch(Events.events.SetNavToolbarBackAction, {
      label: 'settings.back',
    });
    Events.addListener(
      Events.events.NavToolbarBack,
      'settings-view',
      handleExit,
    );

    return () => {
      Events.dispatch(Events.events.SetNavToolbarBackAction, null);
      Events.removeListener(Events.events.NavToolbarBack, 'settings-view');
    };
  }, []);

  return (
    <Group className="settings-view" align="stretch">
      {/* Settings view navigation */}
      <SettingsSidebar activeViewId={activeView?.id} />

      {/* Open settings view's content */}
      <VerticalScrollArea className="settings-view-content">
        {activeView && (
          <Stack className="settings-view-section" gap={6}>
            {/* Page heading: the view's title and description */}
            <Stack className="settings-view-header" gap={1}>
              <Heading as="h1" noMargin text={activeView.label} />
              <Text color="muted" text={activeView.description} />
            </Stack>

            {/* The view's settings content */}
            <activeView.component />
          </Stack>
        )}
      </VerticalScrollArea>
    </Group>
  );
};

// Exit the settings view by opening the default view
function handleExit() {
  Events.dispatch(Views.events.Open, { view: Views.constants.DefaultName });
}
