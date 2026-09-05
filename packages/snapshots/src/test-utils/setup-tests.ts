import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';

export const MockFs = initializeMockFileSystem();
export const mockDate = new Date('2026-06-01T00:00:00.000Z');

export function setup() {
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export function cleanup() {
  vi.clearAllMocks();
  MockFs.reset();
  Events.tests.cleanup();
  vi.useRealTimers();
}
