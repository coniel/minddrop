import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ElementConfigsStore } from '../ElementConfigsStore';
import { ElementTypeNotRegisteredError } from '../errors';
import { registerElementType } from '../registerElementType';
import { boxElementConfig } from '../test-utils';
import { getElementType } from './getElementType';

describe('getElementType', () => {
  beforeEach(() => {
    registerElementType(boxElementConfig);
  });

  afterEach(() => {
    ElementConfigsStore.clear();
  });

  it('returns the requested element type config', () => {
    expect(getElementType(boxElementConfig.type)).toBe(boxElementConfig);
  });

  it('throws if the element type is not registered', () => {
    expect(() => getElementType('unknown')).toThrow(
      ElementTypeNotRegisteredError,
    );
  });

  it('returns null if the type is not registered and throwOnNotFound is false', () => {
    expect(getElementType('unknown', false)).toBeNull();
  });
});
