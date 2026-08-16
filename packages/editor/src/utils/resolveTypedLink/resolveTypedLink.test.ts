import { describe, expect, it } from 'vitest';
import { resolveTypedLink } from './resolveTypedLink';

describe('resolveTypedLink', () => {
  it('reads a link from the markdown it was typed as', () => {
    expect(resolveTypedLink('[MindDrop](https://minddrop.app)')).toEqual({
      label: 'MindDrop',
      url: 'https://minddrop.app',
      length: 32,
    });
  });

  it('reads a link typed at the end of a sentence', () => {
    expect(resolveTypedLink('Go to [MindDrop](https://minddrop.app)')).toEqual({
      label: 'MindDrop',
      url: 'https://minddrop.app',
      length: 32,
    });
  });

  it('shows the destination of a link typed with no text', () => {
    expect(resolveTypedLink('[](https://minddrop.app)')).toMatchObject({
      label: 'https://minddrop.app',
      url: 'https://minddrop.app',
    });
  });

  it('does not read a link which is not at the end', () => {
    expect(
      resolveTypedLink('[MindDrop](https://minddrop.app) and more'),
    ).toBeNull();
  });

  it('does not read a link with no destination', () => {
    expect(resolveTypedLink('[MindDrop]()')).toBeNull();
  });

  it('does not read a bracketed aside as a link', () => {
    expect(resolveTypedLink('an aside (like this)')).toBeNull();
    expect(resolveTypedLink('[a note] (not a link)')).toBeNull();
  });

  it('does not read a destination containing whitespace', () => {
    expect(resolveTypedLink('[text](not a url)')).toBeNull();
  });
});
