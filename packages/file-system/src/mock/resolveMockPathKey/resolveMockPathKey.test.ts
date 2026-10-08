import { describe, expect, it } from 'vitest';
import { resolveMockPathKey } from './resolveMockPathKey';

// A name with an accented letter, composed and decomposed. Built from
// one literal so that a formatter normalising the source cannot make
// the two the same.
const ComposedName = 'Caf\u00e9.md'.normalize('NFC');
const DecomposedName = ComposedName.normalize('NFD');

// Fail the whole file if the two forms are the same
if (ComposedName === DecomposedName) {
  throw new Error('The composed and decomposed names must differ');
}

describe('resolveMockPathKey', () => {
  it('resolves paths differing only in case to the same key', () => {
    expect(resolveMockPathKey('Workspace/Note.md', {})).toBe(
      resolveMockPathKey('workspace/NOTE.md', {}),
    );
  });

  it('resolves paths differing only in normalisation form to the same key', () => {
    expect(resolveMockPathKey(`Workspace/${DecomposedName}`, {})).toBe(
      resolveMockPathKey(`Workspace/${ComposedName}`, {}),
    );
  });

  it('resolves paths differing by more than case to different keys', () => {
    expect(resolveMockPathKey('Workspace/Note.md', {})).not.toBe(
      resolveMockPathKey('Workspace/Notes.md', {}),
    );
  });

  it('resolves a path to itself when case-sensitive', () => {
    expect(
      resolveMockPathKey(`Workspace/${DecomposedName}`, {
        caseSensitive: true,
      }),
    ).toBe(`Workspace/${DecomposedName}`);
  });
});
