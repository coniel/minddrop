import { PropertyFileStorage } from '../../types';

export interface ResolvePropertyFilePathOptions {
  /**
   * The database directory path.
   */
  databasePath: string;

  /**
   * The property file storage mode to resolve the path for.
   */
  mode: PropertyFileStorage;

  /**
   * The resolved common directory name, used only in `common` mode.
   */
  propertyFilesDirName: string;

  /**
   * The entry's title, used only in `entry` mode.
   */
  entryTitle: string;

  /**
   * The name of the property, used only in `property` mode.
   */
  propertyName: string;

  /**
   * The file name, i.e. the value of the property.
   */
  fileName: string;
}

/**
 * Resolves the on-disk path of an entry property's file for a given storage
 * mode. Pure: every input is explicit, so it can resolve paths for a mode
 * other than the one currently stored on the database.
 *
 * @param options - The path resolution inputs.
 * @returns The resolved property file path.
 */
export function resolvePropertyFilePath({
  databasePath,
  mode,
  propertyFilesDirName,
  entryTitle,
  propertyName,
  fileName,
}: ResolvePropertyFilePathOptions): string {
  switch (mode) {
    // A single shared directory holds all property files
    case 'common':
      return `${databasePath}/${propertyFilesDirName}/${fileName}`;
    // One directory per property, named after the property
    case 'property':
      return `${databasePath}/${propertyName}/${fileName}`;
    // Stored inside the entry's own directory
    case 'entry':
      return `${databasePath}/${entryTitle}/${fileName}`;
    // Loose in the database root
    case 'root':
    default:
      return `${databasePath}/${fileName}`;
  }
}
