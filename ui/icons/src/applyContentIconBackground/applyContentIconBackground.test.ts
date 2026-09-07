import { describe, expect, it } from 'vitest';
import {
  backgroundContentIcon,
  backgroundContentIconString,
  contentIcon,
  contentIconString,
} from '../test-utils';
import { ContentIconBackground } from '../types';
import { applyContentIconBackground } from './applyContentIconBackground';

describe('applyContentIconBackground', () => {
  it('applies the specified background to the content icon', () => {
    const result = applyContentIconBackground(
      contentIcon,
      ContentIconBackground.Solid,
    );

    expect(result).toEqual(backgroundContentIcon);
  });

  it('leaves the default background out of the icon', () => {
    const result = applyContentIconBackground(
      backgroundContentIcon,
      ContentIconBackground.None,
    );

    expect(result).toEqual(contentIcon);
    expect(result).not.toHaveProperty('background');
  });

  it('returns invalid icon strings unchanged', () => {
    const result = applyContentIconBackground(
      'foo',
      ContentIconBackground.Solid,
    );

    expect(result).toBe('foo');
  });

  it('supports stringified icons', () => {
    const result = applyContentIconBackground(
      contentIconString,
      ContentIconBackground.Solid,
    );

    expect(result).toBe(backgroundContentIconString);
  });
});
