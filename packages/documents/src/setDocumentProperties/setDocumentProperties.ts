import { DocumentProperties, Document } from '../types';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import { updateDocument } from '../updateDocument';

/**
 * Set the given properties on the document at the specified path,
 * preserving any existing properties.
 *
 * @param path - The path of the document to update.
 * @param properties - The properties to set on the document.
 * @returns The updated document.
 *
 * @throws {DocumentNotFoundError} - If the document does not exist.
 * @throws {FileNotFoundError} - If the document's file does not exist.
 * @throws {DocumentTypeConfigNotFoundError} - If the document type config is not reigstered.
 * @dispatches 'documents:document:update'
 */
export async function setDocumentProperties(
  path: string,
  properties: Partial<DocumentProperties>,
): Promise<Document> {
  const document = getDocument(path);

  if (!document) {
    throw new DocumentNotFoundError(path);
  }

  // Merge the new properties with the existing properties
  const updatedProperties = {
    ...document.properties,
    // Remove properties with undefined values
    ...Object.entries(properties).reduce((props, [key, value]) => {
      if (value !== undefined) {
        props[key] = value;
      }

      return props;
    }, {} as DocumentProperties),
  };

  return updateDocument(path, { properties: updatedProperties });
}
