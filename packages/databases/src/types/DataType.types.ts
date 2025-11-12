import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { Database } from './Database.types';

export interface DataType<TData = unknown> {
  /**
   * The entry type.
   */
  type: string;

  /**
   * Name displayed in the UI.
   */
  name: string;

  /**
   * The entry type icon, should be a content icon reference string:
   * 'content-icon:[icon-name]:[color]'.
   *
   * Used as the default icon for databases of this entry type.
   */
  icon: string;

  /**
   * Short description displayed in the UI.
   */
  description: string;

  /**
   * The entry type's core properties schema.
   */
  properties: PropertiesSchema;

  /**
   * Indicates whether the entry is file based. When true, the user will be
   * prompted to select a file when creating a new entry of this type.
   */
  file?: boolean;

  /**
   * The allowed file extensions for file-based entry types. Only applicable
   * when `file` is set to true.
   */
  fileExtensions?: string[];

  /**
   * Indicates whether the entry is URL based. When true, the user will be
   * prompted to enter a URL when creating a new entry of this type.
   */
  url?: boolean;

  /**
   * A function to validate URLs for URL-based entry types. Only applicable
   * when `url` is set to true.
   *
   * The function should return true for valid URLs, and false for invalid
   * URLs. A false return value will prevent the entry from being created.
   */
  urlValidator?: (url: string) => boolean;

  /**
   * A function to serialize entry data before writing it to the file system.
   *
   * If omitted, entries will be serialized using one of the default serializers.
   *
   * @param database - The database the entry belongs to.
   * @param properties - The entry's properties.
   * @param data - The entry's data.
   *
   * @returns An object containing the serialized entry string and the file
   * extension to use when saving the entry to the file system.
   */
  serialize?: (
    database: Database,
    properties: PropertyMap,
    data?: TData,
  ) => { serializedEntry: string; fileExtension: string };

  /**
   * A function to deserialize entry data when reading it from the file system.
   *
   * Required if the entry type uses a custom serializer.
   *
   * @param database - The database the entry belongs to.
   * @param serializedEntry - The serialized entry string.
   *
   * @returns An object containing the entry's properties and data (if
   * applicable).
   */
  deserialize?: (
    database: Database,
    serializedEntry: string,
  ) => { properties: PropertyMap; data?: TData };
}
