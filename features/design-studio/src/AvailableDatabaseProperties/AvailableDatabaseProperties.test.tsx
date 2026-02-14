import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { DesignFixtures } from '@minddrop/designs';
import { render, screen } from '@minddrop/test-utils';
import {
  MockDatabaseDesignStudioProvider,
  cleanup,
  setup,
} from '../test-utils';
import { AvailableDatabaseProperties } from './AvailableDatabaseProperties';

const { objectDatabase } = DatabaseFixtures;
const { cardDesign1 } = DesignFixtures;

describe('<AvailableDatabaseProperties />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders unused properties', () => {
    const usedProperty = objectDatabase.properties[0];

    // Add one of the database's properties to the design
    Databases.Store.update(objectDatabase.id, {
      designs: [
        {
          ...cardDesign1,
          tree: {
            ...cardDesign1.tree,
            children: [
              ...cardDesign1.tree.children,
              {
                id: 'child-1',
                type: 'text-property',
                property: usedProperty.name,
                style: {},
              },
            ],
          },
        },
      ],
    });

    render(
      <MockDatabaseDesignStudioProvider>
        <AvailableDatabaseProperties />
      </MockDatabaseDesignStudioProvider>,
    );

    // Render the unused properties
    screen.getByText(objectDatabase.properties[1].name);
    // Does not render the used property
    expect(screen.queryByText(usedProperty.name)).toBeNull();
  });
});
