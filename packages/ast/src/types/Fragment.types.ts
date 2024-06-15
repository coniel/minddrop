import { InlineElement } from './InlineElement.types';
import { TextElement } from './TextElement.types';

export type Fragment = (TextElement | InlineElement)[];
