import { describe, expect, it } from 'vitest';
import { generateBlockquoteFrame } from './generateBlockquoteFrame';

describe('generateBlockquoteFrame', () => {
  it('builds a block quote frame with the spaced prefix', () => {
    expect(generateBlockquoteFrame()).toMatchObject({
      kind: 'blockquote',
      syntax: '> ',
    });
  });

  it('gives each frame an ID of its own', () => {
    expect(generateBlockquoteFrame().id).not.toBe(generateBlockquoteFrame().id);
  });
});
