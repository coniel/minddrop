export interface HeadingOneBlock {
  /**
   * The block type.
   */
  type: 'heading-1';

  /**
   * The raw markdown content of the block.
   */
  markdown: string;

  /**
   * The syntax used to create the heading.
   */
  headingSyntax: '=' | '#';
}

export interface HeadingTwoBlock {
  /**
   * The block type.
   */
  type: 'heading-2';

  /**
   * The raw markdown content of the block.
   */
  markdown: string;

  /**
   * The syntax used to create the heading.
   */
  headingSyntax: '-' | '#';
}

export interface TextBlock {
  /**
   * The block type.
   */
  type: 'text';

  /**
   * The raw markdown content of the block.
   */
  markdown: string;
}

export interface ImageBlock {
  /**
   * The block type.
   */
  type: 'image';

  /**
   * The raw markdown content of the block.
   */
  markdown: string;

  /**
   * The URL of the image.
   */
  url: string;

  /**
   * The title of the image.
   */
  title: string;

  /**
   * The optional description (tooltip) of the image.
   */
  description?: string;
}

export interface FileBlock {
  /**
   * The block type.
   */
  type: 'file';

  /**
   * The raw markdown content of the block.
   */
  markdown: string;

  /**
   * The URL of the file.
   */
  url: string;

  /**
   * The title of the file.
   */
  title: string;

  /**
   * The optional description (tooltip) of the file.
   */
  description?: string;
}

export interface BlockquoteBlock {
  /**
   * The block type.
   */
  type: 'blockquote';

  /**
   * The raw markdown content of the block.
   */
  markdown: string;
}

export interface TableBlock {
  /**
   * The block type.
   */
  type: 'table';

  /**
   * The raw markdown content of the block.
   */
  markdown: string;
}

export interface LinkBlock {
  /**
   * The block type.
   */
  type: 'link';

  /**
   * The raw markdown content of the block.
   */
  markdown: string;

  /**
   * The URL of the link.
   */
  url: string;

  /**
   * The title of the link.
   */
  title: string;

  /**
   * The optional description (tooltip) of the link.
   */
  description?: string;
}

export interface CodeBlock {
  /**
   * The block type.
   */
  type: 'code';

  /**
   * The raw markdown content of the block.
   */
  markdown: string;

  /**
   * The language of the code block.
   */
  language?: string;

  /**
   * The delimiter used for the code block (backticks or tildes).
   */
  delimiter: '```' | '~~~';

  /**
   * The code content of the block.
   */
  code: string;
}

export interface MathBlock {
  /**
   * The block type.
   */
  type: 'math';

  /**
   * The raw markdown content of the block.
   */
  markdown: string;

  /**
   * The math expression content of the block.
   */
  expression: string;
}

export type Block =
  | HeadingOneBlock
  | HeadingTwoBlock
  | TextBlock
  | ImageBlock
  | FileBlock
  | BlockquoteBlock
  | TableBlock
  | LinkBlock
  | CodeBlock
  | MathBlock;
