import { Fs, InvalidPathError, PathConflictError } from '@minddrop/file-system';

/**
 * Creates a new page file inside the specified path.
 *
 * @param parentDir - The path to the parent directory.
 * @param title - The page title, used as the file name.
 * @param options - File creation options.
 * @param options.wrap - Whether the page should be wrapped in a directory of the same name.
 * @returns The new page file path.
 *
 * @throws {InvalidPathError} - The parent dir does not exist.
 * @throws {PathConflictError} - Page already exists.
 */
export async function createPageFile(
  parentDir: string,
  title: string,
  options: { wrap?: boolean } = {},
): Promise<string> {
  // Markdown file name
  const fileName = `${title}.md`;
  // Genereate new page path
  const pageFilePath = options.wrap
    ? Fs.concatPath(parentDir, title, fileName)
    : Fs.concatPath(parentDir, fileName);

  // Ensure parent dir exists
  if (!(await Fs.exists(parentDir))) {
    throw new InvalidPathError(parentDir);
  }

  // Ensure page does not already exist
  if (await Fs.exists(pageFilePath)) {
    throw new PathConflictError(pageFilePath);
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

  // Create the empty page file
  await Fs.writeTextFile(pageFilePath, '');

  return pageFilePath;
}
