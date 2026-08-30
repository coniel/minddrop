import { Editor as SlateEditor, Text } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@minddrop/test-utils';
import { cleanup, createTestEditorWithSelectedText } from '../test-utils';
import { Editor } from '../types';
import { useSelectionToolbar } from './useSelectionToolbar';

// Returns the text nodes of the first block
function getTextNodes(editor: Editor): Text[] {
  return Array.from(
    SlateEditor.nodes<Text>(editor, {
      at: [0],
      match: Text.isText,
    }),
  ).map(([node]) => node);
}

describe('useSelectionToolbar', () => {
  afterEach(cleanup);

  it('shows no toolbar until a change is handled', () => {
    const editor = createTestEditorWithSelectedText('some text');
    const { result } = renderHook(() => useSelectionToolbar(editor, true));

    expect(result.current.anchor).toBeNull();
    expect(result.current.activeMarks).toEqual([]);
  });

  it('marks the selected text', () => {
    const editor = createTestEditorWithSelectedText('some text');
    const { result } = renderHook(() => useSelectionToolbar(editor, true));

    act(() => {
      result.current.toggleMark('bold');
    });

    // The mark lands on the text and the toolbar shows it as active
    expect(getTextNodes(editor)).toMatchObject([{ bold: true }]);
    expect(result.current.activeMarks).toEqual(['bold']);
  });

  it('removes a mark the selection already carries', () => {
    const editor = createTestEditorWithSelectedText('some text');
    const { result } = renderHook(() => useSelectionToolbar(editor, true));

    act(() => {
      result.current.toggleMark('bold');
    });

    act(() => {
      result.current.toggleMark('bold');
    });

    // The mark is gone from the text
    expect(getTextNodes(editor).some((node) => 'bold' in node)).toBe(false);
    expect(result.current.activeMarks).toEqual([]);
  });

  it('clears the toolbar when the editor is not focused', () => {
    const editor = createTestEditorWithSelectedText('some text');
    const { result } = renderHook(() => useSelectionToolbar(editor, true));

    act(() => {
      result.current.toggleMark('bold');
    });

    act(() => {
      result.current.handleChange();
    });

    // The editor is not focused, so the toolbar has nothing to follow
    expect(result.current.activeMarks).toEqual([]);
    expect(result.current.anchor).toBeNull();
  });

  it('clears the toolbar while disabled', () => {
    const editor = createTestEditorWithSelectedText('some text');
    const { result } = renderHook(() => useSelectionToolbar(editor, false));

    act(() => {
      result.current.toggleMark('bold');
    });

    act(() => {
      result.current.handleChange();
    });

    expect(result.current.activeMarks).toEqual([]);
  });
});
