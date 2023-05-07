import { Fs, InvalidParameterError } from '@minddrop/core';
import { updateMarkdownHeading } from '../updateMarkdownHeading';

/**
 * Updates the heading of a markdown file.
 *
 * @param path - The path to the markdown file.
 * @param heading - The new heading text.
 */
export async function updateMarkdownFileHeading(
  path: string,
  heading: string,
): Promise<void> {
  // Ensure the file exists
  if (!(await Fs.exists(path))) {
    throw new InvalidParameterError(`markdown file '${path}' does not exist`);
  }

  // Get the file contents
  let md = await Fs.readTextFile(path);

  // Update the heading
  md = updateMarkdownHeading(md, heading);

  // Write the updated markdown back to the file
  await Fs.writeTextFile(path, md);
}
