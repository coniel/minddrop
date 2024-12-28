import { Assets } from '@minddrop/assets';
import { Block, Blocks } from '@minddrop/blocks';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DocumentAssetsHandler } from '../DocumentAssetsHandler';
import { BlockDocumentMap, DocumentViewDocumentMap } from '../DocumentsStore';
import { createDocumentAssetsDir } from '../createDocumentAssetsDir';
import { getDocument } from '../getDocument';
import { getParentDocument } from '../getParentDocument';
import { loadDocuments } from '../loadDocuments';
import { removeBlocksFromDocument } from '../removeBlocksFromDocument';
import { Document, DocumentView } from '../types';
import { updateDocument } from '../updateDocument';
import { serializeDocumentToJsonString } from '../utils';
import { wrapDocument } from '../wrapDocument';
import { writeDocument } from '../writeDocument';

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

      removeBlocksFromDocument(documentId, [block.id]);
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

  // Move block file to trash when a file based block is deleted
  Events.addListener<Block>(
    'blocks:block:delete',
    'move-block-file-to-trash',
    async ({ data: block }) => {
      if (block.file) {
        const parentDocument = getParentDocument(block.id);

        if (
          !parentDocument ||
          !Fs.exists(parentDocument.path) ||
          !Fs.exists(block.file)
        ) {
          return;
        }

        Fs.trashFile(
          Fs.concatPath(Fs.parentDirPath(parentDocument.path), block.file),
        );
      }
    },
  );

  // Move assets when wrapping a document
  Events.addListener<{ oldPath: string; document: Document }>(
    'documents:document:wrap',
    'move-assets',
    async ({ data: { oldPath, document } }) => {
      const resourceIds = [document.id, ...document.blocks, ...document.views];
      const oldDocumentAssetsPath = Fs.concatPath(
        Fs.parentDirPath(oldPath),
        '.minddrop/assets',
      );
      let newDocumentAssetsPath = '';
      const assetsToMove: string[] = [];

      if (!(await Fs.exists(oldDocumentAssetsPath))) {
        // No assets to move
        return;
      }

      // Check if any blocks have associated assets
      await Promise.all(
        resourceIds.map(async (resourceId) => {
          const oldResourceAssetsPath = Fs.concatPath(
            oldDocumentAssetsPath,
            resourceId,
          );

          if (await Fs.exists(oldResourceAssetsPath)) {
            assetsToMove.push(resourceId);
          }
        }),
      );

      if (assetsToMove.length) {
        // Ensure that the document assets path exists
        newDocumentAssetsPath = await createDocumentAssetsDir(document.id);
      }

      // Move associated assets to the new document assets path
      assetsToMove.forEach(async (resourceId) => {
        const newResourceAssetsPath = Assets.getAssetsDirPath(resourceId);
        const oldResourceAssetsPath = Fs.concatPath(
          oldDocumentAssetsPath,
          resourceId,
        );

        if (!newResourceAssetsPath) {
          return;
        }

        Fs.rename(oldResourceAssetsPath, newResourceAssetsPath);
      });
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

    const updatedDocument = getDocument(documentId);

    if (!updatedDocument || updatedDocument.wrapped) {
      return;
    }

    // Check if the doucment contains blocks with files. If so, ensure
    // that the document is wrapped and move any associated files into
    // the wrapper dir.
    const blocks = Blocks.get(updatedDocument.blocks);

    const fileBlocks = blocks.filter((block) => block.file);

    if (fileBlocks.length) {
      // Wrap the document if it contains file blocks
      const wrappedPath = await wrapDocument(documentId);

      // Move associated files into the document wrapper dir
      fileBlocks.forEach((block) => {
        const filePath = Fs.concatPath(
          Fs.parentDirPath(document.path),
          block.file!,
        );
        const wrappedFilePath = Fs.concatPath(
          Fs.parentDirPath(wrappedPath),
          block.file!,
        );

        if (filePath !== wrappedFilePath) {
          Fs.rename(filePath, wrappedFilePath);
        }
      });
    }

    // Clean up the timer
    debounceMap.delete(documentId);
  }, 200);

  debounceMap.set(documentId, timer);
}
