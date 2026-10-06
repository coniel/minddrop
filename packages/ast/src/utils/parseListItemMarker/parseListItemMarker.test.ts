import { describe, expect, it } from 'vitest';
import { parseListItemMarker } from './parseListItemMarker';

describe('parseListItemMarker', () => {
  it("parses a bullet's content column and content", () => {
    expect(parseListItemMarker('- Item', 0)).toEqual({
      contentColumn: 2,
      content: 'Item',
    });
    expect(parseListItemMarker('* Item', 0)?.contentColumn).toBe(2);
    expect(parseListItemMarker('+ Item', 0)?.contentColumn).toBe(2);
  });

  it("parses an ordered marker's content column", () => {
    expect(parseListItemMarker('1. Item', 0)?.contentColumn).toBe(3);
    expect(parseListItemMarker('10) Item', 0)?.contentColumn).toBe(4);
  });

  it("offsets the content column by the marker's indentation", () => {
    expect(parseListItemMarker('- Item', 4)?.contentColumn).toBe(6);
  });

  it('counts up to four spaces after the marker', () => {
    expect(parseListItemMarker('-    Item', 0)).toEqual({
      contentColumn: 5,
      content: 'Item',
    });
  });

  it('counts one space after a marker followed by five or more', () => {
    expect(parseListItemMarker('-     Code', 0)).toEqual({
      contentColumn: 2,
      content: '    Code',
    });
  });

  it('counts one space after a marker ending the line', () => {
    expect(parseListItemMarker('-', 2)).toEqual({
      contentColumn: 4,
      content: '',
    });
  });

  it('counts a tab after the marker to the next tab stop', () => {
    expect(parseListItemMarker('-\tItem', 0)).toEqual({
      contentColumn: 4,
      content: 'Item',
    });
    expect(parseListItemMarker('-\tItem', 2)?.contentColumn).toBe(4);
  });

  it('parses nothing from text which is not a list marker', () => {
    expect(parseListItemMarker('-Item', 0)).toBeNull();
    expect(parseListItemMarker('**Bold**', 0)).toBeNull();
    expect(parseListItemMarker('1.5 apples', 0)).toBeNull();
    expect(parseListItemMarker('1234567890. Item', 0)).toBeNull();
  });
});
