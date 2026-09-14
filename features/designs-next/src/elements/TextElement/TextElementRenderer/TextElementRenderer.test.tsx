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
    render(<TextElementRenderer element={{ ...textElement, italic: true }} />);

    expect(screen.getByText('A longer piece of body text.')).toHaveClass(
      'design-element-text-italic',
    );
  });

  it('sets the text at its size', () => {
    render(<TextElementRenderer element={{ ...textElement, fontSize: 18 }} />);

    expect(screen.getByText('A longer piece of body text.')).toHaveStyle({
      fontSize: '18px',
    });
  });

  it('sets the text at the default size without one', () => {
    render(<TextElementRenderer element={textElement} />);

    expect(screen.getByText('A longer piece of body text.')).toHaveStyle({
      fontSize: '14px',
    });
  });

  it('sets the text at its line height', () => {
    render(
      <TextElementRenderer element={{ ...textElement, lineHeight: 1.2 }} />,
    );

    expect(screen.getByText('A longer piece of body text.')).toHaveStyle({
      lineHeight: '1.2',
    });
  });

  it('sets the text at the default line height without one', () => {
    render(<TextElementRenderer element={textElement} />);

    expect(screen.getByText('A longer piece of body text.')).toHaveStyle({
      lineHeight: '1.4',
    });
  });

  it('sits the text against the edge it is aligned to', () => {
    render(
      <TextElementRenderer
        element={{ ...textElement, verticalAlign: 'bottom' }}
      />,
    );

    expect(screen.getByText('A longer piece of body text.')).toHaveClass(
      'design-element-text-vertical-align-bottom',
    );
  });

  it('sets the text in the weight it is given', () => {
    render(
      <TextElementRenderer element={{ ...textElement, fontWeight: 300 }} />,
    );

    expect(screen.getByText('A longer piece of body text.')).toHaveStyle({
      fontWeight: '300',
    });
  });
});
