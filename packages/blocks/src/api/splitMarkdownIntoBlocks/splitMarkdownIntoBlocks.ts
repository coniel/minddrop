import {
  Block,
  BlockquoteBlock,
  CodeBlock,
  FileBlock,
  HeadingOneBlock,
  HeadingTwoBlock,
  ImageBlock,
  LinkBlock,
  MathBlock,
  TableBlock,
  TextBlock,
} from '../../types';

/**
 * Splits the given Markdown text into an array of blocks.
 *
 * @param markdown - The Markdown text to be split.
 * @returns An array of Block objects.
 */
export function splitMarkdownIntoBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  const lines = markdown.split('\n');
  let currentBlock: Block | null = null;
  let inCodeBlock = false;
  let codeBlockLanguage: string | undefined = undefined;
  let codeBlockDelimiter: '```' | '~~~' | undefined = undefined;
  let codeContent: string[] = [];
  let inMathBlock = false;
  let mathContent: string[] = [];
  let previousLineEmpty = false;

  const imageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.webp',
    '.svg',
  ];

  const isImageExtension = (url: string): boolean => {
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const pushCurrentBlock = (): void => {
    if (currentBlock) {
      if (currentBlock.type === 'code') {
        // If currently in a code block, add the code content to the block
        currentBlock.code = codeContent.join('\n');
        codeContent = [];
      } else if (currentBlock.type === 'math') {
        // If currently in a math block, add the math content to the block
        currentBlock.expression = mathContent.join('\n');
        mathContent = [];
      }
      blocks.push(currentBlock);
      currentBlock = null;
    }
  };

  // Process each line of the markdown text
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    // Process fenced code block
    if (isCodeBlockStart(line)) {
      if (inCodeBlock) {
        // End of the current code block
        currentBlock!.markdown += `\n${line}`;
        pushCurrentBlock();
        inCodeBlock = false;
        continue;
      } else {
        // Start of a new code block
        pushCurrentBlock();
        const match = extractCodeBlockLanguage(line);
        codeBlockLanguage = match ? match[1] || match[2] : undefined;
        codeBlockDelimiter = line.startsWith('```') ? '```' : '~~~';
        currentBlock = {
          type: 'code',
          markdown: line,
          language: codeBlockLanguage,
          delimiter: codeBlockDelimiter,
          code: '',
        } as CodeBlock;
        inCodeBlock = true;
        continue;
      }
    }

    // If inside a code block, continue appending lines to the code block
    if (inCodeBlock) {
      currentBlock!.markdown += `\n${line}`;
      codeContent.push(line);
      continue;
    }

    // Process math block
    if (isMathBlockStart(line)) {
      if (inMathBlock) {
        // End of the current math block
        currentBlock!.markdown += `\n${line}`;
        pushCurrentBlock();
        inMathBlock = false;
        continue;
      } else {
        // Start of a new math block
        pushCurrentBlock();
        currentBlock = {
          type: 'math',
          markdown: line,
          expression: '',
        } as MathBlock;
        inMathBlock = true;
        continue;
      }
    }

    // If inside a math block, continue appending lines to the math block
    if (inMathBlock) {
      currentBlock!.markdown += `\n${line}`;
      mathContent.push(line);
      continue;
    }

    // Process heading-1 or heading-2 with #
    if (isHeading1or2(line)) {
      pushCurrentBlock();

      if (line.startsWith('# ')) {
        blocks.push({
          type: 'heading-1',
          markdown: line,
          headingSyntax: '#',
        } as HeadingOneBlock);
      } else {
        blocks.push({
          type: 'heading-2',
          markdown: line,
          headingSyntax: '#',
        } as HeadingTwoBlock);
      }
      previousLineEmpty = false;
      continue;
    }

    // Process heading-1 with ===
    if (isHeading1Alt(line, nextLine)) {
      pushCurrentBlock();
      blocks.push({
        type: 'heading-1',
        markdown: `${line}\n${nextLine}`,
        headingSyntax: '=',
      } as HeadingOneBlock);
      i++; // Skip the next line
      previousLineEmpty = false;
      continue;
    }

    // Process heading-2 with ---
    if (isHeading2Alt(line, nextLine)) {
      pushCurrentBlock();
      blocks.push({
        type: 'heading-2',
        markdown: `${line}\n${nextLine}`,
        headingSyntax: '-',
      } as HeadingTwoBlock);
      i++; // Skip the next line
      previousLineEmpty = false;
      continue;
    }

    // Process heading-3
    if (isHeading3(line)) {
      pushCurrentBlock();
      currentBlock = { type: 'text', markdown: line } as TextBlock;
      previousLineEmpty = false;
      continue;
    }

    // Process image or file with optional tooltip title
    if (isImageOrFile(line)) {
      pushCurrentBlock();
      const match = extractImageOrFileData(line);

      if (match) {
        const url = match[2];
        const title = match[1];
        const description = match[3] || undefined;
        const type = isImageExtension(url) ? 'image' : 'file';

        if (type === 'image') {
          blocks.push({
            type,
            markdown: line,
            url,
            title,
            description,
          } as ImageBlock);
        } else {
          blocks.push({
            type,
            markdown: line,
            url,
            title,
            description,
          } as FileBlock);
        }
      }
      previousLineEmpty = false;
      continue;
    }

    // Process blockquote
    if (isBlockquote(line)) {
      pushCurrentBlock();
      currentBlock = { type: 'blockquote', markdown: line } as BlockquoteBlock;
      pushCurrentBlock();
      previousLineEmpty = false;
      continue;
    }

    // Process table
    if (isTable(line)) {
      pushCurrentBlock();
      currentBlock = { type: 'table', markdown: line } as TableBlock;

      while (i + 1 < lines.length && isTable(lines[i + 1])) {
        i++;
        currentBlock.markdown += `\n${lines[i]}`;
      }
      pushCurrentBlock();
      previousLineEmpty = false;
      continue;
    }

    // Process standalone link with optional tooltip title
    if (isStandaloneLink(line)) {
      const match = extractStandaloneLinkData(line);

      // Skip processing if the line does not match the standalone link pattern
      if (!match) {
        if (currentBlock && currentBlock.type === 'text') {
          currentBlock.markdown += `\n${line}`;
        } else {
          pushCurrentBlock();
          currentBlock = { type: 'text', markdown: line } as TextBlock;
        }
        previousLineEmpty = false;
        continue;
      }

      // Terminate any current text block
      pushCurrentBlock();

      // Add the standalone link block
      blocks.push({
        type: 'link',
        markdown: line,
        url: match[2],
        title: match[1],
        description: match[3] || undefined,
      } as LinkBlock);
      previousLineEmpty = false;
      continue;
    }

    // Handle regular text lines
    if (line.trim() === '') {
      if (currentBlock && currentBlock.type === 'text') {
        currentBlock.markdown += `\n${line}`;
      }
      previousLineEmpty = true;
      continue;
    } else {
      if (currentBlock && currentBlock.type === 'text') {
        currentBlock.markdown += `\n${line}`;
      } else {
        pushCurrentBlock();
        currentBlock = { type: 'text', markdown: line } as TextBlock;
      }
      previousLineEmpty = false;
    }
  }

  // Push the last block if there is one
  pushCurrentBlock();

  return blocks;
}

