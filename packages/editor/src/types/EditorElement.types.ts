import { BlockElementProps } from './EditorBlockElementProps.types';
import { InlineElementProps } from './EditorInlineElementProps.types';

export type ElementProps = BlockElementProps<any> | InlineElementProps<any>;
