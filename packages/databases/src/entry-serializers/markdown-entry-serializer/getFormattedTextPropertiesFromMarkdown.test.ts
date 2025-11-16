import { describe, expect, it } from 'vitest';
import { getFormattedTextPropertiesFromMarkdown } from './getFormattedTextPropertiesFromMarkdown';

const someHeading = `Some heading`;
const someOtherHeading = `Some other heading`;

const someHeadingContent = `Some text content

### Heading 3

## Heading 2`;

const someOtherHeadingContent = `Some more text content`;

const markdown = `# Heading 1

## ${someHeading}

${someHeadingContent}

## ${someOtherHeading}

${someOtherHeadingContent}`;

const headings = ['Some heading', 'Some other heading'];

describe('splitMarkdownByHeadings', () => {
  it('splits markdown by headings', () => {
    console.log(getFormattedTextPropertiesFromMarkdown(markdown, headings));
    expect(getFormattedTextPropertiesFromMarkdown(markdown, headings)).toEqual({
      [someHeading]: someHeadingContent,
      [someOtherHeading]: someOtherHeadingContent,
    });
  });

  it('returns an empty object if no headings are found', () => {
    expect(getFormattedTextPropertiesFromMarkdown(markdown, [])).toEqual({});
  });

  it('supports headings in a different order', () => {
    expect(
      getFormattedTextPropertiesFromMarkdown(markdown, [
        someOtherHeading,
        someHeading,
      ]),
    ).toEqual({
      [someHeading]: someHeadingContent,
      [someOtherHeading]: someOtherHeadingContent,
    });
  });

  it('returns an empty string for headings that are not found', () => {
    expect(
      getFormattedTextPropertiesFromMarkdown(markdown, [
        someHeading,
        someOtherHeading,
        'Non-existent heading',
      ]),
    ).toEqual({
      [someHeading]: someHeadingContent,
      [someOtherHeading]: someOtherHeadingContent,
      'Non-existent heading': '',
    });
  });
});
