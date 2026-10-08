import { afterEach, describe, expect, it } from 'vitest';
import { bodyDesignElement } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema } from '@minddrop/properties';
import { act, render, screen, waitFor } from '@minddrop/test-utils';
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

  it('focuses the document when auto focus is on', async () => {
    const { container } = render(
      <DesignPropertiesProvider
        properties={properties}
        values={{ Notes: 'The entry document.' }}
        onValueChange={() => {}}
        autoFocusEditor
      >
        <EditorElementRenderer element={editorElement} />
      </DesignPropertiesProvider>,
    );

    // Wait for the focus. The editor applies it on a timer.
    await waitFor(() => {
      expect(container.querySelector('[contenteditable="true"]')).toBe(
        document.activeElement,
      );
    });
  });

  it('leaves the document unfocused when auto focus is off', async () => {
    const { container } = render(
      <DesignPropertiesProvider
        properties={properties}
        values={{ Notes: 'The entry document.' }}
        onValueChange={() => {}}
      >
        <EditorElementRenderer element={editorElement} />
      </DesignPropertiesProvider>,
    );

    // Let the editor's focus timer elapse
    await act(() => new Promise((resolve) => setTimeout(resolve, 20)));

    expect(container.querySelector('[contenteditable="true"]')).not.toBe(
      document.activeElement,
    );
  });

  // Typing into the document and committing the title run on Slate's
  // input handling. happy-dom does not drive it, so what the editor
  // writes is left to the editor's own tests and to end-to-end runs.
  // These cover what the element decides: whether the document takes
  // input at all.
  it('renders the document editable when the property can be updated', () => {
    const { container } = render(
      <DesignPropertiesProvider
        properties={properties}
        values={{ Notes: 'The entry document.' }}
        onValueChange={() => {}}
      >
        <EditorElementRenderer element={editorElement} />
      </DesignPropertiesProvider>,
    );

    expect(container.querySelector('[contenteditable="true"]')).not.toBeNull();
  });

  it('renders the document read only without an update callback', () => {
    const { container } = render(
      <DesignPropertiesProvider
        properties={properties}
        values={{ Notes: 'The entry document.' }}
      >
        <EditorElementRenderer element={editorElement} />
      </DesignPropertiesProvider>,
    );

    expect(container.querySelector('[contenteditable="false"]')).not.toBeNull();
    expect(container.querySelector('[contenteditable="true"]')).toBeNull();
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

  it('sets the padding the document is held off the block edges by', () => {
    const { container } = render(
      <EditorElementRenderer
        element={{ ...editorElement, padding: { top: 16, left: 24 } }}
      />,
    );

    const viewport = container.querySelector<HTMLElement>(
      '.scroll-area-viewport',
    );

    // Set on the scrolling box rather than on the scroll area, so
    // the document scrolls through the padding instead of stopping
    // short of the block's edges.
    expect(viewport?.style.paddingTop).toBe('16px');
    expect(viewport?.style.paddingLeft).toBe('24px');
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

  it('reflects a changed title value', async () => {
    const { rerender } = render(
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

    rerender(
      <DesignPropertiesProvider
        properties={properties}
        values={{ Title: 'Renamed' }}
      >
        <EditorElementRenderer
          element={editorElement}
          childElements={[titleElement]}
        />
      </DesignPropertiesProvider>,
    );

    // The editor syncs the title into its document on the next tick
    expect(await screen.findByText('Renamed')).toBeInTheDocument();
    expect(screen.queryByText('The entry title')).toBeNull();
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
