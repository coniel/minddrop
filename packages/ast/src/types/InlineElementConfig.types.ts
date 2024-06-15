import { InlineElement } from './InlineElement.types';

export interface InlineElementConfig<
  TInline extends InlineElement = InlineElement,
> {
  /**
   * The type of InlineElement this config is for.
   */
  type: string;

  /**
   * Stringifies a InlineElement into markdown text.
   *
   * @param element - The InlineElement to stringify.
   * @returns The markdown text.
   */
  toMarkdown(element: TInline): string;

  /**
   * Stringifies a InlineElement into plain text.
   * If not provided, the element's children are stringified.
   *
   * @param element - The element to stringify.
   * @returns The plain text representation of the element.
   */
  toPlainText?(element: TInline): string;
}

export type InlineElementStringifier<T extends InlineElement = InlineElement> =
  InlineElementConfig<T>['toMarkdown'];

export type BatchInlineElementStringifier<
  T extends InlineElement = InlineElement,
> = (element: T[]) => string;
