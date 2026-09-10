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
});
