import { Text } from './Text.types';
import { InlineElement } from './InlineElement.types';

export type Fragment = (Text | InlineElement)[];
