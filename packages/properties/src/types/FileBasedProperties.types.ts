import {
  AudioPropertySchema,
  FilePropertySchema,
  ImagePropertySchema,
  PdfPropertySchema,
  VideoPropertySchema,
} from '../schemas';

export type FileBasedPropertySchema =
  | FilePropertySchema
  | ImagePropertySchema
  | PdfPropertySchema
  | AudioPropertySchema
  | VideoPropertySchema;

export type FileBasedPropertyType = FileBasedPropertySchema['type'];

/**
 * The file based properties whose file can be shown in place, rather
 * than only linked to.
 */
export type EmbeddableFilePropertySchema =
  | ImagePropertySchema
  | PdfPropertySchema
  | AudioPropertySchema
  | VideoPropertySchema;

export type EmbeddableFilePropertyType = EmbeddableFilePropertySchema['type'];
