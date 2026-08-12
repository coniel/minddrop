import { describe, expect, it } from 'vitest';
import { joinClassNames } from './joinClassNames';

describe('joinClassNames', () => {
  it('combines the given class names', () => {
    expect(joinClassNames('card', 'card-selected')).toBe('card card-selected');
  });

  it('ignores absent class names', () => {
    expect(joinClassNames('card', undefined, null, false, 'wide')).toBe(
      'card wide',
    );
  });

  it('returns undefined when there are no class names', () => {
    // Undefined leaves the class attribute off entirely
    expect(joinClassNames()).toBeUndefined();
    expect(joinClassNames(undefined, false)).toBeUndefined();
  });
});
