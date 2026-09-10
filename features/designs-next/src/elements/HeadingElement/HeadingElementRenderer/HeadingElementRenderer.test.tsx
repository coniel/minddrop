import { afterEach, describe, expect, it } from 'vitest';
import { coverDesignElement } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema } from '@minddrop/properties';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import { cleanup } from '../../../test-utils';
import { HeadingElement } from '../HeadingElement.types';
import { HeadingElementConfig } from '../HeadingElementConfig';
import { HeadingElementRenderer } from './HeadingElementRenderer';

// A heading element with its own text content
const headingElement: HeadingElement = {
  ...coverDesignElement,
  type: HeadingElementConfig.type,
  content: 'Project overview',
};

const properties: PropertiesSchema = [{ type: 'title', name: 'Title' }];

describe('HeadingElementRenderer', () => {
  afterEach(cleanup);

  it('renders the element text', () => {
    render(<HeadingElementRenderer element={headingElement} />);

    expect(screen.getByText('Project overview')).toBeInTheDocument();
  });

  it("renders the mapped property's value in place of the text", () => {
    render(
      <DesignPropertiesProvider
        properties={properties}
        values={{ Title: 'The entry title' }}
      >
        <HeadingElementRenderer
          element={{ ...headingElement, property: 'Title' }}
        />
      </DesignPropertiesProvider>,
    );

    expect(screen.getByText('The entry title')).toBeInTheDocument();
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
