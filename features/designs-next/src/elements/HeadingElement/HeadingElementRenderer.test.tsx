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

  it('applies the default level class without a level setting', () => {
    render(<HeadingElementRenderer element={headingElement} />);

    expect(screen.getByText('Project overview')).toHaveClass(
      'design-heading-element-level-2',
    );
  });

  it('applies the level class of the level setting', () => {
    render(
      <HeadingElementRenderer element={{ ...headingElement, level: 1 }} />,
    );

    expect(screen.getByText('Project overview')).toHaveClass(
      'design-heading-element-level-1',
    );
  });

  it('applies the text settings modifier classes', () => {
    render(
      <HeadingElementRenderer element={{ ...headingElement, bold: true }} />,
    );

    expect(screen.getByText('Project overview')).toHaveClass(
      'design-element-text-bold',
    );
  });
});
