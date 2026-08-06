import { describe, expect, it } from 'vitest';
import { pruneEmptyPropertyValues } from './pruneEmptyPropertyValues';

describe('pruneEmptyPropertyValues', () => {
  it('removes undefined, null, empty string, and empty array values', () => {
    expect(
      pruneEmptyPropertyValues({
        // @ts-expect-error Testing undefined value
        Undefined: undefined,
        Null: null,
        EmptyString: '',
        EmptyArray: [],
        Text: 'value',
      }),
    ).toEqual({ Text: 'value' });
  });

  it('keeps false and 0 values', () => {
    expect(
      pruneEmptyPropertyValues({
        Toggle: false,
        Number: 0,
      }),
    ).toEqual({ Toggle: false, Number: 0 });
  });
});
