import { RTBlockElement, BaseCreateRTElementData } from './RTElement.types';
import { RTFragment } from './RTFragment.types';

/**
 * Function called to deserialize an HTML element.
 *
 * Should return an object containing the element `type`, `parents`, and
 * any data used by the element.
 *
 * If a rich text element cannot be created from the HTML element, should
 * return null.
 */
export type HtmlDeserializer<
  THtmlElement extends HTMLElement = HTMLElement,
  TData extends BaseCreateRTElementData = {},
> = (
  element: THtmlElement,
  parent: HTMLElement | null,
  children: RTFragment | RTBlockElement[] | null,
) => TData | TData[] | null;

/**
 * A [node name]: HtmlDeserializer map.
 */
export interface HtmlDeserializerMap<
  TData extends BaseCreateRTElementData = {},
> {
  A: HtmlDeserializer<HTMLAnchorElement, TData>;
  DIV: HtmlDeserializer<HTMLDivElement, TData>;
}
