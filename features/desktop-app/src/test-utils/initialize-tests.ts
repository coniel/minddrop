import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
  Events._clearAll();
}
