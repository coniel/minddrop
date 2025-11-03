export type PropertyValue = string | string[] | number | boolean | Date | null;

export type PropertyMap = Record<string, PropertyValue>;

export type PropertyType =
  | 'created'
  | 'last-modified'
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'url'
  | 'toggle'
  | 'markdown'
  | 'image'
  | 'icon';
