import React from 'react';
import { useSlateStatic } from 'slate-react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render } from '@minddrop/test-utils';
import { EditorBlockElementConfigsStore } from '../../BlockElementTypeConfigsStore';
import { RichTextEditor } from '../../RichTextEditor';
import {
  cleanup,
  headingElement1,
  headingElement1PlainText,
  paragraphElement1,
  paragraphElement1PlainText,
  setup,
} from '../../test-utils';
import { BlockElementProps, Editor } from '../../types';
import { getBlockFromDomNode } from './getBlockFromDomNode';

// Editor instance captured by the probe element component
let capturedEditor: Editor;

/**
 * Renders as a plain block while capturing the editor instance so
 * tests can resolve blocks against it.
 */
const EditorProbeComponent: React.FC<BlockElementProps> = ({
  attributes,
  children,
}) => {
  capturedEditor = useSlateStatic() as Editor;

  return <div {...attributes}>{children}</div>;
};

describe('getBlockFromDomNode', () => {
  beforeEach(() => {
    setup();

    // Register the editor probe element type
    EditorBlockElementConfigsStore.add({
      type: 'editor-probe',
      component: EditorProbeComponent,
    });
  });

  afterEach(cleanup);

  // Renders an editor containing a paragraph and a heading, along
  // with a probe element which captures the editor instance.
  const renderEditor = () =>
    render(
      <div>
        <RichTextEditor
          initialValue={[
            { type: 'editor-probe', children: [{ text: '' }] },
            paragraphElement1,
            headingElement1,
          ]}
        />
        <span>outside</span>
      </div>,
    );

  it('resolves the block containing the node', () => {
    const { getByText } = renderEditor();

    // The text node inside the paragraph block
    const textNode = getByText(paragraphElement1PlainText).firstChild;

    const block = getBlockFromDomNode(capturedEditor, textNode);

    expect(block?.element).toMatchObject({ type: 'paragraph' });
    expect(block?.path).toEqual([1]);
  });

  it('resolves the block from a deeply nested node', () => {
    const { getByText } = renderEditor();

    const block = getBlockFromDomNode(
      capturedEditor,
      getByText(headingElement1PlainText),
    );

    expect(block?.element).toMatchObject({ type: 'heading' });
    expect(block?.path).toEqual([2]);
  });

  it('returns the block’s DOM node', () => {
    const { getByText } = renderEditor();

    const block = getBlockFromDomNode(
      capturedEditor,
      getByText(paragraphElement1PlainText),
    );

    expect(block?.domNode.textContent).toBe(paragraphElement1PlainText);
  });

  it('returns null for a node outside the editor', () => {
    const { getByText } = renderEditor();

    expect(
      getBlockFromDomNode(capturedEditor, getByText('outside')),
    ).toBeNull();
  });

  it('returns null without a node', () => {
    renderEditor();

    expect(getBlockFromDomNode(capturedEditor, null)).toBeNull();
  });
});
