import { describe, expect, it } from 'vitest';
import { titleDesignElement } from '@minddrop/designs-next/test-utils';
import { resolveTextSettingsClass } from './resolveTextSettingsClass';

describe('resolveTextSettingsClass', () => {
  it('returns an empty string without active settings', () => {
    expect(resolveTextSettingsClass(titleDesignElement)).toBe('');
  });

  it('resolves the bold modifier', () => {
    expect(
      resolveTextSettingsClass({ ...titleDesignElement, bold: true }),
    ).toBe('design-element-text-bold');
  });

  it('resolves the italic modifier', () => {
    expect(
      resolveTextSettingsClass({ ...titleDesignElement, italic: true }),
    ).toBe('design-element-text-italic');
  });

  it('combines active modifiers', () => {
    expect(
      resolveTextSettingsClass({
        ...titleDesignElement,
        bold: true,
        italic: true,
      }),
    ).toBe('design-element-text-bold design-element-text-italic');
  });
});
