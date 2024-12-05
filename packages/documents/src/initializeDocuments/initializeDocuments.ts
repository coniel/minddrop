import { Assets } from '@minddrop/assets';
import { Events } from '@minddrop/events';
import { Block } from '@minddrop/blocks';
import { DocumentAssetsHandler } from '../DocumentAssetsHandler';
import { getDocument } from '../getDocument';
import { BlockDocumentMap, DocumentViewDocumentMap } from '../DocumentsStore';
import { DocumentView, Document } from '../types';
import { loadDocuments } from '../loadDocuments';
import { DocumentViewTypeConfigsStore } from '../DocumentViewTypeConfigsStore';
import { getDocumentView } from '../getDocumentView';
import { updateDocumentView } from '../updateDocumentView';
import { updateDocument } from '../updateDocument';
import { writeDocument } from '../writeDocument';
import { serializeDocumentToJsonString } from '../utils';
import { Fs } from '@minddrop/file-system';

export async function initializeDocuments(
  sourcePaths: string[],
): Promise<void> {
  // Register an asset handler to handle document view and
  // block assets.
  Assets.registerHandler(DocumentAssetsHandler);

  // Load documents from provided source paths
  await loadDocuments(sourcePaths);

  // Write updated document to file when a block is updated
  Events.addListener<Block>(
    'blocks:block:update',
    'update-document-on-block-change',
    ({ data: block }) => {
      const documentId = BlockDocumentMap.get(block.id);

      if (documentId) {
        // Update the document to trigger write with updated
        // blocks and last modified timestamp.
        updateDocument(documentId, {});
      }
    },
  );

  // Write document to file when a view is updated
  Events.addListener<DocumentView>(
    'documents:view:update',
    'update-document-on-view-change',
    ({ data: view }) => {
      const documentId = DocumentViewDocumentMap.get(view.id);

      if (documentId) {
        // Update the document to trigger write with updated
        // views and last modified timestamp.
        const document = getDocument(documentId);

        if (document) {
          updateDocument(documentId, { blocks: document.blocks });
        }
      }
    },
  );

  // Write updated document to file when a block is deleted
  Events.addListener<Block>(
    'blocks:block:delete',
    'update-document-on-block-change',
    async ({ data: block }) => {
      const documentId = BlockDocumentMap.get(block.id);

      if (!documentId) {
        return;
      }

      const document = getDocument(documentId);

      if (!document) {
        return;
      }

      // Update the document to trigger write with updated
      // block, views, and last modified timestamp.
      updateDocument(documentId, {
        blocks: document.blocks.filter((id) => id !== block.id),
      });

      document.views.forEach((viewId) => {
        const view = getDocumentView(viewId);
        const config = DocumentViewTypeConfigsStore.get(view.type);

        if (!config) {
          return;
        }

        const updatedView = config.onRemoveBlocks(view, [block]);

        updateDocumentView(viewId, updatedView);
      });
    },
  );

  // Write updated document to file when a view is deleted
  Events.addListener<DocumentView>(
    'documents:view:delete',
    'update-document-on-view-change',
    ({ data: view }) => {
      const documentId = DocumentViewDocumentMap.get(view.id);

      if (!documentId) {
        return;
      }

      const document = getDocument(documentId);

      if (!document) {
        return;
      }

      // Update the document to trigger write with updated
      // views and last modified timestamp.
      updateDocument(documentId, {
        views: document.views.filter((id) => id !== view.id),
      });
    },
  );

  // Write updated document to file when a document is updated
  Events.addListener<Document>(
    'documents:document:update',
    'debounce-update',
    ({ data: document }) => {
      debounceUpdateDocument(document.id);
    },
  );
}

const debounceMap = new Map();

function debounceUpdateDocument(documentId: string) {
  // Clear any existing timer for the given documentId
  if (debounceMap.has(documentId)) {
    clearTimeout(debounceMap.get(documentId));
  }

  // Set a new timer for the given documentId
  const timer = setTimeout(async () => {
    const document = getDocument(documentId);

    if (!document) {
      return;
    }

    // Ensure the document file exists
    if (!(await Fs.exists(document.path))) {
      return;
    }

    // Write updated document to file
    writeDocument(document.path, serializeDocumentToJsonString(document.id));

    // Clean up the timer
    debounceMap.delete(documentId);
  }, 200);

  debounceMap.set(documentId, timer);
}
