import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Workspaces } from '@minddrop/workspaces';
import { Documents, DOCUMENTS_TEST_DATA } from '@minddrop/documents';
import { Ast } from '@minddrop/ast';

const { documentTypeConfig } = DOCUMENTS_TEST_DATA;

export function setup() {
  Ast.registerDefaultConfigs();
  Documents.register(documentTypeConfig);
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();

  Workspaces._clear();
  Events._clearAll();
}
