import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Ast, Element } from '@minddrop/ast';
import { DatabaseEntries } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { InsertEditorReferenceEvent } from '@minddrop/editor';
import { createTestEditorWithText } from '@minddrop/editor/test-utils';
import { Events } from '@minddrop/events';
import { Views } from '@minddrop/views';
import { registerPaneEditor } from '../registerPaneEditor';
import { cleanup, setup } from '../test-utils';
import { initializeMarkdownEditorFeature } from './initializeMarkdownEditorFeature';

const { rootStorageEntry1 } = DatabaseFixtures;

const viewAreaId = 'area';
const pane = 'split';

// A fragment of the referenced entry. Stands for any fragment, which
// the feature passes through as given.
const fragment = '^abcd1234';

describe('initializeMarkdownEditorFeature', () => {
  let removeEventListeners: VoidFunction;

  beforeEach(() => {
    setup();

    removeEventListeners = initializeMarkdownEditorFeature();
  });

  afterEach(() => {
    removeEventListeners();
    cleanup();
  });

  it("inserts a quoted reference into the pane's editor", async () => {
    const editor = createTestEditorWithText('notes');
    const reference = DatabaseEntries.resolveReference(rootStorageEntry1.id);

    registerPaneEditor(Views.resolvePaneKey(viewAreaId, pane), editor);

    Events.dispatch(InsertEditorReferenceEvent, {
      viewAreaId,
      pane,
      reference,
      fragment,
      label: 'a quote',
      quote: true,
    });

    await vi.waitFor(() => {
      expect(Ast.toMarkdown(editor.children as Element[])).toContain(
        `> [[${reference}#${fragment}|a quote]]`,
      );
    });
  });

  it("inserts an inline reference into the pane's editor", async () => {
    const editor = createTestEditorWithText('notes ');
    const reference = DatabaseEntries.resolveReference(rootStorageEntry1.id);

    registerPaneEditor(Views.resolvePaneKey(viewAreaId, pane), editor);

    Events.dispatch(InsertEditorReferenceEvent, {
      viewAreaId,
      pane,
      reference,
      label: reference,
    });

    await vi.waitFor(() => {
      expect(Ast.toMarkdown(editor.children as Element[])).toContain(
        `notes [[${reference}]]`,
      );
    });
  });

  it('leaves editors in other panes alone', async () => {
    const editor = createTestEditorWithText('notes');
    const reference = DatabaseEntries.resolveReference(rootStorageEntry1.id);

    registerPaneEditor(Views.resolvePaneKey(viewAreaId, 'main'), editor);

    Events.dispatch(InsertEditorReferenceEvent, {
      viewAreaId,
      pane,
      reference,
      label: 'a quote',
      quote: true,
    });

    // Let the dispatch reach its listeners
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(Ast.toMarkdown(editor.children as Element[])).toBe('notes');
  });
});
