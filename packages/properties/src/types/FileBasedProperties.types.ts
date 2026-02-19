import { FilePropertySchema, ImagePropertySchema } from '../schemas';

export type FileBasedPropertySchema = FilePropertySchema | ImagePropertySchema;

export type FileBasedPropertyType = FileBasedPropertySchema['type'];
