import { InvalidResourceSchemaError } from '../errors';
import {
  TRDBaseDataSchema,
  TRDBaseData,
  TRDTypeData,
  TRDTypeDataSchema,
} from '../types';
import { validateResourceDataSchema } from '../validation/validateResourceDataSchema';

/**
 * Validates a typed resource data schema.
 *
 * @param schema - The schema to validate.
 * @param skipBaseValidation - When `true`, base resource data schema validation is skipped.
 *
 * @throws InvalidResourceSchemaError
 * Thrown if the schema is invalid.
 */
export function validateTypedResourceDataSchema<
  TBaseData extends TRDBaseData,
  TTypeData extends TRDTypeData<TBaseData>,
>(
  resource: string,
  schema:
    | TRDBaseDataSchema<TBaseData>
    | TRDTypeDataSchema<TBaseData, TTypeData>,
  skipBaseValidation?: boolean,
): void {
  // Ensure that the schema does not have a `type` validator
  if ('type' in schema) {
    // Throw an `InvalidSchemaError` if the data schema contains
    // any default resource field validators.
    throw new InvalidResourceSchemaError(
      `[${resource}] property 'type' is validated automatically and should not be inlcuded in the resource's data schema`,
    );
  }

  if (!skipBaseValidation) {
    // Ensure that the schema is valid
    validateResourceDataSchema(resource, schema);
  }
}
