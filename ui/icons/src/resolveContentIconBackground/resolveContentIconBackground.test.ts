import { describe, expect, it } from 'vitest';
import {
  backgroundContentIcon,
  backgroundContentIconString,
  contentIcon,
} from '../test-utils';
import { ContentIconBackground } from '../types';
import { resolveContentIconBackground } from './resolveContentIconBackground';

describe('resolveContentIconBackground', () => {
  it('returns the background if the icon is a content icon', () => {
    expect(resolveContentIconBackground(backgroundContentIcon)).toBe(
      ContentIconBackground.Solid,
    );
  });

  it('returns the background if the icon is a content icon string', () => {
    expect(resolveContentIconBackground(backgroundContentIconString)).toBe(
      ContentIconBackground.Solid,
    );
  });

  it('returns the default background if the icon has none', () => {
    expect(resolveContentIconBackground(contentIcon)).toBe(
      ContentIconBackground.None,
    );
  });

  it('returns undefined if the icon string is invalid', () => {
    expect(resolveContentIconBackground('foo')).toBeUndefined();
  });
});
