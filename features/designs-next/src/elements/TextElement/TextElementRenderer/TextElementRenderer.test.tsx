import { afterEach, describe, expect, it } from 'vitest';
import { bodyDesignElement } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema } from '@minddrop/properties';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import { cleanup } from '../../../test-utils';
import { TextElement } from '../TextElement.types';
import { TextElementConfig } from '../TextElementConfig';
import { TextElementRenderer } from './TextElementRenderer';

// A text element with its own text content
const textElement: TextElement = {
  ...bodyDesignElement,
  type: TextElementConfig.type,
  content: 'A longer piece of body text.',
};

const properties: PropertiesSchema = [{ type: 'text', name: 'Summary' }];

describe('TextElementRenderer', () => {
  afterEach(cleanup);

  it('renders the element text', () => {
    render(<TextElementRenderer element={textElement} />);

    expect(
      screen.getByText('A longer piece of body text.'),
    ).toBeInTheDocument();
  });

  it("renders the mapped property's value in place of the text", () => {
    render(
      <DesignPropertiesProvider
        properties={properties}
        values={{ Summary: 'The entry summary.' }}
      >
        <TextElementRenderer
          element={{ ...textElement, property: 'Summary' }}
        />
      </DesignPropertiesProvider>,
    );

    expect(screen.getByText('The entry summary.')).toBeInTheDocument();
  });

  it('falls back to the static text when the property has no value', () => {
    render(
      <DesignPropertiesProvider properties={properties} values={{}}>
        <TextElementRenderer
          element={{ ...textElement, property: 'Summary' }}
        />
      </DesignPropertiesProvider>,
    );

    expect(
      screen.getByText('A longer piece of body text.'),
    ).toBeInTheDocument();
  });

  it('applies the text settings modifier classes', () => {
    render(
      <TextElementRenderer
        element={{ ...textElement, bold: true, italic: true }}
      />,
    );

    const text = screen.getByText('A longer piece of body text.');

    expect(text).toHaveClass('design-element-text-bold');
    expect(text).toHaveClass('design-element-text-italic');
  });
});
