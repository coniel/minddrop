import { Fs, InvalidPathError, PathConflictError } from '@minddrop/file-system';

/**
 * Creates a new document file inside the specified path.
 *
 * @param parentDir - The path to the parent directory.
 * @param title - The document title, used as the file name.
 * @param content - The initial content of the document.
 * @param options - File creation options.
 * @param options.wrap - Whether the document should be wrapped in a directory of the same name.
 * @returns The new document file path.
 *
 * @throws {InvalidPathError} - The parent dir does not exist.
 * @throws {PathConflictError} - Document already exists.
 */
export async function createDocumentFile(
  parentDir: string,
  title: string,
  content: string,
  options: { wrap?: boolean } = {},
): Promise<string> {
  // Generate file name
  const fileName = `${title}.minddrop`;
  // Genereate new document path
  const documentFilePath = options.wrap
    ? Fs.concatPath(parentDir, title, fileName)
    : Fs.concatPath(parentDir, fileName);

  // Ensure parent dir exists
  if (!(await Fs.exists(parentDir))) {
    throw new InvalidPathError(parentDir);
  }

  // Ensure document does not already exist
  if (await Fs.exists(documentFilePath)) {
    throw new PathConflictError(documentFilePath);
  }

  if (options.wrap) {
    const wrapDirPath = Fs.concatPath(parentDir, title);

    // Ensure wrap directory does not already exist
    if (await Fs.exists(wrapDirPath)) {
      throw new PathConflictError(wrapDirPath);
    }

    // Create the wrapped directory
    await Fs.createDir(wrapDirPath);
  }

  // Create the empty document file
  await Fs.writeTextFile(documentFilePath, content);

  return documentFilePath;
}
