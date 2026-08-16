import { Editable, Slate } from 'slate-react';
import { afterAll, afterEach, describe, expect, it } from 'vitest';
import { Ast, Element, LinkElement, ParagraphElement } from '@minddrop/ast';
import { render } from '@minddrop/test-utils';
import {
  registerBackendUtilsAdapter,
  unregisterBackendUtilsAdapter,
} from '@minddrop/utils';
import { EditorElementConfigs } from '../../EditorElementConfigs';
import { cleanup, createTestEditor } from '../../test-utils';
import { createRenderElement } from '../../utils';

const linkUrl = 'https://minddrop.app';

// The destinations opened through the backend, which opens them outside the
// app's own window
const opened: string[] = [];

registerBackendUtilsAdapter({
  getWebpageHtml: async () => '',
  openFile: async () => {},
  openUrl: async (url: string) => {
    opened.push(url);
  },
  showItemInFolder: async () => {},
});

const renderLink = () => {
  const content: Element[] = [
    Ast.generateElement<ParagraphElement>('paragraph', {
      children: [
        { text: '' },
        Ast.generateElement<LinkElement>('link', {
          url: linkUrl,
          children: [{ text: 'MindDrop' }],
        }),
        { text: '' },
      ],
    }),
  ];
  const editor = createTestEditor(content);

  return render(
    <Slate editor={editor} initialValue={content}>
      <Editable renderElement={createRenderElement(EditorElementConfigs)} />
    </Slate>,
  );
};

describe('LinkElementComponent', () => {
  afterEach(() => {
    opened.length = 0;
    cleanup();
  });

  afterAll(unregisterBackendUtilsAdapter);

  it('renders the link as an anchor to its destination', () => {
    const { getByRole } = renderLink();

    expect(getByRole('link')).toHaveAttribute('href', linkUrl);
  });

  it('opens the destination when pressed', () => {
    const { getByRole } = renderLink();

    getByRole('link').click();

    expect(opened).toEqual([linkUrl]);
  });

  it('does not navigate the app to the destination', () => {
    const { getByRole } = renderLink();
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });

    getByRole('link').dispatchEvent(click);

    // The anchor would otherwise take the app's own window to the page
    expect(click.defaultPrevented).toBe(true);
  });

  it('does not place the cursor in the link when pressed', () => {
    const { getByRole } = renderLink();
    const mouseDown = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    getByRole('link').dispatchEvent(mouseDown);

    expect(mouseDown.defaultPrevented).toBe(true);
  });
});
