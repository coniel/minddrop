import { TranslationKey } from '@minddrop/i18n';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';

export interface DatabaseEntrySerializer<
  TOptions extends object = Record<string, never>,
> {
  /**
   * The ID of the serializer.
   */
  id: string;

  /**
   * The name of the serializer.
   */
  name: TranslationKey;

  /**
   * The description of the serializer.
   */
  description: TranslationKey;

  /**
   * The file extension to use for the serialized entry.
   */
  fileExtension: string;

  /**
   * The serializer function to serialize an entry.
   *
   * When the entry's current file content is provided, formats which support
   * it merge into that content rather than regenerating it, so that anything
   * the properties schema does not model survives the write.
   *
   * @param schema - The database properties schema.
   * @param properties - The entry properties.
   * @param existingContent - The entry's current file content, if it exists.
   * @param options - Serializer specific options.
   * @returns The serialized entry.
   */
  serialize: (
    schema: PropertiesSchema,
    properties: PropertyMap,
    existingContent?: string,
    options?: TOptions,
  ) => string;

  /**
   * The serializer function to deserialize an entry's properties.
   *
   * @param schema - The database properties schema.
   * @param serializedProperties - The serialized entry properties.
   * @returns The deserialized entry properties.
   */
  deserialize: (
    database: PropertiesSchema,
    serializedEntry: string,
    options?: TOptions,
  ) => PropertyMap;
}
