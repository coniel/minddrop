import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeI18n } from '@minddrop/i18n';
import { SettingsViews } from '@minddrop/settings';

initializeI18n();

export function cleanup() {
  // Clear registered settings views and event listeners
  SettingsViews.Store.clear();
  Events.tests.cleanup();
  vi.clearAllMocks();
}
