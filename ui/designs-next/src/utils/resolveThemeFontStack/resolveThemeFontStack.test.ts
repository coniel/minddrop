import { afterEach, describe, expect, it } from 'vitest';
import { resolveThemeFontStack } from './resolveThemeFontStack';

describe('resolveThemeFontStack', () => {
  afterEach(() => {
    document.body.style.cssText = '';
  });

  it('resolves the stack the theme declares', () => {
    // The theme is a class on the body, so its properties are
    // declared there rather than on the document.
    document.body.style.setProperty('--font-test', 'Georgia, serif');

    expect(resolveThemeFontStack('--font-test')).toBe('Georgia, serif');
  });

  it('resolves a stack declared across lines onto one line', () => {
    document.body.style.setProperty(
      '--font-multiline',
      'ui-sans-serif,\n    Helvetica,\n    sans-serif',
    );

    expect(resolveThemeFontStack('--font-multiline')).toBe(
      'ui-sans-serif, Helvetica, sans-serif',
    );
  });

  it('resolves an undeclared property to no stack', () => {
    expect(resolveThemeFontStack('--font-undeclared')).toBe('');
  });

  it('reads a resolved stack back rather than the document', () => {
    document.body.style.setProperty('--font-read-back', 'Menlo');

    const stack = resolveThemeFontStack('--font-read-back');

    // Take the property away, leaving the document without a stack
    // to resolve.
    document.body.style.removeProperty('--font-read-back');

    expect(resolveThemeFontStack('--font-read-back')).toBe(stack);
  });
});
