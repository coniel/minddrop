import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeI18n } from '@minddrop/i18n';
import { SettingsViews } from '@minddrop/settings';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

initializeI18n();

export async function cleanup(): Promise<void> {
  // Unmount rendered components
  cleanupRender();

  // Clear registered settings views and event listeners
  SettingsViews.Store.clear();
  await Events.tests.cleanup();
  vi.clearAllMocks();
}
