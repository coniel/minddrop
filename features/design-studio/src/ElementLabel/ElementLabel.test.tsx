import { afterEach, beforeEach, describe, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { render, screen } from '@minddrop/test-utils';
import {
  MockDatabaseDesignStudioProvider,
  cleanup,
  setup,
  usedProperty,
  usedPropertyDesignElement,
} from '../test-utils';
import { ElementLabel } from './ElementLabel';

const { textElement1 } = DesignFixtures;

describe('<ElementLabel />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders property name for property elements', () => {
    render(
      <MockDatabaseDesignStudioProvider>
        <ElementLabel element={usedPropertyDesignElement} />
      </MockDatabaseDesignStudioProvider>,
    );

    screen.getByText(usedProperty.name);
  });

  it('renders element name for non-property elements', () => {
    render(<ElementLabel element={textElement1} />);

    screen.getByText(`designs.text.name`);
  });
});
