import {
  CreateRichTextBlockElementData,
  RichTextBlockElement,
} from './RichTextBlockElement.types';
import { CreateRichTextInlineElementData } from './RichTextInlineElement.types';
import { RichTextFragment } from './RichTextFragment.types';

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
  TData extends
    | CreateRichTextInlineElementData
    | CreateRichTextBlockElementData = {
    type: string;
    parents: [];
  },
> = (
  element: THtmlElement,
  parent: HTMLElement | null,
  children: RichTextFragment | RichTextBlockElement[] | null,
) => TData | TData[] | null;

/**
 * A [node name]: HtmlDeserializer map.
 */
export interface HtmlDeserializerMap<
  TData extends
    | CreateRichTextInlineElementData
    | CreateRichTextBlockElementData = {
    type: string;
    parents: [];
  },
> {
  A: HtmlDeserializer<HTMLAnchorElement, TData>;
  DIV: HtmlDeserializer<HTMLDivElement, TData>;
}