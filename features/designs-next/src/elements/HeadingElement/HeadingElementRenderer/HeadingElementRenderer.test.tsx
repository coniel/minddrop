import { afterEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
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

  it('scales the font with the block height', () => {
    const { rerender } = render(
      <HeadingElementRenderer element={{ ...headingElement, rowSpan: 4 }} />,
    );

    // The font size of a four unit tall heading
    const small = parseFloat(
      screen.getByText('Project overview').style.fontSize,
    );

    rerender(
      <HeadingElementRenderer element={{ ...headingElement, rowSpan: 8 }} />,
    );

    // The font size of a heading twice as tall
    const large = parseFloat(
      screen.getByText('Project overview').style.fontSize,
    );

    // The letters fill the block without the room the font keeps
    // above them, so the font is larger than the block's height.
    expect(small).toBeGreaterThan(4 * Designs.constants.UnitPixelSize);
    expect(large).toBeCloseTo(small * 2, 3);
  });

  it('holds a single line at a fixed height', () => {
    render(
      <HeadingElementRenderer
        element={{ ...headingElement, naturalHeight: false }}
      />,
    );

    expect(screen.getByText('Project overview')).toHaveClass(
      'design-heading-element-single-line',
    );
  });

  it('wraps at a natural height', () => {
    render(
      <HeadingElementRenderer
        element={{ ...headingElement, naturalHeight: true }}
      />,
    );

    expect(screen.getByText('Project overview')).not.toHaveClass(
      'design-heading-element-single-line',
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
