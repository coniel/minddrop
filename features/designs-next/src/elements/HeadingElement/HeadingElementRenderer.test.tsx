import { afterEach, describe, expect, it } from 'vitest';
import { coverDesignElement } from '@minddrop/designs-next/test-utils';
import { render, screen } from '@minddrop/test-utils';
import { cleanup } from '../../test-utils';
import { HeadingElement } from './HeadingElement.types';
import { HeadingElementConfig } from './HeadingElementConfig';
import { HeadingElementRenderer } from './HeadingElementRenderer';

// A heading element with static text content
const headingElement: HeadingElement = {
  ...coverDesignElement,
  type: HeadingElementConfig.type,
  text: 'Project overview',
};

describe('HeadingElementRenderer', () => {
  afterEach(cleanup);

  it('renders the element text', () => {
    render(<HeadingElementRenderer element={headingElement} />);

    expect(screen.getByText('Project overview')).toBeInTheDocument();
  });
});
