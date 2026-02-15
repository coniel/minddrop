import { afterEach, beforeEach, describe, it } from 'vitest';
import { render, screen } from '@minddrop/test-utils';
import {
  cleanup,
  flatTextElement1,
  setup,
  usedProperty,
  usedPropertyDesignElement,
} from '../test-utils';
import { ElementLabel } from './ElementLabel';

describe('<ElementLabel />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders property name for property elements', () => {
    render(<ElementLabel element={usedPropertyDesignElement} />);

    screen.getByText(usedProperty.name);
  });

  it('renders element name for non-property elements', () => {
    render(<ElementLabel element={flatTextElement1} />);

    screen.getByText(`designs.text.name`);
  });
});
