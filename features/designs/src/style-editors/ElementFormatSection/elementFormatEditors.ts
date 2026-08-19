import { DesignElementType } from '@minddrop/designs';
import { DateFormatFields } from './DateFormatFields';
import { NumberFormatFields } from './NumberFormatFields';
import { UrlFormatFields } from './UrlFormatFields';

/**
 * The format editors of the element types which format their
 * value, keyed by element type. Element types displaying their
 * value as is have no entry.
 */
export const elementFormatEditors: Partial<
  Record<DesignElementType, React.ComponentType<{ elementId: string }>>
> = {
  url: UrlFormatFields,
  date: DateFormatFields,
  number: NumberFormatFields,
};
