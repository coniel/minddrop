import { LinkElement } from '../element-configs';
import { Element, Fragment, TextElement } from '../types';

interface Marks {
  bold: boolean;
  italic: boolean;
  code: boolean;
  underline: boolean;
  strikethrough: boolean;
  boldSyntax: string;
  italicSyntax: string;
  codeSyntax: string;
  underlineSyntax: string;
  strikethroughSyntax: string;
}

/**
 * Stringifies an array of text and inline elements
 * into a markdown formatted string.
 *
 * @param fragment - The fragment to stringify.
 * @returns The stringified markdown fragment.
 */
export function stringifyFragmentToMarkdown(fragment: Fragment): string {
  let buffer = '';
  const activeMarks: Marks = {
    bold: false,
    italic: false,
    code: false,
    underline: false,
    strikethrough: false,
    boldSyntax: '',
    italicSyntax: '',
    codeSyntax: '',
    underlineSyntax: '',
    strikethroughSyntax: '',
  };

  fragment.forEach((element) => {
    if (!('type' in element)) {
      buffer += closeMarks(activeMarks, element);
      buffer += openMarks(activeMarks, element);
      buffer += element.text;
    } else if (element.type === 'link') {
      buffer += `[${stringifyFragmentToMarkdown(element.children)}](${(element as LinkElement).url})`;
    } else if ('type' in element) {
      buffer += stringifyFragmentToMarkdown((element as Element).children);
    }
  });

  return buffer + closeMarks(activeMarks, { text: '' });
}

function openMarks(activeMarks: Marks, element: TextElement): string {
  let result = '';

  if (!activeMarks.bold && element.bold) {
    result += element.boldSyntax || '**';
    activeMarks.bold = true;
    activeMarks.boldSyntax = element.boldSyntax || '';
  }

  if (!activeMarks.italic && element.italic) {
    result += element.italicSyntax || '*';
    activeMarks.italic = true;
    activeMarks.italicSyntax = element.italicSyntax || '';
  }

  if (!activeMarks.code && element.code) {
    result += element.codeSyntax || '`';
    activeMarks.code = true;
    activeMarks.codeSyntax = element.codeSyntax || '';
  }

  if (!activeMarks.underline && element.underline) {
    result += element.underlineSyntax || '<u>';
    activeMarks.underline = true;
    activeMarks.underlineSyntax = element.underlineSyntax || '';
  }

  if (!activeMarks.strikethrough && element.strikethrough) {
    result += element.strikethroughSyntax || '~~';
    activeMarks.strikethrough = true;
    activeMarks.strikethroughSyntax = element.strikethroughSyntax || '';
  }

  return result;
}

function closeMarks(activeMarks: Marks, element: TextElement): string {
  let result = '';

  if (activeMarks.bold && !element.bold) {
    result += activeMarks.boldSyntax || '**';
    activeMarks.bold = false;
    activeMarks.boldSyntax = '';
  }

  if (activeMarks.italic && !element.italic) {
    result += activeMarks.italicSyntax || '*';
    activeMarks.italic = false;
    activeMarks.italicSyntax = '';
  }

  if (activeMarks.code && !element.code) {
    result += activeMarks.codeSyntax || '`';
    activeMarks.code = false;
    activeMarks.codeSyntax = '';
  }

  if (activeMarks.underline && !element.underline) {
    result += activeMarks.underlineSyntax || '</u>';
    activeMarks.underline = false;
    activeMarks.underlineSyntax = '';
  }

  if (activeMarks.strikethrough && !element.strikethrough) {
    result += activeMarks.strikethroughSyntax || '~~';
    activeMarks.strikethrough = false;
    activeMarks.strikethroughSyntax = '';
  }

  return result;
}
