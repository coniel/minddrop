import { vi } from 'vitest';
import { Ast } from '@minddrop/ast';
import DocumentBoardView from '@minddrop/board-view';
import NodeTypeLinkExtension from '@minddrop/bookmark-block';
import { Events } from '@minddrop/events';
import { initializeExtensions } from '@minddrop/extensions';
import NodeTypeImageExtension from '@minddrop/image-block';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import NodeTypeTextExtension from '@minddrop/text-block';
import { Workspaces } from '@minddrop/workspaces';

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
