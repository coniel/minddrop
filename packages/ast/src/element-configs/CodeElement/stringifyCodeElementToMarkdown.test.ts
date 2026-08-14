import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { CodeElement } from './CodeElement.types';
import { stringifyCodeElementToMarkdown } from './stringifyCodeElementToMarkdown';

function generateCodeElement(data: Partial<CodeElement> = {}): CodeElement {
  return generateElement<CodeElement>('code', {
    children: [{ text: 'const a = 1;' }],
    ...data,
  });
}

describe('stringifyCodeElementToMarkdown', () => {
  it('stringifies a fenced code block', () => {
    const element = generateCodeElement();

    expect(stringifyCodeElementToMarkdown(element)).toBe(
      '```\nconst a = 1;\n```',
    );
  });

  it('includes the language', () => {
    const element = generateCodeElement({ lang: 'ts' });

    expect(stringifyCodeElementToMarkdown(element)).toBe(
      '```ts\nconst a = 1;\n```',
    );
  });

  it('includes the meta string after the language', () => {
    const element = generateCodeElement({ lang: 'ts', meta: 'title="a.ts"' });

    expect(stringifyCodeElementToMarkdown(element)).toBe(
      '```ts title="a.ts"\nconst a = 1;\n```',
    );
  });

  it('omits the meta string when there is no language', () => {
    const element = generateCodeElement({ meta: 'title="a.ts"' });

    expect(stringifyCodeElementToMarkdown(element)).toBe(
      '```\nconst a = 1;\n```',
    );
  });

  it('preserves the fence character and length', () => {
    const element = generateCodeElement({ fence: '~', fenceLength: 4 });

    expect(stringifyCodeElementToMarkdown(element)).toBe(
      '~~~~\nconst a = 1;\n~~~~',
    );
  });

  it('indents an indented code block', () => {
    const element = generateCodeElement({
      indented: true,
      children: [{ text: 'const a = 1;\nconst b = 2;' }],
    });

    expect(stringifyCodeElementToMarkdown(element)).toBe(
      '    const a = 1;\n    const b = 2;',
    );
  });
});
