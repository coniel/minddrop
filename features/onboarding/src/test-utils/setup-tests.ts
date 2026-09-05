import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { Workspaces } from '@minddrop/workspaces';
import { locales } from '../locales';

initializeI18n();
I18n.registerTranslations(locales);

// happy-dom does not implement Element.getAnimations, which the
// scroll area primitive polls on a timer
if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

// The folder used as the workspace location in tests
export const parentDirPath = 'Users/test/Documents';

export const MockFs = initializeMockFileSystem([
  `${parentDirPath}/placeholder.md`,
]);

export function setup() {}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
  MockFs.reset();
  Events.tests.cleanup();
  Workspaces.Store.clear();
}
