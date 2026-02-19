import { FileBasedPropertyType } from './types';

export const FileBasedPropertyTypes: FileBasedPropertyType[] = [
  'image',
  'file',
];

/**
 * A [property type]: [file extensions] map of which file extensions
 * are supported by a given property type.
 */
export const FilePropertySupportedFileExtensions: Record<
  FileBasedPropertyType,
  string[]
> = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'],
  file: [],
};

/**
 * A [file extension]: [property type] map of which property type
 * supports a given file extension.
 */
export const FileExtensionToPropertyType = Object.entries(
  FilePropertySupportedFileExtensions,
).reduce(
  (acc, [type, exts]) =>
    Object.assign(acc, Object.fromEntries(exts.map((e) => [e, type]))),
  {} as Record<string, FileBasedPropertyType>,
);
