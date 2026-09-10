import { describe, expect, it } from 'vitest';
import { titleDesignElement } from '@minddrop/designs-next/test-utils';
import { resolveTextSettingsClass } from './resolveTextSettingsClass';

describe('resolveTextSettingsClass', () => {
  it('returns an empty string without active settings', () => {
    expect(resolveTextSettingsClass(titleDesignElement)).toBe('');
  });

  it('resolves the italic modifier', () => {
    expect(
      resolveTextSettingsClass({ ...titleDesignElement, italic: true }),
    ).toBe('design-element-text-italic');
  });

  it('resolves the alignment modifier', () => {
    expect(
      resolveTextSettingsClass({ ...titleDesignElement, textAlign: 'center' }),
    ).toBe('design-element-text-align-center');
  });

  it('leaves left aligned text unmodified', () => {
    expect(
      resolveTextSettingsClass({ ...titleDesignElement, textAlign: 'left' }),
    ).toBe('');
  });
});
