import { afterEach, beforeEach, describe, it } from 'vitest';
import { render, screen } from '@minddrop/test-utils';
import {
  MockDatabaseDesignStudioProvider,
  cleanup,
  setup,
  usedProperty,
  usedPropertyDesignElement,
} from '../test-utils';
import { PropertyElementLabel } from './PropertyElementLabel';

describe('<PropertyElementLabel />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the property name as the label', () => {
    render(
      <MockDatabaseDesignStudioProvider>
        <PropertyElementLabel element={usedPropertyDesignElement} />
      </MockDatabaseDesignStudioProvider>,
    );

    screen.getByText(usedProperty.name);
  });
});
