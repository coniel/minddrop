import { Element } from '../../types';

export interface HtmlElementData {
  /**
   * The raw HTML as authored.
   */
  value: string;
}

export type HtmlElement = Element<'html', HtmlElementData>;
