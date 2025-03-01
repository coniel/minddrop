import { Element } from '../../types';

export interface LinkElementData {
  url: string;
  title?: string | null;
}

export type LinkElement = Element<'link', LinkElementData>;
