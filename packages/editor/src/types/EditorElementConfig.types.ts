import { EditorInlineElementConfig } from './EditorInlineElementConfig.types';
import { EditorBlockElementConfig } from './EditorBlockElementConfig.types';

export type EditorElementConfig =
  | EditorInlineElementConfig
  | EditorBlockElementConfig;
