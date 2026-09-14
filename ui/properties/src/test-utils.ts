import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeI18n } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

initializeI18n();

// Register the property translations the labels use
Properties.initialize();

export function setup() {}

export async function cleanup(): Promise<void> {
  cleanupRender();
  await Events.tests.cleanup();
  vi.clearAllMocks();
}
