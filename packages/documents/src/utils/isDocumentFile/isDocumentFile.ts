import { DocumentTypeConfigsStore } from '../../DocumentTypeConfigsStore';

/**
 * Returns true if the path is a registered document file type.
 *
 * @param path - The path to check.
 * @returns True if the path is a document file.
 */
export function isDocumentFile(path: string): boolean {
  // Get all document type configs
  const configs = DocumentTypeConfigsStore.getAll();
  // Get possible file types from the configs
  const fileTypes = Object.keys(configs).map((key) => configs[key].fileType);
  // Get the path's file extension
  const fileExtension = path.split('.').pop() || '';

  // Check if the file extension is in the list of file types
  return fileTypes.includes(fileExtension);
}
