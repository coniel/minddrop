import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@minddrop/test-utils';
import {
  MockDatabaseDesignStudioProvider,
  cleanup,
  setup,
  usedPropertyDesignElement,
} from '../test-utils';
import { PropertyElementIcon } from './PropertyElementIcon';

describe('<PropertyElementIcon />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the property icon', () => {
    render(
      <MockDatabaseDesignStudioProvider>
        <PropertyElementIcon element={usedPropertyDesignElement} />
      </MockDatabaseDesignStudioProvider>,
    );

    expect(screen.getByTestId('content-icon')).toHaveAttribute(
      'name',
      'shapes',
    );
  });
});
