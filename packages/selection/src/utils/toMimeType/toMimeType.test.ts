import { describe, expect, it } from 'vitest';
import { MINDDROP_DATA_KEY } from '../../constants';
import { toMimeType } from './toMimeType';

describe('toMimeType', () => {
  it('returns the correct MIME type', () => {
    expect(toMimeType('entries')).toBe(`${MINDDROP_DATA_KEY}.entries+json`);
  });

  it('ommits the +json suffix if isJson is false', () => {
    expect(toMimeType('entries', false)).toBe(`${MINDDROP_DATA_KEY}.entries`);
  });
});
