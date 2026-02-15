import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@minddrop/test-utils';
import {
  MockDatabaseDesignStudioProvider,
  cleanup,
  setup,
  unusedProperty,
  usedProperty,
} from '../test-utils';
import { AvailableDatabaseProperties } from './AvailableDatabaseProperties';

describe('<AvailableDatabaseProperties />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders unused properties', () => {
    render(
      <MockDatabaseDesignStudioProvider>
        <AvailableDatabaseProperties />
      </MockDatabaseDesignStudioProvider>,
    );

    // Render the unused properties
    screen.getByText(unusedProperty.name);
    // Does not render the used property
    expect(screen.queryByText(usedProperty.name)).toBeNull();
  });
});
