import { useLayoutEffect } from 'react';
import { Events, SetNavToolbarWidthEvent } from '@minddrop/events';
import { SettingsViews } from '@minddrop/settings';
import { Sidebar } from '@minddrop/ui-components';
import { MenuGroup, MenuItem } from '@minddrop/ui-primitives';
import { UpdateViewEvent } from '@minddrop/views';
import { SettingsUiState } from './SettingsUiState';
import { SettingsViewId } from './constants';

export interface SettingsSidebarProps {
  /**
   * The ID of the currently open settings view.
   */
  activeViewId?: string;
}

/**
 * Renders the settings sidebar: a menu item per registered
 * settings view.
 */
export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeViewId,
}) => {
  const sidebarWidth = SettingsUiState.useValue('sidebarWidth');
  // The registered settings views, in registration order
  const settingsViews = SettingsViews.useAll();

  // Keep the nav toolbar sized to match the sidebar
  useLayoutEffect(() => {
    Events.dispatch(SetNavToolbarWidthEvent, { width: sidebarWidth });
  }, [sidebarWidth]);

  function handleResize(width: number) {
    Events.dispatch(SetNavToolbarWidthEvent, { width });
  }

  function handleResized(width: number) {
    SettingsUiState.set('sidebarWidth', width);
  }

  // Record the selected settings view on the app view so the
  // selection survives the view remounting on tab switches
  function handleSelectView(settingsViewId: string) {
    Events.dispatch(UpdateViewEvent, {
      id: SettingsViewId,
      props: { view: settingsViewId },
    });
  }

  return (
    <Sidebar
      width={sidebarWidth}
      onResize={handleResize}
      onResized={handleResized}
    >
      <MenuGroup>
        {settingsViews.map((settingsView) => (
          <MenuItem
            key={settingsView.id}
            muted
            icon={settingsView.icon}
            label={settingsView.label}
            active={settingsView.id === activeViewId}
            onClick={() => handleSelectView(settingsView.id)}
          />
        ))}
      </MenuGroup>
    </Sidebar>
  );
};
