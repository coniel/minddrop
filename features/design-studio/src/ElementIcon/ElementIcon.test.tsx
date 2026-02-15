import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@minddrop/test-utils';
import {
  MockDatabaseDesignStudioProvider,
  cleanup,
  setup,
  usedPropertyDesignElement,
} from '../test-utils';
import { ElementIcon } from './ElementIcon';

describe('<ElementIcon />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the property icon for property elements', () => {
    render(
      <MockDatabaseDesignStudioProvider>
        <ElementIcon element={usedPropertyDesignElement} />
      </MockDatabaseDesignStudioProvider>,
    );

    expect(screen.getByTestId('content-icon')).toHaveAttribute(
      'name',
      'shapes',
    );
  });
});
