import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LayoutNotFoundError } from '../errors';
import { getLayout } from '../getLayout';
import {
  DesignFixtures,
  MockFs,
  cleanup,
  mockDate,
  setup,
} from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { updateLayout } from './updateLayout';

const { design_books, layout_card_1 } = DesignFixtures;

describe('updateLayout', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('updates the layout and bumps its last modified date', async () => {
    const updated = await updateLayout(layout_card_1.id, { name: 'Compact' });

    expect(updated.name).toBe('Compact');
    expect(updated.lastModified).toEqual(mockDate);
    expect(getLayout(layout_card_1.id)).toEqual(updated);
  });

  it('persists the change through the parent design', async () => {
    // Remove the design file written by the fixture setup
    MockFs.clear();

    await updateLayout(layout_card_1.id, { name: 'Compact' });

    // The parent design file must be rewritten with the change
    const contents = MockFs.readTextFile(
      resolveDesignFilePath(design_books.id),
    );

    expect(contents).toContain('"Compact"');
  });

  it('throws when the layout does not exist', async () => {
    await expect(updateLayout('layout_missing', {})).rejects.toThrow(
      LayoutNotFoundError,
    );
  });
});
