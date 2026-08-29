import { describe, expect, it } from 'vitest';
import { createI18nKeyBuilder } from './createI18nKeyBuilder';

describe('createI18nKeyBuilder', () => {
  it('prepends the prefix to the key', () => {
    // Create a builder for the typography key prefix
    const i18nKey = createI18nKeyBuilder('designs.typography.');

    // Should return the full prefixed key
    expect(i18nKey('font-family.sans')).toBe(
      'designs.typography.font-family.sans',
    );
  });

  it('joins the key and sub-key with a dot', () => {
    // Create a builder for the typography key prefix
    const i18nKey = createI18nKeyBuilder('designs.typography.');

    // Should append the sub-key to the prefixed key
    expect(i18nKey('font-weight', 'inherit')).toBe(
      'designs.typography.font-weight.inherit',
    );
  });

  it('accepts numeric sub-keys', () => {
    // Create a builder for the typography key prefix
    const i18nKey = createI18nKeyBuilder('designs.typography.');

    // Should stringify the numeric sub-key into the key
    expect(i18nKey('font-weight', 400)).toBe(
      'designs.typography.font-weight.400',
    );
  });
});
