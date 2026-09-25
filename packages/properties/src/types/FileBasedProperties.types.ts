import {
  FilePropertySchema,
  ImagePropertySchema,
  PdfPropertySchema,
} from '../schemas';

export type FileBasedPropertySchema =
  | FilePropertySchema
  | ImagePropertySchema
  | PdfPropertySchema;

export type FileBasedPropertyType = FileBasedPropertySchema['type'];

/**
 * The file based properties whose file can be shown in place, rather
 * than only linked to.
 */
export type EmbeddableFilePropertySchema =
  | ImagePropertySchema
  | PdfPropertySchema;

export type EmbeddableFilePropertyType = EmbeddableFilePropertySchema['type'];
