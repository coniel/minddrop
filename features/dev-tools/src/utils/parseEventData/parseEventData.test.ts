import { describe, expect, it } from 'vitest';
import { parseEventData } from './parseEventData';

describe('parseEventData', () => {
  it('parses empty text as no data', () => {
    expect(parseEventData('   ')).toEqual({ valid: true, data: undefined });
  });

  it('parses JSON objects and arrays', () => {
    expect(parseEventData('{ "id": "db_1" }')).toEqual({
      valid: true,
      data: { id: 'db_1' },
    });
    expect(parseEventData('[1, 2]')).toEqual({ valid: true, data: [1, 2] });
  });

  it('parses JSON primitives', () => {
    expect(parseEventData('"text"')).toEqual({ valid: true, data: 'text' });
    expect(parseEventData('42')).toEqual({ valid: true, data: 42 });
  });

  it('parses text whose quotes were substituted', () => {
    expect(parseEventData('{ “id”: “db_1” }')).toEqual({
      valid: true,
      data: { id: 'db_1' },
    });
  });

  it('keeps typographic quotes within valid text', () => {
    expect(parseEventData('"it’s here"')).toEqual({
      valid: true,
      data: 'it’s here',
    });
  });

  it('reports invalid JSON', () => {
    expect(parseEventData('{ id: }')).toEqual({
      valid: false,
      data: undefined,
    });
  });
});
