import { InlineElement } from '../../types';

export interface LinkElementData {
  url: string;
}

export type LinkElement = InlineElement<'link', LinkElementData>;
