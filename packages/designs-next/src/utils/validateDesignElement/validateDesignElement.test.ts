import { describe, expect, it } from 'vitest';
import { coverDesignElement } from '../../test-utils';
import { validateDesignElement } from './validateDesignElement';

describe('validateDesignElement', () => {
  it('accepts a valid element', () => {
    expect(validateDesignElement(coverDesignElement)).toBe(true);
  });

  it('rejects non-objects', () => {
    expect(validateDesignElement('element')).toBe(false);
    expect(validateDesignElement(null)).toBe(false);
  });

  it('rejects an untyped ID', () => {
    expect(validateDesignElement({ ...coverDesignElement, id: 'cover' })).toBe(
      false,
    );
  });

  it('rejects a missing type', () => {
    expect(validateDesignElement({ ...coverDesignElement, type: '' })).toBe(
      false,
    );
  });

  it('rejects fractional rect values', () => {
    expect(validateDesignElement({ ...coverDesignElement, column: 1.5 })).toBe(
      false,
    );
  });

  it('rejects negative rect offsets', () => {
    expect(validateDesignElement({ ...coverDesignElement, row: -1 })).toBe(
      false,
    );
  });

  it('rejects zero spans', () => {
    expect(
      validateDesignElement({ ...coverDesignElement, columnSpan: 0 }),
    ).toBe(false);
  });

  it('rejects an unknown width mode', () => {
    expect(
      validateDesignElement({ ...coverDesignElement, widthMode: 'stretch' }),
    ).toBe(false);
  });

  it('rejects a missing natural height flag', () => {
    expect(
      validateDesignElement({
        ...coverDesignElement,
        naturalHeight: undefined,
      }),
    ).toBe(false);
  });
});
