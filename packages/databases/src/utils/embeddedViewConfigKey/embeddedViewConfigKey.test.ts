import { describe, expect, it } from 'vitest';
import { embeddedViewConfigKey } from './embeddedViewConfigKey';

describe('embeddedViewConfigKey', () => {
  it('keys the config by element and view type', () => {
    expect(embeddedViewConfigKey('element_1', 'gallery')).toBe(
      'element_1:gallery',
    );
  });
});
