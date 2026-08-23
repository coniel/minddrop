import { DesignElementType } from '@minddrop/designs';
import { PropertyType } from '@minddrop/properties';
import { DateFormatFields } from './DateFormatFields';
import { NumberFormatFields } from './NumberFormatFields';
import { UrlFormatFields } from './UrlFormatFields';

/**
 * The format editors of the element types which format their
 * value, keyed by element type, or by property type for property
 * elements. Types displaying their value as is have no entry.
 */
export const elementFormatEditorMap: Partial<
  Record<
    DesignElementType | PropertyType,
    React.ComponentType<{ elementId: string }>
  >
> = {
  url: UrlFormatFields,
  date: DateFormatFields,
  number: NumberFormatFields,
};
