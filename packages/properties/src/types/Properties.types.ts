export type PropertyValue = string | string[] | number | boolean | Date | null;

export type PropertyMap = Record<string, PropertyValue>;

export type PropertyType =
  | 'collection'
  | 'color'
  | 'content'
  | 'created'
  | 'date'
  | 'icon'
  | 'image'
  | 'last-modified'
  | 'number'
  | 'select'
  | 'tags'
  | 'text'
  | 'title'
  | 'toggle'
  | 'url'
  | 'file'
  | 'pdf'
  | 'audio'
  | 'video';

/**
 * The property types whose value is a creation or last-modified
 * timestamp.
 */
export type TimestampPropertyType = Extract<
  PropertyType,
  'created' | 'last-modified'
>;
