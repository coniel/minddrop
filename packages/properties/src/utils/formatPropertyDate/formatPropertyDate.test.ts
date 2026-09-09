import { describe, expect, it } from 'vitest';
import { formatDate } from '@minddrop/utils';
import { PropertySchema } from '../../types';
import { formatPropertyDate } from './formatPropertyDate';

const date = new Date('2026-09-10T12:00:00.000Z');
const dateProperty: PropertySchema = { type: 'date', name: 'Due' };

describe('formatPropertyDate', () => {
  it('falls back to the standard date format', () => {
    expect(formatPropertyDate(date, dateProperty)).toBe(formatDate(date));
  });

  it("formats in the property's own format and locale", () => {
    const property: PropertySchema = {
      ...dateProperty,
      format: { year: 'numeric' },
      locale: 'en-GB',
    };

    expect(formatPropertyDate(date, property)).toBe('2026');
  });

  it('falls back for a property which declares no format', () => {
    const property: PropertySchema = { type: 'created', name: 'Created' };

    expect(formatPropertyDate(date, property)).toBe(formatDate(date));
  });
});
