import { vi } from 'vitest';
import { DataViews } from '@minddrop/data-views';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { Spaces } from '@minddrop/spaces';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

initializeI18n();

// happy-dom does not implement Element.getAnimations, which the
// scroll area primitive polls on a timer
if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

export const MockFs = initializeMockFileSystem([]);

export function setup() {}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
  MockFs.reset();
  Events._clearAll();
  Spaces.Store.clear();
  DataViews.Store.clear();
}
