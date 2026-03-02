import { vi } from 'vitest';
import { Ast } from '@minddrop/ast';
import { Events } from '@minddrop/events';
import { initializeExtensions } from '@minddrop/extensions';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

export function setup() {
  Ast.registerDefaultConfigs();
  initializeExtensions([]);
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
  Events._clearAll();
}
