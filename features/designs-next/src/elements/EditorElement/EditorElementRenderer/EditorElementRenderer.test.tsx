import { afterEach, describe, expect, it } from 'vitest';
import { bodyDesignElement } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema } from '@minddrop/properties';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import { cleanup } from '../../../test-utils';
import { EditorElement } from '../EditorElement.types';
import { EditorElementConfig } from '../EditorElementConfig';
import { EditorElementRenderer } from './EditorElementRenderer';

const editorElement: EditorElement = {
  ...bodyDesignElement,
  type: EditorElementConfig.type,
  property: 'Notes',
};

const properties: PropertiesSchema = [{ type: 'content', name: 'Notes' }];

describe('EditorElementRenderer', () => {
  afterEach(cleanup);

  it("renders the mapped property's document", () => {
    render(
      <DesignPropertiesProvider
        properties={properties}
        values={{ Notes: 'The entry document.' }}
      >
        <EditorElementRenderer element={editorElement} />
      </DesignPropertiesProvider>,
    );

    expect(screen.getByText('The entry document.')).toBeInTheDocument();
  });

  it('applies the text settings modifier classes', () => {
    const { container } = render(
      <EditorElementRenderer element={{ ...editorElement, italic: true }} />,
    );

    expect(container.querySelector('.design-editor-element')).toHaveClass(
      'design-element-text-italic',
    );
  });

  it('sets the text styles the editor renders in', () => {
    const { container } = render(
      <EditorElementRenderer
        element={{ ...editorElement, fontSize: 18, lineHeight: 1.6 }}
      />,
    );

    const wrapper = container.querySelector<HTMLElement>(
      '.design-editor-element',
    );

    // Set as custom properties, which is how the editor takes
    // them.
    expect(wrapper?.style.getPropertyValue('--editor-font-size')).toBe('18px');
    expect(wrapper?.style.getPropertyValue('--editor-line-height')).toBe('1.6');
  });
});
