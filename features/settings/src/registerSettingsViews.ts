import { Views } from '@minddrop/views';
import { SettingsView } from './SettingsView';
import { SettingsIcon, SettingsViewName, SettingsViewTitle } from './constants';

/**
 * Registers the settings views.
 */
export function registerSettingsViews(): void {
  // Register the app settings view
  Views.register({
    type: SettingsViewName,
    component: SettingsView,
    title: SettingsViewTitle,
    icon: SettingsIcon,
  });
}
