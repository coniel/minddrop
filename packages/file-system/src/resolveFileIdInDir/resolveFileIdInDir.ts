/**
 * Resolves the ID of a file named by its ID. The file must be directly
 * inside the directory and have the given extension.
 *
 * @param path - The path of the file.
 * @param dirPath - The path of the directory holding the files.
 * @param extension - The files' extension, without the leading dot.
 * @returns The file name without its extension, or null if the path is not such a file.
 */
export function resolveFileIdInDir(
  path: string,
  dirPath: string,
  extension: string,
): string | null {
  // Add the leading dot to the extension
  const suffix = `.${extension}`;

  // Ignore paths outside the directory
  if (!path.startsWith(`${dirPath}/`)) {
    return null;
  }

  // Get the path relative to the directory
  const fileName = path.slice(dirPath.length + 1);

  // Ignore paths nested below the directory, files with another
  // extension and files named only by the extension.
  if (
    fileName.includes('/') ||
    !fileName.endsWith(suffix) ||
    fileName.length === suffix.length
  ) {
    return null;
  }

  // Strip the extension
  return fileName.slice(0, -suffix.length);
}
