// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { vi } from 'vitest';
import { DataViews } from '@minddrop/data-views';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { Spaces } from '@minddrop/spaces';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

initializeI18n();

// happy-dom does not implement Element.getAnimations, which the
// scroll area primitive polls on a timer.
if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

export const MockFs = initializeMockFileSystem([]);

export function setup() {}

export async function cleanup(): Promise<void> {
  cleanupRender();
  vi.clearAllMocks();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  await Events.tests.cleanup();
  Spaces.Store.clear();
  DataViews.Store.clear();
}
