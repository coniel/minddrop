import { afterEach, beforeEach, describe, it } from 'vitest';
import { render, screen } from '@minddrop/test-utils';
import {
  cleanup,
  setup,
  usedProperty,
  usedPropertyDesignElement,
} from '../../test-utils';
import { PropertyElementLabel } from './PropertyElementLabel';

describe('<PropertyElementLabel />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the property name as the label', () => {
    render(<PropertyElementLabel element={usedPropertyDesignElement} />);

    screen.getByText(usedProperty.name);
  });
});
