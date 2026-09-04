import { describe, expect, it } from 'vitest';
import {
  cardDesign_1,
  coverDesignElement,
  pageDesign_1,
} from '../../test-utils';
import { validateDesign } from './validateDesign';

describe('validateDesign', () => {
  it('accepts valid designs', () => {
    expect(validateDesign(cardDesign_1)).toBe(true);
    expect(validateDesign(pageDesign_1)).toBe(true);
  });

  it('rejects non-objects', () => {
    expect(validateDesign('design')).toBe(false);
    expect(validateDesign(null)).toBe(false);
  });

  it('rejects an untyped ID', () => {
    expect(validateDesign({ ...cardDesign_1, id: 'card' })).toBe(false);
  });

  it('rejects a missing name', () => {
    expect(validateDesign({ ...cardDesign_1, name: undefined })).toBe(false);
  });

  it('rejects an unknown design type', () => {
    expect(validateDesign({ ...cardDesign_1, type: 'database' })).toBe(false);
  });

  it('rejects invalid unit dimensions', () => {
    expect(validateDesign({ ...cardDesign_1, columns: 0 })).toBe(false);
    expect(validateDesign({ ...cardDesign_1, rows: 32.5 })).toBe(false);
  });

  it('accepts a known aspect ratio and rejects unknown ones', () => {
    expect(validateDesign({ ...cardDesign_1, aspectRatio: '3/2' })).toBe(true);
    expect(validateDesign({ ...cardDesign_1, aspectRatio: '5/4' })).toBe(false);
  });

  it('rejects a missing elements array', () => {
    expect(validateDesign({ ...cardDesign_1, elements: undefined })).toBe(
      false,
    );
  });

  it('rejects invalid elements', () => {
    expect(
      validateDesign({
        ...cardDesign_1,
        elements: [{ ...coverDesignElement, id: 'cover' }],
      }),
    ).toBe(false);
  });
});
