import { afterEach, describe, expect, it } from 'vitest';
import { ElementConfigsStore } from '../ElementConfigsStore';
import { getElementType } from '../getElementType';
import { boxElementConfig } from '../test-utils';
import { registerElementType } from './registerElementType';

describe('registerElementType', () => {
  afterEach(() => {
    ElementConfigsStore.clear();
  });

  it('registers an element type config', () => {
    registerElementType(boxElementConfig);

    expect(getElementType(boxElementConfig.type)).toBe(boxElementConfig);
  });
});
