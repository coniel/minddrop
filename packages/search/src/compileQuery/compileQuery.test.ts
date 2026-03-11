import { describe, expect, it } from 'vitest';
import { compileQuery } from './compileQuery';

describe('compileQuery', () => {
  describe('basic queries', () => {
    it('returns a default query when no filters or sorts', () => {
      const result = compileQuery([], []);

      expect(result.sql).toContain('SELECT e.id');
      expect(result.sql).toContain('ORDER BY e.last_modified DESC');
      expect(result.params).toEqual([]);
    });

    it('scopes to a database ID', () => {
      const result = compileQuery([], [], { databaseId: 'db-1' });

      expect(result.sql).toContain('WHERE e.database_id = ?');
      expect(result.params).toContain('db-1');
    });

    it('applies limit and offset', () => {
      const result = compileQuery([], [], { limit: 10, offset: 20 });

      expect(result.sql).toContain('LIMIT ?');
      expect(result.sql).toContain('OFFSET ?');
      expect(result.params).toContain(10);
      expect(result.params).toContain(20);
    });

    it('generates a count query without LIMIT/OFFSET', () => {
      const result = compileQuery([], [], { limit: 10, offset: 20 });

      expect(result.countSql).not.toContain('LIMIT');
      expect(result.countSql).not.toContain('OFFSET');
      expect(result.countSql).toContain('COUNT(*)');
    });
  });

  describe('core property filters', () => {
    it('filters title with equals', () => {
      const result = compileQuery(
        [{ property: 'title', operator: 'equals', value: 'My Entry' }],
        [],
      );

      expect(result.sql).toContain('e.title = ?');
      expect(result.params).toContain('My Entry');
    });

    it('filters title with contains', () => {
      const result = compileQuery(
        [{ property: 'title', operator: 'contains', value: 'test' }],
        [],
      );

      expect(result.sql).toContain('e.title LIKE ?');
      expect(result.params).toContain('%test%');
    });

    it('filters title with not-contains', () => {
      const result = compileQuery(
        [{ property: 'title', operator: 'not-contains', value: 'draft' }],
        [],
      );

      expect(result.sql).toContain('e.title NOT LIKE ?');
      expect(result.params).toContain('%draft%');
    });

    it('filters title with is-empty', () => {
      const result = compileQuery(
        [{ property: 'title', operator: 'is-empty' }],
        [],
      );

      expect(result.sql).toContain("(e.title IS NULL OR e.title = '')");
    });

    it('filters title with is-not-empty', () => {
      const result = compileQuery(
        [{ property: 'title', operator: 'is-not-empty' }],
        [],
      );

      expect(result.sql).toContain("(e.title IS NOT NULL AND e.title != '')");
    });

    it('filters created with before', () => {
      const date = new Date('2024-01-01');
      const result = compileQuery(
        [{ property: 'created', operator: 'before', value: date }],
        [],
      );

      expect(result.sql).toContain('e.created < ?');
      expect(result.params).toContain(date.getTime());
    });

    it('filters created with after', () => {
      const date = new Date('2024-01-01');
      const result = compileQuery(
        [{ property: 'created', operator: 'after', value: date }],
        [],
      );

      expect(result.sql).toContain('e.created > ?');
      expect(result.params).toContain(date.getTime());
    });
  });

  describe('dynamic property filters', () => {
    it('filters string property with equals', () => {
      const result = compileQuery(
        [{ property: 'status', operator: 'equals', value: 'active' }],
        [],
      );

      // Checks both scalar and multi-value tables via EXISTS
      expect(result.sql).toContain('entry_properties');
      expect(result.sql).toContain('entry_property_values');
      expect(result.sql).toContain('property_name = ?');
      expect(result.sql).toContain('value_text = ?');
      expect(result.params).toContain('status');
      expect(result.params).toContain('active');
    });

    it('filters string property with not-equals', () => {
      const result = compileQuery(
        [{ property: 'status', operator: 'not-equals', value: 'archived' }],
        [],
      );

      // Uses NOT EXISTS on both tables
      expect(result.sql).toContain('NOT EXISTS');
      expect(result.sql).toContain('entry_properties');
      expect(result.sql).toContain('entry_property_values');
      expect(result.params).toContain('status');
      expect(result.params).toContain('archived');
    });

    it('filters number property with equals', () => {
      const result = compileQuery(
        [{ property: 'rating', operator: 'equals', value: 5 }],
        [],
      );

      expect(result.sql).toContain('p0.value_number = ?');
      expect(result.params).toContain(5);
    });

    it('filters number property with greater-than', () => {
      const result = compileQuery(
        [{ property: 'priority', operator: 'greater-than', value: 3 }],
        [],
      );

      expect(result.sql).toContain('p0.value_number > ?');
      expect(result.params).toContain(3);
    });

    it('filters number property with less-than', () => {
      const result = compileQuery(
        [{ property: 'priority', operator: 'less-than', value: 3 }],
        [],
      );

      expect(result.sql).toContain('p0.value_number < ?');
    });

    it('filters boolean property with true', () => {
      const result = compileQuery(
        [{ property: 'published', operator: 'true', value: true }],
        [],
      );

      expect(result.sql).toContain('p0.value_integer = 1');
    });

    it('filters boolean property with false', () => {
      const result = compileQuery(
        [{ property: 'published', operator: 'false', value: false }],
        [],
      );

      expect(result.sql).toContain(
        '(p0.value_integer IS NULL OR p0.value_integer = 0)',
      );
    });

    it('filters dynamic property with is-empty', () => {
      const result = compileQuery(
        [{ property: 'notes', operator: 'is-empty' }],
        [],
      );

      // Checks both tables via NOT EXISTS
      expect(result.sql).toContain('NOT EXISTS');
      expect(result.sql).toContain('entry_properties');
      expect(result.sql).toContain('entry_property_values');
      expect(result.params).toContain('notes');
    });

    it('filters dynamic property with is-not-empty', () => {
      const result = compileQuery(
        [{ property: 'notes', operator: 'is-not-empty' }],
        [],
      );

      // Checks both tables via EXISTS
      expect(result.sql).toContain('EXISTS');
      expect(result.sql).toContain('entry_properties');
      expect(result.sql).toContain('entry_property_values');
      expect(result.params).toContain('notes');
    });

    it('filters date property with before', () => {
      const date = new Date('2024-06-01');
      const result = compileQuery(
        [{ property: 'dueDate', operator: 'before', value: date }],
        [],
      );

      expect(result.sql).toContain('p0.value_integer < ?');
      expect(result.params).toContain(date.getTime());
    });

    it('filters date property with after', () => {
      const date = new Date('2024-06-01');
      const result = compileQuery(
        [{ property: 'dueDate', operator: 'after', value: date }],
        [],
      );

      expect(result.sql).toContain('p0.value_integer > ?');
      expect(result.params).toContain(date.getTime());
    });
  });

  describe('multiple filters', () => {
    it('combines multiple filters with AND', () => {
      const result = compileQuery(
        [
          { property: 'title', operator: 'contains', value: 'test' },
          { property: 'status', operator: 'equals', value: 'active' },
        ],
        [],
      );

      expect(result.sql).toContain('e.title LIKE ?');
      expect(result.sql).toContain('value_text = ?');
      expect(result.sql).toContain(' AND ');
    });

    it('uses unique join aliases for each dynamic filter', () => {
      const result = compileQuery(
        [
          { property: 'priority', operator: 'greater-than', value: 3 },
          { property: 'rating', operator: 'less-than', value: 10 },
        ],
        [],
      );

      // Number filters still use JOINs with unique aliases
      expect(result.sql).toContain('entry_properties p0');
      expect(result.sql).toContain('entry_properties p1');
    });
  });

  describe('sorting', () => {
    it('sorts by core property ascending', () => {
      const result = compileQuery(
        [],
        [{ property: 'title', direction: 'ascending' }],
      );

      expect(result.sql).toContain('ORDER BY e.title ASC');
    });

    it('sorts by core property descending', () => {
      const result = compileQuery(
        [],
        [{ property: 'created', direction: 'descending' }],
      );

      expect(result.sql).toContain('ORDER BY e.created DESC');
    });

    it('sorts by dynamic property with a join', () => {
      const result = compileQuery(
        [],
        [{ property: 'status', direction: 'ascending' }],
      );

      expect(result.sql).toContain('LEFT JOIN entry_properties ps0');
      expect(result.sql).toContain('ORDER BY COALESCE(');
      expect(result.params).toContain('status');
    });

    it('sorts by multiple properties', () => {
      const result = compileQuery(
        [],
        [
          { property: 'title', direction: 'ascending' },
          { property: 'created', direction: 'descending' },
        ],
      );

      expect(result.sql).toContain('ORDER BY e.title ASC, e.created DESC');
    });
  });
});