/**
 * Checks if the line is a level 1 or level 2 heading with #.
 *
 * @param line - The line of Markdown text to check.
 * @returns True if the line is a level 1 or level 2 heading with #, otherwise false.
 */
export const isHeading1or2 = (line: string): boolean => /^#{1,2} /.test(line);

/**
 * Checks if the line is a level 1 heading with ===.
 *
 * @param line - The line of Markdown text to check.
 * @param nextLine - The next line of Markdown text.
 * @returns True if the line is a level 1 heading with ===, otherwise false.
 */
export const isHeading1Alt = (
  line: string,
  nextLine: string | undefined,
): boolean => !!line && nextLine !== undefined && /^=+$/.test(nextLine);

/**
 * Checks if the line is a level 2 heading with ---.
 *
 * @param line - The line of Markdown text to check.
 * @param nextLine - The next line of Markdown text.
 * @returns True if the line is a level 2 heading with ---, otherwise false.
 */
export const isHeading2Alt = (
  line: string,
  nextLine: string | undefined,
): boolean => !!line && nextLine !== undefined && /^-+$/.test(nextLine);

/**
 * Checks if the line is a level 3 heading.
 *
 * @param line - The line of Markdown text to check.
 * @returns True if the line is a level 3 heading, otherwise false.
 */
export const isHeading3 = (line: string): boolean => /^### /.test(line);

/**
 * Checks if the line is an image or file with an optional tooltip title.
 *
 * @param line - The line of Markdown text to check.
 * @returns True if the line is an image or file, otherwise false.
 */
export const isImageOrFile = (line: string): boolean =>
  /^!\[.*\]\(.*\)$/.test(line);

/**
 * Checks if the line is a blockquote.
 *
 * @param line - The line of Markdown text to check.
 * @returns True if the line is a blockquote, otherwise false.
 */
export const isBlockquote = (line: string): boolean => /^> /.test(line);

/**
 * Checks if the line is part of a table.
 *
 * @param line - The line of Markdown text to check.
 * @returns True if the line is part of a table, otherwise false.
 */
export const isTable = (line: string): boolean => /^\|(.+\|)+$/.test(line);

/**
 * Checks if the line is a standalone link with an optional tooltip title.
 *
 * @param line - The line of Markdown text to check.
 * @returns True if the line is a standalone link, otherwise false.
 */
export const isStandaloneLink = (line: string): boolean =>
  /^\[.*\]\(.*\)$/.test(line) && !line.match(/[^!]\[.*\]\(.*\)/);

/**
 * Checks if the line is the start of a fenced code block.
 *
 * @param line - The line of Markdown text to check.
 * @returns True if the line is the start of a fenced code block, otherwise false.
 */
export const isCodeBlockStart = (line: string): boolean =>
  /^```|^~~~/.test(line);

/**
 * Checks if the line is the start or end of a math block.
 *
 * @param line - The line of Markdown text to check.
 * @returns True if the line is the start or end of a math block, otherwise false.
 */
export const isMathBlockStart = (line: string): boolean => /^\$\$/.test(line);

/**
 * Extracts data from an image or file line.
 *
 * @param line - The line of Markdown text to extract data from.
 * @returns The match array with the extracted data, or null if no match is found.
 */
export const extractImageOrFileData = (line: string) =>
  line.match(/^!\[(.*)\]\((.+?)(?: "(.*)")?\)$/);

/**
 * Extracts data from a standalone link line.
 *
 * @param line - The line of Markdown text to extract data from.
 * @returns The match array with the extracted data, or null if no match is found.
 */
export const extractStandaloneLinkData = (line: string) =>
  line.match(/^\[(.*)\]\((.+?)(?: "(.*)")?\)$/);

/**
 * Extracts the language from the start of a code block.
 *
 * @param line - The line of Markdown text to extract the language from.
 * @returns The match array with the extracted language, or null if no match is found.
 */
export const extractCodeBlockLanguage = (line: string) =>
  line.match(/^```(\w+)?|^~~~(\w+)?/);
