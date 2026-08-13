import { describe, expect, it } from 'vitest';
import { DesignFixtures } from '../../test-utils';
import { validateDesign } from './validateDesign';

const { design_books, design_space_virtual } = DesignFixtures;

describe('validateDesign', () => {
  it('accepts valid designs', () => {
    expect(validateDesign(design_books)).toBe(true);
    expect(validateDesign(design_space_virtual)).toBe(true);
  });

  it('rejects non-objects', () => {
    expect(validateDesign(null)).toBe(false);
    expect(validateDesign('design')).toBe(false);
  });

  it('rejects designs without a typed design ID', () => {
    expect(validateDesign({ ...design_books, id: 'books' })).toBe(false);
  });

  it('rejects designs with an unknown type', () => {
    expect(validateDesign({ ...design_books, type: 'poster' })).toBe(false);
  });

  it('rejects designs without a layouts array', () => {
    expect(validateDesign({ ...design_books, layouts: undefined })).toBe(false);
  });

  it('rejects database designs without a properties schema', () => {
    expect(validateDesign({ ...design_books, properties: undefined })).toBe(
      false,
    );
  });
});
