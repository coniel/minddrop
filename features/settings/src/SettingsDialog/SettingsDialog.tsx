import { useEffect, useState } from 'react';
import { Events } from '@minddrop/events';
import { SettingsViews } from '@minddrop/settings';
import {
  Dialog,
  DialogClose,
  DialogRoot,
  Heading,
  IconButton,
  MenuGroup,
  MenuItem,
  Stack,
  Text,
  VerticalScrollArea,
} from '@minddrop/ui-primitives';
import { OpenSettingsEvent, SettingsFeatureEventListenerId } from '../events';
import './SettingsDialog.css';

/**
 * Renders the app settings dialog: a navigation column listing the
 * registered settings views alongside the selected view's content.
 * Listens for open settings events.
 */
export const SettingsDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  // The selected settings view's ID, kept across the dialog closing
  // so it reopens where the user left off.
  const [selectedViewId, setSelectedViewId] = useState<string | null>(null);
  // The registered settings views, in registration order
  const settingsViews = SettingsViews.useAll();
  // The selected settings view, falling back to the first registered
  const activeView =
    settingsViews.find((registered) => registered.id === selectedViewId) ??
    settingsViews[0];

  // Open the dialog on open settings events, switching to the
  // requested settings view when one is given.
  useEffect(() => {
    Events.addListener(
      OpenSettingsEvent,
      SettingsFeatureEventListenerId,
      (data) => {
        if (data.view) {
          setSelectedViewId(data.view);
        }

        setOpen(true);
      },
    );

    return () => {
      Events.removeListener(OpenSettingsEvent, SettingsFeatureEventListenerId);
    };
  }, []);

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <Dialog noPadding className="settings-dialog">
        {/* Settings view navigation */}
        <Stack className="settings-dialog-nav" gap={2}>
          <Heading
            as="h2"
            noMargin
            className="settings-dialog-title"
            text="settings.title"
          />
          <MenuGroup>
            {settingsViews.map((settingsView) => (
              <MenuItem
                key={settingsView.id}
                muted
                icon={settingsView.icon}
                label={settingsView.label}
                active={settingsView.id === activeView?.id}
                onClick={() => setSelectedViewId(settingsView.id)}
              />
            ))}
          </MenuGroup>
        </Stack>

        {/* Selected settings view's content */}
        <div className="settings-dialog-main">
          <div className="settings-dialog-header">
            <DialogClose
              render={
                <IconButton label="actions.close" icon="x" color="muted" />
              }
            />
          </div>
          <VerticalScrollArea className="settings-dialog-content">
            {activeView && (
              <Stack className="settings-dialog-section" gap={6}>
                {/* Page heading: the view's title and description */}
                <Stack gap={1}>
                  <Heading as="h1" noMargin text={activeView.label} />
                  <Text color="muted" text={activeView.description} />
                </Stack>

                {/* The view's settings content */}
                <activeView.component />
              </Stack>
            )}
          </VerticalScrollArea>
        </div>
      </Dialog>
    </DialogRoot>
  );
};
