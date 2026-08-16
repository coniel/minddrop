import { Editable, Slate } from 'slate-react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  Ast,
  CodeElement,
  DefinitionElement,
  Element,
  HtmlElement,
  ImageElement,
  LinkElement,
  ParagraphElement,
  UnsupportedElement,
} from '@minddrop/ast';
import { render } from '@minddrop/test-utils';
import { EditorElementConfigs } from '../EditorElementConfigs';
import { cleanup, createTestEditor } from '../test-utils';
import { thematicBreakElement1 } from '../test-utils/editor.data';
import { createRenderElement } from '../utils';

const renderEditor = (content: Element[]) => {
  const editor = createTestEditor(content);

  return render(
    <Slate editor={editor} initialValue={content}>
      <Editable renderElement={createRenderElement(EditorElementConfigs)} />
    </Slate>,
  );
};

// A paragraph containing a single inline element
const paragraphContaining = (inline: Element): ParagraphElement =>
  Ast.generateElement<ParagraphElement>('paragraph', {
    children: [{ text: '' }, inline, { text: '' }],
  });

describe('default element configs', () => {
  afterEach(cleanup);

  describe('blocks', () => {
    it('renders a thematic break as a rule', () => {
      const { container } = renderEditor([thematicBreakElement1]);

      expect(
        container.querySelector('.thematic-break-element-rule'),
      ).not.toBeNull();
    });

    it('renders a code block as its source', () => {
      const { getByText } = renderEditor([
        Ast.generateElement<CodeElement>('code', {
          lang: 'ts',
          children: [{ text: 'const a = 1;' }],
        }),
      ]);

      expect(getByText('const a = 1;')).not.toBeNull();
    });

    it('renders an HTML block as its source', () => {
      const { getByText } = renderEditor([
        Ast.generateElement<HtmlElement>('html', { value: '<hr />' }),
      ]);

      expect(getByText('<hr />')).not.toBeNull();
    });

    it('renders a definition as its label and destination', () => {
      const { getByText } = renderEditor([
        Ast.generateElement<DefinitionElement>('definition', {
          identifier: 'ref',
          url: 'https://minddrop.app',
        }),
      ]);

      expect(getByText('https://minddrop.app')).not.toBeNull();
    });

    it('renders an unmodelled construct as its source', () => {
      const { getByText } = renderEditor([
        Ast.generateElement<UnsupportedElement>('unsupported', {
          value: ':::note',
        }),
      ]);

      expect(getByText(':::note')).not.toBeNull();
    });
  });

  describe('inlines', () => {
    it('renders a link as an anchor', () => {
      const { container } = renderEditor([
        paragraphContaining(
          Ast.generateElement<LinkElement>('link', {
            url: 'https://minddrop.app',
            children: [{ text: 'MindDrop' }],
          }),
        ),
      ]);

      expect(container.querySelector('a.link-element')).not.toBeNull();
    });

    it('renders an image', () => {
      const { container } = renderEditor([
        paragraphContaining(
          Ast.generateElement<ImageElement>('image', {
            url: 'https://minddrop.app/logo.png',
            alt: 'Logo',
          }),
        ),
      ]);

      expect(container.querySelector('img.image-element-image')).not.toBeNull();
    });

    it('does not draw containers around an inline element', () => {
      const { container } = renderEditor([
        paragraphContaining(
          Ast.generateElement<LinkElement>('link', {
            url: 'https://minddrop.app',
            children: [{ text: 'MindDrop' }],
          }),
        ),
      ]);

      expect(container.querySelector('.block-frames')).toBeNull();
    });
  });
});
