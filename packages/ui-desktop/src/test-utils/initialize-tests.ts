import { vi } from 'vitest';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

export function setup() {}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
}
