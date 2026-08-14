import { Element } from '../../types';

export interface CodeElementData {
  /**
   * The info string's language, if any.
   */
  lang?: string | null;

  /**
   * The remainder of the info string, after the language.
   */
  meta?: string | null;

  /**
   * The fence character as authored, either a backtick or a tilde. Absent on
   * indented code blocks.
   */
  fence?: '`' | '~';

  /**
   * The number of fence characters as authored, which can exceed three when
   * the content itself contains a fence.
   */
  fenceLength?: number;

  /**
   * Whether the block was authored as indented rather than fenced code.
   */
  indented?: boolean;
}

export type CodeElement = Element<'code', CodeElementData>;
