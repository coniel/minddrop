import { describe, expect, it } from 'vitest';
import { formatDate } from '@minddrop/utils';
import { PropertySchema } from '../../types';
import { formatPropertyValue } from './formatPropertyValue';

const textProperty: PropertySchema = { type: 'text', name: 'Summary' };
const numberProperty: PropertySchema = { type: 'number', name: 'Count' };
const dateProperty: PropertySchema = { type: 'date', name: 'Due' };
const createdProperty: PropertySchema = { type: 'created', name: 'Created' };
const selectProperty: PropertySchema = {
  type: 'select',
  name: 'Status',
  options: [],
};
const imageProperty: PropertySchema = { type: 'image', name: 'Cover' };
const fileProperty: PropertySchema = { type: 'file', name: 'Attachment' };
const toggleProperty: PropertySchema = { type: 'toggle', name: 'Done' };
const iconProperty: PropertySchema = { type: 'icon', name: 'Icon' };

describe('formatPropertyValue', () => {
  it('returns text values as they are', () => {
    expect(formatPropertyValue('A summary', textProperty)).toBe('A summary');
  });

  it('stringifies numbers', () => {
    expect(formatPropertyValue(12, numberProperty)).toBe('12');
  });

  it('keeps a zero value', () => {
    expect(formatPropertyValue(0, numberProperty)).toBe('0');
  });

  it('runs multiple values together', () => {
    expect(formatPropertyValue(['To do', 'Urgent'], selectProperty)).toBe(
      'To do, Urgent',
    );
  });

  it('formats dates', () => {
    const date = new Date('2026-09-10T12:00:00.000Z');

    expect(formatPropertyValue(date, dateProperty)).toBe(formatDate(date));
  });

  it("formats a date in the property's own format", () => {
    const date = new Date('2026-09-10T12:00:00.000Z');
    const property: PropertySchema = {
      ...dateProperty,
      type: 'date',
      format: { year: 'numeric' },
      locale: 'en-GB',
    };

    expect(formatPropertyValue(date, property)).toBe('2026');
  });

  it('formats metadata timestamps', () => {
    const date = new Date('2026-09-10T12:00:00.000Z');

    expect(formatPropertyValue(date, createdProperty)).toBe(formatDate(date));
  });

  it('returns null for an empty value', () => {
    expect(formatPropertyValue(null, textProperty)).toBeNull();
    expect(formatPropertyValue('', textProperty)).toBeNull();
    expect(formatPropertyValue([], selectProperty)).toBeNull();
  });

  it('names the file of an image or file value', () => {
    expect(formatPropertyValue('cover.png', imageProperty)).toBe('cover.png');
    expect(
      formatPropertyValue('/workspace/db/entry/report.pdf', fileProperty),
    ).toBe('report.pdf');
  });

  it('names each file of a multi-file value', () => {
    expect(
      formatPropertyValue(
        ['/workspace/db/report.pdf', 'notes.md'],
        fileProperty,
      ),
    ).toBe('report.pdf, notes.md');
  });

  it('returns null for property types with no text form', () => {
    expect(formatPropertyValue('lucide:file:default', iconProperty)).toBeNull();
    expect(formatPropertyValue(true, toggleProperty)).toBeNull();
  });
});
