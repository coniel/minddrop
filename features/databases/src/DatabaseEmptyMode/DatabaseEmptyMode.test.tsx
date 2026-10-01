import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntries } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { dropNative } from '@minddrop/drag-and-drop/test-utils';
import { render, screen, waitFor } from '@minddrop/test-utils';
import { MockFs, cleanup, setup } from '../test-utils';
import { DatabaseEmptyMode } from './DatabaseEmptyMode';

const { objectDatabase } = DatabaseFixtures;

describe('<DatabaseEmptyMode />', () => {
  beforeEach(() => {
    setup();

    // Load the entry serializers the created entries are written with
    DatabaseFixtures.setup(MockFs);
  });

  afterEach(async () => {
    DatabaseFixtures.cleanup();
    await cleanup();
  });

  it('renders the empty placeholder', () => {
    const { container } = render(
      <DatabaseEmptyMode databaseId={objectDatabase.id} />,
    );

    expect(container.querySelector('.database-empty-mode')).not.toBeNull();
    screen.getByText('databases.empty.title');
  });

  it('creates entries from dropped content in the database', async () => {
    const { container } = render(
      <DatabaseEmptyMode databaseId={objectDatabase.id} />,
    );

    dropNative(container.querySelector('.database-empty-mode')!, {
      'text/plain': 'Hello',
    });

    await waitFor(() => {
      expect(
        DatabaseEntries.getAll(objectDatabase.id).some(
          (entry) => entry.properties.Content === 'Hello',
        ),
      ).toBe(true);
    });
  });
});
