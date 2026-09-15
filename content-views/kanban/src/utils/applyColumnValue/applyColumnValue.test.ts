import { describe, expect, it } from 'vitest';
import { multiselectStatusProperty, statusProperty } from '../../test-utils';
import { applyColumnValue } from './applyColumnValue';

describe('applyColumnValue', () => {
  describe('single select', () => {
    it('takes the column value', () => {
      expect(applyColumnValue('Todo', statusProperty, 'Done')).toBe('Done');
    });

    it('clears the value in the no-value column', () => {
      expect(applyColumnValue('Todo', statusProperty, '')).toBeNull();
    });
  });

  describe('multi-select', () => {
    it('replaces the value the entry is grouped by', () => {
      expect(
        applyColumnValue(
          ['Blocked', 'Todo', 'Urgent'],
          multiselectStatusProperty,
          'Done',
        ),
      ).toEqual(['Blocked', 'Done', 'Urgent']);
    });

    it('adds the value when the entry is in no column', () => {
      expect(
        applyColumnValue(['Blocked'], multiselectStatusProperty, 'Done'),
      ).toEqual(['Blocked', 'Done']);
    });

    it('adds the value when the entry has no values', () => {
      expect(applyColumnValue(null, multiselectStatusProperty, 'Done')).toEqual(
        ['Done'],
      );
    });

    it('keeps the value in one place when the entry already holds it', () => {
      expect(
        applyColumnValue(['Todo', 'Done'], multiselectStatusProperty, 'Done'),
      ).toEqual(['Done']);
    });

    it('clears only the grouped value in the no-value column', () => {
      expect(
        applyColumnValue(
          ['Blocked', 'Todo', 'Urgent'],
          multiselectStatusProperty,
          '',
        ),
      ).toEqual(['Blocked', 'Urgent']);
    });
  });
});
