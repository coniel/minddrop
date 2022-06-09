import { ArrayValidator, CoreFieldValidator } from '@minddrop/utils';
import {
  ResourceDocument,
  TypedResourceDocument,
  RDData,
  ResourceFieldValidator,
  ResourceDeserializers,
} from '../types';
import { ResourceApisStore } from '../ResourceApisStore';
import { generateResourceDocumentSchema } from '../validation';

/**
 * Deserializes the items in an array value.
 *
 * @param array - The array to deserialize.
 * @param validator - The array field's validator.
 * @param deserializers - The value deserializers, mapped by value type.
 * @returns The deserialized array.
 */
function deserializerArray(
  array: unknown[],
  validator: ArrayValidator<ResourceFieldValidator | CoreFieldValidator>,
  deserializers: ResourceDeserializers,
) {
  let value = array;

  if (validator.items.type === 'date' && deserializers.date) {
    // If the array contains dates, call the date deserializer if
    // there is one.
    value = value.map((item) => deserializers.date(item));
  } else if (validator.items.type === 'object') {
    const itemValidator = validator.items;

    // If the array contains objects, deserialize the objects
    value = (value as object[]).map((item) =>
      deserializeObject(item, itemValidator.schema, deserializers),
    );
  }

  return value;
}

/**
 * Deserializes an object's fields.
 *
 * @param array - The object to deserialize.
 * @param validator - The object's schema.
 * @param deserializers - The value deserializers, mapped by value type.
 * @returns The deserialized object.
 */
function deserializeObject(
  object: object,
  schema: Record<string, ResourceFieldValidator | CoreFieldValidator>,
  deserializers: ResourceDeserializers,
) {
  // Loop through the object's fields, deserilazing
  // each one.
  return Object.keys(object).reduce((doc, key) => {
    let value = object[key];

    // Ensure the value has a schema entry and an actual value
    if (schema[key] && value) {
      const validator = schema[key] as ResourceFieldValidator;

      if (validator.type === 'date' && deserializers.date) {
        // Deserialize date fields
        value = deserializers.date(value);
      }

      if (validator.type === 'object' && typeof value === 'object') {
        // Deserialize object fields
        value = deserializeObject(value, validator.schema, deserializers);
      }

      if (validator.type === 'array' && Array.isArray(value)) {
        // Deserialize array fields
        value = deserializerArray(value, validator, deserializers);
      }
    }

    return { ...doc, [key]: value };
  }, {});
}

/**
 * Deserializes a resource document given a serialized
 * and map of deserializers.
 *
 * @param document - The document data to deserialize.
 * @param deserializers - The value deserializers, mapped by value type.
 * @returns A resource document.
 */
export function deserializeResourceDocument<
  TData extends RDData = {},
  TRawDocument extends
    | ResourceDocument
    | TypedResourceDocument = ResourceDocument,
>(
  document: TRawDocument,
  deserializers: ResourceDeserializers,
): ResourceDocument<TData> {
  // Get the resource API
  const resource = ResourceApisStore.get(document.resource);

  let schema = generateResourceDocumentSchema({});

  if (!resource) {
    // If the resource is not registered, deserialize
    // the base resource document data.
    return deserializeObject(
      document,
      schema,
      deserializers,
    ) as unknown as ResourceDocument<TData>;
  }

  if (resource.dataSchema) {
    // If the resource has a data schema, merge it
    // into the base document data schema.
    schema = { ...resource.dataSchema, ...schema };
  }

  if ('type' in document && 'typeConfigsStore' in resource) {
    // If the document has a 'type' field and the resource
    // API contains a type configs store, get the type config.
    const typeConfig = resource.typeConfigsStore.get(document.type);

    if (typeConfig && typeConfig.dataSchema) {
      // If the type config has a data schema, merge it into
      // the base data schema.
      schema = {
        ...schema,
        ...typeConfig.dataSchema,
      };
    }
  }

  // Deserialize the document object
  return deserializeObject(
    document,
    schema,
    deserializers,
  ) as unknown as ResourceDocument<TData>;
}
