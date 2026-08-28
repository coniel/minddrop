import { SettingsViewsStore } from '../SettingsViewsStore';
import { SettingsView } from '../types';

/**
 * Registers a settings view, adding its menu item to the settings
 * sidebar. Registration order determines menu order.
 *
 * @param view - The settings view to register.
 */
export function registerSettingsView(view: SettingsView): void {
  // Add the view to the settings views store
  SettingsViewsStore.set(view);
}
