import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { DefinitionElement } from './DefinitionElement.types';
import { stringifyDefinitionElementToMarkdown } from './stringifyDefinitionElementToMarkdown';

describe('stringifyDefinitionElementToMarkdown', () => {
  it('stringifies a definition', () => {
    const element = generateElement<DefinitionElement>('definition', {
      identifier: 'ref',
      url: 'https://example.com',
    });

    expect(stringifyDefinitionElementToMarkdown(element)).toBe(
      '[ref]: https://example.com',
    );
  });

  it('uses the label as authored', () => {
    const element = generateElement<DefinitionElement>('definition', {
      identifier: 'ref',
      label: 'Ref',
      url: 'https://example.com',
    });

    expect(stringifyDefinitionElementToMarkdown(element)).toBe(
      '[Ref]: https://example.com',
    );
  });

  it('includes the title', () => {
    const element = generateElement<DefinitionElement>('definition', {
      identifier: 'ref',
      url: 'https://example.com',
      title: 'Example',
    });

    expect(stringifyDefinitionElementToMarkdown(element)).toBe(
      '[ref]: https://example.com "Example"',
    );
  });
});
