import { afterEach, beforeEach, describe, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { setup } from '../test-utils';
import { DatabaseDesignsMenu } from './DatabaseDesignsMenu';

const { objectDatabase } = DatabaseFixtures;

describe('<DatabaseDesignsMenu />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the database designs menu', () => {
    render(<DatabaseDesignsMenu databaseId={objectDatabase.id} />);

    screen.getByText(objectDatabase.designs[0].name);
  });
});
