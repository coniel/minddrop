import { vi } from 'vitest';
import { PagesStore } from '../PagesStore';

export function setup() {}

export function cleanup() {
  vi.clearAllMocks();

  // Clear the pages store
  PagesStore.getState().clear();
}
