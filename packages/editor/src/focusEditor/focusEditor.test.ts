import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, render } from '@minddrop/test-utils';
import { RichTextEditor } from '../RichTextEditor';
import { cleanup, createTestEditor, paragraphElement1 } from '../test-utils';
import { Editor } from '../types';
import { focusEditor } from './focusEditor';

describe('focusEditor', () => {
  afterEach(cleanup);

  it('focuses the editable area', () => {
    const editorRef = React.createRef<Editor>();
    const { getByRole } = render(
      React.createElement(RichTextEditor, {
        initialValue: [paragraphElement1],
        editorRef,
      }),
    );
    const editor = editorRef.current;

    if (!editor) {
      throw new Error('The editor was not handed to the ref');
    }

    act(() => {
      focusEditor(editor);
    });

    expect(document.activeElement).toBe(getByRole('textbox'));
  });

  it('does nothing for an editor which is not rendered', () => {
    const editor = createTestEditor();

    expect(() => focusEditor(editor)).not.toThrow();
  });
});
