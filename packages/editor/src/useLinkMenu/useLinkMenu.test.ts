import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@minddrop/test-utils';
import {
  cleanup,
  createTestEditor,
  createTestEditorWithSelectedText,
  getLinks,
  getWikilinks,
  paragraphElement1,
} from '../test-utils';
import { EditorReference, ReferenceSource } from '../types';
import { useLinkMenu } from './useLinkMenu';

const references: EditorReference[] = [
  { reference: 'Book', label: 'Book', description: 'Books' },
  { reference: 'Today', label: 'Today', description: 'Notes' },
  { reference: 'Reading list', label: 'Reading list', description: 'Notes' },
];

// A source offering the first two references as recent and matching the
// third by its label
const source: ReferenceSource = {
  getRecent: () => references.slice(0, 2),
  search: (query) =>
    references.filter((reference) => reference.label.includes(query)),
};

describe('useLinkMenu', () => {
  afterEach(cleanup);

  it('offers no references without a source', () => {
    const editor = createTestEditorWithSelectedText('some text');
    const { result } = renderHook(() => useLinkMenu(editor));

    expect(result.current.references).toEqual([]);
  });

  it('offers the recent references before anything is typed', () => {
    const editor = createTestEditorWithSelectedText('some text');
    const { result } = renderHook(() => useLinkMenu(editor, source));

    expect(result.current.references).toEqual(references.slice(0, 2));
  });

  it('offers the references matching the query', () => {
    const editor = createTestEditorWithSelectedText('some text');
    const { result } = renderHook(() => useLinkMenu(editor, source));

    act(() => {
      result.current.setQuery('Reading');
    });

    expect(result.current.query).toBe('Reading');
    expect(result.current.references).toEqual([references[2]]);
  });

  it('makes a link to a web address from the selected text', () => {
    const editor = createTestEditorWithSelectedText('this site');
    const { result } = renderHook(() => useLinkMenu(editor, source));

    act(() => {
      result.current.open();
    });

    // The selection moves into the menu's field once it opens
    Transforms.deselect(editor);

    act(() => {
      result.current.selectUrl('https://example.com');
    });

    // The link is made over the text the menu was opened for
    expect(getLinks(editor)).toMatchObject([
      { url: 'https://example.com', children: [{ text: 'this site' }] },
    ]);
  });

  it('makes a link to a reference from the selected text', () => {
    const editor = createTestEditorWithSelectedText('this book');
    const { result } = renderHook(() => useLinkMenu(editor, source));

    act(() => {
      result.current.open();
    });

    Transforms.deselect(editor);

    act(() => {
      result.current.selectReference(references[0]);
    });

    // The linked phrase reads as itself rather than as what it points at
    expect(getWikilinks(editor)).toMatchObject([
      { reference: 'Book', children: [{ text: 'this book' }] },
    ]);
  });

  it('does not open over a collapsed selection', () => {
    const editor = createTestEditor([paragraphElement1]);
    const { result } = renderHook(() => useLinkMenu(editor, source));

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    act(() => {
      result.current.open();
    });

    // The menu holds no text to make a link from
    Transforms.deselect(editor);

    act(() => {
      result.current.selectUrl('https://example.com');
    });

    expect(getLinks(editor)).toEqual([]);
  });

  it('clears the query when closed', () => {
    const editor = createTestEditorWithSelectedText('some text');
    const { result } = renderHook(() => useLinkMenu(editor, source));

    act(() => {
      result.current.setQuery('Reading');
    });

    act(() => {
      result.current.close();
    });

    expect(result.current.query).toBe('');
    expect(result.current.anchor).toBeNull();
  });
});
