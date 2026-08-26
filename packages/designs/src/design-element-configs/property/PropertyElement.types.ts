import type { DatePropertyElement } from './date';
import type { FormattedTextPropertyElement } from './formatted-text';
import type { IconPropertyElement } from './icon';
import type { ImagePropertyElement } from './image';
import type { NumberPropertyElement } from './number';
import type { SelectPropertyElement } from './select';
import type { TextPropertyElement } from './text';
import type { TitlePropertyElement } from './title';
import type { UrlPropertyElement } from './url';

/**
 * Union of all property element shapes, discriminated by the
 * property type.
 */
export type PropertyElement =
  | TitlePropertyElement
  | TextPropertyElement
  | FormattedTextPropertyElement
  | NumberPropertyElement
  | DatePropertyElement
  | SelectPropertyElement
  | UrlPropertyElement
  | ImagePropertyElement
  | IconPropertyElement;
