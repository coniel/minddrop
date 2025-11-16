import { PropertiesSchema, PropertyMap } from '@minddrop/properties';

export interface DatabaseEntrySerializer<TOptions extends object = {}> {
  /**
   * The ID of the serializer.
   */
  id: string;

  /**
   * The name of the serializer.
   */
  name: string;

  /**
   * The description of the serializer.
   */
  description: string;

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
    schema: PropertiesSchema,
    serializedEntry: string,
    options?: TOptions,
  ) => PropertyMap;
}
