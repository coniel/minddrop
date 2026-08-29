import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MATCH_HIGHLIGHT_END, MATCH_HIGHLIGHT_START } from '../../constants';
import { cleanup, seedDatabase, seedEntries, setup } from '../../test-utils';
import { findMatchedProperties } from './findMatchedProperties';

// A text value long enough (over 80 characters) to trigger snippeting
const longText =
  'one two three four five six seven eight nine ten spice eleven twelve thirteen fourteen fifteen sixteen';

// Wraps text in the highlight markers for expected values
function marked(text: string): string {
  return `${MATCH_HIGHLIGHT_START}${text}${MATCH_HIGHLIGHT_END}`;
}

describe('findMatchedProperties', () => {
  beforeEach(() => {
    setup();

    // Seed an entry with scalar, multi-value, and long text properties
    seedDatabase({ id: 'database-1', name: 'Books' });
    seedEntries('database-1', [
      {
        id: 'entry-1',
        title: 'Dune',
        properties: [
          { name: 'Link', type: 'url', value: 'https://herbert.example.com' },
          { name: 'Tags', type: 'select', value: ['epic tales', 'epic saga'] },
          { name: 'Review', type: 'text', value: longText },
        ],
      },
    ]);
  });

  afterEach(cleanup);

  it('returns an empty list when no property matches', () => {
    expect(findMatchedProperties('entry-1', ['zebra'])).toEqual([]);
  });

  it('returns short matching values highlighted in full', () => {
    expect(findMatchedProperties('entry-1', ['herbert'])).toEqual([
      {
        name: 'Link',
        type: 'url',
        value: `https://${marked('herbert')}.example.com`,
      },
    ]);
  });

  it('groups multi-value matches under one property, comma-joined', () => {
    expect(findMatchedProperties('entry-1', ['epic'])).toEqual([
      {
        name: 'Tags',
        type: 'select',
        value: `${marked('epic')} tales, ${marked('epic')} saga`,
      },
    ]);
  });

  it('returns a snippet for long text values', () => {
    expect(findMatchedProperties('entry-1', ['spice'])).toEqual([
      {
        name: 'Review',
        type: 'text',
        value: `six seven eight nine ten ${marked('spice')} eleven twelve thirteen fourteen fifteen`,
      },
    ]);
  });
});
