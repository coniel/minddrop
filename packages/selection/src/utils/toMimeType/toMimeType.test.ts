import { describe, expect, it } from 'vitest';
import { MindDropDataKey } from '../../constants';
import { toMimeType } from './toMimeType';

describe('toMimeType', () => {
  it('returns the correct MIME type', () => {
    expect(toMimeType('entries')).toBe(`${MindDropDataKey}.entries+json`);
  });

  it('ommits the +json suffix if isJson is false', () => {
    expect(toMimeType('entries', false)).toBe(`${MindDropDataKey}.entries`);
  });
});
