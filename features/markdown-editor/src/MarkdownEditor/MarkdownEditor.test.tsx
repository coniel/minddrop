import { afterEach, describe, expect, it } from 'vitest';
import { Ast, Element } from '@minddrop/ast';
import { Events, OpenReferenceEventData } from '@minddrop/events';
import { fireEvent, render, screen, userEvent } from '@minddrop/test-utils';
import { Views } from '@minddrop/views';
import { PaneEditorsStore } from '../PaneEditorsStore';
import { resolvePaneEditor } from '../resolvePaneEditor';
import { cleanup } from '../test-utils';
import { MarkdownEditor } from './MarkdownEditor';

const viewAreaId = 'area';
const pane = 'main';
const paneKey = Views.resolvePaneKey(viewAreaId, pane);

function renderInPane(children: React.ReactNode) {
  return render(
    <Views.PaneProvider viewAreaId={viewAreaId} pane={pane}>
      {children}
    </Views.PaneProvider>,
  );
}

describe('<MarkdownEditor />', () => {
  afterEach(cleanup);

  it('registers its editor in the pane it renders in', () => {
    renderInPane(<MarkdownEditor initialValue="notes" />);

    expect(resolvePaneEditorMarkdown()).toBe('notes');
  });

  it("marks its editor as the pane's focused one when focused", () => {
    renderInPane(
      <>
        <MarkdownEditor initialValue="first" />
        <MarkdownEditor initialValue="second" />
      </>,
    );

    fireEvent.focus(screen.getAllByRole('textbox')[1]);

    expect(resolvePaneEditorMarkdown()).toBe('second');
  });

  it('unregisters its editor when it unmounts', () => {
    const { unmount } = renderInPane(<MarkdownEditor initialValue="notes" />);

    unmount();

    expect(resolvePaneEditor(paneKey)).toBeNull();
  });

  it('registers nothing outside a view pane', () => {
    render(<MarkdownEditor initialValue="notes" />);

    expect(PaneEditorsStore.getState().panes).toEqual({});
  });

  it('opens a pressed link from the pane it renders in', async () => {
    // The opened reference
    let opened: OpenReferenceEventData | null = null;

    Events.addListener(Events.events.OpenReference, 'test', (data) => {
      opened = data;
    });

    renderInPane(<MarkdownEditor initialValue="[[Paper#^abcd1234]]" />);

    await userEvent.click(screen.getByRole('link'));

    Events.removeListener(Events.events.OpenReference, 'test');

    expect(opened).toEqual({
      reference: 'Paper',
      fragment: '^abcd1234',
      viewAreaId,
      sourcePane: pane,
    });
  });

  it('leaves a pressed link to its own open handler', async () => {
    // The links the handler was given, and whether any was opened
    const handled: [string, string | undefined][] = [];
    let opened = false;

    Events.addListener(Events.events.OpenReference, 'test', () => {
      opened = true;
    });

    renderInPane(
      <MarkdownEditor
        initialValue="[[Paper#^abcd1234]]"
        onOpenWikilink={(reference, fragment) => {
          handled.push([reference, fragment]);
        }}
      />,
    );

    await userEvent.click(screen.getByRole('link'));

    // Let any open reference listener run
    await Events.tests.awaitAllListeners();
    Events.removeListener(Events.events.OpenReference, 'test');

    expect(handled).toEqual([['Paper', '^abcd1234']]);
    expect(opened).toBe(false);
  });
});

/**
 * Resolves the value of the pane's editor as Markdown. This tells the
 * rendered editors apart.
 *
 * @returns The editor's value as Markdown.
 *
 * @throws {Error} If the pane renders no editor.
 */
function resolvePaneEditorMarkdown(): string {
  // Resolve the pane's editor
  const editor = resolvePaneEditor(paneKey);

  // Check the pane renders an editor
  if (!editor) {
    throw new Error(`Pane "${paneKey}" renders no editor`);
  }

  // Serialize the editor's value as Markdown
  return Ast.toMarkdown(editor.children as Element[]);
}
