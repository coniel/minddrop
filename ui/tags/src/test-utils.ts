import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import {
  MockFs,
  cleanupTagFixtures,
  setupTagFixtures,
} from '@minddrop/tags/test-utils';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

export function setup() {
  // Load tag fixtures into the stores and mock file system
  setupTagFixtures(MockFs);
}

export function cleanup() {
  cleanupRender();
  cleanupTagFixtures();
  Events.tests.cleanup();
  MockFs.reset();
  vi.clearAllMocks();
}
