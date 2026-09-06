import { describe, expect, it } from 'vitest';
import { stringifyIcon } from '../stringifyIcon';
import { contentIcon } from '../test-utils';
import { resolveContentIconColor } from './resolveContentIconColor';

describe('resolveContentIconColor', () => {
  it('returns the color if the icon is a content icon', () => {
    expect(resolveContentIconColor(contentIcon)).toBe(contentIcon.color);
  });

  it('returns the color if the icon is a content icon string', () => {
    expect(resolveContentIconColor(stringifyIcon(contentIcon))).toBe(
      contentIcon.color,
    );
  });

  it('returns undefined if the icon string is invalid', () => {
    expect(resolveContentIconColor('foo')).toBeUndefined();
  });
});
