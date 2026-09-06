import { describe, expect, it } from 'vitest';
import { contentIcon, contentIconString } from '../test-utils';
import { applyContentIconColor } from './applyContentIconColor';

describe('applyContentIconColor', () => {
  it('applies the specified color to the content icon', () => {
    const color = 'red';
    const result = applyContentIconColor(contentIcon, color);

    expect(result).toEqual({
      ...contentIcon,
      color,
    });
  });

  it('returns invalid icon strings unchanged', () => {
    const result = applyContentIconColor('foo', 'red');

    expect(result).toBe('foo');
  });

  it('supports stringified icons', () => {
    const color = 'blue';
    const result = applyContentIconColor(contentIconString, color);

    expect(result).toEqual(
      contentIconString.split(':').slice(0, 2).join(':') + `:${color}`,
    );
  });
});
