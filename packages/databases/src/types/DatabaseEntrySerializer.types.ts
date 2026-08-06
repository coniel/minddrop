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
   * @param schema - The database properties schema.
   * @param properties - The entry properties.
   * @returns The serialized entry.
   */
  serialize: (
    schema: PropertiesSchema,
    properties: PropertyMap,
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
