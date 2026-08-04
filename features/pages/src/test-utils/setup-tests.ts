import { vi } from 'vitest';
import { DesignFixtures, Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { Pages } from '@minddrop/pages';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

const { designs } = DesignFixtures;

initializeI18n();

// happy-dom does not implement Element.getAnimations, which the
// scroll area primitive polls on a timer
if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

export const MockFs = initializeMockFileSystem([]);

export function setup() {
  // Load designs so page layouts resolve from the layouts store
  Designs.Store.load(designs);
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
  MockFs.reset();
  Events._clearAll();
  Designs.Store.clear();
  Pages.Store.clear();
}
