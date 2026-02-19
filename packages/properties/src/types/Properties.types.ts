export type PropertyValue = string | string[] | number | boolean | Date | null;

export type PropertyMap = Record<string, PropertyValue>;

export type PropertyType =
  | 'created'
  | 'date'
  | 'icon'
  | 'image'
  | 'last-modified'
  | 'number'
  | 'select'
  | 'text'
  | 'text-formatted'
  | 'title'
  | 'toggle'
  | 'url'
  | 'file';
