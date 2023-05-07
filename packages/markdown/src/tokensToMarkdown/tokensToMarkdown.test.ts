import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { mdContentTopic } from '../test-utils';
import { tokensToMarkdown } from './tokensToMarkdown';
import { parseMarkdown } from '../parseMarkdown';

describe('tokensToMarkdown', () => {
  it('does something useful', () => {
    const tokens = parseMarkdown(mdContentTopic);

    expect(tokensToMarkdown(tokens)).toEqual(mdContentTopic);
  });
});
