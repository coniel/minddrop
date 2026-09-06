import { Fs } from '@minddrop/file-system';
import {
  resolveEntryTemplateDirPath,
  resolveEntryTemplateFilePath,
} from '../utils';

/**
 * Copies files into an entry template's directory, incrementing
 * file names on conflict so existing stored files are never
 * overwritten.
 *
 * @param databasePath - The database directory path.
 * @param templateId - The ID of the entry template.
 * @param files - A property name to source file path map of files to copy.
 * @returns A property name to stored file name map of the copied files.
 */
export async function copyEntryTemplateFiles(
  databasePath: string,
  templateId: string,
  files: Record<string, string>,
): Promise<Record<string, string>> {
  const storedFileNames: Record<string, string> = {};

  for (const [propertyName, sourcePath] of Object.entries(files)) {
    // Ensure the template directory exists
    await Fs.ensureDir(resolveEntryTemplateDirPath(databasePath, templateId));

    // Increment the file name if a file with the same name exists
    const { path, name } = await Fs.incrementalPath(
      resolveEntryTemplateFilePath(
        databasePath,
        templateId,
        Fs.fileNameFromPath(sourcePath),
      ),
    );

    // Copy the file into the template directory
    await Fs.copyFile(sourcePath, path);

    // Record the stored file name as the property's value
    storedFileNames[propertyName] = name;
  }

  return storedFileNames;
}
