import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseView } from './DatabaseView';

const { objectDatabase } = DatabaseFixtures;

describe('<DatabaseView />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("renders the database's title", () => {
    const { getByText } = render(
      <DatabaseView databaseId={objectDatabase.id} />,
    );

    getByText(objectDatabase.name);
  });

  it('renders a not found message when the database does not exist', () => {
    const { getByText } = render(<DatabaseView databaseId="missing" />);

    getByText('Database not found.');
  });

  it('renders the database views', () => {
    const { container } = render(
      <DatabaseView databaseId={objectDatabase.id} />,
    );

    expect(container.querySelector('.database-view')).not.toBeNull();
  });
});
