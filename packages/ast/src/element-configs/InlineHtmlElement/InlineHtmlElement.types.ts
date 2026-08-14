import { Element } from '../../types';

export interface InlineHtmlElementData {
  /**
   * The raw HTML as authored.
   */
  value: string;
}

export type InlineHtmlElement = Element<'inline-html', InlineHtmlElementData>;
