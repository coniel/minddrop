import {
  InsertEditorReferenceEvent,
  focusEditor,
  insertReferenceQuote,
  insertWikilink,
} from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { Views } from '@minddrop/views';
import { resolvePaneEditor } from '../resolvePaneEditor';

// The ID the feature's event listeners are registered under
const EventListenerId = 'markdown-editor-feature';

/**
 * Initializes the markdown editor feature.
 *
 * @returns A cleanup function which removes the event listeners.
 */
export function initializeMarkdownEditorFeature(): VoidFunction {
  // Insert a reference into the editor of the pane it is sent to
  Events.addListener(InsertEditorReferenceEvent, EventListenerId, (data) => {
    // Resolve the pane's editor
    const editor = resolvePaneEditor(
      Views.resolvePaneKey(data.viewAreaId, data.pane),
    );

    // Check the pane renders an editor. Without one there is nowhere
    // to insert into.
    if (!editor) {
      return;
    }

    // Insert the reference as a quote or an inline link
    if (data.quote) {
      insertReferenceQuote(editor, data.reference, data.label, data.fragment);
    } else {
      insertWikilink(editor, data.reference, {
        label: data.label,
        fragment: data.fragment,
      });
    }

    // Focus the editor
    focusEditor(editor);
  });

  // Remove the listener
  return () => {
    Events.removeListener(InsertEditorReferenceEvent, EventListenerId);
  };
}
