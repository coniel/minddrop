import { describe, expect, it } from 'vitest';
import '../../test-utils';
import { resolvePlaceholderContent } from './resolvePlaceholderContent';

describe('resolvePlaceholderContent', () => {
  it('resolves the registered translation as the content', () => {
    expect(
      resolvePlaceholderContent('designsNext.elements.text.placeholder'),
    ).toEqual({ content: 'Text' });
  });
});
