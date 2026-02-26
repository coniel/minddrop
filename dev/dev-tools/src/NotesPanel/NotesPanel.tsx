import React, { useEffect } from 'react';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import { IconButton, ScrollArea } from '@minddrop/ui-primitives';
import { Note } from '../types';
import './NotesPanel.css';

function focusEditorToEnd() {
  const editorElement = document.querySelector<HTMLElement>(
    '.notes-panel-editor .editor',
  );

  if (!editorElement) {
    return;
  }

  editorElement.focus();

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(editorElement);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

interface NotesPanelProps {
  notes: Note[];
  openNoteIds: number[];
  activeNoteId: number | null;
  onNoteChange: (noteId: number, content: string) => void;
  onCloseNote: (noteId: number) => void;
  onSelectNote: (noteId: number) => void;
  onCreateNote: () => void;
}

function getNoteTitle(note: Note): string {
  const firstLine = note.content.split('\n')[0];
  const stripped = firstLine.replace(/^#+\s*/, '').trim();

  return stripped || 'Untitled';
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  notes,
  openNoteIds,
  activeNoteId,
  onNoteChange,
  onCloseNote,
  onSelectNote,
  onCreateNote,
}) => {
  const openNotes = openNoteIds
    .map((id) => notes.find((note) => note.id === id))
    .filter((note): note is Note => note !== undefined);

  const activeNote = notes.find((note) => note.id === activeNoteId) ?? null;

  useEffect(() => {
    if (activeNote === null) {
      return;
    }

    setTimeout(focusEditorToEnd, 0);
  }, [activeNote?.id]);

  return (
    <div className="notes-panel">
      <div className="notes-panel-tabs">
        {openNotes.map((note) => (
          <div
            key={note.id}
            role="tab"
            className={`notes-panel-tab${note.id === activeNoteId ? ' notes-panel-tab-active' : ''}`}
            onClick={() => onSelectNote(note.id)}
          >
            <span className="notes-panel-tab-title">{getNoteTitle(note)}</span>
            <IconButton
              icon="x"
              label="Close note"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                onCloseNote(note.id);
              }}
            />
          </div>
        ))}
        <IconButton
          icon="plus"
          label="New note"
          size="sm"
          onClick={onCreateNote}
        />
      </div>

      {activeNote !== null ? (
        <ScrollArea className="notes-panel-editor">
          <MarkdownEditor
            key={activeNote.id}
            initialValue={activeNote.content}
            onDebouncedChange={(content) =>
              onNoteChange(activeNote.id, content)
            }
          />
        </ScrollArea>
      ) : (
        <div className="notes-panel-empty">
          <span>No note open. Select a note or create a new one.</span>
        </div>
      )}
    </div>
  );
};
