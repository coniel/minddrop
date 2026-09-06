import { describe, expect, it } from 'vitest';
import { DatabaseEntryTemplate } from '../../types';
import { sortDatabaseEntryTemplates } from './sortDatabaseEntryTemplates';

// Minimal templates used to exercise the sort, created a day apart
// in A, B, C order.
const templateA: DatabaseEntryTemplate = {
  id: 'database-entry-template_a',
  database: 'database_1',
  name: 'Alpha',
  properties: {},
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
};

const templateB: DatabaseEntryTemplate = {
  id: 'database-entry-template_b',
  database: 'database_1',
  name: 'Beta',
  properties: {},
  created: new Date('2024-01-02T00:00:00.000Z'),
  lastModified: new Date('2024-01-02T00:00:00.000Z'),
};

const templateC: DatabaseEntryTemplate = {
  id: 'database-entry-template_c',
  database: 'database_1',
  name: 'Gamma',
  properties: {},
  created: new Date('2024-01-03T00:00:00.000Z'),
  lastModified: new Date('2024-01-03T00:00:00.000Z'),
};

describe('sortDatabaseEntryTemplates', () => {
  it('sorts by creation date, oldest first, when there is no order', () => {
    expect(
      sortDatabaseEntryTemplates([templateC, templateA, templateB]),
    ).toEqual([templateA, templateB, templateC]);
  });

  it('sorts by the manual order', () => {
    expect(
      sortDatabaseEntryTemplates(
        [templateA, templateB, templateC],
        [templateC.id, templateA.id, templateB.id],
      ),
    ).toEqual([templateC, templateA, templateB]);
  });

  it('sorts unordered templates by creation date after ordered ones', () => {
    expect(
      sortDatabaseEntryTemplates(
        [templateB, templateA, templateC],
        [templateC.id],
      ),
    ).toEqual([templateC, templateA, templateB]);
  });
});
