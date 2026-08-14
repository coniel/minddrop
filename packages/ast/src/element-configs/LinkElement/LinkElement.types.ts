import { Element } from '../../types';

export interface LinkElementData {
  /**
   * The link's destination.
   */
  url: string;

  /**
   * The link's optional title.
   */
  title?: string | null;

  /**
   * Whether the link was authored as an autolink, which parses to the same
   * node as an inline link and is only distinguishable from the source.
   */
  autolink?: boolean;
}

export type LinkElement = Element<'link', LinkElementData>;
