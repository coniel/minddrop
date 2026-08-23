import { describe, expect, it } from 'vitest';
import { TextPropertyElementConfig } from '../../property-element-configs';
import { getPropertyElementVariant } from './getPropertyElementVariant';

describe('getPropertyElementVariant', () => {
  it('resolves the selected presentation variant', () => {
    const variant = getPropertyElementVariant(
      TextPropertyElementConfig,
      'quote',
    );

    expect(variant.id).toBe('quote');
  });

  it('falls back to the default variant without a selection', () => {
    const variant = getPropertyElementVariant(TextPropertyElementConfig);

    expect(variant.id).toBe(TextPropertyElementConfig.defaultVariant);
  });

  it('falls back to the default variant on an unknown selection', () => {
    const variant = getPropertyElementVariant(
      TextPropertyElementConfig,
      'unknown',
    );

    expect(variant.id).toBe(TextPropertyElementConfig.defaultVariant);
  });
});
