import { afterEach, describe, expect, it } from 'vitest';
import { bodyDesignElement } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema } from '@minddrop/properties';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import { cleanup } from '../../../test-utils';
import { EditorTitleElement } from '../../EditorTitleElement';
import { EditorElement } from '../EditorElement.types';
import { EditorElementConfig } from '../EditorElementConfig';
import { EditorElementRenderer } from './EditorElementRenderer';

const editorElement: EditorElement = {
  ...bodyDesignElement,
  type: EditorElementConfig.type,
  property: 'Notes',
};

const properties: PropertiesSchema = [
  { type: 'content', name: 'Notes' },
  { type: 'title', name: 'Title' },
];

// The element filling the editor's title slot
const titleElement: EditorTitleElement = {
  ...bodyDesignElement,
  id: 'element_title_slot',
  type: 'editor-title',
  rowSpan: 12,
  parent: editorElement.id,
  slot: 'title',
  property: 'Title',
};

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

  it('applies the text settings the editor inherits as styles', () => {
    const { container } = render(
      <EditorElementRenderer element={{ ...editorElement, italic: true }} />,
    );

    expect(container.querySelector('.design-editor-element')).toHaveStyle({
      fontStyle: 'italic',
    });
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

  it("renders the title slot's mapped value as the document title", () => {
    render(
      <DesignPropertiesProvider
        properties={properties}
        values={{ Title: 'The entry title' }}
      >
        <EditorElementRenderer
          element={editorElement}
          childElements={[titleElement]}
        />
      </DesignPropertiesProvider>,
    );

    expect(screen.getByText('The entry title')).toBeInTheDocument();
  });

  it('renders no title while the slot is empty', () => {
    const { container } = render(
      <EditorElementRenderer element={editorElement} />,
    );

    expect(container.querySelector('.title-element')).toBeNull();
  });

  it("sets the title in the slot element's own text styles", () => {
    const styledTitle: EditorTitleElement = {
      ...titleElement,
      fontSize: 28,
      italic: true,
    };

    const { container } = render(
      <DesignPropertiesProvider properties={properties} values={{}}>
        <EditorElementRenderer
          element={editorElement}
          childElements={[styledTitle]}
        />
      </DesignPropertiesProvider>,
    );

    const title = container.querySelector<HTMLElement>('.title-element');

    expect(title).toHaveStyle({ fontStyle: 'italic', fontSize: '28px' });
  });
});
