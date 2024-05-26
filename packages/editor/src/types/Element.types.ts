import { BlockElement, BlockElementProps } from './BlockElement.types';
import { InlineElement, InlineElementProps } from './InlineElement.types';

export type Element = BlockElement | InlineElement;

export type ElementProps = BlockElementProps<any> | InlineElementProps<any>;
