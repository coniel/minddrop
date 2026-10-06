import { describe, expect, it } from 'vitest';
import { resolveWikilinkReferenceKey } from './resolveWikilinkReferenceKey';

describe('resolveWikilinkReferenceKey', () => {
  it('resolves the same key for references differing only in case', () => {
    expect(resolveWikilinkReferenceKey('Books/Book')).toBe(
      resolveWikilinkReferenceKey('books/BOOK'),
    );
  });

  it('resolves the same key regardless of case beyond ASCII', () => {
    expect(resolveWikilinkReferenceKey('Äpfel')).toBe(
      resolveWikilinkReferenceKey('äpfel'),
    );
  });
});
