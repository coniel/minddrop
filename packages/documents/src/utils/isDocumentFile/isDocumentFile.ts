/**
 * Returns true if the path is a .minddrop file.
 *
 * @param path - The path to check.
 * @returns True if the path is a document file.
 */
export function isDocumentFile(path: string): boolean {
  // Get the path's file extension
  const fileExtension = path.split('.').pop() || '';

  return fileExtension === 'minddrop';
}
