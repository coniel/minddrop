import { describe, expect, it } from 'vitest';
import { titleDesignElement } from '@minddrop/designs-next/test-utils';
import { resolveTextSettingsClass } from './resolveTextSettingsClass';

describe('resolveTextSettingsClass', () => {
  it('returns an empty string without active settings', () => {
    expect(resolveTextSettingsClass(titleDesignElement)).toBe('');
  });

  it('resolves the family modifier', () => {
    expect(
      resolveTextSettingsClass({ ...titleDesignElement, fontFamily: 'mono' }),
    ).toBe('design-element-text-family-mono');
  });

  it('leaves sans text unmodified', () => {
    expect(
      resolveTextSettingsClass({ ...titleDesignElement, fontFamily: 'sans' }),
    ).toBe('');
  });

  it('resolves the italic modifier', () => {
    expect(
      resolveTextSettingsClass({ ...titleDesignElement, italic: true }),
    ).toBe('design-element-text-italic');
  });

  it('resolves the decoration modifiers', () => {
    expect(
      resolveTextSettingsClass({
        ...titleDesignElement,
        underline: true,
        strikethrough: true,
      }),
    ).toBe('design-element-text-underline design-element-text-strikethrough');
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

  it('resolves the vertical alignment modifier', () => {
    expect(
      resolveTextSettingsClass({
        ...titleDesignElement,
        verticalAlign: 'middle',
      }),
    ).toBe('design-element-text-vertical-align-middle');
  });

  it('leaves top aligned text unmodified', () => {
    expect(
      resolveTextSettingsClass({ ...titleDesignElement, verticalAlign: 'top' }),
    ).toBe('');
  });
});
