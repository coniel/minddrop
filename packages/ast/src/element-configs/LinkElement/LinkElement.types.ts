import { Element } from '../../types';

export interface LinkElementData {
  url: string;
}

export type LinkElement = Element<'link', LinkElementData>;
