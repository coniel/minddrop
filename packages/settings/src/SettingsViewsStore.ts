import { createObjectStore } from '@minddrop/stores';
import { SettingsView } from './types';

export const SettingsViewsStore = createObjectStore<SettingsView>(
  'Settings:Views',
  'id',
);

/**
 * Retrieves all registered settings views in registration order.
 *
 * @returns An array of all registered settings views.
 */
export const useSettingsViews = (): SettingsView[] => {
  return SettingsViewsStore.useAllItemsArray();
};
