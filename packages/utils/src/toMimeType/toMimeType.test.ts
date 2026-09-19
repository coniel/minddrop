import { describe, expect, it } from 'vitest';
import { MindDropDataKey } from '../constants';
import { toMimeType } from './toMimeType';

describe('toMimeType', () => {
  it('returns the MindDrop MIME type of a data type', () => {
    expect(toMimeType('entries')).toBe(`${MindDropDataKey}.entries+json`);
  });

  it('omits the +json suffix if isJson is false', () => {
    expect(toMimeType('entries', false)).toBe(`${MindDropDataKey}.entries`);
  });
});
