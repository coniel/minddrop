import { describe, expect, it } from 'vitest';
import { DesignFixtures } from '../../test-utils';
import { Design } from '../../types';
import { reviveDesignDates } from './reviveDesignDates';

const { design_books } = DesignFixtures;

describe('reviveDesignDates', () => {
  it('revives the design and layout dates from ISO strings', () => {
    // Simulate the JSON round trip which stringifies dates
    const parsed = JSON.parse(JSON.stringify(design_books)) as Design;

    const revived = reviveDesignDates(parsed);

    expect(revived).toEqual(design_books);
    expect(revived.created).toBeInstanceOf(Date);
    expect(revived.lastModified).toBeInstanceOf(Date);
    expect(revived.layouts[0].created).toBeInstanceOf(Date);
    expect(revived.layouts[0].lastModified).toBeInstanceOf(Date);
  });
});
