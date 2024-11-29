import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Workspaces } from '@minddrop/workspaces';
import { Ast } from '@minddrop/ast';
import { initializeExtensions } from '@minddrop/extensions';
import DocumentBoardView from '@minddrop/board-view';
import NodeTypeTextExtension from '@minddrop/text-block';
import NodeTypeImageExtension from '@minddrop/image-block';
import NodeTypeLinkExtension from '@minddrop/bookmark-block';

export function setup() {
  Ast.registerDefaultConfigs();
  initializeExtensions([
    DocumentBoardView,
    NodeTypeImageExtension,
    NodeTypeLinkExtension,
    NodeTypeTextExtension,
  ]);
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();

  Workspaces._clear();
  Events._clearAll();
}
