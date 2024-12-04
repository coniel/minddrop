import { Assets } from '@minddrop/assets';
import { Events } from '@minddrop/events';
import { Block } from '@minddrop/blocks';
import { DocumentAssetsHandler } from '../DocumentAssetsHandler';
import { getDocument } from '../getDocument';
import { BlockDocumentMap, DocumentViewDocumentMap } from '../DocumentsStore';
import { writeDocument } from '../writeDocument';
import { serializeDocumentToJsonString } from '../utils';
import { DocumentView } from '../types';
import { loadDocuments } from '../loadDocuments';

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
        writeUpdatedDocumentToFile(documentId);
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
        writeUpdatedDocumentToFile(documentId);
      }
    },
  );

  // Write updated document to file when a block is deleted
  Events.addListener<Block>(
    'blocks:block:delete',
    'update-document-on-block-change',
    ({ data: block }) => {
      const documentId = BlockDocumentMap.get(block.id);

      if (documentId) {
        writeUpdatedDocumentToFile(documentId);
      }
    },
  );

  // Write updated document to file when a view is deleted
  Events.addListener<DocumentView>(
    'documents:view:delete',
    'update-document-on-view-change',
    ({ data: view }) => {
      const documentId = DocumentViewDocumentMap.get(view.id);

      if (documentId) {
        writeUpdatedDocumentToFile(documentId);
      }
    },
  );
}

function writeUpdatedDocumentToFile(documentId: string) {
  const document = getDocument(documentId);

  if (!document) {
    return;
  }

  // Write updated document to file
  writeDocument(document.path, serializeDocumentToJsonString(document.id));
}
