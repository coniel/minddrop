import { BlockDocumentMap, DocumentViewDocumentMap } from '../DocumentsStore';
import { getDocumentAssetsDirPath } from '../getDocumentAssetsDirPath';
import { createDocumentAssetsDir } from '../createDocumentAssetsDir';
import { Fs } from '@minddrop/file-system';

function getResourceParentDocumentId(resourceId: string): string | null {
  return (
    BlockDocumentMap.get(resourceId) ||
    DocumentViewDocumentMap.get(resourceId) ||
    null
  );
}

function getDocumentResourceAssetsPath(resourceId: string): string | false {
  const documentId = getResourceParentDocumentId(resourceId);

  if (!documentId) {
    return false;
  }

  const documentAssetPath = getDocumentAssetsDirPath(documentId);

  return `${documentAssetPath}/${resourceId}`;
}

async function ensureDocumentResourceAssetsPath(
  resourceId: string,
): Promise<string | false> {
  const documentId = getResourceParentDocumentId(resourceId);

  if (!documentId) {
    return false;
  }

  // Get or create the document's assets directory
  const documentAssetPath = await createDocumentAssetsDir(documentId);

  // Path the the resource's assets directory
  const resourceAssetsPath = `${documentAssetPath}/${resourceId}`;

  // If the resource's assets directory does not exist, create it
  if (!(await Fs.exists(resourceAssetsPath))) {
    await Fs.createDir(resourceAssetsPath);
  }

  return resourceAssetsPath;
}

export const DocumentAssetsHandler = {
  id: 'documents',
  getResourceAssetsPath: getDocumentResourceAssetsPath,
  ensureResourceAssetsPath: ensureDocumentResourceAssetsPath,
};
