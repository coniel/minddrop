export type PropertyValue = string | string[] | number | boolean | Date | null;

export type PropertyMap = Record<string, PropertyValue>;

export type PropertyType =
  | 'collection'
  | 'color'
  | 'created'
  | 'date'
  | 'icon'
  | 'image'
  | 'last-modified'
  | 'number'
  | 'select'
  | 'tags'
  | 'text'
  | 'formatted-text'
  | 'title'
  | 'toggle'
  | 'url'
  | 'file';
