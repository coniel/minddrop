import { RichTextElement } from './RichTextElement.types';

export type RichTextContent = RichTextElement[];

export interface RichTextDocument {
  revision: string;

  content: RichTextContent;
}
