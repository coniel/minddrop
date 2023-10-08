import { RichTextNode } from './RichTextNode.types';
import { RichTextInlineElement } from './RichTextInlineElement.types';

export type RichTextFragment = (RichTextNode | RichTextInlineElement)[];
