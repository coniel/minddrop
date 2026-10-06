import { describe, expect, it } from 'vitest';
import { resolveMarkdownTextRunsOutsideCode } from './resolveMarkdownTextRunsOutsideCode';

describe('resolveMarkdownTextRunsOutsideCode', () => {
  it('resolves each line as its own run', () => {
    expect(resolveMarkdownTextRunsOutsideCode('One\n\nTwo')).toEqual([
      'One',
      'Two',
    ]);
  });

  it('leaves out a fenced code block', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('Before\n```md\nCode\n```\nAfter'),
    ).toEqual(['Before', 'After']);
  });

  it('leaves out a tilde fenced code block', () => {
    expect(resolveMarkdownTextRunsOutsideCode('~~~\nCode\n~~~\nAfter')).toEqual(
      ['After'],
    );
  });

  it('reads a backtick fence whose info string contains a backtick as text', () => {
    expect(resolveMarkdownTextRunsOutsideCode('```a`b\nText')).toEqual([
      '```a`b',
      'Text',
    ]);
  });

  it('reads a backtick fence with a backtick in its info string as text on a list item marker line', () => {
    expect(resolveMarkdownTextRunsOutsideCode('- ```a`b\n  Text')).toEqual([
      '- ```a`b',
      '  Text',
    ]);
  });

  it('keeps a fenced code block open until its closing fence', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('````\n```\nCode\n````\nAfter'),
    ).toEqual(['After']);
  });

  it('leaves out everything after an unclosed fence', () => {
    expect(resolveMarkdownTextRunsOutsideCode('Before\n```\nCode')).toEqual([
      'Before',
    ]);
  });

  it('opens a fenced code block indented by up to three spaces', () => {
    expect(resolveMarkdownTextRunsOutsideCode('   ```\nCode\n   ```')).toEqual(
      [],
    );
  });

  it('does not open a fenced code block indented by four spaces', () => {
    expect(resolveMarkdownTextRunsOutsideCode('Text\n    ```\nMore')).toEqual([
      'Text',
      '    ```',
      'More',
    ]);
  });

  it('leaves out an indented code block', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('Before\n\n    Code\n\nAfter'),
    ).toEqual(['Before', 'After']);
  });

  it('leaves out an indented code block opening the document', () => {
    expect(resolveMarkdownTextRunsOutsideCode('    Code\nAfter')).toEqual([
      'After',
    ]);
  });

  it('leaves out an indented code block indented by a tab', () => {
    expect(resolveMarkdownTextRunsOutsideCode('\tCode\nAfter')).toEqual([
      'After',
    ]);
  });

  it('keeps an indented code block open past blank lines', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('    One\n\n    Two\nAfter'),
    ).toEqual(['After']);
  });

  it('leaves out an indented code block after a heading', () => {
    expect(resolveMarkdownTextRunsOutsideCode('# Heading\n    Code')).toEqual([
      '# Heading',
    ]);
  });

  it('reads an indented line continuing a paragraph as text', () => {
    expect(resolveMarkdownTextRunsOutsideCode('Text\n    continued')).toEqual([
      'Text',
      '    continued',
    ]);
  });

  it('reads a nested list item after a blank line as text', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('- Reading list\n\n    - Book'),
    ).toEqual(['- Reading list', '    - Book']);
  });

  it("leaves out code indented four columns past a list item's content", () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('- Item\n\n      Code\n\n  Text'),
    ).toEqual(['- Item', '  Text']);
  });

  it('ends indented code in a list item on a line indented less than the code', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('- Item\n\n      Code\n    Text'),
    ).toEqual(['- Item', '    Text']);
  });

  it('leaves out a fenced code block in a nested list item', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode(
        '- One\n  - Two\n\n    ```\n    Code\n    ```\n\n    After',
      ),
    ).toEqual(['- One', '  - Two', '    After']);
  });

  it('closes a list item on a line indented less than its content', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('- Item\n\nText\n\n    Code'),
    ).toEqual(['- Item', 'Text']);
  });

  it('keeps a list item open past a line continuing its paragraph', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('- Item\ncontinued\n\n    Text'),
    ).toEqual(['- Item', 'continued', '    Text']);
  });

  it('closes a fenced code block with the list item it is in', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('- Item\n\n  ```\n  Code\nAfter'),
    ).toEqual(['- Item', 'After']);
  });

  it('keeps a fenced code block open past a fence indented by four spaces', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('```\n    ```\nCode\n```\nAfter'),
    ).toEqual(['After']);
  });

  it('closes a list item on a fence indented less than its content', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('- Item\n```\nCode\n```\nAfter'),
    ).toEqual(['- Item', 'After']);
  });

  it('leaves out inline code spans', () => {
    expect(resolveMarkdownTextRunsOutsideCode('Write `code` to link')).toEqual([
      'Write ',
      ' to link',
    ]);
  });

  it('ends a paragraph on a line of only whitespace', () => {
    expect(resolveMarkdownTextRunsOutsideCode('Text\n   \n    Code')).toEqual([
      'Text',
    ]);
  });

  it('leaves out an indented code block after a fenced code block', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('Text\n```\nCode\n```\n    Code'),
    ).toEqual(['Text']);
  });

  it('continues a paragraph opened by a hashtag', () => {
    expect(resolveMarkdownTextRunsOutsideCode('#tag\n    continued')).toEqual([
      '#tag',
      '    continued',
    ]);
  });

  it('continues a paragraph opened by more than six hashes', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('####### Text\n    continued'),
    ).toEqual(['####### Text', '    continued']);
  });

  it('closes a list item on a heading after its paragraph', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('- Item\n# Heading\n\n    Code'),
    ).toEqual(['- Item', '# Heading']);
  });

  it('closes a list item on a list item indented less than its content', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('- Item\n1. Step\n  ```\nCode'),
    ).toEqual(['- Item', '1. Step']);
  });

  it('opens indented code after an empty list item', () => {
    expect(resolveMarkdownTextRunsOutsideCode('-\n      Code')).toEqual(['-']);
  });

  it('opens indented code after a heading in a list item', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('- # Heading\n      Code'),
    ).toEqual(['- # Heading']);
  });

  it('leaves out a fenced code block opened on a list item marker line', () => {
    expect(
      resolveMarkdownTextRunsOutsideCode('- ```\n  Code\n  ```\n  Text'),
    ).toEqual(['  Text']);
  });

  it('closes a fenced code block opened on a list item marker line with its item', () => {
    expect(resolveMarkdownTextRunsOutsideCode('- ```\n  Code\nAfter')).toEqual([
      'After',
    ]);
  });

  it('leaves out indented code opened on a list item marker line', () => {
    expect(resolveMarkdownTextRunsOutsideCode('-     Code\n\n  Text')).toEqual([
      '  Text',
    ]);
  });

  it('measures a list item separated from its marker by a tab', () => {
    expect(resolveMarkdownTextRunsOutsideCode('-\tItem\n\n      Text')).toEqual(
      ['-\tItem', '      Text'],
    );
  });

  it('ends a paragraph on a thematic break', () => {
    expect(resolveMarkdownTextRunsOutsideCode('---\n    Code')).toEqual([
      '---',
    ]);
    expect(resolveMarkdownTextRunsOutsideCode('***\n    Code')).toEqual([
      '***',
    ]);
  });

  it('reads a spaced thematic break as a break, not a list item', () => {
    expect(resolveMarkdownTextRunsOutsideCode('- - -\n\n    Code')).toEqual([
      '- - -',
    ]);
  });

  it('reads an underline without a paragraph above it as text', () => {
    expect(resolveMarkdownTextRunsOutsideCode('===\n    continued')).toEqual([
      '===',
      '    continued',
    ]);
  });

  it('closes a list item on a thematic break', () => {
    expect(resolveMarkdownTextRunsOutsideCode('- Item\n---\n    Code')).toEqual(
      ['- Item', '---'],
    );
  });

  it('ends a paragraph on a setext heading underline', () => {
    expect(resolveMarkdownTextRunsOutsideCode('Text\n---\n    Code')).toEqual([
      'Text',
      '---',
    ]);
    expect(resolveMarkdownTextRunsOutsideCode('Text\n===\n    Code')).toEqual([
      'Text',
      '===',
    ]);
  });
});
