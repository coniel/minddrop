import { describe, expect, it } from 'vitest';
import { ContentColors } from '@minddrop/ui-theme';
import { resolveNewOptionColor } from './resolveNewOptionColor';

describe('resolveNewOptionColor', () => {
  it('picks a colour no option uses yet', () => {
    // Use every colour except the last one
    const options = ContentColors.slice(0, -1).map((color) => ({
      value: color,
      color,
    }));

    expect(resolveNewOptionColor(options)).toBe(
      ContentColors[ContentColors.length - 1],
    );
  });

  it('falls back to a used colour when all are used', () => {
    // Use every colour
    const options = ContentColors.map((color) => ({ value: color, color }));

    const color = resolveNewOptionColor(options);

    expect(ContentColors.includes(color)).toBe(true);
  });
});
